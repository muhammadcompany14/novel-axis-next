"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";
import type { TeamMember } from "@/data/team";
import type { Testimonial } from "@/data/testimonials";
import type { AdminSettings } from "@/lib/types";
import ProjectForm from "./ProjectForm";
import SettingsForm from "./SettingsForm";
import ServicesForm from "./ServicesForm";
import TeamMemberForm from "./TeamMemberForm";
import TestimonialForm from "./TestimonialForm";
import CollectionManager from "./collection";

type Tab = "overview" | "projects" | "services" | "team" | "reviews" | "settings";

const TAB_LABELS: Record<Tab, string> = {
  overview: "Overview",
  projects: "Projects",
  services: "Services",
  team: "Team",
  reviews: "Reviews",
  settings: "Settings",
};

/* ---------- Hand-written inline SVG icons (no library, no emoji) ---------- */

interface IconProps {
  size?: number;
}

function IconBase({ size = 17, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function IconOverview({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M12 17l4-5" />
      <circle cx="12" cy="17" r="1.5" />
      <path d="M6 5l1.5 2" />
      <path d="M18 5l-1.5 2" />
    </IconBase>
  );
}

function IconProjectsGrid({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

function IconServicesLayers({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M12 2.5 22 7.5 12 12.5 2 7.5 12 2.5Z" />
      <path d="M2 12.5 12 17.5 22 12.5" />
      <path d="M2 17.5 12 22.5 22 17.5" />
    </IconBase>
  );
}

function IconTeamUsers({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.9-3.4 3.5-5.5 6.5-5.5s5.6 2.1 6.5 5.5" />
      <circle cx="17" cy="9.5" r="2.75" />
      <path d="M15.5 15.7c2.7.3 4.9 1.9 5.7 4.3" />
    </IconBase>
  );
}

function IconReviewsQuote({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H5.5L3 21.5V11.5A7.5 7.5 0 0 1 10.5 4h3A7.5 7.5 0 0 1 21 11.5Z" />
      <path d="M10 9.6c-.7.4-1.1 1-1.1 1.8 0 .7.4 1.1 1 1.1.6 0 1-.4 1-1.1 0-.5-.3-.8-.8-1" />
      <path d="M14.9 9.6c-.7.4-1.1 1-1.1 1.8 0 .7.4 1.1 1 1.1.6 0 1-.4 1-1.1 0-.5-.3-.8-.8-1" />
    </IconBase>
  );
}

function IconSettingsGear({ size = 17 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M4 6h10" />
      <path d="M18 6h2" />
      <circle cx="16" cy="6" r="2" />
      <path d="M4 12h2" />
      <path d="M10 12h10" />
      <circle cx="8" cy="12" r="2" />
      <path d="M4 18h10" />
      <path d="M18 18h2" />
      <circle cx="16" cy="18" r="2" />
    </IconBase>
  );
}

function IconExternal({ size = 14 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M14 4h6v6" />
      <path d="M20 4 10.5 13.5" />
      <path d="M20 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6" />
    </IconBase>
  );
}

function IconLogout({ size = 14 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </IconBase>
  );
}

function IconChevronRight({ size = 14 }: IconProps) {
  return (
    <IconBase size={size}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

/* ---------- Hand-written SVG charts (no library) ---------- */

function ChartProjectsByYear({ projects }: { projects: Project[] }) {
  const { bars, max } = useMemo(() => {
    const tally = new Map<string, number>();
    for (const p of projects) {
      tally.set(p.year, (tally.get(p.year) ?? 0) + 1);
    }
    const years = [...tally.keys()].sort();
    const bars = years.map((year) => ({ year, count: tally.get(year)! }));
    const max = bars.reduce((m, b) => Math.max(m, b.count), 0);
    return { bars, max: Math.max(max, 1) };
  }, [projects]);

  if (bars.length === 0) {
    return <p className="adm-chart-empty">NO PROJECTS YET — ADD YOUR FIRST.</p>;
  }

  const W = 360;
  const H = 180;
  const PAD_L = 8;
  const PAD_R = 8;
  const PAD_T = 18;
  const PAD_B = 28;
  const slot = (W - PAD_L - PAD_R) / bars.length;
  const barW = Math.min(30, slot * 0.55);
  const baseY = H - PAD_B;
  const plotH = baseY - PAD_T;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="adm-chart" role="img" aria-label="Projects by year">
      <defs>
        <linearGradient id="adm-chart-gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c17a" />
          <stop offset="100%" stopColor="#c8956c" />
        </linearGradient>
      </defs>
      <line x1={PAD_L} y1={baseY} x2={W - PAD_R} y2={baseY} className="adm-chart-base" />
      {bars.map((bar, i) => {
        const h = Math.max(3, (bar.count / max) * plotH);
        const x = PAD_L + slot * i + (slot - barW) / 2;
        const y = baseY - h;
        return (
          <g key={bar.year}>
            <title>{`${bar.year}: ${bar.count}`}</title>
            <rect x={x} y={y} width={barW} height={h} rx={4} fill="url(#adm-chart-gold-v)" />
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="adm-chart-count">
              {bar.count}
            </text>
            <text x={x + barW / 2} y={baseY + 18} textAnchor="middle" className="adm-chart-label">
              {bar.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChartTopTech({ projects }: { projects: Project[] }) {
  const { top } = useMemo(() => {
    const tally = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.tech) {
        tally.set(t, (tally.get(t) ?? 0) + 1);
      }
    }
    const top = [...tally.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    return { top };
  }, [projects]);

  if (top.length === 0) {
    return <p className="adm-chart-empty">NO TECHNOLOGIES YET.</p>;
  }

  const max = Math.max(...top.map((t) => t.count), 1);
  const W = 360;
  const rowH = 26;
  const H = top.length * rowH + 10;
  const labelW = 100;
  const countW = 28;
  const trackX = labelW;
  const trackW = W - labelW - countW - 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="adm-chart" role="img" aria-label="Top technologies">
      <defs>
        <linearGradient id="adm-chart-gold-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8c17a" />
          <stop offset="100%" stopColor="#c8956c" />
        </linearGradient>
      </defs>
      {top.map((t, i) => {
        const y = 8 + i * rowH + rowH / 2;
        const w = Math.max(4, (t.count / max) * trackW);
        return (
          <g key={t.name}>
            <title>{`${t.name}: ${t.count}`}</title>
            <text x={0} y={y + 3} className="adm-chart-tech">
              {t.name}
            </text>
            <rect x={trackX} y={y - 7} width={trackW} height={14} rx={7} className="adm-chart-track" />
            <rect x={trackX} y={y - 7} width={w} height={14} rx={7} fill="url(#adm-chart-gold-h)" />
            <text x={W - 4} y={y + 3} textAnchor="end" className="adm-chart-count">
              {t.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface DonutSlice {
  label: string;
  value: number;
  hue: string;
}

interface DonutSegment extends DonutSlice {
  startFrac: number;
  endFrac: number;
}

function DonutMix({ slices }: { slices: DonutSlice[] }) {
  const { total, segments } = useMemo(() => {
    const total = slices.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) return { total: 0, segments: [] as DonutSegment[] };
    let acc = 0;
    const segments: DonutSegment[] = slices
      .filter((s) => s.value > 0)
      .map((s) => {
        const frac = s.value / total;
        const seg = { ...s, startFrac: acc, endFrac: acc + frac };
        acc += frac;
        return seg;
      });
    return { total, segments };
  }, [slices]);

  if (total === 0) {
    return <p className="adm-chart-empty">NO CONTENT YET.</p>;
  }

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <div className="adm-donut">
      <div className="adm-donut-svg">
        <svg viewBox="0 0 120 120" role="img" aria-label="Content mix">
          {segments.map((seg) => {
            const len = (seg.endFrac - seg.startFrac) * C;
            const offset = -seg.startFrac * C;
            return (
              <circle
                key={seg.label}
                cx="60"
                cy="60"
                r={R}
                fill="none"
                style={{ stroke: seg.hue }}
                strokeWidth="20"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={offset}
                transform="rotate(-90 60 60)"
              >
                <title>{`${seg.label}: ${seg.value}`}</title>
              </circle>
            );
          })}
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--adm-border)" strokeWidth="1" />
        </svg>
        <div className="adm-donut-center">
          <strong>{total}</strong>
          <span>entries</span>
        </div>
      </div>
      <ul className="adm-donut-legend">
        {slices.map((s) => (
          <li key={s.label} className="adm-donut-legend-item">
            <span className="adm-donut-legend-dot" style={{ background: s.hue }} />
            <span className="adm-donut-legend-label">{s.label}</span>
            <span className="adm-donut-legend-value">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Dashboard ---------- */

interface AdminDashboardProps {
  projects: Project[];
  services: Service[];
  team: TeamMember[];
  testimonials: Testimonial[];
  settings: AdminSettings;
  storageConfigured: boolean;
}

export default function AdminDashboard({
  projects: initialProjects,
  services: initialServices,
  team: initialTeam,
  testimonials: initialTestimonials,
  settings: initialSettings,
  storageConfigured,
}: AdminDashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refetchProjects() {
    const res = await fetch("/api/admin/projects", { cache: "no-store" });

    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to load projects");
      return;
    }

    const data = (await res.json()) as { items: Project[] };
    setProjects(data.items);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
    router.replace("/admin/login");
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return;
    }

    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
      cache: "no-store",
    });

    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to delete project");
      return;
    }

    await refetchProjects();
  }

  function handleSaved() {
    setCreating(false);
    setEditing(null);
    void refetchProjects();
  }

  function handleCancel() {
    setCreating(false);
    setEditing(null);
    void refetchProjects();
  }

  const navItems: { value: Tab; label: string; count?: number; icon: (props: IconProps) => ReactNode }[] = [
    { value: "overview", label: "Overview", icon: IconOverview },
    { value: "projects", label: "Projects", count: projects.length, icon: IconProjectsGrid },
    { value: "services", label: "Services", count: initialServices.length, icon: IconServicesLayers },
    { value: "team", label: "Team", count: initialTeam.length, icon: IconTeamUsers },
    { value: "reviews", label: "Reviews", count: initialTestimonials.length, icon: IconReviewsQuote },
  ];

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          <span className="adm-brand-eyebrow">Studio CMS</span>
          <span className="adm-brand-name">Novel Axis</span>
          <span className="adm-brand-sub">Admin</span>
        </div>

        <nav className="adm-nav" aria-label="Sections">
          <div className="adm-nav-section">
            <p className="adm-nav-label">Content</p>
            {navItems.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`adm-nav-btn${tab === item.value ? " is-active" : ""}`}
                onClick={() => setTab(item.value)}
              >
                <span className="adm-nav-icon">
                  <item.icon />
                </span>
                <span className="adm-nav-btn-label">{item.label}</span>
                {item.count !== undefined && <span className="adm-nav-count">{item.count}</span>}
              </button>
            ))}
          </div>
          <div className="adm-nav-section">
            <p className="adm-nav-label">System</p>
            <button
              type="button"
              className={`adm-nav-btn${tab === "settings" ? " is-active" : ""}`}
              onClick={() => setTab("settings")}
            >
              <span className="adm-nav-icon">
                <IconSettingsGear />
              </span>
              <span className="adm-nav-btn-label">Settings</span>
            </button>
          </div>
        </nav>

        <div className="adm-profile">
          <span className="adm-profile-avatar" aria-hidden="true">
            NA
          </span>
          <div className="adm-profile-meta">
            <span className="adm-profile-name">Studio Admin</span>
            <span className="adm-profile-role">Content manager</span>
          </div>
          <span className="adm-profile-online" title="Online" />
        </div>

        <div className="adm-sidebar-foot">
          <Link className="adm-btn" href="/">
            <IconExternal size={14} />
            View site
          </Link>
          <button type="button" className="adm-btn adm-btn--danger" onClick={() => void handleLogout()}>
            <IconLogout size={14} />
            Log out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <div className="adm-topbar">
          <div className="adm-topbar-titles">
            <span className="adm-topbar-crumb">WORKSPACE / {TAB_LABELS[tab].toUpperCase()}</span>
            <h1 className="adm-topbar-title">{TAB_LABELS[tab]}</h1>
          </div>
          <div className="adm-topbar-meta">
            <span className="adm-live">
              <span className="adm-live-dot" aria-hidden="true" />
              Live
            </span>
          </div>
        </div>

        <div className="adm-content">
          {error && <p className="adm-status--err">{error}</p>}

          {!storageConfigured && (
            <div style={{ padding: "12px 16px", marginBottom: 16, background: "#3d2e1a", border: "1px solid #c8956c", borderRadius: 8, color: "#e8c17a", fontSize: 13 }}>
              <strong>Storage not configured.</strong> Content edits will not persist in production. Set up{" "}
              <a href="https://vercel.com/dashboard/stores" target="_blank" rel="noopener noreferrer" style={{ color: "#c8956c", textDecoration: "underline" }}>
                Vercel KV
              </a>{" "}
              and{" "}
              <a href="https://vercel.com/dashboard/stores?type=blob" target="_blank" rel="noopener noreferrer" style={{ color: "#c8956c", textDecoration: "underline" }}>
                Blob storage
              </a>{" "}
              in the Vercel dashboard, then reconnect the environment variables.
            </div>
          )}

          {tab === "overview" && (
            <div className="adm-ov">
              <div className="adm-stats">
                <div
                  className="adm-stat-card"
                  style={{ "--card-hue": "var(--adm-hue-amber)", "--card-hue-soft": "var(--adm-hue-amber-soft)" } as CSSProperties}
                >
                  <div className="adm-stat-top">
                    <span className="adm-stat-chip">
                      <IconProjectsGrid size={20} />
                    </span>
                    <span className="adm-stat-value">{projects.length}</span>
                  </div>
                  <span className="adm-stat-label">Projects</span>
                  <span className="adm-stat-foot">LIVE FROM CMS</span>
                </div>
                <div
                  className="adm-stat-card"
                  style={{ "--card-hue": "var(--adm-hue-terra)", "--card-hue-soft": "var(--adm-hue-terra-soft)" } as CSSProperties}
                >
                  <div className="adm-stat-top">
                    <span className="adm-stat-chip">
                      <IconServicesLayers size={20} />
                    </span>
                    <span className="adm-stat-value">{initialServices.length}</span>
                  </div>
                  <span className="adm-stat-label">Services</span>
                  <span className="adm-stat-foot">LIVE FROM CMS</span>
                </div>
                <div
                  className="adm-stat-card"
                  style={{ "--card-hue": "var(--adm-hue-emerald)", "--card-hue-soft": "var(--adm-hue-emerald-soft)" } as CSSProperties}
                >
                  <div className="adm-stat-top">
                    <span className="adm-stat-chip">
                      <IconTeamUsers size={20} />
                    </span>
                    <span className="adm-stat-value">{initialTeam.length}</span>
                  </div>
                  <span className="adm-stat-label">Team</span>
                  <span className="adm-stat-foot">LIVE FROM CMS</span>
                </div>
                <div
                  className="adm-stat-card"
                  style={{ "--card-hue": "var(--adm-hue-indigo)", "--card-hue-soft": "var(--adm-hue-indigo-soft)" } as CSSProperties}
                >
                  <div className="adm-stat-top">
                    <span className="adm-stat-chip">
                      <IconReviewsQuote size={20} />
                    </span>
                    <span className="adm-stat-value">{initialTestimonials.length}</span>
                  </div>
                  <span className="adm-stat-label">Reviews</span>
                  <span className="adm-stat-foot">LIVE FROM CMS</span>
                </div>
              </div>

              <div className="adm-ov-grid-2">
                <section className="adm-chart-card">
                  <span className="adm-chart-title">Projects by year</span>
                  <ChartProjectsByYear projects={projects} />
                </section>
                <section className="adm-chart-card">
                  <span className="adm-chart-title">Top technologies</span>
                  <ChartTopTech projects={projects} />
                </section>
              </div>

              <div className="adm-ov-grid-2">
                <section className="adm-chart-card">
                  <span className="adm-chart-title">Content mix</span>
                  <DonutMix
                    slices={[
                      { label: "Projects", value: projects.length, hue: "var(--adm-hue-amber)" },
                      { label: "Services", value: initialServices.length, hue: "var(--adm-hue-terra)" },
                      { label: "Team", value: initialTeam.length, hue: "var(--adm-hue-emerald)" },
                      { label: "Reviews", value: initialTestimonials.length, hue: "var(--adm-hue-indigo)" },
                    ]}
                  />
                </section>
                <section className="adm-panel adm-ov-actions">
                  <span className="adm-panel-title">Quick actions</span>
                  <div className="adm-ov-actions-list">
                    <button
                      type="button"
                      className="adm-ov-action"
                      onClick={() => {
                        setTab("projects");
                        setCreating(true);
                      }}
                    >
                      <span className="adm-ov-action-icon">
                        <IconProjectsGrid size={16} />
                      </span>
                      <span className="adm-ov-action-label">Add project</span>
                      <span className="adm-ov-action-chev">
                        <IconChevronRight size={14} />
                      </span>
                    </button>
                    <button type="button" className="adm-ov-action" onClick={() => setTab("services")}>
                      <span className="adm-ov-action-icon">
                        <IconServicesLayers size={16} />
                      </span>
                      <span className="adm-ov-action-label">Edit services</span>
                      <span className="adm-ov-action-chev">
                        <IconChevronRight size={14} />
                      </span>
                    </button>
                    <button type="button" className="adm-ov-action" onClick={() => setTab("team")}>
                      <span className="adm-ov-action-icon">
                        <IconTeamUsers size={16} />
                      </span>
                      <span className="adm-ov-action-label">Manage team</span>
                      <span className="adm-ov-action-chev">
                        <IconChevronRight size={14} />
                      </span>
                    </button>
                    <button type="button" className="adm-ov-action" onClick={() => setTab("reviews")}>
                      <span className="adm-ov-action-icon">
                        <IconReviewsQuote size={16} />
                      </span>
                      <span className="adm-ov-action-label">Add review</span>
                      <span className="adm-ov-action-chev">
                        <IconChevronRight size={14} />
                      </span>
                    </button>
                    <button type="button" className="adm-ov-action" onClick={() => setTab("settings")}>
                      <span className="adm-ov-action-icon">
                        <IconSettingsGear size={16} />
                      </span>
                      <span className="adm-ov-action-label">Site settings</span>
                      <span className="adm-ov-action-chev">
                        <IconChevronRight size={14} />
                      </span>
                    </button>
                  </div>
                </section>
              </div>

              <section className="adm-panel adm-ov-recent">
                <div className="adm-ov-recent-head">
                  <span className="adm-panel-title">Recent projects</span>
                  <span className="adm-badge">{projects.length} TOTAL</span>
                </div>
                {projects.length === 0 ? (
                  <p className="adm-empty">NO PROJECTS YET — ADD YOUR FIRST.</p>
                ) : (
                  <ul className="adm-list">
                    {projects.slice(0, 4).map((project) => (
                      <li key={project.id} className="adm-row">
                        {project.image ? (
                          <img className="adm-thumb" src={project.image} alt="" width={44} height={44} />
                        ) : (
                          <span className="adm-thumb adm-thumb--ghost" aria-hidden="true" />
                        )}
                        <span className="adm-dot" style={{ background: project.accent }} />
                        <div className="adm-row-main">
                          <span className="adm-row-title">{project.title}</span>
                          <span className="adm-row-meta">
                            {project.year} · {project.category}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          )}

          {tab === "projects" &&
            (creating || editing ? (
              <ProjectForm
                initial={editing ?? undefined}
                onCancel={handleCancel}
                onSaved={handleSaved}
              />
            ) : (
              <section className="adm-section">
                <div className="adm-section-head">
                  <div className="adm-section-titles">
                    <h2 className="adm-section-title">Projects</h2>
                    <p className="adm-hint">The Selected Work section on the home page.</p>
                  </div>
                  <button
                    type="button"
                    className="adm-btn adm-btn--primary"
                    onClick={() => setCreating(true)}
                  >
                    New project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <p className="adm-empty">NO PROJECTS YET — ADD YOUR FIRST.</p>
                ) : (
                  <ul className="adm-list">
                    {projects.map((project) => (
                      <li key={project.id} className="adm-row">
                        {project.image ? (
                          <img className="adm-thumb" src={project.image} alt="" width={44} height={44} />
                        ) : (
                          <span className="adm-thumb adm-thumb--ghost" aria-hidden="true" />
                        )}
                        <span className="adm-dot" style={{ background: project.accent }} />
                        <div className="adm-row-main">
                          <span className="adm-row-title">{project.title}</span>
                          <span className="adm-row-meta">
                            {project.category} · {project.year} ·{" "}
                            <span className="adm-badge">{project.tech.length} TECH</span>{" "}
                            <span className="adm-badge">
                              {project.image ? "COVER" : "NO COVER"}
                            </span>
                          </span>
                        </div>
                        <div className="adm-row-actions">
                          <button
                            type="button"
                            className="adm-btn"
                            onClick={() => setEditing(project)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="adm-btn adm-btn--danger"
                            onClick={() => void handleDelete(project)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

          {tab === "services" && (
            <CollectionManager<Service>
              apiPath="/api/admin/services"
              title="Services"
              hint="The four panels of the Services section plus any you add."
              initialItems={initialServices}
              newLabel="New service"
              emptyText="NO SERVICES YET — ADD YOUR FIRST."
              nameOf={(service) => service.name}
              renderRow={(service, _index, { onEdit, onDelete }) => (
                <li key={service.id} className="adm-row">
                  <span className="adm-dot" style={{ background: "var(--adm-ink-soft)" }} />
                  <div className="adm-row-main">
                    <span className="adm-row-title">{service.name}</span>
                    <span className="adm-row-meta">
                      {service.index} · {service.icon} ·{" "}
                      <span className="adm-badge">{service.items.length} ITEMS</span>
                    </span>
                  </div>
                  <div className="adm-row-actions">
                    <button type="button" className="adm-btn" onClick={onEdit}>
                      Edit
                    </button>
                    <button type="button" className="adm-btn adm-btn--danger" onClick={onDelete}>
                      Delete
                    </button>
                  </div>
                </li>
              )}
              Form={ServicesForm}
            />
          )}

          {tab === "team" && (
            <CollectionManager<TeamMember>
              apiPath="/api/admin/team"
              title="Team"
              hint="Rendered in the team grid on the home page — stats update automatically."
              initialItems={initialTeam}
              newLabel="New member"
              emptyText="NO TEAM MEMBERS YET — ADD YOUR FIRST."
              nameOf={(member) => member.name}
              renderRow={(member, _index, { onEdit, onDelete }) => (
                <li key={member.id} className="adm-row">
                  {member.photo ? (
                    <img className="adm-thumb adm-thumb--round" src={member.photo} alt="" width={44} height={44} />
                  ) : (
                    <span className="adm-thumb adm-thumb--round adm-thumb--ghost" aria-hidden="true" />
                  )}
                  <span className="adm-dot" style={{ background: member.accent }} />
                  <div className="adm-row-main">
                    <span className="adm-row-title">{member.name}</span>
                    <span className="adm-row-meta">
                      {member.title} · <span className="adm-badge">{member.tech.length} TECH</span>
                    </span>
                  </div>
                  <div className="adm-row-actions">
                    <button type="button" className="adm-btn" onClick={onEdit}>
                      Edit
                    </button>
                    <button type="button" className="adm-btn adm-btn--danger" onClick={onDelete}>
                      Delete
                    </button>
                  </div>
                </li>
              )}
              Form={TeamMemberForm}
            />
          )}

          {tab === "reviews" && (
            <CollectionManager<Testimonial>
              apiPath="/api/admin/testimonials"
              title="Reviews"
              hint="The marquee reviews strip on the home page."
              initialItems={initialTestimonials}
              newLabel="New review"
              emptyText="NO REVIEWS YET — ADD YOUR FIRST."
              nameOf={(testimonial) => testimonial.name}
              renderRow={(testimonial, _index, { onEdit, onDelete }) => (
                <li key={testimonial.id} className="adm-row">
                  <span className="adm-dot" style={{ background: "var(--adm-ink-soft)" }} />
                  <div className="adm-row-main">
                    <span className="adm-row-title">
                      {testimonial.quote.slice(0, 64)}
                      {testimonial.quote.length > 64 ? "…" : ""}
                    </span>
                    <span className="adm-row-meta">
                      {testimonial.name}
                      {testimonial.company ? ` · ${testimonial.company}` : ""}
                    </span>
                  </div>
                  <div className="adm-row-actions">
                    <button type="button" className="adm-btn" onClick={onEdit}>
                      Edit
                    </button>
                    <button type="button" className="adm-btn adm-btn--danger" onClick={onDelete}>
                      Delete
                    </button>
                  </div>
                </li>
              )}
              Form={TestimonialForm}
            />
          )}

          {tab === "settings" && (
            <SettingsForm initial={settings} onSaved={(next) => setSettings(next)} />
          )}
        </div>
      </div>
    </div>
  );
}