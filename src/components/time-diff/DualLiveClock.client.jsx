'use client';

/**
 * DualLiveClock — real-time dual clock with a "best meeting hours" overlap bar.
 * Mounted client-side only (real-time). SSR renders nothing (hydration safe).
 * Props: fromTz, toTz, fromCityAr, toCityAr, diffMinutes (server-computed)
 */

import { useState, useEffect, useCallback } from 'react';

// ── Helpers ────────────────────────────────────────────────────────────────────

function nowInTz(tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false,
    }).formatToParts(new Date());
    const g = (t) => {
      const v = parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
      return t === 'hour' && v === 24 ? 0 : v;
    };
    return { h: g('hour'), m: g('minute'), s: g('second') };
  } catch { return { h: 0, m: 0, s: 0 }; }
}

function pad(n) { return String(n).padStart(2, '0'); }

function fmtClock(h, m, s) {
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function localDateStr(tz) {
  try {
    return new Date().toLocaleDateString('ar-EG-u-nu-latn', {
      timeZone: tz, weekday: 'long', day: 'numeric', month: 'long',
    });
  } catch { return ''; }
}

// ── Meeting overlap bar ────────────────────────────────────────────────────────
// Renders a 24h axis (from-city perspective) with two colored workday bands.

const WORK_START = 9;
const WORK_END   = 17;

function pct(h) { return `${(h / 24) * 100}%`; }

function OverlapBar({ diffMinutes, fromCityAr, toCityAr, nowHFromCity }) {
  const diffHours   = diffMinutes / 60;
  const toStart     = WORK_START - diffHours;   // to-city 9am in from-city hours
  const toEnd       = WORK_END   - diffHours;   // to-city 5pm in from-city hours
  const ovlStart    = Math.max(WORK_START, toStart);
  const ovlEnd      = Math.min(WORK_END,   toEnd);
  const hasOverlap  = ovlStart < ovlEnd;
  const nowPct      = Math.min(100, Math.max(0, (nowHFromCity / 24) * 100));

  const fmtH = (h) => {
    const norm = ((h % 24) + 24) % 24;
    const suffix = norm < 12 ? 'ص' : 'م';
    const display = norm === 0 ? 12 : norm > 12 ? norm - 12 : norm;
    return `${display}${suffix}`;
  };

  return (
    <div style={{ marginTop: '20px' }} dir="rtl">
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
          أفضل وقت للاجتماع
        </span>
        {hasOverlap ? (
          <span style={{
            fontSize: '11px', background: '#10b98115', color: '#10b981',
            border: '1px solid #10b98130', padding: '2px 8px', borderRadius: '9999px',
          }}>
            ✓ {fmtH(ovlStart)} – {fmtH(ovlEnd)} بتوقيت {fromCityAr}
          </span>
        ) : (
          <span style={{
            fontSize: '11px', background: '#f87171' + '15', color: '#f87171',
            border: '1px solid #f8717130', padding: '2px 8px', borderRadius: '9999px',
          }}>
            لا يوجد تقاطع في ساعات العمل
          </span>
        )}
      </div>

      {/* 24h bar */}
      <div style={{
        position: 'relative', height: '44px', background: 'var(--bg-surface-2)',
        borderRadius: '8px', overflow: 'visible',
      }}>
        {/* From-city workday band */}
        <div style={{
          position: 'absolute', top: '4px', height: '16px',
          left: pct(WORK_START), width: pct(WORK_END - WORK_START),
          background: '#6366f130', borderRadius: '4px',
          border: '1px solid #6366f150',
        }} />

        {/* To-city workday band */}
        {(() => {
          const cLeft  = Math.max(0, Math.min(24, toStart));
          const cRight = Math.max(0, Math.min(24, toEnd));
          const wLeft  = Math.min(cLeft, cRight);
          const wRight = Math.max(cLeft, cRight);
          if (wRight <= wLeft) return null;
          return (
            <div style={{
              position: 'absolute', top: '24px', height: '16px',
              left: pct(wLeft), width: pct(wRight - wLeft),
              background: '#f59e0b30', borderRadius: '4px',
              border: '1px solid #f59e0b50',
            }} />
          );
        })()}

        {/* Overlap highlight */}
        {hasOverlap && (
          <div style={{
            position: 'absolute', top: '4px', height: '36px',
            left: pct(Math.max(0, ovlStart)), width: pct(Math.min(24, ovlEnd) - Math.max(0, ovlStart)),
            background: '#10b98120', borderRadius: '4px',
            border: '1px solid #10b98145',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '9px', color: '#10b981', fontWeight: '700', whiteSpace: 'nowrap' }}>
              التقاطع
            </span>
          </div>
        )}

        {/* Current time needle */}
        <div style={{
          position: 'absolute', top: '-4px', bottom: '-4px',
          left: `calc(${nowPct}% - 1px)`, width: '2px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: '9999px',
          boxShadow: '0 0 6px rgba(255,255,255,0.7)',
          zIndex: 10,
        }}>
          <div style={{
            position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)',
            width: '9px', height: '9px', borderRadius: '50%',
            background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.9)',
          }} />
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '6px', borderRadius: '2px', background: '#6366f140', border: '1px solid #6366f160', display: 'inline-block' }} />
          {fromCityAr} (9ص – 5م)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ width: '10px', height: '6px', borderRadius: '2px', background: '#f59e0b40', border: '1px solid #f59e0b60', display: 'inline-block' }} />
          {toCityAr} (9ص – 5م)
        </span>
        {hasOverlap && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
            <span style={{ width: '10px', height: '6px', borderRadius: '2px', background: '#10b98130', border: '1px solid #10b98150', display: 'inline-block' }} />
            التقاطع
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DualLiveClock({ fromTz, toTz, fromCityAr, toCityAr, diffMinutes }) {
  const [tick, setTick] = useState(null);

  useEffect(() => {
    const update = () => setTick(Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Not yet mounted — render nothing to avoid SSR mismatch
  if (tick === null) return null;

  const fromT = nowInTz(fromTz);
  const toT   = nowInTz(toTz);
  const ahead = diffMinutes > 0 ? toCityAr : diffMinutes < 0 ? fromCityAr : null;
  const nowHFromCity = fromT.h + fromT.m / 60;

  return (
    <div dir="rtl" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '16px',
      padding: '20px',
      marginTop: '12px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
          الوقت الآن — مباشر
        </span>
        <span style={{
          display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
          background: '#10b981', boxShadow: '0 0 6px #10b98180',
          animation: 'none',
        }} />
      </div>

      {/* Dual clock display */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center',
      }}>
        {/* From city */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>
            {fromCityAr}
          </div>
          <div style={{
            fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: '800',
            color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.5px', direction: 'ltr', lineHeight: 1,
          }}>
            {fmtClock(fromT.h, fromT.m, fromT.s)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {localDateStr(fromTz)}
          </div>
        </div>

        {/* Diff badge */}
        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          {diffMinutes !== 0 && (
            <>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                {ahead} تسبق
              </div>
              <div style={{
                fontSize: '16px', fontWeight: '800', color: 'var(--text-accent)',
                direction: 'ltr', lineHeight: 1, whiteSpace: 'nowrap',
              }}>
                {(() => {
                  const abs = Math.abs(diffMinutes);
                  const h = Math.floor(abs / 60);
                  const m = abs % 60;
                  return `${h > 0 ? h + 'h' : ''}${m > 0 ? (h > 0 ? ' ' : '') + m + 'm' : ''}`;
                })()}
              </div>
            </>
          )}
          {diffMinutes === 0 && (
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>متطابق</div>
          )}
        </div>

        {/* To city */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '500' }}>
            {toCityAr}
          </div>
          <div style={{
            fontSize: 'clamp(26px, 5vw, 36px)', fontWeight: '800',
            color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.5px', direction: 'ltr', lineHeight: 1,
          }}>
            {fmtClock(toT.h, toT.m, toT.s)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {localDateStr(toTz)}
          </div>
        </div>
      </div>

      {/* Meeting overlap bar */}
      <OverlapBar
        diffMinutes={diffMinutes}
        fromCityAr={fromCityAr}
        toCityAr={toCityAr}
        nowHFromCity={nowHFromCity}
      />
    </div>
  );
}
