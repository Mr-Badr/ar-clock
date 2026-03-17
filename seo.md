# Full SEO Audit & Implementation — Arabic Next.js App

## Who you are reading this

You are a senior SEO engineer and Next.js expert. Your job is to audit every file
in this codebase and apply every SEO improvement needed to rank #1 on Google.
This is an Arabic-language world clock / time website built with Next.js (App Router),
Tailwind CSS, and shadcn/ui, backed by Supabase.

You do not explain theory. You read the code, identify every gap, and fix it.

---

## Phase 0 — Read Before You Touch Anything

Before changing a single file, read and understand:

- `app/layout.tsx` — root metadata, fonts, html attributes
- `app/page.jsx` — homepage structure
- `app/robots.js` — current crawl rules
- `app/sitemap.js` — current sitemap setup
- Every `page.jsx` inside dynamic routes: `time-now/[country]/[city]`,
  `mwaqit-al-salat/[country]/[city]`, `holidays/[slug]`, `time-difference/[from]/[to]`
- Every `loading.jsx`, `not-found.jsx`, `error.jsx` if they exist
- `next.config.js` or `next.config.ts` — image domains, headers, redirects
- Any font imports across the entire codebase
- Any `<Image>` or `<img>` usage across the entire codebase
- Any `<Link>` internal linking patterns on section and city pages

From this reading, build a full picture before writing anything. Ask if anything is
ambiguous. Then fix everything below, in order.

---

## Area 1 — HTML Foundation (Root Layout)

### 1.1 Language and direction attributes

Check `<html>` tag in `app/layout.tsx`. It must have BOTH attributes:
```html
<html lang="ar" dir="rtl">
```
- `lang="ar"` tells Google this is Arabic content — without it, Google may classify
  your pages as unknown language and rank them lower for Arabic queries
- `dir="rtl"` is mandatory for Arabic RTL SEO and user experience

If the site has any English pages (e.g. an English version), those pages need
`lang="en" dir="ltr"` on their specific layout, not the root.

### 1.2 metadataBase

In the root metadata export, `metadataBase` must be set:
```js
metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL)
```
Without this, all canonical URLs and Open Graph URLs resolve to relative paths,
which makes them invalid. This is the most common Next.js SEO bug.

### 1.3 Default title template

Set a title template so every page gets a consistent suffix:
```js
title: {
  default: 'اسم الموقع',
  template: '%s | اسم الموقع'
}
```
This means a page with `title: 'الوقت في الرباط'` renders as
`الوقت في الرباط | اسم الموقع` in search results.

### 1.4 Font loading

Check how Arabic fonts are loaded. If they use a `<link>` tag or `@import` in CSS:
REPLACE with `next/font`. Reasons:
- `next/font` self-hosts the font — zero external DNS lookup, faster LCP
- It auto-generates `font-display: swap` — no invisible text during load (CLS fix)
- It generates fallback font metrics that prevent layout shift when the font loads

For Arabic, use `Noto Kufi Arabic`, `Almarai`, or `Cairo` — these render properly
in RTL and have full Unicode Arabic coverage. Confirm the font actually used in the
design and migrate it to `next/font/google`.

If the font is already using `next/font`, verify `display: 'swap'` is set.

### 1.5 Viewport and theme-color meta

Verify the root layout has:
```html
<meta name="theme-color" content="#..." />
```
This is a minor signal but affects mobile SERP appearance.

---

## Area 2 — Every Dynamic Page: Metadata & Canonical

For each of these pages, run the full checklist below:
- `app/time-now/[country]/page.jsx`
- `app/time-now/[country]/[city]/page.jsx`
- `app/mwaqit-al-salat/[country]/page.jsx`
- `app/mwaqit-al-salat/[country]/[city]/page.jsx`
- `app/holidays/[slug]/page.jsx`
- `app/time-difference/[from]/[to]/page.jsx`

### 2.1 generateMetadata must exist on every page

If a page doesn't have `generateMetadata`, Google uses whatever text it finds first on
the page — usually navigation text — as the title. This destroys your CTR.

Every `generateMetadata` must:

**In Next.js 15, params is a Promise — always await it:**
```js
export async function generateMetadata({ params }) {
  const { country, city } = await params
  ...
}
```

**Include ALL of these fields:**
```js
return {
  title: '...',          // unique per page, contains the city/country name + intent
  description: '...',   // 140-160 chars, answers what the page contains
  alternates: {
    canonical: `${BASE_URL}/time-now/${country}/${city}`,
  },
  openGraph: {
    title: '...',
    description: '...',
    url: `${BASE_URL}/time-now/${country}/${city}`,
    type: 'website',
    locale: 'ar_MA',     // or ar_SA, ar_AE depending on primary target market
    siteName: 'اسم الموقع',
  },
  twitter: {
    card: 'summary',
    title: '...',
    description: '...',
  },
}
```

### 2.2 Title formulas — write these exactly

These must be in Arabic, contain the primary keyword first, and be under 60 characters:

| Page | Title formula |
|---|---|
| `/time-now/[country]/[city]` | `الوقت الآن في [اسم المدينة] - التوقيت الرسمي` |
| `/time-now/[country]` | `الوقت الآن في [اسم البلد] - المدن والمناطق` |
| `/mwaqit-al-salat/[country]/[city]` | `مواقيت الصلاة في [اسم المدينة] اليوم` |
| `/holidays/[slug]` | `[اسم العيد أو الإجازة] [السنة] - التاريخ والمعلومات` |
| `/time-difference/[from]/[to]` | `فرق التوقيت بين [مدينة] و[مدينة]` |

The primary keyword must be the FIRST word in the title. Google weights earlier words
more heavily in Arabic titles.

### 2.3 Description formulas

Descriptions must:
- Contain the main keyword naturally within the first 20 words
- Answer the user's question directly ("اعرف التوقيت الآن، الفرق مع GMT، والتاريخ")
- Be 140-160 characters (Arabic characters count differently — check actual char length)
- NOT repeat the title word for word

### 2.4 Canonical URL rules

- Canonical must be an absolute URL: `https://miqatime.com/time-now/morocco/casablanca`
- Never a relative URL, never with a trailing slash unless that's your URL format
- If a page has both `/time-now/morocco/casablanca` and `/time-now/morocco/Casablanca`,
  only one canonical is correct. Normalize all slugs to lowercase in the DB and routes.

### 2.5 notFound() for missing data

Every dynamic page must call `notFound()` when the DB returns no result.
Soft 404s (page returns 200 but says "not found") destroy crawl budget.
Check this in every `page.jsx` that queries Supabase.

---

## Area 3 — JSON-LD Structured Data

Add JSON-LD to every dynamic page. It must be server-rendered (in the Server Component,
not in a client component) using:
```jsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({...}) }} />
```

Only include fields that have visible content on the page. Google penalizes JSON-LD
that contains data not visible to users.

### 3.1 City time pages: WebPage + City + BreadcrumbList

Three separate `<script>` tags:

**WebPage schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "الوقت الآن في [المدينة]",
  "description": "...",
  "url": "https://miqatime.com/time-now/[country]/[city]",
  "inLanguage": "ar",
  "about": {
    "@type": "City",
    "name": "[اسم المدينة بالعربية]",
    "containedInPlace": {
      "@type": "Country",
      "name": "[اسم الدولة بالعربية]"
    }
  }
}
```

**BreadcrumbList schema** (makes breadcrumbs appear in search results):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://miqatime.com" },
    { "@type": "ListItem", "position": 2, "name": "الوقت الآن", "item": "https://miqatime.com/time-now" },
    { "@type": "ListItem", "position": 3, "name": "[البلد]", "item": "https://miqatime.com/time-now/[country]" },
    { "@type": "ListItem", "position": 4, "name": "[المدينة]", "item": "https://miqatime.com/time-now/[country]/[city]" }
  ]
}
```

### 3.2 Prayer times pages: WebPage + City + BreadcrumbList

Same structure as above. Add if visible on page:
```json
"about": {
  "@type": "City",
  "name": "[المدينة]",
  "containedInPlace": { "@type": "Country", "name": "[الدولة]" }
}
```
Do NOT add Event schema unless the page shows a specific prayer event with start/end time.

### 3.3 Holidays pages: Event schema

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "[اسم العيد]",
  "startDate": "[YYYY-MM-DD from DB]",
  "description": "...",
  "inLanguage": "ar",
  "location": {
    "@type": "Country",
    "name": "[الدولة]"
  },
  "eventStatus": "https://schema.org/EventScheduled"
}
```
Only add this if `startDate` is actually fetched from DB and shown on the page.

### 3.4 Homepage: WebSite schema + Sitelinks Searchbox

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "[اسم الموقع]",
  "url": "https://miqatime.com",
  "inLanguage": "ar",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://miqatime.com/time-now/{search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
This enables Google to show a search box directly in your sitelinks in search results.

---

## Area 4 — Core Web Vitals (LCP, INP, CLS)

These are a direct Google ranking factor. Every point below is a confirmed fix.

### 4.1 Images — every single one

Audit every `<img>` and `<Image>` in the codebase. Rules:

- Every image must use `next/image`, never bare `<img>` tags
- Every `next/image` must have explicit `width` and `height` (prevents CLS)
- The most important image on the page (hero, clock icon, map) must have `priority` prop
  — this tells the browser to preload it, directly improving LCP score
- Use `sizes` prop for responsive images: `sizes="(max-width: 768px) 100vw, 50vw"`
- No images larger than needed. A 2000px image displayed at 400px wastes 5x bandwidth
- SVG icons that are purely decorative should NOT be `<Image>` — they can be inline SVG
  or background CSS, which loads faster

Confirm `next.config.js` has image optimization enabled (it is by default — just make
sure it hasn't been disabled).

### 4.2 Third-party scripts

Find every `<script>` tag and `<Script>` component in the codebase. Rules:

- Google Analytics / Tag Manager: must use `<Script strategy="afterInteractive">` — never
  in `<head>` directly, which blocks rendering
- Any chat widget, support tool, social embed: `strategy="lazyOnload"`
- No script may use default strategy unless it's critical for above-the-fold rendering

### 4.3 Client components

Find every `'use client'` directive. For each one, ask:
- Does this component need to be a client component?
- If it only shows data from the server, it should be a Server Component

Excessive client components increase the JavaScript bundle sent to the browser,
directly increasing INP (Interaction to Next Paint) score.

Specifically check: is the clock display component (`'use client'`) doing heavy work
on every tick? If yes, it must use `requestAnimationFrame` or a minimal interval pattern,
not a `setInterval` that runs expensive re-renders every second.

### 4.4 CLS — Layout shift prevention

Find every place where content appears after page load:
- Search results dropdown
- City search autocomplete
- Any loading skeleton that's a different height than the loaded content
- Any font that causes text to reflow when it loads (fixed by `font-display: swap` in
  `next/font` — check this)
- Any dynamic content (ads, banners) that doesn't have a reserved container size

For every case: give the container a fixed `min-height` or `aspect-ratio` before content loads.

### 4.5 CSS loading

Check if there are large CSS files imported globally. Tailwind generates minimal CSS by
default — verify `content` paths in `tailwind.config.js` are not accidentally scanning
`node_modules` or generating unused utilities.

---

## Area 5 — Internal Linking Architecture

This is the single most impactful thing for getting thousands of city pages indexed
and ranked. Sitemaps tell Google pages exist. Internal links tell Google they matter.

### 5.1 The hub-and-spoke model

Every section must follow this exact structure:

```
Homepage
  └── /time-now (hub)
        ├── /time-now/morocco (spoke = hub for its cities)
        │     ├── /time-now/morocco/casablanca
        │     ├── /time-now/morocco/rabat
        │     └── /time-now/morocco/fes
        ├── /time-now/france
        └── ...
```

Audit the actual rendered HTML of these pages. Verify:

**`/time-now` (section index):**
Must render a visible list of ALL countries with `<a href="/time-now/[slug]">` links.
No JavaScript-only rendering — links must be in the server-rendered HTML.

**`/time-now/[country]` (country page):**
Must render a visible list of ALL cities in that country with `<a href="/time-now/[country]/[city]">` links.

**`/time-now/[country]/[city]` (city page):**
Must link back to:
- Its country page: `<a href="/time-now/[country]">الوقت في [البلد]</a>`
- At least 5 nearby or related cities with real anchor text
- The same city in other sections: prayer times, time difference

If any of these links are missing or rendered client-side only, this is a critical SEO
defect — fix it immediately.

### 5.2 Anchor text must be descriptive

Change any generic links like "اضغط هنا" or "عرض المزيد" to descriptive Arabic text:
- ✅ `الوقت الآن في الرباط`
- ✅ `مواقيت الصلاة في الدار البيضاء`
- ❌ `عرض المزيد`
- ❌ `اضغط هنا`

### 5.3 Cross-section linking

On a city time page, link to the same city's prayer times page and vice versa.
This creates topical clusters:
```
/time-now/morocco/casablanca  ←→  /mwaqit-al-salat/morocco/casablanca
```
This signals to Google that your site is the authority on everything related to that city.

### 5.4 Verify links are crawlable

Check that navigation links, city lists, and country lists are:
- In the server-rendered HTML (check with "view page source", not DevTools)
- Using `<a>` tags with `href` — not `<button onClick>` or `<div onClick>`
- Not behind a modal or tab that requires JavaScript interaction to reveal

---

## Area 6 — Arabic-Specific SEO

### 6.1 Content language

Check every page title, description, heading (H1, H2), and body text.
It must be written in Modern Standard Arabic (فصحى), not transliterated Latin.
Machine translation is not acceptable — Google detects it and ranks it lower.

Verify:
- No Arabic content is generated by a simple translate() call without human review
- H1 on every page contains an Arabic keyword phrase, not just a time component (clock)
- Meta descriptions answer a real Arabic search query

### 6.2 Arabic search intent alignment

Your city time pages must target these exact Arabic search patterns:
- `الوقت الآن في [المدينة]` — most searched
- `كم الساعة في [المدينة]` — alternative phrasing
- `توقيت [المدينة]` — short form

H1 should contain at least one of these. The others can appear in subheadings or body.
Do NOT only use the English translation — Arabic searchers use Arabic queries.

### 6.3 RTL layout verification

Check in the rendered HTML:
- `dir="rtl"` on the root `<html>` tag
- No hardcoded `text-align: left` overrides in CSS that break Arabic reading flow
- No `margin-left` or `padding-left` utilities that should be `margin-right`/`padding-right`
  in RTL context — use Tailwind's logical properties (`ms-`, `me-`, `ps-`, `pe-`) instead
- Number display: Arabic numerals (٠١٢٣) or Western (0123)? Confirm which the target
  audience expects. In the Maghreb (Morocco, Algeria, Tunisia), Western numerals (0-9) are
  standard. In the Gulf (Saudi, UAE), Arabic-Indic numerals (٠-٩) are often preferred.

### 6.4 hreflang (if you have English pages)

If ANY page has an English version:
```html
<link rel="alternate" hreflang="ar" href="https://miqatime.com/time-now/morocco/casablanca" />
<link rel="alternate" hreflang="en" href="https://miqatime.com/en/time-now/morocco/casablanca" />
<link rel="alternate" hreflang="x-default" href="https://miqatime.com/time-now/morocco/casablanca" />
```
This prevents duplicate content issues and routes Arabic users to Arabic pages.

If the site is Arabic-only, `hreflang` is not needed — but verify there are no English
pages accidentally being indexed without it.

---

## Area 7 — robots.js and Crawl Budget

Rewrite `app/robots.js` with these exact rules:

```js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',          // API routes have no SEO value
          '/_next/',        // Next.js internals
          '/admin/',        // Admin if exists
          '/*?*',           // Block all query string URLs
                            // (prevents ?page=2 or ?sort=name from being indexed
                            //  as duplicates of the canonical page)
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap-index.xml`,
  }
}
```

Blocking `/*?*` is critical for programmatic SEO sites — if your search/filter
components add query params to the URL, Google will index thousands of duplicate
pages and split your ranking signals.

---

## Area 8 — Page Content Depth (E-E-A-T Signals)

Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) affects
how well programmatic pages rank. Check this on every city page:

### 8.1 Thin content audit

A page that shows only a clock is thin content and will not rank.
Each city time page must render AT LEAST:
- Current time and date (obviously)
- Timezone name (e.g. Africa/Casablanca) and UTC offset (GMT+1)
- Time difference to 3-5 major world capitals
- Day/night indicator with sunrise/sunset if available in DB
- A brief paragraph in Arabic about the city's timezone context (1-2 sentences is enough)
- Links to related cities (internal links = content depth signal)

If any of this data exists in Supabase but isn't being displayed on the page, add it.

### 8.2 Unique value per page

Programmatic pages rank when they provide data that can't be found elsewhere in one place.
Verify each page template isn't identical to competitors by checking:
- Does the page have a time converter tool specific to that city?
- Does it show DST (daylight saving time) transitions if the city observes them?
- Does it link to the prayer times page for the same city?

### 8.3 Update time signal

If you have an `updated_at` column in Supabase, pass it into:
- The `lastModified` field in sitemaps (NOT `new Date()`)
- A visible `<time>` element on the page if the content is dynamic

---

## Area 9 — Open Graph and Social Sharing

Check `app/time-now/[country]/[city]/opengraph-image.jsx` if it exists.
If it doesn't exist, create it. The file generates a custom OG image per city page.

A proper OG image:
- Displays the city name in Arabic, large and centered
- Shows the current time or timezone offset
- Uses your brand colors
- Is 1200x630px (Twitter/LinkedIn/Facebook standard)

Without custom OG images, when someone shares a city page on WhatsApp or Twitter,
the preview shows a blank or generic image — this kills social traffic.

---

## Area 10 — next.config.js Headers for SEO

Add these HTTP headers in `next.config.js` if not present:

```js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'index, follow',
        },
      ],
    },
    {
      // Cache static assets aggressively — improves LCP on repeat visits
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

---

## Area 11 — Final Verification Checklist

After all changes, verify the following by reading the actual rendered HTML
(not just the source code — check what Next.js actually outputs):

- [ ] `<html lang="ar" dir="rtl">` is in the rendered HTML
- [ ] `<link rel="canonical" href="...">` exists on every dynamic page
- [ ] `<title>` on every page is unique and contains an Arabic keyword
- [ ] `<meta name="description">` on every page is unique and under 160 chars
- [ ] `<script type="application/ld+json">` exists on every city page
- [ ] No page returns 200 with empty or "not found" content (soft 404s)
- [ ] `/sitemap-index.xml` returns valid XML with real country URLs
- [ ] `/robots.txt` contains `Sitemap: https://miqatime.com/sitemap-index.xml`
- [ ] Country pages contain visible `<a>` links to all city pages
- [ ] City pages contain visible `<a>` links back to the country page
- [ ] No `<img>` tags without `width` and `height` attributes (CLS)
- [ ] The primary above-the-fold image has `priority` prop (LCP)
- [ ] Arabic font is loaded via `next/font` with `display: 'swap'`
- [ ] All analytics scripts use `<Script strategy="afterInteractive">` (INP)
- [ ] `notFound()` is called in every dynamic page when DB returns null

---

## Delivery Format

For each area you work on:
1. State what you found (what was wrong or missing)
2. State what you changed and in which file
3. If you can't implement something without more information (e.g. DB schema,
   actual Arabic city names), tell me what you need instead of guessing

Do not add placeholder comments like `// TODO`. Either implement it fully or
flag it as needing clarification. No partial work.