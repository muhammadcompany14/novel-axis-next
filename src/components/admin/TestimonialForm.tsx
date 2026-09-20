"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";
import type { CollectionFormProps } from "./collection";

export default function TestimonialForm({
  initial,
  onCancel,
  onCommit,
}: CollectionFormProps<Testimonial>) {
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Reviewer name is required");
      return;
    }
    if (!quote.trim()) {
      setError("Review quote is required");
      return;
    }
    setPending(true);
    setError(null);
    const err = await onCommit({
      quote: quote.trim(),
      name: name.trim(),
      role: role.trim(),
      company: company.trim(),
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
          <h2 className="adm-section-title">{initial ? "Edit review" : "New review"}</h2>
          <p className="adm-hint">Shown in the marquee reviews strip on the home page.</p>
        </div>
        <input
          type="submit"
          form="testimonial-form"
          className="adm-btn adm-btn--primary"
          value={pending ? "Saving…" : "Save review"}
          disabled={pending}
        />
      </div>

      <form
        id="testimonial-form"
        className="adm-form adm-panel"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div className="adm-field">
          <label className="adm-label" htmlFor="ts-quote">Quote *</label>
          <textarea
            id="ts-quote"
            className="adm-input"
            rows={4}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Their words, in their voice."
            required
          />
        </div>

        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label" htmlFor="ts-name">Name *</label>
            <input
              id="ts-name"
              className="adm-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sofia Lindberg"
              required
            />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="ts-role">Role</label>
            <input
              id="ts-role"
              className="adm-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Founder"
            />
          </div>
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="ts-company">Company</label>
          <input
            id="ts-company"
            className="adm-input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Northwind Studio"
          />
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