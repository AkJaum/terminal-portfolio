import filesystem from "./filesystem";
import { COMMANDS, ls, cat, cd, pwd, help, clear, gui, aboutme, view } from "./terminal.service";

function runShellCommand(cmd, currentPath, setLines, setViewerContent, setViewerOpen) {
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  if (command === "ls") return ls(filesystem, currentPath);
  if (command === "cat") return cat(filesystem, currentPath, args[0]);
  if (command === "cd") return cd(filesystem, currentPath, args[0]);
  if (command === "pwd") return pwd(filesystem, currentPath);
  if (command === "help") return help(args[0]);
  if (command === "clear") return clear();
  if (command === "gui") return gui();
  if (command === "aboutme") return aboutme();

  if (command === "view") {
    const result = view(filesystem, currentPath, args[0]);
    if (result.error) return result;

    setViewerContent(result.output);
    setViewerOpen(true);
    return { type: "view" };
  }

  return { output: "comando não encontrado" };
}

function getCurrentDir(fs, path) {
  let dir = fs;
  for (const folder of path) {
    if (!dir[folder]) return null;
    dir = dir[folder];
  }
  return dir;
}

function autocompleteCommand(input, commands = COMMANDS) {
  return commands.filter((cmd) => cmd.startsWith(input));
}

function autocompletePath(input, path) {
  const dir = getCurrentDir(filesystem, path);
  if (!dir) return [];

  return Object.keys(dir).filter((name) => name.startsWith(input));
}

export { COMMANDS, autocompleteCommand, autocompletePath };
export default runShellCommand;
