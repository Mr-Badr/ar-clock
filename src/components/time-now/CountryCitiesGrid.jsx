'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Thermometer, CloudSun } from 'lucide-react';

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

function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getCityDisplayTimeShort(tz) {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      hour: '2-digit', hour12: false,
      minute: '2-digit',
    }).formatToParts(now);
    const h = parts.find(p => p.type === 'hour')?.value ?? '00';
    const m = parts.find(p => p.type === 'minute')?.value ?? '00';
    return `${h}:${m}`;
  } catch { return '--:--'; }
}

/* ─── CITY CARD ─────────────────────────────────────────────────── */
function CityCard({ city, time, weather, countrySlug, isActive }) {
  const slug = city.city_slug ?? city.slug;
  const cityAr = city.city_name_ar ?? city.name_ar ?? city.name_en ?? slug;

  const temp = weather?.temperature_2m;
  const wCode = weather?.weather_code ?? 0;
  const isDay = weather?.is_day ?? 1;
  const wInfo = getWeatherInfo(wCode, isDay);

  return (
    <Link
      href={`/time-now/${countrySlug}/${slug}`}
      title={`حالة الطقس والوقت الان في ${cityAr}`}
      aria-label={`الطقس والوقت في ${cityAr}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        itemScope itemType="http://schema.org/Place"
        style={{
          padding: '1rem',
          borderRadius: '1rem',
          background: isActive ? 'var(--accent-soft)' : 'var(--bg-surface-2)',
          border: isActive ? '1px solid var(--border-accent-strong)' : '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '110px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = isActive ? 'var(--border-accent-strong)' : 'var(--border-default)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* SEO Props */}
        <meta itemProp="name" content={cityAr} />

        {/* Header: Name + Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={11} style={{ color: 'var(--accent)', flexShrink: 0 }} aria-hidden />
            <span style={{
              fontSize: '0.85rem', fontWeight: '700',
              color: isActive ? 'var(--accent-alt)' : 'var(--text-primary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: '90px'
            }}>
              {cityAr}
            </span>
          </div>
          <span style={{
            fontSize: '0.7rem', fontWeight: '600',
            color: 'var(--text-muted)', background: 'var(--bg-surface-1)',
            padding: '0.1rem 0.35rem', borderRadius: '4px',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {time}
          </span>
        </div>

        {/* Main Content: Meteo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 'auto', paddingBottom: '0.2rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '1.75rem', fontWeight: '800', lineHeight: 1,
              color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start'
            }}>
              {temp !== undefined ? Math.round(temp) : '--'}
              <span style={{ fontSize: '0.5em', marginTop: '0.1rem', marginRight: '0.1rem' }}>°</span>
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              {wInfo.label}
            </span>
          </div>

          <div style={{
            fontSize: '1.8rem', opacity: weather ? 1 : 0.3,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}>
            {wInfo.icon}
          </div>
        </div>

        {/* Decorative glass highlight */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-20%',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)',
          opacity: 0.15, pointerEvents: 'none'
        }} />
      </div>
    </Link>
  );
}

/* ─── GRID ───────────────────────────────────────────────────────── */
export default function CountryCitiesGrid({ cities = [], countrySlug, activeCitySlug = null }) {
  const [times, setTimes] = useState({});
  const [weather, setWeather] = useState({});

  // 1. Time ticking (limited to HH:mm for performance and UX focus)
  useEffect(() => {
    if (!cities.length) return;
    const tick = () => {
      const next = {};
      for (const c of cities) {
        const key = c.city_slug ?? c.slug ?? c.city_name_en;
        if (c.timezone) next[key] = getCityDisplayTimeShort(c.timezone);
      }
      setTimes(next);
    };
    tick();
    const id = setInterval(tick, 60_000); // Only need to update every minute now
    return () => clearInterval(id);
  }, [cities]);

  // 2. Weather Fetching (Batch) with sessionStorage cache (10 min TTL)
  useEffect(() => {
    if (!cities.length) return;

    let isMounted = true;
    const fetchWeather = async () => {
      // Filter cities that have valid lat/lon
      const validCities = cities.filter(c => c.lat != null && c.lon != null);
      if (validCities.length === 0) return;

      /* ── Cache check ── */
      const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      const mapping = {};
      const citiesToFetch = [];

      for (const c of validCities) {
        const key = c.city_slug ?? c.slug;
        const cacheKey = `meteo_${key}`;
        let found = false;
        try {
          if (typeof sessionStorage !== 'undefined') {
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
              const { ts, data } = JSON.parse(cached);
              if (now - ts < CACHE_TTL) {
                mapping[key] = data;
                found = true;
              }
            }
          }
        } catch { /* ignore */ }
        
        if (!found) {
          citiesToFetch.push(c);
        }
      }

      if (citiesToFetch.length === 0) {
        if (isMounted) setWeather(mapping);
        return;
      }

      /* ── Fetch missing from Open-Meteo ── */
      try {
        const lats = citiesToFetch.map(c => c.lat).join(',');
        const lons = citiesToFetch.map(c => c.lon).join(',');
        const url = `/api/weather?latitudes=${encodeURIComponent(lats)}&longitudes=${encodeURIComponent(lons)}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const responseData = await res.json();

        const results = Array.isArray(responseData) ? responseData : [responseData];
        citiesToFetch.forEach((c, i) => {
          const key = c.city_slug ?? c.slug;
          if (results[i]?.current) {
            mapping[key] = results[i].current;
            try {
              if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem(`meteo_${key}`, JSON.stringify({ ts: now, data: results[i].current }));
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
  }, [cities, countrySlug]);

  if (!cities.length) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 20vw, 190px), 1fr))',
      gap: '0.75rem',
    }}
      role="list"
      aria-label="قائمة المدن وحالة الطقس فيها"
    >
      {cities.map((city, idx) => {
        const key = city.city_slug ?? city.slug ?? idx;
        return (
          <div key={key} role="listitem">
            <CityCard
              city={city}
              time={times[city.city_slug ?? city.slug] ?? '--:--'}
              weather={weather[city.city_slug ?? city.slug]}
              countrySlug={countrySlug}
              isActive={activeCitySlug === (city.city_slug ?? city.slug)}
            />
          </div>
        );
      })}
    </div>
  );
}
