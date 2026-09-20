"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      if (res.ok) {
        router.push("/admin");
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Sign in failed");
    } catch {
      setError("Sign in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={handleSubmit}>
        <div className="adm-login-strip">
          <span className="adm-login-strip-eyebrow">Studio CMS</span>
          <span className="adm-login-strip-name">Novel Axis</span>
        </div>

        <div className="adm-login-body">
          <p className="adm-login-hint">
            Email and password are set in your environment variables.
          </p>

          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-email">
              Email
            </label>
            <input
              id="adm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="adm-password">
              Password
            </label>
            <input
              id="adm-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="adm-status--err">{error}</p>}

          <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>

      <Link href="/" className="adm-login-back">
        ← Back to site
      </Link>
    </div>
  );
}