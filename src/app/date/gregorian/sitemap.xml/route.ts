/**
 * /date/gregorian/sitemap.xml: Recently relevant Gregorian daily date pages.
 */
import { getGregorianDailySitemapDays } from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';

export async function GET() {
  const base = getSiteUrl();
  const entries = getGregorianDailySitemapDays(new Date()).map(({ year, month, day }) => {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    return `
  <url>
    <loc>${base}/date/${year}/${monthStr}/${dayStr}</loc>
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
