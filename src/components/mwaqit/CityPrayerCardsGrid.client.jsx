// components/mwaqit/CityPrayerCardsGrid.client.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';

const PRAYER_AR = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

const PRAYER_ICONS = {
  fajr: '🌙',
  sunrise: '🌅',
  dhuhr: '☀️',
  asr: '🌇',
  maghrib: '🌆',
  isha: '🌃',
};

// How many cards to show per page
const PAGE_SIZE = 12;

// Hydration-safe: render nothing on SSR to avoid class mismatches.
export default function CityPrayerCardsGrid({ cities, countrySlug, countryCode }) {

  const [now, setNow] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Server side: render null to avoid hydration mismatch
  if (!now) return null;

  const visibleCities = cities.slice(0, visibleCount);
  const hasMore = visibleCount < cities.length;
  const remaining = cities.length - visibleCount;

  return (
    <div>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-3)',
        }}
        className="sm:grid-cols-3-auto lg:grid-cols-4-auto"
      >
        <style suppressHydrationWarning>{`
          @media (min-width: 640px) {
            .city-prayer-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (min-width: 1024px) {
            .city-prayer-grid { grid-template-columns: repeat(4, 1fr); }
          }
        `}</style>
        {visibleCities.map((city) => (
          <CityCard key={city.city_slug} city={city} countrySlug={countrySlug} countryCode={countryCode} now={now} />
        ))}

      </div>

      {/* Footer: count + Load More */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}
      >
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          عرض {visibleCities.length} من أصل {cities.length} مدينة
        </p>

        {hasMore && (
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="btn btn-outline"
            style={{ gap: 'var(--space-2)', minWidth: 160 }}
          >
            تحميل {Math.min(PAGE_SIZE, remaining)} مدينة أخرى
          </button>
        )}
      </div>
    </div>
  );
}

// ── Individual City Card ──────────────────────────────────────────────────────
function CityCard({ city, countrySlug, countryCode, now }) {
  const times = calculatePrayerTimes({
    lat: city.lat,
    lon: city.lon,
    timezone: city.timezone,
    date: now,
    countryCode: countryCode,
    cacheKey: `${countrySlug}::${city.city_slug}`,
  });


  if (!times) {
    // Minimal fallback — city has no coordinates
    return (
      <Link
        href={`/mwaqit-al-salat/${countrySlug}/${city.city_slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4)',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-primary)',
          fontWeight: 'var(--font-semibold)',
          fontSize: 'var(--text-sm)',
          transition: 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
          boxShadow: 'var(--shadow-xs)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-accent-strong)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
        }}
      >
        <span className="truncate">{city.name_ar}</span>
      </Link>
    );
  }

  const { nextKey, nextIso } = getNextPrayer(times, now.toISOString());
  const timeStr = formatTime(nextIso, city.timezone, false);
  const icon = PRAYER_ICONS[nextKey] || '🕌';
  const prayerLabel = PRAYER_AR[nextKey] || nextKey;

  return (
    <Link
      href={`/mwaqit-al-salat/${countrySlug}/${city.city_slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-4)',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)',
        boxShadow: 'var(--shadow-xs)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-accent-strong)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      }}
    >
      {/* Top row: city name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-1)',
        }}
      >
        <span
          className="truncate"
          style={{
            fontWeight: 'var(--font-bold)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {city.name_ar}
        </span>
        {/* Prayer icon badge */}
        <span
          aria-label={prayerLabel}
          style={{
            fontSize: '1rem',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </div>

      {/* Next prayer label */}
      <span
        style={{
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
          fontWeight: 'var(--font-medium)',
        }}
      >
        {prayerLabel}
      </span>

      {/* Time */}
      <time
        dateTime={nextIso}
        dir="ltr"
        className="tabular-nums"
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-extrabold)',
          color: 'var(--accent-alt)',
          lineHeight: 1,
          letterSpacing: 'var(--tracking-wide)',
        }}
      >
        {timeStr}
      </time>

      {/* Decorative accent glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: -12,
          bottom: -12,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--accent)',
          opacity: 0.06,
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />
    </Link>
  );
}
