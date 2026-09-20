"use client";

import { useEffect, useRef } from "react";
import { mulberry32 } from "@/lib/rand";

interface ParticleFieldProps {
  className?: string;
  density?: number;
  colors?: string[];
  speed?: [number, number];
  size?: [number, number];
  parallax?: number;
  seed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  tw: number;
  twSpeed: number;
}

export default function ParticleField({
  className = "",
  density = 14,
  colors = ["200,149,108", "232,193,122", "240,232,220"],
  speed = [0.05, 0.2],
  size = [0.6, 2],
  parallax = 14,
  seed = 1,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1366px)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    const dpr = wide && hover ? 1.5 : window.innerWidth >= 861 ? 1.25 : 1;

    const rand = mulberry32(seed);
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let rafId = 0;
    let visible = true;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    const count = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const target = Math.round(((w * h) / 16000) * (density / 14));
      return Math.max(8, Math.min(110, target));
    };

    const makeParticles = (w: number, h: number): Particle[] =>
      Array.from({ length: count() }, () => ({
        x: rand() * w,
        y: rand() * h,
        vx: (rand() - 0.5) * (speed[1] - speed[0]) * 2 + speed[0] * 0.4,
        vy: -(rand() * (speed[1] - speed[0]) + speed[0]),
        r: rand() * (size[1] - size[0]) + size[0],
        color: colors[Math.floor(rand() * colors.length)],
        tw: rand() * Math.PI * 2,
        twSpeed: 0.4 + rand() * 1.1,
      }));

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let particles = makeParticles(canvas.clientWidth, canvas.clientHeight);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const ox = -pointer.x * parallax;
      const oy = -pointer.y * parallax;

      ctx.save();
      ctx.translate(ox, oy);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = rand() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;

        p.tw += p.twSpeed * 0.016;
        const alpha = 0.25 + (Math.sin(p.tw) + 1) * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${alpha})`;
        ctx.fill();
      }

      ctx.restore();
    };

    const step = () => {
      if (visible) draw();
      rafId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("pointermove", onPointer, { passive: true });

    const ro = new ResizeObserver(() => {
      resize();
      particles = makeParticles(canvas.clientWidth, canvas.clientHeight);
      if (reduced) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (reduced) {
      draw();
    } else {
      step();
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, [density, colors, seed, size, speed, parallax]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}