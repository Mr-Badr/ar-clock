'use client';
import React, { useState, useCallback } from 'react';
import { ArrowLeftRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRESETS = [
  { label: '8:00 ص', h: 8, m: 0, p: 'am' },
  { label: '12:00 م', h: 12, m: 0, p: 'pm' },
  { label: '3:00 م', h: 3, m: 0, p: 'pm' },
  { label: '5:00 م', h: 5, m: 0, p: 'pm' },
  { label: '9:00 م', h: 9, m: 0, p: 'pm' },
];

function to24h(h12, m, period) {
  let h = h12 % 12;
  if (period === 'pm') h += 12;
  return h * 60 + m;
}

function fromMinutes(totalMins) {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h24 >= 12 ? 'م' : 'ص';
  const h12 = h24 % 12 || 12;
  return { h12, m, period, h24, norm };
}

function dayIndicator(srcTotalMins, diffMins) {
  const dest = srcTotalMins + diffMins;
  if (dest >= 1440) return { label: '+1 يوم', cls: 'text-[var(--warning)]' };
  if (dest < 0) return { label: '-1 يوم', cls: 'text-[var(--warning)]' };
  return null;
}

export default function TimeConverter({ fromCity, toCity, totalMinutes = 0 }) {
  const [hour, setHour] = useState(9);      // 1–12
  const [minute, setMinute] = useState(0);  // 0, 15, 30, 45
  const [period, setPeriod] = useState('am');
  const [swapped, setSwapped] = useState(false); // direction: from→to or to→from

  // Effective diff: when swapped, reverse the offset
  const effectiveDiff = swapped ? -totalMinutes : totalMinutes;

  const srcCity  = swapped ? toCity  : fromCity;
  const destCity = swapped ? fromCity : toCity;

  const srcTotalMins  = to24h(hour, minute, period);
  const destResult    = fromMinutes(srcTotalMins + effectiveDiff);
  const dayIndicator_ = dayIndicator(srcTotalMins, effectiveDiff);

  const selectPreset = useCallback((p) => {
    setHour(p.h);
    setMinute(p.m);
    setPeriod(p.p);
  }, []);

  const periodLabel = period === 'am' ? 'صباحًا' : 'مساءً';

  if (!fromCity || !toCity) return null;

  return (
    <div
      role="region"
      aria-label="أداة تحويل الوقت السريع"
      className="bg-[var(--bg-surface-1)] border border-[var(--border-default)] rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
        <div className="bg-[var(--accent-soft)] p-2 rounded-xl">
          <Clock size={20} className="text-[var(--accent)]" />
        </div>
        <div>
          <h4 className="font-bold text-base">تحويل الوقت السريع</h4>
          <p className="text-xs text-[var(--text-muted)]">أدخل وقتًا في أي مدينة واعرف مقابله</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Direction toggle */}
        <div className="flex items-center bg-[var(--bg-surface-2)] rounded-2xl p-1 border border-[var(--border-subtle)]">
          <button
            onClick={() => setSwapped(false)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${!swapped ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            {fromCity.city_name_ar} ← {toCity.city_name_ar}
          </button>
          <button
            onClick={() => setSwapped(true)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${swapped ? 'bg-[var(--accent)] text-[var(--text-on-accent)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
          >
            {toCity.city_name_ar} ← {fromCity.city_name_ar}
          </button>
        </div>

        {/* Main conversion row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Source — Input */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-muted)] text-center">{srcCity.city_name_ar}</p>
            <div className="bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-2xl p-3 flex items-center gap-2 focus-within:border-[var(--accent)] transition-colors">
              {/* Hour */}
              <input
                type="number"
                min={1} max={12}
                value={hour}
                onChange={e => {
                  const v = Math.min(12, Math.max(1, parseInt(e.target.value) || 1));
                  setHour(v);
                }}
                aria-label="الساعة"
                className="w-10 bg-transparent text-center text-2xl font-black text-[var(--accent)] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[var(--text-muted)] font-black text-xl select-none">:</span>
              {/* Minutes */}
              <select
                value={minute}
                onChange={e => setMinute(Number(e.target.value))}
                aria-label="الدقائق"
                className="bg-transparent text-xl font-black text-[var(--accent)] outline-none w-12 text-center"
              >
                {[0, 15, 30, 45].map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                ))}
              </select>
              {/* AM/PM toggle */}
              <button
                onClick={() => setPeriod(p => p === 'am' ? 'pm' : 'am')}
                className="text-xs font-black bg-[var(--accent-soft)] hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)] text-[var(--accent)] rounded-lg px-2 py-1 transition-colors"
              >
                {period === 'am' ? 'ص' : 'م'}
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1 text-[var(--text-muted)]">
            <ArrowLeftRight size={20} className="text-[var(--accent)]" />
          </div>

          {/* Destination — Output */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[var(--text-muted)] text-center">{destCity.city_name_ar}</p>
            <div
              aria-live="polite"
              aria-atomic="true"
              className="bg-gradient-to-br from-[var(--accent)] to-[#38b2ac] rounded-2xl p-3 flex flex-col items-center justify-center min-h-[68px]"
            >
              <span className="text-2xl font-black text-white tabular-nums" dir="ltr">
                {destResult.h12}:{String(destResult.m).padStart(2, '0')} {destResult.period}
              </span>
              {dayIndicator_ && (
                <span className="text-xs text-white/80 font-bold mt-0.5">{dayIndicator_.label}</span>
              )}
            </div>
          </div>
        </div>

        {/* Descriptive sentence */}
        <p className="text-xs text-[var(--text-muted)] text-center">
          {hour}:{String(minute).padStart(2,'0')} {periodLabel} في <strong className="text-[var(--text-secondary)]">{srcCity.city_name_ar}</strong>
          {' = '}
          <strong className="text-[var(--accent)]">{destResult.h12}:{String(destResult.m).padStart(2,'0')} {destResult.period}</strong>
          {' في '}<strong className="text-[var(--text-secondary)]">{destCity.city_name_ar}</strong>
          {dayIndicator_ && <span className="text-[var(--warning)]"> ({dayIndicator_.label})</span>}
        </p>

        {/* Preset chips */}
        <div className="space-y-1.5">
          <p className="text-xs text-[var(--text-muted)] font-bold">اختر وقتًا شائعًا:</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => {
              const isActive = hour === p.h && minute === p.m && period === p.p;
              return (
                <button
                  key={p.label}
                  onClick={() => selectPreset(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 ${
                    isActive
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--text-on-accent)]'
                      : 'bg-[var(--bg-surface-2)] border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
