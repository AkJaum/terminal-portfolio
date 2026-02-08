const COMMANDS = ["ls", "cd", "cat", "pwd", "help", "clear"];

export default COMMANDS;

function getCurrentDir(fs, path)
{
  return path.reduce((dir, folder) => {
    if (!dir[folder])
      throw "diretório não existe";
    return dir[folder];
  }, fs);
}

// Declare commands at this session
function cd(fs, currentPath, target)
{
  if (!target || target === "~")
    return ["home"];

  if (target === "/")
    return ["home"];

  let newPath = [...currentPath];

  const parts = target.split("/").filter(Boolean);

  // Navigate through each part of the path
  for (const part of parts) {
    if (part === "..") {
      if (newPath.length > 1)
        newPath.pop();
      continue;
    }

    // Get the current directory
    const dir = getCurrentDir(fs, newPath);
    if (dir.error)
      return { error: dir.error };

    if (!dir[part])
      return { error: "diretório não existe" };

    if (typeof dir[part] !== "object")
      return { error: "não é um diretório" };

    // Move into the directory
    newPath.push(part);
  }
  return { newPath };
}

function ls(fs, path)
{
  // Get the current directory
  const dir = getCurrentDir(fs, path);

  if (dir.error)
    return { error: dir.error };
  if (typeof dir !== "object")
    return { error: "não é um diretório" };

  // List directory contents
  return { output: Object.keys(dir).join("  ") };
}

function cat(fs, path, file)
{
  // Get the current directory
  const dir = getCurrentDir(fs, path);

  if (dir.error)
    return { error: dir.error };

  if (!file)
    return { error: "arquivo não especificado" };

  if (!dir[file])
    return { error: "arquivo não existe" };

  if (typeof dir[file] === "object")
    return { error: "é um diretório" };

  // Display file contents
  return { output: dir[file] };
}

function pwd(fs, path)
{
  return { output: "/" + path.slice(1).join("/") };
}

function help()
{
  return { output: "Comandos disponíveis: " + COMMANDS.join(", ") + ". Se você não sabe como usar um terminal, use o comando GUI para abrir a interface gráfica." };
}

function clear()
{
  return { type: "clear" };
}

export { ls, cat, cd, pwd, help, clear };