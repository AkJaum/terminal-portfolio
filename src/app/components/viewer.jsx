"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FileContentViewer from "./FileContentViewer";

export default function FileViewer({ content, onClose, variant = "gui" }) {
  const [mounted, setMounted] = useState(false);
  const isTerminal = variant === "terminal";

  useEffect(() => {
    setMounted(true);

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(2px)",
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(92vw, 980px)",
          maxHeight: "88vh",
          backgroundColor: isTerminal ? "#111827" : "#ffffff",
          color: isTerminal ? "#ffffff" : "#1d2f3c",
          border: isTerminal ? "1px solid #8ab4ff" : "1px solid #d0d8df",
          borderRadius: "12px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.45)",
          padding: "18px 20px",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            border: "none",
            background: "transparent",
            color: isTerminal ? "#ff8a8a" : "#b42318",
            fontSize: "20px",
            cursor: "pointer",
          }}
          aria-label="Fechar visualizador"
        >
          ×
        </button>

        <div style={{ paddingRight: "8px" }}>
          <FileContentViewer fileData={content} emptyMessage="Nada para visualizar." variant={variant} />
        </div>
      </div>
    </div>,
    document.body
  );
}