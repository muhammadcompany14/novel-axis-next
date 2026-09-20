"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { processSteps } from "@/data/process";
import SectionHeading from "@/components/SectionHeading";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/* ---- Editorial Spine geometry -------------------------------------------
   The section is one scroll-length wrapper: (N-1) steps of 80vh travel plus
   one viewport of overrun after the last hand-off. The sticky child pins for
   all of it; the copy stack travels at constant velocity and each step lands
   dead-centre on a MEASURED stop (see useStackStops) — never an estimate. */

const N = processSteps.length;
const STEP_VH = 80;
const VIEWPORT_VH = 100;
const PINNED_VH = (N - 1) * STEP_VH;
const SECTION_VH = PINNED_VH + VIEWPORT_VH;
const UNPIN = PINNED_VH / SECTION_VH;
const COPY_END = UNPIN;
const STEP_STOPS = processSteps.map((_, i) => i);
const ESTIMATED_BLOCK_H = 260;
const STEP_GAP = 120;
const INACTIVE_OPACITY = 0.32;

/* Measured stops: the y offset that centres each copy block inside the stack.
   Positions are read RELATIVE to the stack, so an in-flight scroll transform
   on the stack itself cancels out and can't skew them. The seed only covers
   the first paint (the section is far below the fold, so it is never seen). */
function useStackStops(
  stackRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
): number[] {
  const [stops, setStops] = useState<number[]>(() =>
    STEP_STOPS.map((i) => ((N - 1) / 2 - i) * (ESTIMATED_BLOCK_H + STEP_GAP))
  );

  useEffect(() => {
    if (!enabled) return;
    const stack = stackRef.current;
    if (!stack) return;

    const measure = () => {
      const stackRect = stack.getBoundingClientRect();
      const blocks = Array.from(stack.children) as HTMLElement[];
      const next = blocks.map((block) => {
        const rect = block.getBoundingClientRect();
        return stackRect.height / 2 - (rect.top - stackRect.top + rect.height / 2);
      });
      // Bail on a no-op: this runs from a ResizeObserver, and setting state
      // unconditionally would loop.
      setStops((prev) =>
        prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.5)
          ? prev
          : next
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stack);
    // Observe the blocks too: the stack's own height changing is not the only
    // way the centres move (a body re-wrapping shifts its siblings).
    Array.from(stack.children).forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [stackRef, enabled]);

  return stops;
}

export default function Process() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const pinned = !reduced && !isMobile;

  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: pinned ? sectionRef : undefined,
    offset: ["start start", "end start"],
  });

  const copyIndex = useTransform(scrollYProgress, [0, COPY_END], [0, N - 1]);
  const stackStops = useStackStops(stackRef, pinned);
  const stackY = useTransform(copyIndex, STEP_STOPS, stackStops);
  const hairlineScale = useTransform(scrollYProgress, [0, UNPIN], [0, 1]);

  useMotionValueEvent(copyIndex, "change", (i) => {
    if (!pinned) return;
    const next = Math.min(N - 1, Math.max(0, Math.round(i)));
    setActive((prev) => (prev === next ? prev : next));
  });

  // Mount-time sync: "change" only fires on a CHANGE, so a reload landing
  // inside the section would otherwise never arm. Deferred a frame so the
  // observer has measured.
  useEffect(() => {
    if (!pinned) return;
    const id = requestAnimationFrame(() => {
      setActive((prev) => {
        const next = Math.min(N - 1, Math.max(0, Math.round(copyIndex.get())));
        return prev === next ? prev : next;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pinned, copyIndex]);

  const step = processSteps[active];

  return (
    <section ref={sectionRef} className="section process" id="process" aria-label="Our process">
      {/* Pinned editorial spine — desktop, motion allowed */}
      <div
        className="process__spine"
        style={{ height: pinned ? `${SECTION_VH}vh` : undefined }}
      >
        <div className="process__pin">
          <div className="container">
            <div className="process__masthead">
              <SectionHeading
                eyebrow="05 — PROCESS"
                title="How we build."
                titleClassName="process__masthead-title"
              >
                <div className="process__ticker" aria-hidden="true">
                  <span className="process__ticker-num">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="process__ticker-total">
                    / {String(N).padStart(2, "0")}
                  </span>
                </div>
              </SectionHeading>
            </div>
          </div>

          <div className="container process__stage">
            <div className="process__copy">
              <motion.div
                ref={stackRef}
                className="process__stack"
                style={{ y: stackY }}
              >
                {processSteps.map((s, i) => (
                  <div
                    key={s.num}
                    className="process__step"
                    style={{ opacity: active === i ? 1 : INACTIVE_OPACITY }}
                  >
                    <p className="process__step-label">
                      {s.num} — {s.title.toUpperCase()}
                    </p>
                    <h3 className="process__step-title">{s.headline}</h3>
                    <p className="process__step-desc">{s.desc}</p>
                    <p className="process__step-meta">{s.meta}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="process__frame-wrap">
              <div className="process__frame" aria-hidden="true">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className="process__artifact"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -32 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="process__artifact-tag">
                      PROCESS / {step.num}
                    </span>
                    <div className="process__artifact-core">
                      <span className="process__artifact-num">{step.num}</span>
                      <span className="process__artifact-rule" />
                    </div>
                    <span className="process__artifact-meta">{step.meta}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="process__hairline" aria-hidden="true">
            <motion.div
              className="process__hairline-fill"
              style={{ scaleX: hairlineScale }}
            />
          </div>
        </div>
      </div>

      {/* Static list — mobile / reduced motion (no pin, no scroll-jack) */}
      <div className="container process__list-wrap">
        <SectionHeading eyebrow="05 — PROCESS" title="How we build." />
        <div className="process__list">
          {processSteps.map((s) => (
            <article key={s.num} className="process__row">
              <span className="process__row-num">{s.num}</span>
              <div className="process__row-body">
                <h3 className="process__row-title">{s.title}</h3>
                <p className="process__row-desc">{s.desc}</p>
                <p className="process__row-meta">{s.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}