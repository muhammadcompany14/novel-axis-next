# AGENTS.md

Agency marketing site + admin CMS for **Novel Axis Solutions**. Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4. Not a monorepo, no git repo (`/home/muhammad/CODE/agency/novel-axis-next` has no `.git`), deployed to Vercel (`npm run dev` + `vercel`).

## Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint` (eslint)
- No test runner, no `typecheck` script. Verify with `npm run lint` + `npx tsc --noEmit` + `npm run build` (`next build` also typechecks).

## Content & persistence (read this first)

- **Two content sources that layer**: seed data in `src/data/*.ts` (site, projects, testimonials, team, technologies, etc.) and a persisted store overlaying it via `src/lib/content.ts` (`getProjects`, `getSite`, `getSettings`).
- **`src/lib/storage.ts` is a dual-path persistence adapter** — the biggest gotcha in this repo:
  - When `KV_REST_API_URL` + `KV_REST_API_TOKEN` are set (Vercel KV), all reads/writes go to Upstash REST at key `nas:content`.
  - Otherwise it reads/writes **`content.json` at the repo root** — the committed single source of truth, seeded from `src/data/*` on first read, written atomically (tmp + rename).
  - Net effect: local dev writes rewrite the committed `content.json`; production with KV writes to KV. "Why isn't my edit showing?" is almost always storage-path mismatch.
- Admin CMS edits persist to the store, never to the seed files. To change default content, edit `src/data/*.ts`, not `content.json`.

## Admin CMS

- Public site: `src/app/(site)/` (home page + `/projects`). CMS: `src/app/admin/` (own layout, imports `admin.css` — plain CSS, no Tailwind), API at `src/app/api/admin/*`.
- Auth: `src/lib/auth.ts` — stateless HMAC-signed `nas_session` cookie (7 days); no server session state. Credentials come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SECRET` (set in `.env.local`, gitignored) with **insecure dev defaults** if unset. All admin pages/API routes gate on `isAuthed()`. Never ship without the env vars.
- Public content pages are `export const dynamic = "force-dynamic"` — the site renders from the persisted store at request time, not build time.

## Config quirks (deliberate — don't "fix")

- `next.config.ts`: `reactStrictMode: false` — GSAP ScrollTrigger pinning breaks under StrictMode double-mounting in dev. Keep it off.
- `images.unoptimized: true` — images load directly from CDN (Unsplash + `cdn.simpleicons.org`). `remotePatterns` still validates image srcs, so a new remote image host must be added there.
- Tailwind v4 via `@tailwindcss/postcss` — **no `tailwind.config.*` file**. Design tokens live in `src/app/globals.css`: `@theme` block (colors, fonts) + `:root` custom properties (spacing, radii, gradients). ~4500 lines of ported component classes also live here (`.container`, `.section`, `.btn--primary`, BEM-ish blocks like `.projects__*`) — component styling is here, not inline utilities.

## Turbopack gotcha — `.codegraph` symlink

If `next dev` / `next build` throws **"An unexpected Turbopack error occurred" / "leaves the filesystem root"**, it is the `.codegraph` symlink at the repo root (created by the codegraph tooling, points to `~/.omo/codegraph/projects/...` — outside the project root). Turbopack's CSS pipeline resolves the symlink to an out-of-root path and panics (`parse_css → PostCssTransformedAsset::process → FileSystemPath("").join("../../../.omo/...") leaves the filesystem root`). Confirmed: build/dev pass only while `.codegraph` is absent; `.gitignore` does NOT prevent the panic. Fix: `rm .codegraph`. It may be re-created when codegraph re-indexes — if the panic returns, remove it again.

## Conventions

- Path alias: `@/*` → `src/*`.
- Most components are client components (`"use client"`, ~32 files) using GSAP ScrollTrigger + Lenis smooth scroll (`src/components/SmoothScroll.tsx` registers the plugin and owns `window.__lenis`), framer-motion, and embla-carousel. Respect `prefers-reduced-motion` / coarse pointer guards there.
- Design language is fixed: warm coffee/amber/cream palette (`--color-bg #0f0c0a`), Inter + JetBrains Mono + Instrument Serif (italic 400 only, via `next/font/google`).
- Per-project accent color: components read `style={{ "--screen-accent": p.accent }}` — `Project.accent` is a hex string, used as CSS var.