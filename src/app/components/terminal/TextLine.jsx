import { useMemo } from "react";
import Typewriter from "./Typewriter";
import { getTypewriterConfig } from "../../lib/terminal-utils";

export default function TextLine({ text, isLast }) {
  const lineText = useMemo(
    () => (typeof text === "string" ? text : String(text ?? "")).replaceAll("\t", "    "),
    [text]
  );

  const { speed, step } = useMemo(() => getTypewriterConfig(lineText.length), [lineText.length]);
  const useTypewriter = useMemo(() => isLast && lineText.length > 0, [isLast, lineText.length]);

  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        tabSize: 4,
        margin: 0,
        willChange: useTypewriter ? "contents" : "auto",
        transform: "translateZ(0)",
      }}
    >
      {useTypewriter ? (
        <Typewriter text={lineText} speed={speed} step={step} />
      ) : (
        lineText
      )}
    </div>
  );
}
