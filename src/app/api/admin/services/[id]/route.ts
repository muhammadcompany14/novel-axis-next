import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getServices, saveServices } from "@/lib/content";
import { normalizeService } from "@/lib/normalizers";

type RouteContext = { params: Promise<{ id: string }> };

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function PUT(req: Request, { params }: RouteContext) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const services = await getServices();
  const index = services.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const check = normalizeService(body, id, services[index].index);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const next = [...services];
  next[index] = check.value;

  const result = await saveServices(next);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: check.value });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  const services = await getServices();
  if (!services.some((s) => s.id === id)) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const result = await saveServices(services.filter((s) => s.id !== id));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}