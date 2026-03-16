# Task: Build a Complete Programmatic SEO System (Sitemaps + Metadata + Structured Data)

## Context

I am building a time/world clock website in Next.js (App Router, v15/16). The site has
thousands of dynamic pages across multiple sections served from a Supabase database.

I need you to analyze my codebase and build a complete, production-ready system covering:
1. Programmatic sitemap generation (one file per country, per section)
2. A manual sitemap index that Google Search Console can consume
3. Canonical URLs on every dynamic page
4. JSON-LD structured data on every dynamic page
5. Optimized robots.txt for crawl budget

The goal is for Google to discover, index, and rank pages like:
  /time-now/morocco/casablanca
  /mwaqit-al-salat/saudi-arabia/riyadh
  /holidays/eid-al-fitr-2025

---

## STEP 1 — Analyze My Codebase Before Writing Anything

Read the following files FIRST. Extract the information listed under each file before
writing a single line of code:

### Files to read:

**app/sitemap.js**
- What static pages does it currently list?
- Does it use generateSitemaps() or just a default export?

**app/robots.js**
- What rules does it currently have?
- What URL does it currently point sitemap at?

**app/layout.tsx**
- Is `metadataBase` already set? If yes, what URL?
- Is there a `title.template` pattern I should preserve?

**lib/** or **utils/** directory (search for supabase client files)
- How is the Supabase client currently initialized?
- Is there already a server-only client (using service role key)?
- Is there already a client-side client (using anon key)?
- What is the exact import path used in page files?

**app/time-now/[country]/[city]/page.jsx**
- Extract: exact Supabase table name for cities
- Extract: exact column name used for city slug (URL param)
- Extract: exact column name used for country_slug (FK to countries)
- Extract: exact column name used for updated_at / last_modified (if any)
- Extract: exact column name for city display name (e.g. `name`, `city_name`)
- Extract: does it already export generateStaticParams?
- Extract: does it already export generateMetadata?
- Extract: does it call notFound() for invalid slugs?
- Extract: any SEO-relevant data fields (timezone, coordinates, population, etc.)

**app/time-now/[country]/page.jsx**
- Extract: exact Supabase table name for countries
- Extract: exact column name for country slug
- Extract: exact column name for country display name
- Extract: does it list cities? How?

**app/mwaqit-al-salat/[country]/[city]/page.jsx**
- Same extractions as time-now city page above

**app/holidays/[slug]/page.jsx**
- Extract: exact table name for holidays
- Extract: exact column name for holiday slug
- Extract: exact column name for updated_at / last_modified (if any)
- Extract: SEO-relevant fields (date, country, description, etc.)

**app/time-difference/[from]/[to]/page.jsx** (if exists)
- Does this page exist?
- How are `from` and `to` params structured?

### After reading, compile:

List every table name, column name, and import path you found.
If anything is ambiguous or missing (e.g., no `updated_at` column), state it clearly and
tell me what assumption you are making before proceeding.

---

## STEP 2 — Architecture to Build

```
/sitemap-index.xml            ← Master index (only URL you submit to Search Console)
  │
  ├── /sitemap.xml                           ← Static pages only
  ├── /holidays/sitemap.xml                  ← All holiday pages
  ├── /time-now/sitemap/[country-slug].xml   ← Country page + all its cities
  └── /mwaqit-al-salat/sitemap/[slug].xml    ← Country page + all its cities
```

**Why one file per country, not one massive file:**
- Google's limit is 50,000 URLs per sitemap file — one per country prevents ever hitting it
- Segmented sitemaps are easier to debug in Google Search Console
- If one country's data has an error, only that file fails — not the entire sitemap

**Why a manual sitemap index route:**
Next.js generates per-country sitemap files via generateSitemaps(), but does NOT
automatically create a sitemap index linking them. Google needs one URL to follow.
This route handler is the only way to expose all sitemaps to Google from a single URL.

---

## STEP 3 — Files to Create or Modify

### File A: lib/supabase-server.js (CREATE if it does not exist)

- Server-only Supabase client using `SUPABASE_SERVICE_ROLE_KEY`
- The key name must NOT start with `NEXT_PUBLIC_`
- Export a `getSupabaseServer()` singleton function
- Add a comment: "Never import this in a Client Component"
- If a server-side client already exists in the codebase, reuse it — do not create a duplicate

### File B: app/layout.tsx (MODIFY — add metadataBase if missing)

If `metadataBase` is not already set, add it to the root metadata export:
```js
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'),
  // ... preserve everything else already in the file
}
```
This is REQUIRED for canonical URLs to resolve correctly across all pages.
Do not change anything else in this file.

### File C: app/sitemap.js (REPLACE entirely)

Static/landing pages only. Rules:
- Include: /, /time-now, /mwaqit-al-salat, /holidays, /time-difference (and any other
  top-level static pages found in the app directory)
- Do NOT include dynamic pages here
- Use `lastModified: new Date('YYYY-MM-DD')` with actual fixed dates, not `new Date()`
  because `new Date()` tells Google these pages change on every crawl, wasting budget
- OMIT `changeFrequency` and `priority` entirely — Google officially ignores both fields
  (confirmed by Google Search Central). Including them adds noise without benefit.
- Set `export const revalidate = 86400`

### File D: app/time-now/sitemap.js (CREATE)

Uses Next.js `generateSitemaps()` to produce one sitemap file per country.

**Critical rules based on confirmed Google behavior:**

1. `generateSitemaps()` queries Supabase for all country slugs:
   Returns `[{ id: 'morocco' }, { id: 'france' }, ...]`

2. The default export function receives `{ id }` (country slug):
   - In Next.js 15, `id` is a Promise — MUST await it:
     `const id = props.id instanceof Promise ? await props.id : props.id`

3. Return array of URL objects containing ONLY:
   - `url`: the full absolute URL string
   - `lastModified`: taken from `updated_at` column in DB if it exists.
     If NO `updated_at` column exists, use a fixed date like `new Date('2025-01-01')`.
     DO NOT use `new Date()` — this makes Google think every city changed today,
     which wastes your entire crawl budget on recrawling unchanged pages.

4. DO NOT include `changeFrequency` or `priority` — Google ignores them.
   Other search engines (Bing, Yandex) may read them, but omitting them is cleaner.

5. Include in each country's file:
   - The country page URL: `/time-now/{country}`
   - All city URLs for that country: `/time-now/{country}/{city}`

6. Set `export const revalidate = 21600` (6 hours)

7. Handle Supabase errors: on error, log to console and return empty array.

8. The sitemap must ONLY include URLs that return real pages.
   Do not include slugs that would 404 or redirect.

### File E: app/mwaqit-al-salat/sitemap.js (CREATE)

Identical pattern to File D. Use these URLs:
- Country: `/mwaqit-al-salat/{country}`
- City: `/mwaqit-al-salat/{country}/{city}`
Set `export const revalidate = 43200` (12 hours — prayer times are stable within a day)

### File F: app/holidays/sitemap.js (CREATE)

Single sitemap for all holidays:
- URL: `/holidays/{slug}`
- `lastModified` from `updated_at` column if it exists, otherwise a fixed date
- Set `export const revalidate = 86400`
- If holidays > 45,000, use generateSitemaps() to split into alphabetical batches

### File G: app/sitemap-index.xml/route.js (CREATE — new directory)

Route Handler at path `app/sitemap-index.xml/route.js`.
This is the ONE URL you submit to Google Search Console.

Requirements:
- Export async `GET` function
- Query Supabase for all country slugs
- Build XML `<sitemapindex>` listing:
  - `{BASE_URL}/sitemap.xml`
  - `{BASE_URL}/holidays/sitemap.xml`
  - Per country: `{BASE_URL}/time-now/sitemap/{slug}.xml`
  - Per country: `{BASE_URL}/mwaqit-al-salat/sitemap/{slug}.xml`
- Return `Content-Type: application/xml; charset=utf-8`
- Return `Cache-Control: s-maxage=21600, stale-while-revalidate=86400`
- Set `export const revalidate = 21600`
- BASE_URL from `process.env.NEXT_PUBLIC_BASE_URL` — no trailing slash
- On Supabase error: return a minimal valid index with just static sitemaps, not a 500

Note: In production, per-country sitemaps are served at `/time-now/sitemap/{id}.xml`.
In development they appear at `/time-now/sitemap.xml/{id}`. The index must use the
production format since Google reads it in production.

### File H: app/robots.js (MODIFY)

Keep existing allow/disallow rules. Change only:
1. The `sitemap` field → `${BASE_URL}/sitemap-index.xml`
2. Add disallow rules for paths that waste crawl budget if not already present:
   - `/api/` (API routes have no SEO value)
   - `/_next/` (Next.js internal paths)
   - Any search/filter query parameter URLs if they exist

---

## STEP 4 — Canonical URLs on Every Dynamic Page (MODIFY existing page files)

This is the most important SEO fix beyond sitemaps.
Without canonical URLs, Google may index the wrong version of a page or treat
query-string variants as duplicates, penalizing rankings.

### In `app/time-now/[country]/[city]/page.jsx`:

Add or update the `generateMetadata` export. In Next.js 15, params is a Promise:

```js
export async function generateMetadata({ params }) {
  const { country, city } = await params  // MUST await in Next.js 15

  // Fetch city data (reuse whatever data-fetching pattern is already in this file)
  const cityData = await getCityData(country, city)

  if (!cityData) return {}

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/time-now/${country}/${city}`
  const title = `Current Time in ${cityData.name} — ${cityData.country_name}`
  const description = `What time is it in ${cityData.name}? Current local time, timezone (${cityData.timezone}), and date in ${cityData.name}, ${cityData.country_name}.`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,  // prevents duplicate indexing
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}
```

Apply the same pattern to:
- `app/time-now/[country]/page.jsx`
- `app/mwaqit-al-salat/[country]/[city]/page.jsx`
- `app/mwaqit-al-salat/[country]/page.jsx`
- `app/holidays/[slug]/page.jsx`

Use real data fields (city name, timezone, country name) from whatever DB query
already exists in each file. Match the actual column names you found in Step 1.

---

## STEP 5 — JSON-LD Structured Data on City Pages (ADD to existing page files)

This is the #2 ranking factor improvement after canonical URLs.
Pages with structured data get significantly higher CTR in search results.
Google recommends JSON-LD in server-rendered HTML (not client-side).

### In `app/time-now/[country]/[city]/page.jsx`, add this inside the page component JSX:

```jsx
// Place this as a sibling to your main content, inside the return statement
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Current Time in ${cityData.name}`,
      "description": `Local time and timezone for ${cityData.name}, ${cityData.country_name}`,
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/time-now/${country}/${city}`,
      "about": {
        "@type": "City",
        "name": cityData.name,
        "containedInPlace": {
          "@type": "Country",
          "name": cityData.country_name
        }
      },
      // Include coordinates only if they exist in your DB
      // "geo": {
      //   "@type": "GeoCoordinates",
      //   "latitude": cityData.latitude,
      //   "longitude": cityData.longitude
      // }
    })
  }}
/>
```

### Also add BreadcrumbList (helps Google show breadcrumbs in search results):

```jsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Time Now",
          "item": `${process.env.NEXT_PUBLIC_BASE_URL}/time-now`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cityData.country_name,
          "item": `${process.env.NEXT_PUBLIC_BASE_URL}/time-now/${country}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `Time in ${cityData.name}`,
          "item": `${process.env.NEXT_PUBLIC_BASE_URL}/time-now/${country}/${city}`
        }
      ]
    })
  }}
/>
```

Apply equivalent structured data to:
- `app/mwaqit-al-salat/[country]/[city]/page.jsx`
  → Use `@type: "WebPage"` with about pointing to the city, plus BreadcrumbList
- `app/holidays/[slug]/page.jsx`
  → Use `@type: "Event"` with startDate from your DB if available, else `@type: "WebPage"`

Use ONLY data that is visible on the page — do not add fields in JSON-LD that
have no corresponding visible content. Google penalizes "hidden structured data".

---

## STEP 6 — generateStaticParams for City Pages (MODIFY existing page files)

Add these exports to the TOP of (before the component):
- `app/time-now/[country]/[city]/page.jsx`
- `app/mwaqit-al-salat/[country]/[city]/page.jsx`

```js
export const dynamicParams = true   // allow on-demand render for other cities
export const revalidate = 3600      // ISR: re-render pre-built pages every 1 hour

export async function generateStaticParams() {
  // Pre-render top cities only — keeps build times fast
  // Adjust the limit or ordering based on what you have:
  //   - If you have a population/priority column, order by that DESC
  //   - If not, just take the first 500 alphabetically
  const supabase = getSupabaseServer()
  const { data: cities } = await supabase
    .from('cities')               // ← use actual table name from Step 1
    .select('slug, country_slug') // ← use actual column names from Step 1
    .limit(500)

  return (cities || []).map(c => ({
    country: c.country_slug,  // ← match [country] param name
    city: c.slug              // ← match [city] param name
  }))
}
```

Do NOT change anything else in those files — only add these three exports at the top.

---

## STEP 7 — notFound() for Invalid Slugs (VERIFY in existing page files)

Check whether each dynamic page already calls `notFound()` when the DB returns no data.
If it does NOT, add it:

```js
const cityData = await getCityData(country, city)
if (!cityData) notFound()  // returns 404, prevents soft-404s that waste crawl budget
```

This is critical. Soft 404s (pages that return 200 but show "not found" content) are one
of the biggest crawl budget killers. Google will keep recrawling them and wasting quota.

Apply to:
- app/time-now/[country]/[city]/page.jsx
- app/time-now/[country]/page.jsx
- app/mwaqit-al-salat/[country]/[city]/page.jsx
- app/mwaqit-al-salat/[country]/page.jsx
- app/holidays/[slug]/page.jsx

---

## STEP 8 — Environment Variables

Tell me which of these already exist and which I need to add:

```
NEXT_PUBLIC_BASE_URL=https://yourdomain.com       ← required for canonical URLs
SUPABASE_SERVICE_ROLE_KEY=                        ← server-only, never in NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=                         ← probably already exists
NEXT_PUBLIC_SUPABASE_ANON_KEY=                    ← probably already exists
```

---

## HARD RULES — Non-Negotiable

1. **Never use `new Date()` for `lastModified` in sitemaps.**
   Always use the `updated_at` column from the DB, or a hardcoded past date.
   `new Date()` tells Google every page changed today — this destroys your crawl budget.

2. **Never include `changeFrequency` or `priority` in sitemaps.**
   Google officially ignores both. Including them adds XML bloat and false signals.

3. **Never put placeholder values like `[city]` in sitemap URLs.**
   Every `url` field must be a real, resolved string like `/time-now/morocco/casablanca`.

4. **Never duplicate the Supabase client.**
   If a server-side client already exists, import from there.

5. **Never use the service role key in any file starting with `NEXT_PUBLIC_`.**
   It must remain server-side only (sitemap files, route handlers, server components).

6. **Always match exact DB column names found in Step 1.**
   Do not invent column names. If unsure, ask.

7. **Never add JSON-LD fields for data not visible on the page.**
   Google penalizes structured data that doesn't match visible content.

8. **In Next.js 15, always `await params`** in `generateMetadata` and page components:
   `const { country, city } = await params`
   And for generateSitemaps id:
   `const id = props.id instanceof Promise ? await props.id : props.id`

9. **Never create a `sitemap.xml/route.js` in the same directory as a `sitemap.js`.**
   They resolve to the same URL and cause a Next.js build error.
   The sitemap index lives at `app/sitemap-index.xml/route.js` — a different path entirely.

10. **Handle every Supabase query with error checking.**
    On error: log and return empty array (for sitemaps) or empty object (for metadata).
    Never let a DB error crash a sitemap file — it would make ALL those URLs disappear from Google.

---

## What to Deliver

1. All new and modified files with full, complete code — no `// TODO` or placeholder comments
2. A table of every Supabase table and column name you used
3. Every environment variable needed with current status (exists / needs adding)
4. The exact single URL to submit to Google Search Console
5. A list of files you modified and exactly what you changed in each
6. Any schema mismatches or missing columns you found during Step 1 analysis, and how you handled them

Do not explain what sitemaps or SEO are. Analyze the code first, ask if anything is
ambiguous, then write the files.