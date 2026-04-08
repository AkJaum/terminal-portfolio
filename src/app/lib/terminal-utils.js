export function shouldLockForClone(rawInput) {
  const PROJECT_IDS = ["push_swap", "get_next_line", "printf", "libft"];
  const parts = String(rawInput || "").trim().split(/\s+/);
  const command = parts[0];
  const target = parts[1] || "";

  if (command !== "cd") return false;
  if (!target || target === "/" || target === "~" || target === "..") return false;

  return PROJECT_IDS.some((projectId) => target.includes(projectId));
}

export function getTypewriterConfig(lineLength) {
  if (lineLength > 900) {
    return { speed: 8, step: 3 };
  }
  if (lineLength > 500) {
    return { speed: 12, step: 2 };
  }
  return { speed: 20, step: 1 };
}
