"use client";

import ReactMarkdown from "react-markdown";
import VimLikeViewer from "./VimLikeViewer";

function getThemeStyles(variant) {
  const isTerminal = variant === "terminal";

  return {
    surface: isTerminal ? "#0b0f14" : "#ffffff",
    text: isTerminal ? "#d8e2ec" : "#1d2f3c",
    border: isTerminal ? "#23313f" : "#d0d8df",
    muted: isTerminal ? "#ffb3b3" : "#b42318",
  };
}

export default function FileContentViewer({ fileData, emptyMessage, variant = "gui" }) {
  const theme = getThemeStyles(variant);

  return (
    <div
      style={{
        minHeight: "100%",
        background: theme.surface,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        padding: "12px",
        boxSizing: "border-box",
      }}
    >
      {!fileData ? (
        <div>{emptyMessage || "Selecione um arquivo para visualizar."}</div>
      ) : fileData.viewerMode === "vim" ? (
        <VimLikeViewer fileName={fileData.file} content={fileData.content || ""} variant={variant} />
      ) : fileData.kind === "markdown" ? (
        <div style={{ whiteSpace: "normal", lineHeight: 1.55, fontSize: "0.95rem", color: theme.text }}>
          <ReactMarkdown>{fileData.content || ""}</ReactMarkdown>
        </div>
      ) : fileData.kind === "text" ? (
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", tabSize: 4, color: theme.text, background: theme.surface }}>
          {fileData.content || ""}
        </pre>
      ) : fileData.kind === "pdf" && fileData.content ? (
        <iframe
          src={`data:application/pdf;base64,${fileData.content}`}
          title={fileData.file || "PDF"}
          style={{ width: "100%", minHeight: "62vh", border: "none", borderRadius: "8px", background: theme.surface }}
        />
      ) : fileData.kind === "web" ? null : fileData.kind === "code" ? (
        <VimLikeViewer fileName={fileData.file} content={fileData.content || ""} variant={variant} />
      ) : (
        <div style={{ color: theme.muted }}>
          {fileData.message || "tipo de arquivo não suportado para visualização"}
        </div>
      )}
    </div>
  );
}