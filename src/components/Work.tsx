"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { type Project } from "@/data/projects";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import {
  WorkStackCard,
  WorkEndCard,
} from "@/components/WorkStackCard";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Home feature-slot: capped at five — the archive page (/projects) renders
// everything, so projects added later appear there instead of growing this deck.
export default function Work({ projects }: { projects: Project[] }) {
  // Keep all five featured builds, but don't open the deck with a Shopify
  // project: the services ledger closes on Applications, so a "Shopify
  // Ecosystem" card first reads as Shopify looping back around.
  const FEATURED = [...projects.slice(1, 5), projects[0]].slice(0, 5);
  const N = FEATURED.length + 1; // featured projects + end card

  const finePointer = useIsFinePointer();
  const reduced = usePrefersReducedMotion();
  const pinned = finePointer && !reduced;

  /* ---- refs ---- */
  const deckRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ---- measured deck geometry: burial + active windows are derived from
     real card offsets, so the CSS dwell margin stays in sync with JS timing ---- */
  const geometryRef = useRef<{
    tops: number[];
    range: number;
    viewport: number;
    nav: number;
  } | null>(null);

  useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!pinned || !deck) {
      geometryRef.current = null;
      return;
    }
    const measure = () => {
      const wrappers = deck.querySelectorAll<HTMLElement>(".work-screen");
      const nav =
        Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 76;
      geometryRef.current = {
        tops: Array.from(wrappers, (w) => w.offsetTop),
        range: Math.max(1, deck.offsetHeight - window.innerHeight),
        viewport: window.innerHeight,
        nav,
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pinned]);

  /* ---- state (only for button disabled — updated on index change) ---- */
  const [active, setActive] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [hint, setHint] = useState(true);

  /* ---- container scroll (deck progress 0→1) ---- */
  const { scrollYProgress: deckProgress } = useScroll({
    target: pinned ? deckRef : undefined,
    offset: ["start start", "end end"],
  });

  /* ---- rAF burial: write scale + opacity to every card inner directly ---- */
  useMotionValueEvent(deckProgress, "change", (v) => {
    if (!pinned) return;
    const geo = geometryRef.current;
    if (!geo) return;

    // active card: the deepest one whose pin line (top at nav-height) is passed
    let idx = 0;
    for (let i = 0; i < geo.tops.length; i++) {
      if (v * geo.range >= geo.tops[i] - geo.nav) idx = i;
    }
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }

    // counter text — zero re-render
    if (counterRef.current) {
      counterRef.current.textContent = String(idx + 1).padStart(2, "0");
    }

    // hint dismiss
    if (v > 0.025 && hint) setHint(false);

    // burial per card — direct DOM, zero React re-renders. Card i scales/dims
    // away while card i+1 travels from the viewport bottom to its pin line.
    innerRefs.current.forEach((el, i) => {
      if (!el || i >= geo.tops.length - 1) return;
      const next = geo.tops[i + 1];
      const start = (next - geo.viewport) / geo.range;
      const end = (next - geo.nav) / geo.range;
      const t = v < start ? 0 : v > end ? 1 : (v - start) / (end - start);
      const scale = 1 - 0.08 * t;
      const dim = 0.5 * t;
      el.style.transform = `scale(${scale})`;
      el.style.willChange = "transform";
      const veil = el.querySelector<HTMLElement>(".work-screen__veil");
      if (veil) veil.style.opacity = String(dim);
    });
  });

  /* ---- hint timeout ---- */
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(false), 3800);
    return () => clearTimeout(t);
  }, [hint]);

  /* ---- chrome visibility via IntersectionObserver ---- */
  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const io = new IntersectionObserver(
      ([entry]) => setChromeVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    io.observe(deck);
    return () => io.disconnect();
  }, []);

  /* ---- prev / next with Lenis ---- */
  const goTo = useCallback((i: number) => {
    const deck = deckRef.current;
    if (!deck) return;
    const iC = Math.max(0, Math.min(N - 1, i));
    const wrappers = deck.querySelectorAll<HTMLElement>(".work-screen");
    if (wrappers.length <= iC) return;
    // Flow layout, not pinned position: offsetTop is the card's in-flow top
    // within the deck, and all cards pin at nav-height — so scrolling there
    // brings the target card flush against the nav.
    const deckDocTop = deck.getBoundingClientRect().top + window.scrollY;
    const navHeight =
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) ||
      76;
    const target = deckDocTop + wrappers[iC].offsetTop - navHeight;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { duration: 1.2, force: true });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }, [N]);

  /* ---- keyboard navigation ---- */
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(active + 1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned, active, goTo]);

  const last = N - 1;

  return (
    <section
      className="work section"
      id="work"
      aria-label="Selected work"
      style={{ overflowX: "clip" }}
    >
      {/* ---- header (scrolls away before deck begins) ---- */}
      <div className="container">
        <SectionHeading
          eyebrow="03 — SELECTED WORK"
          title="Work that ships."
          titleClassName="section-title section-title--compact"
        >
          <div className="work-head__aside">
            <Reveal delay={0.1}>
              <p className="text-secondary" style={{ maxWidth: "34ch" }}>
                Five builds. Different problems, the same standard — engineered,
                shipped, and measured.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link className="btn btn--ghost" href="/projects" data-cursor="hover">
                <span className="btn__label">View more projects</span>
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </SectionHeading>
      </div>

      {pinned ? (
        <>
          {/* ---- sticky-stack deck ---- */}
          <div ref={deckRef} className="work__deck">
            {FEATURED.map((p, i) => (
              <WorkStackCard
                key={p.id}
                project={p}
                index={i}
                pinned
                innerRef={(el) => {
                  innerRefs.current[i] = el;
                }}
              />
            ))}
            <WorkEndCard
              index={last}
              pinned
              innerRef={(el) => {
                innerRefs.current[last] = el;
              }}
            />
            <div className="work__runway" aria-hidden="true" />
          </div>

          {/* ---- bottom chrome overlay ---- */}
          <div
            className={`work-chrome${chromeVisible ? " is-visible" : ""}`}
            aria-hidden={!chromeVisible}
          >
            <span ref={counterRef} className="work-chrome__counter">
              01
            </span>
            <span className="work-chrome__sep">/</span>
            <span className="work-chrome__total">
              {String(N).padStart(2, "0")}
            </span>

            <div className="work-chrome__bar" aria-hidden="true">
              <motion.div
                className="work-chrome__fill"
                style={{
                  scaleX: deckProgress,
                  transformOrigin: "left",
                }}
              />
            </div>

            <div
              className="work-chrome__nav"
              role="group"
              aria-label="Project navigation"
            >
              <button
                type="button"
                aria-label="Previous project"
                disabled={active === 0}
                data-cursor="hover"
                className="work-chrome__btn"
                onClick={() => goTo(active - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Next project"
                disabled={active === last}
                data-cursor="hover"
                className="work-chrome__btn"
                onClick={() => goTo(active + 1)}
              >
                ↓
              </button>
            </div>
          </div>

          {/* ---- scroll hint ---- */}
          <p
            className={`work-hint${hint ? " is-visible" : ""}`}
            aria-hidden={hint ? undefined : "true"}
          >
            SCROLL &mdash; EXPLORE
          </p>
        </>
      ) : (
        /* ---- fallback: plain vertical stack (mobile / reduced motion) ---- */
        <div className="work-list">
          {FEATURED.map((p, i) => (
            <WorkStackCard
              key={p.id}
              project={p}
              index={i}
              pinned={false}
            />
          ))}
          <WorkEndCard index={last} pinned={false} />
        </div>
      )}
    </section>
  );
}