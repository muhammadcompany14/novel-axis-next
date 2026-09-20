"use client";

import { site } from "@/data/site";
import { processSteps } from "@/data/process";
import { coreTechnologies, stack } from "@/data/technologies";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "twenty-one",
  "twenty-two",
  "twenty-three",
];

const toWords = (n: number) => WORDS[n] ?? String(n);

const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase());

/* Figures below are derived from the site's own data files — nothing invented. */
const disciplineCount = site.capability.length;
const techTotal = coreTechnologies.length + stack.length;
const phaseCount = processSteps.length;

const capabilityList = site.capability.map(titleCase).join(", ");

export default function Why({
  projectCount,
  specialistCount,
}: {
  projectCount: number;
  specialistCount: number;
}) {
  const stats = [
    { num: String(phaseCount).padStart(2, "0"), label: "phases — discover to launch" },
    { num: String(techTotal).padStart(2, "0"), label: "technologies in the toolkit" },
    { num: String(projectCount).padStart(2, "0"), label: "shipped projects" },
    { num: "01", label: `close-knit team · ${toWords(specialistCount)} specialists` },
  ];

  return (
    <section className="section" id="about" aria-label="Why Novel Axis">
      <div className="container">
        <SectionHeading
          eyebrow="06 — WHY NOVEL AXIS"
          title="Small team. Serious capability."
          sub={`A studio of ${toWords(specialistCount)}. Design, engineering, and strategy under one roof.`}
        />

        <div className="why__manifesto">
          <div className="why__rail">
            <Reveal>
              <p className="why__rail-label">The Manifesto</p>
              <h3 className="why__rail-title">
                We are small. That is the <em>point.</em>
              </h3>
            </Reveal>
          </div>

          <div className="why__body">
            <Reveal y={24}>
              <p className="why__lede">
                The people who answer your email are the people who build your product. No account
                managers. No hand-offs.
              </p>
            </Reveal>
            <Reveal y={24} delay={0.08}>
              <p className="why__para">
                {toWords(disciplineCount)} disciplines — {capabilityList}. Design and engineering
                start from the same sketch, not two departments passing files.
              </p>
            </Reveal>
            <Reveal y={24} delay={0.16}>
              <p className="why__para">
                The tool is chosen for the problem, not the preference. The details are the product
                — spacing, easing, states, edge cases. And the architecture is built to evolve, so
                the next feature is welcomed, not fought.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="why__stats">
          <Reveal y={24}>
            <p className="why__stats-label">The Numbers</p>
          </Reveal>
          <div className="why__stats-row">
            {stats.map((stat, i) => (
              <Reveal key={stat.num} className="why__stat" y={24} delay={i * 0.06}>
                <span className="why__stat-num">{stat.num}</span>
                <span className="why__stat-label">{stat.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}