import type { CSSProperties } from "react";

type TerminalStyle = {
  background?: string;
  bold?: boolean;
  dim?: boolean;
  foreground?: string;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  inverse?: boolean;
};

type TerminalCell = {
  character: string;
  style: TerminalStyle;
};

const normalColors = [
  "#1f2937", "#ef4444", "#22c55e", "#eab308",
  "#3b82f6", "#a855f7", "#06b6d4", "#e5e7eb",
];

const brightColors = [
  "#6b7280", "#f87171", "#4ade80", "#facc15",
  "#60a5fa", "#c084fc", "#22d3ee", "#ffffff",
];

function blankCell(): TerminalCell {
  return { character: " ", style: {} };
}

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

function toCss(style: TerminalStyle): CSSProperties {
  const foreground = style.inverse
    ? style.background || "#0d1017"
    : style.foreground;
  const background = style.inverse
    ? style.foreground || "#e6edf3"
    : style.background;
  return {
    backgroundColor: background,
    color: foreground,
    fontStyle: style.italic ? "italic" : undefined,
    fontWeight: style.bold ? 700 : undefined,
    opacity: style.dim ? 0.72 : undefined,
    textDecoration: [
      style.underline ? "underline" : "",
      style.strike ? "line-through" : "",
    ].filter(Boolean).join(" ") || undefined,
  };
}

function parameter(values: number[], index: number, fallback: number) {
  const value = values[index];
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export class TerminalScreenBuffer {
  readonly columns: number;
  readonly rows: number;
  private cells: TerminalCell[][];
  private column = 0;
  private currentStyle: TerminalStyle = {};
  private pending = "";
  private row = 0;
  private savedColumn = 0;
  private savedRow = 0;

  constructor(columns = 100, rows = 42) {
    this.columns = columns;
    this.rows = rows;
    this.cells = Array.from({ length: rows }, () => this.blankRow());
  }

  private blankRow() {
    return Array.from({ length: this.columns }, blankCell);
  }

  reset() {
    this.cells = Array.from({ length: this.rows }, () => this.blankRow());
    this.column = 0;
    this.row = 0;
    this.currentStyle = {};
    this.pending = "";
  }

  private scroll() {
    this.cells.shift();
    this.cells.push(this.blankRow());
    this.row = this.rows - 1;
  }

  private lineFeed() {
    this.row += 1;
    if (this.row >= this.rows) this.scroll();
  }

  private writeCharacter(character: string) {
    if (/\p{Mark}/u.test(character) && this.column > 0) {
      this.cells[this.row][this.column - 1].character += character;
      return;
    }
    if (this.column >= this.columns) {
      this.column = 0;
      this.lineFeed();
    }
    this.cells[this.row][this.column] = {
      character,
      style: { ...this.currentStyle },
    };
    this.column += 1;
  }

  private eraseDisplay(mode: number) {
    if (mode === 2 || mode === 3) {
      this.cells = Array.from({ length: this.rows }, () => this.blankRow());
      return;
    }
    if (mode === 0) {
      for (let column = this.column; column < this.columns; column += 1) {
        this.cells[this.row][column] = blankCell();
      }
      for (let row = this.row + 1; row < this.rows; row += 1) {
        this.cells[row] = this.blankRow();
      }
      return;
    }
    for (let row = 0; row < this.row; row += 1) {
      this.cells[row] = this.blankRow();
    }
    for (let column = 0; column <= this.column; column += 1) {
      this.cells[this.row][column] = blankCell();
    }
  }

  private eraseLine(mode: number) {
    const start = mode === 0 ? this.column : 0;
    const end = mode === 1 ? this.column + 1 : this.columns;
    for (let column = start; column < end; column += 1) {
      this.cells[this.row][column] = blankCell();
    }
  }

  private applySgr(values: number[]) {
    const codes = values.length === 0 ? [0] : values;
    for (let index = 0; index < codes.length; index += 1) {
      const code = codes[index];
      if (code === 0) this.currentStyle = {};
      else if (code === 1) this.currentStyle.bold = true;
      else if (code === 2) this.currentStyle.dim = true;
      else if (code === 3) this.currentStyle.italic = true;
      else if (code === 4) this.currentStyle.underline = true;
      else if (code === 7) this.currentStyle.inverse = true;
      else if (code === 9) this.currentStyle.strike = true;
      else if (code === 22) {
        delete this.currentStyle.bold;
        delete this.currentStyle.dim;
      } else if (code === 23) delete this.currentStyle.italic;
      else if (code === 24) delete this.currentStyle.underline;
      else if (code === 27) delete this.currentStyle.inverse;
      else if (code === 29) delete this.currentStyle.strike;
      else if (code >= 30 && code <= 37) {
        this.currentStyle.foreground = normalColors[code - 30];
      } else if (code === 39) delete this.currentStyle.foreground;
      else if (code >= 40 && code <= 47) {
        this.currentStyle.background = normalColors[code - 40];
      } else if (code === 49) delete this.currentStyle.background;
      else if (code >= 90 && code <= 97) {
        this.currentStyle.foreground = brightColors[code - 90];
      } else if (code >= 100 && code <= 107) {
        this.currentStyle.background = brightColors[code - 100];
      } else if ((code === 38 || code === 48) && codes[index + 1] === 5) {
        const color = indexedColor(codes[index + 2]);
        if (color && code === 38) this.currentStyle.foreground = color;
        if (color && code === 48) this.currentStyle.background = color;
        index += 2;
      } else if ((code === 38 || code === 48) && codes[index + 1] === 2) {
        const channels = codes.slice(index + 2, index + 5).map((channel) => (
          Math.max(0, Math.min(255, channel || 0))
        ));
        const color = `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
        if (code === 38) this.currentStyle.foreground = color;
        else this.currentStyle.background = color;
        index += 4;
      }
    }
  }

  private applyCsi(parameters: string, command: string) {
    const normalized = parameters.replace(/^\?/, "");
    const values = normalized === ""
      ? []
      : normalized.split(";").map((value) => Number(value || 0));
    if (command === "m") this.applySgr(values);
    else if (command === "H" || command === "f") {
      this.row = Math.min(this.rows - 1, parameter(values, 0, 1) - 1);
      this.column = Math.min(this.columns - 1, parameter(values, 1, 1) - 1);
    } else if (command === "A") {
      this.row = Math.max(0, this.row - parameter(values, 0, 1));
    } else if (command === "B") {
      this.row = Math.min(this.rows - 1, this.row + parameter(values, 0, 1));
    } else if (command === "C") {
      this.column = Math.min(this.columns - 1, this.column + parameter(values, 0, 1));
    } else if (command === "D") {
      this.column = Math.max(0, this.column - parameter(values, 0, 1));
    } else if (command === "G") {
      this.column = Math.min(this.columns - 1, parameter(values, 0, 1) - 1);
    } else if (command === "d") {
      this.row = Math.min(this.rows - 1, parameter(values, 0, 1) - 1);
    } else if (command === "J") this.eraseDisplay(values[0] || 0);
    else if (command === "K") this.eraseLine(values[0] || 0);
    else if (command === "s") {
      this.savedRow = this.row;
      this.savedColumn = this.column;
    } else if (command === "u") {
      this.row = this.savedRow;
      this.column = this.savedColumn;
    }
  }

  write(chunk: string) {
    const input = this.pending + chunk;
    this.pending = "";

    for (let index = 0; index < input.length;) {
      const character = input[index];
      if (character === "\u001b") {
        if (index + 1 >= input.length) {
          this.pending = input.slice(index);
          break;
        }
        if (input[index + 1] === "[") {
          let end = index + 2;
          while (end < input.length && !/[@-~]/.test(input[end])) end += 1;
          if (end >= input.length) {
            this.pending = input.slice(index);
            break;
          }
          this.applyCsi(input.slice(index + 2, end), input[end]);
          index = end + 1;
          continue;
        }
        if (input[index + 1] === "]") {
          const bell = input.indexOf("\u0007", index + 2);
          const terminator = input.indexOf("\u001b\\", index + 2);
          const end = bell === -1 ? terminator : bell;
          if (end === -1) {
            this.pending = input.slice(index);
            break;
          }
          index = end + (end === terminator ? 2 : 1);
          continue;
        }
        index += 2;
        continue;
      }
      if (character === "\r") {
        this.column = 0;
        index += 1;
        continue;
      }
      if (character === "\n") {
        this.lineFeed();
        index += 1;
        continue;
      }
      if (character === "\b") {
        this.column = Math.max(0, this.column - 1);
        index += 1;
        continue;
      }
      if (character === "\t") {
        this.column = Math.min(this.columns - 1, (Math.floor(this.column / 8) + 1) * 8);
        index += 1;
        continue;
      }
      const codePoint = input.codePointAt(index);
      if (codePoint === undefined) break;
      const printable = String.fromCodePoint(codePoint);
      if (codePoint >= 32 && codePoint !== 127) this.writeCharacter(printable);
      index += printable.length;
    }
  }

  renderRows() {
    return this.cells;
  }

  cursor() {
    return { column: this.column, row: this.row };
  }
}

export function TerminalScreen({
  buffer,
  running,
  version: _version,
}: {
  buffer: TerminalScreenBuffer;
  running: boolean;
  version: number;
}) {
  const cursor = buffer.cursor();
  return (
    <div
      className="ak-terminal-modal__terminal-canvas"
      role="log"
      aria-label="Interactive terminal output"
      style={{ "--ak-terminal-columns": buffer.columns } as CSSProperties}
    >
      {buffer.renderRows().map((row, rowIndex) => (
        <div className="ak-terminal-modal__terminal-row" key={rowIndex}>
          {row.map((cell, columnIndex) => {
            const isCursor = running
              && rowIndex === cursor.row
              && columnIndex === cursor.column;
            return (
              <span
                className={`ak-terminal-modal__terminal-cell${isCursor ? " ak-terminal-modal__terminal-cursor" : ""}`}
                key={columnIndex}
                style={toCss(cell.style)}
              >
                {cell.character}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
