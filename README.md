# Novel Axis Next

Agency marketing site + admin CMS for **Novel Axis Solutions** (Novel Axis Next).

- **Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4
- **CMS:** admin at `/admin` (HMAC session auth via `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_SECRET`)
- **Content:** seed data in `src/data/*.ts`, persisted via `src/lib/storage.ts` (Vercel KV, else `content.json`)

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # eslint
npm run start     # serve build
```

## Deployment

Deployed to Vercel (project `muhamamd1/novel-axis-next`). Dual-remote:

- `origin` = GitHub 1 `MuhammadAhmadCode/novel-axis-next` (personal)
- `github2` = GitHub 2 `muhammadcompany14/novel-axis-next` (SSH alias `gh2-company14`, connected to the Vercel project)

Push both: `git push origin main && git push github2 main`.

See `AGENTS.md` for the GitHub/Vercel account routing rules (1:1 connections, author checks).