"use client";

import { useMemo, useRef, useState } from "react";

function normalizeUrl(rawUrl) {
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export default function BrowserWindow({ title, initialUrl }) {
  const iframeRef = useRef(null);
  const startingUrl = useMemo(() => normalizeUrl(initialUrl), [initialUrl]);
  const [currentUrl, setCurrentUrl] = useState(startingUrl);
  const [addressInput, setAddressInput] = useState(startingUrl);
  const [historyStack, setHistoryStack] = useState(startingUrl ? [startingUrl] : []);
  const [historyIndex, setHistoryIndex] = useState(startingUrl ? 0 : -1);

  function navigateTo(rawUrl, pushHistory = true) {
    const normalized = normalizeUrl(rawUrl);
    if (!normalized) return;

    setCurrentUrl(normalized);
    setAddressInput(normalized);

    if (!pushHistory) return;

    setHistoryStack((prev) => {
      const base = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : [];
      if (base[base.length - 1] === normalized) return base;
      const next = [...base, normalized];
      setHistoryIndex(next.length - 1);
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    navigateTo(addressInput, true);
  }

  function goBack() {
    let usedIframeHistory = false;
    try {
      const frameWindow = iframeRef.current?.contentWindow;
      if (frameWindow?.history) {
        frameWindow.history.back();
        usedIframeHistory = true;
      }
    } catch {
      usedIframeHistory = false;
    }

    if (usedIframeHistory) return;
    if (historyIndex <= 0) return;

    const previousIndex = historyIndex - 1;
    const target = historyStack[previousIndex];
    if (!target) return;

    setHistoryIndex(previousIndex);
    navigateTo(target, false);
  }

  function goForward() {
    let usedIframeHistory = false;
    try {
      const frameWindow = iframeRef.current?.contentWindow;
      if (frameWindow?.history) {
        frameWindow.history.forward();
        usedIframeHistory = true;
      }
    } catch {
      usedIframeHistory = false;
    }

    if (usedIframeHistory) return;
    if (historyIndex < 0 || historyIndex >= historyStack.length - 1) return;

    const nextIndex = historyIndex + 1;
    const target = historyStack[nextIndex];
    if (!target) return;

    setHistoryIndex(nextIndex);
    navigateTo(target, false);
  }

  function openInNewTab() {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="browserRoot">
      <form className="browserToolbar" onSubmit={handleSubmit}>
        <button type="button" className="browserButton" onClick={goBack} title="Voltar">
          &#x2190;
        </button>
        <button type="button" className="browserButton" onClick={goForward} title="Avancar">
          &#x2192;
        </button>

        <input
          className="browserAddress"
          value={addressInput}
          onChange={(event) => setAddressInput(event.target.value)}
          placeholder="https://example.com"
          aria-label="URL"
        />

        <button type="submit" className="browserButton browserGoButton" title="Ir para URL">
          Go
        </button>

        <button type="button" className="browserButton browserOpenTabButton" onClick={openInNewTab} title="Open in new tab">
          Open in new tab
        </button>
      </form>

      <div className="browserViewport">
        {currentUrl ? (
          <iframe
            ref={iframeRef}
            title={title}
            src={currentUrl}
            className="embeddedAppIframe"
            allow="fullscreen; gamepad"
          />
        ) : (
          <div className="browserEmptyState">Informe uma URL valida para carregar o site.</div>
        )}
      </div>
    </div>
  );
}
