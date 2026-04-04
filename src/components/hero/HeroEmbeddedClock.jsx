// src/app/test/HeroEmbeddedClock.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Fullscreen, Minimize2, Share2, MapPin } from 'lucide-react';
import styles from './HeroEmbeddedClock.module.css';
import { getSafeTimezone } from '@/lib/country-utils';
import { detectBestCityAction } from '@/app/actions/location';

function pad2(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

/** Returns the period-of-day label + its accent color */
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

/**
 * Magic UI ShineBorder — faithful port.
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

/** Single time unit: digits → label */
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

/**
 * Robust clipboard write — tries the modern Clipboard API first,
 * then falls back to the legacy execCommand approach so it works
 * on HTTP, older browsers, and sandboxed iframes.
 */
async function writeToClipboard(text) {
  // Modern async clipboard API (requires HTTPS / user gesture)
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy
    }
  }

  // Legacy execCommand fallback
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function HeroEmbeddedClock({ ianaTimezone, cityNameAr = 'توقيتك المحلي', countryNameAr }) {
  const [resolvedLocation, setResolvedLocation] = useState(() => ({
    ianaTimezone: getSafeTimezone(ianaTimezone) || ianaTimezone || '',
    cityNameAr: cityNameAr || 'توقيتك المحلي',
    countryNameAr: countryNameAr || '',
  }));

  const safeCityName = resolvedLocation.cityNameAr || 'توقيتك المحلي';
  const safeCountryName = safeCityName === 'توقيتك المحلي' ? '' : (resolvedLocation.countryNameAr || '');
  const activeTz = useMemo(
    () => resolvedLocation.ianaTimezone || undefined,
    [resolvedLocation.ianaTimezone],
  );

  const [timeData, setTimeData]   = useState(null);
  const [mounted, setMounted]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [isFS, setIsFS]           = useState(false);
  const [progressDelay, setProgressDelay] = useState(null);

  const containerRef = useRef(null);
  const wakeLockRef  = useRef(null);

  useEffect(() => {
    setResolvedLocation({
      ianaTimezone: getSafeTimezone(ianaTimezone) || ianaTimezone || '',
      cityNameAr: cityNameAr || 'توقيتك المحلي',
      countryNameAr: countryNameAr || '',
    });
  }, [ianaTimezone, cityNameAr, countryNameAr]);

  useEffect(() => {
    let cancelled = false;

    const applyDetectedCity = (city) => {
      if (!city || cancelled) return false;

      setResolvedLocation((prev) => ({
        ianaTimezone: getSafeTimezone(city.timezone) || city.timezone || prev.ianaTimezone,
        cityNameAr: city.city_name_ar || city.name_ar || prev.cityNameAr,
        countryNameAr: city.country_name_ar || prev.countryNameAr,
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
          setResolvedLocation((prev) => ({
            ...prev,
            ianaTimezone: browserTimezone,
          }));
        }

        try {
          const permissionState = navigator.permissions?.query
            ? (await navigator.permissions.query({ name: 'geolocation' })).state
            : 'prompt';

          if (permissionState === 'granted' && navigator.geolocation) {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 4000 });
            });

            const gpsCity = await detectBestCityAction({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              timezone: browserTimezone || undefined,
            });

            if (applyDetectedCity(gpsCity)) return;
          }
        } catch {}
      }
    };

    upgradeLocation();

    return () => {
      cancelled = true;
    };
  }, [resolvedLocation.ianaTimezone, safeCityName]);

  /* ── Tick ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    const tick = () => setTimeData(getTimeData(activeTz));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeTz]);

  useEffect(() => {
    if (timeData && progressDelay === null) {
      setProgressDelay(timeData.s);
    }
  }, [timeData, progressDelay]);

  /* ── Fullscreen change listener ────────────────────────────────────── */
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

  /* ── Wake lock while fullscreen ────────────────────────────────────── */
  useEffect(() => {
    if (!isFS) return;
    const requestWL = async () => {
      try { if ('wakeLock' in navigator) wakeLockRef.current = await navigator.wakeLock.request('screen'); }
      catch {}
    };
    try { screen.orientation?.lock?.('landscape').catch(() => {}); } catch {}
    requestWL();
    const onVis = () => { if (document.visibilityState === 'visible') requestWL(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      wakeLockRef.current?.release().catch(() => {});
      wakeLockRef.current = null;
      try { screen.orientation?.unlock?.(); } catch {}
    };
  }, [isFS]);

  /* ── Share ─────────────────────────────────────────────────────────── */
  const handleShare = async () => {
    const url  = typeof window !== 'undefined' ? window.location.href : '';
    const timeStr = timeData
      ? `${pad2(timeData.h)}:${pad2(timeData.m)}:${pad2(timeData.s)}`
      : '';
    const text = `الوقت الآن في ${safeCityName}: ${timeStr}`;

    // 1. Try native share sheet (mobile / supported desktop)
    if (typeof navigator?.share === 'function') {
      try {
        await navigator.share({ title: `الوقت في ${safeCityName}`, text, url });
        return;
      } catch (e) {
        // User cancelled (AbortError) — don't fall through to clipboard
        if (e?.name === 'AbortError') return;
      }
    }

    // 2. Clipboard fallback (modern + legacy)
    const ok = await writeToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  /* ── Fullscreen toggle ──────────────────────────────────────────────── */
  const toggleFullscreen = async () => {
    if (!isFS) {
      const el = containerRef.current;
      if (!el) return;
      try {
        const reqFS = el.requestFullscreen?.bind(el) || el.webkitRequestFullscreen?.bind(el);
        if (reqFS) {
          await reqFS();
          setIsFS(true);
        }
      } catch {
        // Fullscreen may be blocked in sandboxed iframes; fail silently
      }
    } else {
      try {
        const exitFS =
          document.exitFullscreen?.bind(document) ||
          document.webkitExitFullscreen?.bind(document);
        if (exitFS) await exitFS();
      } catch {
        setIsFS(false);
      }
    }
  };

  const t = timeData ?? { h: 0, m: 0, s: 0, dateAr: '', dateHijri: '' };
  const period = getPeriod(t.h);

  const progressStyle = progressDelay !== null
    ? { animationDelay: `-${progressDelay}s` }
    : {};

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

      {/* ── CENTER STAGE ────────────────────────────────────────── */}
      <div className={styles.centerStage}>

        <div className={styles.metaRow}>
          <span className={`${styles.periodBadge} ${period.cls}`}>{period.label}</span>
          <span className={styles.livePill} aria-label="مباشر">
            <span className={styles.liveDot} aria-hidden="true" />
            مباشر
          </span>
        </div>

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

      {!mounted && <div className={styles.skeleton} aria-hidden="true" />}
    </div>
  );
}
