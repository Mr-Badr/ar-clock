import { NextResponse } from 'next/server';

function normalizeCsv(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const latitudes = normalizeCsv(searchParams.get('latitudes'));
  const longitudes = normalizeCsv(searchParams.get('longitudes'));

  if (latitudes.length === 0 || longitudes.length === 0 || latitudes.length !== longitudes.length) {
    return NextResponse.json({ error: 'Invalid latitudes/longitudes query' }, { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes.join(',')}&longitude=${longitudes.join(',')}&current=temperature_2m,weather_code,is_day`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 600 },
      headers: {
        'User-Agent': 'miqat-weather-proxy/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Weather upstream failed' }, { status: 502 });
    }

    const payload = await response.json();
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Weather request failed' }, { status: 500 });
  }
}
