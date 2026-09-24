"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { site } from "@/data/site";
import MobileMenu from "@/components/MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = site.nav.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(`#${visible[0].target.id}`);
        } else if (window.scrollY < 240) {
          setActive(null);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="container nav__inner">
          <a className="nav__logo" href="#home" aria-label="Novel Axis Solutions — home" data-cursor="hover">
            <motion.span
              className="nav__logo-mark"
              aria-hidden="true"
              whileHover={reduced ? undefined : { scale: 1.07 }}
              transition={{ type: "spring", stiffness: 340, damping: 16 }}
            >
              <Image
                src="/novel_logo.png"
                alt="Novel Axis Solutions"
                width={40}
                height={40}
                priority
              />
            </motion.span>
            <span className="nav__logo-text">
              NOVEL AXIS
              <em>SOLUTIONS</em>
            </span>
          </a>

          <ul className="nav__links" aria-label="Primary">
            {site.nav.map((link, i) => (
              <li key={link.href}>
                <a
                  className={`nav__link${active === link.href ? " is-active" : ""}`}
                  href={link.href}
                  data-cursor="hover"
                  onClick={() => setActive(link.href)}
                >
                  <span className="nav__link-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav__cta">
            <a className="btn btn--ghost nav__cta-btn" href="#contact" data-cursor="hover">
              <span className="btn__label">Start a Project</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>

          <button
            type="button"
            className={`nav__burger${open ? " is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="nav__burger-line" />
            <span className="nav__burger-line" />
          </button>
        </div>

        {!reduced && (
          <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
        )}
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}