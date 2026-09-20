export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tech: string[];
  image: string;
  accent: string;
  results: string[];
  /** Extra gallery images — `image` stays the cover. Optional for seed data. */
  images?: string[];
}

export const projects: Project[] = [
  {
    id: "meridian-threads",
    title: "Meridian Threads",
    category: "Shopify Ecosystem",
    year: "2025",
    description:
      "A direct-to-consumer fashion label scaled into a full Shopify ecosystem — theme, app integrations, and a site that moves like the product.",
    tech: ["Shopify", "Hydrogen", "GSAP", "Tailwind"],
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=2000&q=80",
    accent: "#c8956c",
    results: ["+64% conversion on product pages", "0.9s LCP on collection templates"],
  },
  {
    id: "pulseboard",
    title: "Pulseboard",
    category: "Web Application",
    year: "2025",
    description:
      "A real-time analytics dashboard for teams that need numbers without the noise — custom architecture, live data, and an interface people actually enjoy.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "WebSockets"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    accent: "#e8c17a",
    results: ["Real-time sync under 120ms", "45% faster time-to-insight"],
  },
  {
    id: "atelier-form",
    title: "Atelier Form",
    category: "Editorial Website",
    year: "2024",
    description:
      "An editorial site for a furniture studio — big type, considered motion, and product stories that read like a magazine, not a catalog.",
    tech: ["Next.js", "GSAP", "Lenis", "Sanity"],
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=2000&q=80",
    accent: "#d4a04a",
    results: ["Featured on 2 design galleries", "98 Lighthouse performance"],
  },
  {
    id: "foundry-kit",
    title: "Foundry Kit",
    category: "UI / UX Design",
    year: "2024",
    description:
      "A complete design system for a B2B SaaS — tokens, components, and documentation that let one product team ship like five.",
    tech: ["Figma", "React", "Storybook"],
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=2000&q=80",
    accent: "#d46a5a",
    results: ["3-week sprints → 1 week", "120+ components documented"],
  },
  {
    id: "signal-archive",
    title: "Signal Archive",
    category: "Custom Application",
    year: "2024",
    description:
      "An internal archive tool for a research team — search, tagging, and retrieval over years of mixed-format material, built to handle it all.",
    tech: ["Next.js", "PostgreSQL", "Meilisearch"],
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=80",
    accent: "#6ea87a",
    results: ["9,000+ documents indexed", "Search under 200ms at scale"],
  },
];