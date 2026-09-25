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
    { num: String(phaseCount).padStart(2, "0"), label: "delivery phases from brief to launch" },
    { num: String(techTotal).padStart(2, "0"), label: "tools chosen for the job" },
    { num: String(projectCount).padStart(2, "0"), label: "projects delivered" },
    { num: "01", label: `${toWords(specialistCount)} specialists, one working team` },
  ];

  return (
    <section className="section" id="about" aria-label="Why Novel Axis">
      <div className="container">
        <SectionHeading
          eyebrow="06 · WHY NOVEL AXIS"
          title="A small team with clear ownership."
          sub="Strategy, design, and engineering stay in one room, so clients get direct answers and a product that holds together."
        />

        <div className="why__manifesto">
          <div className="why__rail">
            <Reveal>
                <p className="why__rail-label">HOW WE WORK</p>
                <h3 className="why__rail-title">
                  Small enough to stay <em>accountable.</em>
                </h3>
            </Reveal>
          </div>

          <div className="why__body">
            <Reveal y={24}>
              <p className="why__lede">
                You work with the people who shape the product, not a handoff team.
              </p>
            </Reveal>
            <Reveal y={24} delay={0.08}>
              <p className="why__para">
                {toWords(disciplineCount)} disciplines, {capabilityList}, handled as one brief. Design
                and engineering start together, so the original intent survives the build.
              </p>
            </Reveal>
            <Reveal y={24} delay={0.16}>
              <p className="why__para">
                We choose the technology for the problem, then test the small moments that decide
                whether a product feels easy: loading, spacing, states, and edge cases. The
                foundation leaves room for the next release.
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