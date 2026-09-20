import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { WorkStackCard } from "@/components/WorkStackCard";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Projects — Novel Axis Solutions",
  description:
    "Every project shipped by Novel Axis Solutions — Shopify builds, websites, applications, and digital products.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  const archiveCount = String(projects.length).padStart(2, "0");
  const categories = [...new Set(projects.map((p) => p.category))];
  const years = projects.map((p) => Number(p.year));
  const currentYear = new Date().getFullYear();
  const yearMin = years.length ? Math.min(...years) : currentYear;
  const yearMax = years.length ? Math.max(...years) : currentYear;

  return (
    <>
      <Navbar />
      <main>
        <section className="section projects-head" aria-label="All projects">
          <div className="projects__glow" aria-hidden="true" />
          <div className="container">
            <header className="projects__masthead">
              <div className="projects__topline">
                <Reveal>
                  <p className="projects__eyebrow">
                    <span className="projects__count">{archiveCount}</span>
                    <span>PROJECTS — FULL ARCHIVE</span>
                  </p>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="projects__range">
                    {yearMin} — {yearMax}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.05}>
                <h1 className="projects__title">
                  All the <em>work.</em>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="projects__support">
                  Every project we&rsquo;ve shipped — the featured builds from
                  the home page and everything after them.
                </p>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="projects__cats">
                  <span className="projects__cats-label">
                    {String(categories.length).padStart(2, "0")} CATEGORIES
                  </span>
                  <span className="projects__cats-list">
                    {categories.join(" · ")}
                  </span>
                </p>
              </Reveal>
            </header>

            <div className="work-list">
              {projects.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={Math.min(i * 0.08, 0.4)}
                  className="projects__item"
                >
                  <div
                    className="projects__card"
                    style={{ "--screen-accent": p.accent } as CSSProperties}
                  >
                    <WorkStackCard
                      project={p}
                      index={i}
                      pinned={false}
                      ctaHref="/#contact"
                    />
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="projects-end">
              <Reveal>
                <div className="projects-end__inner">
                  <p className="projects-end__label">WHAT&rsquo;S NEXT</p>
                  <h2 className="projects-end__title">
                    Have something ambitious in mind?
                  </h2>
                  <p className="projects-end__support">
                    Every project here started as a conversation. Tell us where
                    you want to go — we&rsquo;ll handle the rest.
                  </p>
                  <Link
                    className="btn btn--primary"
                    href="/#contact"
                    data-cursor="hover"
                  >
                    <span className="btn__label">Start your project</span>
                    <span className="btn__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}