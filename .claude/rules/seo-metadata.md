---
paths:
  - src/lib/seo/**
  - src/lib/holidays/metadata.js
  - src/lib/holidays/page-model.js
  - src/app/**/page.*
  - src/app/**/layout.*
  - scripts/seo-audit.ts
  - scripts/validate-seo-architecture.ts
  - scripts/audit-rendered-seo.ts
---

# SEO and Metadata Rules

## Non-negotiable metadata requirements
Every public page MUST have:
- Unique `<title>` (20-80 chars) — a user promise, not a keyword list
- Unique `metaDescription` (90-175 chars) — natural Arabic, direct answer intent
- Canonical URL using `https://miqatona.com` (never localhost, www, or Vercel domain)
- Open Graph block (og:title, og:description, og:url, og:image)
- Exactly ONE `<h1>` per page — server-rendered, not client-only
- JSON-LD structured data via `src/components/seo/JsonLd.tsx` (shared renderer — never create one-off schema helpers)

## Never remove existing SEO metadata — only extend or improve it

## Sitemap rules
- No `force-dynamic` in sitemap routes
- No `new Date().toISOString()` churn in sitemaps (use build-time dates or omit `lastmod`)
- Only canonical 200 URLs in sitemaps — no placeholder dynamic URLs
- Drafted holiday pages stay out of sitemap
- `noindex,follow` for historical/future date pages outside the ±370 day window

## Validation commands
```bash
npm run seo:validate            # gates the build — run before committing
npm run seo:audit:rendered      # post-build rendered HTML audit
npm run ads:readiness           # Google Ads landing page simulation
```

## SEO content must be server-rendered
- All copy, FAQs, JSON-LD schemas, meta tags, and H1/H2 must be in Server Components
- Client Components only for: live clocks, interactive forms, calculators, user-triggered UI
- If a Client Component shows data from JSON, keep an SSR equivalent for crawlers

## Canonical host guard
`getSiteUrl()` in `src/lib/site-config.js` enforces `https://miqatona.com`. Never hardcode URLs.

## Title composition patterns (from page-model.js)
- Holiday pages: `كم باقي على {eventName}` + year context
- City time pages: `الوقت الآن في {cityName}` 
- Prayer pages: `مواقيت الصلاة في {cityName}`
- Calculator pages: tool name as direct promise, not generic label