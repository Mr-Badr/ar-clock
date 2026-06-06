/**
 * /date/hijri/sitemap.xml: Hijri date pages
 * Publish a narrow rolling SEO window of canonical Hijri day pages. The full
 * historical Hijri archive remains available through valid routes, but it is
 * not submitted wholesale because that creates thousands of low-demand URLs in
 * Search Console.
 */
import { getHijriDailySitemapDays } from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

export async function GET() {
  const base = getSiteUrl();
  const lastmod = getSitemapLastModifiedDate();
  const entries = getHijriDailySitemapDays().map(({ year, month, day }) => {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    return `
  <url>
    <loc>${base}/date/hijri/${year}/${monthStr}/${dayStr}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.55</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
