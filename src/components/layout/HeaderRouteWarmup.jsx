'use client';

import { useIdleRouteWarmup } from './useIntentPrefetch';

export default function HeaderRouteWarmup({ routes = [] }) {
  useIdleRouteWarmup(routes, { timeout: 1500 });
  return null;
}
