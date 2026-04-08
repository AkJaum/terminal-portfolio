import { NextResponse } from "next/server";
import { listEntriesAtPath } from "../../../../backend/core/runner.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const currentPath = Array.isArray(body?.currentPath) ? body.currentPath : ["home"];

    const entries = await listEntriesAtPath(currentPath);

    return NextResponse.json({
      items: entries.map((item) => item.name),
      entries,
      currentPath,
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "erro ao listar diretório" }, { status: 400 });
  }
}
