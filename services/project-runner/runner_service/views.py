import json
import os
import shutil
import subprocess
import base64
from datetime import datetime, timezone
from pathlib import Path
from tempfile import mkdtemp

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

PORT = int(os.getenv("PORT", "8080"))
WORKDIR_BASE = Path(os.getenv("WORKDIR_BASE", "/tmp/runner-workspaces"))
MAX_FILE_SIZE_BYTES = int(
    os.getenv("MAX_FILE_SIZE_BYTES", str(8 * 1024 * 1024))
)

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
    return JsonResponse({"projects": list(PROJECTS.keys())})


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
    except KeyError:
        return _json_error("projeto não encontrado", 404)
    except Exception as exc:
        return _json_error(str(exc) or "erro ao preparar projeto", 500)


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
    except Exception as exc:
        return _json_error(str(exc) or "erro ao listar diretório", 500)


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
        rel_path = _sanitize_relative_path(body.get("path", []))
        workdir = _ensure_project_prepared(project_id)
        target_dir = _resolve_inside_workdir(workdir, rel_path)
        target_file = _resolve_inside_workdir(workdir, [*rel_path, file_name])

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
    except Exception as exc:
        return _json_error(str(exc) or "erro ao ler arquivo", 500)


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
    if len(args) > 8:
        return _json_error("muitos argumentos para build")

    try:
        rel_path = _sanitize_relative_path(body.get("path", []))
        workdir = _ensure_project_prepared(project_id)
        target_dir = _resolve_inside_workdir(workdir, rel_path)
        if not target_dir.exists() or not target_dir.is_dir():
            return _json_error("não é um diretório")

        safe_args = [arg.strip() for arg in args if arg.strip()]
        result = _run_command(["make", *safe_args], cwd=target_dir)
        output = (result["stdout"] or "") + (result["stderr"] or "")

        return JsonResponse(
            {
                "ok": True,
                "projectId": project_id,
                "path": rel_path,
                "command": " ".join(["make", *safe_args]),
                "exitCode": int(result["code"]),
                "success": result["code"] == 0,
                "output": output,
            }
        )
    except Exception as exc:
        return _json_error(str(exc) or "erro ao executar build", 500)


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

        safe_args = [str(arg) for arg in args[:32]]
        result = _run_command(
            [str(target_binary), *safe_args],
            cwd=target_dir,
            timeout_ms=10000,
        )
        output = (result["stdout"] or "") + (result["stderr"] or "")
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
                "output": output,
            }
        )
    except Exception as exc:
        return _json_error(str(exc) or "erro ao executar binário", 500)


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
        if workdir_path != base_path and base_path not in workdir_path.parents:
            return _json_error("workdir inválido")

        shutil.rmtree(workdir_path, ignore_errors=True)
        return JsonResponse({"ok": True, "deleted": str(workdir_path)})
    except Exception as exc:
        return _json_error(str(exc) or "erro ao limpar workdir", 500)
