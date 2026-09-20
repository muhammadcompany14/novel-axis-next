"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { coreTechnologies, stack, stackIcons } from "@/data/technologies";
import { techIconSrc } from "@/data/images";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const techHue = (hue: number) => `hsl(${(((252 - hue * 56) % 360) + 360) % 360} 85% 62%)`;

/* Golden angle (137.5°) phyllotaxis — spreads every star evenly across the
   field rectangle. No clusters, no empty sides: the whole picture is shown. */
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const FLEET_SIZE = 23;
const RX = 0.4; // constellation spans 0.8 × field width
const RY = 0.36; // constellation spans 0.72 × field height

const REPEL_RADIUS = 120;
const NEAR_DIST = 150; // hover ripple reach
const OFFSCREEN = 4000; // cursor sentinel when the pointer leaves the field
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const SPRING = { stiffness: 260, damping: 24, mass: 0.5 };

const DEPTH_PUSH = { fore: 44, mid: 32, deep: 24 } as const;
type Depth = keyof typeof DEPTH_PUSH;

interface FleetItem {
  name: string;
  icon?: { slug: string; color: string };
  hue: number;
  index: number; // 0 → Shopify (the core star)
}

interface PlacedStar extends FleetItem {
  x: number;
  y: number;
  depth: Depth;
  isCore: boolean;
}

/* Order matters: Shopify leads the fleet, then the core stack, then the rest. */
function buildFleet(): FleetItem[] {
  const shopify = coreTechnologies.find((t) => t.name === "Shopify");
  const rest = coreTechnologies.filter((t) => t.name !== "Shopify");
  return [
    ...(shopify ? [{ name: shopify.name, icon: shopify.icon, hue: shopify.hue }] : []),
    ...rest.map((t) => ({ name: t.name, icon: t.icon, hue: t.hue })),
    ...stack.map((name, i) => ({ name, icon: stackIcons[name], hue: 1 + ((i * 7) % 9) })),
  ].map((it, index) => ({ ...it, index }));
}

/* ------------------------------------------------------------------ */
/* Static fallback — touch / coarse pointer / reduced motion           */
/* ------------------------------------------------------------------ */

function StaticFallback() {
  const fleet = useMemo(() => buildFleet(), []);
  return (
    <div className="tech__fallback">
      <ul className="tech__list">
        {fleet.map((item, i) => (
          <li key={item.name} className="tech__item">
            <span className="tech__item-name">
              {item.icon ? (
                <Image
                  src={techIconSrc(item.icon.slug, item.icon.color)}
                  alt=""
                  width={14}
                  height={14}
                  className="tech__item-icon"
                />
              ) : (
                <span className="tech__item-dot" style={{ background: techHue(item.hue) }} />
              )}
              {item.name}
            </span>
            <span className="tech__item-num">{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Constellation star — fixed position, no individual orbit or drift   */
/* ------------------------------------------------------------------ */

function Star({
  star,
  cursorX,
  cursorY,
  hovered,
  near,
  onHover,
}: {
  star: PlacedStar;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
  hovered: string | null;
  near: boolean;
  onHover: (id: string | null) => void;
}) {
  const sx = useSpring(0, SPRING);
  const sy = useSpring(0, SPRING);
  const id = `star:${star.name}`;
  const isHovered = hovered === id;

  /* Stars never wander. The cursor gently pushes nearby ones and they
     spring straight back to their fixed spot in the constellation. */
  useEffect(() => {
    const unsub = cursorX.on("change", (mx) => {
      const my = cursorY.get();
      const cx = star.x + sx.get();
      const cy = star.y + sy.get();
      const dx = cx - mx;
      const dy = cy - my;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL_RADIUS && dist > 0.001) {
        const f = (1 - dist / REPEL_RADIUS) * DEPTH_PUSH[star.depth];
        sx.set((dx / dist) * f);
        sy.set((dy / dist) * f);
      } else {
        sx.set(0);
        sy.set(0);
      }
    });
    return unsub;
  }, [cursorX, cursorY, sx, sy, star.x, star.y, star.depth]);

  return (
    <div
      className={`tech__star tech__star--${star.depth}${star.isCore ? " tech__star--core" : ""}${
        isHovered ? " is-hovered" : ""
      }${near ? " is-near" : ""}`}
      style={{ left: star.x, top: star.y }}
    >
      <motion.div style={{ x: sx, y: sy }}>
        <button
          className="tech__star-btn"
          data-cursor="label"
          data-cursor-label="VIEW"
          aria-label={star.name}
          onPointerEnter={() => onHover(id)}
          onPointerLeave={() => onHover(null)}
        >
          {star.icon ? (
            <Image
              src={techIconSrc(star.icon.slug, star.icon.color)}
              alt=""
              width={24}
              height={24}
            />
          ) : (
            <span className="tech__star-dot" style={{ background: techHue(star.hue) }} />
          )}
        </button>
        <span className="tech__star-name">
          {star.isCore ? "Shopify · core" : star.name}
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Living constellation — the whole fleet floats together as ONE piece */
/* ------------------------------------------------------------------ */

function LivingField({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [fieldSize, setFieldSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<string | null>(null);
  const cursorX = useMotionValue(-OFFSCREEN);
  const cursorY = useMotionValue(-OFFSCREEN);
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const docPosRef = useRef({ top: 0, left: 0 });
  const sizeRef = useRef({ w: 1, h: 1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const systemY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0.35, 1, 1, 0.35]);

  /* The constellation tilts toward the cursor (±6°, relaxed to 0 off-screen). */
  const tiltX = useTransform(cursorY, (y) =>
    Math.abs(y) > OFFSCREEN
      ? 0
      : clamp(((y - sizeRef.current.h / 2) / (sizeRef.current.h / 2)) * 6, -6, 6)
  );
  const tiltY = useTransform(cursorX, (x) =>
    Math.abs(x) > OFFSCREEN
      ? 0
      : clamp(((x - sizeRef.current.w / 2) / (sizeRef.current.w / 2)) * 6, -6, 6)
  );

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
      docPosRef.current = { top: r.top + window.scrollY, left: r.left + window.scrollX };
      sizeRef.current = { w: r.width, h: r.height };
      setFieldSize({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      rectRef.current.left = docPosRef.current.left - window.scrollX;
      rectRef.current.top = docPosRef.current.top - window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = rectRef.current;
    cursorX.set(e.clientX - r.left);
    cursorY.set(e.clientY - r.top);
  };

  const onPointerEnter = () => {
    const el = fieldRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    docPosRef.current = { top: r.top + window.scrollY, left: r.left + window.scrollX };
  };

  const onPointerLeave = () => {
    cursorX.set(-OFFSCREEN);
    cursorY.set(-OFFSCREEN);
  };

  const onHover = useCallback((id: string | null) => setHovered(id), []);

  /* Fixed constellation layout — computed once per field size. */
  const fleet = useMemo(() => buildFleet(), []);
  const layout = useMemo<PlacedStar[]>(() => {
    if (fieldSize.w === 0) return [];
    const cx = fieldSize.w / 2;
    const cy = fieldSize.h / 2;
    return fleet.map((item) => {
      const f = Math.sqrt((item.index + 1) / FLEET_SIZE);
      const a = item.index * GOLDEN;
      const depth: Depth = f < 0.48 ? "fore" : f < 0.75 ? "mid" : "deep";
      return {
        ...item,
        x: cx + f * Math.cos(a) * RX * fieldSize.w,
        y: cy + f * Math.sin(a) * RY * fieldSize.h,
        depth,
        isCore: item.index === 0,
      };
    });
  }, [fleet, fieldSize]);

  const anchorById = useMemo(
    () => new Map(layout.map((star) => [`star:${star.name}`, star])),
    [layout]
  );

  const ready = fieldSize.w > 0 && fieldSize.h > 0;
  const isSpotlight = hovered !== null && hovered.startsWith("star:");

  return (
    <div
      className={`tech__field${isSpotlight ? " is-spotlight" : ""}`}
      ref={fieldRef}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <motion.div className="tech__field-inner" style={{ opacity: fieldOpacity, y: systemY }}>
        <div className="tech__glow" />
        <motion.div
          className="tech__galaxy"
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        >
          {ready &&
            layout.map((star) => {
              const hAnchor = anchorById.get(hovered ?? "");
              const near =
                hAnchor !== undefined &&
                hAnchor !== star &&
                Math.hypot(star.x - hAnchor.x, star.y - hAnchor.y) < NEAR_DIST;
              return (
                <Star
                  key={star.name}
                  star={star}
                  cursorX={cursorX}
                  cursorY={cursorY}
                  hovered={hovered}
                  near={near}
                  onHover={onHover}
                />
              );
            })}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Technology() {
  const finePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const pinned = finePointer && !reducedMotion;
  const showConstellation = !reducedMotion;
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      className="tech section"
      id="technology"
      aria-label="Technology ecosystem"
      ref={sectionRef}
    >
      <div className="container">
        <SectionHeading
          eyebrow="04 — ECOSYSTEM"
          title="Built with the modern web."
          sub="An engineering team fluent across the stack — storefronts, interfaces, backends, and everything between."
        />
      </div>

      <div className="container">
        {!pinned && <StaticFallback />}
        {showConstellation && <LivingField sectionRef={sectionRef} />}
      </div>
    </section>
  );
}