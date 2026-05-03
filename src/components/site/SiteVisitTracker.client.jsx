'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import {
  DISCOVERY_RECENT_VISITS_KEY,
  pushDiscoveryHistory,
  trimDiscoveryTitle,
} from '@/lib/site/discovery-history';
import { logger, serializeError } from '@/lib/logger';

const IGNORED_PATHS = new Set(['/fahras', '/search', '/offline']);

export default function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/api') || IGNORED_PATHS.has(pathname)) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      try {
        const title = trimDiscoveryTitle(document.title);
        pushDiscoveryHistory(
          DISCOVERY_RECENT_VISITS_KEY,
          {
            href: pathname,
            title,
            visitedAt: String(Date.now()),
          },
          { max: 8, idKey: 'href' },
        );
      } catch (error) {
        logger.warn('site-visit-tracker-write-failed', {
          component: 'SiteVisitTracker',
          pathname,
          error: serializeError(error),
          handled: true,
        });
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
