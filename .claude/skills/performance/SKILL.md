---
name: performance
description: "Page speed and Core Web Vitals optimization. Use when optimizing LCP, CLS, or INP, improving image loading, choosing rendering strategy, managing JavaScript bundles, loading fonts, or reviewing performance after a deploy. Covers: CWV targets, static vs dynamic trade-offs, INP, font loading, bundle size."
---

# Performance Rules

## 1. Performance Directly Determines Revenue
- Google data: a 1-second delay in mobile load time reduces conversions by up to 20%
- Pages loading in 1 second have 3x higher conversion rates than pages loading in 5 seconds
- Over 50% of mobile visitors abandon a page that takes more than 3 seconds to show content
- For Arabic-market apps where 85%+ of users are on mobile, performance is the single highest-leverage improvement available
- Poor Core Web Vitals directly lower organic ranking — a slow page with great content ranks below a fast page with comparable content

## 2. Core Web Vitals — The Three Targets
- **LCP (Largest Contentful Paint)**: must be under 2.5 seconds — this measures how long until the main visible content appears
- **CLS (Cumulative Layout Shift)**: must be under 0.1 — measures how much content visually shifts after first rendering
- **INP (Interaction to Next Paint)**: must be under 200ms — INP replaced FID in March 2024 and measures responsiveness to all interactions, not just the first one; 43% of sites currently fail the 200ms threshold
- These thresholds are Google's "Good" range — below them qualifies for green Core Web Vitals indicators in Search Console
- Measure with **field data** from Google Search Console (CrUX data) — lab tools like Lighthouse measure under ideal conditions and overstate real-world performance

## 3. Static Generation as the Default
- A statically generated page served from a CDN edge is always faster than a server-rendered page served from an origin
- Make the question explicit before building any page: does this page need to be dynamic, or can it be static?
- The majority of pages in most apps are the same for all users — they must be static
- ISR allows static pages to stay fresh — use it for content that changes but does not require real-time accuracy
- Dynamic rendering is justified only for: authenticated user data, real-time prices, personalized content, or any content that genuinely differs per user per request
- An accidentally dynamic page (caused by reading `cookies()` or `headers()` in a Server Component on a page that could be static) wastes server resources and increases response time for every visitor

## 4. LCP Optimization — Highest Priority
- The LCP element is almost always the hero image or the largest heading — identify it precisely on every page
- Add `priority` to the `Image` component for the LCP image — this triggers a `<link rel="preload">` in the document head
- Never lazy-load the LCP image — lazy loading delays exactly the image that needs to be fastest
- The LCP image must be served in WebP or AVIF format — JPEG and PNG are significantly larger for the same visual quality
- Preconnect to the origin that serves the LCP image if it is on a CDN — this removes DNS lookup time from the critical path
- Large hero images are the #1 cause of slow mobile LCP for Arabic apps — audit hero image file sizes aggressively

## 5. CLS Elimination
- Every image on the page must have explicit `width` and `height` attributes — without these, the browser cannot reserve space before the image loads and the layout shifts
- Arabic fonts must use `font-display: swap` — without it, text is invisible until the font file downloads (FOIT), and then a flash of restyled text causes CLS
- Never inject content above existing content after page load — ads, banners, and cookie notices that push down the page content are major CLS sources
- Skeleton loaders must match the shape of the content they represent — a skeleton that is 200px tall for content that is actually 350px tall causes a shift when real content arrives
- Avoid CSS animations that affect layout properties (`width`, `height`, `margin`, `padding`) — use `transform` instead, which does not trigger layout

## 6. INP Optimization
- INP measures the time from any user interaction to the next paint — every button click, input keystroke, and toggle is measured
- Long JavaScript tasks on the main thread block INP — break up heavy computations with `setTimeout` or move them to a Web Worker
- Avoid heavy state updates in response to frequent events like scroll and resize — debounce them
- Never do synchronous, heavy work in a click handler — it blocks the browser from painting the response
- Third-party scripts (analytics, chat, ad scripts) executing on the main thread are a major INP offender — load them after the page is interactive using `next/script` with `strategy="lazyOnload"`

## 7. Image Optimization Rules
- All images must be served in WebP or AVIF — these formats are 25–35% smaller than JPEG at equivalent quality
- The image rendered at 300px wide must not be served at 1200px wide — always serve images at the appropriate size for each viewport
- Use the Next.js `Image` component's `sizes` prop to declare the image's rendered size at different viewport widths — this enables the browser to download the correctly-sized variant
- Lazy-load all images below the fold — loading them immediately wastes bandwidth that could be used for above-fold content
- Never host images on a slow origin — use a CDN or the built-in Next.js image optimization service

## 8. Font Loading
- Load Arabic fonts using `next/font/google` — this automatically optimizes font loading, removes external network requests, and sets correct `font-display` values
- Load fonts only at the root layout level — never re-import the same font in a nested layout or page
- Load only the font weights you actually use — each unused weight is an unnecessary network request
- Arabic fonts can be significantly larger than Latin fonts because of the extensive Unicode character range — prefer variable fonts when available
- Preload the primary Arabic font variant (the weight used for body text) — it appears on every page and delays LCP when it loads late

## 9. JavaScript Bundle Management
- Every `"use client"` component ships JavaScript to the browser — unnecessary client components silently inflate the bundle
- Never import an entire library when you only need one function — this is the most common cause of oversized bundles
- Lazy-load heavy Client Components that are not needed on initial paint using `next/dynamic`
- Audit the bundle size after adding any new dependency — use `@next/bundle-analyzer` to identify large contributors
- Third-party scripts (Google Tag Manager, Meta Pixel, chat widgets) are often larger and slower than first-party code — load them last, never in the document `<head>`

## 10. Testing Performance
- Test on a real Android device on a real 4G connection — this represents the median Arabic mobile user
- Lighthouse is a lab test on a powerful machine — it is useful for identifying issues but not for measuring real-user experience
- Google Search Console Core Web Vitals report shows real field data — this is the authoritative source
- Test performance after every major deploy — new features routinely introduce performance regressions
- If a change increases page weight, increases the number of requests, or introduces a new synchronous script — measure the performance impact before merging