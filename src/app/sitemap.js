import { getSiteUrl } from '@/lib/site-config';
import { buildRootSitemapEntries } from '@/lib/seo/site-architecture';

/**
 * app/sitemap.js — Next.js App Router native sitemap
 * Curated site architecture pages that act as the top-level crawl surface.
 * Leaf families are exposed through their own feature sitemaps in sitemap-index.xml.
 */

export default async function sitemap() {
  const base = getSiteUrl();
  return buildRootSitemapEntries({ base });
}
