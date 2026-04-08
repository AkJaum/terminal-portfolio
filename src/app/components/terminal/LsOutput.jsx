import { getFileIcon } from "../../lib/file-icons";

export default function LsOutput({ entries }) {
  return (
    <div>
      {entries.map((entry, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "pre-wrap",
          }}
        >
          <span>{getFileIcon(entry.name, entry.isDir)}</span>
          <span style={{ color: entry.isDir ? "#8ab4ff" : "#ffffff" }}>
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  );
}
