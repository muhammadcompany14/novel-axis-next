"use client";

import { type CSSProperties, type Ref, useMemo, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type Project } from "@/data/projects";

/**
 * One full-viewport screen in the sticky-stack.
 * All cards share the same height and pin at the same top, so the topmost
 * (highest z-index) card is always the ONE covering the viewport — the
 * covered cards stay pinned underneath, hidden. Burial (scale + opacity) is
 * driven by the parent via `innerRef`: direct DOM writes, zero re-renders.
 */
export function WorkStackCard({
  project,
  index,
  pinned,
  wrapperRef,
  innerRef,
  ctaHref = "#contact",
}: {
  project: Project;
  index: number;
  pinned: boolean;
  wrapperRef?: Ref<HTMLDivElement | null>;
  innerRef?: Ref<HTMLDivElement | null>;
  ctaHref?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Entry: 0 while the card sits below the viewport bottom, 1 once its top
  // reaches nav-height (the pin position). Cards never travel above the pin,
  // so every reveal window below must complete by ~0.86, not 1.0.
  const { scrollYProgress: entry } = useScroll({
    target: pinned ? cardRef : undefined,
    offset: ["start end", "start start"],
  });
  // Always hook; when unpinned the styles are undefined anyway (see below).
  const entryFallback = useMotionValue(0);
  const scaleEntry = pinned ? entry : entryFallback;

  const imageScale = useTransform(
    scaleEntry,
    [0, 0.55],
    index % 2 ? [1.22, 1.02] : [1.18, 1.0]
  );

  const metaOpacity = useTransform(scaleEntry, [0.4, 0.55], [0, 1]);
  const metaY = useTransform(scaleEntry, [0.4, 0.55], [16, 0]);
  const titleProgress = useTransform(scaleEntry, [0.5, 0.86], [0, 1]);
  // Unpinned (archive) path: scaleEntry stays 0, which would leave every
  // title character at opacity 0. Constant 1 = fully visible, no scroll math.
  const staticTitle = useMotionValue(1);
  const descOpacity = useTransform(scaleEntry, [0.62, 0.86], [0, 1]);
  const descY = useTransform(scaleEntry, [0.62, 0.86], [20, 0]);
  const resultsOpacity = useTransform(scaleEntry, [0.7, 0.86], [0, 1]);
  const ctaOpacity = useTransform(scaleEntry, [0.76, 0.86], [0, 1]);

  // All cards pin at the SAME top with the SAME full height: each covers the
  // previous (higher z-index) so exactly one project fills the viewport.
  const screenStyle = pinned
    ? ({
        position: "sticky",
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
        zIndex: index,
      } as const)
    : undefined;

  const ref = wrapperRef ?? cardRef;

  return (
    <div
      ref={ref}
      style={screenStyle}
      className={`work-screen${index === 0 ? " work-screen--first" : ""}`}
      data-accent={project.accent}
      data-cursor="label"
      data-cursor-label="VIEW"
    >
      <div
        ref={innerRef}
        className="work-screen__card"
        style={{ transformOrigin: "center top" }}
      >
        <div className="work-screen__media">
          <motion.div
            className="work-screen__img"
            style={{
              scale: pinned ? imageScale : undefined,
              transformOrigin: index % 2 ? "50% 30%" : "50% 70%",
              willChange: pinned ? "transform" : undefined,
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="100vw"
              className="work-screen__cover"
              priority={index === 0}
            />
          </motion.div>
          <div
            className="work-screen__scrim"
            style={{ "--screen-accent": project.accent } as CSSProperties}
          />
          <div className="work-screen__veil" />
        </div>

        <span className="work-screen__index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="work-screen__body">
          <motion.p
            className="work-screen__meta"
            style={{ opacity: pinned ? metaOpacity : undefined, y: pinned ? metaY : undefined }}
          >
            {project.category} — {project.year}
          </motion.p>

          <h3 className="work-screen__title">
            <ScreenTitle progress={pinned ? titleProgress : staticTitle} text={project.title} />
          </h3>

          <motion.p
            className="work-screen__desc"
            style={{ opacity: pinned ? descOpacity : undefined, y: pinned ? descY : undefined }}
          >
            {project.description}
          </motion.p>

          <motion.div
            className="work-screen__results"
            style={{ opacity: pinned ? resultsOpacity : undefined }}
          >
            {project.results.map((r) => (
              <span className="work-screen__result" key={r}>
                {r}
              </span>
            ))}
          </motion.div>

          <motion.a
            href={ctaHref}
            className="work-screen__cta"
            data-cursor="hover"
            style={{ opacity: pinned ? ctaOpacity : undefined }}
          >
            Start something similar <span aria-hidden="true">→</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

/**
 * Closing statement screen — the last card in the stack.
 * No image: crafted espresso gradient + oversized serif/sans mix.
 */
export function WorkEndCard({
  index,
  pinned,
  wrapperRef,
  innerRef,
}: {
  index: number;
  pinned: boolean;
  wrapperRef?: Ref<HTMLDivElement | null>;
  innerRef?: Ref<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: entry } = useScroll({
    target: pinned ? cardRef : undefined,
    offset: ["start end", "start start"],
  });
  const entryFallback = useMotionValue(0);
  const scaleEntry = pinned ? entry : entryFallback;

  const contentOpacity = useTransform(scaleEntry, [0.3, 0.55], [0, 1]);
  const contentY = useTransform(scaleEntry, [0.3, 0.55], [28, 0]);
  const ctaOpacity = useTransform(scaleEntry, [0.7, 0.86], [0, 1]);

  const screenStyle = pinned
    ? ({
        position: "sticky",
        top: "var(--nav-height)",
        height: "calc(100svh - var(--nav-height))",
        zIndex: index,
      } as const)
    : undefined;

  return (
    <div
      ref={wrapperRef ?? cardRef}
      style={screenStyle}
      className="work-screen work-screen--end"
      data-cursor="label"
      data-cursor-label="START"
    >
      <div
        ref={innerRef}
        className="work-screen__card work-screen__card--end"
        style={{ transformOrigin: "center top" }}
      >
        <div className="work-screen__end-bg" aria-hidden="true" />
        <div className="work-screen__end-grain" aria-hidden="true" />

        <div className="work-screen__body work-screen__body--end">
          <motion.p
            className="work-screen__meta"
            style={{ opacity: pinned ? contentOpacity : undefined, y: pinned ? contentY : undefined }}
          >
            06 — What&rsquo;s next
          </motion.p>
          <p className="work-screen__end-title">
            Five shipped.{" "}
            <em>
              Yours could be
              <br />
              next.
            </em>
          </p>
          <motion.a
            href="#contact"
            className="work-screen__cta"
            data-cursor="hover"
            style={{ opacity: pinned ? ctaOpacity : undefined }}
          >
            Start your project <span aria-hidden="true">→</span>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

/**
 * Split-title with per-character reveal driven by a parent MotionValue.
 * Each char is its own component so the stagger lives in pure MotionValue
 * math — zero re-renders while scrolling.
 */
function ScreenTitle({ progress, text }: { progress: MotionValue<number>; text: string }) {
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span className="work-screen__title-inner" aria-label={text}>
      {words.map((word, wi) => (
        <span className="work-screen__word" key={`${word}-${wi}`} aria-hidden="true">
          {word.split("").map((ch, ci) => (
            <ScreenChar key={`${wi}-${ci}`} progress={progress} index={wi * 8 + ci}>
              {ch}
            </ScreenChar>
          ))}
        </span>
      ))}
    </span>
  );
}

function ScreenChar({
  progress,
  index,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  children: string;
}) {
  const from = index * 0.045;
  const y = useTransform(progress, [from, from + 0.14], [1, 0]);
  const opacity = useTransform(progress, [from, from + 0.14], [0, 1]);

  return (
    <motion.span className="work-screen__char" style={{ y, opacity }}>
      {children}
    </motion.span>
  );
}