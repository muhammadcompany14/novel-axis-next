import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getTestimonials, saveTestimonials } from "@/lib/content";
import { normalizeTestimonial } from "@/lib/normalizers";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  return NextResponse.json({ items: await getTestimonials() });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = await getTestimonials();
  const check = normalizeTestimonial(body);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const existingIds = new Set(items.map((t) => t.id));
  let id = check.value.id;
  if (existingIds.has(id)) {
    id = `${id}-${items.length + 1}`;
  }
  const item = { ...check.value, id };

  const result = await saveTestimonials([...items, item]);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item }, { status: 201 });
}