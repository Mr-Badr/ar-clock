import { NextResponse } from 'next/server';

import { LIVE_DATA_SCOPES, getEconomyLiveSnapshot } from '@/lib/economy/live-data.server';

export async function GET(request) {
  const scopeParam = request.nextUrl.searchParams.get('scope');
  const scope = LIVE_DATA_SCOPES.includes(scopeParam) ? scopeParam : 'landing';
  const snapshot = await getEconomyLiveSnapshot(scope);

  return NextResponse.json(snapshot, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, stale-if-error=86400',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}
