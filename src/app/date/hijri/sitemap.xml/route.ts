/**
 * /date/hijri/sitemap.xml — Hijri date pages
 * Bridge mode: daily Hijri date pages stay reachable, but they are removed
 * from the submitted sitemap set to reduce crawl pressure.
 */
import { convertDate } from '@/lib/date-adapter';
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

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
