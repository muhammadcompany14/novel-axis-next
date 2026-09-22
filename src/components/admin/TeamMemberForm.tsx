"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { TeamMember } from "@/data/team";
import type { CollectionFormProps } from "./collection";
import ImageUploader from "./ImageUploader";

const ACCENT_BASE = "#b5743f";
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

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
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image must be 4 MB or smaller");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUrl }),
        cache: "no-store",
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Upload failed");
        return;
      }

      const body = (await res.json()) as { url: string };
      setPhoto(body.url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

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
          <div
            ref={dropRef}
            className={`adm-photo-drop ${dragging ? "adm-photo-drop--active" : ""} ${uploading ? "adm-photo-drop--uploading" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <span className="adm-photo-drop__text">Uploading…</span>
            ) : dragging ? (
              <span className="adm-photo-drop__text">Drop image here</span>
            ) : photo ? (
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
            ) : (
              <span className="adm-photo-drop__text">Drag & drop image or</span>
            )}
          </div>
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