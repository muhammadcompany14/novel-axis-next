export interface TeamMember {
  id: string;
  name: string;
  title: string;
  specialty: string;
  tech: string[];
  initials: string;
  accent: string;
  photo: string;
}

export const team: TeamMember[] = [
  {
    id: "arman-malik",
    name: "Arman Malik",
    title: "Engineering & Strategy",
    specialty: "Architecture, Shopify ecosystem, technical direction",
    tech: ["Next.js", "TypeScript", "Shopify", "PostgreSQL"],
    initials: "AM",
    accent: "#c8956c",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "zara-khan",
    name: "Zara Khan",
    title: "Design & Interaction",
    specialty: "Interface design, motion, design systems",
    tech: ["Figma", "Framer Motion", "GSAP"],
    initials: "ZK",
    accent: "#e8c17a",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "omar-farooq",
    name: "Omar Farooq",
    title: "Shopify & Frontend",
    specialty: "Themes, Hydrogen, performance engineering",
    tech: ["Shopify", "Hydrogen", "Tailwind", "React"],
    initials: "OF",
    accent: "#d4a04a",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "ayesha-raza",
    name: "Ayesha Raza",
    title: "Product & UX",
    specialty: "Research, flows, prototypes that hold up",
    tech: ["Figma", "Prototyping", "UX Research"],
    initials: "AR",
    accent: "#6ea87a",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "bilal-ahmed",
    name: "Bilal Ahmed",
    title: "Backend & Systems",
    specialty: "Typed APIs, databases, automation",
    tech: ["Node.js", "PostgreSQL", "Docker", "Redis"],
    initials: "BA",
    accent: "#d46a5a",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "hina-siddiqui",
    name: "Hina Siddiqui",
    title: "Delivery & Ops",
    specialty: "Planning, QA, client communication",
    tech: ["Agile", "QA", "Analytics"],
    initials: "HS",
    accent: "#a89888",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=80",
  },
];