import {
  GREGORIAN_CALENDAR_INDEXABLE_RANGE,
  getGregorianYearSitemapDays,
} from '@/lib/seo/date-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

const BASE = getSiteUrl();

export async function GET(
  _request: Request,
  context: { params: Promise<{ year: string }> },
) {
  const { year } = await context.params;

  if (!/^\d{4}$/.test(year)) {
    return new Response('Not Found', { status: 404 });
  }

  const numericYear = Number.parseInt(year, 10);
  if (
    numericYear < GREGORIAN_CALENDAR_INDEXABLE_RANGE.minYear
    || numericYear > GREGORIAN_CALENDAR_INDEXABLE_RANGE.maxYear
  ) {
    return new Response('Not Found', { status: 404 });
  }

  const lastmod = getSitemapLastModifiedDate();
  const entries = getGregorianYearSitemapDays(numericYear).map(({ year: rowYear, month, day }) => {
    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    return `
  <url>
    <loc>${BASE}/date/${rowYear}/${monthStr}/${dayStr}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
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
