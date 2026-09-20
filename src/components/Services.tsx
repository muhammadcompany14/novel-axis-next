"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import type { Service } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const ROTATE_MS = 3200;
const EASE = [0.16, 1, 0.3, 1] as const;

/** Two-voice display: the capability name set extrabold, with its final
    word echoed in Instrument Serif italic (e.g. "SHOPIFY ecosystem"). */
function splitName(name: string): { head: string; tail: string | null } {
  const words = name.split(" ");
  if (words.length <= 1) return { head: name, tail: null };
  return { head: words.slice(0, -1).join(" "), tail: words[words.length - 1] };
}

function DisplayName({ name }: { name: string }) {
  const { head, tail } = splitName(name);
  return (
    <>
      <span className="services__name-head">{head}</span>
      {tail ? <em className="services__name-tail">&nbsp;{tail}</em> : null}
    </>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <div className="services__details-piece">
      <p className="services__details-desc">{service.description}</p>
      <ul className="services__details-items">
        {service.items.map((item, i) => (
          <li className="services__details-item" key={item.name}>
            <span className="services__details-item-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="services__details-item-text">
              <strong>{item.name}</strong>
              <span>{item.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services({ services }: { services: Service[] }) {
  const N = services.length;
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const go = useCallback((i: number) => setActive(((i % N) + N) % N), [N]);
  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  /* Auto-reel — pauses while the pointer is over the stage or a control has
     focus, so it never fights the visitor. Content is always fully rendered
     for the active discipline; this is a self-running showcase, not a reveal. */
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % N), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [N, paused, reduced]);

  /* Gentle scroll drift on the display type + giant numeral. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [34, -34]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.55, 1, 1, 0.55]);

  /* Reduced motion / unsure inputs: every capability is shown, fully, stacked. */
  if (reduced) {
    return (
      <section className="services" id="services" aria-label="Capabilities">
        <div className="services__head">
          <div className="container">
            <SectionHeading eyebrow="02 — CAPABILITIES" title="What we engineer." />
          </div>
        </div>
        <div className="container">
          <ul className="services__static">
            {services.map((s) => (
              <li className="services__static-row" key={s.id}>
                <span className="services__static-index">{s.index}</span>
                <div className="services__static-copy">
                  <h3 className="services__static-name">
                    <DisplayName name={s.name} />
                  </h3>
                  <p className="services__static-tagline">{s.tagline}</p>
                </div>
                <div className="services__static-detail">
                  <ServiceDetails service={s} />
                  <p className="services__static-highlight">
                    <em>{s.highlight}</em>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const s = services[active];

  return (
    <section
      className="services"
      id="services"
      aria-label="Capabilities"
      ref={sectionRef}
    >
      <div className="services__head">
        <div className="container">
          <SectionHeading eyebrow="02 — CAPABILITIES" title="What we engineer." />
        </div>
      </div>

      <div className="container">
        <motion.div
          className="services__stage"
          style={{ opacity: stageOpacity }}
          onPointerEnter={pause}
          onPointerLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
        >
          <motion.span
            className="services__stage-numeral"
            style={{ y: numeralY }}
            aria-hidden="true"
          >
            {s.index}
          </motion.span>
          <div className="services__stage-glow" aria-hidden="true" />
          <div className="services__stage-grid" aria-hidden="true" />

          <motion.div className="services__stage-type" style={{ y: nameY }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                className="services__stage-piece"
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -28, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="services__stage-overline">
                  discipline {s.index}
                </p>
                <h3 className="services__stage-name">
                  <DisplayName name={s.name} />
                </h3>
                <p className="services__stage-tagline">{s.tagline}</p>
                <p className="services__stage-highlight">
                  <em>{s.highlight}</em>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="services__stage-controls">
            <button
              type="button"
              className="services__stage-btn"
              aria-label="Previous capability"
              onClick={() => go(active - 1)}
            >
              ↑
            </button>
            <div className="services__stage-dots" role="group" aria-label="Choose a capability">
              {services.map((el, i) => (
                <button
                  key={el.id}
                  type="button"
                  className={`services__stage-dot${i === active ? " is-active" : ""}`}
                  aria-label={`Show ${el.name}`}
                  aria-current={i === active}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="services__stage-btn"
              aria-label="Next capability"
              onClick={() => go(active + 1)}
            >
              ↓
            </button>
          </div>

          <p className="services__stage-index" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </p>
        </motion.div>

        <div className="services__details" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.id}
              className="services__details-piece"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ServiceDetails service={s} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}