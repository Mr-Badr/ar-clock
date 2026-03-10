'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getFlagEmoji, getSafeTimezone, isValidTimeZone } from '@/lib/country-utils';

/* ─── SHARED TICK ───────────────────────────────────────────────────
 * One single 1-second interval for the entire page.
 * Components subscribe by passing a callback; we call all of them.
 * This avoids 250 independent setIntervals.
 ─────────────────────────────────────────────────────────────────── */
const subscribers = new Set();
let tickerId = null;

function subscribeTick(fn) {
  subscribers.add(fn);
  if (!tickerId) tickerId = setInterval(() => subscribers.forEach(f => f()), 1000);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && tickerId) { clearInterval(tickerId); tickerId = null; }
  };
}

function getTimeStr(tz) {
  const resolved = getSafeTimezone(tz);
  if (!resolved) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: resolved,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  } catch { return null; }
}

/* ─── INTERSECTION-AWARE COUNTRY CARD ───────────────────────────────
 * Only computes & displays its time when it enters the viewport.
 * When off-screen: static DOM node, zero JS cost.
 ─────────────────────────────────────────────────────────────────── */
function CountryCard({ country_slug, country_code, name_ar, timezone }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(null);
  const displayFlag = useMemo(() => getFlagEmoji(country_code) || '\uD83C\uDF0D', [country_code]);

  /* Observe viewport intersection */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true); // SSR fallback
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Only subscribe to the shared tick when in viewport */
  useEffect(() => {
    if (!visible || !timezone) return;
    const refresh = () => setTime(getTimeStr(timezone));
    refresh(); // immediate
    return subscribeTick(refresh);
  }, [visible, timezone]);

  return (
    <Link
      ref={ref}
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
        contain: 'layout style', /* CSS containment for render perf */
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
        <span aria-hidden style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1 }}>{displayFlag}</span>
        <span style={{
          fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name_ar}</span>
      </div>

      <div style={{ flexShrink: 0, paddingRight: '0.2rem' }}>
        {visible && time ? (
          <span suppressHydrationWarning style={{
            fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-alt)',
            fontVariantNumeric: 'tabular-nums', direction: 'ltr', whiteSpace: 'nowrap',
          }}>
            {time}
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>--:--</span>
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

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
  gap: '0.45rem',
};

const PAGE_SIZE = 24;

export default function TimeNowClient({ arabCountries, worldCountries }) {
  const [worldPage, setWorldPage] = useState(1);

  const validArab = useMemo(
    () => arabCountries.filter(c => isValidTimeZone(c.timezone)),
    [arabCountries]
  );
  const validWorld = useMemo(
    () => worldCountries.filter(c => isValidTimeZone(c.timezone)),
    [worldCountries]
  );
  const visibleWorld = useMemo(
    () => validWorld.slice(0, worldPage * PAGE_SIZE),
    [validWorld, worldPage]
  );
  const hasMore = visibleWorld.length < validWorld.length;

  const loadMore = useCallback(() => setWorldPage(p => p + 1), []);

  return (
    <section aria-label="تصفح الدول">
      {/* ── Arab Countries ── */}
      <div style={{ marginBottom: '2rem' }}>
        <SectionHeading>📍 الدول العربية</SectionHeading>
        <div style={GRID_STYLE}>
          {validArab.map((c) => (
            <CountryCard key={c.country_slug} {...c} />
          ))}
        </div>
      </div>

      {/* ── World Countries (paginated) ── */}
      <div>
        <SectionHeading>🌐 دول العالم</SectionHeading>
        <div style={GRID_STYLE}>
          {visibleWorld.map((c) => (
            <CountryCard key={c.country_slug} {...c} />
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              onClick={loadMore}
              style={{
                padding: '0.6rem 2rem',
                borderRadius: '999px',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem', fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-surface-3)';
                e.currentTarget.style.borderColor = 'var(--border-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-surface-2)';
                e.currentTarget.style.borderColor = 'var(--border-default)';
              }}
            >
              تحميل المزيد ({validWorld.length - visibleWorld.length} دولة متبقية)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}


