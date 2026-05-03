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
- `src/lib/economy`
  Economy page models, live snapshot wiring, and economy-specific copy/data helpers.
  `src/lib/economy/seo-content.js` is now the main shared edit surface for principal economy route titles, descriptions, keywords, and schema copy.
- `src/lib/calculators`
  Calculator datasets and engines.
  `src/lib/calculators/finance-page-content.js` holds the shared search-facing copy for the strongest finance calculator detail pages.
- `src/lib/db`
  Geo/database access, fallback snapshots, and query helpers.
- `src/lib/holidays`
  Holiday page models and metadata helpers.
- `src/lib/guides`
  Guides dataset and guide lookup helpers.

## Main route ownership

- `src/app/economie`
  Economy landing pages and route-level metadata.
- `src/app/calculators`
  Calculator hubs and calculator route metadata.
- `src/app/time-now`
  Current time pages by country/city.
- `src/app/time-difference`
  Time difference routes and metadata.
- `src/app/mwaqit-al-salat`
  Prayer pages.
- `src/app/date`
  Date converter/calendar/today pages.
- `src/app/holidays`
  Holiday landing and detail routes.
- `src/app/fahras`
  Main discovery and site-map page.
- `src/app/search`
  Smart internal search experience.

## Cleanup notes

- `/fahras` is the crawlable site-map/discovery page, while `/search` is the smart internal search route.
- `src/lib/site/discovery.js` now replaces the older split between `site-directory.js` and `site-search.js`.
- `src/components/seo/JsonLd.tsx` is the shared JSON-LD renderer; avoid creating one-off schema script helpers in feature folders.
- The old root theme-provider file was removed; the app now uses the simpler local theme bootstrap already wired in `layout.tsx` and `ThemeToggle`.
- Economy pages now use cached server snapshots plus streamed client widgets instead of each route rebuilding its own live state path.

## Recommended editing workflow

1. Change shared domain copy/data helpers in `src/lib/...` first when a group of pages should stay aligned.
2. Change route-level SEO and page intent in `src/app/.../page.*` when a single route is truly unique.
3. Change visual behavior in `src/components/...`.
4. Only touch `infra` and `scripts` when you are working on deployment, data pipelines, or tooling.
