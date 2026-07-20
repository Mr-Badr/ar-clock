/**
 * Historically this gated indexability behind a hardcoded allowlist built
 * from POPULAR_PAIRS (~60 curated pairs) — every other real city-pair combo
 * in the geo DB, no matter how valid, was forced `noindex`. That meant ~93
 * additional pairs already listed in sitemap.xml (via SITEMAP_PAIRS) were
 * being submitted to Google as `noindex` pages — a direct "submitted URL
 * marked noindex" signal — and the long tail of real city pairs a user might
 * actually search for could never rank at all.
 *
 * The page itself only calls this AFTER both `from`/`to` segments already
 * resolved to real cities via `resolveTimeDifferenceCityFromSegment` (backed
 * by the full geo DB/fallback file, not a curated list) — so by the time this
 * runs, the content is already genuine and unique. The only remaining reason
 * to withhold indexing is a trivial same-city comparison, which is thin/
 * duplicate-ish content ("city vs itself").
 */
export function isSeoIndexableTimeDifferencePair(fromSegment, toSegment) {
  const from = String(fromSegment || '').trim().toLowerCase();
  const to = String(toSegment || '').trim().toLowerCase();
  return Boolean(from && to) && from !== to;
}
