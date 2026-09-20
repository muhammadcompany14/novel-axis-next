import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { storeImage } from "@/lib/uploads";

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = typeof body === "object" && body !== null
    ? (body as Record<string, unknown>).data
    : undefined;
  if (typeof data !== "string" || !data.startsWith("data:image/")) {
    return NextResponse.json({ error: "Expected { data: \"data:image/...;base64,...\" }" }, { status: 400 });
  }

  const outcome = await storeImage(data);
  if ("error" in outcome) {
    return NextResponse.json({ error: outcome.error }, { status: 400 });
  }

  return NextResponse.json({ url: outcome.url });
}