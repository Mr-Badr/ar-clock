'use client';
/**
 * components/time-now/CountryCitiesGrid.jsx
 *
 * Live grid of city clocks for a country page.
 * Single setInterval updates all cities → one re-render per second.
 * Clicking a city navigates to /time-now/[country]/[city].
 * Active city is highlighted (when viewing the city-level page).
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getCityDisplayTime(tz) {
  try {
    const now   = new Date();
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      hour: '2-digit', hour12: false,
      minute: '2-digit',
      second: '2-digit',
    }).formatToParts(now);
    const get = (t) => parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
    const h   = get('hour');
    const m   = get('minute');
    const s   = get('second');

    const dateAr = new Intl.DateTimeFormat('ar', {
      timeZone: tz, weekday: 'short',
    }).format(now);

    const isNight = h < 6 || h >= 22;
    const h12     = h % 12 || 12;
    const ampm    = h >= 12 ? 'م' : 'ص';

    return { h, m, s, h12, ampm, dateAr, isNight,
      display: `${pad2(h12)}:${pad2(m)}:${pad2(s)}` };
  } catch { return null; }
}

/* ─── CITY CARD ─────────────────────────────────────────────────── */
function CityCard({ city, timeData, countrySlug, isActive }) {
  const slug   = city.city_slug ?? city.slug;
  const cityAr = city.city_name_ar ?? city.name_ar ?? city.name_en ?? slug;
  const td     = timeData;

  return (
    <Link
      href={`/time-now/${countrySlug}/${slug}`}
      aria-label={`الوقت الآن في ${cityAr}`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        padding:      'clamp(0.875rem, 2.5vw, 1.25rem)',
        borderRadius: '0.875rem',
        background:   isActive ? 'var(--accent-soft)'   : 'var(--bg-surface-2)',
        border:       isActive ? '1px solid var(--border-accent-strong)' : '1px solid var(--border-default)',
        display:      'flex',
        flexDirection:'column',
        gap:          '0.4rem',
        cursor:       'pointer',
        transition:   'transform 0.15s, border-color 0.15s, background 0.15s',
        position:     'relative',
        overflow:     'hidden',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--border-accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=isActive?'var(--border-accent-strong)':'var(--border-default)'; }}
      >
        {/* Capital badge */}
        {city.is_capital && (
          <span style={{
            position:'absolute', top:'0.5rem', left:'0.5rem',
            fontSize:'var(--text-2xs)', fontWeight:'700',
            color:'var(--accent-alt)', background:'var(--accent-soft)',
            padding:'0.1rem 0.4rem', borderRadius:'999px',
            border:'1px solid var(--border-accent)',
          }}>
            عاصمة
          </span>
        )}

        {/* City name */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
          <MapPin size={12} style={{ color:'var(--text-muted)', flexShrink:0 }} aria-hidden />
          <span style={{
            fontSize:'var(--text-sm)', fontWeight:'700',
            color: isActive ? 'var(--accent-alt)' : 'var(--text-primary)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          }}>
            {cityAr}
          </span>
        </div>

        {/* Time — only rendered when we have real data */}
        {td && (
          <>
            <div style={{
              fontSize:           'clamp(1.4rem, 4cqi, 2rem)',
              fontWeight:         '800',
              lineHeight:         1,
              color:              td.isNight ? 'var(--text-secondary)' : 'var(--clock-digit-color)',
              fontVariantNumeric: 'tabular-nums',
              direction:          'ltr',
              letterSpacing:      '0.04em',
            }}>
              {pad2(td.h12)}:{pad2(td.m)}
              <span style={{ fontSize:'0.5em', fontWeight:'600', color:'var(--text-muted)', marginRight:'0.3em' }}>
                {td.ampm}
              </span>
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{
                fontSize:'var(--text-xs)', color:'var(--text-muted)',
                fontVariantNumeric:'tabular-nums', direction:'ltr',
              }}>
                :{pad2(td.s)}
              </span>
              <span style={{ fontSize:'var(--text-xs)', color:'var(--text-muted)' }}>
                {td.isNight ? '🌙' : '☀️'} {td.dateAr}
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

/* ─── GRID ───────────────────────────────────────────────────────── */
export default function CountryCitiesGrid({ cities = [], countrySlug, activeCitySlug = null }) {
  const [times, setTimes] = useState({});

  useEffect(() => {
    if (!cities.length) return;
    const tick = () => {
      const next = {};
      for (const c of cities) {
        const key = c.city_slug ?? c.slug ?? c.city_name_en;
        if (c.timezone) next[key] = getCityDisplayTime(c.timezone);
      }
      setTimes(next);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [cities]);

  if (!cities.length) return null;

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(130px, 20vw, 180px), 1fr))',
      gap:                 '0.625rem',
    }}
      role="list"
      aria-label="مدن الدولة وأوقاتها"
    >
      {cities.map((city, idx) => (
        <div key={city.city_slug ?? city.slug ?? idx} role="listitem">
          <CityCard
            city={city}
            timeData={times[city.city_slug ?? city.slug] ?? null}
            countrySlug={countrySlug}
            isActive={activeCitySlug === (city.city_slug ?? city.slug)}
          />
        </div>
      ))}
    </div>
  );
}