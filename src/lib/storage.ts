import { promises as fs } from "node:fs";
import path from "node:path";
import type { PersistedStore } from "./types";

/**
 * Persistence adapter.
 *
 * Primary: a committed `content.json` at the project root — the single source
 * of truth. It is created from the seed data on first read and ships with
 * every deployment, so the live site always reflects the committed content.
 *
 * Fallback: when `KV_REST_API_URL` + `KV_REST_API_TOKEN` are present (a Vercel
 * KV store), reads/writes go through Upstash's REST API instead, which makes
 * admin edits persist live on the deployed server.
 */

const CONTENT_PATH = path.join(process.cwd(), "content.json");

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const KV_KEY = "nas:content";
const useKv = Boolean(KV_URL && KV_TOKEN);

export async function readStore(): Promise<PersistedStore | null> {
  try {
    if (useKv && KV_URL && KV_TOKEN) {
      const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const body = (await res.json()) as { result?: unknown };
      const raw = body?.result;
      if (typeof raw !== "string" || !raw) return null;
      return JSON.parse(raw) as PersistedStore;
    }
    const raw = await fs.readFile(CONTENT_PATH, "utf8");
    return JSON.parse(raw) as PersistedStore;
  } catch {
    return null;
  }
}

export type WriteResult = { ok: true } | { ok: false; error: string };

export async function writeStore(patch: Partial<PersistedStore>): Promise<WriteResult> {
  const existing = await readStore();
  const next: PersistedStore = { ...existing, ...patch };
  try {
    if (useKv && KV_URL && KV_TOKEN) {
      const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        body: JSON.stringify(next),
      });
      if (!res.ok) return { ok: false, error: `KV write failed (${res.status})` };
      return { ok: true };
    }
    const tmp = `${CONTENT_PATH}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, CONTENT_PATH);
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}