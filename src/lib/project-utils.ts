import type { Project } from "@/data/projects";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function uniqueId(title: string, existing: string[]): string {
  const base = slugify(title) || "project";
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export type ProjectInput = Omit<Project, "id"> &
  Partial<Pick<Project, "id">>;

export function normalizeProject(
  raw: unknown,
  id?: string,
): { ok: true; project: Project } | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid project payload" };
  }
  const obj = raw as Record<string, unknown>;
  const title = typeof obj.title === "string" ? obj.title.trim() : "";
  if (!title) return { ok: false, error: "Title is required" };

  const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);
  const strArr = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  const images = strArr(obj.images).map((i) => i.trim()).filter(Boolean);

  const project: Project = {
    id: id ?? (typeof obj.id === "string" ? obj.id : ""),
    title,
    category: str(obj.category, "Website"),
    year: str(obj.year, String(new Date().getFullYear())),
    description: str(obj.description, ""),
    tech: strArr(obj.tech),
    image: str(obj.image, "") || images[0] || "",
    accent: str(obj.accent, "#c8956c"),
    results: strArr(obj.results),
    images,
  };
  return { ok: true, project };
}