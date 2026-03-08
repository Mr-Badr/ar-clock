import { NextResponse, connection } from 'next/server';
import { findNearestCity } from '@/lib/locationService';
import { searchCities } from '@/lib/db/queries/cities';

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
    const ip = forwarded ? forwarded.split(/, /)[0] : request.ip || '8.8.8.8'; // fallback to google DNS for test

    // 2. Fetch from ip-api
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,city,lat,lon`);
    const data = await res.json();

    if (data.status !== 'success') {
      return NextResponse.json({ error: 'IP detection failed' }, { status: 500 });
    }

    // 3. Find the best match in our database
    const city = await findNearestCity(data.lat, data.lon);
    
    if (city) {
      return NextResponse.json(city);
    }

    // 4. Secondary fallback: Search by city name if nearest-city RPC failed
    const results = await searchCities(data.city, 1);
    if (results.length > 0) {
      return NextResponse.json({
        ...results[0],
        country_slug: results[0].countries?.country_slug,
        country_name_ar: results[0].countries?.name_ar,
        country_name_en: results[0].countries?.name_en,
        city_name_ar: results[0].name_ar,
        city_name_en: results[0].name_en,
        timezone: results[0].timezone
      });
    }

    return NextResponse.json({ error: 'No matching city in database' }, { status: 404 });
  } catch (error) {
    console.error('IP City API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
