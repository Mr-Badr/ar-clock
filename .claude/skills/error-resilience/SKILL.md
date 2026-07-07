---
name: error-resilience
description: "Prevent blank pages and silent crashes in production. Use when adding error.tsx, loading.tsx, not-found.tsx, Suspense boundaries, empty states, or any component that fetches data. Covers: error boundary hierarchy, unstable_retry, skeleton loaders, notFound(), form error handling, monitoring."
---

# Error Resilience

## 1. The Blank Page Is the Enemy
- A blank white page is the worst possible production state — it is worse than an error message, worse than a slow page, worse than an empty state
- It gives the user no information, no recovery path, and no reason to stay — they leave immediately and do not come back
- It tanks Core Web Vitals, destroys session metrics, and signals poor quality to Google
- Every architectural decision in this skill exists to ensure a blank page is impossible

## 2. The Error Boundary Hierarchy
- Error boundaries catch errors at different levels of granularity — place them at multiple levels, not just the root
- `app/global-error.tsx` is the absolute final safety net — it catches errors in the root layout itself, which `error.tsx` cannot catch
- `app/error.tsx` catches errors in all route segments that do not have their own `error.tsx`
- Route-segment `error.tsx` (e.g., `app/articles/error.tsx`) catches errors only within that segment — it is the most granular and most preferred
- Component-level `unstable_catchError` (Next.js 16.2+) catches errors at the individual component level without requiring a route boundary
- The strategy: place segment-level `error.tsx` files wherever data is fetched, and use component-level boundaries for independently-loaded sub-sections

## 3. `error.tsx` Requirements
- `error.tsx` files MUST have `"use client"` at the top — without it, the file is silently ignored and errors propagate to a blank page
- In Next.js 16.2+, prefer `unstable_retry()` over `reset()` for the retry button
- `reset()` only clears the React error state — it does NOT re-fetch data from the server
- `unstable_retry()` calls `router.refresh()` AND `reset()` inside a transition — it actually re-fetches server data and re-renders the segment
- Using `reset()` alone for a data-fetch error creates an infinite error loop that the user cannot escape

## 4. Loading States Are Mandatory
- `loading.tsx` must exist alongside every `page.tsx` that fetches data
- Next.js automatically wraps the page in a Suspense boundary when `loading.tsx` is present
- Without `loading.tsx`, the server holds the response until all data is fetched and streams nothing to the browser — the user sees a blank white page for the entire duration of the fetch
- Skeleton loaders must structurally resemble the real content — same number of cards, same approximate heights, same layout regions
- A generic spinner on a white background is not a loading state — it tells the user nothing about what is coming and causes a jarring layout shift when content arrives

## 5. Suspense Boundaries for Isolated Sections
- Independent sections of a page that each fetch their own data must each be wrapped in their own Suspense boundary
- Without isolated Suspense boundaries, the slowest data fetch on the page blocks the entire page from rendering
- A page with five sections each wrapped in Suspense begins rendering immediately and streams each section as its data arrives
- The fallback for each Suspense boundary must be a skeleton that matches the shape of that specific section
- Suspense boundaries also isolate failures — if one section's data fetch fails, the other sections still render successfully

## 6. Empty States Are Designed, Not Absent
- An empty state is a valid UI state that requires the same design attention as a loaded state
- An empty list, empty search result, or empty category must display an illustration or meaningful icon, a clear heading in Arabic, and an actionable suggestion
- Different empty states for different reasons: "you haven't created any items yet" needs a different message and CTA than "no results match your search"
- Never render nothing when data is empty — a blank section with no explanation is indistinguishable from a broken page

## 7. `notFound()` Instead of Empty Renders
- When a dynamic page cannot find the resource it was asked to display, call `notFound()` immediately
- `notFound()` renders the nearest `not-found.tsx` — which is designed, branded, and helpful
- Rendering an empty shell page (no content, no error, no explanation) is worse than a 404 — search engines may index the empty shell and waste crawl budget

## 8. Not Found Pages Must Be Designed
- `not-found.tsx` must exist at the root level at minimum
- The custom 404 page must include the site header or at minimum a logo link to the homepage
- It must explain in Arabic that the page was not found and offer 2–3 navigation options
- It must not look like a system error page — it must feel like part of the product
- Add the 404 page to the sitemap exclusion list — it must have `noindex` in its metadata

## 9. Network Failures Must Produce Visible Responses
- Every fetch call on a rendering path must have explicit failure handling
- Network failures are not rare events — they happen on mobile connections constantly
- A fetch failure must produce a visible, Arabic-language message that tells the user what happened and what they can do
- Provide a retry mechanism wherever the content is important enough to warrant it
- Distinguish between temporary failures (retry makes sense) and permanent ones (go back or contact support makes sense)
- Never silently swallow a fetch error and render nothing — silence is the worst error state

## 10. Form Errors Must Never Lose User Data
- If a form submission fails for any reason (network error, validation error, server error), the user's input must be preserved
- Clearing a form on submission failure and making the user re-enter everything is a major UX failure and a conversion killer
- Validation errors must appear inline, next to the relevant field, in Arabic, explaining specifically what is wrong and what the correct format is
- Global form errors (the entire submission failed) must appear at the top of the form, in Arabic, with a specific explanation and a retry option
- Never show a generic "something went wrong" message for a form — users need to know whether they should try again or do something differently

## 11. Error Monitoring Is Required
- Errors displayed to users must also be logged — the error boundary is the catch point, the logger is the reporting tool
- Every error log must include: which segment or component failed, what the error message was, what the user's likely state was
- Monitor error rate by route in production — a spike in errors on a specific page signals a production regression
- Never discover production errors through user complaints — instrument the app to detect and alert before users are affected

## 12. Degraded Experience Is Better Than No Experience
- If a page has 5 sections and one fails, render 4 sections and show an error state only in the failed section
- If the featured content fails to load, show the secondary content — never show nothing because the best content is unavailable
- If an image fails to load, show the `alt` text in a styled fallback — never show a broken image icon
- If a third-party widget fails (chat, analytics, maps), the page must continue functioning normally — third-party failures must never propagate to first-party content