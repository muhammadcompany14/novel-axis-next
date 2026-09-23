export const site = {
  email: "expoecom1@gmail.com",
  phone: "+44 7434 785417",
  nav: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  mobileNav: [
    { num: "01", label: "Services", href: "#services" },
    { num: "02", label: "Work", href: "#work" },
    { num: "03", label: "Technology", href: "#technology" },
    { num: "04", label: "About", href: "#about" },
    { num: "05", label: "Contact", href: "#contact" },
  ],
  capability: ["SHOPIFY", "WEB", "APPS", "UI/UX", "DIGITAL PRODUCTS"],
  hero: {
    label: "NOVEL AXIS SOLUTIONS — DIGITAL ENGINEERING STUDIO",
    title: ["Digital experiences", "engineered", "beyond ordinary."],
    accentLine: 2,
    copy: "We design and engineer high-performance digital experiences — from Shopify ecosystems and modern websites to custom applications and interactive products.",
  },
  intro: {
    lines: ["We don't just build websites.", "We engineer digital experiences."],
    support: [
      "Novel Axis Solutions combines design, engineering, interaction, and technology to create digital products that are built to perform. Small team. Serious capability. Direct collaboration.",
      "Every project is treated as a system — architecture, interface, motion, performance — designed to work together.",
    ],
  },
  why: [
    {
      index: "01",
      title: "Design + Engineering",
      desc: "Design and development work together from the first sketch — not as two departments passing files.",
    },
    {
      index: "02",
      title: "Technical Depth",
      desc: "Shopify, frontend, backend, applications, UI systems — we operate across the full stack.",
    },
    {
      index: "03",
      title: "Problem First",
      desc: "Technology is selected based on the problem, not a preference. The right tool for the job, every time.",
    },
    {
      index: "04",
      title: "Attention to Detail",
      desc: "Every interaction matters — spacing, easing, states, edge cases. The details are the product.",
    },
    {
      index: "05",
      title: "Built to Evolve",
      desc: "Products should be able to grow. Architecture that welcomes new features instead of fighting them.",
    },
  ],
  cta: {
    label: "READY WHEN YOU ARE",
    title: ["Have something", "ambitious in mind?"],
    copy: "Tell us what you're building. We'll figure out how to build it.",
  },
  brand: {
    label: "10 — THE SIGNATURE",
    lines: ["NOVEL AXIS", "SOLUTIONS"],
    tagline: "Digital experiences engineered beyond ordinary.",
    hint: "PAINT THE SIGNATURE WITH LIGHT",
  },
  contact: {
    infoText: "Prefer email?",
    socials: ["GitHub", "LinkedIn", "X", "Dribbble"],
    services: [
      "Shopify",
      "Website",
      "Web Application",
      "Shopify App",
      "UI/UX",
      "Figma",
      "Bug Fixing",
      "Custom Development",
      "Other",
    ],
    budgets: [
      "Under $2,000",
      "$2,000 – $5,000",
      "$5,000 – $10,000",
      "$10,000 – $25,000",
      "$25,000+",
    ],
    timelines: ["ASAP", "1 – 2 months", "2 – 3 months", "3 – 6 months", "Flexible"],
  },
  footer: {
    tagline: "Digital experiences engineered beyond ordinary.",
    columns: [
      {
        title: "Navigate",
        links: [
          { label: "Services", href: "#services" },
          { label: "Work", href: "#work" },
          { label: "About", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Shopify", href: "#services" },
          { label: "Web Development", href: "#services" },
          { label: "UI/UX", href: "#services" },
          { label: "Applications", href: "#services" },
        ],
      },
    ],
    contactTitle: "Contact",
    socials: ["GitHub", "LinkedIn"],
    copyright: `© ${new Date().getFullYear()} Novel Axis Solutions. All rights reserved.`,
  },
} as const;