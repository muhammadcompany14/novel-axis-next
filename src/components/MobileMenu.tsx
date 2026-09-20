"use client";

import { useEffect } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { site } from "@/data/site";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.07,
        delayChildren: reduced ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 30 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const footVariants: Variants = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 },
        },
      };

  return (
    <div
      id="mobile-menu"
      className={`mobile-menu${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      aria-hidden={!open}
    >
      <div className="mobile-menu__inner">
        <motion.ul
          className="mobile-menu__list"
          initial="hidden"
          animate={open ? "show" : "hidden"}
          variants={listVariants}
        >
          {site.mobileNav.map((link) => (
            <motion.li key={link.href} variants={itemVariants}>
              <a className="mobile-menu__link" href={link.href} onClick={onClose} data-cursor="hover">
                <span className="mobile-menu__num">{link.num}</span>
                <span>{link.label}</span>
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mobile-menu__cta-wrap"
          initial="hidden"
          animate={open ? "show" : "hidden"}
          variants={footVariants}
        >
          <a className="btn btn--primary mobile-menu__cta" href="#contact" onClick={onClose} data-cursor="hover">
            <span className="btn__label">Start a Project</span>
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </motion.div>

        <motion.p
          className="mobile-menu__foot"
          initial="hidden"
          animate={open ? "show" : "hidden"}
          variants={footVariants}
        >
          {site.email}
        </motion.p>
      </div>
    </div>
  );
}