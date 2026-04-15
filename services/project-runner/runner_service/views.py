import json
import os
import shutil
import subprocess
import base64
import hmac
import logging
import time
from datetime import datetime, timezone
from pathlib import Path
from tempfile import mkdtemp
from threading import Lock
from contextlib import contextmanager

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

PORT = int(os.getenv("PORT", "8080"))
WORKDIR_BASE = Path(os.getenv("WORKDIR_BASE", "/tmp/runner-workspaces"))
MAX_FILE_SIZE_BYTES = int(
    os.getenv("MAX_FILE_SIZE_BYTES", str(8 * 1024 * 1024))
)
RUNNER_SHARED_TOKEN = os.getenv("RUNNER_SHARED_TOKEN", "").strip()
MAX_REQUESTS_PER_ID_PER_MINUTE = int(
    os.getenv("MAX_REQUESTS_PER_ID_PER_MINUTE", "120")
)
RATE_WINDOW_SECONDS = int(os.getenv("RATE_WINDOW_SECONDS", "60"))
MAX_CONCURRENT_REQUESTS_PER_ID = int(
    os.getenv("MAX_CONCURRENT_REQUESTS_PER_ID", "6")
)
MAX_GLOBAL_CONCURRENT_REQUESTS = int(
    os.getenv("MAX_GLOBAL_CONCURRENT_REQUESTS", "64")
)
PENDING_REQUEST_TTL_SECONDS = int(
    os.getenv("PENDING_REQUEST_TTL_SECONDS", "30")
)
MAX_OUTPUT_BYTES = int(os.getenv("MAX_OUTPUT_BYTES", str(256 * 1024)))
BUILD_TIMEOUT_MS = int(os.getenv("BUILD_TIMEOUT_MS", "30000"))
RUN_TIMEOUT_MS = int(os.getenv("RUN_TIMEOUT_MS", "10000"))
MAX_BUILD_ARGS = int(os.getenv("MAX_BUILD_ARGS", "8"))
MAX_RUN_ARGS = int(os.getenv("MAX_RUN_ARGS", "32"))

logger = logging.getLogger("runner_service")

PROJECTS = {
    "push_swap": {
        "repoUrl": os.getenv(
            "PROJECT_REPO_PUSH_SWAP",
            "https://github.com/AkJaum/push_swap.git",
        ),
        "branch": os.getenv("PROJECT_BRANCH_PUSH_SWAP", "main"),
    },
    "get_next_line": {
        "repoUrl": os.getenv(
            "PROJECT_REPO_GET_NEXT_LINE",
            "https://github.com/AkJaum/get_next_line.git",
        ),
        "branch": os.getenv("PROJECT_BRANCH_GET_NEXT_LINE", "main"),
    },
    "printf": {
        "repoUrl": os.getenv(
            "PROJECT_REPO_PRINTF",
            "https://github.com/AkJaum/ft_printf.git",
        ),
        "branch": os.getenv("PROJECT_BRANCH_PRINTF", "main"),
    },
    "libft": {
        "repoUrl": os.getenv(
            "PROJECT_REPO_LIBFT",
            "https://github.com/AkJaum/libft.git",
        ),
        "branch": os.getenv("PROJECT_BRANCH_LIBFT", "main"),
    },
}

CODE_EXTENSIONS = {
    ".c", ".h", ".cpp", ".cc", ".cxx", ".hpp", ".hh", ".hxx",
    ".py", ".js", ".jsx", ".ts", ".tsx", ".java", ".go", ".rs",
    ".rb", ".php", ".swift", ".kt", ".kts", ".lua", ".sh", ".bash",
    ".zsh", ".sql", ".html", ".css", ".scss", ".json", ".yaml",
    ".yml", ".toml", ".ini", ".conf", ".xml", ".dockerfile",
}

PROJECT_SESSIONS = {}
RATE_LIMIT_STATE = {}
INFLIGHT_STATE = {}
SECURITY_LOCK = Lock()


def _safe_internal_error(message="erro interno do servidor"):
    return _json_error(message, 500)


def _truncate_output(value):
    text = value or ""
    if len(text.encode("utf-8", errors="ignore")) <= MAX_OUTPUT_BYTES:
        return text

    encoded = text.encode("utf-8", errors="ignore")[:MAX_OUTPUT_BYTES]
    truncated = encoded.decode("utf-8", errors="ignore")
    return f"{truncated}\n\n[runner] saída truncada por limite de segurança"


def _combine_process_output(stdout, stderr):
    parts = [part for part in [stdout or "", stderr or ""] if part]
    if not parts:
        return ""

    return "\n".join(parts)


def _extract_client_id(request, body=None):
    header_id = request.headers.get("X-Client-Id", "").strip()
    if header_id:
        return header_id[:128]

    if isinstance(body, dict):
        payload_id = body.get("clientId")
        if isinstance(payload_id, str) and payload_id.strip():
            return payload_id.strip()[:128]

        project_id = body.get("projectId")
        if isinstance(project_id, str) and project_id.strip():
            return f"project:{project_id.strip()[:120]}"

    forwarded = request.headers.get("X-Forwarded-For", "").strip()
    if forwarded:
        return f"ip:{forwarded.split(',')[0].strip()[:100]}"

    remote_addr = request.META.get("REMOTE_ADDR", "unknown")
    return f"ip:{str(remote_addr)[:100]}"


def _is_authorized(request):
    if not RUNNER_SHARED_TOKEN:
        return True

    token = request.headers.get("X-Runner-Token", "")
    return hmac.compare_digest(token, RUNNER_SHARED_TOKEN)


def _prune_stale_locked(now_monotonic):
    stale_cutoff = now_monotonic - PENDING_REQUEST_TTL_SECONDS
    stale_clients = []
    for client_id, timestamps in list(INFLIGHT_STATE.items()):
        active = [ts for ts in timestamps if ts >= stale_cutoff]
        if active:
            INFLIGHT_STATE[client_id] = active
        else:
            stale_clients.append(client_id)

    for client_id in stale_clients:
        INFLIGHT_STATE.pop(client_id, None)


def _global_inflight_count_locked():
    return sum(len(timestamps) for timestamps in INFLIGHT_STATE.values())


def _enter_request_guard(client_id):
    now_monotonic = time.monotonic()

    with SECURITY_LOCK:
        _prune_stale_locked(now_monotonic)

        global_count = _global_inflight_count_locked()
        if global_count >= MAX_GLOBAL_CONCURRENT_REQUESTS:
            return None, _json_error(
                (
                    "houve um erro no servidor e "
                    "o conteúdo não pode ser mostrado"
                ),
                503,
            )

        client_timestamps = INFLIGHT_STATE.get(client_id, [])
        if len(client_timestamps) >= MAX_CONCURRENT_REQUESTS_PER_ID:
            return None, _json_error(
                (
                    "muitas chamadas pendentes para este identificador; "
                    "tente novamente"
                ),
                503,
            )

        bucket = RATE_LIMIT_STATE.get(client_id)
        if not bucket:
            bucket = {"window_start": now_monotonic, "count": 0}
            RATE_LIMIT_STATE[client_id] = bucket

        elapsed = now_monotonic - float(bucket["window_start"])
        if elapsed >= RATE_WINDOW_SECONDS:
            bucket["window_start"] = now_monotonic
            bucket["count"] = 0

        if bucket["count"] >= MAX_REQUESTS_PER_ID_PER_MINUTE:
            return None, _json_error(
                "limite de chamadas excedido para este identificador",
                429,
            )

        bucket["count"] += 1
        client_timestamps.append(now_monotonic)
        INFLIGHT_STATE[client_id] = client_timestamps

    return now_monotonic, None


def _exit_request_guard(client_id, started_at):
    with SECURITY_LOCK:
        timestamps = INFLIGHT_STATE.get(client_id)
        if not timestamps:
            return

        removed = False
        for idx, timestamp in enumerate(timestamps):
            if timestamp == started_at:
                timestamps.pop(idx)
                removed = True
                break

        if not removed and timestamps:
            timestamps.pop(0)

        if timestamps:
            INFLIGHT_STATE[client_id] = timestamps
        else:
            INFLIGHT_STATE.pop(client_id, None)


@contextmanager
def _protected_request(request, body=None):
    if not _is_authorized(request):
        raise PermissionError("não autorizado")

    client_id = _extract_client_id(request, body)
    started_at, rejection = _enter_request_guard(client_id)
    if rejection is not None:
        yield rejection
        return

    try:
        yield None
    finally:
        _exit_request_guard(client_id, started_at)


def _parse_json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body)
    except Exception:
        return None


def _json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def _sanitize_relative_path(parts=None):
    if parts is None:
        return []
    if not isinstance(parts, list):
        raise ValueError("path inválido")

    clean_parts = []
    for part in parts:
        invalid = (
            not isinstance(part, str)
            or not part
            or part in {".", ".."}
            or "/" in part
        )
        if invalid:
            raise ValueError("path inválido")
        clean_parts.append(part)
    return clean_parts


def _resolve_inside_workdir(workdir, rel_parts):
    base = workdir.resolve()
    resolved = workdir.joinpath(*rel_parts).resolve()
    if resolved != base and base not in resolved.parents:
        raise ValueError("path fora do workdir")
    return resolved


def _run_command(command, cwd=None, timeout_ms=None):
    timeout_s = timeout_ms / 1000 if timeout_ms else None

    process = subprocess.Popen(
        command,
        cwd=str(cwd) if cwd else None,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=os.environ.copy(),
    )

    try:
        stdout, stderr = process.communicate(timeout=timeout_s)
        return {
            "stdout": stdout or "",
            "stderr": stderr or "",
            "code": process.returncode,
            "timedOut": False,
        }
    except subprocess.TimeoutExpired:
        process.kill()
        stdout, stderr = process.communicate()
        return {
            "stdout": stdout or "",
            "stderr": stderr or "",
            "code": 124,
            "timedOut": True,
        }


def _ensure_project_prepared(project_id):
    project = PROJECTS.get(project_id)
    if not project:
        raise KeyError("projeto não encontrado")

    existing = PROJECT_SESSIONS.get(project_id)
    if existing:
        return Path(existing)

    WORKDIR_BASE.mkdir(parents=True, exist_ok=True)
    temp_dir = Path(mkdtemp(prefix=f"{project_id}-", dir=str(WORKDIR_BASE)))

    clone_result = _run_command(
        [
            "git",
            "clone",
            "--depth",
            "1",
            "--branch",
            project["branch"],
            project["repoUrl"],
            str(temp_dir),
        ]
    )

    if clone_result["code"] != 0:
        shutil.rmtree(temp_dir, ignore_errors=True)
        detail = clone_result["stderr"] or clone_result["stdout"]
        raise RuntimeError(detail or "erro ao clonar")

    PROJECT_SESSIONS[project_id] = str(temp_dir)
    return temp_dir


@csrf_exempt
def health(request):
    if request.method != "GET":
        return _json_error("método não permitido", 405)

    return JsonResponse(
        {
            "ok": True,
            "service": "project-runner",
            "port": PORT,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    )


@csrf_exempt
def list_projects(request):
    if request.method != "GET":
        return _json_error("método não permitido", 405)
    try:
        with _protected_request(request) as rejection:
            if rejection is not None:
                return rejection

            return JsonResponse({"projects": list(PROJECTS.keys())})
    except PermissionError:
        return _json_error("não autorizado", 401)


@csrf_exempt
def prepare_project(request):
    if request.method != "POST":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    if not isinstance(project_id, str) or not project_id:
        return _json_error("projectId é obrigatório")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            workdir = _ensure_project_prepared(project_id)
            items = [
                {
                    "name": item.name,
                    "type": "dir" if item.is_dir() else "file",
                }
                for item in workdir.iterdir()
            ]
            return JsonResponse(
                {
                    "ok": True,
                    "projectId": project_id,
                    "workdir": str(workdir),
                    "items": items,
                }
            )
    except PermissionError:
        return _json_error("não autorizado", 401)
    except KeyError:
        return _json_error("projeto não encontrado", 404)
    except Exception:
        logger.exception("prepare_project failed")
        return _safe_internal_error("erro ao preparar projeto")


@csrf_exempt
def list_project_fs(request):
    if request.method != "POST":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    if not isinstance(project_id, str) or not project_id:
        return _json_error("projectId é obrigatório")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            rel_path = _sanitize_relative_path(body.get("path", []))
            workdir = _ensure_project_prepared(project_id)
            target_dir = _resolve_inside_workdir(workdir, rel_path)

            if not target_dir.exists() or not target_dir.is_dir():
                return _json_error("não é um diretório")

            items = [
                {
                    "name": item.name,
                    "type": "dir" if item.is_dir() else "file",
                }
                for item in target_dir.iterdir()
            ]
            return JsonResponse(
                {
                    "ok": True,
                    "projectId": project_id,
                    "path": rel_path,
                    "items": items,
                }
            )
    except PermissionError:
        return _json_error("não autorizado", 401)
    except ValueError as exc:
        return _json_error(str(exc) or "path inválido", 400)
    except Exception:
        logger.exception("list_project_fs failed")
        return _safe_internal_error("erro ao listar diretório")


@csrf_exempt
def read_project_file(request):
    if request.method != "POST":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    file_name = body.get("file")

    if not isinstance(project_id, str) or not project_id:
        return _json_error("projectId é obrigatório")

    invalid_file = (
        not isinstance(file_name, str)
        or not file_name
        or "/" in file_name
        or file_name in {".", ".."}
    )
    if invalid_file:
        return _json_error("arquivo inválido")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            rel_path = _sanitize_relative_path(body.get("path", []))
            workdir = _ensure_project_prepared(project_id)
            target_dir = _resolve_inside_workdir(workdir, rel_path)
            target_file = _resolve_inside_workdir(
                workdir,
                [*rel_path, file_name],
            )

            if not target_dir.exists() or not target_dir.is_dir():
                return _json_error("diretório inválido")
            if not target_file.exists() or not target_file.is_file():
                return _json_error("não é um arquivo")
            if target_file.stat().st_size > MAX_FILE_SIZE_BYTES:
                return _json_error("arquivo muito grande para visualização")

            suffix = target_file.suffix.lower()
            if suffix == ".pdf":
                raw_bytes = target_file.read_bytes()
                encoded = base64.b64encode(raw_bytes).decode("ascii")
                return JsonResponse(
                    {
                        "ok": True,
                        "projectId": project_id,
                        "path": rel_path,
                        "file": file_name,
                        "kind": "pdf",
                        "mimeType": "application/pdf",
                        "encoding": "base64",
                        "content": encoded,
                        "message": None,
                    }
                )

            try:
                content = target_file.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                return JsonResponse(
                    {
                        "ok": True,
                        "projectId": project_id,
                        "path": rel_path,
                        "file": file_name,
                        "kind": "unsupported",
                        "mimeType": None,
                        "encoding": None,
                        "content": None,
                        "message": (
                            "tipo de arquivo não suportado para visualização"
                        ),
                    }
                )

            if suffix == ".md":
                kind = "markdown"
                mime_type = "text/markdown"
            elif suffix in CODE_EXTENSIONS:
                kind = "code"
                mime_type = "text/plain"
            else:
                kind = "text"
                mime_type = "text/plain"

            return JsonResponse(
                {
                    "ok": True,
                    "projectId": project_id,
                    "path": rel_path,
                    "file": file_name,
                    "kind": kind,
                    "mimeType": mime_type,
                    "encoding": "utf-8",
                    "content": content,
                    "message": None,
                }
            )
    except PermissionError:
        return _json_error("não autorizado", 401)
    except ValueError as exc:
        return _json_error(str(exc) or "path inválido", 400)
    except Exception:
        logger.exception("read_project_file failed")
        return _safe_internal_error("erro ao ler arquivo")


@csrf_exempt
def build_project(request):
    if request.method != "POST":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    args = body.get("args", [])

    if not isinstance(project_id, str) or not project_id:
        return _json_error("projectId é obrigatório")
    if not isinstance(args, list):
        return _json_error("args inválidos")

    invalid_arg = any(
        (not isinstance(arg, str) or not arg.strip()) for arg in args
    )
    if invalid_arg:
        return _json_error("args inválidos")
    if len(args) > MAX_BUILD_ARGS:
        return _json_error("muitos argumentos para build")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            rel_path = _sanitize_relative_path(body.get("path", []))
            workdir = _ensure_project_prepared(project_id)
            target_dir = _resolve_inside_workdir(workdir, rel_path)
            if not target_dir.exists() or not target_dir.is_dir():
                return _json_error("não é um diretório")

            safe_args = [arg.strip() for arg in args if arg.strip()]
            result = _run_command(
                ["make", *safe_args],
                cwd=target_dir,
                timeout_ms=BUILD_TIMEOUT_MS,
            )
            output = _combine_process_output(
                result["stdout"], result["stderr"]
            )

            return JsonResponse(
                {
                    "ok": True,
                    "projectId": project_id,
                    "path": rel_path,
                    "command": " ".join(["make", *safe_args]),
                    "exitCode": int(result["code"]),
                    "success": result["code"] == 0 and not result["timedOut"],
                    "timedOut": bool(result["timedOut"]),
                    "output": _truncate_output(output),
                }
            )
    except PermissionError:
        return _json_error("não autorizado", 401)
    except ValueError as exc:
        return _json_error(str(exc) or "path inválido", 400)
    except Exception:
        logger.exception("build_project failed")
        return _safe_internal_error("erro ao executar build")


@csrf_exempt
def run_project(request):
    if request.method != "POST":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    executable = body.get("executable")
    args = body.get("args", [])

    if not isinstance(project_id, str) or not project_id:
        return _json_error("projectId é obrigatório")
    if not isinstance(executable, str) or not executable:
        return _json_error("executável é obrigatório")
    invalid_args = (
        not isinstance(args, list)
        or any(not isinstance(arg, str) for arg in args)
    )
    if invalid_args:
        return _json_error("args inválidos")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            rel_path = _sanitize_relative_path(body.get("path", []))
            workdir = _ensure_project_prepared(project_id)
            target_dir = _resolve_inside_workdir(workdir, rel_path)
            if not target_dir.exists() or not target_dir.is_dir():
                return _json_error("não é um diretório")

            if executable.startswith("./"):
                normalized = executable[2:]
            else:
                normalized = executable
            if "/" in normalized or normalized in {".", ".."}:
                return _json_error("executável inválido")

            target_binary = _resolve_inside_workdir(
                workdir,
                [*rel_path, normalized],
            )
            if not target_binary.exists() or not target_binary.is_file():
                return _json_error("executável não encontrado")
            if not os.access(target_binary, os.X_OK):
                return _json_error("arquivo não tem permissão de execução")

            safe_args = [str(arg) for arg in args[:MAX_RUN_ARGS]]
            result = _run_command(
                [str(target_binary), *safe_args],
                cwd=target_dir,
                timeout_ms=RUN_TIMEOUT_MS,
            )
            output = _combine_process_output(
                result["stdout"], result["stderr"]
            )
            command_suffix = f" {' '.join(safe_args)}" if safe_args else ""

            return JsonResponse(
                {
                    "ok": True,
                    "projectId": project_id,
                    "path": rel_path,
                    "command": f"./{normalized}{command_suffix}",
                    "exitCode": int(result["code"]),
                    "success": result["code"] == 0 and not result["timedOut"],
                    "timedOut": bool(result["timedOut"]),
                    "output": _truncate_output(output),
                }
            )
    except PermissionError:
        return _json_error("não autorizado", 401)
    except ValueError as exc:
        return _json_error(str(exc) or "path inválido", 400)
    except Exception:
        logger.exception("run_project failed")
        return _safe_internal_error("erro ao executar binário")


@csrf_exempt
def cleanup_project(request):
    if request.method != "DELETE":
        return _json_error("método não permitido", 405)

    body = _parse_json_body(request)
    if body is None:
        return _json_error("payload inválido")

    project_id = body.get("projectId")
    workdir = body.get("workdir")

    try:
        with _protected_request(request, body) as rejection:
            if rejection is not None:
                return rejection

            if isinstance(project_id, str) and project_id:
                existing = PROJECT_SESSIONS.get(project_id)
                if not existing:
                    return JsonResponse({"ok": True, "deleted": None})

                shutil.rmtree(existing, ignore_errors=True)
                PROJECT_SESSIONS.pop(project_id, None)
                return JsonResponse({"ok": True, "deleted": existing})

            if not isinstance(workdir, str) or not workdir:
                return _json_error("projectId ou workdir é obrigatório")

            workdir_path = Path(workdir).resolve()
            base_path = WORKDIR_BASE.resolve()
            if (
                workdir_path != base_path
                and base_path not in workdir_path.parents
            ):
                return _json_error("workdir inválido")

            shutil.rmtree(workdir_path, ignore_errors=True)
            return JsonResponse({"ok": True, "deleted": str(workdir_path)})
    except PermissionError:
        return _json_error("não autorizado", 401)
    except Exception:
        logger.exception("cleanup_project failed")
        return _safe_internal_error("erro ao limpar workdir")
