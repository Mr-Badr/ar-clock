'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveLivePrayerWindow } from '@/lib/prayerEngine';

/**
 * Single source of truth for "which prayer is next," ticking on the browser's
 * own clock. Any UI element on a prayer page that shows a "next prayer"
 * indicator (countdown ring, timeline, table) should use this hook instead of
 * trusting a server-computed prop — a server value is a snapshot from render
 * time and goes stale the moment real time crosses a prayer boundary while
 * the tab stays open.
 *
 * @param {object} opts
 * @param {number} opts.lat
 * @param {number} opts.lon
 * @param {string} opts.timezone
 * @param {string} [opts.countryCode]
 * @param {string} [opts.method]
 * @param {string} [opts.cacheKey]
 * @param {string} [opts.fallbackNextPrayerKey] - used before the first tick resolves (SSR-safe)
 * @param {string} [opts.fallbackNextPrayerIso]
 * @param {string} [opts.fallbackPrevPrayerIso]
 * @param {number} [opts.intervalMs] - tick frequency, default 1000ms
 * @returns {{ nextKey: string|undefined, nextIso: string|undefined, prevIso: string|undefined }}
 */
export function useLiveNextPrayer({
  lat,
  lon,
  timezone,
  countryCode,
  method,
  cacheKey,
  fallbackNextPrayerKey,
  fallbackNextPrayerIso,
  fallbackPrevPrayerIso,
  intervalMs = 1000,
}) {
  const configRef = useRef();
  configRef.current = {
    lat, lon, timezone, countryCode, method, cacheKey,
    fallbackNextPrayerKey, fallbackNextPrayerIso, fallbackPrevPrayerIso,
  };

  const [state, setState] = useState(() => ({
    nextKey: fallbackNextPrayerKey,
    nextIso: fallbackNextPrayerIso,
    prevIso: fallbackPrevPrayerIso,
  }));

  const tick = useCallback(() => {
    const cfg = configRef.current;
    const next = resolveLivePrayerWindow({
      lat: cfg.lat,
      lon: cfg.lon,
      timezone: cfg.timezone,
      countryCode: cfg.countryCode,
      method: cfg.method,
      cacheKey: cfg.cacheKey,
      fallback: {
        nextKey: cfg.fallbackNextPrayerKey,
        nextIso: cfg.fallbackNextPrayerIso,
        prevIso: cfg.fallbackPrevPrayerIso,
      },
    });

    setState((prev) => (
      prev.nextKey === next.nextKey && prev.nextIso === next.nextIso && prev.prevIso === next.prevIso
        ? prev
        : next
    ));
  }, []);

  useEffect(() => {
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
    // Restart cleanly whenever the location/method identity changes (city switch).
  }, [tick, intervalMs, lat, lon, timezone, countryCode, method]);

  return state;
}
