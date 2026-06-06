'use client';

import { useIdleRouteWarmup } from './useIntentPrefetch';

export default function HeaderRouteWarmup({ routes }) {
  useIdleRouteWarmup(routes, { timeout: 1800, limit: 4 });
  return null;
}
