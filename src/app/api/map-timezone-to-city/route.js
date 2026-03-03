/**
 * app/api/map-timezone-to-city/route.js
 *
 * Maps an IANA timezone string (from the browser's Intl API) to a best-matching city.
 * Used by the TimezoneBanner client component to suggest the user's likely city.
 *
 * Only reads from seed — no DB call — so it's instant and free.
 */

import { NextResponse } from 'next/server';
import { mapTimezoneToCityFromSeed } from '@/lib/cityService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tz = searchParams.get('tz') || '';

  if (!tz) return NextResponse.json(null);

  // Validate — only allow valid-looking IANA tz strings
  if (!/^[A-Za-z_]+\/[A-Za-z_]+$/.test(tz)) {
    return NextResponse.json(null);
  }

  const city = mapTimezoneToCityFromSeed(tz);
  if (!city) return NextResponse.json(null);

  return NextResponse.json({
    city_name_ar: city.city_name_ar,
    country_slug: city.country_slug,
    city_slug: city.city_slug,
    country_name_ar: city.country_name_ar,
  });
}
