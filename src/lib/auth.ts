import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "nas_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function credentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@novelaxis.com",
    password: process.env.ADMIN_PASSWORD || "novelaxis-admin",
    secret: process.env.ADMIN_SECRET || "dev-secret-change-me",
  };
}

function hmac(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Signed session token: `<expiryUnix>.<hmac(payload)>` — no server state. */
export function createSessionToken(): string {
  const { secret } = credentials();
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = String(exp);
  return `${payload}.${hmac(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const { secret } = credentials();
  const [expRaw, sig] = token.split(".");
  if (!expRaw || !sig) return false;
  const expected = hmac(expRaw, secret);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(expRaw);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

export function verifyCredentials(email: string, password: string): boolean {
  const { email: expectedEmail, password: expectedPassword } = credentials();
  const emailA = Buffer.from(email.trim().toLowerCase());
  const emailB = Buffer.from(expectedEmail.trim().toLowerCase());
  if (emailA.length !== emailB.length || !timingSafeEqual(emailA, emailB)) return false;
  const pwA = Buffer.from(password);
  const pwB = Buffer.from(expectedPassword);
  return pwA.length === pwB.length && timingSafeEqual(pwA, pwB);
}

/** True when the incoming request carries a valid admin session. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}