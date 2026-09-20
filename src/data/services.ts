export type ServiceIcon = "shopify" | "web" | "uiux" | "apps";

export interface ServiceItem {
  name: string;
  desc: string;
}

export interface Service {
  /** Unique slug — drives React keys. The visual mock + glyph come from `icon`. */
  id: string;
  index: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: ServiceIcon;
  items: ServiceItem[];
  highlight: string;
}

export const services: Service[] = [
  {
    id: "shopify",
    index: "01",
    name: "Shopify Ecosystem",
    shortName: "Shopify",
    tagline: "Storefronts and systems built to sell.",
    description:
      "We design, build, and scale Shopify stores that feel custom because they are — themes, apps, migrations, and the ecosystem around them.",
    icon: "shopify",
    items: [
      { name: "Headless storefronts", desc: "Hydrogen, Next.js, and custom frontends on top of Shopify's commerce engine." },
      { name: "Theme development", desc: "Bespoke themes engineered for conversion, speed, and editorial design." },
      { name: "Apps & integrations", desc: "Custom Shopify apps that extend the platform where it stops." },
      { name: "Migration & optimization", desc: "Replatforms and CRO passes that move metrics, not just code." },
    ],
    highlight: "stores that actually convert",
  },
  {
    id: "web",
    index: "02",
    name: "Web Development",
    shortName: "Web Development",
    tagline: "Websites that perform like products.",
    description:
      "From marketing sites to complex web platforms — typed, tested, and tuned for real-world performance budgets.",
    icon: "web",
    items: [
      { name: "Marketing & portfolio sites", desc: "Editorial, motion-rich experiences that load fast and index clean." },
      { name: "Web applications", desc: "Dashboards, tools, and platforms with serious architecture underneath." },
      { name: "Performance engineering", desc: "Core Web Vitals, bundle budgets, and runtime profiling as a discipline." },
      { name: "Design systems", desc: "Component libraries that keep product and engineering in sync." },
    ],
    highlight: "sites that feel like software",
  },
  {
    id: "uiux",
    index: "03",
    name: "UI / UX Design",
    shortName: "UI / UX & Figma",
    tagline: "Interfaces with intention.",
    description:
      "Design systems, interaction models, and interfaces in Figma — designed against real flows, tested, and handed off clean.",
    icon: "uiux",
    items: [
      { name: "Product design", desc: "UX research, flows, and interfaces for web and mobile products." },
      { name: "Design systems", desc: "Tokens, components, and documentation that scale across teams." },
      { name: "Interaction & motion", desc: "Timing, easing, and micro-interactions that make interfaces feel alive." },
      { name: "Prototyping", desc: "High-fidelity prototypes that behave like the real thing." },
    ],
    highlight: "interfaces people read, not fight",
  },
  {
    id: "apps",
    index: "04",
    name: "Applications",
    shortName: "Applications",
    tagline: "Custom software, built to spec.",
    description:
      "Internal tools, customer portals, and standalone applications — architected to be maintained, extended, and trusted.",
    icon: "apps",
    items: [
      { name: "Custom web applications", desc: "From SSR platforms to real-time collaborative tools." },
      { name: "Automation & tooling", desc: "Scripts, bots, and pipelines that remove repetitive work." },
      { name: "Backend & APIs", desc: "Typed APIs, database design, and integrations done properly." },
      { name: "Migration projects", desc: "Legacy systems moved forward without breaking the business." },
    ],
    highlight: "software that earns its keep",
  },
];

/** The four visual styles a service can render in (glyph + ghost mock). */
export const serviceIconOptions: { value: ServiceIcon; label: string }[] = [
  { value: "shopify", label: "Shopify" },
  { value: "web", label: "Web" },
  { value: "uiux", label: "UI / UX" },
  { value: "apps", label: "Applications" },
];

export const serviceIcons: Record<ServiceIcon, string> = {
  shopify: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  web: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  uiux: '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  apps: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
};