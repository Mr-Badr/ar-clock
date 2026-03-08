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
import { mapTimezoneToCityAction, getNearestCityAction } from '@/app/actions/location';

export default function GeoRedirect() {
  const router = useRouter();

  useEffect(() => {
    let done = false;

    async function tryRedirect() {
      // ── Tier A: Timezone match ─────────────────────────────────────
      try {
        const tz    = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = await mapTimezoneToCityAction(tz);
        if (match?.country_slug && !done) {
          done = true;
          // redirect to country level so user stays on the page they asked for
          router.replace(`/time-now/${match.country_slug}`);
          return;
        }
      } catch { /* ignore */ }

      // ── Tier B: GPS ───────────────────────────────────────────────
      if (done) return;
      try {
        const pos = await new Promise((res) => {
          if (!navigator?.geolocation) return res(null);
          navigator.geolocation.getCurrentPosition(res, () => res(null), { timeout: 8_000 });
        });
        if (pos && !done) {
          const city = await getNearestCityAction(pos.coords.latitude, pos.coords.longitude);
          if (city?.country_slug) {
            done = true;
            const path = city.city_slug
              ? `/time-now/${city.country_slug}/${city.city_slug}`
              : `/time-now/${city.country_slug}`;
            router.replace(path);
          }
        }
      } catch { /* ignore */ }
    }

    tryRedirect();
  }, [router]);

  return null; // invisible
}
