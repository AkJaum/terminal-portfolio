"use client";

import { useRef, useEffect } from "react";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import COMMANDS from "../lib/commands";
import { autocompleteCommand, autocompletePath } from "../lib/shell";
import runShellCommand from "../lib/shell";
import FileViewer from "../components/viewer";
import TerminalOutput from "../components/terminal/TerminalOutput";
import TerminalInput from "../components/terminal/TerminalInput";
import { shouldLockForClone } from "../lib/terminal-utils";
import useTerminalState from "./useTerminalState";

export default function Terminal() {
  const searchParams = useSearchParams();
  const initialPath = useMemo(() => {
    const rawPath = searchParams.get("path");
    if (!rawPath) return ["home"];

    const decodedPath = decodeURIComponent(rawPath);
    const segments = decodedPath.split("/").map((segment) => segment.trim()).filter(Boolean);
    return segments.length > 0 ? segments : ["home"];
  }, [searchParams]);
  const showWelcome = useMemo(() => {
    const welcomeParam = searchParams.get("welcome");
    const embedParam = searchParams.get("embed");
    if (welcomeParam === "0" || welcomeParam === "false") return false;
    if (embedParam === "1") return false;
    return true;
  }, [searchParams]);
  const { state, actions } = useTerminalState({ initialPath, showWelcome });
  const inputRef = useRef(null);
  const commandRunningRef = useRef(false);
  const router = useRouter();
  const promptText = `joao@portfolio:/${state.currentPath.join("/")}$`;



  useEffect(() => {
    if (inputRef.current && !state.viewerOpen) {
      inputRef.current.focus();
    }
  }, [state.viewerOpen, state.isCloneLoading]);

  useEffect(() => {
    if (state.viewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [state.viewerOpen]);

  useEffect(() => {
    if (state.navigateToGui) {
      router.push("/gui");
      actions.setNavigateToGui(false);
    }
  }, [state.navigateToGui, router]);

  async function handlePressedKey(pressed) {
    if (state.isCloneLoading) {
      pressed.preventDefault();
      return;
    }

    if (pressed.key === "Enter") {
      pressed.preventDefault();
      // Ignore empty commands:
      if (state.input.trim() === "") return;
      if (commandRunningRef.current) return;

      commandRunningRef.current = true;
      const lockInputForClone = shouldLockForClone(state.input);
      if (lockInputForClone) actions.setCloneLoading(true);

      // Print the command in the terminal:
      const commandPromptSnapshot = `joao@portfolio:/${state.currentPath.join("/")}$`;
      actions.appendCommand(commandPromptSnapshot, state.input);
      // Run the command and get the result:
      try {
        const result = await runShellCommand(state.input, state.currentPath);
        const newLinesToAdd = [];

        // Stderr:
        if (result.error) {
          newLinesToAdd.push(result.error);
        }
        // Handle ls output with entries:
        else if (result?.type === "ls" && Array.isArray(result?.output)) {
          newLinesToAdd.push({ type: "ls", entries: result.output });
        }
        // Stdout (except `view`, which should only open preview modal):
        else if (result?.type !== "view" && result?.output && typeof result?.output === "string") {
          const outputText = String(result.output).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
          const outputLines = outputText.split("\n");
          newLinesToAdd.push(...outputLines);
        }
        
        // Handle special cases
        if (result?.type === "view" && result?.output) {
          actions.openViewer(result.output);
        }
        if (result?.newPath) {
          actions.setCurrentPath(result.newPath);
        }
        if (result?.type === "clear") {
          actions.clearLines();
        }
        if (result?.type === "gui") {
          actions.setNavigateToGui(true);
        }

        // Batch all line additions + gap into single state update
        if (result?.type !== "clear") {
          actions.appendLines([...newLinesToAdd, { type: "gap" }]);
        }

        // Add command to history, so we can navigate with the arrow keys:
        actions.pushHistory(state.input);
        actions.setInput("");
      } finally {
        commandRunningRef.current = false;
        if (lockInputForClone) actions.setCloneLoading(false);
      }
    }

    if (pressed.key === "ArrowUp") {
      pressed.preventDefault();
      if (state.history.length === 0) return;
      const index = Math.max(0, state.historyIndex - 1);
      actions.setHistoryIndex(index);
      actions.setInput(state.history[index]);
    }

    if (pressed.key === "ArrowDown") {
      pressed.preventDefault();
      const index = Math.min(state.history.length, state.historyIndex + 1);
      actions.setHistoryIndex(index);
      actions.setInput(state.history[index] || "");
    }

    if (pressed.key === "Tab") {
      pressed.preventDefault();

      const parts = state.input.split(/\s+/);

      // Autocomplete command:
      if (parts.length === 1) {
        const matches = autocompleteCommand(parts[0], COMMANDS);

        if (matches.length === 1) {
          actions.setInput(matches[0] + " ");
          return;
        }
        if (matches.length > 1) {
          actions.appendLines([matches.join("  ")]);
          return;
        }
      }

      // Autocomplete de arquivos/pastas
      if (parts.length >= 2) {
        const last = parts[parts.length - 1];
        const matches = await autocompletePath(last, state.currentPath);
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          actions.setInput(parts.join(" "));
          return;
        }

        if (matches.length > 1) {
          actions.appendLines([matches.join("  ")]);
          return;
        }
      }
    }
  }

  return (
    <>
      {state.viewerOpen && (
        <FileViewer
          content={state.viewerContent}
          variant="terminal"
          onClose={() => {
            actions.closeViewer();
          }}
        />
      )}
      <div
        id="terminal"
        className="h-screen bg-[#1e1f22] text-white font-mono p-4 overflow-auto"
        style={{ perspective: "1000px", transform: "translateZ(0)" }}
      >
        <TerminalOutput lines={state.lines} />

        <TerminalInput
          promptText={promptText}
          input={state.input}
          onInputChange={actions.setInput}
          onKeyDown={handlePressedKey}
          disabled={state.viewerOpen}
          readOnly={state.isCloneLoading}
          inputRef={inputRef}
        />
      </div>
    </>
  );
}
