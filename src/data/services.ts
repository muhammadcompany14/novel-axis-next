export type ServiceIcon = "shopify" | "web" | "uiux" | "apps" | "wordpress" | "squarespace";

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
  {
    id: "wordpress",
    index: "05",
    name: "WordPress",
    shortName: "WordPress",
    tagline: "Custom builds that hold up.",
    description:
      "We build WordPress properly — custom themes, complex plugins, and WooCommerce stores engineered for speed, security, and the long haul.",
    icon: "wordpress",
    items: [
      { name: "Custom themes", desc: "Bespoke themes on modern block patterns, templates, and design tokens." },
      { name: "Plugin & API work", desc: "Custom plugins, REST integrations, and headless WordPress frontends." },
      { name: "WooCommerce", desc: "Storefronts, checkout flows, and replatforms that hold up under load." },
      { name: "Care plans", desc: "Updates, backups, and performance work on a schedule, every month." },
    ],
    highlight: "1,000+ hours delivered across WordPress and Shopify builds.",
  },
  {
    id: "squarespace",
    index: "06",
    name: "Squarespace",
    shortName: "Squarespace",
    tagline: "Design-led sites, launched fast.",
    description:
      "Squarespace is the short route to a sharp, design-led site — template setup, custom code, and a clean handover for the team that owns it.",
    icon: "squarespace",
    items: [
      { name: "Template setup", desc: "Structure, typography, and layout tuned into a template that fits the brand." },
      { name: "Custom CSS & code", desc: "Targeted CSS, typefaces, and code injections where the template falls short." },
      { name: "Content migration", desc: "Copy, images, and structure moved across with no broken links or lost pages." },
      { name: "Launch & training", desc: "Domain, DNS, analytics, and a walkthrough for the people publishing daily." },
    ],
    highlight: "Design-led builds, launched fast.",
  },
];

/** The visual styles a service can render in (glyph + ghost mock). */
export const serviceIconOptions: { value: ServiceIcon; label: string }[] = [
  { value: "shopify", label: "Shopify" },
  { value: "web", label: "Web" },
  { value: "uiux", label: "UI / UX" },
  { value: "apps", label: "Applications" },
  { value: "wordpress", label: "WordPress" },
  { value: "squarespace", label: "Squarespace" },
];

export const serviceIcons: Record<ServiceIcon, string> = {
  shopify: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  web: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  uiux: '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  apps: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  wordpress: '<path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>',
  squarespace: '<path d="M22.655 8.719c-1.802-1.801-4.726-1.801-6.564 0l-7.351 7.35c-.45.45-.45 1.2 0 1.65.45.449 1.2.449 1.65 0l7.351-7.351c.899-.899 2.362-.899 3.264 0 .9.9.9 2.364 0 3.264l-7.239 7.239c.9.899 2.362.899 3.263 0l5.589-5.589c1.836-1.838 1.836-4.763.037-6.563zm-2.475 2.437c-.451-.45-1.201-.45-1.65 0l-7.354 7.389c-.9.899-2.361.899-3.262 0-.45-.45-1.2-.45-1.65 0s-.45 1.2 0 1.649c1.801 1.801 4.726 1.801 6.564 0l7.351-7.35c.449-.487.449-1.239.001-1.688zm-2.439-7.35c-1.801-1.801-4.726-1.801-6.564 0l-7.351 7.351c-.45.449-.45 1.199 0 1.649s1.2.45 1.65 0l7.395-7.351c.9-.899 2.371-.899 3.27 0 .451.45 1.201.45 1.65 0 .421-.487.421-1.199-.029-1.649h-.021zm-2.475 2.437c-.45-.45-1.2-.45-1.65 0l-7.351 7.389c-.899.9-2.363.9-3.265 0-.9-.899-.9-2.363 0-3.264l7.239-7.239c-.9-.9-2.362-.9-3.263 0L1.35 8.719c-1.8 1.8-1.8 4.725 0 6.563 1.801 1.801 4.725 1.801 6.564 0l7.35-7.351c.451-.488.451-1.238 0-1.688h.002z"/>',
};