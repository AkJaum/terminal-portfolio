"use client";

import { useEffect, useRef, useState } from "react";

export default function GameWindow({ url = "/gui_game/index.html" }) {
  const rootRef = useRef(null);
  const [frameSize, setFrameSize] = useState({ width: 1280, height: 720 });

  useEffect(() => {
    if (!rootRef.current) return;

    const ASPECT = 16 / 9;

    const updateSize = () => {
      if (!rootRef.current) return;
      const maxWidth = rootRef.current.clientWidth;
      const maxHeight = rootRef.current.clientHeight;
      if (!maxWidth || !maxHeight) return;

      let width = maxWidth;
      let height = Math.round(width / ASPECT);
      if (height > maxHeight) {
        height = maxHeight;
        width = Math.round(height * ASPECT);
      }

      setFrameSize({ width, height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="gameWindowRoot" ref={rootRef}>
      <div
        className="gameViewportFrame"
        style={{ width: `${frameSize.width}px`, height: `${frameSize.height}px` }}
      >
      <iframe
        title="Dungeon4Fun"
        src={url}
        className="gameIframe"
        allow="fullscreen; gamepad"
      />
      </div>
    </div>
  );
}
