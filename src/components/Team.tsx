"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import type { TeamMember } from "@/data/team";
import { useIsFinePointer } from "@/hooks/useMediaQuery";

const easeOut = [0.16, 1, 0.3, 1] as const;

function TeamPortrait({ member, index }: { member: TeamMember; index: number }) {
  const [failed, setFailed] = useState(false);
  const reduced = useReducedMotion();
  const finePointer = useIsFinePointer();
  const tiltEnabled = finePointer && !reduced;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18, mass: 0.6 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 12);
    rotateX.set(-py * 12);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="team__photo"
      style={{ rotateX: springX, rotateY: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {failed || !member.photo ? (
        <span className="team__initials" aria-hidden="true">
          {member.initials}
        </span>
      ) : (
        <>
          <span className="team__initials" aria-hidden="true">
            {member.initials}
          </span>
          <Image
            src={member.photo}
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            priority={index < 3}
            onError={() => setFailed(true)}
          />
        </>
      )}
      <div className="team__scrim" aria-hidden="true" />
    </motion.div>
  );
}

export default function Team({ team }: { team: TeamMember[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="team section" id="team" aria-label="Team">
      <div className="container">
        <SectionHeading
          eyebrow="07 — THE TEAM"
          title="The people behind the build."
          sub="Five or six people. No account managers between you and the work."
        />
        <div className="team__grid">
          {team.map((member, i) => (
            <motion.article
              key={member.id}
              className="team__member group"
              data-cursor="hover"
              style={{ "--accent": member.accent } as CSSProperties}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -6% 0px" }}
              transition={{ duration: 0.7, ease: [...easeOut], delay: i * 0.08 }}
              whileHover={reduced ? undefined : { y: -6 }}
            >
              <TeamPortrait member={member} index={i} />
              <h3 className="team__name">{member.name}</h3>
              <p className="team__role">{member.title}</p>
              <p className="team__specialty">{member.specialty}</p>
              {member.tech.length > 0 && (
                <p
                  className="team__tech"
                  aria-label={`Technologies: ${member.tech.join(", ")}`}
                >
                  {member.tech.slice(0, 6).map((tech) => (
                    <span className="team__tech-chip" key={tech}>
                      {tech}
                    </span>
                  ))}
                  {member.tech.length > 6 && (
                    <span className="team__tech-chip" aria-hidden="true">
                      +{member.tech.length - 6}
                    </span>
                  )}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}