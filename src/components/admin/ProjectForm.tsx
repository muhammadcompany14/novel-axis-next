"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import ImageListEditor from "./ImageListEditor";

interface ProjectFormProps {
  initial?: Project;
  onCancel: () => void;
  onSaved: () => void;
}

export default function ProjectForm({ initial, onCancel, onSaved }: ProjectFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [accent, setAccent] = useState(initial?.accent ?? "#c8956c");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tech, setTech] = useState(initial?.tech.join(", ") ?? "");
  const [results, setResults] = useState(initial?.results.join("\n") ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError(true);
      setError("Title is required");
      return;
    }

    setTitleError(false);
    setPending(true);
    setError(null);

    const techList = tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const resultsList = results
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const body = initial
      ? {
          ...initial,
          title: title.trim(),
          category: category.trim(),
          year: year.trim(),
          description: description.trim(),
          tech: techList,
          image: image.trim(),
          accent,
          results: resultsList,
          images,
        }
      : {
          title: title.trim(),
          category: category.trim(),
          year: year.trim(),
          description: description.trim(),
          tech: techList,
          image: image.trim(),
          accent,
          results: resultsList,
          images,
        };

    const res = await fetch(
      initial ? `/api/admin/projects/${initial.id}` : "/api/admin/projects",
      {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to save project");
      setPending(false);
      return;
    }

    setPending(false);
    onSaved();
  }

  return (
    <form className="adm-form adm-panel" onSubmit={handleSubmit}>
      <div className="adm-form-head">
        <h2 className="adm-form-title">{initial ? "Edit project" : "New project"}</h2>
        <button type="button" className="adm-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {error && <p className="adm-status--err">{error}</p>}

      <div className="adm-grid">
        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-title">
            Title
          </label>
          <input
            id="pf-title"
            className={titleError ? "adm-input--err" : undefined}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-category">
            Category
          </label>
          <input
            id="pf-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-year">
            Year
          </label>
          <input id="pf-year" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-accent">
            Accent
          </label>
          <div className="adm-accent">
            <input
              id="pf-accent"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label" htmlFor="pf-description">
          Description
        </label>
        <textarea
          id="pf-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="adm-grid">
        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-tech">
            Tech
          </label>
          <input id="pf-tech" value={tech} onChange={(e) => setTech(e.target.value)} />
          <p className="adm-hint">comma-separated</p>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="pf-results">
            Results
          </label>
          <textarea
            id="pf-results"
            rows={3}
            value={results}
            onChange={(e) => setResults(e.target.value)}
          />
          <p className="adm-hint">one per line</p>
        </div>
      </div>

      <div className="adm-field">
        <label className="adm-label" htmlFor="pf-image">
          Cover image URL
        </label>
        <input id="pf-image" value={image} onChange={(e) => setImage(e.target.value)} />
        <p className="adm-hint">Used as the project cover — falls back to the first gallery image if empty.</p>
      </div>

      <div className="adm-field">
        <span className="adm-label">Gallery images</span>
        <ImageListEditor images={images} onChange={setImages} />
      </div>

      <div className="adm-form-actions">
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}