"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export default function ImageUploader({
  onUploaded,
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(data: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
        cache: "no-store",
      });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Upload failed");
        return;
      }
      const body = (await res.json()) as { url: string };
      onUploaded(body.url);
    } catch {
      setError("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are supported");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Image must be 4 MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => void upload(String(reader.result));
    reader.onerror = () => setError("Could not read the file");
    reader.readAsDataURL(file);
  }

  return (
    <div className="adm-uploader">
      <button
        type="button"
        className="adm-btn"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? "Uploading…" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="adm-uploader__input"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <span className="adm-uploader__err">{error}</span>}
    </div>
  );
}