import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getTeam, saveTeam } from "@/lib/content";
import { normalizeTeamMember } from "@/lib/normalizers";

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

  const team = await getTeam();
  const index = team.findIndex((m) => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  const check = normalizeTeamMember(body, id);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const next = [...team];
  next[index] = check.value;

  const result = await saveTeam(next);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: check.value });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
  if (!(await isAuthed())) return unauthorized();
  const { id } = await params;

  const team = await getTeam();
  if (!team.some((m) => m.id === id)) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  const result = await saveTeam(team.filter((m) => m.id !== id));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}