"use client";

import { useState } from "react";
import type { Service, ServiceIcon, ServiceItem } from "@/data/services";
import { serviceIconOptions } from "@/data/services";
import type { CollectionFormProps } from "./collection";

function EmptyItem(): ServiceItem {
  return { name: "", desc: "" };
}

export default function ServicesForm({ initial, onCancel, onCommit }: CollectionFormProps<Service>) {
  const [name, setName] = useState(initial?.name ?? "");
  const [shortName, setShortName] = useState(initial?.shortName ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [highlight, setHighlight] = useState(initial?.highlight ?? "");
  const [icon, setIcon] = useState<ServiceIcon>(initial?.icon ?? "web");
  const [items, setItems] = useState<ServiceItem[]>(
    initial?.items?.length ? initial.items : [EmptyItem()],
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function updateItem(index: number, patch: Partial<ServiceItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, EmptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Service name is required");
      return;
    }
    const cleanItems = items.filter((item) => item.name.trim().length > 0);
    setPending(true);
    setError(null);
    const err = await onCommit({
      name: trimmedName,
      shortName: shortName.trim() || trimmedName,
      tagline: tagline.trim(),
      description: description.trim(),
      highlight: highlight.trim(),
      icon,
      items: cleanItems,
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
          <h2 className="adm-section-title">{initial ? "Edit service" : "New service"}</h2>
          <p className="adm-hint">The icon style also drives the visual mock in the Services section.</p>
        </div>
        <input
          type="submit"
          form="services-form"
          className="adm-btn adm-btn--primary"
          value={pending ? "Saving…" : "Save service"}
          disabled={pending}
        />
      </div>

      <form
        id="services-form"
        className="adm-form adm-panel"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div className="adm-field">
          <label className="adm-label" htmlFor="svc-name">Name *</label>
          <input
            id="svc-name"
            className="adm-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Shopify Ecosystem"
            required
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="svc-short">Short name</label>
          <input
            id="svc-short"
            className="adm-input"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            placeholder="e.g. Shopify (defaults to name)"
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="svc-tagline">Tagline</label>
          <input
            id="svc-tagline"
            className="adm-input"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Storefronts and systems built to sell."
          />
        </div>

        <div className="adm-field">
          <label className="adm-label" htmlFor="svc-desc">Description</label>
          <textarea
            id="svc-desc"
            className="adm-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="adm-row">
          <div className="adm-field">
            <label className="adm-label" htmlFor="svc-icon">Icon style</label>
            <select
              id="svc-icon"
              className="adm-input"
              value={icon}
              onChange={(e) => setIcon(e.target.value as ServiceIcon)}
            >
              {serviceIconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="svc-highlight">Highlight phrase</label>
            <input
              id="svc-highlight"
              className="adm-input"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="e.g. stores that actually convert"
            />
          </div>
        </div>

        <fieldset className="adm-fieldset">
          <legend className="adm-label">What&apos;s included</legend>
          {items.map((item, index) => (
            <div className="adm-repeat" key={index}>
              <input
                className="adm-input"
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="Item name"
                aria-label={`Item ${index + 1} name`}
              />
              <input
                className="adm-input"
                value={item.desc}
                onChange={(e) => updateItem(index, { desc: e.target.value })}
                placeholder="Item description"
                aria-label={`Item ${index + 1} description`}
              />
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                onClick={() => removeItem(index)}
                aria-label={`Remove item ${index + 1}`}
                disabled={items.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="adm-btn" onClick={addItem}>
            + Add item
          </button>
        </fieldset>

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