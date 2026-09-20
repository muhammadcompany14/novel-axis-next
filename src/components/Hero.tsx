"use client";

import { motion } from "framer-motion";
import { site } from "@/data/site";
import ParticleField from "@/components/ParticleField";
import Reveal from "@/components/Reveal";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

type HeroProps = {
  hero?: {
    label: string;
    copy: string;
    title: readonly string[];
    accentLine: number;
  };
};

export default function Hero({ hero = site.hero }: HeroProps = {}) {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="hero" id="home">
      <ParticleField className="hero__canvas" density={16} parallax={22} seed={7} />
      <div className="hero__grid-overlay" aria-hidden="true" />

      <div className="container hero__inner">
        <Reveal y={16}>
          <p className="hero__label">{hero.label}</p>
        </Reveal>

        <h1 className="hero__title">
          {hero.title.map((line, i) => {
            const accent = i === hero.accentLine;
            const accentClass = accent ? " hero__title-line--accent" : "";
            const inner = reduced ? (
              line
            ) : (
              <motion.span
                style={{ display: "block" }}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.12 + i * 0.12 }}
              >
                {line}
              </motion.span>
            );
            return (
              <span key={line} className={`hero__title-line${accentClass}`}>
                {inner}
              </span>
            );
          })}
        </h1>

        <Reveal delay={0.2} y={20}>
          <p className="hero__copy">{hero.copy}</p>
        </Reveal>

        <Reveal delay={0.3} y={16}>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact" data-cursor="hover">
              <span className="btn__label">Start a Project</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="btn btn--text" href="#work" data-cursor="hover">
              <span className="btn__label">Explore Our Work</span>
              <span className="btn__arrow btn__arrow--down" aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </Reveal>
      </div>

      <button
        type="button"
        className="hero__scroll-indicator"
        data-cursor="hover"
        aria-label="Scroll to content"
      >
        <span className="hero__scroll-line" aria-hidden="true" />
        <span className="hero__scroll-text">SCROLL</span>
      </button>
    </section>
  );
}