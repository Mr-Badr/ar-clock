'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getOffset(tz) {
  try {
    // We use a fixed reference date instead of new Date() to avoid
    // Next.js hydration warnings (next-prerender-current-time-client).
    // The exact date doesn't matter for fetching a static offset like GMT+3.
    const refDate = new Date('2025-06-01T12:00:00Z');
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(refDate);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch { return ''; }
}

function getTimeStr(tz) {
  try {
    return new Intl.DateTimeFormat('ar', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date());
  } catch { return null; }
}

function useAllTimes(countries) {
  const [times, setTimes] = useState({});
  useEffect(() => {
    const tick = () => {
      const t = {};
      for (const c of countries) {
        if (!c.timezone) continue;
        const v = getTimeStr(c.timezone);
        if (v) t[c.country_slug] = v;
      }
      setTimes(t);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [countries]);
  return times;
}

function CountryCard({ country_slug, name_ar, flag, timezone, time }) {
  const offset = timezone ? getOffset(timezone) : '';
  return (
    <Link
      href={`/time-now/${country_slug}`}
      prefetch={false}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.5rem', padding: '0.7rem 1rem',
        borderRadius: '0.875rem',
        border: '1px solid var(--border-default)',
        background: 'var(--bg-surface-2)',
        textDecoration: 'none', color: 'inherit',
        transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-surface-3)';
        e.currentTarget.style.borderColor = 'var(--border-accent)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--bg-surface-2)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
        <span aria-hidden style={{ fontSize: '1.15rem', flexShrink: 0, lineHeight: 1 }}>{flag || '🌍'}</span>
        <span style={{
          fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name_ar}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '1px' }}>
        {time ? (
          <span suppressHydrationWarning style={{
            fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-alt)',
            fontVariantNumeric: 'tabular-nums', direction: 'ltr', whiteSpace: 'nowrap',
          }}>
            {time}
          </span>
        ) : null}
        {offset && (
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', direction: 'ltr', whiteSpace: 'nowrap' }}>
            {offset}
          </span>
        )}
      </div>
    </Link>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--text-muted)',
      margin: '0 0 0.75rem',
    }}>
      {children}
    </h2>
  );
}

export default function TimeNowClient({ arabCountries, worldCountries }) {
  const times = useAllTimes([...arabCountries, ...worldCountries]);

  return (
    <section aria-label="تصفح الدول">
      <div style={{ marginBottom: '2rem' }}>
        <SectionHeading>🌙 الدول العربية</SectionHeading>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '0.45rem',
        }}>
          {arabCountries.map((c) => (
            <CountryCard key={c.country_slug} {...c} time={times[c.country_slug]} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeading>🌍 دول العالم</SectionHeading>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '0.45rem',
        }}>
          {worldCountries.map((c) => (
            <CountryCard key={c.country_slug} {...c} time={times[c.country_slug]} />
          ))}
        </div>
      </div>
    </section>
  );
}
