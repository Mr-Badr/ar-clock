import { z } from 'zod';

import {
  getFeaturedSiteItems,
  normalizeDiscoveryQueryValue,
  POPULAR_SITE_SEARCHES,
  searchSiteIndex,
} from '@/lib/site/discovery';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';
import { featureFlags } from '@/lib/feature-flags';
import { logger } from '@/lib/logger';

const querySchema = z.object({
  q: z.string().trim().max(120).optional().default(''),
  limit: z.coerce.number().int().min(1).max(24).optional().default(24),
});

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

export const GET = withApiHandler(
  '/api/discovery-search',
  async ({ requestId, request }) => {
    const { q: rawQuery, limit } = parseSearchParams(request, querySchema);
    const normalizedQuery = normalizeDiscoveryQueryValue(rawQuery);

    if (!normalizedQuery) {
      if (featureFlags.observabilityLogs) {
        logger.info('discovery-search-featured-served', {
          route: '/api/discovery-search',
          requestId,
          featuredCount: 6,
          topSearchCount: 8,
        });
      }

      return json(
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

    if (featureFlags.observabilityLogs) {
      logger.info('discovery-search-query-served', {
        route: '/api/discovery-search',
        requestId,
        query: normalizedQuery,
        limit,
        total: searchModel.total,
      });
    }

    return json(
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
  },
  {
    rateLimit: {
      key: 'discovery-search',
      limit: 180,
      windowMs: 60_000,
    },
  },
);
