import { z } from 'zod';

import {
  LIVE_DATA_SCOPES,
  getEconomyFallbackSnapshot,
  getEconomyLiveSnapshot,
} from '@/lib/economy/live-data.server';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';
import { logger, serializeError } from '@/lib/logger';

const querySchema = z.object({
  scope: z.string().trim().optional().default('landing'),
});

export const GET = withApiHandler(
  '/api/economie/live',
  async ({ request, requestId }) => {
    const { scope: rawScope } = parseSearchParams(request, querySchema);
    const scope = LIVE_DATA_SCOPES.includes(rawScope) ? rawScope : 'landing';

    try {
      const snapshot = await getEconomyLiveSnapshot(scope);

      return json(snapshot, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300, stale-if-error=86400',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    } catch (error) {
      logger.warn('economy-live-route-degraded', {
        route: '/api/economie/live',
        requestId,
        scope,
        error: serializeError(error),
      });

      const fallback = await getEconomyFallbackSnapshot(scope);

      return json(
        {
          ...fallback,
          degraded: true,
          degradedReason: 'live-feed-unavailable',
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
            'X-Data-Fallback': 'fallback-snapshot',
          },
        },
      );
    }
  },
  {
    rateLimit: {
      key: 'economy-live',
      limit: 120,
      windowMs: 60_000,
    },
  },
);
