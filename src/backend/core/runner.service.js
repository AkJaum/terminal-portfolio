import filesystem from "./filesystem";
import { resolveProjectFromPath } from "./project.catalog";
import { readFileSync } from "fs";
import path from "path";

const RUNNER_BASE_URL = process.env.PROJECT_RUNNER_URL || "http://localhost:8080";
const RUNNER_SHARED_TOKEN = process.env.RUNNER_SHARED_TOKEN || "";
const PROJECT_IDLE_CLEANUP_MS = Number(process.env.PROJECT_IDLE_CLEANUP_MS || 60_000);
const cleanupTimers = new Map();
const CODE_EXTENSIONS = new Set([
  "c", "h", "cpp", "cc", "cxx", "hpp", "hh", "hxx",
  "py", "js", "jsx", "ts", "tsx", "java", "go", "rs",
  "rb", "php", "swift", "kt", "kts", "lua", "sh", "bash",
  "zsh", "sql", "html", "css", "scss", "json", "yaml", "yml",
  "toml", "ini", "conf", "xml",
]);

function getCurrentDir(fs, path) {
  return path.reduce((dir, folder) => {
    if (!dir?.[folder]) return null;
    return dir[folder];
  }, fs);
}

function resolveStaticFileReference(value) {
  if (typeof value !== "string" || !value.startsWith("__REF__:")) {
    return value;
  }

  const refPath = value.slice("__REF__:".length);
  const absolutePath = path.resolve(process.cwd(), refPath);
  return readFileSync(absolutePath, "utf8");
}

async function runnerRequest(endpoint, body, method = "POST") {
  const clientId =
    (body && typeof body.clientId === "string" && body.clientId.trim())
      || (body && typeof body.projectId === "string" && body.projectId.trim())
      || "runner-client";

  const headers = {
    "Content-Type": "application/json",
    "X-Client-Id": String(clientId),
  };

  if (RUNNER_SHARED_TOKEN) {
    headers["X-Runner-Token"] = RUNNER_SHARED_TOKEN;
  }

  const response = await fetch(`${RUNNER_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || `runner request falhou: ${endpoint}`);
  }

  return payload;
}

async function ensureProjectPrepared(projectId) {
  await runnerRequest("/projects/prepare", { projectId });
}

async function cleanupProjectNow(projectId) {
  await runnerRequest("/projects/cleanup", { projectId }, "DELETE");
}

export function cancelProjectCleanup(projectId) {
  const timer = cleanupTimers.get(projectId);
  if (!timer) return;

  clearTimeout(timer);
  cleanupTimers.delete(projectId);
}

export function scheduleProjectCleanup(projectId, delayMs = PROJECT_IDLE_CLEANUP_MS) {
  cancelProjectCleanup(projectId);

  const timer = setTimeout(async () => {
    cleanupTimers.delete(projectId);
    try {
      await cleanupProjectNow(projectId);
    } catch {
      // cleanup best-effort
    }
  }, delayMs);

  cleanupTimers.set(projectId, timer);
}

function staticEntriesAtPath(path) {
  const dir = getCurrentDir(filesystem, path);
  if (!dir || typeof dir !== "object") return null;

  return Object.keys(dir).map((name) => ({
    name,
    type: typeof dir[name] === "object" ? "dir" : "file",
  }));
}

export async function listEntriesAtPath(path) {
  const projectCtx = resolveProjectFromPath(path);
  if (projectCtx) {
    cancelProjectCleanup(projectCtx.projectId);
    await ensureProjectPrepared(projectCtx.projectId);
    const payload = await runnerRequest("/projects/fs/list", {
      projectId: projectCtx.projectId,
      path: projectCtx.repoRelativePath,
    });

    return payload.items || [];
  }

  const entries = staticEntriesAtPath(path);
  if (!entries) throw new Error("diretório não existe");
  return entries;
}

export async function readFileAtPath(path, file) {
  const payload = await readFilePayloadAtPath(path, file);

  if (payload.kind === "text" || payload.kind === "markdown" || payload.kind === "code") {
    return payload.content || "";
  }

  throw new Error("tipo de arquivo não suportado para leitura em texto");
}

export async function readFilePayloadAtPath(path, file) {
  const projectCtx = resolveProjectFromPath(path);
  if (projectCtx) {
    cancelProjectCleanup(projectCtx.projectId);
    await ensureProjectPrepared(projectCtx.projectId);
    const payload = await runnerRequest("/projects/fs/read", {
      projectId: projectCtx.projectId,
      path: projectCtx.repoRelativePath,
      file,
    });

    return payload;
  }

  const dir = getCurrentDir(filesystem, path);
  if (!dir) throw new Error("diretório não existe");
  if (!file) throw new Error("arquivo não especificado");
  if (!dir[file]) throw new Error("arquivo não existe");
  if (typeof dir[file] === "object") throw new Error("é um diretório");

  const ext = String(file).split(".").pop()?.toLowerCase() || "";
  const content = String(resolveStaticFileReference(dir[file]) ?? "");
  const launcherMatch = content.trim().match(/^launcher:\/\/([a-z0-9_-]+)$/i);

  if (launcherMatch) {
    const target = launcherMatch[1].toLowerCase();
    return {
      ok: true,
      file,
      kind: "launcher",
      mimeType: "text/x-launcher",
      encoding: "utf-8",
      target,
      content: content.trim(),
      message: null,
    };
  }

  if (ext === "web") {
    const rawUrl = content.trim();
    if (!/^https?:\/\//i.test(rawUrl)) {
      throw new Error("arquivo .web precisa conter uma URL http(s) válida");
    }

    return {
      ok: true,
      file,
      kind: "web",
      mimeType: "text/uri-list",
      encoding: "utf-8",
      url: rawUrl,
      content: rawUrl,
      message: null,
    };
  }

  const kind = file === "README" || ext === "md" ? "markdown" : CODE_EXTENSIONS.has(ext) ? "code" : "text";

  return {
    ok: true,
    file,
    kind,
    mimeType: kind === "markdown" ? "text/markdown" : "text/plain",
    encoding: "utf-8",
    content,
    message: null,
  };
}

export async function buildProjectAtPath(path, args = []) {
  const projectCtx = resolveProjectFromPath(path);
  if (!projectCtx) {
    throw new Error("comando disponível apenas dentro de projetos");
  }

  cancelProjectCleanup(projectCtx.projectId);
  await ensureProjectPrepared(projectCtx.projectId);

  const payload = await runnerRequest("/projects/build", {
    projectId: projectCtx.projectId,
    path: projectCtx.repoRelativePath,
    args: Array.isArray(args) ? args : [],
  });

  return {
    output: payload.output || "",
    success: Boolean(payload.success),
    exitCode: Number.isInteger(payload.exitCode) ? payload.exitCode : 1,
    command: payload.command || "make",
  };
}

export async function runProjectExecutableAtPath(path, executable, args = []) {
  const projectCtx = resolveProjectFromPath(path);
  if (!projectCtx) {
    throw new Error("comando disponível apenas dentro de projetos");
  }

  cancelProjectCleanup(projectCtx.projectId);
  await ensureProjectPrepared(projectCtx.projectId);

  const payload = await runnerRequest("/projects/run", {
    projectId: projectCtx.projectId,
    path: projectCtx.repoRelativePath,
    executable,
    args: Array.isArray(args) ? args : [],
  });

  return {
    output: payload.output || "",
    success: Boolean(payload.success),
    exitCode: Number.isInteger(payload.exitCode) ? payload.exitCode : 1,
    timedOut: Boolean(payload.timedOut),
    command: payload.command || executable,
  };
}

export function getStaticDir(path) {
  return getCurrentDir(filesystem, path);
}
