'use cache';

import { cacheLife } from 'next/cache';

import { getPublicRuntimeConfig } from '@/lib/runtime-config';

// Found 2026-08-11 (live production audit): `getPublicRuntimeConfig()` reads `process.env`
// synchronously, and the root layout (src/app/layout.tsx) used to call it at MODULE SCOPE — so for
// any route Next.js fully statically optimizes (no revalidation window of its own, which is most of
// /tools/* — pure client-interactive calculators with no server data fetch), the whole tree
// including the root layout gets prerendered ONCE and cached forever, freezing in whatever env vars
// were present at that one build. Confirmed live: miqatona.com/tools/construction/build-cost served
// `"clientId":null,"enabled":false` — real ads config, but built without ADSENSE_CLIENT_ID/
// GOOGLE_CERTIFIED_CMP_ENABLED available (the Docker build stage doesn't receive them, only the
// running container does, via env_file at `docker compose up`) — while PPR/ISR-revalidated routes
// (holidays, time-now, homepage) correctly show real ads since they re-evaluate per request/
// revalidation against the running container's real env.
//
// `export const revalidate` at the segment level is not compatible with this project's
// `cacheComponents` config (Next.js 16 Cache Components) — errors the build. The Cache-Components
// answer is a `'use cache'`-annotated function instead, awaited from the root layout so it
// re-executes (and re-reads `process.env`) on its own `cacheLife` schedule regardless of whether
// the route around it is otherwise fully static.
//
// This MUST live in its own file with the `'use cache'` directive at the top (not inline inside
// `runtime-config.js`) — Turbopack rejected an earlier attempt with:
// "It is not allowed to define inline 'use cache' annotated functions in Client Components."
// `runtime-config.js` itself gets pulled into client bundles transitively (via `logger.js` /
// `AdBlogSidebar.tsx` / the health-check API route), so it must stay a plain, cache-directive-free
// file; only this dedicated, server-only wrapper (imported solely by layout.tsx) can carry the
// directive.
export async function getCachedPublicRuntimeConfig() {
  cacheLife('hours');
  return getPublicRuntimeConfig();
}
