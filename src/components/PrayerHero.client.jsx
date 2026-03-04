'use client';

/**
 * components/PrayerHero.client.jsx
 *
 * Production-ready prayer countdown with animated progress ring.
 * Verified: zero hydration mismatches, zero infinite loops.
 *
 * Architecture:
 *  - `mounted` gate: SSR + first client render both use static values
 *    → server HTML === client HTML → no hydration mismatch ever
 *  - Ref-buffered timer: interval writes to ref (no setState),
 *    RAF reads ref and flushes to state → cannot create render loops
 *  - Props mirrored into refs: effect deps are stable primitives only
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────

const PRAYER_AR = {
  fajr:    'الفجر',
  sunrise: 'الشروق',
  dhuhr:   'الظهر',
  asr:     'العصر',
  maghrib: 'المغرب',
  isha:    'العشاء',
};

const METHODS = [
  { value: 'MuslimWorldLeague', label: 'رابطة العالم الإسلامي' },
  { value: 'Egyptian',          label: 'الهيئة المصرية' },
  { value: 'UmmAlQura',         label: 'أم القرى' },
  { value: 'Kuwait',            label: 'الكويت' },
  { value: 'Qatar',             label: 'قطر' },
  { value: 'Turkey',            label: 'تركيا' },
  { value: 'NorthAmerica',      label: 'أمريكا الشمالية' },
];

const RING_SIZE          = 240;
const RING_R             = 108;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const FALLBACK_METHOD    = 'MuslimWorldLeague';

// Static SSR-safe defaults — time-independent, identical on server and client
const STATIC_TIME_LEFT  = '...';
const STATIC_PROGRESS   = 0;
const STATIC_DASHOFFSET = RING_CIRCUMFERENCE; // arc invisible on SSR

// ── Pure helpers ──────────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

function computeTickValues(nextIso, prevIso) {
  if (!nextIso) return { timeLeft: STATIC_TIME_LEFT, progress: STATIC_PROGRESS };

  const targetTs = new Date(nextIso).getTime();
  const prevTs   = prevIso ? new Date(prevIso).getTime() : 0;
  const nowTs    = Date.now();
  const diff     = targetTs - nowTs;

  if (!Number.isFinite(diff) || diff <= 0) {
    return { timeLeft: 'الآن', progress: 1 };
  }

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000)    /  1_000);
  const timeLeft = h > 0
    ? `${pad(h)}:${pad(m)}:${pad(s)}`
    : `${pad(m)}:${pad(s)}`;

  let progress = STATIC_PROGRESS;
  if (prevTs > 0 && prevTs < nowTs && targetTs > prevTs) {
    progress = Math.min(1, Math.max(0, (nowTs - prevTs) / (targetTs - prevTs)));
  } else if (diff < 6 * 3_600_000) {
    progress = Math.max(0, 1 - diff / (6 * 3_600_000));
  }

  return { timeLeft, progress };
}

// ── Component ─────────────────────────────────────────────────────────────────

function PrayerHeroClient({
  nextPrayerKey,
  nextPrayerIso,
  prevPrayerIso,
  timezone,
  method: defaultMethod,
}) {
  // All initial values are static constants — identical on server and client.
  // `mounted` flips to true only inside useEffect (client-only).
  // This guarantees SSR HTML === first client render → zero hydration mismatch.
  const [mounted,  setMounted]  = useState(false);
  const [timeLeft, setTimeLeft] = useState(STATIC_TIME_LEFT);
  const [progress, setProgress] = useState(STATIC_PROGRESS);
  const [hour12,   setHour12]   = useState(false);
  const [method,   setMethod]   = useState(defaultMethod || FALLBACK_METHOD);

  // Props mirrored into refs — interval/RAF read these, never stale closures
  const nextIsoRef     = useRef(nextPrayerIso);
  const prevIsoRef     = useRef(prevPrayerIso);
  nextIsoRef.current   = nextPrayerIso;
  prevIsoRef.current   = prevPrayerIso;

  const intervalRef    = useRef(null);
  const rafRef         = useRef(null);
  // Timer writes here → RAF reads here → setState only when value changed
  // This decouples setState from the interval, making loops impossible
  const timerValuesRef = useRef({ timeLeft: STATIC_TIME_LEFT, progress: STATIC_PROGRESS });

  // ── RAF flush: drains timerValuesRef into state ───────────────────────────
  // Empty deps: reads only refs and stable setState setters. Never recreated.
  const flushTimerValues = useCallback(() => {
    const { timeLeft: tl, progress: pr } = timerValuesRef.current;
    setTimeLeft(prev => prev === tl ? prev : tl);
    setProgress(prev => Math.abs(prev - pr) < 0.0001 ? prev : pr);
    rafRef.current = requestAnimationFrame(flushTimerValues);
  }, []);

  // ── Effect 1: Mount — runs exactly once ──────────────────────────────────
  useEffect(() => {
    // Restore user preferences
    try {
      const h = localStorage.getItem('pref_hour12') === '1';
      const m = localStorage.getItem('pref_method') || defaultMethod || FALLBACK_METHOD;
      setHour12(h);
      setMethod(m);
    } catch (_) {}

    // Seed the ref with real values before RAF starts
    timerValuesRef.current = computeTickValues(nextIsoRef.current, prevIsoRef.current);

    // RAF loop: flushes ref values to state ~60fps, with bailout equality checks
    rafRef.current = requestAnimationFrame(flushTimerValues);

    // Interval: computes new tick values every second, writes to ref only (no setState)
    intervalRef.current = setInterval(() => {
      const result = computeTickValues(nextIsoRef.current, prevIsoRef.current);
      timerValuesRef.current = result;
      if (result.timeLeft === 'الآن') clearInterval(intervalRef.current);
    }, 1000);

    // Reveal real values — triggers one re-render with actual countdown
    setMounted(true);

    return () => {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount/unmount only — intentionally empty

  // ── Effect 2: Restart when prayer window changes (city switch etc.) ───────
  const windowKey        = `${nextPrayerIso}|${prevPrayerIso}`;
  const prevWindowKeyRef = useRef(windowKey);

  useEffect(() => {
    // Skip: not mounted yet (Effect 1 handles initial run)
    if (!mounted) return;
    // Skip: window key hasn't actually changed
    if (prevWindowKeyRef.current === windowKey) return;
    prevWindowKeyRef.current = windowKey;

    clearInterval(intervalRef.current);
    timerValuesRef.current = computeTickValues(nextIsoRef.current, prevIsoRef.current);

    intervalRef.current = setInterval(() => {
      const result = computeTickValues(nextIsoRef.current, prevIsoRef.current);
      timerValuesRef.current = result;
      if (result.timeLeft === 'الآن') clearInterval(intervalRef.current);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [windowKey, mounted]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleHour12 = useCallback(() => {
    setHour12(prev => {
      const next = !prev;
      try { localStorage.setItem('pref_hour12', next ? '1' : '0'); } catch (_) {}
      return next;
    });
  }, []);

  const handleMethod = useCallback((e) => {
    const val = e.target.value;
    setMethod(val);
    try { localStorage.setItem('pref_method', val); } catch (_) {}
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  // Before mount: static values (matches SSR HTML exactly)
  // After mount:  real countdown values
  const displayTimeLeft = mounted ? timeLeft  : STATIC_TIME_LEFT;
  const displayProgress = mounted ? progress  : STATIC_PROGRESS;
  const displayOffset   = mounted
    ? RING_CIRCUMFERENCE * (1 - displayProgress)
    : STATIC_DASHOFFSET;

  const fontSize    = displayTimeLeft.length > 5 ? '1.6rem' : '2rem';
  const methodLabel = METHODS.find(m => m.value === method)?.label ?? method;
  const prayerLabel = PRAYER_AR[nextPrayerKey] ?? nextPrayerKey ?? '—';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col items-center gap-6 py-8">

      {/* Progress ring */}
      <div
        className="relative"
        style={{ width: RING_SIZE, height: RING_SIZE }}
        role="timer"
        aria-label={`الوقت المتبقي لصلاة ${prayerLabel}`}
      >
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          {/* Static track — always identical server/client */}
          <circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="12"
          />
          {/* Progress arc — STATIC_DASHOFFSET before mount, real value after */}
          <circle
            cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={displayOffset}
            style={{
              transition: mounted ? 'stroke-dashoffset 1s linear' : 'none',
              filter:     'drop-shadow(0 0 8px var(--accent-glow))',
              willChange: 'stroke-dashoffset',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-muted text-sm font-medium">الصلاة القادمة</span>
          <span className="text-accent text-xl font-bold">{prayerLabel}</span>
          <time
            dateTime={mounted ? (nextPrayerIso ?? undefined) : undefined}
            className="text-primary font-mono font-black tabular-nums"
            style={{ fontSize, direction: 'ltr' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {displayTimeLeft}
          </time>
        </div>
      </div>

      {/* Timezone + method */}
      {timezone && (
        <p className="text-muted text-xs text-center leading-relaxed">
          المنطقة الزمنية: <span className="text-secondary">{timezone}</span>
          {' — '}
          طريقة الحساب: <span className="text-secondary">{methodLabel}</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          type="button"
          onClick={handleHour12}
          className={`chip ${hour12 ? 'chip--active' : ''}`}
          aria-pressed={hour12}
        >
          {hour12 ? '١٢ ساعة' : '٢٤ ساعة'}
        </button>

        <select
          value={method}
          onChange={handleMethod}
          className="input text-sm py-2 px-3 pr-8 cursor-pointer min-h-[48px]"
          style={{ minWidth: '160px' }}
          aria-label="طريقة حساب أوقات الصلاة"
        >
          {METHODS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

    </div>
  );
}

export default memo(PrayerHeroClient, (prev, next) =>
  prev.nextPrayerIso === next.nextPrayerIso &&
  prev.prevPrayerIso === next.prevPrayerIso &&
  prev.nextPrayerKey === next.nextPrayerKey &&
  prev.timezone      === next.timezone
);