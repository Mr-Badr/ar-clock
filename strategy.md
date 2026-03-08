# 📊 Data & SEO Strategy — Verified Next.js 16 Best Practices
This document defines HOW data flows and HOW every page ranks #1.
> Read alongside migration_plan.md. Do not start coding until you read both.

---

## ✅ VERIFICATION — What The Research Confirmed

The following patterns from the previous plan are **confirmed correct** by the official
Next.js 16 documentation. Do not second-guess them:

| Pattern | Status | Source |
|---|---|---|
| `'use cache'` directive on all query functions | ✅ Official N16 API | nextjs.org/docs |
| `cacheTag('countries')` inside the function body | ✅ Official N16 API | nextjs.org/docs |
| `cacheLife('days')` for country/city data | ✅ Official N16 API | nextjs.org/docs |
| `revalidateTag('countries', 'max')` in webhook | ✅ Required in N16 | nextjs.org/docs |
| `generateStaticParams` for all nested routes | ✅ Best practice | nextjs.org/docs |
| `if (dev) return []` in generateStaticParams | ✅ Correct pattern | community confirmed |
| `const { country } = await params` — async params | ✅ Breaking change N16 | nextjs.org/docs |
| `dynamicParams = true` for rare/new city pairs | ✅ Correct for ISR | nextjs.org/docs |
| Module-level Map cache for country cities | ✅ Standard browser pattern | confirmed |
| `cacheComponents: true` in next.config.ts | ✅ Required for 'use cache' | nextjs.org/docs |

**One important correction from the N16 docs:**

`cacheLife` accepts named profiles OR an inline object. The named profiles are:
`'seconds'` · `'minutes'` · `'hours'` · `'days'` · `'weeks'` · `'max'`

Use `'days'` for countries and cities (they change rarely).
Use `'hours'` for holidays (may update more often).
Use `'max'` for static config like constants.

You can also define a **custom profile** in `next.config.ts` for your specific needs:
```typescript
// next.config.ts — add inside experimental block
cacheLife: {
  geodata: {
    stale: 3600,        // serve stale for 1h client-side
    revalidate: 86400,  // revalidate daily on server
    expire: 604800,     // expire after 7 days maximum
  }
}
// Then use: cacheLife('geodata') in your query functions
```

---

## 🏗️ THE THREE-TIER DATA ARCHITECTURE (verified)

### Tier 1 — Build Time / CDN Static (SSG + 'use cache')

The most important thing for SEO is that page data and metadata is available on page load without JavaScript — SSG and ISR are the best options for this.

Every country page and city page is pre-rendered at `next build` into static HTML
stored on CDN. A user visiting `/time-now/morocco/rabat` gets HTML in under 50ms
with zero DB calls, zero server compute. Google's crawler gets fully rendered HTML
with all city data, metadata, and structured data already in the document.

**What gets pre-built:**
- All country listing pages
- All individual country pages (all cities listed as `<a>` tags)
- All individual city pages (timezone, lat, lon, name in static HTML)
- All prayer time pages (lat/lon for client-side adhan calculation)
- All time-difference popular-pair pages

**How the 'use cache' cacheLife profiles control freshness:**

Cache profiles control caching through three timing properties: `stale` (how long the client can use cached data without checking the server), `revalidate` (after this time, the next request triggers a background refresh), and `expire` (the absolute maximum before the entry must be regenerated).

For your geodata (countries, cities) — these change maybe once a year — use `'days'`
or the custom `'geodata'` profile above. The Supabase webhook calls `revalidateTag`
instantly when data actually changes, so the `cacheLife` is just a safety-net fallback.

### Tier 2 — Country City Session Cache (client-side, fixes Rabat bug)

When a user clicks a country chip, ALL cities for that country are fetched ONCE
from `/api/cities-by-country?country=morocco`, stored in a module-level `Map`,
and filtered locally in JavaScript. Second click on the same country = 0ms.

Arab priority countries are silently pre-fetched when the dialog opens so the cache
is already warm before the user clicks any chip.

**Why this is the correct pattern:**
- Eliminates the `limit: 50` bug that caused Rabat to not appear
- No database calls while typing — all filtering is local JS
- `pg_trgm` index is reserved for the global cross-country search only
- Module-level `Map` (not `localStorage`) is the right scope — session-only, instant

### Tier 3 — Global Search API (Supabase + pg_trgm)

Used only when user types without selecting a country chip.
Hits `/api/search-city?q=رباط` → Supabase `ilike` with `pg_trgm` GIN index → <100ms.

`generateStaticParams` should return an array of objects where each object represents the populated dynamic segments of a single route. During next build, generateStaticParams runs before the corresponding Layouts or Pages are generated.

This means every city URL is known at build time and pre-rendered. So when a user
searches and clicks Rabat, they land on a pre-rendered static page — not a server render.

---

## 📄 RENDERING STRATEGY PER ROUTE (final decisions)

| Route | Strategy | Rendering | Why |
|---|---|---|---|
| `/time-now` | SSG | Static HTML | List of countries, changes never |
| `/time-now/[country]` | SSG via `generateStaticParams` | Static HTML | All cities pre-rendered |
| `/time-now/[country]/[city]` | SSG via `generateStaticParams` | Static HTML | All cities pre-rendered |
| `/mwaqit-al-salat` | SSG | Static HTML | Same as time-now |
| `/mwaqit-al-salat/[country]/[city]` | SSG via `generateStaticParams` | Static HTML, client prayer calc | lat/lon from DB at build, adhan runs in browser |
| `/time-difference/[from]/[to]` | SSG (popular) + `dynamicParams=true` (rare) | Static + On-demand | Pre-build top pairs, rest on first visit |
| `/holidays` | SSG | Static HTML | Stable list |
| `/holidays/[slug]` | SSG + `cacheLife('hours')` | Static HTML | Updated via webhook |
| `/api/cities-by-country` | Dynamic | Edge/Node | Returns all cities per country |
| `/api/search-city` | Dynamic | Edge/Node | Live global search |
| `/api/ip-city` | Dynamic | Edge/Node | Per-request geolocation |
| `/api/revalidate` | Dynamic | Node | Webhook receiver |

---

## 🔍 SEARCH — Complete Perfect Flow

### What the SearchCity component does (analysis of your code)

The component has three modes that need different data paths:

**Mode A — Dialog opens, no query, no country selected:**
- Shows GPS button + all countries as list rows
- Data needed: all countries (already in `_countriesCache` module var)
- Action: nothing to fetch

**Mode B — User clicks country chip:**
- CURRENTLY: calls `searchCitiesAction('', 50, countrySlug)` → top 50 only → Rabat missing
- NEW: calls `loadCitiesForCountry(countrySlug)` → ALL cities → stores in Map → filter locally
- The component already has the right shape: `handleSelectCountry` just needs to call the new loader

**Mode C — User types a query:**
- If country selected: filter `_countryCitiesCache.get(countrySlug)` locally (no DB)
- If no country: call `searchCitiesAction(query, 50, null)` → hits `/api/search-city` → Supabase

### City data shape that SearchCity expects

Looking at how `CityRow` uses the city object, the shape must be:
```javascript
{
  city_slug:        string,  // "rabat"
  city_name_ar:     string,  // "الرباط"
  city_name_en:     string | null,
  country_slug:     string,  // "morocco"
  country_code:     string,  // "MA"
  country_name_ar:  string,  // "المغرب"
  timezone:         string,  // "Africa/Casablanca"
  lat:              number,
  lon:              number,
  is_capital:       boolean,
  population:       number,
  preview?:         string,  // optional: prayer time preview
}
```

**The mapping layer:** The new DB fields are `name_ar` / `name_en` (on the city row)
and `name_ar` / `name_en` (on the joined country). When shaping API responses,
map them to `city_name_ar`, `city_name_en`, `country_name_ar` to match
what the component already expects. Do NOT rename fields inside the component.

### Local filter function — Arabic normalization (critical)

The existing `stripDiacritics` in the component is good but incomplete.
The `filterCitiesLocally` function must normalize Arabic properly before comparing:
```
أ إ آ  →  ا   (alef variants)
ة      →  ه   (ta marbuta)
ى      →  ي   (alef maqsura)
Remove: ً ٌ ٍ َ ُ ِ ّ ْ (tashkeel/diacritics)
```
This ensures typing "ربا" finds "الرباط", typing "مكه" finds "مكة", etc.

Sort order for local filter results:
1. Exact start-of-word match (highest priority)
2. Capital city (`is_capital: true`)
3. By population descending

### New API route needed: `/api/cities-by-country`

This is the only new API route required. It:
- Accepts `?country=morocco` (country_slug)
- Calls `getCountryBySlug(slug)` to get the country_code
- Calls `getCitiesByCountry(country_code)` (already cached with 'use cache')
- Shapes the response to match the city object shape above
- Sets `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
  so CDN caches it too — repeat visitors across different sessions get it from CDN

### Priority countries pre-warming

Define the 18 Arab country slugs in `lib/db/constants.ts`.
When `handleOpenDialog` fires, loop through the list and call `loadCitiesForCountry`
for any slug not already in `_countryCitiesCache`. Fire and forget — no await.
By the time the user sees the dialog and clicks a chip, the data is ready.

---

## 🎯 SEO — How To Rank #1 For Every City Query

Next.js 16's App Router renders JSON-LD scripts on the server, so bots receive them without running JavaScript.

This is the key: everything Google sees must be in the static HTML. No JavaScript required.

### 1. `generateMetadata` — Every Page Gets Perfect Metadata

Every page that has `generateStaticParams` must also have `generateMetadata`.
The metadata function receives the same `params` and uses the same cached query functions
(no extra DB call — the cache deduplicates it).

**Pattern for city pages** (`time-now/[country]/[city]/page.jsx`):

The `title` must contain the Arabic city name + the query users type.
Research the actual search queries your users use. Common patterns:
- `توقيت [city] الآن`
- `الوقت في [city]`
- `ما الوقت في [city]`
- `[city] time now` (some users search in English)

The `description` must be a complete sentence with the city and country name.
Both Arabic and English names should appear in the description.

The `alternates.canonical` must be set on every page to prevent duplicate content.

The `openGraph` block must mirror the title and description.

**Pattern for country pages** (`time-now/[country]/page.jsx`):

Title pattern: `توقيت [country] الآن — الوقت الحالي في [country] ومدنها`
Description: mention the country, mention it has multiple cities, mention timezone.

### 2. JSON-LD Structured Data — Rank in Rich Results

The Next.js recommendation for JSON-LD is to render structured data as a `<script>` tag in your `layout.js` or `page.js` components.

Add a `<script type="application/ld+json">` block to each page's return JSX.
This is added by the AI IDE inside the existing JSX — it does NOT change any visual UI.
It goes before or after the main content, typically near the end of the page component.

**For city time pages** — use `WebPage` + `Place` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "توقيت الرباط الآن",
  "description": "الوقت الحالي في الرباط، المغرب",
  "url": "https://your-domain.com/time-now/morocco/rabat",
  "about": {
    "@type": "City",
    "name": "الرباط",
    "alternateName": "Rabat",
    "containedInPlace": {
      "@type": "Country",
      "name": "المغرب",
      "alternateName": "Morocco"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 34.0209,
      "longitude": -6.8416
    }
  }
}
```

**For prayer time pages** — use `WebPage` with `about` pointing to the city:
Same structure as above but with `"name": "مواقيت الصلاة في الرباط"`.

**For country pages** — use `Country` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "توقيت المغرب الآن",
  "about": {
    "@type": "Country",
    "name": "المغرب",
    "alternateName": "Morocco"
  }
}
```

**For the home page and listing pages** — use `WebSite` + `SearchAction` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site Name",
  "url": "https://your-domain.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://your-domain.com/api/search-city?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
This enables **Google Sitelinks Search Box** — a search box appears directly in Google results.

### 3. Breadcrumbs — Essential for Nested City Pages

With correct implementation, websites can achieve rich snippets including breadcrumbs.

Add `BreadcrumbList` JSON-LD to every nested page. This creates breadcrumb trails
in Google results like: `Your Site > توقيت > المغرب > الرباط`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://your-domain.com" },
    { "@type": "ListItem", "position": 2, "name": "توقيت", "item": "https://your-domain.com/time-now" },
    { "@type": "ListItem", "position": 3, "name": "المغرب", "item": "https://your-domain.com/time-now/morocco" },
    { "@type": "ListItem", "position": 4, "name": "الرباط", "item": "https://your-domain.com/time-now/morocco/rabat" }
  ]
}
```

All values (city name, country name, URLs) come from the `country` and `city` objects
already loaded by the page — no extra data fetching needed.

### 4. `hreflang` — Arabic Language Signal

In `generateMetadata`, always include the language attribute. This tells Google
this page is Arabic content for Arabic-speaking users worldwide:

```javascript
// In generateMetadata return object:
alternates: {
  canonical: `/time-now/${countrySlug}/${citySlug}`,
  languages: {
    'ar': `https://your-domain.com/time-now/${countrySlug}/${citySlug}`,
  }
}
```

The root layout should have `<html lang="ar" dir="rtl">` — confirm this is already set.

### 5. Page Title Strategy — The Most Important SEO Element

Bad title: `توقيت الرباط`
Good title: `توقيت الرباط الآن | الوقت الحالي في الرباط المغرب`
Best title: `⏰ توقيت الرباط الآن — الوقت الحالي في الرباط، المغرب`

The format that ranks:
- Primary keyword at the start: `توقيت [city] الآن`
- Secondary context: `الوقت الحالي في [city]، [country]`
- Include the English city name in description (not title): `Rabat, Morocco`
- Keep under 60 characters for the title to avoid truncation

### 6. Sitemap — Every Single City, Correct Priority

Being deliberate with rendering strategies, code splitting, and caching allows slashing backend load, improving SEO, and delivering a smooth experience even under high traffic.

The sitemap must include:
- Every city URL under `/time-now/`
- Every city URL under `/mwaqit-al-salat/`
- Every country URL under both sections
- All holiday pages

Priority weights (0.0–1.0):
```
Home page:          1.0
/time-now:          0.9
/mwaqit-al-salat:   0.9
Capital city pages: 0.85
Major city pages:   0.75 (population > 500k)
Other city pages:   0.65
Holiday pages:      0.7
```

`changeFrequency` for city time pages should be `'daily'` — the data (timezone) doesn't
change but Google interprets this as "check this page frequently" which helps crawl rate.

---

## 📁 FILES TO CREATE (data layer only, no UI changes)

| File | Purpose |
|---|---|
| `lib/db/types.ts` | TypeScript types matching DB schema |
| `lib/supabase/server.ts` | Anon client for query functions |
| `lib/supabase/admin.ts` | Service role for scripts/webhooks |
| `lib/db/queries/countries.ts` | All country queries with 'use cache' |
| `lib/db/queries/cities.ts` | All city queries with 'use cache' |
| `lib/db/queries/holidays.ts` | Holiday queries (existing table) with 'use cache' |
| `lib/db/constants.ts` | Priority country codes/slugs list |
| `lib/db/fallback/countries.json` | Auto-generated by export script |
| `lib/db/fallback/cities-index.json` | Auto-generated by export script |
| `scripts/export-fallback.ts` | Runs before every build |
| `app/api/cities-by-country/route.js` | Returns ALL cities for a country |

---

## 📁 FILES TO UPDATE (data + SEO only, keep all UI/design)

| File | What changes |
|---|---|
| `next.config.ts` | Add `cacheComponents: true`, `reactCompiler: true` |
| `app/layout.tsx` | Confirm `lang="ar" dir="rtl"` on `<html>` |
| `app/page.jsx` | Replace data fetch if any + add WebSite JSON-LD |
| `app/sitemap.js` | New query functions, all cities, correct priority |
| `app/time-now/page.jsx` | New query function |
| `app/time-now/[country]/page.jsx` | New queries + `generateStaticParams` + `generateMetadata` + JSON-LD |
| `app/time-now/[country]/[city]/page.jsx` | New queries + all params + `generateMetadata` + JSON-LD + Breadcrumbs |
| `app/mwaqit-al-salat/page.jsx` | New query function |
| `app/mwaqit-al-salat/[country]/[city]/page.jsx` | New queries + all params + `generateMetadata` + JSON-LD |
| `app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx` | New queries, await params |
| `app/time-difference/[from]/[to]/page.jsx` | New queries + `generateStaticParams` + `generateMetadata` |
| `app/holidays/page.jsx` | New query function for countries if used |
| `app/holidays/actions.js` | Wrap holiday fetching in 'use cache' pattern |
| `app/holidays/HolidaysClient.jsx` | Review: update if it fetches directly |
| `app/holidays/[slug]/page.jsx` | `getHolidayBySlug` + `generateStaticParams` + `generateMetadata` |
| `app/holidays/[slug]/opengraph-image.jsx` | `getHolidayBySlug` + await params |
| `app/actions/location.js` | Replace old data lookup with new query functions |
| `app/api/search-city/route.js` | New `searchCities()`, correct response shape |
| `app/api/ip-city/route.js` | Update any DB lookup to new query functions |
| `app/api/revalidate/route.js` | `revalidateTag(tag, 'max')` with secret check |
| `SearchCity.client.jsx` | Add `_countryCitiesCache` Map, `loadCitiesForCountry`, update `handleSelectCountry`, update `performSearch`, add `filterCitiesLocally`, add pre-warming in `handleOpenDialog` |
| `middleware.ts` → `proxy.ts` | Rename file + rename export function |

---

## ✅ FINAL VERIFICATION CHECKLIST

**Caching (N16 verified):**
- [ ] Every query function has `'use cache'` + `cacheTag()` + `cacheLife()` — no `unstable_cache` anywhere
- [ ] `cacheComponents: true` in `next.config.ts`
- [ ] `revalidateTag(tag, 'max')` — second argument present in webhook route
- [ ] `export const revalidate = N` removed from all page files

**Static generation:**
- [ ] `generateStaticParams` on all `[country]` and `[country]/[city]` routes
- [ ] `if (process.env.NODE_ENV === 'development') return []` at start of each
- [ ] `const { country } = await params` — async params used everywhere
- [ ] `const { searchParams } = await props.searchParams` if searchParams used
- [ ] `dynamicParams = true` on time-difference route

**Search (Rabat fix):**
- [ ] `/api/cities-by-country` route created and returns ALL cities (no limit)
- [ ] `_countryCitiesCache` Map at module level in SearchCity
- [ ] `loadCitiesForCountry` function created
- [ ] `handleSelectCountry` uses `loadCitiesForCountry` + local filter
- [ ] `performSearch` checks country cache first before hitting API
- [ ] `filterCitiesLocally` normalizes Arabic (alef variants, ta marbuta)
- [ ] Priority countries pre-warmed on dialog open
- [ ] `/api/search-city` shapes response to match `city_name_ar` etc. fields

**SEO:**
- [ ] `generateMetadata` on every page that has `generateStaticParams`
- [ ] `alternates.canonical` set on every page
- [ ] `lang="ar" dir="rtl"` on root `<html>` element
- [ ] JSON-LD `WebPage` + `City` structured data on all city pages
- [ ] JSON-LD `BreadcrumbList` on nested city pages
- [ ] JSON-LD `WebSite` + `SearchAction` on home page
- [ ] Sitemap includes all cities with correct priority weights
- [ ] Titles follow the `توقيت [city] الآن | الوقت الحالي في [city]، [country]` pattern
- [ ] Build validated with Google Rich Results Test after deploy

**Safety:**
- [ ] Fallback JSON exported and committed before first build
- [ ] `npm run build` passes with zero errors
- [ ] All old JSON data imports removed
- [ ] All old `unstable_cache` calls removed
- [ ] `createClient` only in `lib/supabase/server.ts`, `lib/supabase/admin.ts`, `scripts/`