'use client';

import { useEffect } from 'react';

/**
 * StuckLoadingRecovery — last-resort self-heal for a route stuck on its
 * `loading.jsx` fallback.
 *
 * Why this exists (2026-08-17): a route segment's `loading.jsx` is the
 * Suspense fallback for the WHOLE page whenever the page component itself
 * has no inner Suspense boundary around its data fetch (see
 * `app/holidays/[slug]/page.jsx` — it awaits `getHolidayPageCriticalData`
 * directly, so `loading.jsx` is the only boundary). Under normal conditions
 * that fallback is on screen for milliseconds. But if the streamed response
 * carrying the real content is ever cut short — a deploy/restart landing
 * mid-request, a proxy hiccup, a dropped keep-alive — the browser is left
 * holding an unresolved Suspense boundary with nothing telling it to do
 * anything else. The visitor sees the skeleton (reads as "empty, just the
 * navbar") indefinitely, with no error, no retry, nothing — exactly the
 * silent-blank-page failure `error-resilience` calls the worst production
 * state. A held-open response like this is also the kind of thing that can
 * sit there consuming memory in the tab for as long as it's left open.
 *
 * Mount this INSIDE a route's `loading.jsx`. If the component is still on
 * screen after `timeoutMs` — meaning the real content never arrived to
 * unmount it — it performs exactly one hard reload, which starts a brand
 * new request/response instead of waiting on the stuck one. A
 * sessionStorage guard keyed by path stops a genuinely broken destination
 * from reload-looping the visitor.
 */
export default function StuckLoadingRecovery({ timeoutMs = 9000, storageKey }) {
  useEffect(() => {
    let key = null;
    try {
      key = `miqat-stuck-reload:${storageKey || window.location.pathname}`;
      if (sessionStorage.getItem(key)) return undefined;
    } catch {
      // sessionStorage unavailable (privacy mode, etc.) — still arm the
      // timer, just without loop protection.
    }

    const timer = setTimeout(() => {
      try {
        if (key) sessionStorage.setItem(key, '1');
      } catch {
        // best-effort only
      }
      window.location.reload();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, storageKey]);

  return null;
}
