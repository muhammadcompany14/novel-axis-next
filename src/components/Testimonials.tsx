"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import type { Testimonial } from "@/data/testimonials";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const easeOut = [0.16, 1, 0.3, 1] as const;

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <motion.article
      className="testimonial"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.7, ease: [...easeOut], delay: index * 0.05 }}
    >
      <span className="testimonial__mark" aria-hidden="true">
        “
      </span>
      <p className="testimonial__quote">{t.quote}</p>
      <div className="testimonial__meta">
        <span className="testimonial__client">{t.name}</span>
        <span className="testimonial__company">{t.role}</span>
      </div>
      <span className="testimonial__project">{t.company}</span>
    </motion.article>
  );
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const reduced = usePrefersReducedMotion();
  const firstHalf = testimonials.slice(0, 7);
  const secondHalf = testimonials.slice(7);

  const renderRow = (items: Testimonial[], reverse: boolean) => (
    <div
      className={`testimonials__row${reverse && !reduced ? " testimonials__row--reverse" : ""}`}
    >
      {items.map((t, i) => (
        <TestimonialCard key={t.id} t={t} index={i} />
      ))}
      {!reduced &&
        items.map((t, i) => (
          <TestimonialCard key={`${t.id}-dup`} t={t} index={i} />
        ))}
    </div>
  );

  return (
    <section
      className="testimonials section section--cream section--lift"
      id="testimonials"
      aria-label="Testimonials"
    >
      <div className="container">
          <SectionHeading
            eyebrow="08 · CLIENT EXPERIENCES"
            title="What clients notice in use."
            sub="Feedback from the teams who put the finished product to work."
          />

        <div className="testimonials__marquee">
          {renderRow(firstHalf, false)}
          {renderRow(secondHalf, true)}
        </div>
      </div>
    </section>
  );
}