export type TechType = "fd" | "be" | "dx";

export interface CoreTech {
  name: string;
  type: TechType;
  hue: number;
  icon: { slug: string; color: string };
}

const icon = (slug: string, color: string) => ({ slug, color });

export const coreTechnologies: CoreTech[] = [
  { name: "JavaScript", type: "fd", hue: 1, icon: icon("javascript", "F7DF1E") },
  { name: "TypeScript", type: "fd", hue: 2.2, icon: icon("typescript", "3178C6") },
  { name: "React", type: "fd", hue: 3.4, icon: icon("react", "61DAFB") },
  { name: "Next.js", type: "fd", hue: 4.6, icon: icon("nextdotjs", "ffffff") },
  { name: "Node.js", type: "be", hue: 5.8, icon: icon("nodedotjs", "5FA04E") },
  { name: "Shopify", type: "be", hue: 7, icon: icon("shopify", "7AB55C") },
  { name: "Figma", type: "dx", hue: 8.2, icon: icon("figma", "F24E1E") },
  { name: "GSAP", type: "fd", hue: 9.4, icon: icon("greensock", "88CE02") },
];

export const stack: string[] = [
  "HTML",
  "CSS",
  "Tailwind",
  "Framer Motion",
  "Lenis",
  "PostgreSQL",
  "Prisma",
  "MySQL",
  "REST",
  "GraphQL",
  "WebSockets",
  "Redis",
  "Docker",
  "Git",
  "GitHub",
];

export const stackIcons: Record<string, { slug: string; color: string }> = {
  HTML: icon("html5", "E34F26"),
  CSS: icon("css", "1572B6"),
  Tailwind: icon("tailwindcss", "06B6D4"),
  "Framer Motion": icon("framer", "0055FF"),
  PostgreSQL: icon("postgresql", "4169E1"),
  Prisma: icon("prisma", "ffffff"),
  MySQL: icon("mysql", "4479A1"),
  GraphQL: icon("graphql", "E10098"),
  Redis: icon("redis", "FF4438"),
  Docker: icon("docker", "2496ED"),
  Git: icon("git", "F05032"),
  GitHub: icon("github", "ffffff"),
};

export const techTypeLabels: Record<TechType, string> = {
  fd: "Frontend",
  be: "Backend",
  dx: "Design",
};