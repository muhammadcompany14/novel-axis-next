import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getServices, saveServices } from "@/lib/content";
import { normalizeService } from "@/lib/normalizers";
import type { Service } from "@/data/services";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  return NextResponse.json({ items: await getServices() });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const services = await getServices();
  const existingIds = new Set(services.map((s) => s.id));
  const nextIndex = String(services.length + 1).padStart(2, "0");

  const check = normalizeService(body, undefined, nextIndex);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  let id = check.value.id;
  if (existingIds.has(id)) {
    id = `${id}-${services.length + 1}`;
  }
  const service: Service = { ...check.value, id };

  const result = await saveServices([...services, service]);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: service }, { status: 201 });
}