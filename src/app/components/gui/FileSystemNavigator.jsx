"use client";

import { useEffect, useMemo, useState } from "react";
import { getFileIcon } from "../../lib/file-icons";
import FileContentViewer from "../FileContentViewer";

export default function FileSystemNavigator({
  windowId,
  initialPath,
  initialFile,
  onPathChange,
  onOpenFileProgram,
  onOpenTerminalAtPath,
}) {
  const [currentPath, setCurrentPath] = useState(
    Array.isArray(initialPath) && initialPath.length > 0 ? initialPath : ["home"]
  );
  const [entries, setEntries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(initialFile || null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  function openTerminalAtPath(path) {
    if (!onOpenTerminalAtPath) return;
    onOpenTerminalAtPath(path);
    setContextMenu(null);
  }

  useEffect(() => {
    async function loadDirectory() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/fs/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPath }),
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.error || "erro ao carregar diretório");
        }

        const normalizedEntries = Array.isArray(payload?.entries)
          ? payload.entries.map((entry) => ({
              name: entry.name,
              isDir: entry.type === "dir",
            }))
          : [];

        normalizedEntries.sort(
          (a, b) => Number(b.isDir) - Number(a.isDir) || a.name.localeCompare(b.name)
        );

        setEntries(normalizedEntries);
      } catch (err) {
        setEntries([]);
        setError(err?.message || "erro ao carregar diretório");
      } finally {
        setIsLoading(false);
      }
    }

    loadDirectory();
  }, [currentPath]);

  useEffect(() => {
    if (!initialFile) return;
    openFile(initialFile);
    // initialFile is only used once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breadcrumb = useMemo(() => currentPath.join("/"), [currentPath]);

  useEffect(() => {
    if (!onPathChange) return;
    const label = selectedFile ? `${breadcrumb}/${selectedFile}` : breadcrumb;
    onPathChange(windowId, label);
  }, [breadcrumb, selectedFile, onPathChange, windowId]);

  useEffect(() => {
    function closeContextMenu() {
      setContextMenu(null);
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    }

    window.addEventListener("click", closeContextMenu);
    window.addEventListener("scroll", closeContextMenu, true);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("scroll", closeContextMenu, true);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function openFile(fileName) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fs/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPath, file: fileName }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "erro ao ler arquivo");
      }

      setSelectedFile(fileName);
      setPreviewData(payload);
      return payload;
    } catch (err) {
      setSelectedFile(fileName);
      setPreviewData(null);
      setError(err?.message || "erro ao ler arquivo");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEntryDoubleClick(entry) {
    if (entry.isDir) return;

    const payload = await openFile(entry.name);
    if (!payload || !onOpenFileProgram) return;

    onOpenFileProgram({
      payload,
      fileName: entry.name,
      currentPath,
    });
  }

  function openEntry(entry) {
    if (entry.isDir) {
      setCurrentPath((prev) => [...prev, entry.name]);
      setSelectedFile(null);
      setPreviewData(null);
      setError(null);
      return;
    }

    openFile(entry.name);
  }

  function handleRootContextMenu(event) {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      path: currentPath,
      label: breadcrumb,
    });
  }

  function handleEntryContextMenu(event, entry) {
    if (!entry.isDir) return;
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      path: [...currentPath, entry.name],
      label: `${breadcrumb}/${entry.name}`,
    });
  }

  function goBack() {
    setCurrentPath((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
    setSelectedFile(null);
    setPreviewData(null);
    setError(null);
  }

  return (
    <div className="explorerRoot" onContextMenu={handleRootContextMenu}>
      <div className="explorerToolbar">
        <button
          type="button"
          onClick={goBack}
          disabled={currentPath.length <= 1}
          className="explorerBackButton"
          aria-label="Voltar"
          title="Voltar"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.5 5L8 11.5L14.5 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span>{breadcrumb}</span>
      </div>

      <div className="explorerLayout">
        <div className="explorerList">
          {entries.map((entry) => (
            <button
              key={entry.name}
              type="button"
              className="explorerEntry"
              onClick={() => openEntry(entry)}
              onDoubleClick={() => handleEntryDoubleClick(entry)}
              onContextMenu={(event) => handleEntryContextMenu(event, entry)}
            >
              <span>{getFileIcon(entry.name, entry.isDir)}</span>
              <span>{entry.name}</span>
            </button>
          ))}
          {entries.length === 0 && !isLoading && !error ? (
            <div className="explorerEmpty">Diretório vazio</div>
          ) : null}
        </div>

        <div className="explorerPreview">
          {isLoading
            ? "Carregando..."
            : error
              ? `Erro: ${error}`
              : (
                <FileContentViewer
                  fileData={previewData}
                  emptyMessage="Selecione um arquivo para visualizar o conteúdo."
                />
              )}
        </div>
      </div>

      {contextMenu ? (
        <div
          className="explorerContextMenu"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="explorerContextMenuItem"
            onClick={() => openTerminalAtPath(contextMenu.path)}
          >
            Abrir terminal nesta pasta
          </button>
          <div className="explorerContextMenuHint">{contextMenu.label}</div>
        </div>
      ) : null}
    </div>
  );
}
