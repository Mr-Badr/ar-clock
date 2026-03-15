import { calculatePrayerTimes } from '@/lib/prayerEngine';
import { NextResponse } from 'next/server';

export async function GET() {
  const times = calculatePrayerTimes({
    lat: 34.020882,
    lon: -6.84165,
    timezone: 'Africa/Casablanca',
    date: new Date(),
    countryCode: 'MA',
    cacheKey: `country::morocco::rabat`
  });
  return NextResponse.json(times);
}
