'use client';
/**
 * components/time-now/GeoRedirect.client.jsx
 *
 * Invisible client component that fires ONLY when the server couldn't redirect
 * (e.g. local dev, no Vercel geo headers). It tries:
 *   1. Intl.DateTimeFormat timezone → mapTimezoneToCityAction → /time-now/[country]
 *   2. Browser Geolocation → getNearestCityAction → /time-now/[country]/[city]
 *
 * Renders nothing — purely a "second chance" redirect.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resolveCurrentUserCity } from '@/lib/user-location.client';

export default function GeoRedirect() {
  const router = useRouter();

  useEffect(() => {
    let done = false;

    async function tryRedirect() {
      try {
        const detection = await resolveCurrentUserCity({
          geolocation: 'if-granted',
          gpsTimeoutMs: 8_000,
        });

        const city = detection.city;
        if (city?.country_slug && !done) {
          done = true;
          const path = city.city_slug
            ? `/time-now/${city.country_slug}/${city.city_slug}`
            : `/time-now/${city.country_slug}`;
          router.replace(path);
        }
      } catch { /* ignore */ }
    }

    tryRedirect();
  }, [router]);

  return null; // invisible
}
