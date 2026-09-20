import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getTeam, saveTeam } from "@/lib/content";
import { normalizeTeamMember } from "@/lib/normalizers";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  return NextResponse.json({ items: await getTeam() });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const team = await getTeam();
  const check = normalizeTeamMember(body);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const existingIds = new Set(team.map((m) => m.id));
  let id = check.value.id;
  if (existingIds.has(id)) {
    id = `${id}-${team.length + 1}`;
  }
  const member = { ...check.value, id };

  const result = await saveTeam([...team, member]);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ item: member }, { status: 201 });
}