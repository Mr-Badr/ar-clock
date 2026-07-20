'use client';

/**
 * SharedHoursBar — the page's single 24-hour overlap visual.
 * Replaces three previously-duplicated widgets (DualLiveClock's OverlapBar,
 * Timeline24h, and the calculator's own 24-slot double grid) with one
 * editable, token-only bar: both cities' business windows, the overlap,
 * and a live "now" marker.
 */

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';

function fmtTime(totalMins) {
  const norm = ((Math.round(totalMins) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function nowHourIn(tz) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour: 'numeric', minute: 'numeric', hour12: false,
    }).formatToParts(new Date());
    const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10) % 24;
    const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
    return h + m / 60;
  } catch { return 0; }
}

const pct = (h) => `${Math.min(100, Math.max(0, (h / 24) * 100))}%`;

export default function SharedHoursBar({ fromCityAr, toCityAr, fromTz, diffMinutes }) {
  const [bizStart, setBizStart] = useState(9);
  const [bizEnd, setBizEnd] = useState(17);
  const [nowH, setNowH] = useState(null);

  useEffect(() => {
    if (!fromTz) return undefined;
    const update = () => setNowH(nowHourIn(fromTz));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [fromTz]);

  const diffHours = diffMinutes / 60;

  const calc = useMemo(() => {
    const toStart = bizStart - diffHours;
    const toEnd = bizEnd - diffHours;
    const overlapStart = Math.max(bizStart, toStart);
    const overlapEnd = Math.min(bizEnd, toEnd);
    const hasOverlap = overlapStart < overlapEnd;
    return { toStart, toEnd, overlapStart, overlapEnd, hasOverlap };
  }, [bizStart, bizEnd, diffHours]);

  const { toStart, toEnd, overlapStart, overlapEnd, hasOverlap } = calc;
  const toLeft = Math.max(0, Math.min(24, toStart));
  const toRight = Math.max(0, Math.min(24, toEnd));

  return (
    <div className="card td-hours">
      <div className="td-hours__header">
        <span className="td-hours__icon" aria-hidden="true"><Briefcase size={16} /></span>
        <div>
          <p className="td-hours__title">أفضل وقت للتواصل</p>
          <p className="td-hours__subtitle">عدّل ساعات الدوام لمعرفة التقاطع الفعلي بين الطرفين</p>
        </div>
      </div>

      {/* Editable business hours */}
      <div className="td-hours__controls">
        {[
          { label: 'بداية الدوام', val: bizStart, onDec: () => setBizStart(v => Math.max(0, v - 1)), onInc: () => setBizStart(v => Math.min(bizEnd - 1, v + 1)) },
          { label: 'نهاية الدوام', val: bizEnd, onDec: () => setBizEnd(v => Math.max(bizStart + 1, v - 1)), onInc: () => setBizEnd(v => Math.min(23, v + 1)) },
        ].map((c) => (
          <div key={c.label} className="td-hours__control">
            <span className="td-hours__control-label">{c.label}</span>
            <div className="td-hours__stepper">
              <button type="button" onClick={c.onDec} aria-label={`تقليل ${c.label}`} className="td-hours__stepper-btn">
                <ChevronDown size={15} />
              </button>
              <span className="td-hours__stepper-val tabular-nums" dir="ltr">{c.val}:00</span>
              <button type="button" onClick={c.onInc} aria-label={`زيادة ${c.label}`} className="td-hours__stepper-btn">
                <ChevronUp size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Result banner */}
      {hasOverlap ? (
        <div className="td-hours__banner td-hours__banner--success">
          <p className="td-hours__banner-title"><CheckCircle2 size={13} aria-hidden="true" /> يوجد وقت مشترك مناسب للتواصل</p>
          <div className="td-hours__banner-grid">
            <div><span className="td-hours__banner-city">{fromCityAr}</span><span className="td-hours__banner-time tabular-nums" dir="ltr">{fmtTime(overlapStart * 60)} – {fmtTime(overlapEnd * 60)}</span></div>
            <div><span className="td-hours__banner-city">{toCityAr}</span><span className="td-hours__banner-time tabular-nums" dir="ltr">{fmtTime((overlapStart + diffHours) * 60)} – {fmtTime((overlapEnd + diffHours) * 60)}</span></div>
          </div>
        </div>
      ) : (
        <div className="td-hours__banner td-hours__banner--warning">
          <p className="td-hours__banner-title"><AlertTriangle size={13} aria-hidden="true" /> لا يوجد تقاطع بساعات الدوام الحالية — جرّب تعديلها أعلاه</p>
        </div>
      )}

      {/* 24h bar */}
      <div className="td-hours__bar" role="img" aria-label={`شريط 24 ساعة يوضح ساعات دوام ${fromCityAr} و${toCityAr} والتقاطع بينهما`}>
        <div className="td-hours__band td-hours__band--from" style={{ insetInlineStart: pct(bizStart), width: pct(bizEnd - bizStart) }} />
        {toRight > toLeft && (
          <div className="td-hours__band td-hours__band--to" style={{ insetInlineStart: pct(toLeft), width: pct(toRight - toLeft) }} />
        )}
        {hasOverlap && (
          <div className="td-hours__band td-hours__band--overlap" style={{ insetInlineStart: pct(overlapStart), width: pct(overlapEnd - overlapStart) }} />
        )}
        {nowH !== null && (
          <div className="td-hours__now" style={{ insetInlineStart: pct(nowH) }}>
            <span className="td-hours__now-label">الآن</span>
          </div>
        )}
      </div>
      <div className="td-hours__ticks" aria-hidden="true">
        <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
      </div>

      <div className="td-hours__legend">
        <span className="td-hours__legend-item"><span className="td-hours__legend-swatch td-hours__legend-swatch--from" />{fromCityAr}</span>
        <span className="td-hours__legend-item"><span className="td-hours__legend-swatch td-hours__legend-swatch--to" />{toCityAr}</span>
        <span className="td-hours__legend-item"><span className="td-hours__legend-swatch td-hours__legend-swatch--overlap" />وقت مشترك</span>
      </div>
    </div>
  );
}
