// src/components/hero/HeroEmbeddedClock.jsx
//
// SERVER COMPONENT — no 'use client' directive.
//
// Responsibilities:
//   1. Public API: receive and lightly normalize props from any page/layout.
//   2. Establish the server→client import boundary: Next.js treats the first
//      'use client' file it encounters as the client bundle entry point. By
//      keeping this file as a Server Component, we ensure that the outer
//      hero layout is server-rendered and streamed to the browser immediately,
//      while HeroClockClient is code-split and hydrated separately.
//   3. Wrap HeroClockClient in a <Suspense> boundary so the rest of the page
//      is never blocked by the clock's client hydration.
//
// IMPORTANT: do NOT add any browser-only imports here (hooks, navigator,
// document, window, etc.). They belong in HeroClockClient.jsx.

import { Suspense } from 'react';
import HeroClockClient from './HeroClockClient';

// ─── Inline skeleton ──────────────────────────────────────────────────────────
// Rendered by the server on first paint and shown until HeroClockClient
// hydrates. Keeps layout stable (no CLS) and avoids a blank flash.
// Intentionally unstyled beyond the bare minimum — real UI appears quickly.
function ClockSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '200px',
        // Transparent — inherits the hero section background.
        // The clock digits will pop in as soon as JS hydrates.
        background: 'transparent',
      }}
    />
  );
}

// ─── Server Component ─────────────────────────────────────────────────────────

/**
 * HeroEmbeddedClock — Server Component
 *
 * Usage (in any Server Component page or layout):
 *
 *   <HeroEmbeddedClock
 *     ianaTimezone="Africa/Cairo"
 *     cityNameAr="القاهرة"
 *     countryNameAr="مصر"
 *   />
 *
 * All props are optional. When omitted the clock auto-detects the user's
 * browser timezone and city on the client side.
 *
 * @param {string} [ianaTimezone] - e.g. "Africa/Casablanca"
 * @param {string} [cityNameAr]   - Arabic city name, e.g. "الرباط"
 * @param {string} [countryNameAr] - Arabic country name, e.g. "المغرب"
 */
export default function HeroEmbeddedClock({
  ianaTimezone,
  cityNameAr = 'توقيتك المحلي',
  countryNameAr,
}) {
  return (
    <Suspense fallback={<ClockSkeleton />}>
      <HeroClockClient
        ianaTimezone={ianaTimezone}
        cityNameAr={cityNameAr}
        countryNameAr={countryNameAr}
      />
    </Suspense>
  );
}