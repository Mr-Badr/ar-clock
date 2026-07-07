---
name: data-layer
description: "Prevent empty pages and data crashes. Use when fetching data, accessing JSON, reading API responses, handling params or searchParams, writing array operations, or any code that reads external data. Covers: optional chaining, array validation, safe fetch patterns, caching strategy, input sanitization."
---

# Data Layer Rules

## 1. The Root Cause of Empty Pages
- Empty pages are almost never routing problems — they are data crashes with no error boundary to catch them
- The three causes, in order of frequency: (1) accessing a property on undefined/null from an API response, (2) not awaiting `params` in Next.js 15/16, (3) a missing `error.tsx` that lets the crash propagate to a blank page
- Understanding these causes means every data rule below is preventive medicine against blank pages

## 2. Every External Value Is Untrusted
- API responses, URL parameters, query strings, JSON files, localStorage, and cookie values are all untrusted data
- Untrusted means: it may be null, undefined, the wrong type, an empty array instead of an object, or a completely different shape than it was last week
- Validation is not defensive programming — it is the correct programming for a networked, distributed system where anything can change at any time

## 3. Guard Every Property Access
- Use optional chaining (`?.`) on every property access from external data — no exceptions
- Use nullish coalescing (`?? fallback`) on every terminal value to provide a safe default
- The deeper the property chain, the more critical this is — `a.b.c.d` without guards is four ways to crash a page
- Provide fallback values that are the correct type: `""` for strings, `0` for numbers, `[]` for arrays, `{}` for objects, `null` for nullable references — never mix types in a fallback

## 4. Validate Arrays Before Every Map, Filter, or Reduce
- Calling `.map()` on a value that is not an array throws immediately and crashes the entire component
- Before any array operation on external data, confirm it is actually an array and check its length if needed
- An API that returned an array yesterday can return an object, a string, null, or an error payload today
- This validation must happen every time, even for endpoints you control — your own API can break too

## 5. Fetch Failure Is a First-Class Case, Not an Edge Case
- Every network request has exactly three outcomes: success with data, server/client error (non-200), network failure (no response)
- All three must be handled — handling only the success case is the pattern that produces blank pages
- A non-200 HTTP status code means the request failed — do not call `.json()` on a failed response and expect valid data
- A successful HTTP status does not guarantee the response body is valid JSON — parse defensively and catch parse errors separately
- A fetch that takes too long is a failed fetch — implement timeout logic for any fetch that runs on a critical rendering path

## 6. JSON Files Are Not Safe Either
- Local JSON files used as data sources can have keys renamed, removed, or restructured during any development session
- A component that imports a JSON file and destructures it directly with no shape validation will crash silently when the file changes
- When a JSON file changes and the component that reads it has no validation, the result is a blank page in production with no error shown
- Always cast imported JSON to a typed interface and validate required keys before rendering

## 7. `params` and `searchParams` Must Always Be Awaited
- In Next.js 15 and 16, both are Promises — accessing them without `await` produces `[object Promise]` as a string value, not an error
- This does not throw — it renders silently broken content in production
- After awaiting, always validate the extracted value: confirm a slug is a non-empty string, a page number parses to a valid integer, an ID matches expected format
- Never use a raw query parameter as a number without parsing it and providing a safe fallback for `NaN`

## 8. Numeric Inputs Must Be Sanitized
- Query parameters arrive as strings — `?page=abc` gives you the string `"abc"`, not a number
- `parseInt("abc", 10)` returns `NaN` — using `NaN` in arithmetic or as an array index produces unpredictable results
- Always parse, always check `isNaN()`, always provide a bounded default
- Define minimum and maximum bounds for any numeric input used in pagination, filtering, or data fetching

## 9. Empty Data Is a Valid State That Needs a UI
- An empty array is not an error — it is a valid result that requires its own visual response
- A dataset with zero items must show an explicitly designed empty state, not a blank section
- Empty states for different contexts need different messages: "you haven't created anything yet" is different from "no results match your search" which is different from "this content is not available in your region"
- Never conflate empty data with fetch failure — they require different messages and different actions

## 10. Data Fetching Belongs in the Right Layer
- Page-level data belongs in Server Components — not in `useEffect` in Client Components
- Interactive data (user-filtered, user-paginated, real-time updated) may be fetched client-side using a proper data-fetching hook
- Never fetch the same data twice — if a parent Server Component fetches it, pass it to children via props rather than re-fetching
- Never trigger a data fetch inside a render loop or inside a component that renders repeatedly

## 11. Caching Strategy Must Match Data Freshness
- Content that never changes: static generation with no revalidation
- Content that changes weekly: ISR with a long revalidation window (hours)
- Content that changes hourly: ISR with a short revalidation window (minutes)
- Content that changes per-request: dynamic rendering with `cache: "no-store"`
- User-specific content: always dynamic, never cached at CDN level — cached personal data served to the wrong user is a security issue, not just a bug
- When you change a fetch, immediately verify the caching strategy still matches the data's actual update frequency

## 12. API Routes Must Validate Their Inputs
- Every query parameter and request body value passed to an API route is user-controlled input
- User-controlled input must be validated before use — type, range, format, and presence
- Never use raw user input in a database query, a file path, or an external API call without validation and sanitization
- API routes must return consistent response shapes: the same structure for success, the same structure for failure
- Never expose raw database error messages or internal stack traces in API responses — log internally, return a generic message externally