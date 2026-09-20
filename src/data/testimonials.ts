export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initial: string;
}

function kebab(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const raw = [
  {
    quote:
      "They rebuilt our storefront and the numbers moved within the first week. The rare team that sweats the design AND the conversion rate.",
    name: "Mara Lin",
    role: "Founder",
    company: "Meridian Threads",
    initial: "M",
  },
  {
    quote:
      "Pulseboard went from a spreadsheet nightmare to a product our whole team actually opens every day. Technical depth and taste in the same room.",
    name: "Daniel Reyes",
    role: "Head of Operations",
    company: "Pulseboard",
    initial: "D",
  },
  {
    quote:
      "The site they built for us is the best thing we own. It looks like the furniture in it — considered, minimal, and quietly expensive.",
    name: "Sofia Anders",
    role: "Creative Director",
    company: "Atelier Form",
    initial: "S",
  },
  {
    quote:
      "Fast, direct, and completely across our business. They understood the product faster than teams twice their size.",
    name: "James Okafor",
    role: "CTO",
    company: "Foundry Kit",
    initial: "J",
  },
  {
    quote:
      "Nine thousand documents, one search box, results in milliseconds. They turned an archive nobody could use into a tool the whole lab depends on.",
    name: "Marisol Vega",
    role: "Research Lead",
    company: "Signal Archive",
    initial: "M",
  },
  {
    quote:
      "We came for a theme and left with an ecosystem. Launch, app hooks, and a storefront that finally feels like our brand.",
    name: "Theo Laurent",
    role: "Ecommerce Director",
    company: "Maison Ligne",
    initial: "T",
  },
  {
    quote:
      "Communication was the surprise. Clear updates, honest estimates, zero fluff — the work itself was already everything we'd hoped.",
    name: "Layla Hassan",
    role: "Product Owner",
    company: "Orbit Health",
    initial: "L",
  },
  {
    quote:
      "They took a dashboard we were embarrassed to demo and made it something investors ask about. Our conversion went up within a month of launch.",
    name: "Priya Raman",
    role: "Head of Product",
    company: "Lumen Labs",
    initial: "P",
  },
  {
    quote:
      "Every page they shipped felt like it had been there for years. No hand-waving, no surprises — just solid work delivered on time.",
    name: "Marcus Webb",
    role: "Managing Director",
    company: "Harbor & Co",
    initial: "M",
  },
  {
    quote:
      "They listened more than they talked, which is rare. The campaign site they built finally matches the quality of the work we put out.",
    name: "Elena Petrova",
    role: "Marketing Lead",
    company: "Northwind Studio",
    initial: "E",
  },
  {
    quote:
      "We handed them a messy brief and they came back with something clearer than we could have written ourselves. Our signups have been climbing ever since.",
    name: "Owen Gallagher",
    role: "Co-founder",
    company: "Fieldnote",
    initial: "O",
  },
  {
    quote:
      "The refactor they did quietly removed a whole class of bugs we'd been patching for a year. The codebase finally reads like one person wrote it.",
    name: "Amara Diallo",
    role: "VP of Engineering",
    company: "Stackline",
    initial: "A",
  },
  {
    quote:
      "They translated our brand into a digital presence without losing any of its character. Customers keep telling us the site feels like the store.",
    name: "Hugo Brandt",
    role: "Brand Manager",
    company: "Kessel & Sohn",
    initial: "H",
  },
  {
    quote:
      "From the first call they understood our constraints better than we did. The booking flow they built has cut our admin time in half.",
    name: "Nadia Farouk",
    role: "Operations Director",
    company: "Cedar & Sage",
    initial: "N",
  },
];

export const testimonials: Testimonial[] = raw.map((t) => ({
  ...t,
  id: kebab(t.name),
}));