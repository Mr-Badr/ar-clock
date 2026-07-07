---
name: nextjs-guardrails
description: "Next.js 16 App Router rules. Use when creating pages, routes, layouts, error boundaries, loading states, metadata, images, fonts, or navigation. Covers: awaiting params, unstable_retry vs reset, rendering strategy selection, file conventions, environment variables. Trigger on any Next.js file change."
---

# Next.js Guardrails

## 1. App Router Is the Only Router
- This project uses the App Router exclusively — never introduce Pages Router patterns, `getServerSideProps`, `getStaticProps`, or `_app.tsx`
- Every component inside `app/` is a Server Component by default — this is intentional and must be respected
- Never add `"use client"` without a concrete reason: state, browser APIs, event-driven interactivity with hooks, or a third-party library that requires client context
- Keep the `"use client"` boundary as close to the leaf component as possible — the higher it sits in the tree, the more JavaScript ships to the browser unnecessarily

## 2. File Conventions Are Mandatory, Not Optional
- Every route segment that fetches or displays data must have both an `error.tsx` and a `loading.tsx` alongside its `page.tsx`
- A segment without `error.tsx` will render a blank white page when it crashes in production — this is guaranteed to happen eventually
- A segment without `loading.tsx` will show nothing to the user while data loads — this feels broken on slow connections
- `error.tsx` requires `"use client"` at the top — without it, the file has no effect
- `not-found.tsx` must exist at the root level minimum; add it to any dynamic segment where items can be missing
- A root `global-error.tsx` must exist as the absolute final safety net for uncaught errors in root layouts

## 3. `params` and `searchParams` Are Promises — Always Await Them
- In Next.js 15 and 16, both `params` and `searchParams` passed to page components are Promises, not plain objects
- Accessing `params.slug` without awaiting first will silently return `[object Promise]` in production with no error
- This is the single most common cause of pages rendering broken dynamic content after upgrading to Next.js 15/16
- Every dynamic page component must be an `async` function, and `params` must be destructured only after `await`
- After awaiting, validate the extracted value before using it — a slug can be empty, malformed, or undefined

## 4. Error Recovery — Use `unstable_retry`, Not Just `reset`
- In Next.js 16.2+, `error.tsx` receives both `reset` and `unstable_retry` props
- `reset()` only clears the error state and re-renders children — it does NOT re-fetch data from the server
- `unstable_retry()` calls `router.refresh()` and `reset()` together inside a `startTransition` — it actually re-fetches the data from the RSC layer
- For any error that originates from a data fetch (the most common case), use `unstable_retry()` — `reset()` alone will not fix it
- This distinction is critical: a retry button that only calls `reset()` will loop the same error forever

## 5. Rendering Strategy Must Be a Conscious Decision
- Static generation is the default goal — a statically built page is faster, cheaper, and has better SEO than a server-rendered one
- ISR (Incremental Static Regeneration) bridges the gap between static speed and fresh content — use it for content that changes but not in real-time
- Dynamic rendering is for genuinely per-request content: authenticated user data, real-time feeds, personalized pages
- Never force-dynamic a page that could be static — it wastes server resources and harms SEO by slowing response time
- Never statically generate pages with user-specific content — it will serve cached personal data to the wrong user

## 6. Parallel Data Fetching Is Required for Multi-Section Pages
- Sequential data fetching creates waterfalls — if section B waits for section A to finish before starting, total load time compounds
- In Server Components, initiate multiple fetches simultaneously using `Promise.all` where sections are independent
- Use separate Suspense boundaries per section so each renders as soon as its own data arrives
- A page that has five independent sections should not take five times longer than a page with one section

## 7. Metadata Is a First-Class Requirement
- Every page exports either a static `metadata` object or an async `generateMetadata` function
- Dynamic pages (those with params) must use `generateMetadata` to produce content-specific titles and descriptions — hardcoding the same metadata across dynamic routes is a critical SEO error
- `generateMetadata` has access to `params` and can fetch data from the same source as the page — use this to return accurate, content-matched metadata
- Never let `generateMetadata` throw or fail silently — wrap its data fetching in a try/catch and return sensible fallback metadata
- `metadataBase` must be set in the root layout — without it, Open Graph image URLs are relative and render as broken in social shares

## 8. Image Rules
- Never use `<img>` — always use the Next.js `Image` component with explicit `width` and `height`
- Undefined image dimensions cause layout shift (CLS), which is a Core Web Vitals violation and a ranking signal
- Use `priority` on the single largest above-the-fold image per page — this preloads it and directly improves LCP
- All `alt` attributes on Arabic pages must be written in Arabic and describe the image content meaningfully
- Never load a large source image to display it at a small rendered size — sizes must be close to the displayed size

## 9. Navigation Rules
- Never use `<a>` tags for internal links — always use Next.js `Link`
- Internal links using `<a>` perform full page reloads, destroy the cache, and break the client-side navigation model
- For external links that open in a new tab, add `rel="noopener noreferrer"` — missing this is a security vulnerability

## 10. Fonts
- Load Arabic fonts using `next/font/google` at the root layout — never `@import` in CSS, never a `<link>` tag in `<head>`
- The Arabic font must include the `arabic` subset explicitly — without it, Arabic characters fall back to a system font that renders poorly
- Always use `display: "swap"` to prevent invisible text during font load (FOIT)
- Never letter-space Arabic text — Arabic is a connected script and added letter spacing breaks character connections visually

## 11. Environment Variables
- Never hardcode secrets, API URLs, or configuration values in code
- Variables exposed to the browser must start with `NEXT_PUBLIC_` — all others are server-only
- Validate required environment variables at startup — a missing variable must fail loudly at build time, not crash silently at runtime on a specific page

## 12. What Must Never Happen
- A production page that renders blank white with no visible feedback to the user
- A dynamic route showing `[object Promise]` because `params` was not awaited
- A page with no `<title>` in the browser tab
- An image without an `alt` attribute
- A fetch call with no error handling and no loading state
- An internal navigation that triggers a full page reload
- A `"use client"` added to a layout or page that wraps many components unnecessarily