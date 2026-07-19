export type RunnerProjectConfig = {
  buildTargets?: string[];
  executables?: string[];
  pythonScripts?: Record<string, { interactive?: boolean; stdin?: string }>;
  runnerProjectId: string;
};

export type ProjectTerminalHandlerConfig = {
  projects: Record<string, RunnerProjectConfig>;
  runnerToken?: string;
  runnerUrl: string;
};

type CommandPayload = {
  action?: unknown;
  cols?: unknown;
  currentPath?: unknown;
  data?: unknown;
  input?: unknown;
  projectId?: unknown;
  rows?: unknown;
  sessionId?: unknown;
};

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{8,128}$/;

function json(payload: unknown, status = 200) {
  return Response.json(payload, { status });
}

function tokenize(input: string) {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;

  for (const character of input.trim()) {
    if (escaped) {
      current += character;
      escaped = false;
      continue;
    }
    if (character === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      else current += character;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (/\s/.test(character)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += character;
  }

  if (escaped) current += "\\";
  if (quote) throw new Error("Unclosed quote.");
  if (current) tokens.push(current);
  return tokens;
}

function sanitizePath(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Invalid current directory.");
  return value.map((part) => {
    if (typeof part !== "string" || !part || part === "." || part === ".." || part.includes("/")) {
      throw new Error("Invalid current directory.");
    }
    return part;
  });
}

function resolvePath(currentPath: string[], target?: string) {
  if (!target || target === ".") return [...currentPath];
  const next = target.startsWith("/") ? [] : [...currentPath];

  for (const part of target.split("/").filter(Boolean)) {
    if (part === ".") continue;
    if (part === "..") next.pop();
    else next.push(...sanitizePath([part]));
  }

  return next;
}

function resolveFile(currentPath: string[], target?: string) {
  if (!target) throw new Error("A file name is required.");
  const parts = target.split("/").filter(Boolean);
  const file = parts.pop();
  if (!file || file === "." || file === ".." || file.includes("/")) {
    throw new Error("Invalid file name.");
  }
  const pathTarget = `${target.startsWith("/") ? "/" : ""}${parts.join("/")}`;
  return { file, path: resolvePath(currentPath, pathTarget || ".") };
}

function validatePayload(body: CommandPayload, config: ProjectTerminalHandlerConfig) {
  const projectId = typeof body.projectId === "string" ? body.projectId : "";
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
  const project = config.projects[projectId];

  if (!project) throw new Error("This project does not provide an interactive terminal.");
  if (!SESSION_ID_PATTERN.test(sessionId)) throw new Error("Invalid terminal session.");

  return { project, projectId, sessionId };
}

async function readBody(request: Request) {
  try {
    return (await request.json()) as CommandPayload;
  } catch {
    throw new Error("Invalid request payload.");
  }
}

async function runnerRequest(
  config: ProjectTerminalHandlerConfig,
  endpoint: string,
  body: Record<string, unknown>,
  method = "POST",
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Client-Id": String(body.sessionId),
  };
  if (config.runnerToken) headers["X-Runner-Token"] = config.runnerToken;

  const response = await fetch(`${config.runnerUrl.replace(/\/$/, "")}${endpoint}`, {
    method,
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof payload.error === "string" ? payload.error : "Project runner request failed.");
  }
  return payload;
}

const helpText = [
  "Available commands:",
  "  ls [path]             list files and directories",
  "  cd <path>             change directory inside this project",
  "  cat <file>            read a text or source file",
  "  make [target]         compile the project",
  "  run <binary> [args]   execute an allowed project binary",
  "  ./<binary> [args]     shortcut for run",
  "  python3 <file> [args] execute an allowed Python script in a PTY",
  "  reclone               reset this terminal workspace",
  "  pwd                   print the current project path",
  "  clear                 clear the terminal",
  "  help                  show this help",
].join("\n");

export function createProjectTerminalHandlers(config: ProjectTerminalHandlerConfig) {
  async function POST(request: Request) {
    try {
      const body = await readBody(request);
      const { project, sessionId } = validatePayload(body, config);
      const runnerBase = { projectId: project.runnerProjectId, sessionId };
      const action = typeof body.action === "string" ? body.action : "";

      if (action === "process-poll") {
        const payload = await runnerRequest(config, "/projects/process/poll", runnerBase);
        return json({ type: "process", ...payload });
      }

      if (action === "process-input") {
        if (typeof body.data !== "string" || !body.data || body.data.length > 4096) {
          throw new Error("Invalid process input.");
        }
        await runnerRequest(config, "/projects/process/input", {
          ...runnerBase,
          data: body.data,
        });
        return json({ ok: true, type: "process-input" });
      }

      if (action === "process-resize") {
        await runnerRequest(config, "/projects/process/resize", {
          ...runnerBase,
          cols: body.cols,
          rows: body.rows,
        });
        return json({ ok: true, type: "process-resize" });
      }

      const currentPath = sanitizePath(body.currentPath ?? []);
      const input = typeof body.input === "string" ? body.input.trim() : "";
      const [command = "", ...args] = tokenize(input);

      if (!command) return json({ error: "Command is required." }, 400);
      if (command === "help") return json({ type: "output", output: helpText });
      if (command === "clear") return json({ type: "clear" });
      if (command === "pwd") return json({ type: "output", output: `/${currentPath.join("/")}` });

      if (command === "ls") {
        const path = resolvePath(currentPath, args[0]);
        const payload = await runnerRequest(config, "/projects/fs/list", { ...runnerBase, path });
        return json({ type: "ls", output: payload.items || [] });
      }

      if (command === "cd") {
        const path = resolvePath(currentPath, args[0] || "/");
        await runnerRequest(config, "/projects/fs/list", { ...runnerBase, path });
        return json({ type: "output", output: "", newPath: path });
      }

      if (command === "cat" || command === "view" || command === "vim") {
        const target = resolveFile(currentPath, args[0]);
        const payload = await runnerRequest(config, "/projects/fs/read", { ...runnerBase, ...target });
        if (typeof payload.content !== "string") throw new Error("This file cannot be displayed as text.");
        return json({ type: "output", output: payload.content });
      }

      if (command === "make") {
        const allowedTargets = project.buildTargets || [];
        if (args.some((target) => !allowedTargets.includes(target))) {
          throw new Error("This make target is not allowed for this project.");
        }
        const payload = await runnerRequest(config, "/projects/build", {
          ...runnerBase,
          path: currentPath,
          args,
        });
        return json({
          type: "output",
          output: `${payload.output || ""}\n[make] exit code: ${payload.exitCode}`.trim(),
        });
      }

      if (command === "reclone") {
        await runnerRequest(config, "/projects/cleanup", runnerBase, "DELETE");
        await runnerRequest(config, "/projects/prepare", runnerBase);
        return json({ type: "output", output: "Project workspace recreated.", newPath: [] });
      }

      if (command === "run" || command.startsWith("./")) {
        const executable = command === "run" ? args.shift() : command.slice(2);
        if (!executable || !(project.executables || []).includes(executable)) {
          throw new Error("This executable is not allowed for this project.");
        }
        const payload = await runnerRequest(config, "/projects/run", {
          ...runnerBase,
          path: currentPath,
          executable,
          args,
        });
        return json({
          type: "output",
          output: `${payload.output || ""}\n[run] exit code: ${payload.exitCode}${payload.timedOut ? " (timeout)" : ""}`.trim(),
        });
      }

      if (command === "python" || command === "python3") {
        const script = args.shift();
        const scriptConfig = script ? project.pythonScripts?.[script] : undefined;
        if (!script || !scriptConfig) {
          throw new Error("This Python script is not allowed for this project.");
        }
        const interactive = scriptConfig.interactive === true;
        const payload = await runnerRequest(
          config,
          interactive ? "/projects/process/start" : "/projects/run",
          {
          ...runnerBase,
          path: currentPath,
          executable: script,
          args,
          runtime: "python",
          stdin: interactive ? undefined : scriptConfig.stdin,
          cols: body.cols,
          rows: body.rows,
          },
        );
        if (interactive) {
          return json({
            type: "process",
            command: payload.command,
            running: true,
          });
        }
        return json({
          type: "output",
          output: `${payload.output || ""}\n[python] exit code: ${payload.exitCode}${payload.timedOut ? " (timeout)" : ""}`.trim(),
        });
      }

      return json({ error: "Command not found. Type help to list the available commands." }, 400);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Terminal request failed." }, 400);
    }
  }

  async function DELETE(request: Request) {
    try {
      const body = await readBody(request);
      const { project, sessionId } = validatePayload(body, config);
      await runnerRequest(
        config,
        "/projects/cleanup",
        { projectId: project.runnerProjectId, sessionId },
        "DELETE",
      );
      return json({ ok: true });
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Session cleanup failed." }, 400);
    }
  }

  return { DELETE, POST };
}
