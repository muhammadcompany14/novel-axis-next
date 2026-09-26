import { images } from "@/data/images";

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
    label: "NOVEL AXIS SOLUTIONS · DIGITAL PRODUCT STUDIO",
    title: ["Websites that earn trust", "products that scale", "with your business."],
    accentLine: 2,
    copy: "We design and build websites, Shopify stores, and custom products for growing businesses that need clear thinking, fast performance, and less ongoing friction.",
  },
  intro: {
    label: "01 — WHO WE ARE",
    lines: ["We start with the business.", "We finish with a product that works."],
    support: [
      "Novel Axis Solutions is a small digital studio for growing businesses. Strategy, design, and engineering stay in one room, so decisions happen faster and the finished product feels considered.",
      "We connect the customer journey, interface, content, and technology so each part supports the next. The result is easier to use, easier to maintain, and ready to grow.",
    ],
    ctaText: "Meet the team",
    capability: ["SHOPIFY", "WEB", "APPS", "UI/UX", "DIGITAL PRODUCTS"],
    cardLabel: "ONE TEAM, END TO END",
    cardLines: ["Six specialists.", "One shared plan.", "No lost context."],
    badgeMain: "THE STUDIO",
    badgeSide: "CRAFT ↑",
    imageMain: images.teamCollab,
    imageMainAlt: "The Novel Axis team collaborating in the studio",
    imageSide: images.teamLaptop,
    imageSideAlt: "Close-up of the team designing an interface",
  },
  why: [
    {
      index: "01",
      title: "One team, one brief",
      desc: "Design and engineering work from the same priorities, so the original intent survives every decision.",
    },
    {
      index: "02",
      title: "The right technical depth",
      desc: "We handle storefronts, interfaces, applications, and the systems that connect them.",
    },
    {
      index: "03",
      title: "Decisions tied to outcomes",
      desc: "We choose technology for the business problem, not because it is fashionable or familiar.",
    },
    {
      index: "04",
      title: "Details that remove friction",
      desc: "We test the states, transitions, and edge cases that shape how a product feels in use.",
    },
    {
      index: "05",
      title: "Ready for the next release",
      desc: "We leave you with a clear foundation, useful documentation, and a product that can keep changing.",
    },
  ],
  cta: {
    label: "READY WHEN YOU ARE",
    title: ["Have a business", "challenge to solve?"],
    copy: "Tell us the goal and the obstacle. We'll help you work out the right next step.",
  },
  brand: {
    label: "10 — THE SIGNATURE",
    lines: ["NOVEL AXIS", "SOLUTIONS"],
    tagline: "Websites, stores, and products built for what comes next.",
    hint: "PAINT THE SIGNATURE WITH LIGHT",
  },
  contact: {
    infoText: "Email is the quickest way to reach us.",
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
    tagline: "Websites, stores, and products for the next stage of business.",
    columns: [
      {
        title: "Explore",
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
    contactTitle: "Start a conversation",
    socials: ["GitHub", "LinkedIn"],
    copyright: `© ${new Date().getFullYear()} Novel Axis Solutions. All rights reserved.`,
  },
} as const;