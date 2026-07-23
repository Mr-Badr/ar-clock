'use client';
/**
 * components/clocks/CountdownTicker.jsx
 *
 * Shared countdown display — used on /countdown, every /holidays/[slug]
 * event page, and every /holidays/country/[country] hub page. Redesigned
 * 2026-07 to fix two real bugs found during review:
 *
 * 1. UNIT ORDER: the old unit list was [seconds, minutes, hours, days],
 *    rendered left-to-right under a forced `direction: ltr` row. That reads
 *    as "seconds : minutes : hours" (smallest first) — backwards from the
 *    universal big-endian clock convention (days : hours : minutes : seconds).
 *    Fixed by ordering ALL_UNITS largest-to-smallest.
 * 2. FLICKERING DIGITS: the old implementation keyed each digit <span> by
 *    its character value (`${staggerIndex}-${pos}-${char}`), so React
 *    unmounted/remounted a digit every time its value changed, retriggering
 *    a CSS entrance animation every second. Combined with an `opacity: 0`
 *    gate that only flipped after a mount-count ref reached a magic number,
 *    this produced units that stayed invisible under real page-load
 *    conditions (confirmed via Puppeteer — minutes/hours/days routinely
 *    failed to render while seconds, the only unit whose value changes
 *    every tick, kept working). Fixed by rendering each unit's two-digit
 *    string as plain text content (no per-character remount) and dropping
 *    the mount-gate entirely — SSR already provides a correct initial
 *    value via `initialRemaining`, so there is nothing to hide.
 *
 * Also replaces the elastic/bounce easing (banned by DESIGN.md 21.1) with
 * the project's standard `--ease-default` curve, and unifies the old
 * "hero days number + divider + separate H:M:S row" two-tier mobile layout
 * into one consistent 4-unit row that scales fluidly via cqi — no more
 * container-query row-swapping, so there's one layout to reason about at
 * every width instead of two disconnected ones.
 *
 * SSR: zero <style> tags, all CSS in components.css. window only in effects.
 * Exports: default CountdownTicker · CountdownTickerSkeleton · ShareBar
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { CalendarDays, CheckCircle2, Fullscreen, Minimize2, ZoomIn, ZoomOut, Share2, Link2 } from 'lucide-react';
import DatePill from './DatePill';
import {
  exitActiveFullscreen,
  FULLSCREEN_LAYER_STYLE,
  FULLSCREEN_TITLE_STYLE,
  FULLSCREEN_TOOLBAR_STYLE,
  FULLSCREEN_UNIT_LABEL_STYLE,
  FULLSCREEN_ZOOM_GROUP_STYLE,
  FULLSCREEN_ZOOM_LABEL_STYLE,
  getActiveFullscreenElement,
  getFullscreenContentStyle,
  getFullscreenDigitStyle,
  getFullscreenRowStyle,
  getFullscreenScale,
  getFullscreenSeparatorStyle,
  getFullscreenUnitWrapStyle,
  getFullscreenZoomLabel,
  requestElementFullscreen,
  syncFullscreenDocumentState,
} from './fullscreenShared';
import { getCurrentPageUrl, useCopyFeedback } from '@/lib/share.client';

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */
function calcRem(targetMs) {
  const total = Math.max(0, targetMs - Date.now());
  if (!total) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1_000),
  };
}
function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

/* ─────────────────────────────────────────────────────────────────────
   CONSTANTS — largest unit first so the forced-LTR digit row reads as
   the universal "days : hours : minutes : seconds" clock convention.
───────────────────────────────────────────────────────────────────── */
const ALL_UNITS = [
  { key: 'days', label: 'يوم' },
  { key: 'hours', label: 'ساعة' },
  { key: 'minutes', label: 'دقيقة' },
  { key: 'seconds', label: 'ثانية' },
];

/* ─────────────────────────────────────────────────────────────────────
   UNIT — module-level. Digits render as one text node per unit (not one
   span per character), so a value change updates text content in place
   instead of unmounting/remounting nodes. CSS class ct-digit controls
   size via cqi (container-relative, not viewport).
───────────────────────────────────────────────────────────────────── */
function Unit({ value, label }) {
  return (
    <div className="ct-unit-group">
      <span suppressHydrationWarning className="ct-digit">{pad2(value)}</span>
      <span className="ct-unit-label" aria-hidden>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COLON — module-level, no animation
───────────────────────────────────────────────────────────────────── */
function Colon() {
  return <span className="ct-sep-char" aria-hidden>:</span>;
}

/* ─────────────────────────────────────────────────────────────────────
   TICKER ROW — one layout for every width. Sizing scales fluidly via
   cqi custom properties set on .ct-clock-card (see components.css), so
   mobile and desktop need no separate markup.
───────────────────────────────────────────────────────────────────── */
function TickerRow({ r }) {
  return (
    <div
      className="ct-row-unified"
      dir="ltr"
      role="timer"
      aria-label={`${r.days} يوم و ${r.hours} ساعة و ${r.minutes} دقيقة و ${r.seconds} ثانية`}
      aria-live="off"
    >
      {ALL_UNITS.map(({ key, label }, i) => (
        <div key={key} className="ct-unit-wrap">
          <Unit value={r[key]} label={label} />
          {i < ALL_UNITS.length - 1 && <Colon />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   TOOLBAR BUTTON — ghost icon button with a real CSS hover/focus/active
   state (class-based, so keyboard focus gets the same feedback as mouse
   hover — the old inline onMouseEnter/Leave handlers only reacted to
   the mouse).
───────────────────────────────────────────────────────────────────── */
function IconBtn({ onClick, label, title, children, disabled = false }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      title={title || label}
      disabled={disabled}
      className="ct-toolbar-btn"
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SHARE PLATFORMS
───────────────────────────────────────────────────────────────────── */
const PLATFORMS = [
  {
    id: 'whatsapp', label: 'واتساب',
    color: 'var(--success)', bg: 'var(--success-soft)', border: 'var(--success-border)',
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + '\n' + u)}`,
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
      </svg>
    ),
  },
  {
    id: 'telegram', label: 'تيليغرام',
    color: 'var(--blue)', bg: 'var(--blue-subtle)', border: 'var(--border-accent)',
    href: (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: 'twitter', label: 'X / تويتر',
    color: 'var(--text-primary)', bg: 'var(--bg-surface-3)', border: 'var(--border-default)',
    href: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'فيسبوك',
    color: 'var(--blue)', bg: 'var(--blue-subtle)', border: 'var(--border-accent)',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────────
   SHARE BAR — named export, used standalone on holiday pages too (not
   just here) — deliberately left structurally untouched by this pass so
   its appearance stays consistent across every page it already ships on.
   Root is <section> — no wrapper, no style tags. window.location resolved
   only after mount (never in render path).
───────────────────────────────────────────────────────────────────── */
function buildGoogleCalendarUrl(eventName, isoDate, pageUrl) {
  if (!isoDate) return null;
  const d = isoDate.split('T')[0].replace(/-/g, '');
  const nextDay = new Date(isoDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const end = nextDay.toISOString().split('T')[0].replace(/-/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventName,
    dates: `${d}/${end}`,
    details: pageUrl || '',
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildIcsDataUrl(eventName, isoDate, pageUrl) {
  if (!isoDate) return null;
  const d = isoDate.split('T')[0].replace(/-/g, '');
  const nextDay = new Date(isoDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const end = nextDay.toISOString().split('T')[0].replace(/-/g, '');
  const uid = `${d}-${encodeURIComponent(eventName)}@miqatona.com`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ميقاتنا//AR//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${eventName}`,
    `URL:${pageUrl || ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function ShareBar({ url, eventName, days, dateStr, eventISODate }) {
  const { copied, copy } = useCopyFeedback(2500);
  const [pageUrl, setPageUrl] = useState(url || '');

  useEffect(() => {
    if (!url) setPageUrl(getCurrentPageUrl());
  }, [url]);

  const shareText = `${eventName}: متبقي ${days} يوم (${dateStr})`;
  const gcalUrl = buildGoogleCalendarUrl(eventName, eventISODate, pageUrl);
  const icsUrl = buildIcsDataUrl(eventName, eventISODate, pageUrl);

  const handleCopy = async () => {
    await copy(pageUrl);
  };

  return (
    <section
      style={{
        marginBottom: 'var(--space-8)',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-5)',
        overflow: 'hidden',
        minWidth: 0,
      }}
      dir="rtl"
      aria-label="خيارات المشاركة"
    >
      <p style={{
        fontSize: 'var(--text-sm)',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--space-4)',
      }}>
        شارك هذه المناسبة
      </p>

      {/* Mobile: 2×2 grid; wider screens: all 4 in one row */}
      <div className="share-bar-grid" style={{
        display: 'grid',
        gap: 'var(--space-2)',
        marginBottom: 'var(--space-3)',
      }}>
        {PLATFORMS.map(({ id, label, color, bg, border, href, Icon }) => (
          <a
            key={id}
            href={href(pageUrl, shareText)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`مشاركة عبر ${label}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: 'var(--space-3) var(--space-2)',
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${border}`,
              background: bg,
              color,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <Icon />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </a>
        ))}
      </div>

      <button
        onClick={handleCopy}
        aria-label="نسخ الرابط"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-lg)',
          border: copied ? '1px solid var(--accent)' : '1px solid var(--border-default)',
          background: copied ? 'var(--accent-soft)' : 'var(--bg-surface-3)',
          color: copied ? 'var(--accent)' : 'var(--text-secondary)',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.18s',
        }}
      >
        <Link2 size={15} />
        {copied
          ? <span className="ct-copied-badge"><CheckCircle2 size={15} aria-hidden="true" /> تم نسخ الرابط</span>
          : <span>نسخ الرابط</span>
        }
      </button>

      {(gcalUrl || icsUrl) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: gcalUrl && icsUrl ? '1fr 1fr' : '1fr',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-2)',
        }}>
          {gcalUrl && (
            <a
              href={gcalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="أضف إلى تقويم جوجل"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.4rem', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface-3)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)', fontWeight: '600',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <CalendarDays size={14} />
              تقويم جوجل
            </a>
          )}
          {icsUrl && (
            <a
              href={icsUrl}
              download={`${eventName}.ics`}
              aria-label="تحميل ملف ICS للتقويم"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.4rem', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface-3)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)', fontWeight: '600',
                textDecoration: 'none', cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <CalendarDays size={14} />
              Apple / Outlook
            </a>
          )}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SKELETON — shown only while JS has not yet hydrated (no client fetch
   involved — SSR already renders the real numbers — but Suspense
   fallbacks and slow hydration can still show this briefly)
───────────────────────────────────────────────────────────────────── */
export function CountdownTickerSkeleton() {
  return (
    <div
      style={{
        borderRadius: '1rem',
        border: '1px solid var(--border-accent)',
        background: 'var(--clock-bg)',
        boxShadow: 'none',
        padding: 'clamp(1.25rem, 4vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '80px', height: '34px', borderRadius: '0.625rem', background: 'var(--bg-surface-4)' }} />
        <div style={{ width: '110px', height: '34px', borderRadius: '0.625rem', background: 'var(--bg-surface-4)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(0.75rem, 4vw, 2rem)', padding: '0.5rem 0' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 'clamp(48px, 11vw, 88px)', height: 'clamp(44px, 9vw, 80px)', borderRadius: '0.5rem', background: 'var(--bg-surface-4)' }} />
            <div style={{ width: '40px', height: '20px', borderRadius: '999px', background: 'var(--bg-surface-3)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '180px', height: '26px', borderRadius: '999px', background: 'var(--bg-surface-4)' }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COUNTDOWN TICKER — default export
───────────────────────────────────────────────────────────────────── */
export default function CountdownTicker({
  targetISO,
  initialRemaining,
  eventName = '',
  eventDate = '',
  whatsappUrl = '',
  totalDays = 365,
  isDark = true,
  dateAr = '',
  dateHijri = '',
}) {
  const targetMs = new Date(targetISO).getTime();

  /* ── State ── */
  const [rem, setRem] = useState(initialRemaining);
  const [isZero, setIsZero] = useState(false);
  const [entered, setEntered] = useState(false);
  const { copied: shareCopied, copy: copyShareUrl } = useCopyFeedback(2500);

  const tick = useCallback(() => {
    const next = calcRem(targetMs);
    setRem(next);
    if (!next.total) setIsZero(true);
  }, [targetMs]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [tick]);

  /* Single, simple card-entrance flag — no per-unit stagger, no key-based
     remount tricks. React StrictMode's mount→unmount→mount runs this twice
     in dev; setting the same boolean true both times is harmless. */
  useEffect(() => {
    setEntered(true);
  }, []);

  const r = rem;
  const pct = Math.max(2, Math.min(98, Math.round((1 - r.days / Math.max(totalDays, 1)) * 100)));

  /* ── Fullscreen + zoom ── */
  const containerRef = useRef(null);
  const [isFS, setIsFS] = useState(false);
  const [zoom, setZoom] = useState(1);
  const wakeLockRef = useRef(null);

  useEffect(() => {
    const onChange = () => {
      const active = !!getActiveFullscreenElement();
      if (!active) setIsFS(false);
    };
    const evts = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    evts.forEach(e => document.addEventListener(e, onChange));
    return () => evts.forEach(e => document.removeEventListener(e, onChange));
  }, []);

  useEffect(() => {
    syncFullscreenDocumentState(isFS);
    return () => syncFullscreenDocumentState(false);
  }, [isFS]);

  const toggleFS = async () => {
    if (!isFS) {
      const el = containerRef.current;
      if (!el) return;
      setZoom(1);
      await requestElementFullscreen(el);
      setIsFS(true);
    } else {
      await exitActiveFullscreen();
      setIsFS(false);
    }
  };

  /* ══ FULLSCREEN ENHANCEMENTS (WakeLock + Orientation) ══ */
  useEffect(() => {
    if (!isFS) return;
    // Force landscape on mobile
    try {
      if (screen.orientation?.lock) screen.orientation.lock('landscape').catch(() => { });
    } catch (e) { }
    // Prevent screen sleep
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) { }
    };
    requestWakeLock();
    const handleVisibility = () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLockRef.current) { wakeLockRef.current.release().catch(() => { }); wakeLockRef.current = null; }
      try { if (screen.orientation?.unlock) screen.orientation.unlock(); } catch (e) { }
    };
  }, [isFS]);

  const zoomIn = () => setZoom(z => Math.min(z + 1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 1, 0));
  const scaleValue = getFullscreenScale(zoom, 'fourUnit');
  const zoomLabel = getFullscreenZoomLabel(zoom);

  /* ── Share ── */
  const handleShare = async () => {
    await copyShareUrl(getCurrentPageUrl());
  };

  /* ── Zero state ── */
  if (isZero) {
    return (
      <div className="ct-zero-state">
        <CalendarDays size={44} strokeWidth={1.6} aria-hidden="true" className="ct-zero-icon" />
        <p className="ct-zero-title">المناسبة اليوم!</p>
        <p className="ct-zero-note">سيعرض العداد موعد السنة القادمة عند تحديث بيانات المناسبة.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="ct-outer">

      {/* ═══ FULLSCREEN ════════════════════════════════════════════════ */}
      {isFS && (
        <div
          className="fullscreen-mode"
          style={{ ...FULLSCREEN_LAYER_STYLE, background: 'var(--clock-bg)' }}
          dir="rtl"
        >
          <div className="fullscreen-exit" style={FULLSCREEN_TOOLBAR_STYLE}>
            <IconBtn onClick={toggleFS} label="إغلاق ملء الشاشة">
              <Minimize2 size={18} /><span>إغلاق</span>
            </IconBtn>
            <div style={FULLSCREEN_ZOOM_GROUP_STYLE}>
              <IconBtn onClick={zoomOut} label="تصغير" disabled={zoom === 0}><ZoomOut size={20} /></IconBtn>
              <span style={FULLSCREEN_ZOOM_LABEL_STYLE}>{zoomLabel}</span>
              <IconBtn onClick={zoomIn} label="تكبير" disabled={zoom === 2}><ZoomIn size={20} /></IconBtn>
            </div>
          </div>
          <div style={getFullscreenContentStyle(scaleValue)}>
            {eventName && (
              <h2 style={FULLSCREEN_TITLE_STYLE}>
                {eventName}
              </h2>
            )}
            <div className="ct-row-desktop" style={getFullscreenRowStyle(4)} dir="ltr">
              {ALL_UNITS.map(({ key, label }, i) => (
                <div key={key} style={getFullscreenUnitWrapStyle(4)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      suppressHydrationWarning
                      className="clock-display"
                      style={getFullscreenDigitStyle(4)}
                    >
                      {pad2(r[key])}
                    </span>
                    <span style={FULLSCREEN_UNIT_LABEL_STYLE}>{label}</span>
                  </div>
                  {i < ALL_UNITS.length - 1 && (
                    <span aria-hidden style={getFullscreenSeparatorStyle(4)}>:</span>
                  )}
                </div>
              ))}
            </div>
            <DatePill dateAr={dateAr || eventDate} dateHijri={dateHijri} />
          </div>
        </div>
      )}

      {/* ═══ NORMAL VIEW ═══════════════════════════════════════════════
          .ct-clock-card sets container-type: inline-size
          All digit sizes inside use cqi (card-relative, not viewport)
      ═══════════════════════════════════════════════════════════════ */}
      {!isFS && (
        <div className={`ct-stack${entered ? ' ct-stack--entered' : ''}`}>

          <div
            className="ct-clock-card"
            data-clock-variant="four-unit"
            style={{
              borderRadius: '1rem',
              border: '1px solid var(--border-accent)',
              background: 'var(--clock-bg)',
              boxShadow: 'none',
              padding: 'clamp(1.25rem, 3.5vh, 2rem) clamp(1.5rem, 4vw, 3rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.25rem, 3vh, 2rem)',
            }}
          >
            {/* Control bar */}
            <div className="ct-toolbar">
              <IconBtn onClick={toggleFS} label="فتح العداد بملء الشاشة" title="ملء الشاشة">
                <Fullscreen size={15} /><span>ملء الشاشة</span>
              </IconBtn>

              <button
                type="button"
                onClick={handleShare}
                aria-label="مشاركة"
                className={`ct-toolbar-btn${shareCopied ? ' ct-toolbar-btn--active' : ''}`}
              >
                <Share2 size={15} />
                <span className="ct-toolbar-btn__label">
                  {shareCopied ? <CheckCircle2 size={15} aria-hidden="true" /> : null}
                  {shareCopied ? 'تم النسخ' : 'مشاركة'}
                </span>
              </button>
            </div>

            <TickerRow r={r} />

            <DatePill dateAr={dateAr || eventDate} dateHijri={dateHijri} />
          </div>

          {/* Progress bar */}
          <div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--countdown" style={{ width: `${pct}%` }} />
            </div>
            <div aria-hidden className="ct-progress-caption">
              <span>الآن</span>
              <span suppressHydrationWarning>
                {r.days > 0
                  ? `${r.days} يوم${r.hours > 0 ? ` و ${r.hours} ساعة` : ''} متبقي`
                  : r.hours > 0
                    ? `${r.hours} ساعة و ${r.minutes} دقيقة متبقي`
                    : `${r.minutes} دقيقة و ${r.seconds} ثانية متبقي`
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
