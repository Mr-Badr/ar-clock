// src/components/hero/HeroClockClient.jsx
//
// ⚠️  CLIENT BOUNDARY — every import in this file becomes part of the
//     client JS bundle. Keep heavy deps (date, geo, share) inside this
//     file; do NOT re-export them from the server-side barrel.
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Fullscreen, Minimize2, Share2, MapPin } from 'lucide-react';
import styles from './HeroEmbeddedClock.module.css';
import { getSafeTimezone } from '@/lib/country-utils';
import { resolveCurrentUserCity } from '@/lib/user-location.client';
import { getCurrentPageUrl, useCopyFeedback } from '@/lib/share.client';
import { SectionDivider } from '@/components/shared/primitives';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pad2(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

/** Returns the period-of-day label + its CSS module class. */
function getPeriod(h) {
  if (h >= 5  && h < 12) return { label: 'صباحاً', cls: styles.periodMorning };
  if (h >= 12 && h < 17) return { label: 'ظهراً',  cls: styles.periodNoon    };
  if (h >= 17 && h < 21) return { label: 'مساءً',  cls: styles.periodEvening };
  return                         { label: 'ليلاً',  cls: styles.periodNight   };
}

function getTimeData(tz) {
  const now = new Date();

  const parts = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(now);

  const get = (type) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);

  const dateAr = new Intl.DateTimeFormat('ar-u-nu-latn', {
    timeZone: tz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const dateHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
    timeZone: tz,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  return { h: get('hour'), m: get('minute'), s: get('second'), dateAr, dateHijri };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Magic UI ShineBorder — faithful CSS port.
 *
 * Parent MUST have:
 *   position: relative
 *   overflow: hidden
 */
function ShineBorder({
  color = ['#A07CFE', '#FE8FB5', '#FFBE7B'],
  borderWidth = 1,
  duration = 14,
}) {
  const colors = Array.isArray(color) ? color.join(',') : color;
  return (
    <span
      aria-hidden="true"
      className={styles.shineBorder}
      style={{
        '--shine-border-width': `${borderWidth}px`,
        '--shine-duration':     `${duration}s`,
        '--shine-mask':         'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        '--shine-gradient':     `radial-gradient(transparent, transparent, ${colors}, transparent, transparent)`,
      }}
    />
  );
}

/** Single time unit: two digits + an Arabic label pill underneath. */
function Unit({ value, label }) {
  const str = pad2(value);
  return (
    <div className={styles.unit}>
      <div className={styles.digitsWrap} aria-hidden="true">
        {str.split('').map((ch, i) => (
          <span key={`${label}-${i}-${ch}`} className={styles.digit}>
            {ch}
          </span>
        ))}
      </div>
      <span className={styles.unitLabel}>{label}</span>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * HeroClockClient
 *
 * All reactive / browser-only clock behaviour lives here. Imported
 * exclusively by the Server Component `HeroEmbeddedClock.jsx`, which
 * acts as the public API and handles prop validation.
 */
export default function HeroClockClient({
  ianaTimezone,
  cityNameAr = 'توقيتك المحلي',
  countryNameAr,
}) {
  // ── Location state (upgradeable via geolocation) ─────────────────────────
  const [resolvedLocation, setResolvedLocation] = useState(() => ({
    ianaTimezone: getSafeTimezone(ianaTimezone) || ianaTimezone || '',
    cityNameAr: cityNameAr || 'توقيتك المحلي',
    countryNameAr: countryNameAr || '',
  }));

  const safeCityName    = resolvedLocation.cityNameAr || 'توقيتك المحلي';
  const safeCountryName =
    safeCityName === 'توقيتك المحلي' ? '' : (resolvedLocation.countryNameAr || '');

  const activeTz = useMemo(
    () => resolvedLocation.ianaTimezone || undefined,
    [resolvedLocation.ianaTimezone],
  );

  // ── UI state ─────────────────────────────────────────────────────────────
  const [timeData,      setTimeData]      = useState(null);
  const [mounted,       setMounted]       = useState(false);
  const [isFS,          setIsFS]          = useState(false);
  const [progressDelay, setProgressDelay] = useState(null);
  const { copied, copy }                  = useCopyFeedback();

  const containerRef = useRef(null);
  const wakeLockRef  = useRef(null);

  // ── Sync props → state (parent re-renders with new timezone/city) ─────────
  useEffect(() => {
    setResolvedLocation({
      ianaTimezone: getSafeTimezone(ianaTimezone) || ianaTimezone || '',
      cityNameAr: cityNameAr || 'توقيتك المحلي',
      countryNameAr: countryNameAr || '',
    });
  }, [ianaTimezone, cityNameAr, countryNameAr]);

  // ── Geolocation upgrade (browser timezone → IP → GPS) ────────────────────
  useEffect(() => {
    let cancelled = false;

    const applyDetectedCity = (city) => {
      if (!city || cancelled) return false;
      setResolvedLocation((prev) => ({
        ianaTimezone:   getSafeTimezone(city.timezone) || city.timezone || prev.ianaTimezone,
        cityNameAr:     city.city_name_ar || city.name_ar || prev.cityNameAr,
        countryNameAr:  city.country_name_ar || prev.countryNameAr,
      }));
      return true;
    };

    const upgradeLocation = async () => {
      const browserTimezone =
        getSafeTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || '') ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        '';

      if (!safeCityName || safeCityName === 'توقيتك المحلي') {
        if (browserTimezone && !resolvedLocation.ianaTimezone && !cancelled) {
          setResolvedLocation((prev) => ({ ...prev, ianaTimezone: browserTimezone }));
        }

        try {
          const detection = await resolveCurrentUserCity({
            geolocation: 'if-granted',
            gpsTimeoutMs: 4000,
          });
          applyDetectedCity(detection.city);
        } catch {
          // Fail silently — best-effort location upgrade
        }
      }
    };

    upgradeLocation();
    return () => { cancelled = true; };
  }, [resolvedLocation.ianaTimezone, safeCityName]);

  // ── Clock tick (1 s interval) ─────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const tick = () => setTimeData(getTimeData(activeTz));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeTz]);

  // ── Seed the CSS progress-bar animation delay from the current second ─────
  useEffect(() => {
    if (timeData && progressDelay === null) {
      setProgressDelay(timeData.s);
    }
  }, [timeData, progressDelay]);

  // ── Fullscreen change listener ────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => {
      const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (!active) setIsFS(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  // ── Wake lock while fullscreen ────────────────────────────────────────────
  useEffect(() => {
    if (!isFS) return;
    const requestWL = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch { /* non-critical */ }
    };
    try { screen.orientation?.lock?.('landscape').catch(() => {}); } catch {}
    requestWL();
    const onVis = () => {
      if (document.visibilityState === 'visible') requestWL();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      try { screen.orientation?.unlock?.(); } catch {}
    };
  }, [isFS]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleShare = async () => {
    await copy(getCurrentPageUrl());
  };

  const toggleFullscreen = async () => {
    if (!isFS) {
      const el = containerRef.current;
      if (!el) return;
      try {
        const reqFS = el.requestFullscreen?.bind(el) || el.webkitRequestFullscreen?.bind(el);
        if (reqFS) { await reqFS(); setIsFS(true); }
      } catch {
        // Fullscreen may be blocked in sandboxed iframes; fail silently
      }
    } else {
      try {
        const exitFS =
          document.exitFullscreen?.bind(document) ||
          document.webkitExitFullscreen?.bind(document);
        if (exitFS) await exitFS();
      } catch { setIsFS(false); }
    }
  };

  // ── Derived display values ────────────────────────────────────────────────
  const t      = timeData ?? { h: 0, m: 0, s: 0, dateAr: '', dateHijri: '' };
  const period = getPeriod(t.h);

  const progressStyle = progressDelay !== null
    ? { animationDelay: `-${progressDelay}s` }
    : {};

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`${styles.clockRoot} ${isFS ? styles.clockRootFullscreen : ''}`}
      dir="rtl"
      suppressHydrationWarning
    >
      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div className={styles.topbar}>

        <button
          type="button"
          className={styles.toolBtn}
          onClick={handleShare}
          aria-label="مشاركة الوقت"
        >
          <ShineBorder color={['#A07CFE', '#FE8FB5', '#FFBE7B']} borderWidth={1} duration={10} />
          <Share2 size={14} />
          <span className={styles.btnLabel}>{copied ? '✓ تم النسخ' : 'مشاركة'}</span>
        </button>

        <div className={styles.locationPill}>
          <MapPin size={12} className={styles.locationPin} aria-hidden="true" />
          <span>{safeCityName}{safeCountryName ? `، ${safeCountryName}` : ''}</span>
        </div>

        <button
          type="button"
          className={styles.toolBtn}
          onClick={toggleFullscreen}
          aria-label={isFS ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
        >
          <ShineBorder color={['#A07CFE', '#FE8FB5', '#FFBE7B']} borderWidth={1} duration={10} />
          {isFS ? <Minimize2 size={14} /> : <Fullscreen size={14} />}
          <span className={styles.btnLabel}>{isFS ? 'إغلاق' : 'ملء الشاشة'}</span>
        </button>

      </div>

      <SectionDivider />

      {/* ── CENTER STAGE ────────────────────────────────────────── */}
      {/* stageWrapper: flex:1 fills remaining height; centers in fullscreen.
          The 3rem bottom offset lives in CSS (.stageWrapper) so it can be
          zeroed out cleanly for fullscreen via .clockRootFullscreen .stageWrapper */}
      <div className={styles.stageWrapper}>
        <div className={styles.centerStage}>

          <div className={styles.metaRow}>
            <span className={`${styles.periodBadge} ${period.cls}`}>{period.label}</span>
            <span className={styles.livePill} aria-label="مباشر">
              <span className={styles.liveDot} aria-hidden="true" />
              مباشر
            </span>
          </div>

          <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                    <div
                      className={styles.clockLine}
                      role="timer"
                      aria-live="off"
                      aria-label={`الوقت الآن في ${safeCityName}: ${pad2(t.h)}:${pad2(t.m)}:${pad2(t.s)}`}
                    >
                      <Unit value={t.h} label="ساعة"  />
                      <span className={styles.sep} aria-hidden="true">:</span>
                      <Unit value={t.m} label="دقيقة" />
                      <span className={styles.sep} aria-hidden="true">:</span>
                      <Unit value={t.s} label="ثانية" />
                    </div>

                    <div className={styles.progressTrack} aria-hidden="true">
                      <div className={styles.progressBar} style={progressStyle} />
                    </div>
          </div>


          <div className={styles.dateLine}>
            <ShineBorder
              color={['#8CAEFF', '#A07CFE', '#FE8FB5']}
              borderWidth={1}
              duration={16}
            />
            <span className={styles.dateAr}>{t.dateAr}</span>
            <span className={styles.dateDivider} aria-hidden="true">·</span>
            <span className={styles.dateHijri}>{t.dateHijri}</span>
          </div>

        </div>
      </div>

      {!mounted && <div className={styles.skeleton} aria-hidden="true" />}
    </div>
  );
}