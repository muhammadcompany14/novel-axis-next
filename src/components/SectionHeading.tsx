"use client";

import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import SplitTitle from "@/components/SplitTitle";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  em?: string;
  sub?: string;
  titleClassName?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeading({
  eyebrow,
  title,
  em,
  sub,
  titleClassName = "section-title",
  className = "",
  children,
}: SectionHeadingProps) {
  const split = children ? " section-head--split" : "";
  return (
    <div className={`section-head${split} ${className}`.trim()}>
      <div>
        <Reveal>
          <p className="section-label">{eyebrow}</p>
        </Reveal>
        <SplitTitle text={title} em={em} className={titleClassName} />
        {sub ? (
          <Reveal delay={0.12}>
            <p className="section-sub">{sub}</p>
          </Reveal>
        ) : null}
      </div>
      {children}
    </div>
  );
}