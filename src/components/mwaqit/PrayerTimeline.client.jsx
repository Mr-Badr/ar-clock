'use client';

/**
 * PrayerTimeline — visual day-arc showing all 6 prayers on a gradient timeline.
 * Updates every 30s. Hydration-safe (mounted gate prevents SSR mismatch).
 * Shows: gradient bar (night→dawn→noon→sunset→night), prayer dots, current-time
 * line, prayer status pills below.
 */

import { useState, useEffect, memo } from 'react';

const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
};

// Alternating placement: true = label above bar, false = below
// Pattern ensures adjacent prayers (fajr/sunrise, maghrib/isha) don't overlap
const ABOVE_BAR = [true, false, true, false, true, false];

const DOT_COLOR = {
  fajr:    '#818cf8',
  sunrise: '#fb923c',
  dhuhr:   '#eab308',
  asr:     '#10b981',
  maghrib: '#f97316',
  isha:    '#a855f7',
};

const PERIOD_NOTE = {
  fajr:    'وقت الفجر — بداية يوم هادئ 🌙',
  sunrise: 'وقت الضحى — صباح مبارك 🌅',
  dhuhr:   'وقت الظهر — توقف واستراح ☀️',
  asr:     'وقت العصر — أجمل وقت في اليوم 🍂',
  maghrib: 'وقت المغرب — لحظة الغروب 🌇',
  isha:    'وقت العشاء — الليل يبدأ 🌙',
};

// Bar geometry
const BAR_TOP    = 28;  // px from top of bar-container
const BAR_H      =  9;  // bar height in px
const CONT_H     = 72;  // total container height
const BAR_CENTER = BAR_TOP + BAR_H / 2;

// Day-cycle gradient (left = pre-fajr night → dawn → noon → sunset → post-isha)
const BAR_GRADIENT =
  'linear-gradient(to right, #0f172a 0%, #1e1b4b 8%, #7c2d12 20%, #fde68a 32%, #fef9c3 50%, #fde68a 65%, #c2410c 78%, #6d28d9 90%, #0f172a 100%)';

// ─── Intl-based time helpers (work correctly for any timezone) ──────────────

function isoToLocalMinutes(iso, tz) {
  if (!iso) return null;
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false, timeZone: tz,
    }).formatToParts(new Date(iso));
    const g = (type) => {
      const v = parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);
      return type === 'hour' && v === 24 ? 0 : v;
    };
    return g('hour') * 60 + g('minute') + g('second') / 60;
  } catch { return null; }
}

function nowLocalMinutes(tz) {
  return isoToLocalMinutes(new Date().toISOString(), tz);
}

function localTimeStr(iso, tz) {
  if (!iso) return '--:--';
  try {
    return new Date(iso).toLocaleTimeString('ar-EG', {
      hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false,
    });
  } catch { return '--:--'; }
}

// ─── Component ────────────────────────────────────────────────────────────────

function PrayerTimeline({ times, timezone, nextPrayerKey }) {
  const [mounted, setMounted] = useState(false);
  const [nowMin, setNowMin]   = useState(0);

  useEffect(() => {
    const tick = () => setNowMin(nowLocalMinutes(timezone) ?? 0);
    tick();
    setMounted(true);
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timezone]);

  // Parse prayer times → local minutes
  const pMin = {};
  for (const k of PRAYER_KEYS) pMin[k] = isoToLocalMinutes(times[k], timezone);

  const validMins = PRAYER_KEYS.map(k => pMin[k]).filter(m => m != null);
  if (!validMins.length) return null;

  // Timeline window: fajr-60 → isha+75 (clamped to 0-1440)
  const windowStart = Math.max(0,    validMins[0]                           - 60);
  const windowEnd   = Math.min(1440, validMins[validMins.length - 1] + 75);
  const windowDur   = windowEnd - windowStart;

  const toPercent = (min) =>
    min == null ? null : Math.min(100, Math.max(0, (min - windowStart) / windowDur * 100));

  // Determine status per prayer
  const getPrayerStatus = (key, idx) => {
    if (!mounted || pMin[key] == null) return 'upcoming';
    const nextMinute = pMin[PRAYER_KEYS[idx + 1]] ?? 1440;
    if (nowMin >= pMin[key] && nowMin < nextMinute) return 'active';
    if (nowMin >= pMin[key]) return 'past';
    return 'upcoming';
  };

  const statuses = {};
  PRAYER_KEYS.forEach((k, i) => { statuses[k] = getPrayerStatus(k, i); });

  const activePrayerKey = mounted
    ? PRAYER_KEYS.find(k => statuses[k] === 'active')
    : null;

  const nowPercent = mounted ? toPercent(nowMin) : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div dir="rtl">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
          خط سير يومك
        </span>
        {mounted && activePrayerKey && (
          <span style={{
            fontSize: '12px', color: 'var(--text-secondary)',
            background: 'var(--bg-surface-2)',
            padding: '3px 10px', borderRadius: '9999px',
            border: '1px solid var(--border-subtle)',
          }}>
            {PERIOD_NOTE[activePrayerKey]}
          </span>
        )}
      </div>

      {/* ─── Gradient arc bar ─────────────────────────────────────────────── */}
      <div dir="ltr" style={{ position: 'relative', height: CONT_H, marginBottom: '14px' }}>

        {/* Bar background */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          top: BAR_TOP, height: BAR_H,
          borderRadius: '9999px',
          background: BAR_GRADIENT,
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
        }} />

        {/* Prayer markers */}
        {PRAYER_KEYS.map((key, idx) => {
          const percent = toPercent(pMin[key]);
          if (percent === null) return null;

          const above    = ABOVE_BAR[idx];
          const isNext   = key === nextPrayerKey;
          const isPast   = statuses[key] === 'past';
          const color    = DOT_COLOR[key];
          const dotSize  = isNext ? 16 : isPast ? 7 : 11;
          const dotTop   = BAR_CENTER - dotSize / 2;

          const labelStyle = {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            fontWeight: isNext ? '800' : '500',
            color: isPast
              ? 'rgba(140,140,140,0.5)'
              : isNext ? color : 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            lineHeight: '1',
            fontFamily: 'inherit',
          };

          return (
            <div
              key={key}
              style={{ position: 'absolute', left: `${percent}%`, top: 0, height: CONT_H, transform: 'translateX(-50%)' }}
            >
              {/* Prayer name above bar */}
              {above && (
                <span style={{ ...labelStyle, bottom: `${CONT_H - (BAR_TOP - 5)}px`, top: 'auto' }}>
                  {PRAYER_AR[key]}
                </span>
              )}

              {/* Dot on the bar */}
              <div style={{
                position: 'absolute',
                left: '50%', transform: 'translateX(-50%)',
                top: dotTop,
                width: dotSize, height: dotSize,
                borderRadius: '50%',
                background: isPast ? 'rgba(200,200,200,0.35)' : color,
                border: isNext ? '2.5px solid #fff' : '2px solid rgba(255,255,255,0.55)',
                boxShadow: isNext ? `0 0 12px ${color}, 0 0 4px rgba(255,255,255,0.4)` : 'none',
                zIndex: 5,
                transition: 'box-shadow 0.4s ease',
              }} />

              {/* Prayer name below bar */}
              {!above && (
                <span style={{ ...labelStyle, top: BAR_TOP + BAR_H + 5 }}>
                  {PRAYER_AR[key]}
                </span>
              )}
            </div>
          );
        })}

        {/* Current time indicator */}
        {mounted && nowPercent != null && nowPercent >= 0 && nowPercent <= 100 && (
          <div style={{
            position: 'absolute',
            left: `${nowPercent}%`,
            top: BAR_TOP - 4,
            height: BAR_H + 8,
            width: '2px',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '9999px',
            boxShadow: '0 0 6px rgba(255,255,255,0.75)',
            zIndex: 10,
          }}>
            {/* Glow top */}
            <div style={{
              position: 'absolute',
              top: '-5px', left: '50%',
              transform: 'translateX(-50%)',
              width: '10px', height: '10px',
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.9)',
            }} />
          </div>
        )}
      </div>

      {/* ─── Prayer time pills ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {PRAYER_KEYS.map((key) => {
          if (!times[key]) return null;
          const isNext = key === nextPrayerKey;
          const isPast = statuses[key] === 'past';
          const color  = DOT_COLOR[key];

          return (
            <div key={key} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              minWidth: '66px', padding: '8px 8px', borderRadius: '12px', flexShrink: 0,
              background: isNext ? `${color}16` : isPast ? 'transparent' : 'var(--bg-surface-2)',
              border: isNext
                ? `1.5px solid ${color}55`
                : '1px solid var(--border-subtle)',
              opacity: isPast ? 0.38 : 1,
              transition: 'opacity 0.3s',
            }}>
              <span style={{
                fontSize: '11px', fontWeight: '600',
                color: isNext ? color : 'var(--text-secondary)',
              }}>
                {PRAYER_AR[key]}
              </span>
              <span style={{
                fontSize: '14px', fontWeight: '700', direction: 'ltr',
                color: isNext ? color : isPast ? 'var(--text-muted)' : 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {localTimeStr(times[key], timezone)}
              </span>
              {isNext && (
                <span style={{ fontSize: '9px', color, fontWeight: '600', opacity: 0.8 }}>
                  ← القادمة
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(PrayerTimeline, (prev, next) =>
  prev.timezone        === next.timezone &&
  prev.nextPrayerKey   === next.nextPrayerKey &&
  prev.times?.fajr     === next.times?.fajr &&
  prev.times?.isha     === next.times?.isha
);
