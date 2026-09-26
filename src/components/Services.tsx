"use client";

import { type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { Service, ServiceIcon } from "@/data/services";
import SectionHeading from "@/components/SectionHeading";
import { useIsFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const EASE = [0.16, 1, 0.3, 1] as const;

const SERVICE_ACCENTS = {
  shopify: "var(--color-accent-1)",
  web: "var(--color-accent-2)",
  uiux: "color-mix(in srgb, var(--color-accent-1) 68%, var(--color-accent-2))",
  apps: "color-mix(in srgb, var(--color-accent-2) 68%, var(--color-accent-1))",
  wordpress: "#4ee0b4",
  squarespace: "#7a8cff",
} as const satisfies Record<ServiceIcon, string>;

const SERVICE_CATEGORIES = {
  shopify: "commerce",
  web: "web",
  uiux: "experience",
  apps: "software",
  wordpress: "cms",
  squarespace: "platform",
} as const satisfies Record<ServiceIcon, string>;

function splitName(name: string): { head: string; tail: string | null } {
  const words = name.split(" ");
  if (words.length <= 1) return { head: name, tail: null };
  return { head: words.slice(0, -1).join(" "), tail: words[words.length - 1] };
}

function DisplayName({ name }: { name: string }) {
  const { head, tail } = splitName(name);
  return (
    <>
      <span className="services__name-head">{head}</span>
      {tail ? <em className="services__name-tail">&nbsp;{tail}</em> : null}
    </>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  return (
    <div className="services__details-piece">
      <p className="services__details-desc">{service.description}</p>
      <ul className="services__details-items">
        {service.items.map((item, i) => (
          <li className="services__details-item" key={item.name}>
            <span className="services__details-item-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="services__details-item-text">
              <strong>{item.name}</strong>
              <span>{item.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services({ services }: { services: Service[] }) {
  const finePointer = useIsFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const animateRows = finePointer && !reducedMotion;

  return (
    <section className="services" id="services" aria-label="Capabilities">
      <div className="services__head">
        <div className="container">
          <SectionHeading
            eyebrow="02 — CAPABILITIES"
            title="Digital products, experiences, and systems."
          />
        </div>
      </div>

      <div className="container">
        <ul className="services__static">
          {services.map((service, index) => (
            <motion.li
              className="services__static-row"
              data-service={service.icon}
              key={service.id}
              style={{ "--screen-accent": SERVICE_ACCENTS[service.icon] } as CSSProperties}
              initial={animateRows ? { opacity: 0 } : false}
              whileInView={animateRows ? { opacity: 1 } : undefined}
              viewport={animateRows ? { once: true, margin: "0px 0px -8% 0px" } : undefined}
              transition={{
                duration: 0.65,
                ease: EASE,
                delay: Math.min(index * 0.06, 0.18),
              }}
              aria-labelledby={`${service.id}-name`}
            >
              <div className="services__static-meta">
                <span className="services__static-index">{service.index}</span>
                <span className="services__static-kicker">
                  {SERVICE_CATEGORIES[service.icon]}
                </span>
              </div>

              <div className="services__static-copy">
                <h3 className="services__static-name" id={`${service.id}-name`}>
                  <DisplayName name={service.name} />
                </h3>
                <p className="services__static-tagline">{service.tagline}</p>
              </div>

              <div className="services__static-detail">
                <ServiceDetails service={service} />
                <p className="services__static-highlight">
                  <em>{service.highlight}</em>
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
