export default function CommandLine({ prompt, command }) {
  return (
    <div style={{ whiteSpace: "pre-wrap", margin: 0 }}>
      <span style={{ color: "#8ab4ff", fontWeight: 800 }}>{prompt}</span>
      <span style={{ color: "#ffffff" }}> {command}</span>
    </div>
  );
}
