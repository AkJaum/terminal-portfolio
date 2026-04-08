import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 20, step = 1, className = "", style = {} }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    let animationFrameId;
    let lastUpdateTime = 0;
    const safeStep = Math.max(1, Number(step) || 1);

    const animate = (currentTime) => {
      if (currentTime - lastUpdateTime >= speed) {
        i += safeStep;
        setDisplayed(text.slice(0, i));
        lastUpdateTime = currentTime;

        if (i < text.length) {
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text, speed, step]);

  return (
    <span
      className={className}
      style={{
        whiteSpace: "pre-wrap",
        tabSize: 4,
        willChange: "contents",
        ...style,
      }}
    >
      {displayed}
    </span>
  );
}
