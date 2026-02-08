import fs from "./file_system";
import { ls, cat, cd, pwd, help, clear } from "./commands";

// Execute a shell command
function runShellCommand(cmd, currentPath, setLines) {
  const parts = cmd.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  if (command === "ls")
    return ls(fs, currentPath);

  if (command === "cat")
    return cat(fs, currentPath, args[0]);

  if (command === "cd")
    return cd(fs, currentPath, args[0]);

  if (command === "pwd")
    return pwd(fs, currentPath);

  if (command === "help")
    return help(args[0]);

  if (command === "clear")
    return clear();

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

function autocompleteCommand(input, commands) {
  return commands.filter((cmd) => cmd.startsWith(input));
}

function autocompletePath(input, path) {
  const dir = getCurrentDir(fs, path);
  if (!dir) return [];

  return Object.keys(dir).filter((name) =>
    name.startsWith(input)
  );
}

export { autocompleteCommand, autocompletePath };
export default runShellCommand;
