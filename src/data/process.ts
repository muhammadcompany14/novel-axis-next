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
    desc: "We learn your customers, commercial goal, and constraints before choosing the right solution.",
    icon: "discover",
    headline: "We map the territory before we move.",
    meta: "WEEK 1 TO 2 · DELIVERABLE: DISCOVERY BRIEF · YOU SIGN OFF",
  },
  {
    num: "02",
    title: "Define",
    desc: "We turn that context into a clear scope, delivery plan, and definition of success.",
    icon: "define",
    headline: "Scope is a promise we keep.",
    meta: "WEEK 2 · DELIVERABLE: SCOPE & SUCCESS PLAN · YOU APPROVE",
  },
  {
    num: "03",
    title: "Design",
    desc: "We shape the key journeys in Figma and test them against real user goals before build.",
    icon: "design",
    headline: "Form follows the flow of a real hand.",
    meta: "WEEK 3 TO 5 · DELIVERABLE: UX SYSTEM · YOU REVIEW",
  },
  {
    num: "04",
    title: "Engineer",
    desc: "We build the approved experience with dependable code, sensible architecture, and room to change.",
    icon: "engineer",
    headline: "Typed, tested, and built to be read.",
    meta: "WEEK 6 TO 9 · DELIVERABLE: WORKING BUILD · YOU TEST",
  },
  {
    num: "05",
    title: "Refine",
    desc: "We test the awkward cases, tune speed and motion, and remove friction before release.",
    icon: "refine",
    headline: "The last ten percent is the craft.",
    meta: "WEEK 10 TO 11 · DELIVERABLE: RELEASE CANDIDATE · YOU APPROVE",
  },
  {
    num: "06",
    title: "Launch",
    desc: "We launch, document the handover, and leave your team with a product they can run.",
    icon: "launch",
    headline: "A launch is a beginning, not a finish.",
    meta: "WEEK 12 · DELIVERABLE: LIVE PRODUCT & HANDOVER · YOU OWN",
  },
];