"use client";

import { useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/data/team";
import type { CollectionFormProps } from "./collection";
import ImageUploader from "./ImageUploader";

const ACCENT_BASE = "#b5743f";

export default function TeamMemberForm({
  initial,
  onCancel,
  onCommit,
}: CollectionFormProps<TeamMember>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [specialty, setSpecialty] = useState(initial?.specialty ?? "");
  const [tech, setTech] = useState(initial?.tech.join(", ") ?? "");
  const [accent, setAccent] = useState(initial?.accent ?? ACCENT_BASE);
  const [photo, setPhoto] = useState(initial?.photo ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required");
      return;
    }
    const techList = tech
      .split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
    setPending(true);
    setError(null);
    const err = await onCommit({
      name: trimmedName,
      title: title.trim(),
      specialty: specialty.trim(),
      tech: techList,
      accent,
      photo: photo.trim(),
    });
    if (err) {
      setError(err);
      setPending(false);
    }
  }

  return (
    <section className="adm-section">
      <div className="adm-section-head">
        <div className="adm-section-titles">
          <h2 className="adm-section-title">{initial ? "Edit team member" : "New team member"}</h2>
          <p className="adm-hint">Photo is optional — the initials fallback is used when empty.</p>
        </div>
        <input
          type="submit"
          form="team-form"
          className="adm-btn adm-btn--primary"
          value={pending ? "Saving…" : "Save member"}
          disabled={pending}
        />
      </div>

      <form id="team-form" className="adm-form adm-panel" onSubmit={(e) => void handleSubmit(e)}>
        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label" htmlFor="tm-name">Name *</label>
            <input
              id="tm-name"
              className="adm-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arman Malik"
              required
            />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="tm-title">Title</label>
            <input
              id="tm-title"
              className="adm-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Engineering & Strategy"
            />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="tm-specialty">Specialty</label>
          <input
            id="tm-specialty"
            className="adm-input"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="One line about what they do"
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="tm-tech">
            Technologies <span className="adm-label-hint">comma-separated</span>
          </label>
          <input
            id="tm-tech"
            className="adm-input"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Next.js, TypeScript, Shopify"
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="tm-accent">Accent color</label>
          <div className="adm-accent">
            <input
              id="tm-accent"
              type="color"
              className="adm-accent__swatch"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
            <input
              type="text"
              className="adm-input"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              aria-label="Accent hex value"
            />
          </div>
        </div>

        <div className="adm-field">
          <span className="adm-label">Photo</span>
          <div className="adm-imgs__add">
            <input
              type="text"
              className="adm-input"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="Paste an image URL"
            />
            <ImageUploader onUploaded={setPhoto} />
          </div>
          {photo && (
            <div className="adm-photo">
              <Image
                src={photo}
                alt=""
                width={96}
                height={96}
                className="adm-photo__preview"
              />
              <button
                type="button"
                className="adm-btn adm-btn--mini adm-btn--danger"
                onClick={() => setPhoto("")}
                aria-label="Remove photo"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {error && <p className="adm-status--err">{error}</p>}

        <div className="adm-form-actions">
          <button type="button" className="adm-btn" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}