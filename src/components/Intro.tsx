"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { motion, useSpring, type Variants } from "framer-motion";
import { site } from "@/data/site";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const WORD_EASE = [0.22, 0.61, 0.36, 1] as const;

const wordVariants: Variants = {
  hidden: { y: "115%", opacity: 0.001 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.7, ease: WORD_EASE },
  },
};

type IntroProps = {
  intro?: {
    label: string;
    lines: readonly string[];
    support: readonly string[];
    ctaText: string;
    capability: readonly string[];
    cardLabel: string;
    cardLines: readonly string[];
    badgeMain: string;
    badgeSide: string;
    imageMain: string;
    imageMainAlt: string;
    imageSide: string;
    imageSideAlt: string;
  };
};

function MagneticLink({ text }: { text: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 160, damping: 18 });
  const y = useSpring(0, { stiffness: 160, damping: 18 });

  const onPointerMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  return (
    <motion.a
      ref={ref}
      href="#team"
      className="intro__cta"
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      data-cursor="hover"
    >
      {text}
      <span className="intro__cta-arrow" aria-hidden="true">
        ↓
      </span>
    </motion.a>
  );
}

export default function Intro({ intro = site.intro }: IntroProps = {}) {
  const reduced = usePrefersReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="intro section section--cream section--lift" id="about-intro">
      <div className="container">
        <Reveal y={12}>
          <p className="section-label intro__label">{intro.label}</p>
        </Reveal>

        <motion.div
          className="intro__statement"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
        >
          {intro.lines.map((line, i) => {
            const accent = i === intro.lines.length - 1;
            const words = line.split(" ");
            return (
              <p key={line} className="intro__line">
                {words.map((word, j) => {
                  const trailing = j < words.length - 1 ? "\u00A0" : "";
                  const classes = `intro__word${accent ? " intro__word--accent" : ""}`;
                  if (reduced) {
                    return (
                      <span key={`${word}-${j}`} className={classes}>
                        {word}
                        {trailing}
                      </span>
                    );
                  }
                  return (
                    <span key={`${word}-${j}`} className="intro__mask">
                      <motion.span className={classes} variants={wordVariants}>
                        {word}
                        {trailing}
                      </motion.span>
                    </span>
                  );
                })}
              </p>
            );
          })}
        </motion.div>

        <div className="intro__support">
          {intro.support.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal y={16} delay={0.2}>
          <div className="intro__actions">
            <MagneticLink text={intro.ctaText} />
          </div>
        </Reveal>

        <div className="intro__cards mt-10 grid gap-4 md:mt-14 md:grid-cols-[1.25fr_0.75fr] md:gap-5">
          <Reveal delay={0.15} y={32} className="intro__card intro__card--main">
            <SpotlightCard
              className="group aspect-[4/3] border border-border md:aspect-[16/11]"
              parallax
              dimmed={hoveredCard !== null && hoveredCard !== 0}
              onHoverChange={(h) => setHoveredCard(h ? 0 : null)}
            >
              <Image
                src={intro.imageMain}
                alt={intro.imageMainAlt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap gap-2">
                {intro.capability.map((cap) => (
                  <span key={cap} className="intro__chip backdrop-blur-sm">
                    {cap}
                  </span>
                ))}
              </div>
              <div className="intro__badge absolute right-4 top-4 z-10 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                {intro.badgeMain}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal
            delay={0.25}
            y={32}
            className="intro__card intro__card--side"
          >
            <SpotlightCard
              className="group aspect-[3/2] border border-border md:aspect-[16/9]"
              parallax
              dimmed={hoveredCard !== null && hoveredCard !== 1}
              onHoverChange={(h) => setHoveredCard(h ? 1 : null)}
            >
              <Image
                src={intro.imageSide}
                alt={intro.imageSideAlt}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="intro__badge intro__badge--center absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-75 px-4 py-2 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                {intro.badgeSide}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal
            delay={0.35}
            y={32}
            className="intro__card intro__card--stat"
          >
            <SpotlightCard
              className="group relative flex h-full min-h-36 flex-col justify-center gap-3 border border-border bg-surface p-6"
              dimmed={hoveredCard !== null && hoveredCard !== 2}
              onHoverChange={(h) => setHoveredCard(h ? 2 : null)}
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-1-soft blur-2xl" />
              <p className="font-sans text-[0.8125rem] font-bold uppercase tracking-[0.13em] text-text-secondary">
                {intro.cardLabel}
              </p>
              <p className="intro__card-lines">
                {intro.cardLines.map((line, i) => (
                  <span
                    key={line}
                    className={`intro__card-line${i === intro.cardLines.length - 1 ? " intro__card-line--accent" : ""}`}
                  >
                    {line}
                  </span>
                ))}
              </p>
              <div className="pointer-events-none absolute bottom-5 right-6 z-10 text-xl font-black text-accent-1 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1">
                →
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
