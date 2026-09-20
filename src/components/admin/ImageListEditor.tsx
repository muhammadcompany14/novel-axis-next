"use client";

import { useState } from "react";
import Image from "next/image";
import ImageUploader from "./ImageUploader";

export default function ImageListEditor({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function addUrl() {
    const value = url.trim();
    if (!value) return;
    onChange([...images, value]);
    setUrl("");
    setError(null);
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const to = index + dir;
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[index], next[to]] = [next[to], next[index]];
    onChange(next);
  }

  return (
    <div className="adm-imgs">
      {images.length > 0 && (
        <div className="adm-imgs__grid">
          {images.map((src, i) => (
            <figure key={`${src}-${i}`} className="adm-imgs__item">
              <Image
                src={src}
                alt=""
                width={160}
                height={120}
                className="adm-imgs__preview"
              />
              <figcaption className="adm-imgs__actions">
                <button
                  type="button"
                  className="adm-btn adm-btn--mini"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Move earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--mini"
                  disabled={i === images.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move later"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn--mini adm-btn--danger"
                  onClick={() => removeAt(i)}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <div className="adm-imgs__add">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Paste an image URL"
        />
        <button type="button" className="adm-btn" onClick={addUrl}>
          Add URL
        </button>
        <ImageUploader onUploaded={(src) => onChange([...images, src])} />
      </div>
      {error && <p className="adm-status--err">{error}</p>}
    </div>
  );
}