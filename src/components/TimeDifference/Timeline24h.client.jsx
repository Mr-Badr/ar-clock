'use client';
// Refreshed: 2026-03-03 to fix HMR cache
import React, { useMemo } from 'react';

/**
 * Timeline24h — lightweight 24-hour visual timeline.
 * Shows:
 * - Night/Day segments (based on golden hours)
 * - Current time marker for both cities
 * - Business hours overlap highlight
 * Tailwind only — no chart library.
 */
export default function Timeline24h({ fromCity, toCity, diffData }) {
  const data = useMemo(() => {
    if (!diffData?.success) return null;

    const nowUTC = new Date();
    const nowHoursUTC = nowUTC.getUTCHours() + nowUTC.getUTCMinutes() / 60 + nowUTC.getUTCSeconds() / 3600;
    
    // fromOffsetMinutes and toOffsetMinutes are provided by the updated API
    const fromHour = (nowHoursUTC + (diffData.fromOffsetMinutes / 60) + 24) % 24;
    const toHour   = (nowHoursUTC + (diffData.toOffsetMinutes / 60) + 24) % 24;

    const diffHours = diffData.totalMinutes / 60;

    // Business hours overlap calculation
    const bizStart = 9;
    const bizEnd = 17;
    const toBizStart = bizStart - diffHours;
    const toBizEnd = bizEnd - diffHours;
    const overlapStart = Math.max(bizStart, toBizStart);
    const overlapEnd = Math.min(bizEnd, toBizEnd);
    const hasOverlap = overlapStart < overlapEnd;

    return { fromHour, toHour, overlapStart, overlapEnd, hasOverlap, diffHours };
  }, [diffData]);

  if (!data) return null;

  const { fromHour, toHour, overlapStart, overlapEnd, hasOverlap } = data;

  // Convert hour to percentage
  const pct = (h) => `${((((h % 24) + 24) % 24) / 24) * 100}%`;

  // Day/Night segments (day: 6am-8pm = 25%-83%)
  const isDayHour = (h) => h >= 6 && h < 20;

  return (
    <div
      role="region"
      aria-label="مخطط التوقيت على مدار 24 ساعة"
      className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-3xl p-6"
    >
      <h4 className="font-bold text-lg mb-2">مخطط الوقت — 24 ساعة</h4>
      <p className="text-xs text-[var(--text-muted)] mb-6">
        يوضح الوقت الحالي في كلتا المدينتين وساعات العمل المشتركة
      </p>

      {/* Hour labels */}
      <div className="relative mb-2">
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
          {[0, 3, 6, 9, 12, 15, 18, 21, 24].map(h => (
            <span key={h}>{h}</span>
          ))}
        </div>
      </div>

      {/* Timeline Bar 1 — From City */}
      <div className="mb-6">
        <p className="text-xs font-bold text-[var(--text-muted)] mb-1">{fromCity?.city_name_ar}</p>
        <div className="relative h-8 rounded-full overflow-hidden bg-[var(--bg-surface-4)]">
          {/* Day segment */}
          <div
            className="absolute inset-y-0 bg-yellow-400/10"
            style={{ left: '25%', width: '58.33%' }}
            aria-hidden="true"
          />
          {/* Business hours */}
          <div
            className="absolute inset-y-0 bg-[var(--accent-soft)]"
            style={{ left: pct(9), width: `${(8 / 24) * 100}%` }}
            aria-label="ساعات العمل (9 ص – 5 م)"
          />
          {/* Overlap */}
          {hasOverlap && (
            <div
              className="absolute inset-y-0 bg-[var(--success-soft)] border-x-2 border-[var(--success-border)]"
              style={{
                left: pct(overlapStart),
                width: `${((overlapEnd - overlapStart) / 24) * 100}%`
              }}
              aria-label="وقت التقاطع"
            />
          )}
          {/* Now marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[var(--accent)] z-10"
            style={{ left: pct(fromHour) }}
            aria-hidden="true"
          >
            <div className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
          </div>
        </div>
        {/* Hour labels below bar */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--text-muted)]">منتصف الليل</span>
          <span className="text-[10px] text-[var(--accent)] font-bold">
            الآن: {(() => {
              const h = Math.floor(fromHour);
              const m = Math.round((fromHour % 1) * 60);
              const p = h >= 12 ? 'م' : 'ص';
              const h12 = h % 12 || 12;
              return `${h12}:${String(m).padStart(2, '0')} ${p}`;
            })()}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">منتصف الليل</span>
        </div>
      </div>

      {/* Timeline Bar 2 — To City */}
      <div className="mb-4">
        <p className="text-xs font-bold text-[var(--text-muted)] mb-1">{toCity?.city_name_ar}</p>
        <div className="relative h-8 rounded-full overflow-hidden bg-[var(--bg-surface-4)]">
          {/* Day segment for to city - shift by diffHours */}
          <div className="absolute inset-y-0 bg-yellow-400/10"
            style={{ left: pct(6 + data.diffHours), width: '58.33%' }}
            aria-hidden="true"
          />
          {/* Business hours (from their perspective) */}
          <div
            className="absolute inset-y-0 bg-[var(--accent-soft)]"
            style={{ left: pct(9 + data.diffHours), width: `${(8 / 24) * 100}%` }}
          />
          {/* Overlap from to city perspective */}
          {hasOverlap && (
            <div
              className="absolute inset-y-0 bg-[var(--success-soft)] border-x-2 border-[var(--success-border)]"
              style={{
                left: pct(overlapStart + data.diffHours),
                width: `${((overlapEnd - overlapStart) / 24) * 100}%`
              }}
            />
          )}
          {/* Now marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[var(--accent-alt)] z-10"
            style={{ left: pct(toHour) }}
          >
            <div className="absolute -top-1 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--accent-alt)] shadow-[0_0_6px_var(--accent-alt)]" />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--text-muted)]">منتصف الليل</span>
          <span className="text-[10px] text-[var(--accent-alt)] font-bold">
            الآن: {(() => {
              const h = Math.floor(toHour);
              const m = Math.round((toHour % 1) * 60);
              const p = h >= 12 ? 'م' : 'ص';
              const h12 = h % 12 || 12;
              return `${h12}:${String(m).padStart(2, '0')} ${p}`;
            })()}
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">منتصف الليل</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-subtle)] text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-yellow-400/30" />
          <span className="text-[var(--text-muted)]">نهار</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-[var(--accent-soft)] border border-[var(--border-accent)]" />
          <span className="text-[var(--text-muted)]">ساعات العمل (9–17)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2 rounded-sm bg-[var(--success-soft)] border border-[var(--success-border)]" />
          <span className="text-[var(--text-muted)]">التقاطع</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
          <span className="text-[var(--text-muted)]">{fromCity?.city_name_ar} — الآن</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-alt)]" />
          <span className="text-[var(--text-muted)]">{toCity?.city_name_ar} — الآن</span>
        </div>
      </div>
    </div>
  );
}
