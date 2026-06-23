---
paths:
  - src/app/**
  - src/components/**
  - next.config.js
---

# Next.js App Router Rules

## Server vs Client boundary
- Default: Server Component. Add `"use client"` only for: live state, forms, event handlers, browser-only APIs, interactive calculators
- Never add `"use client"` to layouts or page wrappers without concrete reason
- SEO-critical content (H1, meta, JSON-LD, FAQs, first answer) must be in Server Components

## Params and searchParams
- Always `await params` and `await searchParams` before accessing — they are Promises in Next.js 16
- Validate route params against expected shapes before use (`src/lib/route-param-validation.ts`)

## Error handling
- Every route has `error.tsx` + `loading.tsx` siblings
- In `error.tsx`: use `unstable_retry()` for data-fetch errors, not `reset()` alone
- Never let one section failure bring down the whole page — isolate with error boundaries

## SSR and caching strategy
- Hot public pages (homepage, time-now, prayer, holidays): NO `headers()`, no IP lookup, no per-request geo in server HTML
- Personalized hints: client-only islands using browser timezone or explicit user action
- Cache headers: HTML pages use `s-maxage=86400, stale-while-revalidate=3600`
- Sitemaps: `s-maxage=86400, stale-while-revalidate=86400`

## Redirects
- Legacy guide paths (`/guide/*`, `/guides/*`) redirect to `/blog/*` — configured in `next.config.js`
- `/map` redirects to `/fahras`
- `www.miqatona.com` → `miqatona.com` (Nginx level, not Next.js)

## Build gates
`npm run build` runs: `events:build` → `prisma:generate` → `seo:validate` → `next build` → `seo:audit:rendered`
A failing `seo:validate` blocks the build — fix SEO warnings before assuming build issues.

## Prerendering
- Country/city seed prerendering: `getPriorityCountrySlugs(24)` and `getPriorityCityParams(24)`
- Date pages: rolling ±370 day window prerendered; outside window renders on-demand with `noindex,follow`
- Holiday pages: published events only — drafted events are excluded from sitemap and prerender