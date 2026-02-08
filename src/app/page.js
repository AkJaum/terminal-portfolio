import Image from "next/image";

export default function Home() {
  return (
  <div id="terminal">
    <div id="output"></div>
    <div id="input-line">
      <span className="prompt">joao@portfolio:~$</span>
      <input id="command" autofocus />
    </div>
  </div>
  );
}
