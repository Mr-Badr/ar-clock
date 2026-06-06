# Ready to code?

# Miqatona Production Stabilization Plan

## Context

Miqatona (`miqatona.com`) is an Arabic Next.js 16 app that just migrated off Vercel/Supabase to a Hetzner VPS with PostgreSQL+Prisma 7 and a blue/green Docker deployment behind nginx. The app is monetized via Google AdSense, so any 5xx, blank page, or schema regression hurts revenue.

Three symptom classes need fixing:

1. **Browser regression** — Safari users see only navbar/footer on some `/holidays/[slug]` pages. Chrome works.
2. **Google Search Console errors** — 17 5xx on `*/opengraph-image`, "Duplicate field FAQPage" on `/holidays`, "Missing field performer" on 4 events, 431 pages "Excluded by `noindex`", 548 "Discovered – currently not indexed", 1 "Redirect error" on `/&`.
3. **Architecture drift** — Vercel-era code shipping to VPS, dual data-layer for holidays, strict-caching mode (`cacheComponents` + `dynamicIO`) used incorrectly in places, inconsistent JS/TS, no codebase overview for future sessions.

Production currently shows `miqatona-prod-blue` as **unhealthy** (`docker ps` output the user provided), so the failure mode is already active.

The deep audit lives at `docs/audit-2026-05-12.md` and is the source of truth for evidence behind every fix below. This plan is the *execution* of that audit, staged to minimize blast radius for the live AdSense site.

**Defaults baked in** (override during review if needed):
- Persistent memory goes in **both** a short `CLAUDE.md` (root, auto-loaded by Claude Code) **and** a detailed `docs/codebase-overview.md`
- OG images for unknown slugs return **200 + branded fallback PNG** (safer for AdSense); known-typo paths like `/awqaf-al-salat/*` get a 301 to the canonical
- Cache architecture: ship the **minimal** time-out-of-cache fix this cycle, defer the full split refactor to a follow-up after AdSense stabilizes
- Validation path: **staging container first → CI builds `:prod` → blue/green swap** (no shortcuts since the app is live)

---

## Strategy

### Order of operations (lowest blast radius first)

```
P0  nginx config + countries.ts throw → null        ~30 min  → fixes Safari + most 5xx
P1  OG image hardening + performer field            ~3h      → clears 5xx + missing-performer
P2  Schema dedup on /holidays + /date/calendar      ~1h      → clears duplicate FAQPage
P3  Sitemap filtering (noindex/dead URLs)           ~2h      → clears 431 + reduces 548
P4  /& middleware + awqaf-al-salat redirect         ~30 min  → clears redirect error + recycled URLs
P5  Vercel leftover cleanup (deps, files)           ~1h      → smaller image, cleaner builds
P6  Cache fix (minimal: time out of 'use cache')    ~1h      → eliminates hydration drift
P7  Codebase memory files (CLAUDE.md + overview)    ~1h      → permanent docs
P8  Tests for the new contracts                     ~2h      → prevents regression
```

Each phase ships as a **single PR** so review and rollback are atomic. Phases P0–P4 can be bundled into one PR if reviewed together — they're independently safe.

### Validation path per PR

1. Push branch → CI builds `ghcr.io/mr-badr/ar-clock:staging`
2. `docker compose pull && docker compose up -d` on `docker-app-1` (port 3000 on staging VPS)
3. Run `npm run seo:audit:live` against the staging URL
4. Smoke checklist (see Verification section)
5. Tag for production → CI builds `ghcr.io/mr-badr/ar-clock:prod`
6. Pull on inactive color (currently `miqatona-prod-blue` is unhealthy → deploy to `green`)
7. Health-check green via `/api/health`, swap nginx upstream, decommission blue
8. Click **Validate Fix** in GSC for each cleared error bucket

### Rollback strategy

- nginx changes are isolated to two files (`infra/nginx/snippets/proxy-common.conf`, `infra/nginx/nginx.conf`). Keep `.BACKUP` copies before editing on VPS.
- Code changes: blue/green provides instant rollback — if green is bad, point nginx back at blue (after blue is rebuilt healthy).
- Each PR's commits are small and revertable.

---

## Phase-by-phase plan

### P0 — Safari blank page + biggest 5xx (30 min)

**Goal:** Stop the most user-visible bleeding with two surgical edits.

**P0.1 — nginx streaming fix** (VPS-side, edit on server, not in repo)

The repo's `infra/nginx/snippets/proxy-common.conf` shows what *should* be there; the live VPS at `/opt/miqatona/infra/nginx/sites-available/` may differ. Pull the live config first.

Live VPS path: `/etc/nginx/snippets/proxy-common.conf` (mounted from `/opt/miqatona/infra/nginx/snippets/` per the deploy layout shown in the user's logs).

Replace contents with:

```nginx
proxy_http_version 1.1;

proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;

# Use the map defined in nginx.conf — only "upgrade" for actual WebSocket
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;

# Streaming-safe for Next.js 16 RSC + Suspense (fixes Safari blank page)
proxy_buffering off;
proxy_request_buffering off;
proxy_read_timeout 75s;
proxy_send_timeout 75s;
```

In `infra/nginx/nginx.conf:33-51` (`gzip_types` block), **remove** `text/html` if present (the current config does not gzip HTML explicitly, but the implicit `gzip on` at line 28 covers `text/html` via the default `gzip_types text/html`). Add a comment and an explicit exclusion:

```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 5;
gzip_min_length 1024;
# NOTE: We do NOT gzip text/html. Next.js streams Suspense chunks; gzip+streaming
# breaks Safari/WebKit which never sees the post-shell content. Let the upstream
# decide HTML compression per response.
gzip_types
  text/css
  text/xml
  text/javascript
  application/json
  application/javascript
  application/xml
  application/xml+rss
  application/atom+xml
  application/ld+json
  image/svg+xml
  font/woff
  font/woff2
  application/vnd.ms-fontobject;
```

Both files also live in the repo at `infra/nginx/nginx.conf` and `infra/nginx/snippets/proxy-common.conf` — edit them so future deploys are consistent.

Also verify `infra/nginx/templates/site.conf.template` has an HTTPS server block. If not, document the TLS-termination layer (Cloudflare in front?) in `docs/codebase-overview.md` (P7).

Test on VPS before reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**P0.2 — `getCountryBySlug()` throw → null** (repo edit)

File: `src/lib/db/queries/countries.ts:100-112`

Change line 111 from `throw new Error('Country not found: ${slug}')` to `return null` to match the contract of the sibling `getCountryByCode()` at line 115-128. This single edit clears the majority of the 17 5xx errors on `*/opengraph-image`.

---

### P1 — OG image hardening + Event schema performer (~3h)

**Goal:** No `*/opengraph-image` route can 5xx, ever. Event schema (when emitted) is always valid.

**P1.1 — `searchParams` is a Promise**

`src/app/holidays/[slug]/opengraph-image.jsx:52`:
```jsx
export default async function Image({ params, searchParams }) {
  const { slug } = await params;
  const sp = (await searchParams) || {};
  const isSquare = sp.sq === '1';
  // ... rest unchanged
}
```

(Line 56 currently reads `searchParams?.sq` on the raw Promise — always `undefined`, plus a Next 16 async-API warning.)

**P1.2 — Top-level try/catch on every OG route + Arabic font**

Apply to all 4 OG routes:
- `src/app/holidays/[slug]/opengraph-image.jsx`
- `src/app/time-now/[country]/opengraph-image.jsx`
- `src/app/time-now/[country]/[city]/opengraph-image.jsx`
- `src/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`

Pattern:
```jsx
async function loadArabicFont() {
  // Cache across invocations — module scope
  if (loadArabicFont._cache) return loadArabicFont._cache;
  const res = await fetch(new URL('../../../../public/fonts/NotoSansArabic-Bold.ttf', import.meta.url));
  loadArabicFont._cache = await res.arrayBuffer();
  return loadArabicFont._cache;
}

function renderFallback(label = 'ميقاتنا') {
  return new ImageResponse(<BrandedFallbackJSX label={label} />, { width: 1200, height: 630 });
}

export default async function Image(args) {
  try {
    return await renderRealImage(args);
  } catch (err) {
    // Never let an OG route 5xx — share previews + GSC must see 200
    console.error('[og-image] fallback', String(err));
    return renderFallback();
  }
}
```

Place the Arabic font asset at `public/fonts/NotoSansArabic-Bold.ttf`. Source: Google Fonts download (already used via `next/font/google` in `layout.tsx:45-51`, just need the static file).

Pass `fonts` to every `new ImageResponse(...)` call:
```jsx
new ImageResponse(<JSX/>, {
  width: W, height: H,
  fonts: [{ name: 'NotoArabic', data: await loadArabicFont(), style: 'normal', weight: 700 }],
});
```

Wrap rendered Arabic text in `<div style={{ fontFamily: 'NotoArabic' }}>`.

**P1.3 — Add `performer` to `buildEventSchema`**

`src/lib/holidays-engine.js:529-583` `buildEventSchema()`. Insert after the `organizer` block (after line 577):

```js
performer: {
  '@type': 'Organization',
  name: schemaData.eventName || ev.name,
},
```

This makes the schema valid even though no event in the repo currently sets `schemaData.googleEventRichResult: true`. The 4 GSC-flagged events are stale Google data from before the gate at `lib/holidays/page-data.js:173` was added (commit `51c57a1`, 2026-04-17). The gate already prevents new Event schema for those slugs; adding `performer` is defense-in-depth.

After deploy, click **Validate Fix** in GSC → Enhancements → Events.

**P1.4 — Document the gate**

Add a brief section to `docs/events-authoring-guide.md`:
> Set `schemaData.googleEventRichResult: true` only for events that are real, bookable, attendable public events. Public observances (national days, school start, religious dates) should NOT opt in — they're countdown pages, and Google penalizes Event schema on non-event content.

---

### P2 — Schema deduplication (~1h)

**Goal:** Each page emits one of each top-level schema type. No nested FAQPage inside WebPage.mainEntity.

**P2.1 — `/holidays` consolidation**

`src/app/holidays/page.jsx` currently emits 5 schemas inline (lines 49-147): `breadcrumb`, `websiteSchema`, `orgSchema`, `holidaysCollectionSchema`, `upcomingEventsSchema`. Plus `<HolidaysSections nowIso={nowIso} />` at line 318 calls `HolidaysGlobalSchemas` which emits 4 more: `webPageSchema`, `breadcrumbSchema`, `faqSchema`, `itemListSchema`. Total: **9 JSON-LD blocks** with overlap.

Remove from `app/holidays/page.jsx`:
- `websiteSchema` (lines 53-61) — already emitted globally by `components/seo/SiteWideSchemas.jsx`
- `orgSchema` (lines 62-71) — already emitted globally
- `breadcrumb` inline schema script (line 145) — keep the one inside `HolidaysGlobalSchemas` only
- `upcomingEventsSchema` (lines 123-133) — redundant with `holidaysCollectionSchema.mainEntity` (an ItemList)

Keep:
- `holidaysCollectionSchema` (CollectionPage wrapping ItemList) at lines 104-122
- Everything in `HolidaysGlobalSchemas` (WebPage, BreadcrumbList, FAQPage, ItemList — yes, this still leaves two ItemList total: one inside CollectionPage, one standalone. Drop the standalone in `GlobalSchemas.jsx:69-81` since CollectionPage's mainEntity already covers it)

End state: `/holidays` emits **5 schemas**: Organization (site-wide), WebSite (site-wide), WebPage, BreadcrumbList, FAQPage, CollectionPage (containing ItemList). Clean.

**P2.2 — `/date/calendar/[year]` nested FAQPage fix**

`src/app/date/calendar/[year]/page.tsx:134-152` — split:
```jsx
const jsonLd = { /* WebPage only, drop mainEntity */ };
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

return (
  <>
    <JsonLd data={jsonLd} />
    <JsonLd data={faqSchema} />
    {/* rest unchanged */}
  </>
);
```

Audit similar pattern in:
- `src/app/date/calendar/hijri/[year]/page.tsx`
- `src/app/date/[year]/[month]/[day]/page.tsx`
- `src/app/date/hijri/[year]/[month]/[day]/page.tsx`
- `src/app/date/today/page.tsx`
- `src/app/date/today/hijri/page.tsx`
- `src/app/date/converter/page.tsx`
- `src/app/date/country/[countrySlug]/page.tsx`
- `src/app/date/page.tsx`

Same split where `mainEntity` is a FAQPage.

**P2.3 — Per-event schema sanity**

`src/app/holidays/[slug]/page.jsx:107-112` emits up to 6 schemas. Verify per page:
- `evSchema` (Event) — currently gated, expected null for all live events → no action
- `wpSchema` (WebPage) — keep
- `bcSchema` (Breadcrumb) — keep
- `faqSchema` (FAQPage) — keep
- `articleSchema` (Article) — verify no overlap with wpSchema; if dateModified/author are identical, drop articleSchema
- `eventSeriesSchema` (EventSeries) — gated to recurring types only; verify the gate at `holidays-engine.js:678-680` (already restricts to `hijri/fixed/easter/monthly/floating`). No change needed.

Action: drop `articleSchema` emission unless we have evidence Google needs it separately from WebPage. WebPage already carries the authority signals.

---

### P3 — Sitemap filtering (~2h)

**Goal:** Eliminate the 431 "Excluded by noindex" bucket. Cut the 548 "Discovered, not indexed" bucket meaningfully.

**P3.1 — Filter every sitemap by the page's own `robots.index`**

Touch these files:
- `src/app/sitemap.js`
- `src/app/holidays/sitemap.js`
- `src/app/time-now/sitemap.js`
- `src/app/mwaqit-al-salat/sitemap.js`
- `src/app/time-difference/sitemap.js`
- `src/app/calculators/sitemap.js`
- `src/app/date/sitemap.xml/route.ts`
- `src/app/date/sitemaps/calendars/route.ts`
- `src/app/date/sitemaps/countries/route.ts`
- `src/app/date/sitemaps/static/route.ts`

In each, before adding a URL, pass it through the same indexability helper the page itself uses:
- `src/lib/seo/date-indexing.ts` — `isSeoIndexableGregorianCalendarYear`, `isSeoIndexableHijriCalendarYear`
- `src/lib/seo/country-indexing.ts` — country indexability
- `src/lib/seo/time-difference-indexing.js` — pair indexability

For holidays sitemap (`src/app/holidays/sitemap.js`), additionally filter by `getEventMeta(slug)?.publishStatus === 'live'`.

**P3.2 — Drop dead/empty sitemaps**

Per `docs/routes-and-sitemaps-inventory.md`, these are intentionally empty:
- `src/app/date/gregorian/sitemap.xml`
- `src/app/date/hijri/sitemap.xml`

Delete the route files. Update `docs/routes-and-sitemaps-inventory.md` and any references in `docs/google-search-console-sitemaps.txt`.

**P3.3 — Shared sitemap builder**

Extract common headers, lastmod stamping, and filtering into `src/lib/seo/sitemap-builder.ts`:

```ts
import type { MetadataRoute } from 'next';

export type SitemapEntryInput = {
  url: string;                                  // path or absolute URL
  lastModified?: Date | string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  isIndexable?: boolean;                        // when false, dropped
};

export function buildSitemap(entries: SitemapEntryInput[]): MetadataRoute.Sitemap { ... }
```

Each sitemap route then calls the builder. Drift between routes (different priorities, different changefreqs) disappears.

**P3.4 — Add internal links to thin calculator pages**

Each `/calculators/<tool>/page.jsx` currently has no sibling links. Add a "Related tools" section using the existing `appendToolDiscoveryLinks` helper from `src/lib/seo/discovery-links.js` and the `GeoInternalLinks` component from `src/components/seo/GeoInternalLinks.jsx`. Pattern already used in `src/app/holidays/page.jsx:81-97`.

For each calculator route, pick 5-8 most-related siblings + the parent `/calculators` hub. This addresses the "Discovered, not indexed" bucket by giving Google more crawl signal.

---

### P4 — `/&` redirect + recycled URLs (~30 min)

**Goal:** Clear the 1 GSC "Redirect error" + start cleaning the typo'd URLs from old indexes.

**P4.1 — Add `/awqaf-al-salat/*` permanent redirect**

`next.config.js` `redirects()`, after the existing `/prayer-times/:country/:city` rule (around line 197):

```js
{
  source: '/awqaf-al-salat/:path*',
  destination: '/mwaqit-al-salat/:path*',
  permanent: true,
},
```

**P4.2 — Middleware for `/&` variants**

Create `src/middleware.ts` (no existing middleware in this repo):

```ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/&' || pathname.startsWith('/&') || pathname === '/%26') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: ['/&', '/&:rest*', '/%26', '/%26:rest*'],
};
```

This catches both URL-encoded and decoded variants without affecting any other route. After deploy, click **Validate Fix** in GSC.

**P4.3 — Add `/api/og/[...slug]/route.ts` returning 410**

Per the GSC reports there are stale `/api/og/<slug>` URLs from the Vercel era. The current codebase has no `/api/og/[slug]` route. Add:

```ts
// src/app/api/og/[...slug]/route.ts
export const dynamic = 'force-static';
export function GET() {
  return new Response('Gone', { status: 410 });
}
```

Google de-indexes 410 faster than 404.

---

### P5 — Vercel-era leftover cleanup (~1h)

**Goal:** Smaller Docker image, cleaner builds, fewer surprises.

**P5.1 — Remove unused packages**

`package.json` edits:
- Remove `@vercel/analytics` from `dependencies` (commented out in `app/layout.tsx:18,203`, no other reference)
- Remove `postgres` from `devDependencies` (unused — replaced by `pg` + `@prisma/adapter-pg`)
- Verify `puppeteer` + `puppeteer-core` + `@sparticuz/chromium` usage. `/api/pdf-calendar` is gated by a feature flag per `docs/platform-stabilization-2026-q2.md`. If the flag is off in production, move these to `optionalDependencies` (saves ~200 MB in the Docker image). If unsure, keep but verify flag default.

`next.config.js:18-21`:
```js
serverExternalPackages: [
  'pg',
  // 'postgres' removed — not used since Prisma migration
  // 'drizzle-orm' removed — never installed
],
```

**P5.2 — Delete unused files**

- `supabase-schema.sql` (repo root) — legacy
- `test-filter.js`, `test-norm.js`, `test-schemas.js`, `test-visible.js` (repo root) — adhoc dev scratch files; move to `scripts/scratch/` or delete
- `.codex` (empty file)

**P5.3 — Drop dead Suspense around static Header/Footer**

`app/layout.tsx:197-206` wraps `<Header />` and `<Footer />` in `<Suspense>` with fixed-height fallbacks. Neither is async. Remove the Suspense wrappers — they add reconciler overhead and stream noise that can compound the Safari issue.

Keep the Suspense around `<AdStickyAnchor />`, `<ConsentBanner />`, `<AnalyticsProvider />`, `<AdSenseProvider />`, `<ServiceWorkerRegistration />` (lines 222-233) because those are genuinely async client islands.

**P5.4 — Update `.dockerignore`**

Confirm it excludes:
- `tests/`
- `docs/`
- `scripts/scratch/`
- `*.md` at repo root except `README.md`

Smaller layer cache = faster CI builds.

---

### P6 — Cache architecture: minimal fix (~1h)

**Goal:** Stop caching time-dependent fields. Defer the full static/live split refactor to a follow-up.

**P6.1 — `getHolidayPageData` — pull time math out of `'use cache'`**

`src/lib/holidays/page-data.js:99-264` is `'use cache'` and computes `remaining`, `eventState`, `gregStr`, `hijriStr`, etc. from `nowIso`.

Minimal fix: split into:
```js
// page-data.js
export async function getHolidayStaticData(slug) {
  'use cache';
  cacheTag(...);
  cacheLife('hours');
  // event content, FAQ, base schemas, page model — no time math
  return { event, seo, faqItems, quickFacts, pageModel, baseSchemas, ... };
}

export async function getHolidayLiveTimeData(staticData) {
  // NOT cached. Runs every request.
  const nowIso = new Date().toISOString();
  const targetDate = ...
  const remaining = getTimeRemaining(targetDate, Date.now());
  const eventState = ...;
  const liveSchemas = applyDatesToSchemas(staticData.baseSchemas, targetDate, nowIso);
  return { nowIso, targetDate, remaining, eventState, gregStr, hijriStr, schemas: liveSchemas };
}

export async function getHolidayPageData(slug) {
  // Kept as the single caller-facing API for backward compatibility
  const staticData = await getHolidayStaticData(slug);
  if (!staticData) return null;
  const liveData = await getHolidayLiveTimeData(staticData);
  return { ...staticData, ...liveData };
}
```

The page (`app/holidays/[slug]/page.jsx`) requires no change. Internally, schemas that embed `targetDate.toISOString()` move into `getHolidayLiveTimeData`. Everything that depends only on slug stays cached.

This is invasive but contained — one file, one new function boundary. Skipping the full PPR/Suspense split.

**P6.2 — `getCachedNowIso()` audit**

`src/lib/date-utils.ts` defines `getCachedNowIso()`. Rename it to `getHourBucketIso()` (and keep a deprecated re-export of the old name for one release) so callers know the value is bucketed by hour. Update all 44 callers? No — too risky. Just rename + alias, fix the name semantically, and add a JSDoc warning.

Defer the full caller-by-caller audit to the follow-up cycle.

---

### P7 — Codebase memory files (~1h)

**Goal:** Future Claude sessions (and humans) understand the codebase in under 5 minutes.

**P7.1 — Create `CLAUDE.md` at repo root** (auto-loaded by Claude Code)

Short, scannable. Sections:
- 1-paragraph "what is this app"
- Stack snapshot (Next 16.1.6, React 19, Prisma 7, Postgres, nginx, blue/green Docker on Hetzner)
- Where to find things (link to `docs/codebase-map.md` and the new `docs/codebase-overview.md`)
- Hot zones — `src/lib/holidays/*`, `src/lib/db/queries/*`, OG image routes, sitemaps, `next.config.js`
- Critical gotchas:
    - `cacheComponents: true` + `dynamicIO: true` — read `docs/codebase-overview.md` before touching any `'use cache'` function
    - nginx must keep `proxy_buffering off` for streaming
    - OG image routes must always 200 (never throw, always fallback)
    - Event schema is gated; do not opt in for non-bookable observances
    - The app is on AdSense — any new 5xx hurts revenue
- Commands cheat-sheet (build, dev, test, deploy)
- "Update this file when…" checklist

**P7.2 — Create `docs/codebase-overview.md`** (detailed, ~10 min read)

Sections:
1. **Purpose** — Arabic time/date/prayer/holidays/calculators platform, monetized via AdSense.
2. **Stack & infrastructure** — Next.js, React, Prisma, Postgres, nginx, Docker blue/green on Hetzner, GHCR images.
3. **Routes map** — copy/condense `docs/routes-and-sitemaps-inventory.md`.
4. **Data flow for holidays** — file authoring → `events:build` → generated JSON → `lib/holidays/repository.js` → `lib/holidays/page-data.js` → `app/holidays/[slug]/page.jsx`. Include sequence diagram in ASCII.
5. **Caching model** — explain `cacheComponents`, `dynamicIO`, `'use cache'`, `cacheLife`, `cacheTag`. List which functions are cached and at what TTL.
6. **Deployment** — staging → CI → prod blue/green. Include the actual VPS paths the user shared (`/opt/miqatona/apps/`, `/opt/miqatona/infra/docker/production/`, env files, backup paths).
7. **SEO rules** — canonical host is `https://miqatona.com`; sitemaps must not include `noindex` URLs; every OG image route must always 200; FAQPage emitted once per page; Event schema gated on `schemaData.googleEventRichResult === true`.
8. **Known limitations** — what was deferred and why (e.g. dual data layer; full cache split; calculator deeper linking).
9. **Update protocol** — at the end: "When the codebase changes meaningfully, update this file AND `CLAUDE.md`. Specifically: new routes, new top-level schemas, changes to caching strategy, infrastructure migrations, dependency removals."

**P7.3 — Anchor existing docs**

`docs/codebase-map.md` already exists. Add a one-line pointer in `CLAUDE.md` and link from `docs/codebase-overview.md`. Don't duplicate.

**P7.4 — A small "update memory" script** *(optional but requested)*

`scripts/update-codebase-overview.ts`:
- Reads recent git log (`git log --oneline -50`)
- Reads `package.json` for current versions
- Reads list of routes from `src/app/**/page.{js,jsx,ts,tsx}`
- Compares against the routes section of `docs/codebase-overview.md`
- Reports diffs and prompts to update

This is a "lint your docs" tool, runnable with `npm run docs:check`. Not autoupdating to avoid noise.

---

### P8 — Test coverage (~2h)

**Goal:** Lock in the contracts we just fixed so they don't regress.

Add three test files:

- `tests/og-fallback.test.ts` — for every OG route, mocked unknown slug returns 200 with a PNG (never throws, never 5xx).
- `tests/sitemap-noindex.test.ts` — walk every sitemap; for each URL, assert the corresponding page does not have `robots.index === false`. Use the same `isSeoIndexable*()` helpers.
- `tests/event-schema-performer.test.ts` — when `buildEventSchema()` produces output, `performer` is non-empty.

Hook into the existing `npm run test:unit` script (`package.json:20`).

CI gate: add `npm run test:unit` to the GitHub Actions workflow that builds the Docker image. Currently `package.json:44` has `ci:check` running `lint + typecheck + test:unit + seo:validate + validate:holidays` — verify the CI workflow calls `ci:check`.

---

## Critical files modified (master list)

```
infra/nginx/snippets/proxy-common.conf       (P0.1) replace
infra/nginx/nginx.conf                        (P0.1) edit gzip_types
src/lib/db/queries/countries.ts               (P0.2) line 111 throw→null
src/app/holidays/[slug]/opengraph-image.jsx   (P1.1,P1.2) await searchParams, try/catch, Arabic font
src/app/time-now/[country]/opengraph-image.jsx           (P1.2) try/catch, font
src/app/time-now/[country]/[city]/opengraph-image.jsx    (P1.2) try/catch, font
src/app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx  (P1.2) try/catch, font
src/lib/holidays-engine.js                    (P1.3) buildEventSchema add performer
docs/events-authoring-guide.md                (P1.4) gate doc
src/app/holidays/page.jsx                     (P2.1) remove duplicate schemas
src/components/holidays/GlobalSchemas.jsx     (P2.1) drop standalone ItemList
src/app/date/calendar/[year]/page.tsx         (P2.2) split FAQPage from WebPage
src/app/date/calendar/hijri/[year]/page.tsx   (P2.2) same
src/app/date/[year]/[month]/[day]/page.tsx    (P2.2) same
src/app/date/hijri/[year]/[month]/[day]/page.tsx  (P2.2) same
src/app/date/today/page.tsx                   (P2.2) audit
src/app/date/today/hijri/page.tsx             (P2.2) audit
src/app/date/converter/page.tsx               (P2.2) audit
src/app/date/country/[countrySlug]/page.tsx   (P2.2) audit
src/app/date/page.tsx                         (P2.2) audit
src/app/holidays/[slug]/page.jsx              (P2.3) optionally drop articleSchema
src/app/sitemap.js                            (P3.1) filter
src/app/holidays/sitemap.js                   (P3.1) filter
src/app/time-now/sitemap.js                   (P3.1) filter
src/app/mwaqit-al-salat/sitemap.js            (P3.1) filter
src/app/time-difference/sitemap.js            (P3.1) filter
src/app/calculators/sitemap.js                (P3.1) filter
src/app/date/sitemap.xml/route.ts             (P3.1) filter
src/app/date/sitemaps/calendars/route.ts      (P3.1) filter
src/app/date/sitemaps/countries/route.ts      (P3.1) filter
src/app/date/sitemaps/static/route.ts         (P3.1) filter
src/app/date/gregorian/sitemap.xml/route.ts   (P3.2) delete
src/app/date/hijri/sitemap.xml/route.ts       (P3.2) delete
src/lib/seo/sitemap-builder.ts                (P3.3) NEW
src/app/calculators/**/page.jsx               (P3.4) add internal links
next.config.js                                (P4.1) /awqaf-al-salat redirect
src/middleware.ts                             (P4.2) NEW
src/app/api/og/[...slug]/route.ts             (P4.3) NEW 410
package.json                                  (P5.1) drop unused deps
src/app/layout.tsx                            (P5.3) drop Header/Footer Suspense
public/fonts/NotoSansArabic-Bold.ttf          (P1.2) NEW asset
src/lib/holidays/page-data.js                 (P6.1) split static/live
src/lib/date-utils.ts                         (P6.2) rename + alias
CLAUDE.md                                     (P7.1) NEW root
docs/codebase-overview.md                     (P7.2) NEW
scripts/update-codebase-overview.ts           (P7.4) NEW optional
tests/og-fallback.test.ts                     (P8) NEW
tests/sitemap-noindex.test.ts                 (P8) NEW
tests/event-schema-performer.test.ts          (P8) NEW
.dockerignore                                 (P5.4) audit
supabase-schema.sql                           (P5.2) delete
test-filter.js test-norm.js test-schemas.js test-visible.js  (P5.2) delete or move
.codex                                        (P5.2) delete
```

---

## Reused existing functions (no new code where reuse fits)

- `appendToolDiscoveryLinks` in `src/lib/seo/discovery-links.js` — for P3.4 calculator internal links
- `GeoInternalLinks` in `src/components/seo/GeoInternalLinks.jsx` — same
- `isSeoIndexableGregorianCalendarYear` / `isSeoIndexableHijriCalendarYear` in `src/lib/seo/date-indexing.ts` — for P3.1
- `getEventMeta` in `src/lib/events/index.js` — for P3.1 holidays filter
- `validateSchemaShape` in `src/lib/holidays/schema-validator.js` — gate added performer in tests
- `JsonLd` in `src/components/seo/JsonLd.tsx` — for P2.2 splitting nested FAQPage
- `getCachedNowIso` in `src/lib/date-utils.ts` — to be renamed in P6.2
- `logEvent` in `src/lib/observability.js` — for OG fallback logging in P1.2
- `getSiteUrl` in `src/lib/site-config.js` — canonical URL throughout

---

## Verification

### Local (before PR)

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run seo:validate
npm run validate:holidays
npm run build:smoke
```

All five must pass. `seo:validate` and `validate:holidays` are the most important — they catch schema and event-content regressions.

### Staging container

```bash
# On VPS — pull staging tag
cd /opt/miqatona/apps/staging/current
docker compose pull
docker compose up -d
docker ps   # confirm docker-app-1 is (healthy)

# Smoke tests
curl -I https://staging.miqatona.com/holidays/ramadan
curl -I https://staging.miqatona.com/holidays/eid-al-fitr
curl -I https://staging.miqatona.com/holidays/madrid-in-usa  # should be 404 on page, 200 on OG image
curl -I https://staging.miqatona.com/awqaf-al-salat/saudi/jeddah  # 301 → /mwaqit-al-salat/saudi/jeddah
curl -I 'https://staging.miqatona.com/&'  # 308 → /
curl -I https://staging.miqatona.com/api/og/foo  # 410

# OG image audit
for slug in ramadan eid-al-fitr school-start-kuwait madrid-in-usa nonexistent-slug; do
  echo -n "/holidays/$slug/opengraph-image  "
  curl -s -o /dev/null -w '%{http_code} %{content_type}\n' "https://staging.miqatona.com/holidays/$slug/opengraph-image"
done
# All 5 must return 200 image/png

# Schema audit
curl -s https://staging.miqatona.com/holidays | grep -c '"@type":"FAQPage"'   # must be 1
curl -s https://staging.miqatona.com/holidays | grep -c '"@type":"BreadcrumbList"'  # must be 1
curl -s https://staging.miqatona.com/holidays | grep -c '"@type":"WebSite"'   # must be 1

# Safari streaming sanity (run on a Mac)
curl -v --http2 https://staging.miqatona.com/holidays/ramadan 2>&1 | grep -E 'HTTP|transfer-encoding|content-encoding'
# Expect: HTTP/2 200, transfer-encoding: chunked, NO content-encoding: gzip on the HTML

# Sitemap sanity — no noindex URLs in sitemaps
npm run seo:audit -- --base=https://staging.miqatona.com --limit=200
```

### Real Safari test

Open a fresh Safari window (clear cache via Develop → Empty Caches). Visit:
- `https://staging.miqatona.com/holidays/ramadan`
- `https://staging.miqatona.com/holidays/eid-al-fitr`
- `https://staging.miqatona.com/holidays/saudi-national-day`

Confirm the countdown ticker + event details render fully, not just navbar+footer. Test in private browsing too (no service worker cache).

### Production blue/green rollout

```bash
# Build & push prod tag (via CI on merged branch)

# On VPS — deploy to green (currently inactive)
cd /opt/miqatona/infra/docker/production
docker compose -f compose.base.yml -f compose.green.yml pull
docker compose -f compose.base.yml -f compose.green.yml up -d app_green

# Wait for green to be healthy
docker inspect miqatona-prod-green --format='{{.State.Health.Status}}'

# Run the same smoke tests against the green container's exposed port (3020)
curl -I http://127.0.0.1:3020/api/health
curl -I http://127.0.0.1:3020/holidays/ramadan

# Flip nginx upstream from blue to green
sudo ln -sf /opt/miqatona/infra/nginx/sites-available/miqatona-green.conf /opt/miqatona/infra/nginx/sites-enabled/miqatona.conf
sudo nginx -t && sudo systemctl reload nginx

# Watch logs for 5 min
tail -f /opt/miqatona/logs/nginx/error.log /opt/miqatona/logs/app/*.log

# If healthy after 15 min, decommission blue (or keep for fast rollback)
```

### Google Search Console post-deploy

After production swap + 24h cache TTL elapses:

1. GSC → Page indexing → Server error (5xx) → **Validate Fix**
2. GSC → Page indexing → Redirect error → **Validate Fix**
3. GSC → Page indexing → Excluded by `noindex` → **Validate Fix** (only the sitemap-leak portion will clear; the intentional `noindex,follow` URLs stay flagged forever and that's correct)
4. GSC → Enhancements → FAQ → **Validate Fix**
5. GSC → Enhancements → Events → **Validate Fix**
6. GSC → Sitemaps → confirm only `https://miqatona.com/sitemap-index.xml` is submitted

Wait 7 days. Re-check coverage trends.

---

## Out of scope (deferred)

These are documented in `docs/audit-2026-05-12.md` but explicitly **not** in this cycle:

- Full static/live cache split for holiday pages (P6 ships a minimal version only)
- Deprecating `src/lib/holidays-engine.js` to a re-export shim
- Migrating remaining `.js` files to `.ts`
- Reorganizing component folders for consistency across features
- Adding Prisma indices to `City`/`Country` lookup columns
- Removing `puppeteer` (verify PDF feature flag default first; do in a follow-up if confirmed off)
- Renaming `/mwaqit-al-salat` (do not — would erase rankings)

Capture these in `docs/codebase-overview.md` § Known limitations so the next session knows they're known.

---

## Security note (raised during audit)

The DB password is in plaintext at `/opt/miqatona/infra/docker/production/compose.prod.yml`:
```
POSTGRES_PASSWORD: startaymz1598753
```

This file appears tree-listed in the user's logs. **Do not check this file into the repo** (verify `.dockerignore` and `.gitignore` exclude it). Recommend rotating the password and moving it into `/opt/miqatona/env/production.env` (env_file is already used by other services). This is **not** part of the fix plan above — flagging separately because credential rotation is a security action, not a code change.

---

## Roll-up: what user-visible problems clear after this plan

| GSC bucket / symptom | Before | After |
|---|---|---|
| Safari blank `/holidays/[slug]` pages | reported | resolved (P0.1) |
| Server error 5xx (17 URLs) | 17 | ~0 after re-crawl |
| Redirect error `/` & | 1 | 0 |
| Duplicate FAQPage on /holidays | 2 affected items | 0 after re-crawl |
| Missing performer | 4 | 0 after re-crawl |
| Excluded by noindex | 431 | only legitimate `noindex,follow` URLs remain (likely <100) |
| Discovered – currently not indexed | 548 | reduced as calculator internal-link signal lands |
| Build/deploy reliability | unhealthy blue | healthy green + faster image |
| Next-session onboarding | re-analyze every time | CLAUDE.md + codebase-overview.md |
