import { NextResponse } from 'next/server';
import { searchCities } from '@/lib/cityService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json([]);
  }

  const results = await searchCities(q);
  return NextResponse.json(results);
}
