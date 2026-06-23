---
paths:
  - src/lib/db/**
  - src/app/api/**
  - prisma/**
  - src/lib/holidays/repository.js
  - scripts/generate-geo-snapshot.ts
---

# Database and API Rules

## Geo data (cities/countries)
- Public routes read from static JSON snapshot in `public/geo/` by default
- Live PostgreSQL geo DB only when `ENABLE_LIVE_GEO_DB=true` (not set in production unless needed)
- `src/lib/db/queries/cities.ts` and `countries.ts` are local-first for public reads
- Fallback JSON: `src/lib/db/fallback/cities-index.json` and `countries.json`
- Snapshot rebuild: `npm run geo:snapshot`

## Holiday data
- Runtime reads only through `src/lib/holidays/repository.js` — this is the swap point for future storage migrations
- Never add direct imports from `src/data/holidays/events/` in page components
- `src/lib/events/index.js` and `src/lib/event-content/index.js` are runtime compatibility layers

## Prisma
- Schema in `prisma/schema.prisma` — models: `Country` (countryCode, countrySlug, nameAr, nameEn, timezone) + `City` (with lat/lon, timezone, population, priority, isCapital)
- Generated client in `src/generated/prisma/` — never edit manually
- After schema changes: `npm run prisma:migrate:dev` (dev) or `npm run prisma:migrate:deploy` (prod)

## API routes
- `/api/cities-by-country` — serves snapshot data first
- `/api/search-city` — serves snapshot search first
- `/api/ip-city` — IP geo lookup (disabled by default: `ENABLE_IP_GEO_LOOKUP=false`)
- `/api/pdf-calendar` — gated behind env flag (off by default)
- `/api/revalidate` — protected by `REVALIDATE_SECRET`

## Data safety rules
- Every value from API/JSON/DB/URL params is untrusted until validated
- Never assume a JSON key exists — guard before accessing, fallback before rendering
- Never return a blank page on data failure — always provide a meaningful fallback state
- Errors in one section must be isolated — use error boundaries at section level, not page level

## Supabase
- Supabase is fully removed. Do NOT add Supabase imports or keys.
- `SUPABASE_SERVICE_ROLE_KEY` should not be in any runtime env.