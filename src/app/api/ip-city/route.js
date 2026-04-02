import { NextResponse, connection } from 'next/server';
import { findNearestCity } from '@/lib/locationService';
import { searchCities } from '@/lib/db/queries/cities';
import { lookupIpGeo } from '@/lib/ip-lookup';

/**
 * api/ip-city/route.js
 * 
 * Falls back to IP-based location detection when GPS is not available.
 * Uses ip-api.com (free for non-commercial).
 */
export async function GET(request) {
  await connection();
  try {
    // 1. Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const rawIp = forwarded ? forwarded.split(/, /)[0] : request.ip || '';
    const ip = String(rawIp || '').trim() || (process.env.NODE_ENV === 'production' ? '' : '8.8.8.8');
    if (!ip) {
      return NextResponse.json({ error: 'IP not available' }, { status: 400 });
    }

    // 2. Fetch from the shared IP lookup helper.
    // Note: the default provider uses ip-api over HTTP on the free tier.
    const data = await lookupIpGeo(ip, {
      fields: ['status', 'message', 'country', 'countryCode', 'city', 'lat', 'lon', 'timezone'],
      revalidate: 3600,
    });
    if (!data?.lat || !data?.lon) {
      return NextResponse.json({ error: 'IP detection failed' }, { status: 500 });
    }

    // 3. Find the best match in our database
    const city = await findNearestCity(data.lat, data.lon);

    if (city) {
      return NextResponse.json(city);
    }

    // 4. Secondary fallback: Search by city name if nearest-city search failed
    const results = await searchCities(data.city, 1);
    if (results.length > 0) {
      const result = results[0];
      return NextResponse.json({
        ...result,
        country_slug: result.countries?.country_slug || result.country_slug,
        country_name_ar: result.countries?.name_ar || result.country_name_ar,
        city_name_ar: result.name_ar,
        city_name_en: result.name_en,
        timezone: result.timezone
      });
    }

    return NextResponse.json({ error: 'No matching city in database' }, { status: 404 });
  } catch (error) {
    console.error('IP City API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
