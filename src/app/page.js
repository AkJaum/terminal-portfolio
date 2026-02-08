"use client";

import { useState } from "react";
import COMMANDS from "./lib/commands";
import { autocompleteCommand, autocompletePath } from "./lib/shell";
import runShellCommand from "./lib/shell";

export default function Terminal()
{
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState(["home"]);

  function handlePressedKey(pressed)
  {
    if (pressed.key === "Enter")
    {
      pressed.preventDefault();
      // Ignore empty commands:
      if (input.trim() === "")
        return;
      // Print the command in the terminal:
      setLines((prev) => [...prev, `$ ${input}`]);
      // Run the command and get the result:
      const result = runShellCommand(input, currentPath);

      // Stderr:
      if (result.error)
        setLines((prev) => [...prev, result.error]);
      // Stdout:
      if (result.output)
        setLines((prev) => [...prev, result.output]);
      // Update current path:
      if (result.newPath)
        setCurrentPath(result.newPath);
      // Clear screen:
      if (result.type === "clear")
        setLines([]);

      // Add command to history, so we can navigate with the arrow keys:
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(history.length + 1);
      setInput("");
    }

    if (pressed.key === "ArrowUp")
    {
      pressed.preventDefault();
      if (history.length === 0)
        return;
      const index = Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    }

    if (pressed.key === "ArrowDown")
    {
      pressed.preventDefault();
      const index = Math.min(history.length, historyIndex + 1);
      setHistoryIndex(index);
      setInput(history[index] || "");
    }

    if (pressed.key === "Tab")
    {
      pressed.preventDefault();

      const parts = input.split(/\s+/);

      // Autocomplete command:
      if (parts.length === 1)
      {
        const matches = autocompleteCommand(parts[0], COMMANDS);

        if (matches.length === 1)
        {
          setInput(matches[0] + " ");
          return;
        }
        if (matches.length > 1)
        {
          setLines((prev) => [...prev, matches.join("  ")]);
          return;
        }
      }

      // Autocomplete de arquivos/pastas
      if (parts.length >= 2)
      {
        const last = parts[parts.length - 1];
        const matches = autocompletePath(last, currentPath);
        if (matches.length === 1)
        {
          parts[parts.length - 1] = matches[0];
          setInput(parts.join(" "));
          return;
        }

        if (matches.length > 1)
        {
          setLines((prev) => [...prev, matches.join("  ")]);
          return;
        }
      }
    }
  }

  return (
    <div id="terminal" className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div id="output" className="space-y-1">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="flex mt-2">
        <span className="mr-2">
          joao@portfolio:/{currentPath.join("/")}$ 
        </span>
        <input
          id="input"
          className="bg-transparent outline-none flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handlePressedKey}
          autoFocus
        />
      </div>
    </div>
  );
}