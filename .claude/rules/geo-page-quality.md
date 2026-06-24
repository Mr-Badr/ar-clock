---
paths:
  - src/app/time-now/**
  - src/app/mwaqit-al-salat/**
  - src/app/imsakiya/**
  - public/geo/**
  - scripts/audit-geo-snapshots.ts
---

# Geo Page Quality Rules — Empty Page Prevention

## The Problem
City pages (time-now, prayer, imsakiya) can appear blank (just navbar + footer) if:
- City record has invalid/null timezone → `Intl.DateTimeFormat` throws during calculation
- City record has wrong lat/lon (e.g. pointing to a different city with the same name)
- City record has `lat: 0, lon: 0` (DB default for missing data)

Google indexes these pages, users click through, and see empty content. This destroys CTR and trust.

## The Three-Layer Fix

### Layer 1 — CI gate: `npm run validate:geo`
Runs `scripts/audit-geo-snapshots.ts` — validates ALL city JSON files in `public/geo/cities/`.
**Added to `ci:check`** — the build fails if any city has:
- Invalid or missing timezone (checked with `new Intl.DateTimeFormat(...)`)
- `lat` outside -90..90 or `lon` outside -180..180
- `lat === 0 && lon === 0` (equator/prime meridian default)
- Missing city_slug or city name

### Layer 2 — Runtime guard: `isRenderableCityData(city)`
Exported from `@/lib/route-param-validation`. Call it in every city page after resolving the city from the DB/snapshot. If it returns false, call `notFound()`.

```js
import { isRouteSlug, isRenderableCityData } from '@/lib/route-param-validation';

// After: if (!city) notFound();
if (!isRenderableCityData(city)) notFound();
```

**Active in:**
- `src/app/time-now/[country]/[city]/page.jsx`
- `src/app/mwaqit-al-salat/[country]/[city]/page.jsx`
- `src/app/imsakiya/[country]/[city]/page.jsx`

Add to ANY new city page you create.

### Layer 3 — Fix the snapshot directly
When a city has bad data, fix `public/geo/cities/<country>.json` directly. The snapshot is the source of truth when `ENABLE_LIVE_GEO_DB` is not set. Also fix the DB record if possible.

## Known Fixed Issues
| Page | City | Was | Fixed to |
|---|---|---|---|
| /time-now/united-states/philadelphia | Philadelphia | lat 32.77, lon -89.11, tz America/Chicago (Philadelphia, MS) | lat 39.95, lon -75.16, tz America/New_York (Philadelphia, PA) |

## When You Add a New City Page Type
1. Add `isRenderableCityData(city)` guard right after `if (!city) notFound()`
2. Import from `@/lib/route-param-validation` — never copy the function locally
3. Verify `npm run validate:geo` passes before pushing

## When the Geo Snapshot Needs Updating
1. Edit `public/geo/cities/<country>.json` directly with the correct data
2. Run `npm run validate:geo` to confirm it passes
3. Run `npm run ci:check` before pushing

## Cities vs Countries
Country pages (e.g. `/time-now/[country]`) don't need `isRenderableCityData` since they use capital city data which is more reliable. Apply the guard to leaf city routes only.
