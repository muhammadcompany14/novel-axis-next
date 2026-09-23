import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/content";
import type { AdminSettings } from "@/lib/types";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
const strArr = (v: unknown, fallback: string[]) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : fallback;

export async function GET() {
  if (!(await isAuthed())) return unauthorized();
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const current = await getSettings();
  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const footer = (body.footer ?? {}) as Record<string, unknown>;
  const hero = (body.hero ?? {}) as Record<string, unknown>;
  const cta = (body.cta ?? {}) as Record<string, unknown>;

  const patch: Partial<AdminSettings> = {
    email: str(body.email, current.email),
    phone: str(body.phone, current.phone),
    contact: {
      infoText: str(contact.infoText, current.contact.infoText),
      socials: strArr(contact.socials, current.contact.socials),
    },
    footer: {
      tagline: str(footer.tagline, current.footer.tagline),
      socials: strArr(footer.socials, current.footer.socials),
      copyright: str(footer.copyright, current.footer.copyright),
    },
    hero: {
      label: str(hero.label, current.hero.label),
      copy: str(hero.copy, current.hero.copy),
    },
    cta: {
      label: str(cta.label, current.cta.label),
      copy: str(cta.copy, current.cta.copy),
    },
  };

  const result = await saveSettings(patch);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ settings: await getSettings() });
}