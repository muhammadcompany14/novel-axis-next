import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";
import type { TeamMember } from "@/data/team";
import type { Testimonial } from "@/data/testimonials";

/**
 * Runtime-editable site settings. Only fields that can be safely rendered
 * without breaking layout are exposed — headline arrays and visual constants
 * stay in the seed data.
 */
export interface AdminSettings {
  email: string;
  contact: {
    infoText: string;
    socials: string[];
  };
  footer: {
    tagline: string;
    socials: string[];
    copyright: string;
  };
  hero: {
    label: string;
    copy: string;
  };
  cta: {
    label: string;
    copy: string;
  };
}

export interface PersistedStore {
  projects?: Project[];
  settings?: AdminSettings;
  services?: Service[];
  team?: TeamMember[];
  testimonials?: Testimonial[];
}