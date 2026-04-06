'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

function scheduleIdleWork(callback, timeout = 1200) {
  if (typeof window === 'undefined') return () => {};

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(id);
}

export function useIntentPrefetch() {
  const router = useRouter();
  const prefetchedRef = useRef(new Set());

  const prefetchHref = useCallback((href) => {
    if (!href || prefetchedRef.current.has(href)) return;

    prefetchedRef.current.add(href);
    router.prefetch(href);
  }, [router]);

  const prefetchMany = useCallback((hrefs = []) => {
    hrefs.forEach((href) => prefetchHref(href));
  }, [prefetchHref]);

  const getPrefetchHandlers = useCallback((href) => ({
    onMouseEnter: () => prefetchHref(href),
    onFocus: () => prefetchHref(href),
    onTouchStart: () => prefetchHref(href),
  }), [prefetchHref]);

  return {
    prefetchHref,
    prefetchMany,
    getPrefetchHandlers,
  };
}

export function useIdleRouteWarmup(routes, options = {}) {
  const { enabled = true, timeout = 1200 } = options;
  const { prefetchMany } = useIntentPrefetch();

  const normalizedRoutes = useMemo(
    () => routes.filter(Boolean),
    [routes],
  );
  const routesKey = normalizedRoutes.join('|');

  useEffect(() => {
    if (!enabled || normalizedRoutes.length === 0) return undefined;

    return scheduleIdleWork(() => {
      prefetchMany(normalizedRoutes);
    }, timeout);
  }, [enabled, prefetchMany, routesKey, normalizedRoutes, timeout]);
}
