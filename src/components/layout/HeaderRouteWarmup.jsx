'use client';

import { usePathname } from 'next/navigation';
import { useIdleRouteWarmup } from './useIntentPrefetch';

const ROUTE_WARMUP_DELAY_MS = 6500;
const ROUTE_WARMUP_LIMIT = 2;

export default function HeaderRouteWarmup({ routes }) {
  const pathname = usePathname();
  const enabled = pathname !== '/';

  useIdleRouteWarmup(routes, {
    enabled,
    timeout: ROUTE_WARMUP_DELAY_MS,
    limit: ROUTE_WARMUP_LIMIT,
  });

  return null;
}
