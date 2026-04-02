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

const getWeatherInfo = (wCode, isDay = 1) => {
  const map = {
    0: { label: 'صافي', icon: isDay ? '☀️' : '🌙' },
    1: { label: 'صافي غالباً', icon: isDay ? '🌤️' : '🌑' },
    2: { label: 'غائم جزئياً', icon: isDay ? '⛅' : '☁️' },
    3: { label: 'غائم', icon: '☁️' },
    45: { label: 'ضباب', icon: '🌫️' },
    48: { label: 'ضباب جليدي', icon: '🌫️' },
    51: { label: 'رذاذ خفيف', icon: '🌦️' },
    53: { label: 'رذاذ متوسط', icon: '🌦️' },
    55: { label: 'رذاذ كثيف', icon: '🌦️' },
    61: { label: 'مطر خفيف', icon: '🌧️' },
    63: { label: 'مطر متوسط', icon: '🌧️' },
    65: { label: 'مطر غزير', icon: '🌧️' },
    71: { label: 'ثلوج خفيفة', icon: '❄️' },
    73: { label: 'ثلوج متوسطة', icon: '❄️' },
    75: { label: 'ثلوج كثيفة', icon: '❄️' },
    80: { label: 'زخات خفيفة', icon: '🌦️' },
    81: { label: 'زخات متوسطة', icon: '🌦️' },
    82: { label: 'زخات عنيفة', icon: '🌧️' },
    95: { label: 'عواصف رعدية', icon: '⚡' },
  };
  return map[wCode] || { label: 'غير معروف', icon: '🌡️' };
};

// How many cards to show per page
const PAGE_SIZE = 12;

// Hydration-safe: render nothing on SSR to avoid class mismatches.
export default function CityPrayerCardsGrid({ cities, countrySlug, countryCode }) {

  const [now, setNow] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Weather Fetching (Batch) with sessionStorage cache (10 min TTL)
  useEffect(() => {
    if (!cities.length || !now) return;

    let isMounted = true;
    const fetchWeather = async () => {
      const visibleCities = cities.slice(0, visibleCount);
      const validCities = visibleCities.filter(c => c.lat != null && c.lon != null);
      if (validCities.length === 0) return;

      const CACHE_TTL = 10 * 60 * 1000;
      const currentTs = Date.now();
      const mapping = { ...weather };
      const citiesToFetch = [];

      for (const c of validCities) {
        const key = `${c.lat},${c.lon}`;
        const cacheKey = `meteo_${key}`;
        let found = false;
        try {
          if (typeof sessionStorage !== 'undefined') {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const { ts, data } = JSON.parse(cached);
              if (currentTs - ts < CACHE_TTL) {
                mapping[key] = data;
                found = true;
              }
            }
          }
        } catch { /* ignore */ }
        
        if (!found && !weather[key]) {
          citiesToFetch.push(c);
        }
      }

      if (citiesToFetch.length === 0) {
        if (isMounted) setWeather(mapping);
        return;
      }

      try {
        const lats = citiesToFetch.map(c => c.lat).join(',');
        const lons = citiesToFetch.map(c => c.lon).join(',');
        const url = `/api/weather?latitudes=${encodeURIComponent(lats)}&longitudes=${encodeURIComponent(lons)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const responseData = await res.json();
        const results = Array.isArray(responseData) ? responseData : [responseData];

        citiesToFetch.forEach((c, i) => {
          const key = `${c.lat},${c.lon}`;
          if (results[i]?.current) {
            mapping[key] = results[i].current;
            try {
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(`meteo_${key}`, JSON.stringify({ ts: currentTs, data: results[i].current }));
              }
            } catch { /* ignore */ }
          }
        });

        if (isMounted) setWeather(mapping);
      } catch (err) {
        console.warn('[Meteo] Fetch failed:', err);
      }
    };

    fetchWeather();
    return () => { isMounted = false; };
  }, [cities, visibleCount, now]);

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
          gap: 'var(--space-3)',
        }}
        className="city-prayer-grid"
      >
        <style suppressHydrationWarning>{`
          .city-prayer-grid { 
            grid-template-columns: repeat(2, 1fr); 
          }
          @media (min-width: 640px) {
            .city-prayer-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (min-width: 768px) {
            .city-prayer-grid { grid-template-columns: repeat(3, 1fr); }
          }
          @media (min-width: 1024px) {
            .city-prayer-grid { grid-template-columns: repeat(3, 1fr); }
          }
        `}</style>
        {visibleCities.map((city) => (
          <CityCard 
            key={city.city_slug} 
            city={city} 
            countrySlug={countrySlug} 
            countryCode={countryCode} 
            now={now} 
            weather={weather[`${city.lat},${city.lon}`]}
          />
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
            className="btn btn-surface btn-lg"
            style={{ 
              gap: 'var(--space-2)', 
              minWidth: 180,
              borderRadius: 'var(--radius-xl)',
            }}
          >
            تحميل {Math.min(PAGE_SIZE, remaining)} مدينة أخرى
          </button>
        )}
      </div>
    </div>
  );
}

// ── Individual City Card ──────────────────────────────────────────────────────
function CityCard({ city, countrySlug, countryCode, now, weather }) {
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
  const prayerLabel = PRAYER_AR[nextKey] || nextKey;

  const wInfo = weather ? getWeatherInfo(weather.weather_code, weather.is_day) : { icon: '🌡️' };

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
      {/* Top row: city name + weather/temp group */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
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

        {/* Weather group (Top Left) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1-5)',
          background: 'var(--bg-surface-3)',
          padding: '6px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}>
          {weather && (
            <span style={{ 
              fontSize: 'var(--text-xs)', 
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {Math.round(weather.temperature_2m)}°
            </span>
          )}
          <span
            aria-hidden="true"
            style={{
              fontSize: '1rem',
              lineHeight: 1,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
            }}
          >
            {wInfo.icon}
          </span>
        </div>
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

      {/* Time row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'var(--space-1)',
      }}>
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
      </div>

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
