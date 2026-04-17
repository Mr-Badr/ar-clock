/**
 * /date/gregorian/sitemap.xml — Gregorian daily date pages
 * Bridge mode: daily date pages stay reachable, but they are not submitted for
 * indexing. Return an empty sitemap to shrink crawl pressure.
 */
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
