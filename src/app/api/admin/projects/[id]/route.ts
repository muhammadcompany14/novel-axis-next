import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getProjects, saveProjects } from "@/lib/content";
import { normalizeProject } from "@/lib/project-utils";

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

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const check = normalizeProject(body, id);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const next = [...projects];
  next[index] = check.project;

  const result = await saveProjects(next);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: check.project });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  const projects = await getProjects();
  const exists = projects.some((p) => p.id === id);
  if (!exists) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const result = await saveProjects(projects.filter((p) => p.id !== id));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}