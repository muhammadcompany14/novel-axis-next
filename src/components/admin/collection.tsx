"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface CollectionFormProps<T> {
  initial?: T;
  onCancel: () => void;
  onCommit: (payload: unknown) => Promise<string | null>;
}

interface CollectionManagerProps<T extends { id: string }> {
  apiPath: string;
  title: string;
  hint: string;
  initialItems: T[];
  newLabel: string;
  emptyText: string;
  nameOf: (item: T) => string;
  renderRow: (
    item: T,
    index: number,
    actions: { onEdit: () => void; onDelete: () => void },
  ) => ReactNode;
  Form: ComponentType<CollectionFormProps<T>>;
}

export default function CollectionManager<T extends { id: string }>({
  apiPath,
  title,
  hint,
  initialItems,
  newLabel,
  emptyText,
  nameOf,
  renderRow,
  Form,
}: CollectionManagerProps<T>) {
  const router = useRouter();
  const [items, setItems] = useState<T[]>(initialItems);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function request(path: string, init?: RequestInit): Promise<Response | null> {
    const res = await fetch(path, {
      cache: "no-store",
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (res.status === 401) {
      router.replace("/admin/login");
      return null;
    }
    return res;
  }

  async function readError(res: Response): Promise<string> {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? "Request failed";
  }

  async function commit(payload: unknown): Promise<string | null> {
    const isEdit = editing !== null;
    const res = await request(isEdit ? `${apiPath}/${editing!.id}` : apiPath, {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    if (!res) return "Session expired";
    if (!res.ok) return readError(res);
    const data = (await res.json()) as { item: T };
    setItems((prev) =>
      isEdit ? prev.map((item) => (item.id === data.item.id ? data.item : item)) : [...prev, data.item],
    );
    setCreating(false);
    setEditing(null);
    return null;
  }

  async function handleDelete(item: T) {
    if (!window.confirm(`Delete "${nameOf(item)}"? This cannot be undone.`)) return;
    const res = await request(`${apiPath}/${item.id}`, { method: "DELETE" });
    if (!res) return;
    if (!res.ok) {
      setError(await readError(res));
      return;
    }
    setItems((prev) => prev.filter((entry) => entry.id !== item.id));
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  return (
    <div>
      {creating || editing ? (
        <Form initial={editing ?? undefined} onCancel={closeForm} onCommit={commit} />
      ) : (
        <section className="adm-section">
          <div className="adm-section-head">
            <div className="adm-section-titles">
              <h2 className="adm-section-title">{title}</h2>
              {hint && <p className="adm-hint">{hint}</p>}
            </div>
            <button
              type="button"
              className="adm-btn adm-btn--primary"
              onClick={() => setCreating(true)}
            >
              {newLabel}
            </button>
          </div>

          {error && <p className="adm-status--err">{error}</p>}

          {items.length === 0 ? (
            <p className="adm-empty">{emptyText}</p>
          ) : (
            <ul className="adm-list">
              {items.map((item, index) =>
                renderRow(item, index, {
                  onEdit: () => setEditing(item),
                  onDelete: () => void handleDelete(item),
                }),
              )}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}