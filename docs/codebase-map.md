# Codebase Map

This file is the quick ownership map for the app so you know what to edit, what to leave alone, and what exists only for tooling.

## Root folders

- `src/app`
  Runtime routes, page metadata, sitemap files, API routes, and app layouts.
- `src/components`
  UI components used by routes. This is the main place for UX work.
- `src/lib`
  Shared logic grouped by domain. This is the main place for data, SEO helpers, route models, and server utilities.
- `src/data`
  Authored content and generated holiday data.
  `src/data/site/info-pages.jsx` is the shared edit surface for the company, policy, and trust pages.
- `src/generated`
  Generated Prisma client. Do not edit manually.
- `public`
  Static assets, service worker, icons, geo snapshots.
- `prisma`
  Schema and database definitions.
- `infra`
  Deployment and server infrastructure. Keep if you deploy with nginx/docker/postgres.
- `scripts`
  Content/build/validation scripts. Keep.
- `docs`
  Project docs and architecture notes.

## What is safe to ignore most of the time

- `.next`
- `node_modules`
- `src/generated`
- `reports`

## Main runtime domains inside `src/lib`

- `src/lib/seo`
  Shared metadata builders, schema helpers, discovery links, and SEO utilities.
- `src/lib/site`
  Site discovery/search models and other whole-site helpers.
- `src/lib/calculators`
  Calculator datasets and engines that power `/tools/*` (the lib folder name predates the
  `/tools` URL rename and was never renamed — don't read the folder name as meaning `/calculators`
  URLs still exist; they don't, see Cleanup notes below).
  `src/lib/calculators/finance-page-content.js` holds the shared search-facing copy for the
  strongest `/tools/gulf-finance` detail pages.
- `src/lib/seo/calculator-route-manifest.js`
  Canonical `{path, priority, changeFrequency}` list for every `/tools/*` route — feeds both
  `/tools/sitemap.xml` and the tools entries in the root `/sitemap.xml`. Source of truth for "does
  this tool page exist / is it sitemapped," verified 2026-08-23 to be in perfect 169/169 sync with
  the actual `src/app/tools/**/page.jsx` files on disk.
- `src/lib/db`
  Geo/database access, fallback snapshots, and query helpers.
- `src/lib/holidays`
  Holiday page models and metadata helpers, incl. `country-hub-data.js` (the `/holidays/country/*`
  hub dataset — see Cleanup notes).
- `src/lib/guides`
  Guides dataset and guide lookup helpers. `src/app/guides` was deleted 2026-08-23 (it had no
  `page.jsx`, only a vestigial `layout.jsx` — the route already 404d live with no renderer); this
  lib folder has no current route surface, `/guides/*` is fully dead.

## Main route ownership

- `src/app/tools`
  All calculator/guide hub categories (24 categories as of 2026-08-23: gulf-finance, personal-
  finance, sleep, health, education, construction, electrical, plumbing, hvac, islamic, ecommerce,
  car-maintenance, carpenter, cleaning, landscaping, pest-control, pools, elevators, welding,
  scaffolding, garage-doors, aluminum-glass, cctv, attendance) plus individual tool detail pages
  under each. This is the `/calculators` prefix's replacement — see Cleanup notes.
- `src/app/time-now`
  Current time pages by country/city.
- `src/app/time-difference`
  Time difference routes and metadata.
- `src/app/date`
  Date converter/calendar/today pages.
- `src/app/imsakiya`
  Ramadan imsakiya (fasting/iftar schedule) pages by country/city.
- `src/app/holidays`
  Holiday landing, detail (`[slug]`), and country-hub (`country/[country]`) routes.
- `src/app/search`
  Smart internal search experience — the only in-app discovery/site-map surface (see Cleanup notes).

## Cleanup notes

- **`/calculators`, `/blog`, and `/fahras` were all retired** (owner directive, 2026-08-09 for
  `/fahras`/`/blog`; `/calculators` prefix eliminated the same wave — see `CLAUDE.md`). All three
  now hard-404 with no live route in `src/app`. `/fahras` used to be described here as "the
  crawlable site-map/discovery page" — that page no longer exists; `/search` is now the only
  in-app discovery surface (crawlers still get the real XML sitemaps under `/sitemap-index.xml`,
  unaffected by the `/fahras` retirement). A large, individually-maintained set of 301 redirects
  from the old `/calculators/*` URLs to their `/tools/*` equivalents lives in `next.config.js`
  (`LEGACY_BLOG_CANONICAL_REDIRECTS` + `LEGACY_INDEXING_REDIRECTS`, ~140 entries) — verified
  2026-08-23 to all resolve correctly (no dead redirect targets, no duplicate sources). See
  `docs/routes-and-sitemaps-inventory.md` for the full current route/sitemap inventory.
- `src/lib/site/discovery.js` now replaces the older split between `site-directory.js` and `site-search.js`.
- `src/components/seo/JsonLd.tsx` is the shared JSON-LD renderer; avoid creating one-off schema script helpers in feature folders.
- The old root theme-provider file was removed; the app now uses the simpler local theme bootstrap already wired in `layout.tsx` and `ThemeToggle`.

## Recommended editing workflow

1. Change shared domain copy/data helpers in `src/lib/...` first when a group of pages should stay aligned.
2. Change route-level SEO and page intent in `src/app/.../page.*` when a single route is truly unique.
3. Change visual behavior in `src/components/...`.
4. Only touch `infra` and `scripts` when you are working on deployment, data pipelines, or tooling.
