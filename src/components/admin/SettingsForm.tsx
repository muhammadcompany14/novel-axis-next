"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminSettings } from "@/lib/types";
import ImageUploader from "./ImageUploader";

interface SettingsFormProps {
  initial: AdminSettings;
  onSaved: (next: AdminSettings) => void;
}

type Status = { kind: "ok" | "err"; text: string } | null;

export default function SettingsForm({ initial, onSaved }: SettingsFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<AdminSettings>(initial);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  function update<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function updateContact(patch: Partial<AdminSettings["contact"]>) {
    setDraft((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  }

  function updateFooter(patch: Partial<AdminSettings["footer"]>) {
    setDraft((d) => ({ ...d, footer: { ...d.footer, ...patch } }));
  }

  function updateHero(patch: Partial<AdminSettings["hero"]>) {
    setDraft((d) => ({ ...d, hero: { ...d.hero, ...patch } }));
  }

  function updateCta(patch: Partial<AdminSettings["cta"]>) {
    setDraft((d) => ({ ...d, cta: { ...d.cta, ...patch } }));
  }

  function updateIntro(patch: Partial<AdminSettings["intro"]>) {
    setDraft((d) => ({ ...d, intro: { ...d.intro, ...patch } }));
  }

  function parseSocials(value: string): string[] {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseLines(value: string): string[] {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);
    setStatus(null);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
      cache: "no-store",
    });

    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: "err", text: data?.error ?? "Failed to save settings" });
      setPending(false);
      return;
    }

    const data = (await res.json()) as { settings: AdminSettings };
    onSaved(data.settings);
    setStatus({ kind: "ok", text: "Saved" });
    setPending(false);
    window.setTimeout(() => setStatus(null), 2500);
  }

  return (
    <form className="adm-form" onSubmit={handleSubmit}>
      {status && (
        <p className={status.kind === "ok" ? "adm-status--ok" : "adm-status--err"}>
          {status.text}
        </p>
      )}

      <section className="adm-panel">
        <h2 className="adm-panel-title">CONTACT</h2>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-email">
            Email
          </label>
          <input
            id="sf-email"
            type="email"
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-phone">
            Phone
          </label>
          <input
            id="sf-phone"
            type="tel"
            value={draft.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-info">
            Info text
          </label>
          <input
            id="sf-info"
            value={draft.contact.infoText}
            onChange={(e) => updateContact({ infoText: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-contact-socials">
            Socials — comma-separated
          </label>
          <input
            id="sf-contact-socials"
            value={draft.contact.socials.join(", ")}
            onChange={(e) => updateContact({ socials: parseSocials(e.target.value) })}
          />
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">FOOTER</h2>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-tagline">
            Tagline
          </label>
          <input
            id="sf-tagline"
            value={draft.footer.tagline}
            onChange={(e) => updateFooter({ tagline: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-copyright">
            Copyright
          </label>
          <input
            id="sf-copyright"
            value={draft.footer.copyright}
            onChange={(e) => updateFooter({ copyright: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-footer-socials">
            Socials — comma-separated
          </label>
          <input
            id="sf-footer-socials"
            value={draft.footer.socials.join(", ")}
            onChange={(e) => updateFooter({ socials: parseSocials(e.target.value) })}
          />
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">HERO</h2>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-hero-label">
            Label
          </label>
          <input
            id="sf-hero-label"
            value={draft.hero.label}
            onChange={(e) => updateHero({ label: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-hero-copy">
            Copy
          </label>
          <textarea
            id="sf-hero-copy"
            rows={3}
            value={draft.hero.copy}
            onChange={(e) => updateHero({ copy: e.target.value })}
          />
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">WHO WE ARE</h2>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-label">
            Label
          </label>
          <input
            id="sf-intro-label"
            value={draft.intro.label}
            onChange={(e) => updateIntro({ label: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-lines">
            Statement lines
          </label>
          <textarea
            id="sf-intro-lines"
            rows={3}
            value={draft.intro.lines.join("\n")}
            onChange={(e) => updateIntro({ lines: parseLines(e.target.value) })}
          />
          <p className="adm-hint">one per line — the last line renders in the accent style</p>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-support">
            Support paragraphs
          </label>
          <textarea
            id="sf-intro-support"
            rows={5}
            value={draft.intro.support.join("\n")}
            onChange={(e) => updateIntro({ support: parseLines(e.target.value) })}
          />
          <p className="adm-hint">one paragraph per line</p>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-cta-text">
            CTA text
          </label>
          <input
            id="sf-intro-cta-text"
            value={draft.intro.ctaText}
            onChange={(e) => updateIntro({ ctaText: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-capability">
            Capability chips — comma-separated
          </label>
          <input
            id="sf-intro-capability"
            value={draft.intro.capability.join(", ")}
            onChange={(e) => updateIntro({ capability: parseSocials(e.target.value) })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-card-label">
            Card label
          </label>
          <input
            id="sf-intro-card-label"
            value={draft.intro.cardLabel}
            onChange={(e) => updateIntro({ cardLabel: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-card-lines">
            Card lines
          </label>
          <textarea
            id="sf-intro-card-lines"
            rows={3}
            value={draft.intro.cardLines.join("\n")}
            onChange={(e) => updateIntro({ cardLines: parseLines(e.target.value) })}
          />
          <p className="adm-hint">one per line — the last line renders with the gradient accent</p>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-badge-main">
            Main image badge
          </label>
          <input
            id="sf-intro-badge-main"
            value={draft.intro.badgeMain}
            onChange={(e) => updateIntro({ badgeMain: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-badge-side">
            Side image badge
          </label>
          <input
            id="sf-intro-badge-side"
            value={draft.intro.badgeSide}
            onChange={(e) => updateIntro({ badgeSide: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-image-main">
            Main image URL
          </label>
          <div className="adm-imgs__add">
            <input
              id="sf-intro-image-main"
              value={draft.intro.imageMain}
              onChange={(e) => updateIntro({ imageMain: e.target.value })}
              placeholder="Paste an image URL"
            />
            <ImageUploader
              onUploaded={(url) => updateIntro({ imageMain: url })}
              label="Upload main"
            />
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-image-main-alt">
            Main image alt
          </label>
          <input
            id="sf-intro-image-main-alt"
            value={draft.intro.imageMainAlt}
            onChange={(e) => updateIntro({ imageMainAlt: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-image-side">
            Side image URL
          </label>
          <div className="adm-imgs__add">
            <input
              id="sf-intro-image-side"
              value={draft.intro.imageSide}
              onChange={(e) => updateIntro({ imageSide: e.target.value })}
              placeholder="Paste an image URL"
            />
            <ImageUploader
              onUploaded={(url) => updateIntro({ imageSide: url })}
              label="Upload side"
            />
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-intro-image-side-alt">
            Side image alt
          </label>
          <input
            id="sf-intro-image-side-alt"
            value={draft.intro.imageSideAlt}
            onChange={(e) => updateIntro({ imageSideAlt: e.target.value })}
          />
        </div>
      </section>

      <section className="adm-panel">
        <h2 className="adm-panel-title">CTA</h2>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-cta-label">
            Label
          </label>
          <input
            id="sf-cta-label"
            value={draft.cta.label}
            onChange={(e) => updateCta({ label: e.target.value })}
          />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="sf-cta-copy">
            Copy
          </label>
          <textarea
            id="sf-cta-copy"
            rows={3}
            value={draft.cta.copy}
            onChange={(e) => updateCta({ copy: e.target.value })}
          />
        </div>
      </section>

      <div className="adm-form-actions">
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}