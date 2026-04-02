/**
 * /date/hijri/sitemap.xml — Hijri date pages
 * Lists the current Hijri year ±1 (all days) for crawlable Hijri date pages.
 */
import { convertDate } from '@/lib/date-adapter';
import { getSiteUrl } from '@/lib/site-config';
import { connection } from 'next/server';

const BASE = getSiteUrl();

export async function GET() {
  await connection();
  const now = new Date();
  const isoNow = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const todayIso = isoNow;

  let currentHijriYear = 1447;
  try {
    const h = convertDate({ date: isoNow, toCalendar: 'hijri', method: 'umalqura' });
    currentHijriYear = h.year;
  } catch {
    // use default
  }

  const urls: string[] = [];
  // 3 Hijri years centred on current year
  for (let hy = currentHijriYear - 1; hy <= currentHijriYear + 1; hy++) {
    for (let hm = 1; hm <= 12; hm++) {
      const daysInMonth = hm % 2 !== 0 ? 30 : 29;
      for (let hd = 1; hd <= daysInMonth; hd++) {
        urls.push(
          `${BASE}/date/hijri/${hy}/${String(hm).padStart(2, '0')}/${String(hd).padStart(2, '0')}`
        );
      }
    }
  }

  const entries = urls.map(
    url => `
  <url>
    <loc>${url}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
