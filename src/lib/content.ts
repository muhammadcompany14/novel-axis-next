import { projects as seedProjects, type Project } from "@/data/projects";
import { services as seedServices, type Service } from "@/data/services";
import { team as seedTeam, type TeamMember } from "@/data/team";
import { testimonials as seedTestimonials, type Testimonial } from "@/data/testimonials";
import { site as seedSite } from "@/data/site";
import { readStore, writeStore, type WriteResult } from "./storage";
import type { AdminSettings, PersistedStore } from "./types";

/** The full site object — same shape as the seed, but with runtime overrides. */
export type SiteData = typeof seedSite;

function defaultSettings(): AdminSettings {
  return {
    email: seedSite.email,
    phone: seedSite.phone,
    contact: {
      infoText: seedSite.contact.infoText,
      socials: [...seedSite.contact.socials],
    },
    footer: {
      tagline: seedSite.footer.tagline,
      socials: [...seedSite.footer.socials],
      copyright: `© ${new Date().getFullYear()} Novel Axis Solutions. All rights reserved.`,
    },
    hero: { label: seedSite.hero.label, copy: seedSite.hero.copy },
    intro: {
      label: seedSite.intro.label,
      lines: [...seedSite.intro.lines],
      support: [...seedSite.intro.support],
      ctaText: seedSite.intro.ctaText,
      capability: [...seedSite.intro.capability],
      cardLabel: seedSite.intro.cardLabel,
      cardLines: [...seedSite.intro.cardLines],
      badgeMain: seedSite.intro.badgeMain,
      badgeSide: seedSite.intro.badgeSide,
      imageMain: seedSite.intro.imageMain,
      imageMainAlt: seedSite.intro.imageMainAlt,
      imageSide: seedSite.intro.imageSide,
      imageSideAlt: seedSite.intro.imageSideAlt,
    },
    cta: { label: seedSite.cta.label, copy: seedSite.cta.copy },
  };
}

/** First read seeds `content.json` from the data files so admin sees current content. */
async function getEnsuredStore(): Promise<PersistedStore> {
  const existing = await readStore();
  if (existing) return existing;
  const seeded: PersistedStore = {
    projects: [...seedProjects],
    settings: defaultSettings(),
    services: [...seedServices],
    team: [...seedTeam],
    testimonials: [...seedTestimonials],
  };
  await writeStore(seeded);
  return seeded;
}

export async function getProjects(): Promise<Project[]> {
  const store = await getEnsuredStore();
  return Array.isArray(store.projects) && store.projects.length > 0
    ? store.projects
    : [...seedProjects];
}

export async function getServices(): Promise<Service[]> {
  const store = await readStore();
  return store?.services && store.services.length > 0 ? store.services : [...seedServices];
}

export async function getTeam(): Promise<TeamMember[]> {
  const store = await readStore();
  return store?.team && store.team.length > 0 ? store.team : [...seedTeam];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const store = await readStore();
  return store?.testimonials && store.testimonials.length > 0
    ? store.testimonials
    : [...seedTestimonials];
}

export async function getSettings(): Promise<AdminSettings> {
  const store = await readStore();
  if (!store?.settings) return defaultSettings();
  const defaults = defaultSettings();
  return {
    ...defaults,
    ...store.settings,
    intro: { ...defaults.intro, ...(store.settings.intro ?? {}) },
  };
}

export async function getSite(): Promise<SiteData> {
  const store = await getEnsuredStore();
  const s = store.settings;
  if (!s) return seedSite;
  return {
    ...seedSite,
    email: s.email || seedSite.email,
    phone: s.phone || seedSite.phone,
    hero: {
      ...seedSite.hero,
      label: s.hero.label || seedSite.hero.label,
      copy: s.hero.copy || seedSite.hero.copy,
    },
    contact: {
      ...seedSite.contact,
      infoText: s.contact.infoText || seedSite.contact.infoText,
      socials: s.contact.socials.length ? s.contact.socials : seedSite.contact.socials,
    },
    footer: {
      ...seedSite.footer,
      tagline: s.footer.tagline || seedSite.footer.tagline,
      socials: s.footer.socials.length ? s.footer.socials : seedSite.footer.socials,
      copyright: s.footer.copyright || seedSite.footer.copyright,
    },
    intro: {
      ...seedSite.intro,
      ...(s.intro ?? {}),
    },
    cta: {
      ...seedSite.cta,
      label: s.cta.label || seedSite.cta.label,
      copy: s.cta.copy || seedSite.cta.copy,
    },
  } as unknown as SiteData;
}

export async function saveProjects(projects: Project[]): Promise<WriteResult> {
  return writeStore({ projects });
}

export async function saveServices(services: Service[]): Promise<WriteResult> {
  return writeStore({ services });
}

export async function saveTeam(team: TeamMember[]): Promise<WriteResult> {
  return writeStore({ team });
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<WriteResult> {
  return writeStore({ testimonials });
}

export async function saveSettings(patch: Partial<AdminSettings>): Promise<WriteResult> {
  const current = await getSettings();
  const merged: AdminSettings = {
    ...current,
    ...patch,
    contact: { ...current.contact, ...(patch.contact ?? {}) },
    footer: { ...current.footer, ...(patch.footer ?? {}) },
    hero: { ...current.hero, ...(patch.hero ?? {}) },
    intro: { ...current.intro, ...(patch.intro ?? {}) },
    cta: { ...current.cta, ...(patch.cta ?? {}) },
  };
  return writeStore({ settings: merged });
}