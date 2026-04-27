import { NextResponse } from 'next/server';

import {
  getFeaturedSiteItems,
  normalizeDiscoveryQueryValue,
  POPULAR_SITE_SEARCHES,
  searchSiteIndex,
} from '@/lib/site/discovery';

function serializeDiscoveryItem(item) {
  return {
    href: item.href,
    title: item.title,
    description: item.description,
    badge: item.badge,
    sectionTitle: item.sectionTitle,
    kind: item.kind,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = String(searchParams.get('q') || '');
  const normalizedQuery = normalizeDiscoveryQueryValue(rawQuery);
  const limit = Math.max(1, Math.min(24, Number(searchParams.get('limit') || 24)));

  if (!normalizedQuery) {
    return NextResponse.json(
      {
        featuredItems: getFeaturedSiteItems(6).map(serializeDiscoveryItem),
        topSearches: POPULAR_SITE_SEARCHES.slice(0, 8),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    );
  }

  const searchModel = searchSiteIndex(normalizedQuery, { limit });

  return NextResponse.json(
    {
      normalizedQuery: searchModel.normalizedQuery,
      total: searchModel.total,
      results: searchModel.results.map(serializeDiscoveryItem),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=86400',
      },
    },
  );
}
