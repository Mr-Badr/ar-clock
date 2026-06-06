'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';

function scheduleIdleWork(callback, timeout) {
  if (typeof window === 'undefined') return () => {};

  const delay = Number.isFinite(timeout) ? timeout : 1200;

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: delay });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, delay);
  return () => window.clearTimeout(id);
}

function canRunRouteWarmup() {
  if (typeof navigator === 'undefined') return false;

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection?.saveData) return false;
  if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
    return false;
  }

  return true;
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

export function useIdleRouteWarmup(routes, options) {
  const routeList = Array.isArray(routes) ? routes : [];
  const warmupOptions = options && typeof options === 'object' ? options : {};
  const enabled = warmupOptions.enabled !== false;
  const timeout = Number.isFinite(warmupOptions.timeout) ? warmupOptions.timeout : 1200;
  const limit = Number.isInteger(warmupOptions.limit) ? warmupOptions.limit : 4;
  const { prefetchMany } = useIntentPrefetch();

  const normalizedRoutes = useMemo(
    () => routeList.filter(Boolean).slice(0, limit),
    [routeList, limit],
  );
  const routesKey = normalizedRoutes.join('|');

  useEffect(() => {
    if (!enabled || normalizedRoutes.length === 0) return undefined;
    if (!canRunRouteWarmup()) return undefined;

    return scheduleIdleWork(() => {
      prefetchMany(normalizedRoutes);
    }, timeout);
  }, [enabled, prefetchMany, routesKey, normalizedRoutes, timeout]);
}
