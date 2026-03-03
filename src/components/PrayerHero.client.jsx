'use client';

/**
 * components/PrayerHero.client.jsx
 *
 * Circular SVG progress ring countdown to the next prayer.
 * Optimized for Next.js 16 with robust initial state for SSR/PPR.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';

const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء'
};

const METHODS = [
  { value: 'MuslimWorldLeague', label: 'رابطة العالم الإسلامي' },
  { value: 'Egyptian', label: 'الهيئة المصرية' },
  { value: 'UmmAlQura', label: 'أم القرى' },
  { value: 'Kuwait', label: 'الكويت' },
  { value: 'Qatar', label: 'قطر' },
  { value: 'Turkey', label: 'تركيا' },
  { value: 'NorthAmerica', label: 'أمريكا الشمالية' },
];

const RING_SIZE = 240;
const RING_R = 108;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

export default function PrayerHeroClient({
  nextPrayerKey,
  nextPrayerIso,
  prevPrayerIso, // New prop for accurate progress scaling
  timezone,
  method: defaultMethod
}) {
  // ── Sync Calculation for SSR/Initial Render ──
  const now = Date.now();
  const target = nextPrayerIso ? new Date(nextPrayerIso).getTime() : 0;
  const prev = prevPrayerIso ? new Date(prevPrayerIso).getTime() : 0;
  const diff = target ? target - now : 0;

  // If we have prev, we calculate progress as (now - prev) / (target - prev)
  // Otherwise fallback to a 6h assumption for the visual start.
  const calculateProgressValue = (t, p, n) => {
    if (!t || !n) return 0;
    if (n <= t) return 1;
    if (p && p < n && p < t) {
      const totalInterval = n - p;
      const elapsed = t - p;
      return Math.min(1, Math.max(0, elapsed / totalInterval));
    }
    // Fallback
    const MAX_CYCLE = 6 * 60 * 60 * 1000;
    return Math.max(0, 1 - (n - t) / MAX_CYCLE);
  };

  let initialLeft = '...';
  let initialProg = 0;

  if (target && diff > 0) {
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    initialLeft = h > 0
      ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    initialProg = calculateProgressValue(now, prev, target);
  } else if (target && diff <= 0) {
    initialLeft = 'الآن';
    initialProg = 1;
  }

  // ── State ──
  const [timeLeft, setTimeLeft] = useState(initialLeft);
  const [progress, setProgress] = useState(initialProg);
  const [hour12, setHour12] = useState(false);
  const [method, setMethod] = useState(defaultMethod || 'MuslimWorldLeague');
  const intervalRef = useRef(null);

  // Sync state with props if they change after mount (Next.js navigation)
  useEffect(() => {
    setTimeLeft(initialLeft);
    setProgress(initialProg);
  }, [nextPrayerIso, prevPrayerIso, initialLeft, initialProg]);

  // Restore preferences
  useEffect(() => {
    const savedHour12 = localStorage.getItem('pref_hour12');
    const savedMethod = localStorage.getItem('pref_method');
    if (savedHour12 !== null) setHour12(savedHour12 === '1');
    if (savedMethod) setMethod(savedMethod);
  }, []);

  // Ticker loop
  useEffect(() => {
    if (!target) return;

    function tick() {
      const curNow = Date.now();
      const curDiff = target - curNow;

      if (curDiff <= 0) {
        setTimeLeft('الآن');
        setProgress(1);
        return;
      }

      const h = Math.floor(curDiff / 3_600_000);
      const m = Math.floor((curDiff % 3_600_000) / 60_000);
      const s = Math.floor((curDiff % 60_000) / 1_000);

      const display = h > 0
        ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      setTimeLeft(display);
      setProgress(calculateProgressValue(curNow, prev, target));
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [target, prev]);

  const handleHour12 = () => {
    const v = !hour12;
    setHour12(v);
    localStorage.setItem('pref_hour12', v ? '1' : '0');
  };

  const handleMethod = (e) => {
    setMethod(e.target.value);
    localStorage.setItem('pref_method', e.target.value);
  };

  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          style={{ transform: 'rotate(-90deg)' }}
          aria-hidden="true"
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="12"
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-muted text-sm font-medium">الصلاة القادمة</span>
          <span className="text-accent text-xl font-bold">
            {PRAYER_AR[nextPrayerKey] || nextPrayerKey || '—'}
          </span>
          <time
            dateTime={nextPrayerIso}
            className="text-primary font-mono font-black tabular-nums"
            style={{ fontSize: (timeLeft || '').length > 5 ? '1.6rem' : '2rem', direction: 'ltr' }}
            aria-live="polite"
          >
            {timeLeft}
          </time>
        </div>
      </div>

      {timezone && (
        <p className="text-muted text-xs text-center">
          المنطقة الزمنية: <span className="text-secondary">{timezone}</span>
          {' — '}
          طريقة الحساب: <span className="text-secondary">{METHODS.find(m => m.value === method)?.label || method}</span>
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          onClick={handleHour12}
          className={`chip ${hour12 ? 'chip--active' : ''}`}
          aria-pressed={hour12}
        >
          {hour12 ? '١٢ ساعة' : '٢٤ ساعة'}
        </button>

        <div className="relative">
          <select
            value={method}
            onChange={handleMethod}
            className="input text-sm py-2 px-3 pr-8 cursor-pointer min-h-[48px]"
            style={{ minWidth: '160px' }}
          >
            {METHODS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
