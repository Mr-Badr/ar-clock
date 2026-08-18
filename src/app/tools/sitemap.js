import { getSiteUrl } from '@/lib/site-config';
import { ALL_CALCULATOR_SEO_ROUTES } from '@/lib/seo/calculator-route-manifest';

/**
 * app/tools/sitemap.js — Next.js App Router native sitemap for the /tools section.
 *
 * Added 2026-08-18: every other feature family (holidays, time-now, time-difference,
 * imsakiya, date) already had its own dedicated sub-sitemap listed in
 * `SITEMAP_INDEX_PATHS` — /tools (168 real pages: 152 calculator routes + 16 category
 * hubs) did not, so those pages had zero sitemap presence and could only be discovered
 * by Google crawling internal links, not the much faster sitemap-based discovery path
 * every other section gets. `ALL_CALCULATOR_SEO_ROUTES` (src/lib/seo/calculator-route-manifest.js)
 * already existed as a complete, sitemap-ready {path, priority, changeFrequency} list —
 * it was just never wired into an actual sitemap route. See also: SITEMAP_INDEX_PATHS
 * in src/lib/seo/site-architecture.js, which must list this sitemap's URL for it to be
 * discovered via /sitemap-index.xml.
 */
export default async function sitemap() {
  const base = getSiteUrl();
  return ALL_CALCULATOR_SEO_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
