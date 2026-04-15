import { NextResponse } from "next/server";
import * as terminalService from "../../../../backend/core/terminal.service";

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

    if (command === "ls") result = await terminalService.lsRuntime(currentPath);
    else if (command === "cat") result = await terminalService.catRuntime(currentPath, args[0]);
    else if (command === "cd") result = await terminalService.cdRuntime(currentPath, args[0]);
    else if (command === "make") result = await terminalService.makeRuntime(currentPath, args);
    else if (command === "run") result = await terminalService.runRuntime(currentPath, args[0], args.slice(1));
    else if (command === "reclone") result = await terminalService.recloneRuntime(currentPath);
    else if (command.startsWith("./")) result = await terminalService.runRuntime(currentPath, command, args);
    else if (command === "pwd") result = terminalService.pwd(null, currentPath);
    else if (command === "help") result = terminalService.help(args[0]);
    else if (command === "clear") result = terminalService.clear();
    else if (command === "gui") result = terminalService.gui();
    else if (command === "aboutme") result = terminalService.aboutme();
    else if (command === "view") result = await terminalService.viewRuntime(currentPath, args[0]);
    else if (command === "vim") result = await terminalService.vimRuntime(currentPath, args[0]);
    else result = { output: "comando não encontrado" };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }
}
