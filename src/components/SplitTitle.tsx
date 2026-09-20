"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SplitTitleProps {
  text: string;
  em?: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}

export default function SplitTitle({
  text,
  em,
  className = "",
  delay = 0,
  once = true,
  as: Tag = "h2",
}: SplitTitleProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const lastIndex = words.length - 1;

  if (reduced) {
    return (
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={i}>
            {em && w === em ? <em>{w}</em> : w}
            {i < lastIndex ? " " : null}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => {
        const isEm = em && w === em;
        const inner = (
          <motion.span
            className="word"
            initial={{ y: "115%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
          >
            {w}
            {i < lastIndex ? "\u00A0" : ""}
          </motion.span>
        );
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
          >
            {isEm ? <em>{inner}</em> : inner}
          </span>
        );
      })}
    </Tag>
  );
}