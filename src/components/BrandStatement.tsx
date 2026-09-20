"use client";

import { useRef } from "react";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

const spotlight = {
  backgroundImage:
    "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(240,232,220,0.95), rgba(200,149,108,0.75) 38%, rgba(232,193,122,0.45) 62%, transparent 80%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

const stroke = {
  WebkitTextStroke: "1.5px rgba(240,232,220,0.10)",
} as const;

const typeSizes =
  "text-[clamp(3.5rem,14vw,11rem)] font-extrabold uppercase leading-[0.9] tracking-tight";

export default function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      className="relative overflow-hidden border-t border-border py-14 md:py-20"
      aria-label="NOVEL AXIS SOLUTIONS signature"
    >
      <div ref={ref} onPointerMove={onPointerMove} className="container">
        <Reveal>
          <p className="section-label">{site.brand.label}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-text-secondary">{site.brand.tagline}</p>
        </Reveal>

        <div className="mt-10 cursor-crosshair select-none" aria-hidden="true">
          {site.brand.lines.map((line) => (
            <div key={line} className="relative">
              <span className={`block text-bg ${typeSizes}`} style={stroke}>
                {line}
              </span>
              <span className={`absolute inset-0 block ${typeSizes}`} style={spotlight}>
                {line}
              </span>
            </div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary">
            {site.brand.hint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}