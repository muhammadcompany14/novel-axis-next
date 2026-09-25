"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

const typeSizes =
  "text-[clamp(3.5rem,14vw,11rem)] font-extrabold uppercase leading-[0.9] tracking-tight";

export default function BrandStatement() {
  return (
    <section
      className="relative overflow-hidden border-t border-border py-14 md:py-20"
      aria-label="NOVEL AXIS SOLUTIONS signature"
    >
      <div className="container">
        <Reveal>
          <Image
            src="/novel_logo.png"
            alt=""
            width={48}
            height={48}
            aria-hidden="true"
            className="mb-6 h-12 w-12 rounded-xl"
          />
        </Reveal>
        <Reveal>
          <p className="section-label">{site.brand.label}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-text-secondary">
            {site.brand.tagline}
          </p>
        </Reveal>

        <div className="mt-8 select-none" aria-hidden="true">
          {site.brand.lines.map((line) => (
            <div key={line} className="relative">
              <span
                className={`block brand__signature ${typeSizes}`}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}