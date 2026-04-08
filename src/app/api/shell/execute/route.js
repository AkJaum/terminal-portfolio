import { NextResponse } from "next/server";
import { cdRuntime, catRuntime, lsRuntime, viewRuntime, vimRuntime, makeRuntime, runRuntime, pwd, help, clear, gui, aboutme } from "../../../../backend/core/terminal.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input : "";
    const currentPath = Array.isArray(body?.currentPath) ? body.currentPath : ["home"];

    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!command) return NextResponse.json({ error: "comando vazio" }, { status: 400 });

    let result;

    if (command === "ls") result = await lsRuntime(currentPath);
    else if (command === "cat") result = await catRuntime(currentPath, args[0]);
    else if (command === "cd") result = await cdRuntime(currentPath, args[0]);
    else if (command === "make") result = await makeRuntime(currentPath, args);
    else if (command === "run") result = await runRuntime(currentPath, args[0], args.slice(1));
    else if (command.startsWith("./")) result = await runRuntime(currentPath, command, args);
    else if (command === "pwd") result = pwd(null, currentPath);
    else if (command === "help") result = help(args[0]);
    else if (command === "clear") result = clear();
    else if (command === "gui") result = gui();
    else if (command === "aboutme") result = aboutme();
    else if (command === "view") result = await viewRuntime(currentPath, args[0]);
    else if (command === "vim") result = await vimRuntime(currentPath, args[0]);
    else result = { output: "comando não encontrado" };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }
}
