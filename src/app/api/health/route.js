import { NextResponse } from 'next/server';
import { getLiveGeoProviderName, isLiveGeoDbEnabled } from '@/lib/db/live-geo-source';

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'ar-clock',
      timestamp: new Date().toISOString(),
      liveGeoDbEnabled: isLiveGeoDbEnabled(),
      liveGeoProvider: getLiveGeoProviderName(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
