import type { CSSProperties, ReactNode } from "react";

type AnsiStyle = CSSProperties & {
  fontWeight?: CSSProperties["fontWeight"];
};

const normalColors = [
  "#1f2937", "#ef4444", "#22c55e", "#eab308",
  "#3b82f6", "#a855f7", "#06b6d4", "#e5e7eb",
];

const brightColors = [
  "#6b7280", "#f87171", "#4ade80", "#facc15",
  "#60a5fa", "#c084fc", "#22d3ee", "#ffffff",
];

function indexedColor(index: number) {
  if (index < 8) return normalColors[index];
  if (index < 16) return brightColors[index - 8];
  if (index >= 232 && index <= 255) {
    const channel = 8 + (index - 232) * 10;
    return `rgb(${channel}, ${channel}, ${channel})`;
  }
  if (index >= 16 && index <= 231) {
    const value = index - 16;
    const red = Math.floor(value / 36);
    const green = Math.floor((value % 36) / 6);
    const blue = value % 6;
    const channel = (part: number) => part === 0 ? 0 : 55 + part * 40;
    return `rgb(${channel(red)}, ${channel(green)}, ${channel(blue)})`;
  }
  return undefined;
}

function applySgr(style: AnsiStyle, rawCodes: string) {
  const codes = rawCodes === "" ? [0] : rawCodes.split(";").map(Number);

  for (let index = 0; index < codes.length; index += 1) {
    const code = codes[index];
    if (code === 0) Object.keys(style).forEach((key) => delete style[key as keyof AnsiStyle]);
    else if (code === 1) style.fontWeight = 700;
    else if (code === 2) style.opacity = 0.72;
    else if (code === 3) style.fontStyle = "italic";
    else if (code === 4) style.textDecoration = "underline";
    else if (code === 7) style.filter = "invert(1)";
    else if (code === 9) style.textDecoration = "line-through";
    else if (code === 22) { delete style.fontWeight; delete style.opacity; }
    else if (code === 23) delete style.fontStyle;
    else if (code === 24 || code === 29) delete style.textDecoration;
    else if (code === 27) delete style.filter;
    else if (code >= 30 && code <= 37) style.color = normalColors[code - 30];
    else if (code === 39) delete style.color;
    else if (code >= 40 && code <= 47) style.backgroundColor = normalColors[code - 40];
    else if (code === 49) delete style.backgroundColor;
    else if (code >= 90 && code <= 97) style.color = brightColors[code - 90];
    else if (code >= 100 && code <= 107) style.backgroundColor = brightColors[code - 100];
    else if ((code === 38 || code === 48) && codes[index + 1] === 5) {
      const color = indexedColor(codes[index + 2]);
      if (color) style[code === 38 ? "color" : "backgroundColor"] = color;
      index += 2;
    } else if ((code === 38 || code === 48) && codes[index + 1] === 2) {
      const red = Math.max(0, Math.min(255, codes[index + 2]));
      const green = Math.max(0, Math.min(255, codes[index + 3]));
      const blue = Math.max(0, Math.min(255, codes[index + 4]));
      style[code === 38 ? "color" : "backgroundColor"] = `rgb(${red}, ${green}, ${blue})`;
      index += 4;
    }
  }
}

export function AnsiText({ text }: { text: string }) {
  const output: ReactNode[] = [];
  const style: AnsiStyle = {};
  const controlPattern = /\u001b\[([0-9;?]*)([A-Za-z])/g;
  let cursor = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  function append(value: string) {
    if (!value) return;
    output.push(Object.keys(style).length > 0
      ? <span key={key++} style={{ ...style }}>{value}</span>
      : <span key={key++}>{value}</span>);
  }

  while ((match = controlPattern.exec(text)) !== null) {
    append(text.slice(cursor, match.index));
    const [, parameters, command] = match;
    if (command === "m") applySgr(style, parameters);
    if (
      (command === "J" && (parameters === "" || parameters === "2" || parameters === "3"))
      || ((command === "H" || command === "f") && (parameters === "" || parameters === "1;1"))
    ) {
      output.length = 0;
    }
    cursor = controlPattern.lastIndex;
  }

  append(text.slice(cursor).replace(/\u001b\][^\u0007]*(?:\u0007|$)/g, ""));
  return <>{output}</>;
}
