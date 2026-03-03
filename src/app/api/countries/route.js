import { NextResponse } from 'next/server';
import { getCountries } from '@/lib/cityService';

export async function GET() {
  const countries = await getCountries();
  return NextResponse.json(countries, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
    }
  });
}
