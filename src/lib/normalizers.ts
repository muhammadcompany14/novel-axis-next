import type { Service, ServiceIcon, ServiceItem } from "@/data/services";
import type { TeamMember } from "@/data/team";
import type { Testimonial } from "@/data/testimonials";
import { slugify } from "./project-utils";

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];

const isServiceIcon = (value: unknown): value is ServiceIcon =>
  value === "shopify" ||
  value === "web" ||
  value === "uiux" ||
  value === "apps" ||
  value === "wordpress" ||
  value === "squarespace";

export function initialsFromName(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "NA"
  );
}

export type NormalizeResult<T> = { ok: true; value: T } | { ok: false; error: string };

function itemsFrom(raw: unknown): ServiceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
    .map((item) => ({
      name: str(item.name).trim(),
      desc: str(item.desc).trim(),
    }))
    .filter((item) => item.name);
}

export function normalizeService(
  raw: unknown,
  id?: string,
  nextIndex = "",
): NormalizeResult<Service> {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid service payload" };
  }
  const obj = raw as Record<string, unknown>;
  const name = str(obj.name).trim();
  if (!name) return { ok: false, error: "Service name is required" };

  const icon = isServiceIcon(obj.icon) ? obj.icon : "web";

  const service: Service = {
    id: id ?? ((typeof obj.id === "string" ? obj.id : "") || slugify(name)),
    index: str(obj.index).trim() || nextIndex,
    name,
    shortName: str(obj.shortName).trim() || name,
    tagline: str(obj.tagline),
    description: str(obj.description),
    icon,
    items: itemsFrom(obj.items),
    highlight: str(obj.highlight),
  };
  return { ok: true, value: service };
}

export function normalizeTeamMember(
  raw: unknown,
  id?: string,
): NormalizeResult<TeamMember> {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid team member payload" };
  }
  const obj = raw as Record<string, unknown>;
  const name = str(obj.name).trim();
  if (!name) return { ok: false, error: "Member name is required" };

  const member: TeamMember = {
    id: id ?? ((typeof obj.id === "string" ? obj.id : "") || slugify(name)),
    name,
    title: str(obj.title),
    specialty: str(obj.specialty),
    tech: strList(obj.tech).map((t) => t.trim()).filter(Boolean),
    initials: str(obj.initials).trim() || initialsFromName(name),
    accent: /^#[0-9a-fA-F]{3,8}$/.test(str(obj.accent)) ? str(obj.accent) : "#c8956c",
    photo: str(obj.photo),
  };
  return { ok: true, value: member };
}

export function normalizeTestimonial(
  raw: unknown,
  id?: string,
): NormalizeResult<Testimonial> {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid testimonial payload" };
  }
  const obj = raw as Record<string, unknown>;
  const quote = str(obj.quote).trim();
  const name = str(obj.name).trim();
  if (!quote) return { ok: false, error: "Quote is required" };
  if (!name) return { ok: false, error: "Reviewer name is required" };

  const testimonial: Testimonial = {
    id: id ?? ((typeof obj.id === "string" ? obj.id : "") || slugify(name)),
    quote,
    name,
    role: str(obj.role),
    company: str(obj.company),
    initial: str(obj.initial).trim() || initialsFromName(name),
  };
  return { ok: true, value: testimonial };
}