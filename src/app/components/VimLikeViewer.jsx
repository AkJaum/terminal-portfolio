function detectLanguage(fileName = "") {
  const ext = String(fileName).split(".").pop()?.toLowerCase() || "";
  if (["c", "h", "hpp", "cpp"].includes(ext)) return "c";
  if (ext === "py") return "python";
  if (["js", "jsx", "ts", "tsx", "mjs", "cjs"].includes(ext)) return "javascript";
  return "generic";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const KEYWORDS = {
  c: [
    "if", "else", "for", "while", "return", "switch", "case", "break", "continue",
    "struct", "typedef", "enum", "const", "static", "void", "int", "char", "long",
    "float", "double", "unsigned", "sizeof", "include", "define",
  ],
  python: [
    "def", "class", "if", "elif", "else", "for", "while", "return", "import", "from",
    "as", "try", "except", "finally", "with", "yield", "lambda", "pass", "break",
    "continue", "True", "False", "None",
  ],
  javascript: [
    "function", "const", "let", "var", "if", "else", "for", "while", "return", "import",
    "from", "export", "default", "class", "extends", "new", "try", "catch", "finally",
    "await", "async",
  ],
  generic: [
    "if", "else", "for", "while", "return", "class", "function", "const", "let", "import",
    "export", "def", "include",
  ],
};

function highlightCode(code, language) {
  const escaped = escapeHtml(code);

  const withStrings = escaped.replace(
    /("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g,
    '<span class="vimString">$1</span>'
  );
  const withNumbers = withStrings.replace(/\b([0-9]+)\b/g, '<span class="vimNumber">$1</span>');
  const withComments = withNumbers
    .replace(/(#.*)$/gm, '<span class="vimComment">$1</span>')
    .replace(/(\/\/.*)$/gm, '<span class="vimComment">$1</span>');

  const keywords = KEYWORDS[language] || KEYWORDS.generic;
  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");

  return withComments.replace(keywordRegex, '<span class="vimKeyword">$1</span>');
}

export default function VimLikeViewer({ fileName, content, variant = "gui" }) {
  const language = detectLanguage(fileName);
  const html = highlightCode(content || "", language);
  const isTerminal = variant === "terminal";

  return (
    <div
      className="vimRoot"
      style={{
        background: isTerminal ? "#0b0f14" : "#ffffff",
        color: isTerminal ? "#d8e2ec" : "#1d2f3c",
        borderColor: isTerminal ? "#23313f" : "#d0d8df",
      }}
    >
      <div
        className="vimHeader"
        style={{
          background: isTerminal ? "#101a22" : "#f4f7fa",
          color: isTerminal ? "#95a6b5" : "#334155",
          borderBottomColor: isTerminal ? "#23313f" : "#d0d8df",
        }}
      >
        vim -R {fileName || "arquivo"}
      </div>
      <pre
        className="vimBody"
        style={{
          color: isTerminal ? "#d8e2ec" : "#1d2f3c",
          background: isTerminal ? "#0b0f14" : "#ffffff",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
