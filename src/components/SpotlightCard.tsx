"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28, mass: 0.6 };
const SPOTLIGHT_SIZE = 320;
const DIM_EASE = [0.25, 0.8, 0.35, 1] as const;

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  label?: string;
  dimmed?: boolean;
  parallax?: boolean;
  onHoverChange?: (hovered: boolean) => void;
}

export default function SpotlightCard({
  children,
  className = "",
  label,
  dimmed = false,
  parallax = false,
  onHoverChange,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);
  const spotX = useMotionValue(-160);
  const spotY = useMotionValue(-160);
  const opacity = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]),
    TILT_SPRING
  );
  const rotateY = useSpring(
    useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]),
    TILT_SPRING
  );

  const contentX = useSpring(
    useTransform(normX, [0, 1], [14, -14]),
    { stiffness: 220, damping: 26 }
  );
  const contentY = useSpring(
    useTransform(normY, [0, 1], [14, -14]),
    { stiffness: 220, damping: 26 }
  );

  const spotlight = useMotionTemplate`radial-gradient(${SPOTLIGHT_SIZE}px circle at ${spotX}px ${spotY}px, rgba(61, 168, 224, 0.2), transparent 72%)`;

  const setHover = (value: boolean) => {
    setHovered(value);
    onHoverChange?.(value);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    normX.set(px / rect.width);
    normY.set(py / rect.height);
    spotX.set(px);
    spotY.set(py);
    opacity.set(1);
  };

  const onPointerLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    spotX.set(-160);
    spotY.set(-160);
    opacity.set(0);
    setHover(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`spotlight-card${hovered ? " is-hovered" : ""} ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      animate={{
        opacity: dimmed ? 0.7 : 1,
        scale: dimmed ? 0.99 : 1,
        filter: dimmed ? "saturate(0.85)" : "saturate(1)",
      }}
      transition={{ duration: 0.45, ease: DIM_EASE }}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={onPointerLeave}
      data-cursor={label ? "label" : "hover"}
      data-cursor-label={label}
    >
      {parallax ? (
        <motion.div
          className="spotlight-card__content"
          style={{ x: contentX, y: contentY }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
      <motion.div
        aria-hidden="true"
        className="spotlight-card__glow"
        style={{ backgroundImage: spotlight, opacity }}
      />
    </motion.div>
  );
}