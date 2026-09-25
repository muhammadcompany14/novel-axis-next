"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

interface SplitTitleProps {
  text: string;
  em?: string;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}

const shellVariants: Variants = {
  hidden: {},
  visible: {},
};

const wordVariants: Variants = {
  hidden: { y: "115%", opacity: 0 },
  visible: { y: "0%", opacity: 1 },
};

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
            variants={wordVariants}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
          >
            {w}
            {i < lastIndex ? "\u00A0" : ""}
          </motion.span>
        );
        return (
          <motion.span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
            variants={shellVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "0px 0px -8% 0px" }}
          >
            {isEm ? <em>{inner}</em> : inner}
          </motion.span>
        );
      })}
    </Tag>
  );
}