import errno
import fcntl
import os
import pty
import signal
import struct
import subprocess
import termios
import time
from dataclasses import dataclass, field
from pathlib import Path
from threading import Lock, Thread


@dataclass
class PtySession:
    master_fd: int
    process: subprocess.Popen
    started_at: float
    buffer: bytearray = field(default_factory=bytearray)
    dropped_output: bool = False
    exit_code: int | None = None
    running: bool = True


class PtySessionManager:
    def __init__(
        self,
        max_buffer_bytes: int,
        max_lifetime_seconds: int,
    ) -> None:
        self._max_buffer_bytes = max_buffer_bytes
        self._max_lifetime_seconds = max_lifetime_seconds
        self._lock = Lock()
        self._sessions: dict[str, PtySession] = {}

    @staticmethod
    def _set_window_size(file_descriptor: int, rows: int, cols: int) -> None:
        size = struct.pack("HHHH", rows, cols, 0, 0)
        fcntl.ioctl(file_descriptor, termios.TIOCSWINSZ, size)

    @staticmethod
    def _terminate_process(process: subprocess.Popen) -> None:
        if process.poll() is not None:
            return
        try:
            os.killpg(process.pid, signal.SIGTERM)
            process.wait(timeout=1)
        except (ProcessLookupError, subprocess.TimeoutExpired):
            try:
                os.killpg(process.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass

    def start(
        self,
        key: str,
        command: list[str],
        cwd: Path,
        rows: int,
        cols: int,
        environment: dict[str, str],
    ) -> None:
        self.stop(key)
        master_fd, slave_fd = pty.openpty()

        try:
            self._set_window_size(slave_fd, rows, cols)
            process = subprocess.Popen(
                command,
                cwd=str(cwd),
                env=environment,
                stdin=slave_fd,
                stdout=slave_fd,
                stderr=slave_fd,
                start_new_session=True,
                close_fds=True,
            )
        except Exception:
            os.close(master_fd)
            os.close(slave_fd)
            raise
        finally:
            try:
                os.close(slave_fd)
            except OSError:
                pass

        session = PtySession(
            master_fd=master_fd,
            process=process,
            started_at=time.monotonic(),
        )
        with self._lock:
            self._sessions[key] = session

        Thread(
            target=self._read_output,
            args=(key, session),
            daemon=True,
            name=f"pty-reader-{process.pid}",
        ).start()

    def _read_output(self, key: str, session: PtySession) -> None:
        try:
            while True:
                try:
                    chunk = os.read(session.master_fd, 8192)
                except OSError as exc:
                    if exc.errno in {errno.EBADF, errno.EIO}:
                        break
                    raise
                if not chunk:
                    break

                with self._lock:
                    if self._sessions.get(key) is not session:
                        break
                    session.buffer.extend(chunk)
                    overflow = len(session.buffer) - self._max_buffer_bytes
                    if overflow > 0:
                        del session.buffer[:overflow]
                        session.dropped_output = True
        finally:
            exit_code = session.process.wait()
            with self._lock:
                if self._sessions.get(key) is session:
                    session.exit_code = exit_code
                    session.running = False
            try:
                os.close(session.master_fd)
            except OSError:
                pass

    def poll(self, key: str) -> dict[str, object] | None:
        with self._lock:
            session = self._sessions.get(key)
            if session is None:
                return None
            expired = (
                time.monotonic() - session.started_at
                > self._max_lifetime_seconds
            )

        if expired:
            self._terminate_process(session.process)

        with self._lock:
            session = self._sessions.get(key)
            if session is None:
                return None
            output = bytes(session.buffer)
            session.buffer.clear()
            result = {
                "output": output,
                "running": session.running,
                "exitCode": session.exit_code,
                "droppedOutput": session.dropped_output,
                "expired": expired,
            }
            session.dropped_output = False
            if not session.running:
                self._sessions.pop(key, None)
            return result

    def write(self, key: str, data: bytes) -> bool:
        with self._lock:
            session = self._sessions.get(key)
            if session is None or not session.running:
                return False
            master_fd = session.master_fd

        try:
            os.write(master_fd, data)
            return True
        except OSError as exc:
            if exc.errno in {errno.EBADF, errno.EIO}:
                return False
            raise

    def resize(self, key: str, rows: int, cols: int) -> bool:
        with self._lock:
            session = self._sessions.get(key)
            if session is None or not session.running:
                return False
            master_fd = session.master_fd
            process = session.process

        self._set_window_size(master_fd, rows, cols)
        try:
            os.killpg(process.pid, signal.SIGWINCH)
        except ProcessLookupError:
            return False
        return True

    def stop(self, key: str) -> None:
        with self._lock:
            session = self._sessions.pop(key, None)
        if session is None:
            return

        self._terminate_process(session.process)
        try:
            os.close(session.master_fd)
        except OSError:
            pass
