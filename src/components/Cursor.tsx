"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorMode = "default" | "hover" | "label";

const noopSubscribe = () => () => {};

const subscribeStore: { subscribe: (cb: () => void) => () => void; get: () => boolean; getServer: () => boolean } = {
  subscribe: noopSubscribe,
  get: () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  getServer: () => false,
};

export default function Cursor() {
  const enabled = useSyncExternalStore(
    subscribeStore.subscribe,
    subscribeStore.get,
    subscribeStore.getServer
  );
  const [hidden, setHidden] = useState(true);
  const [down, setDown] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const labelRef = useRef<HTMLSpanElement>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (el) {
        const kind = el.dataset.cursor;
        if (kind === "label" || kind === "drag") {
          setMode("label");
          if (labelRef.current) {
            labelRef.current.textContent = el.dataset.cursorLabel ?? (kind === "drag" ? "DRAG" : "");
          }
        } else {
          setMode("hover");
        }
      } else {
        setMode("default");
      }
    };
    const leave = () => setHidden(true);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  if (!enabled) return null;

  const cls = [
    "cursor",
    hidden ? "is-hidden" : "",
    down ? "is-down" : "",
    mode === "hover" ? "is-hover" : "",
    mode === "label" ? "is-label" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      aria-hidden="true"
      className={cls}
      style={{ x: sx, y: sy }}
      transformTemplate={(_, t) => `translate(-50%, -50%) ${t}`}
    >
      <span className="cursor__label" ref={labelRef} />
    </motion.div>
  );
}