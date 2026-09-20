export interface ProcessStep {
  num: string;
  title: string;
  desc: string;
  icon: "discover" | "define" | "design" | "engineer" | "refine" | "launch";
  headline: string;
  meta: string;
}

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Discover",
    desc: "We map the problem, the audience, and the constraints before a single line is written.",
    icon: "discover",
    headline: "We map the territory before we move.",
    meta: "1 — 2 WKS · DELIVERABLE: KNOWLEDGE MAP · YOU APPROVE",
  },
  {
    num: "02",
    title: "Define",
    desc: "Scope, architecture, and success metrics are defined with clarity — so nothing drifts later.",
    icon: "define",
    headline: "Scope is a promise we keep.",
    meta: "2 — 1 WK · DELIVERABLE: SCOPE & METRICS · YOU APPROVE",
  },
  {
    num: "03",
    title: "Design",
    desc: "Interfaces, design systems, and interaction models take shape in Figma — tested against real flows.",
    icon: "design",
    headline: "Form follows the flow of a real hand.",
    meta: "3 — 3 WKS · DELIVERABLE: DESIGN SYSTEM · YOU REVIEW",
  },
  {
    num: "04",
    title: "Engineer",
    desc: "The system is built with modern tooling — typed, componentized, and performance-aware.",
    icon: "engineer",
    headline: "Typed, tested, and built to be read.",
    meta: "4 — 4 WKS · DELIVERABLE: WORKING BUILD · YOU TEST",
  },
  {
    num: "05",
    title: "Refine",
    desc: "Motion, edge cases, and every interaction are polished. Frequency is tuned. Bottlenecks are removed.",
    icon: "refine",
    headline: "The last ten percent is the craft.",
    meta: "5 — 2 WKS · DELIVERABLE: POLISHED RELEASE · YOU APPROVE",
  },
  {
    num: "06",
    title: "Launch",
    desc: "Deployment, monitoring, and handover — with everything documented and built to evolve.",
    icon: "launch",
    headline: "A launch is a beginning, not a finish.",
    meta: "6 — 1 WK · DELIVERABLE: LIVE PRODUCT · YOU OWN",
  },
];