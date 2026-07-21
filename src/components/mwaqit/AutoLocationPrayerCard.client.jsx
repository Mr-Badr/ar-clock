'use client';

import { useEffect, useState } from 'react';
import { resolveCurrentUserCity } from '@/lib/user-location.client';
import { getNightPrayerFactsAction } from '@/app/actions/prayer-facts';
import styles from './AutoLocationPrayerCard.module.css';

/**
 * Detects the visitor's city client-side (cache → silent IP/timezone guess →
 * GPS only if already granted — never a cold permission prompt on load, so
 * the page never blocks on a dialog) and fetches the matching prayer facts,
 * then hands both to `children` as a render-prop. This is what lets the
 * special prayer pages (last-third-of-night, duha, etc.) show a real,
 * personalized answer as the first thing on the page instead of an empty
 * search box — the "input first, then maybe an answer" pattern is the exact
 * thing this replaces.
 *
 * Deliberately client-only: personalized-by-visitor content can't be part of
 * the static SSR shell (see nextjs-patterns.md — no per-request geo in
 * server HTML). The H1/FAQ/schema around this card stay server-rendered.
 */
export default function AutoLocationPrayerCard({ factType, children, fallback = null }) {
  const [state, setState] = useState({ status: 'loading', city: null, facts: null, source: null });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { city, source } = await resolveCurrentUserCity({ geolocation: 'if-granted' });
      if (cancelled) return;

      if (!city || !Number.isFinite(city.lat) || !Number.isFinite(city.lon) || !city.timezone) {
        setState({ status: 'unavailable', city: null, facts: null, source: null });
        return;
      }

      const facts = await getNightPrayerFactsAction({
        factType,
        lat: city.lat,
        lon: city.lon,
        timezone: city.timezone,
        countryCode: city.country_code,
      });
      if (cancelled) return;

      if (!facts) {
        setState({ status: 'unavailable', city, facts: null, source });
        return;
      }

      setState({ status: 'ready', city, facts, source });
    })();

    return () => { cancelled = true; };
  }, [factType]);

  if (state.status === 'loading') {
    return (
      <div className={styles.skeleton} aria-busy="true" aria-label="جارٍ تحديد موقعك">
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonValue} />
        <div className={styles.skeletonLine} />
      </div>
    );
  }

  if (state.status === 'unavailable') {
    return fallback;
  }

  return children(state);
}
