import { buildCountryHubIcs } from '@/lib/holidays/country-hub';
import { COUNTRY_HUB_SLUGS } from '@/lib/holidays/country-hub-data';

export function generateStaticParams() {
  return COUNTRY_HUB_SLUGS.map((country) => ({ country }));
}

export async function GET(request, { params }) {
  const { country } = await params;
  const ics = await buildCountryHubIcs(country);
  if (!ics) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="holidays-${country}.ics"`,
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
