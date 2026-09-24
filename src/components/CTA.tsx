"use client";

import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";
import ParticleField from "@/components/ParticleField";
import Reveal from "@/components/Reveal";
import SplitTitle from "@/components/SplitTitle";
import { site } from "@/data/site";
import { images } from "@/data/images";

type CTAProps = {
  cta?: { label: string; copy: string; title: readonly string[] };
};

export default function CTA({ cta = site.cta }: CTAProps = {}) {
  return (
    <section className="cta" id="cta" aria-label="Start a project">
      <Image
        src={images.ctaGlow}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 object-cover opacity-30"
      />
      <ParticleField
        className="cta__canvas"
        density={7}
        colors={["61,168,224", "201,244,33", "238,243,255"]}
        speed={[0.04, 0.14]}
        size={[0.6, 1.8]}
        parallax={16}
        seed={2}
      />
      <div className="cta__inner container">
        <Reveal>
          <p className="cta__label">{cta.label}</p>
        </Reveal>
        <SplitTitle
          text={`${cta.title[0]} ${cta.title[1]}`}
          em="ambitious"
          className="cta__title"
        />
        <Reveal delay={0.1}>
          <p className="cta__copy">{cta.copy}</p>
        </Reveal>
        <div className="cta__actions">
          <MagneticButton>
            <a href="#contact" className="btn btn--primary btn--lg" data-cursor="hover">
              <span className="btn__label">Start a Project</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}