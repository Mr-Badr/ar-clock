# miqatona.com — Claude Session Bootstrap

## What This App Is

Arabic-first Islamic/MENA time utilities SaaS at **miqatona.com**. Features:
- **Prayer times** (`/mwaqit-al-salat`) — 19+ countries and cities, Adhan-calculated
- **Current time** (`/time-now`) — real-time clock for any country/city
- **Time difference** (`/time-difference`) — city pair comparison
- **Date tools** (`/date`) — Hijri/Gregorian calendar, converter, daily date pages
- **Holidays/events** (`/holidays`) — 76 published Arabic-first event pages, 345 aliases, countdowns + FAQs
- **Calculators** (`/calculators`) — age, VAT, installment, end-of-service, personal finance, sleep, building
- **Blog/guides** (`/blog`) — Arabic editorial articles linked to calculators
- **Discovery** (`/fahras`) — crawlable directory; `/search` — smart internal search

## Tech Stack

Next.js 16 · React 19 · TypeScript 5.9 · Tailwind v4 · shadcn/ui (new-york) · Radix UI · Phosphor icons  
Prisma 7 + PostgreSQL (geo) · Adhan (prayer calc) · Puppeteer + Cheerio (research scraping)  
Docker Compose + Nginx on Hetzner VPS · GitHub Actions CI/CD

## Critical npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server (auto-runs `events:build` first) |
| `npm run build` | Full prod build: events:build + prisma:generate + seo:validate + next build + seo:audit:rendered |
| `npm run ci:check` | Full CI gate: lint + typecheck + test:unit + seo:validate + validate:holidays |
| `npm run events:build` | Compile holiday JSON → `src/data/holidays/generated/` (MUST run after editing any event JSON) |
| `npm run events:sync -- --slug <slug>` | Build + validate + publish one holiday event |
| `npm run events:new -- --slug <s> --name "<n>" --type fixed --category <c>` | Scaffold new event |
| `npm run validate:holidays` | Validate holiday content quality (run after any event edit) |
| `npm run validate:holidays:strict` | Strict mode validation |
| `npm run seo:validate` | Validate SEO architecture (gates the build) |
| `npm run seo:audit:rendered` | Audit rendered HTML for SEO quality (post-build) |
| `npm run ads:readiness` | Google Ads landing page simulation |
| `npm run health:routes` | Route health check (add `--base=https://miqatona.com` for live) |
| `npm run growth:ctr -- --input=/path/to/gsc.csv` | Search Console CTR triage |

## Architecture — Data Flow

**Geo**: PostgreSQL (cities/countries) → static snapshot at `public/geo/` → public routes read snapshot by default; live DB only when `ENABLE_LIVE_GEO_DB=true`

**Holidays**: author JSON in `src/data/holidays/events/<slug>/package.json` → `npm run events:build` compiles to `src/data/holidays/generated/` → runtime reads only through `src/lib/holidays/repository.js`

**Content authoring surface**: `src/data/holidays/events/<slug>/` (3 files: `package.json`, `research.json`, `qa.json`). Never edit `src/data/holidays/generated/` directly.

**SEO content must be server-rendered**: use Server Components for all copy, FAQs, schemas, and metadata. Client Components only for live state, forms, calculators, interactive UI.

## Key Architectural Rules

- Ads are LIVE in production: `ADSENSE_CLIENT_ID=ca-pub-5421885011942418`, `GOOGLE_CERTIFIED_CMP_ENABLED=true`. Manual slot IDs in `src/lib/ads/manual-config.js`.
- Canonical host: `https://miqatona.com` (no www, no localhost in production output)
- No `force-dynamic` or `new Date()` in sitemaps — deterministic only
- Never call `headers()` or IP lookup in hot SSR paths (time-now, prayer, homepage)
- Avoid adding `"use client"` to layouts or page wrappers without concrete reason
- Always `await params` and `await searchParams` before accessing them
- Never remove existing SEO metadata — only extend or improve

## Editing Workflow

1. **Shared copy changes** → edit `src/lib/...` domain helpers
2. **Single route** → edit `src/app/.../page.*`
3. **Visual/UI** → edit `src/components/...`
4. **Holiday event** → edit only `src/data/holidays/events/<slug>/package.json`, then run `events:build`
5. **Deployment/infra** → `infra/` and `scripts/`

## Installed Skills

- **`impeccable`** (pbakaus/impeccable): frontend design, UI redesign, layout, accessibility, RTL. Invoke when doing any visual or component work. Load `DESIGN.md` automatically.

## Session Start Routine

1. Read `CLAUDE.md` (this file)
2. Read `.claude/session-notes.md`
3. Then wait for the task — do not pre-read other files

## Never Read

`.next/` · `node_modules/` · `src/generated/` · `src/data/holidays/generated/` · `package-lock.json` · `tsconfig.tsbuildinfo` · `public/geo/cities/` (large JSON blobs) · `infra/backup-*.tar.gz` · `out/`

## Path-Scoped Rules (load automatically when touching relevant files)

- `.claude/rules/ads-system.md` — AdSense unit IDs, component inventory, ad coverage per section
- `.claude/rules/page-structures.md` — calculator/prayer/holiday/blog page component patterns
- `.claude/rules/content-pipeline.md` — holiday authoring workflow and publish pipeline
- `.claude/rules/seo-metadata.md` — metadata requirements, sitemap rules, validation commands
- `.claude/rules/arabic-rtl.md` — RTL layout, design system, ad placement constraints
- `.claude/rules/database-api.md` — geo snapshot flow, holiday repository, Prisma schema
- `.claude/rules/nextjs-patterns.md` — Server/Client boundary, caching, prerendering

## Docs Quick Reference

- Architecture: `docs/architecture/system-overview.md`
- Codebase map: `docs/codebase-map.md`
- Adding events: `docs/add-new-event.md`
- Content research method: `docs/content-research-scraping-method.md`
- Master roadmap: `docs/growth-roadmap.md`
- Growth plan: `docs/next-level-growth-plan.md`
- Event opportunities: `docs/holiday-event-opportunity-backlog.md`