import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getProjects, saveProjects } from "@/lib/content";
import { normalizeProject, uniqueId } from "@/lib/project-utils";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  const projects = await getProjects();
  return NextResponse.json({ items: projects });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const projects = await getProjects();
  const existingIds = new Set(projects.map((p) => p.id));

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid project payload" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";

  const check = normalizeProject(body);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const project = { ...check.project, id: uniqueId(title || "project", [...existingIds]) };
  if (existingIds.has(project.id)) {
    return NextResponse.json({ error: "Project id collision" }, { status: 409 });
  }

  const result = await saveProjects([...projects, project]);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: project }, { status: 201 });
}