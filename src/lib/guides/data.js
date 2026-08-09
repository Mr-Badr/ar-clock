// /blog retired entirely 2026-08-09 (v1→v2 cleanup — real traffic was 0 across the whole
// section except 2 articles, which were migrated into /tools/construction as real editorial
// content instead of being kept as a standalone blog). This file now only exists so the handful
// of call sites that iterate over ALL_GUIDES (src/lib/site/discovery.js's
// COVERAGE_SAMPLE_PATHS-equivalent spreads, scripts/validate-seo-architecture.ts) keep working
// without needing their own edits — they all just get nothing back.
export const ALL_GUIDES = [];

export function getGuideBySlug() {
  return null;
}
