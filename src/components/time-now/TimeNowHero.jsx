'use client';
/**
 * components/time-now/TimeNowHero.jsx
 *
 * The large live-clock hero block for /time-now/[country]/[city] pages.
 * Shows: HH·MM·SS · Gregorian date · Hijri date · UTC offset · timezone name
 *
 * Design: inherits CountdownTicker's ct-clock-card shell + ct-digit cqi sizing.
 * Added: inline city-switcher breadcrumb + share button.
 *
 * Props:
 *   ianaTimezone  — IANA timezone string e.g. "Africa/Cairo"
 *   cityNameAr    — Arabic city name e.g. "القاهرة"
 *   countryNameAr — Arabic country name e.g. "مصر"
 *   utcOffset     — UTC offset string e.g. "UTC+2"
 *   tzLabel       — English TZ name e.g. "Eastern European Time"
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { Fullscreen, Minimize2, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import DatePill from '../clocks/DatePill';
import {
  exitActiveFullscreen,
  FULLSCREEN_LAYER_STYLE,
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
} from '../clocks/fullscreenShared';
import { getFlagEmoji, getSafeTimezone } from '@/lib/country-utils';
import { getCurrentPageUrl, useCopyFeedback } from '@/lib/share.client';

/* ─── HELPERS ───────────────────────────────────────────────────────── */
function pad2(n) { return String(Math.max(0, n)).padStart(2, '0'); }

function getTimeData(tz) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    hour: '2-digit', hour12: false,
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(now);
  const get = (t) => parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);

  const dateAr = new Intl.DateTimeFormat('ar-u-nu-latn', {
    timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(now);

  const dateHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
    timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(now);

  return {
    h: get('hour'), m: get('minute'), s: get('second'),
    dateAr, dateHijri,
  };
}

/* ─── DIGIT UNIT ─────────────────────────────────────────────────── */
function Unit({ value, label, staggerIndex, visible }) {
  const str = pad2(value);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55rem',
      animation: `ct-unit-enter 0.6s cubic-bezier(0.175,0.885,0.32,1.275) ${staggerIndex * 0.1}s both`,
      opacity: visible ? undefined : 0,
    }}>
      <div style={{ display: 'flex', lineHeight: 1 }}>
        {str.split('').map((ch, i) => (
          <span
            key={`${staggerIndex}-${i}-${ch}`}
            suppressHydrationWarning aria-hidden
            className="ct-digit"
          >
            {ch}
          </span>
        ))}
      </div>
      <span className="ct-unit-label" aria-hidden>{label}</span>
    </div>
  );
}

function Colon({ visible }) {
  return <span className="ct-sep-char" aria-hidden style={{ opacity: visible ? undefined : 0 }}>:</span>;
}

const UNITS = [
  { key: 'h', label: 'ساعة' },
  { key: 'm', label: 'دقيقة' },
  { key: 's', label: 'ثانية' },
];

/* ─── ICON BUTTON ────────────────────────────────────────────────── */
function IconBtn({ onClick, label, children, disabled, variant = 'ghost' }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      aria-label={label} disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.5rem 0.85rem', borderRadius: '0.625rem',
        border: variant === 'ghost' ? '1px solid var(--border-default)' : 'none',
        background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
        fontSize: '0.82rem', fontWeight: '600',
        opacity: disabled ? 0.4 : 1, transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'color-mix(in srgb, var(--bg-surface-3) 80%, transparent)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; } }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = disabled ? 'var(--text-muted)' : 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
    >
      {children}
    </button>
  );
}

/* ─── TIME NOW HERO ──────────────────────────────────────────────── */

/* Shared styles for hydration parity */
const HERO_WRAPPER_STYLE = { position: 'relative', width: '100%' };
const HERO_CARD_STYLE = {
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
};

export default function TimeNowHero({
  ianaTimezone,
  cityNameAr,
  countryNameAr,
  countryCode,
}) {
  const [td, setTd] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isFS, setIsFS] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef(null);
  const wakeLockRef = useRef(null);
  const { copied: shareCopied, copy: copyShareUrl } = useCopyFeedback(2500);

  const [mounted, setMounted] = useState(false);

  const activeTz = useMemo(() => getSafeTimezone(ianaTimezone) || ianaTimezone, [ianaTimezone]);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setTd(getTimeData(activeTz));
      setVisible(true);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [activeTz]);

  useEffect(() => {
    const onChange = () => {
      const active = !!getActiveFullscreenElement();
      if (!active) setIsFS(false);
    };
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(e => document.addEventListener(e, onChange));
    return () => ['fullscreenchange', 'webkitfullscreenchange'].forEach(e => document.removeEventListener(e, onChange));
  }, []);

  useEffect(() => {
    syncFullscreenDocumentState(isFS);
    return () => syncFullscreenDocumentState(false);
  }, [isFS]);

  /* ══ FULLSCREEN ENHANCEMENTS (Wake lock & Rotation) ══ */
  useEffect(() => {
    if (!isFS) return;

    // 1. Force Landscape Orientation
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => { });
      }
    } catch (e) { }

    // 2. Prevent Screen from sleeping
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) { }
    };
    requestWakeLock();

    // Handle tab switching returning
    const handleVisibilityChange = () => {
      if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => { });
        wakeLockRef.current = null;
      }
      try {
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (e) { }
    };
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

  const handleShare = async () => {
    await copyShareUrl(getCurrentPageUrl());
  };

  const scaleValue = getFullscreenScale(zoom, 'threeUnit');
  const zoomLabel = getFullscreenZoomLabel(zoom);
  const t = td ?? { h: 0, m: 0, s: 0, dateAr: '', dateHijri: '' };

  /* ══ MOUNT CHECK ══ */
  if (!mounted) {
    return (
      <div style={HERO_WRAPPER_STYLE}>
        <div
          className="ct-clock-card"
          style={{ ...HERO_CARD_STYLE, height: '320px', opacity: 0.5, animation: 'none' }}
        />
      </div>
    );
  }

  /* ══ FULLSCREEN ══ */
  if (isFS) {
    return (
      <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
        <div className="fullscreen-mode" style={{
          ...FULLSCREEN_LAYER_STYLE,
          background: 'var(--clock-bg)',
        }} dir="rtl">
          <div style={FULLSCREEN_TOOLBAR_STYLE}>
            <IconBtn onClick={toggleFS} label="إغلاق ملء الشاشة"><Minimize2 size={18} /><span>إغلاق</span></IconBtn>
            <div style={FULLSCREEN_ZOOM_GROUP_STYLE}>
              <IconBtn onClick={() => setZoom(z => Math.max(z - 1, 0))} label="تصغير" disabled={zoom === 0} variant="none"><ZoomOut size={20} /></IconBtn>
              <span style={FULLSCREEN_ZOOM_LABEL_STYLE}>{zoomLabel}</span>
              <IconBtn onClick={() => setZoom(z => Math.min(z + 1, 2))} label="تكبير" disabled={zoom === 2} variant="none"><ZoomIn size={20} /></IconBtn>
            </div>
          </div>

          <div style={getFullscreenContentStyle(scaleValue)}>
            <div className="ct-row-desktop" style={getFullscreenRowStyle(3)}>
              {UNITS.map(({ key, label }, i) => (
                <div key={key} style={getFullscreenUnitWrapStyle(3)}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', lineHeight: 1 }}>
                      {pad2(t[key]).split('').map((ch, pos) => (
                        <span key={`fs-${i}-${pos}-${ch}`} suppressHydrationWarning aria-hidden style={getFullscreenDigitStyle(3)}>{ch}</span>
                      ))}
                    </div>
                    <span style={FULLSCREEN_UNIT_LABEL_STYLE}>{label}</span>
                  </div>
                  {i < UNITS.length - 1 && <span aria-hidden style={getFullscreenSeparatorStyle(3)}>:</span>}
                </div>
              ))}
            </div>

            <DatePill dateAr={t.dateAr} dateHijri={t.dateHijri} />
          </div>
        </div>
      </div>
    );
  }

  /* ══ NORMAL VIEW ══ */
  return (
    <div ref={containerRef} style={HERO_WRAPPER_STYLE}>
      <div
        className="ct-clock-card"
        style={{
          ...HERO_CARD_STYLE,
          animation: 'ct-card-enter 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both'
        }}
        suppressHydrationWarning
      >
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconBtn onClick={toggleFS} label="ملء الشاشة" title="ملء الشاشة">
            <Fullscreen size={15} /><span>ملء الشاشة</span>
          </IconBtn>

          <button
            onClick={handleShare} aria-label="مشاركة الوقت"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '0.625rem', border: shareCopied ? '1px solid var(--accent)' : '1px solid var(--border-default)', background: shareCopied ? 'var(--accent-soft)' : 'transparent', color: shareCopied ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
          >
            <Share2 size={15} />
            <span>{shareCopied ? '✓ تم النسخ' : 'مشاركة'}</span>
          </button>
        </div>

        {/* Location label */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: '999px', background: 'var(--accent-soft)', border: '1px solid var(--border-accent)' }}>
            {countryCode && <span style={{ fontSize: '1.1rem' }} aria-hidden>{getFlagEmoji(countryCode)}</span>}
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '700', color: 'var(--accent-alt)' }}>
              {cityNameAr}{countryNameAr ? `، ${countryNameAr}` : ''}
            </span>
          </div>
        </div>

        {/* ─── DESKTOP ROW ─── */}
        <div
          className="ct-row-desktop"
          style={{
            alignItems: 'center', justifyContent: 'center', gap: 'clamp(0.5rem, 3cqi, 2.5rem)', direction: 'ltr',
            opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.98)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
          role="timer" aria-live="off"
          aria-label={`الوقت الان في ${cityNameAr}: ${pad2(t.h)} ساعة و ${pad2(t.m)} دقيقة و ${pad2(t.s)} ثانية`}
        >
          {UNITS.map(({ key, label }, i) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 3cqi, 2.5rem)' }}>
              <Unit value={t[key]} label={label} staggerIndex={i} visible={visible} />
              {i < UNITS.length - 1 && <Colon visible={visible} />}
            </div>
          ))}
        </div>

        {/* ─── MOBILE ROW (Stacked like holidays) ─── */}
        <div
          className="ct-row-mobile"
          style={{
            flexDirection: 'column', alignItems: 'center', gap: '1.25rem', direction: 'ltr',
            opacity: visible ? 1 : 0, transform: visible ? 'none' : 'scale(0.98)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {/* Top Row: Hours */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Unit value={t.h} label="ساعة" staggerIndex={0} visible={visible} />
          </div>

          {/* Bottom Row: Minutes : Seconds */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Unit value={t.m} label="دقيقة" staggerIndex={1} visible={visible} />
            <Colon visible={visible} />
            <Unit value={t.s} label="ثانية" staggerIndex={2} visible={visible} />
          </div>
        </div>

        {/* Date pill */}
        <DatePill dateAr={t.dateAr} dateHijri={t.dateHijri} />
      </div>
    </div>
  );
}
