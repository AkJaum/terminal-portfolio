export const FILE_ICONS = {
  py: "🐍",
  js: "📜",
  ts: "📘",
  jsx: "⚛️",
  tsx: "⚛️",
  json: "{}",
  pdf: "📕",
  md: "📝",
  txt: "📄",
  html: "🌐",
  web: "🌐",
  css: "🎨",
  c: "©️",
  h: "©️",
  make: "🔨",
  makefile: "🔨",
  git: "🔧",
  gitignore: "🚫",
  dockerfile: "🐳",
  yml: "⚙️",
  yaml: "⚙️",
  sh: "🔧",
  bash: "🔧",
  app: "🎮",
  default: "📄",
};

export function getFileIcon(name, isDir) {
  if (isDir) return "📁";
  if (name === "Terminal") return "🖥️";
  if (name === "dungeon4fun") return "🎮";
  if (name === "README") return "ℹ️";
  const ext = name.split(".").pop().toLowerCase();
  return FILE_ICONS[ext] || FILE_ICONS.default;
}
