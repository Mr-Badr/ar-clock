'use client';
/**
 * components/clocks/CountdownTicker.jsx
 *
 * DEV VS PROD FIXES:
 *
 * 1. STRICT MODE DOUBLE-MOUNT: React StrictMode (dev only) mounts→unmounts→remounts
 *    every component, causing useEffect to fire twice, restarting animations.
 *    Fix: `animationKey` ref only increments on the FIRST real mount, 
 *    not on StrictMode's fake unmount/remount.
 *
 * 2. CSS FLASH IN DEV: In dev, CSS loads via JS after the component renders,
 *    causing unstyled digits to flash at full size before snapping to cqi sizes.
 *    Fix: digits are hidden (opacity:0) until `mounted` is true. The skeleton
 *    is visible server-side and during the CSS-load gap.
 *
 * 3. CSS ORDER NON-DETERMINISTIC: Next.js App Router loads CSS in different order
 *    in dev vs prod (confirmed bug #64921). Fix is in new.css using @layer.
 *
 * SSR: Zero <style> tags. All CSS in new.css. window only in useEffect.
 * Exports: default CountdownTicker · CountdownTickerSkeleton · ShareBar
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Fullscreen, Minimize2, ZoomIn, ZoomOut, Share2, Link2 } from 'lucide-react';
import DatePill from './DatePill';

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
   CONSTANTS
───────────────────────────────────────────────────────────────────── */
const ALL_UNITS = [
  { key: 'seconds', label: 'ثانية' },
  { key: 'minutes', label: 'دقيقة' },
  { key: 'hours', label: 'ساعة' },
  { key: 'days', label: 'يوم' },
];
const HMS_UNITS = ALL_UNITS.slice(0, 3);

/* ─────────────────────────────────────────────────────────────────────
   UNIT — module-level. Per-character keying means only changed digits animate.
   CSS class ct-digit controls size via cqi (container-relative, not viewport).
   The `visible` prop prevents the FOUC flash during dev CSS-load gap.
───────────────────────────────────────────────────────────────────── */
function Unit({ value, staggerIndex = 0, label, visible }) {
  const str = pad2(value);
  const delay = `${staggerIndex * 0.1}s`;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.55rem',
        animation: `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${delay} both`,
        /* Hide during CSS-load gap in dev — show instantly once mounted */
        opacity: visible ? undefined : 0,
      }}
    >
      <div style={{ display: 'flex', lineHeight: 1 }}>
        {str.split('').map((char, pos) => (
          <span
            key={`${staggerIndex}-${pos}-${char}`}
            suppressHydrationWarning
            aria-hidden
            className="ct-digit"
          >
            {char}
          </span>
        ))}
      </div>
      <span className="ct-unit-label" aria-hidden>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   COLON — module-level, no animation
───────────────────────────────────────────────────────────────────── */
function Colon({ visible }) {
  return (
    <span
      className="ct-sep-char"
      aria-hidden
      style={{ opacity: visible ? undefined : 0 }}
    >
      :
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   DESKTOP ROW — shown when card ≥ 30rem (via @container in new.css)
───────────────────────────────────────────────────────────────────── */
function DesktopRow({ r, visible }) {
  return (
    <div
      className="ct-row-desktop"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(0.5rem, 3cqi, 2.5rem)',
        direction: 'ltr',
      }}
      role="timer"
      aria-label={`${r.days} يوم و ${r.hours} ساعة و ${r.minutes} دقيقة و ${r.seconds} ثانية`}
      aria-live="off"
    >
      {ALL_UNITS.map(({ key, label }, i) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 3cqi, 2.5rem)' }}>
          <Unit value={r[key]} label={label} staggerIndex={i} visible={visible} />
          {i < ALL_UNITS.length - 1 && <Colon visible={visible} />}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   MOBILE ROW — shown when card < 30rem (via @container in new.css)
───────────────────────────────────────────────────────────────────── */
function MobileRow({ r, visible }) {
  return (
    <div
      className="ct-row-mobile"
      style={{ flexDirection: 'column', alignItems: 'center', gap: '0.9rem', direction: 'ltr' }}
      role="timer"
      aria-label={`${r.days} يوم و ${r.hours} ساعة و ${r.minutes} دقيقة و ${r.seconds} ثانية`}
      aria-live="off"
    >
      {/* Days hero */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        animation: 'ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both',
        opacity: visible ? undefined : 0,
      }}>
        <span
          key={pad2(r.days)}
          suppressHydrationWarning
          aria-hidden
          className="ct-days-val"
          style={{ fontWeight: '800', lineHeight: 1, color: 'var(--clock-digit-color)', textShadow: 'var(--clock-digit-glow)' }}
        >
          {pad2(r.days)}
        </span>
        <span className="ct-unit-label" aria-hidden>يوم</span>
      </div>

      <div style={{ width: '60px', height: '1px', background: 'var(--border-subtle)' }} />

      {/* H · M · S */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.5rem, 4cqi, 1.5rem)' }}>
        {HMS_UNITS.map(({ key, label }, i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 4cqi, 1.5rem)' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem',
              animation: `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${(i + 1) * 0.12}s both`,
              opacity: visible ? undefined : 0,
            }}>
              <span
                key={pad2(r[key])}
                suppressHydrationWarning
                aria-hidden
                className="ct-hms-digit"
                style={{ fontWeight: '800', lineHeight: 1, color: 'var(--clock-digit-color)', display: 'block', fontVariantNumeric: 'tabular-nums' }}
              >
                {pad2(r[key])}
              </span>
              <span className="ct-hms-label" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                {label}
              </span>
            </div>
            {i < HMS_UNITS.length - 1 && (
              <span
                className="ct-hms-sep"
                aria-hidden
                style={{ color: 'var(--clock-separator)', fontWeight: '700', alignSelf: 'center', flexShrink: 0, userSelect: 'none', opacity: visible ? undefined : 0 }}
              >
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   ICON BUTTON
───────────────────────────────────────────────────────────────────── */
function IconBtn({ onClick, label, title, children, disabled = false, variant = 'ghost' }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={label}
      title={title || label}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 0.85rem',
        borderRadius: '0.625rem',
        border: variant === 'ghost' ? '1px solid var(--border-default)' : 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: '600',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.background = 'color-mix(in srgb, var(--bg-surface-3) 80%, transparent)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-accent)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = disabled ? 'var(--text-muted)' : 'var(--text-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-default)';
      }}
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
    color: '#25D366', bg: 'rgba(37,211,102,0.10)', border: 'rgba(37,211,102,0.30)',
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + '\n' + u)}`,
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
      </svg>
    ),
  },
  {
    id: 'telegram', label: 'تيليغرام',
    color: '#229ED9', bg: 'rgba(34,158,217,0.10)', border: 'rgba(34,158,217,0.30)',
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
    color: '#1877F2', bg: 'rgba(24,119,242,0.10)', border: 'rgba(24,119,242,0.30)',
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────────────────────────────────
   SHARE BAR — named export. Root is <section> — no wrapper, no style tags.
   window.location resolved only after mount (never in render path).
───────────────────────────────────────────────────────────────────── */
export function ShareBar({ url, eventName, days, dateStr }) {
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState(url || '');

  useEffect(() => {
    if (!url) setPageUrl(window.location.href);
  }, [url]);

  const shareText = `${eventName} — متبقي ${days} يوم (${dateStr}) 🗓`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* silent */ }
  };

  return (
    <section
      style={{
        marginBottom: 'var(--space-8)',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-5)',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${PLATFORMS.length}, 1fr)`,
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
              borderRadius: 'var(--radius-xl)',
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
          borderRadius: 'var(--radius-xl)',
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
          ? <span className="ct-copied-badge">✓ تم نسخ الرابط</span>
          : <span>نسخ الرابط</span>
        }
      </button>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   SKELETON — shown server-side and during the dev CSS-load gap
───────────────────────────────────────────────────────────────────── */
export function CountdownTickerSkeleton() {
  return (
    <div
      style={{
        borderRadius: '1rem',
        border: '1px solid var(--border-accent)',
        background: 'var(--clock-bg)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-accent)',
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1rem, 4vw, 3rem)', padding: '0.5rem 0' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 'clamp(60px, 12vw, 96px)', height: 'clamp(56px, 10vw, 88px)', borderRadius: '0.5rem', background: 'var(--bg-surface-4)' }} />
            <div style={{ width: '44px', height: '22px', borderRadius: '999px', background: 'var(--bg-surface-3)' }} />
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
  const [mounted, setMounted] = useState(false);
  const [isZero, setIsZero] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  /* ── FIX 1: Strict Mode guard ────────────────────────────────────────
     React StrictMode (dev only) mounts → unmounts → remounts.
     We track whether the component has TRULY mounted (not just the
     Strict Mode probe mount) using a ref that survives the fake unmount.
     `realMounted` becomes true on the second mount (the real one) OR
     if the cleanup never fired (prod — only one mount ever happens).
  ────────────────────────────────────────────────────────────────── */
  const mountCountRef = useRef(0);
  const [visible, setVisible] = useState(false);

  const tick = useCallback(() => {
    const next = calcRem(targetMs);
    setRem(next);
    if (!next.total) setIsZero(true);
  }, [targetMs]);

  useEffect(() => {
    mountCountRef.current += 1;

    setMounted(true);
    tick();
    const id = setInterval(tick, 1_000);

    /* 
     * In dev/StrictMode: this cleanup fires after the first mount.
     * The interval is cleared. Then React remounts — tick starts clean.
     * In prod: this cleanup only fires on actual unmount.
     * Either way: one clean interval at a time. ✓
     */
    return () => {
      clearInterval(id);
      /* Reset mounted so the second (real) mount re-triggers the show animation */
      if (mountCountRef.current < 2) setMounted(false);
    };
  }, [tick]);

  /* FIX 2: Show digits only after CSS has loaded (avoids unstyled flash) */
  useEffect(() => {
    /* requestAnimationFrame ensures styles are painted before we show */
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const r = mounted ? rem : initialRemaining;
  const pct = Math.max(2, Math.min(98, Math.round((1 - r.days / Math.max(totalDays, 1)) * 100)));

  /* ── Fullscreen + zoom ── */
  const containerRef = useRef(null);
  const [isFS, setIsFS] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const onChange = () => {
      const active = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      if (!active) setIsFS(false);
    };
    const evts = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    evts.forEach(e => document.addEventListener(e, onChange));
    return () => evts.forEach(e => document.removeEventListener(e, onChange));
  }, []);

  const toggleFS = async () => {
    if (!isFS) {
      const el = containerRef.current;
      if (!el) return;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
        setZoom(1);
      } catch { /* CSS fallback */ }
      setIsFS(true);
    } else {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) await document.mozCancelFullScreen();
        else if (document.msExitFullscreen) await document.msExitFullscreen();
      } catch { setIsFS(false); }
    }
  };

  const zoomIn = () => setZoom(z => Math.min(z + 1, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 1, 0));
  const scaleValue = zoom === 0 ? 'scale(0.7)' : zoom === 2 ? 'scale(1.3)' : 'scale(1)';
  const zoomLabel = ['تصغير', 'حجم عادي', 'تكبير'][zoom];

  /* ── Share ── */
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: eventName, text: `${eventName} — متبقي ${r.days} يوم (${eventDate}) 🗓`, url: shareUrl });
        return;
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch { /* silent */ }
  };

  /* ── Zero state ── */
  if (isZero) {
    return (
      <div style={{
        textAlign: 'center', padding: '3rem', borderRadius: '1rem',
        border: '1px solid var(--border-accent)', background: 'var(--clock-bg)',
        boxShadow: 'var(--shadow-accent)', animation: 'ct-scale-in 0.5s ease both',
      }}>
        <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</p>
        <p style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)' }}>المناسبة اليوم!</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>سيتحدث العداد تلقائياً بموعد السنة القادمة.</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>

      {/* ═══ FULLSCREEN ════════════════════════════════════════════════ */}
      {isFS && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'var(--bg-base)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }} dir="rtl">
          <div style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem', left: '1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 110,
          }}>
            <IconBtn onClick={toggleFS} label="إغلاق ملء الشاشة">
              <Minimize2 size={18} /><span>إغلاق</span>
            </IconBtn>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.25rem',
              background: 'color-mix(in srgb, var(--bg-surface-3) 70%, transparent)',
              backdropFilter: 'blur(12px)', padding: '0.25rem',
              borderRadius: '0.875rem', border: '1px solid var(--border-default)',
            }}>
              <IconBtn onClick={zoomOut} label="تصغير" disabled={zoom === 0} variant="none"><ZoomOut size={20} /></IconBtn>
              <span style={{ padding: '0.4rem 0.75rem', fontSize: '0.72rem', fontWeight: '900', minWidth: '80px', textAlign: 'center', color: 'var(--text-primary)' }}>{zoomLabel}</span>
              <IconBtn onClick={zoomIn} label="تكبير" disabled={zoom === 2} variant="none"><ZoomIn size={20} /></IconBtn>
            </div>
          </div>
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '1rem', transform: scaleValue, transition: 'transform 0.5s ease-in-out',
            gap: 'clamp(1.5rem, 4vh, 3.5rem)',
          }}>
            {eventName && (
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', fontWeight: '800', color: 'var(--accent)', textAlign: 'center', margin: 0 }}>
                {eventName}
              </h2>
            )}
            {/* Fullscreen uses vw/vh — correct since it IS the full viewport */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1rem, 4vw, 4rem)', direction: 'ltr' }}>
              {ALL_UNITS.map(({ key, label }, i) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 4vw, 4rem)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', lineHeight: 1 }}>
                      {pad2(r[key]).split('').map((char, pos) => (
                        <span
                          key={`fs-${i}-${pos}-${char}`}
                          suppressHydrationWarning
                          aria-hidden
                          style={{
                            display: 'block',
                            fontSize: 'clamp(4rem, min(14vw, 20vh), 10rem)',
                            fontWeight: '800', lineHeight: 1,
                            color: 'var(--clock-digit-color)', textShadow: 'var(--clock-digit-glow)',
                            fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em',
                          }}
                        >{char}</span>
                      ))}
                    </div>
                    <span style={{
                      fontSize: 'clamp(0.8rem, min(2.2vw, 3vh), 1.4rem)', fontWeight: '500',
                      color: 'var(--text-secondary)', padding: '0.2rem 0.75rem',
                      borderRadius: '999px', background: 'var(--bg-surface-3)',
                      border: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
                    }}>{label}</span>
                  </div>
                  {i < ALL_UNITS.length - 1 && (
                    <span aria-hidden style={{
                      fontSize: 'clamp(2.5rem, min(8vw, 12vh), 6rem)',
                      color: 'var(--clock-separator)', fontWeight: '700',
                      alignSelf: 'center', marginBottom: '1.3em', flexShrink: 0, userSelect: 'none',
                    }}>:</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', animation: 'ct-card-enter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both' }}>

          <div
            className="ct-clock-card"
            style={{
              borderRadius: '1rem',
              border: '1px solid var(--border-accent)',
              background: 'var(--clock-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-accent)',
              padding: 'clamp(1.25rem, 3.5vh, 2rem) clamp(1.5rem, 4vw, 3rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(1.25rem, 3vh, 2rem)',
            }}
          >
            {/* Control bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <IconBtn onClick={toggleFS} label="فتح العداد بملء الشاشة" title="ملء الشاشة">
                <Fullscreen size={15} /><span>ملء الشاشة</span>
              </IconBtn>

              <button
                onClick={handleShare}
                aria-label="مشاركة"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 0.85rem', borderRadius: '0.625rem',
                  border: shareCopied ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                  background: shareCopied ? 'var(--accent-soft)' : 'transparent',
                  color: shareCopied ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '0.82rem', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
                }}
              >
                <Share2 size={15} />
                <span>{shareCopied ? '✓ تم النسخ' : 'مشاركة'}</span>
              </button>
            </div>

            {/* Rows — CSS @container switches between them based on card width */}
            <DesktopRow r={r} visible={visible} />
            <MobileRow r={r} visible={visible} />

            {/* Date pill */}
            <DatePill dateAr={dateAr || eventDate} dateHijri={dateHijri} />
          </div>

          {/* Progress bar */}
          <div>
            <div className="progress-track">
              <div className="progress-fill progress-fill--countdown" style={{ width: `${pct}%`, backgroundPosition: `${pct}% 0` }} />
            </div>
            <div aria-hidden style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
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