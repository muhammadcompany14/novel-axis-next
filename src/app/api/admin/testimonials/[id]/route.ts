import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getTestimonials, saveTestimonials } from "@/lib/content";
import { normalizeTestimonial } from "@/lib/normalizers";

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

  const items = await getTestimonials();
  const index = items.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  const check = normalizeTestimonial(body, id);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const next = [...items];
  next[index] = check.value;

  const result = await saveTestimonials(next);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: check.value });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  const items = await getTestimonials();
  if (!items.some((t) => t.id === id)) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  }

  const result = await saveTestimonials(items.filter((t) => t.id !== id));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}