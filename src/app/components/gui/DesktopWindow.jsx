"use client";

import { useRef, useState } from "react";

export default function DesktopWindow({
  id,
  title,
  x,
  y,
  width,
  height,
  zIndex,
  isMaximized,
  isClosing,
  desktopBounds,
  onFocus,
  onClose,
  onRequestClose,
  onToggleMaximize,
  onMinimize,
  onMove,
  onResize,
  children,
}) {
  const WINDOW_GAP = 10;
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const resizeRef = useRef({ active: false, startX: 0, startY: 0, originWidth: 0, originHeight: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  function handlePointerDown(event) {
    if (isMaximized || isClosing) {
      onFocus(id);
      return;
    }

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: x,
      originY: y,
    };

    setIsDragging(true);
    onFocus(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragRef.current.active || isMaximized || isClosing) return;

    const deltaX = event.clientX - dragRef.current.startX;
    const deltaY = event.clientY - dragRef.current.startY;
    const maxX = Math.max(0, (desktopBounds?.width || 0) - width);
    const maxY = Math.max(0, (desktopBounds?.height || 0) - height);
    const nextX = Math.min(maxX, Math.max(0, dragRef.current.originX + deltaX));
    const nextY = Math.min(maxY, Math.max(0, dragRef.current.originY + deltaY));

    onMove(id, nextX, nextY);
  }

  function handlePointerUp(event) {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleResizePointerDown(event) {
    if (isMaximized || isClosing) {
      onFocus(id);
      return;
    }

    event.stopPropagation();
    resizeRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originWidth: width,
      originHeight: height,
    };

    setIsResizing(true);
    onFocus(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizePointerMove(event) {
    if (!resizeRef.current.active || isMaximized || isClosing) return;

    const deltaX = event.clientX - resizeRef.current.startX;
    const deltaY = event.clientY - resizeRef.current.startY;
    const minWidth = 360;
    const minHeight = 240;
    const maxWidth = Math.max(minWidth, (desktopBounds?.width || 0) - x - 10);
    const maxHeight = Math.max(minHeight, (desktopBounds?.height || 0) - y - 10);
    const nextWidth = Math.min(maxWidth, Math.max(minWidth, resizeRef.current.originWidth + deltaX));
    const nextHeight = Math.min(maxHeight, Math.max(minHeight, resizeRef.current.originHeight + deltaY));

    onResize(id, nextWidth, nextHeight);
  }

  function handleResizePointerUp(event) {
    if (!resizeRef.current.active) return;

    resizeRef.current.active = false;
    setIsResizing(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const frameStyle = isMaximized
    ? {
        inset: `${WINDOW_GAP}px`,
      }
    : {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      };

  return (
    <section
      className={[
        "windowFrame",
        isMaximized ? "windowFrameMaximized" : "",
        isDragging ? "windowFrameDragging" : "",
        isResizing ? "windowFrameResizing" : "",
        isClosing ? "windowFrameClosing" : "",
      ].join(" ").trim()}
      style={{ ...frameStyle, zIndex }}
      onMouseDown={() => onFocus(id)}
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget || !isClosing) return;
        onClose(id);
      }}
      aria-label={title}
    >
      <header
        className={`windowHeader${isDragging ? " windowHeaderDragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <strong className="windowTitle">{title}</strong>
        <div className="windowActions" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" onClick={() => onMinimize(id)} title="Minimizar para desktop">
            −
          </button>
          <button type="button" onClick={() => onToggleMaximize(id)} title="Maximizar">
            {isMaximized ? "❐" : "□"}
          </button>
          <button type="button" onClick={() => onRequestClose(id)} title="Fechar">
            ×
          </button>
        </div>
      </header>
      <div className="windowBody">{children}</div>
      <div
        className="windowResizeHandle"
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
        title="Redimensionar janela"
        aria-label="Redimensionar janela"
      />
    </section>
  );
}
