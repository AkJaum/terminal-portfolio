"use client";

import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnsiText } from "./ansi-text";
import { TerminalScreen, TerminalScreenBuffer } from "./terminal-screen";

type TerminalEntry = {
  name: string;
  type: "dir" | "file";
};

type TerminalResponse = {
  droppedOutput?: boolean;
  error?: string;
  exitCode?: number | null;
  newPath?: string[];
  output?: string | TerminalEntry[];
  outputBase64?: string;
  running?: boolean;
  type?: "clear" | "ls" | "output" | "process" | "process-input";
};

type TerminalLine = {
  id: number;
  kind: "command" | "error" | "output";
  text: string;
};

export type ProjectTerminalLabels = {
  about: string;
  close: string;
  helpHint: string;
  howItWorks: string;
  inputLabel: string;
  links: string;
  loading: string;
  quickStart: string;
  subtitle: string;
  welcome: string;
};

export type ProjectTerminalDetails = {
  description: string;
  howItWorks: string[];
  imageAlt: string;
  imageSrc: string;
  links: Array<{
    href: string;
    label: string;
  }>;
  quickStart: Array<{
    command: string;
    description: string;
  }>;
};

export type ProjectTerminalModalProps = {
  endpoint?: string;
  details: ProjectTerminalDetails;
  labels: ProjectTerminalLabels;
  onClose: () => void;
  open: boolean;
  projectId: string;
  projectTitle: string;
};

const defaultEndpoint = "/api/project-terminal";
const terminalColumns = 100;
const terminalRows = 46;

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function decodeBase64(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function ProjectTerminalModal({
  details,
  endpoint = defaultEndpoint,
  labels,
  onClose,
  open,
  projectId,
  projectTitle,
}: ProjectTerminalModalProps) {
  const [busy, setBusy] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [processActive, setProcessActive] = useState(false);
  const [screenVisible, setScreenVisible] = useState(false);
  const [screenVersion, setScreenVersion] = useState(0);
  const decoderRef = useRef(new TextDecoder());
  const inputQueueRef = useRef<Promise<void>>(Promise.resolve());
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdRef = useRef(0);
  const onCloseRef = useRef(onClose);
  const sessionIdRef = useRef("");
  const terminalBufferRef = useRef(
    new TerminalScreenBuffer(terminalColumns, terminalRows),
  );
  onCloseRef.current = onClose;

  const appendLine = useCallback((kind: TerminalLine["kind"], text: string) => {
    lineIdRef.current += 1;
    setLines((current) => [
      ...current,
      { id: lineIdRef.current, kind, text },
    ]);
  }, []);

  const processRequest = useCallback(async (body: Record<string, unknown>) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        projectId,
        sessionId: sessionIdRef.current,
      }),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => ({}))) as TerminalResponse;
    if (!response.ok || payload.error) {
      throw new Error(payload.error || "Terminal request failed.");
    }
    return payload;
  }, [endpoint, projectId]);

  const execute = useCallback(async (command: string, path = currentPath) => {
    const normalizedCommand = command.trim();
    if (!normalizedCommand || busy || processActive) return;

    if (screenVisible) setScreenVisible(false);
    appendLine(
      "command",
      `visitor@portfolio:/${path.join("/")}$ ${normalizedCommand}`,
    );
    setBusy(true);

    try {
      const payload = await processRequest({
        cols: terminalColumns,
        currentPath: path,
        input: normalizedCommand,
        rows: terminalRows,
      });

      if (payload.type === "clear") {
        setLines([]);
      } else if (payload.type === "ls" && Array.isArray(payload.output)) {
        appendLine(
          "output",
          payload.output
            .map((entry) => `${entry.name}${entry.type === "dir" ? "/" : ""}`)
            .join("  "),
        );
      } else if (payload.type === "process") {
        terminalBufferRef.current.reset();
        decoderRef.current = new TextDecoder();
        setScreenVersion((version) => version + 1);
        setScreenVisible(true);
        setProcessActive(true);
      } else if (typeof payload.output === "string" && payload.output) {
        appendLine("output", payload.output);
      }

      if (Array.isArray(payload.newPath)) setCurrentPath(payload.newPath);
    } catch (error) {
      appendLine(
        "error",
        error instanceof Error ? error.message : "The project runner is currently unavailable.",
      );
    } finally {
      setBusy(false);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [appendLine, busy, currentPath, processActive, processRequest, screenVisible]);

  const sendProcessInput = useCallback((data: string) => {
    inputQueueRef.current = inputQueueRef.current
      .then(async () => {
        await processRequest({ action: "process-input", data });
      })
      .catch((error) => {
        appendLine(
          "error",
          error instanceof Error ? error.message : "Unable to send process input.",
        );
        setProcessActive(false);
      });
    return inputQueueRef.current;
  }, [appendLine, processRequest]);

  useEffect(() => {
    if (!open || !processActive) return;
    const controller = new AbortController();
    let timer = 0;

    async function poll() {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "process-poll",
            projectId,
            sessionId: sessionIdRef.current,
          }),
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => ({}))) as TerminalResponse;
        if (!response.ok || payload.error) {
          throw new Error(payload.error || "Unable to read interactive process output.");
        }

        if (payload.outputBase64) {
          const output = decoderRef.current.decode(
            decodeBase64(payload.outputBase64),
            { stream: payload.running === true },
          );
          terminalBufferRef.current.write(output);
          setScreenVersion((version) => version + 1);
        }
        if (payload.droppedOutput) {
          terminalBufferRef.current.write(
            "\r\n[runner] output was truncated by the safety buffer.\r\n",
          );
          setScreenVersion((version) => version + 1);
        }

        if (payload.running === false) {
          const decoderTail = decoderRef.current.decode();
          if (decoderTail) terminalBufferRef.current.write(decoderTail);
          setScreenVersion((version) => version + 1);
          setProcessActive(false);
          window.requestAnimationFrame(() => inputRef.current?.focus());
          return;
        }
        timer = window.setTimeout(poll, 45);
      } catch (error) {
        if (controller.signal.aborted) return;
        setProcessActive(false);
        appendLine(
          "error",
          error instanceof Error ? error.message : "Interactive process connection failed.",
        );
      }
    }

    void poll();
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [appendLine, endpoint, open, processActive, projectId]);

  useEffect(() => {
    if (!open) return;

    sessionIdRef.current = createSessionId();
    lineIdRef.current = 0;
    terminalBufferRef.current.reset();
    decoderRef.current = new TextDecoder();
    inputQueueRef.current = Promise.resolve();
    setCurrentPath([]);
    setInput("");
    setLines([]);
    setProcessActive(false);
    setScreenVisible(false);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => inputRef.current?.focus());

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      const sessionId = sessionIdRef.current;
      if (sessionId) {
        void fetch(endpoint, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, sessionId }),
          keepalive: true,
        });
      }
    };
  }, [endpoint, open, projectId]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input;
    setInput("");
    if (processActive) {
      if (value) void sendProcessInput(value);
      void sendProcessInput("\r");
      return;
    }
    void execute(value);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!processActive) {
      if (event.key === "l" && event.ctrlKey) {
        event.preventDefault();
        setLines([]);
      }
      return;
    }

    const key = event.key;
    if (event.ctrlKey && key.toLowerCase() === "c") {
      event.preventDefault();
      setInput("");
      void sendProcessInput("\u0003");
      return;
    }
    if (event.ctrlKey && key.toLowerCase() === "d") {
      event.preventDefault();
      setInput("");
      void sendProcessInput("\u0004");
      return;
    }
    if (event.ctrlKey && key.toLowerCase() === "l") {
      event.preventDefault();
      void sendProcessInput("\u000c");
      return;
    }
    const sequences: Record<string, string> = {
      ArrowDown: "\u001b[B",
      ArrowLeft: "\u001b[D",
      ArrowRight: "\u001b[C",
      ArrowUp: "\u001b[A",
      Backspace: "\u007f",
      Delete: "\u001b[3~",
      End: "\u001b[F",
      Enter: "\r",
      Home: "\u001b[H",
      Tab: "\t",
    };
    if (sequences[key]) {
      event.preventDefault();
      void sendProcessInput(sequences[key]);
      return;
    }
    if (!event.altKey && !event.ctrlKey && !event.metaKey && key.length === 1) {
      event.preventDefault();
      void sendProcessInput(key);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    if (!processActive) return;
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    if (pastedText) void sendProcessInput(pastedText);
  }

  return (
    <div
      className="ak-terminal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ak-terminal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="ak-terminal-modal__panel">
        <header className="ak-terminal-modal__toolbar">
          <p className="ak-terminal-modal__eyebrow">{labels.subtitle}</p>
          <button
            type="button"
            className="ak-terminal-modal__close"
            onClick={onClose}
            aria-label={labels.close}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="ak-terminal-modal__workspace">
          <aside className="ak-terminal-modal__info">
            <div className="ak-terminal-modal__project-header">
              <img src={details.imageSrc} alt={details.imageAlt} />
              <div>
                <p className="ak-terminal-modal__eyebrow">{labels.about}</p>
                <h2 id="ak-terminal-title">{projectTitle}</h2>
              </div>
            </div>

            <nav className="ak-terminal-modal__links" aria-label={labels.links}>
              <p className="ak-terminal-modal__section-label">{labels.links}</p>
              <div>
                {details.links.map((link) => (
                  <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </nav>

            <section className="ak-terminal-modal__info-section">
              <h3>{labels.about}</h3>
              <p>{details.description}</p>
            </section>

            <section className="ak-terminal-modal__info-section">
              <h3>{labels.howItWorks}</h3>
              <ul>
                {details.howItWorks.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="ak-terminal-modal__info-section">
              <h3>{labels.quickStart}</h3>
              <ol className="ak-terminal-modal__quick-start">
                {details.quickStart.map((step) => (
                  <li key={`${step.command}-${step.description}`}>
                    <p>{step.description}</p>
                    <code>{step.command}</code>
                  </li>
                ))}
              </ol>
            </section>
          </aside>

          <div className="ak-terminal-modal__screen" onClick={() => inputRef.current?.focus()}>
            <div className="ak-terminal-modal__output" aria-live="polite">
              <p className="ak-terminal-modal__welcome">
                {labels.welcome} <strong>{projectTitle}</strong>. {labels.helpHint} <code>help</code>.
              </p>
              {lines.map((line) => (
                <pre key={line.id} className={`ak-terminal-modal__line ak-terminal-modal__line--${line.kind}`}>
                  <AnsiText text={line.text} />
                </pre>
              ))}
              {screenVisible && (
                <TerminalScreen
                  buffer={terminalBufferRef.current}
                  running={processActive}
                  version={screenVersion}
                />
              )}
            </div>

            <form
              className={`ak-terminal-modal__form${processActive ? " ak-terminal-modal__form--process" : ""}`}
              onSubmit={handleSubmit}
            >
              <label htmlFor="ak-terminal-input" className="ak-terminal-modal__prompt">
                {processActive ? "Interactive process input" : `visitor@portfolio:/${currentPath.join("/")}$`}
              </label>
              <input
                ref={inputRef}
                id="ak-terminal-input"
                aria-label={labels.inputLabel}
                autoComplete="off"
                disabled={busy}
                onChange={(event) => {
                  if (processActive && event.target.value) {
                    void sendProcessInput(event.target.value);
                    setInput("");
                  } else {
                    setInput(event.target.value);
                  }
                }}
                onKeyDown={handleInputKeyDown}
                onPaste={handlePaste}
                spellCheck={false}
                value={input}
              />
              {busy && <span className="ak-terminal-modal__busy">{labels.loading}</span>}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
