"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { motion, useSpring, type Variants } from "framer-motion";
import { site } from "@/data/site";
import { images } from "@/data/images";
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

function MagneticLink() {
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
      Meet the team
      <span className="intro__cta-arrow" aria-hidden="true">
        ↓
      </span>
    </motion.a>
  );
}

export default function Intro() {
  const reduced = usePrefersReducedMotion();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="intro section section--cream section--lift" id="about-intro">
      <div className="container">
        <Reveal y={12}>
          <p className="section-label intro__label">01 — WHO WE ARE</p>
        </Reveal>

        <motion.div
          className="intro__statement"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -12% 0px" }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.05 }}
        >
          {site.intro.lines.map((line, i) => {
            const accent = i === site.intro.lines.length - 1;
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
          {site.intro.support.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal y={16} delay={0.2}>
          <div className="intro__actions">
            <MagneticLink />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-[1.25fr_0.75fr] md:gap-5">
          <Reveal delay={0.15} y={32}>
            <SpotlightCard
              className="group aspect-[16/11] border border-border"
              parallax
              dimmed={hoveredCard !== null && hoveredCard !== 0}
              onHoverChange={(h) => setHoveredCard(h ? 0 : null)}
            >
              <Image
                src={images.teamCollab}
                alt="The Novel Axis team collaborating in the studio"
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />
              <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
                {site.capability.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-full border border-border bg-black/50 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-text backdrop-blur-sm"
                  >
                    {cap}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-cream/30 bg-black/45 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-cream opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                THE STUDIO
              </div>
            </SpotlightCard>
          </Reveal>

          <div className="grid gap-4 md:gap-5">
            <Reveal delay={0.25} y={32}>
              <SpotlightCard
                className="group aspect-[16/9] border border-border"
                parallax
                dimmed={hoveredCard !== null && hoveredCard !== 1}
                onHoverChange={(h) => setHoveredCard(h ? 1 : null)}
              >
                <Image
                  src={images.teamLaptop}
                  alt="Close-up of the team designing an interface"
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full border border-cream/40 bg-black/50 px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-cream opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                  CRAFT ↑
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal delay={0.35} y={32}>
              <SpotlightCard
                className="group relative flex h-full min-h-36 flex-col justify-center gap-3 border border-border bg-surface p-6"
                dimmed={hoveredCard !== null && hoveredCard !== 2}
                onHoverChange={(h) => setHoveredCard(h ? 2 : null)}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-1-soft blur-2xl" />
                <p className="font-sans text-[0.8125rem] font-bold uppercase tracking-[0.13em] text-text-secondary">
                  ONE TEAM, END TO END
                </p>
                <p className="max-w-35 text-2xl font-extrabold leading-tight tracking-tight text-text">
                  Six specialists.
                  <br />
                  One shared plan.
                  <br />
                  <span className="bg-gradient-to-r from-accent-1 to-accent-2 bg-clip-text text-transparent">
                    No lost context.
                  </span>
                </p>
                <div className="pointer-events-none absolute bottom-5 right-6 z-10 text-xl font-black text-accent-1 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1">
                  →
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}