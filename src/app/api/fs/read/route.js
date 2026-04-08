import { NextResponse } from "next/server";
import { readFilePayloadAtPath } from "../../../../backend/core/runner.service";

export async function POST(req) {
  try {
    const body = await req.json();
    const currentPath = Array.isArray(body?.currentPath) ? body.currentPath : ["home"];
    const file = typeof body?.file === "string" ? body.file : "";

    const payload = await readFilePayloadAtPath(currentPath, file);
    return NextResponse.json({ ...payload, file, currentPath });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "erro ao ler arquivo" }, { status: 400 });
  }
}
