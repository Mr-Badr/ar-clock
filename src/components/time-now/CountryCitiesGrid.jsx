'use client';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  MapPin,
  Moon,
  Sun,
  Thermometer,
} from 'lucide-react';

const getWeatherInfo = (wCode, isDay) => {
  const map = {
    0: { label: 'صافي', Icon: isDay ? Sun : Moon },
    1: { label: 'صافي غالباً', Icon: isDay ? CloudSun : CloudMoon },
    2: { label: 'غائم جزئياً', Icon: isDay ? CloudSun : CloudMoon },
    3: { label: 'غائم', Icon: Cloud },
    45: { label: 'ضباب', Icon: CloudFog },
    48: { label: 'ضباب جليدي', Icon: CloudFog },
    51: { label: 'رذاذ خفيف', Icon: CloudRain },
    53: { label: 'رذاذ متوسط', Icon: CloudRain },
    55: { label: 'رذاذ كثيف', Icon: CloudRain },
    61: { label: 'مطر خفيف', Icon: CloudRain },
    63: { label: 'مطر متوسط', Icon: CloudRain },
    65: { label: 'مطر غزير', Icon: CloudRain },
    71: { label: 'ثلوج خفيفة', Icon: CloudSnow },
    73: { label: 'ثلوج متوسطة', Icon: CloudSnow },
    75: { label: 'ثلوج كثيفة', Icon: CloudSnow },
    80: { label: 'زخات خفيفة', Icon: CloudRain },
    81: { label: 'زخات متوسطة', Icon: CloudRain },
    82: { label: 'زخات عنيفة', Icon: CloudRain },
    95: { label: 'عواصف رعدية', Icon: CloudLightning },
  };
  return map[wCode] || { label: 'غير معروف', Icon: Thermometer };
};

function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function parseCachedWeatherEntry(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    const timestamp = parsedValue?.ts;
    const data = parsedValue?.data;

    if (!Number.isFinite(timestamp) || !data || typeof data !== 'object') {
      return null;
    }

    return {
      ts: timestamp,
      data,
    };
  } catch {
    return null;
  }
}

async function parseWeatherResponse(response) {
  const body = await response.text();
  if (!body.trim()) {
    return null;
  }

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

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

function getCityKey(city, fallbackIndex) {
  return city?.city_slug ?? city?.slug ?? city?.city_name_en ?? city?.name_en ?? `city-${fallbackIndex}`;
}

function getCityDisplayName(city, fallbackKey) {
  return city?.city_name_ar ?? city?.name_ar ?? city?.name_en ?? fallbackKey;
}

function isValidCity(city) {
  return Boolean(
    city
      && typeof city === 'object'
      && (city.city_slug || city.slug || city.city_name_en || city.name_en)
      && (city.city_name_ar || city.name_ar || city.name_en || city.city_slug || city.slug),
  );
}

function hasValidCoordinates(city) {
  return Number.isFinite(Number(city?.lat)) && Number.isFinite(Number(city?.lon));
}

/* ─── CITY CARD ─────────────────────────────────────────────────── */
function CityCard({ city, time, weather, countrySlug, isActive }) {
  const slug = city.city_slug ?? city.slug;
  const cityAr = getCityDisplayName(city, slug);

  const temp = weather?.temperature_2m;
  const wCode = weather?.weather_code ?? 0;
  const isDay = weather?.is_day ?? 1;
  const wInfo = getWeatherInfo(wCode, isDay);
  const WeatherIcon = wInfo.Icon;

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
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-lg)',
          background: isActive ? 'var(--accent-soft)' : 'var(--bg-surface-2)',
          border: isActive ? '1px solid var(--border-accent-strong)' : '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '110px',
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
            opacity: weather ? 1 : 0.3,
            color: 'var(--accent-alt)',
            filter: 'none',
          }}>
            <WeatherIcon size={28} strokeWidth={1.75} aria-hidden="true" />
          </div>
        </div>

      </div>
    </Link>
  );
}

/* ─── GRID ───────────────────────────────────────────────────────── */
export default function CountryCitiesGrid({ cities, countrySlug, activeCitySlug }) {
  const [times, setTimes] = useState({});
  const [weather, setWeather] = useState({});
  const safeCities = useMemo(
    () => (Array.isArray(cities) ? cities.filter(isValidCity) : []),
    [cities],
  );

  // 1. Time ticking (limited to HH:mm for performance and UX focus)
  useEffect(() => {
    if (safeCities.length === 0) return;
    const tick = () => {
      const next = {};
      for (const c of safeCities) {
        const key = getCityKey(c, 0);
        if (c.timezone) next[key] = getCityDisplayTimeShort(c.timezone);
      }
      setTimes(next);
    };
    tick();
    const id = setInterval(tick, 60_000); // Only need to update every minute now
    return () => clearInterval(id);
  }, [safeCities]);

  // 2. Weather Fetching (Batch) with sessionStorage cache (10 min TTL)
  useEffect(() => {
    if (safeCities.length === 0) return;

    let isMounted = true;
    const fetchWeather = async () => {
      // Filter cities that have valid lat/lon
      const validCities = safeCities.filter(hasValidCoordinates);
      if (validCities.length === 0) return;

      /* ── Cache check ── */
      const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      const mapping = {};
      const citiesToFetch = [];

      for (const [index, c] of validCities.entries()) {
        const key = getCityKey(c, index);
        const cacheKey = `meteo_${key}`;
        let found = false;
        try {
          if (typeof sessionStorage !== 'undefined') {
            const cached = sessionStorage.getItem(cacheKey);
            const parsedCacheEntry = parseCachedWeatherEntry(cached);
            if (parsedCacheEntry) {
              const { ts, data } = parsedCacheEntry;
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
        if (!res.ok) {
          console.warn('[Meteo] Fetch failed', {
            status: res.status,
            cityCount: citiesToFetch.length,
          });
          return;
        }
        const responseData = await parseWeatherResponse(res);
        if (!responseData) {
          console.warn('[Meteo] Empty weather response', {
            cityCount: citiesToFetch.length,
          });
          return;
        }

        const results = Array.isArray(responseData) ? responseData : [responseData];
        citiesToFetch.forEach((c, i) => {
          const key = getCityKey(c, i);
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
        console.warn('[Meteo] Fetch failed', {
          countrySlug,
          cityCount: citiesToFetch.length,
          error: err,
        });
      }
    };

    fetchWeather();
    return () => { isMounted = false; };
  }, [safeCities, countrySlug]);

  if (safeCities.length === 0) {
    return (
      <div
        role="status"
        style={{
          padding: 'var(--space-5)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface-2)',
          color: 'var(--text-secondary)',
          lineHeight: 1.8,
        }}
      >
        لم تتوفر قائمة مدن قابلة للعرض الآن. استخدم البحث أعلى الصفحة للوصول إلى المدينة مباشرة، أو افتح صفحة الدولة لاحقاً بعد تحديث البيانات.
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 20vw, 190px), 1fr))',
      gap: '0.75rem',
    }}
      role="list"
      aria-label="قائمة المدن وحالة الطقس فيها"
    >
      {safeCities.map((city, idx) => {
        const key = getCityKey(city, idx);
        return (
          <div key={key} role="listitem">
            <CityCard
              city={city}
              time={times[key] ?? '--:--'}
              weather={weather[key]}
              countrySlug={countrySlug}
              isActive={activeCitySlug === (city.city_slug ?? city.slug)}
            />
          </div>
        );
      })}
    </div>
  );
}
