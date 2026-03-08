// src/app/mwaqit-al-salat/page.jsx
'use client';

/**
 * app/mwaqit-al-salat/page.jsx
 *
 * 4-tier location redirector.
 * Loop-safe: sessionStorage timestamp guard prevents back-button redirect loops.
 * Tiers: localStorage → GPS → IP API → Timezone → Manual search
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin } from 'lucide-react';
import SearchCity from '@/components/SearchCity.client';
import { getNearestCityAction, mapTimezoneToCityAction } from '@/app/actions/location';

const REDIRECT_KEY   = 'waqt-last-redirect';
const CITY_KEY       = 'waqt-preferred-city';
const LOOP_GUARD_MS  = 3000; // if we redirected here within 3s, show manual UI

export default function PrayerRedirectPage() {
  const router = useRouter();
  const [status, setStatus] = useState('detecting'); // 'detecting' | 'fallback'

  // Separated to useCallback so it can't accidentally re-run via closure capture
  const redirectTo = useCallback((countrySlug, citySlug) => {
    try {
      sessionStorage.setItem(REDIRECT_KEY, String(Date.now()));
    } catch (_) { /* ignore */ }
    router.replace(`/mwaqit-al-salat/${countrySlug}/${citySlug}`);
  }, [router]);

  useEffect(() => {
    // Guard: if we just redirected here (back-button), go straight to manual UI
    try {
      const last = sessionStorage.getItem(REDIRECT_KEY);
      if (last && Date.now() - Number(last) < LOOP_GUARD_MS) {
        setStatus('fallback');
        return;
      }
    } catch (_) { /* ignore */ }

    let cancelled = false; // prevents state updates after unmount

    async function detect() {
      // ── Tier 1: localStorage ───────────────────────────────────────────────
      try {
        const raw = localStorage.getItem(CITY_KEY);
        if (raw) {
          const city = JSON.parse(raw);
          if (city?.country_slug && city?.city_slug) {
            redirectTo(city.country_slug, city.city_slug);
            return;
          }
        }
      } catch (_) { /* corrupt JSON — ignore */ }

      // ── Tier 2: GPS ────────────────────────────────────────────────────────
      const gpsPos = await new Promise((resolve) => {
        if (!navigator?.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          resolve,
          () => resolve(null),
          { timeout: 12_000, enableHighAccuracy: true },
        );
      });

      if (gpsPos && !cancelled) {
        try {
          const city = await getNearestCityAction(gpsPos.coords.latitude, gpsPos.coords.longitude);
          if (city?.country_slug && city?.city_slug) {
            localStorage.setItem(CITY_KEY, JSON.stringify(city));
            redirectTo(city.country_slug, city.city_slug);
            return;
          }
        } catch (_) { /* GPS API failed */ }
      }

      if (cancelled) return;

      // ── Tier 3: IP-based ───────────────────────────────────────────────────
      try {
        const res = await fetch('/api/ip-city');
        if (res.ok) {
          const city = await res.json();
          if (city?.country_slug && city?.city_slug) {
            redirectTo(city.country_slug, city.city_slug);
            return;
          }
        }
      } catch (_) { /* IP API failed */ }

      if (cancelled) return;

      // ── Tier 4: Timezone coarse match ──────────────────────────────────────
      try {
        const tz    = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = await mapTimezoneToCityAction(tz);
        if (match?.country_slug && match?.city_slug) {
          redirectTo(match.country_slug, match.city_slug);
          return;
        }
      } catch (_) { /* Intl not available */ }

      // ── All tiers exhausted → manual ───────────────────────────────────────
      if (!cancelled) setStatus('fallback');
    }

    detect();

    return () => { cancelled = true; };
  }, [redirectTo]);

  const handleSelect = useCallback((city) => {
    try {
      localStorage.setItem(CITY_KEY, JSON.stringify(city));
    } catch (_) { /* ignore */ }
    router.push(`/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`);
  }, [router]);

  // ── Manual city search UI ──────────────────────────────────────────────────
  if (status === 'fallback') {
    return (
      <div className="min-h-screen bg-base py-20 px-6" dir="rtl">
        <div className="max-w-xl mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-accent-soft rounded-2xl flex items-center justify-center mx-auto border border-accent/20">
              <MapPin className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-black text-primary">اختر مدينتك</h1>
            <p className="text-muted text-lg leading-relaxed">
              لم نتمكن من تحديد موقعك تلقائياً. ابحث عن مدينتك للحصول على مواقيت صلاة دقيقة.
            </p>
          </div>

          <div className="bg-glass border border-border rounded-3xl p-8 shadow-2xl">
            <SearchCity onSelect={handleSelect} />
          </div>

          <p className="text-muted text-xs">
            نستخدم بيانات دقيقة لضمان صحة مواقيت الصلاة في مدينتك.
          </p>
        </div>
      </div>
    );
  }

  // ── Detecting / loading UI ─────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-base flex flex-col items-center justify-center gap-6 p-6 text-primary"
      dir="rtl"
    >
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-accent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-accent">GPS</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black leading-tight">جاري تحديد موقعك...</h1>
        <p className="text-muted text-sm max-w-xs mx-auto">
          اسمح بالوصول إلى موقعك للحصول على أدق مواقيت الصلاة لمدينتك.
        </p>
      </div>

      <div className="flex gap-2" aria-hidden="true">
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" />
      </div>
    </div>
  );
}