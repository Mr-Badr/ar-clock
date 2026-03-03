import { NextResponse } from 'next/server';
import { findNearestCity } from '@/lib/cityService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const city = await findNearestCity(lat, lon);
  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  return NextResponse.json(city);
}
