import { NextResponse } from 'next/server';
import { findNearestCity, searchCities } from '@/lib/cityService';

/**
 * api/ip-city/route.js
 * 
 * Falls back to IP-based location detection when GPS is not available.
 * Uses ip-api.com (free for non-commercial).
 */
export async function GET(request) {
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
    const results = await searchCities(data.city, 1, data.countryCode.toLowerCase());
    if (results.length > 0) {
      return NextResponse.json(results[0]);
    }

    return NextResponse.json({ error: 'No matching city in database' }, { status: 404 });
  } catch (error) {
    console.error('IP City API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
