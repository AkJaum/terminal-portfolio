import { useMemo } from "react";
import CommandLine from "./CommandLine";
import LsOutput from "./LsOutput";
import TextLine from "./TextLine";

export default function TerminalOutput({ lines }) {
  const renderedLines = useMemo(
    () =>
      lines.map((line, i) => {
        if (line && typeof line === "object" && line.type === "command") {
          return <CommandLine key={i} prompt={line.prompt} command={line.command} />;
        }

        if (line && typeof line === "object" && line.type === "gap") {
          return <div key={i} style={{ height: "0.75rem", willChange: "height" }} />;
        }

        if (line && typeof line === "object" && line.type === "ls") {
          return <LsOutput key={i} entries={line.entries} />;
        }

        const isLast = i === lines.length - 1;
        return <TextLine key={i} text={line} isLast={isLast} />;
      }),
    [lines]
  );

  return (
    <div
      id="output"
      className="space-y-1"
      style={{ willChange: "contents", transform: "translateZ(0)" }}
    >
      {renderedLines}
    </div>
  );
}
