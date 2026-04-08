"use client";

export default function EmbeddedAppWindow({ title, url }) {
  return (
    <div className="embeddedAppRoot">
      <iframe
        title={title}
        src={url}
        className="embeddedAppIframe"
        allow="fullscreen; gamepad"
      />
    </div>
  );
}