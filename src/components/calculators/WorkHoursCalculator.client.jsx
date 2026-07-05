"use client";

import { useEffect, useMemo, useState } from 'react';
import { Clock, ClockCountdown, Warning } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { calculateWorkHours } from '@/lib/calculators/engine';

const STORAGE_KEY = 'miqatona-work-hours-v1';

const DAY_LABELS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DAY_SHORT  = ['أحد', 'اثن', 'ثلا', 'أربع', 'خمي', 'جمع', 'سبت'];

const WEEKEND_MODES = {
  islamic: { label: '🕌 خليجي (ج–س)', offDays: [5, 6] },   // Fri + Sat off
  western: { label: '🌍 مغاربي (س–أ)', offDays: [6, 0] },   // Sat + Sun off
};

function makeDefault(offDays) {
  return Array.from({ length: 7 }, (_, i) => ({
    active:   !offDays.includes(i),
    start:    '09:00',
    end:      '17:00',
    breakMin: 60,
  }));
}

function fmtHours(h) {
  const whole = Math.floor(h);
  const mins  = Math.round((h - whole) * 60);
  if (mins === 0) return `${whole}س`;
  return `${whole}س ${mins}د`;
}

export default function WorkHoursCalculator() {
  const [weekendMode, setWeekendMode] = useState('islamic');
  const [schedule, setSchedule] = useState(() => makeDefault([5, 6]));

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved?.schedule?.length === 7) {
        setSchedule(saved.schedule);
        if (saved.weekendMode) setWeekendMode(saved.weekendMode);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schedule, weekendMode }));
    } catch {}
  }, [schedule, weekendMode]);

  const result = useMemo(
    () => calculateWorkHours({ schedule, regularDailyHours: 8, regularWeeklyHours: 40 }),
    [schedule],
  );

  function applyWeekend(mode) {
    setWeekendMode(mode);
    const { offDays } = WEEKEND_MODES[mode];
    setSchedule((prev) =>
      prev.map((day, i) => ({ ...day, active: !offDays.includes(i) })),
    );
  }

  function patchDay(i, patch) {
    setSchedule((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }

  const shareText = result?.isValid
    ? `ساعات العمل هذا الأسبوع\nإجمالي: ${fmtHours(result.totalHours)} (${result.activeDays} أيام)\nإضافي: ${fmtHours(result.overtimeHours)}`
    : '';

  return (
    <div className="calc-app wh-tool" aria-label="حاسبة ساعات العمل الأسبوعية">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <Card className="calc-surface-card calc-esb-form-card">
            <CardContent className="calc-esb-form-body">

              {/* Weekend mode */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label>نوع عطلة الأسبوع</Label>
                </div>
                <div className="wh-mode-row">
                  {Object.entries(WEEKEND_MODES).map(([key, { label }]) => (
                    <button
                      key={key}
                      type="button"
                      className={`wh-mode-btn${weekendMode === key ? ' is-active' : ''}`}
                      onClick={() => applyWeekend(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day schedule */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>جدول الدوام اليومي</Label>
                </div>

                <div className="wh-days-grid">
                  {schedule.map((day, i) => (
                    <div
                      key={i}
                      className={`wh-day-row${day.active ? ' is-active' : ''}`}
                    >
                      {/* Day toggle */}
                      <button
                        type="button"
                        className="wh-day-toggle"
                        onClick={() => patchDay(i, { active: !day.active })}
                        aria-pressed={day.active}
                        aria-label={`تفعيل ${DAY_LABELS[i]}`}
                      >
                        {DAY_SHORT[i]}
                      </button>

                      {/* Time inputs — shown when active */}
                      {day.active ? (
                        <div className="wh-day-inputs">
                          <input
                            type="time"
                            className="wh-time-input"
                            value={day.start}
                            onChange={(e) => patchDay(i, { start: e.target.value })}
                            aria-label={`وقت البداية — ${DAY_LABELS[i]}`}
                          />
                          <span className="wh-time-sep">—</span>
                          <input
                            type="time"
                            className="wh-time-input"
                            value={day.end}
                            onChange={(e) => patchDay(i, { end: e.target.value })}
                            aria-label={`وقت النهاية — ${DAY_LABELS[i]}`}
                          />
                          <span className="wh-day-result" aria-live="polite">
                            {result?.days?.[i]?.hours > 0
                              ? fmtHours(result.days[i].hours)
                              : '—'}
                          </span>
                        </div>
                      ) : (
                        <span className="wh-day-off-label">إجازة</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Break duration */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">3</span>
                  <Label htmlFor="wh-break">استراحة يومية</Label>
                </div>
                <div className="wh-break-row">
                  {[0, 30, 60, 90].map((min) => (
                    <button
                      key={min}
                      type="button"
                      className={`wh-break-btn${schedule.find((d) => d.active)?.breakMin === min ? ' is-active' : ''}`}
                      onClick={() =>
                        setSchedule((prev) => prev.map((d) => ({ ...d, breakMin: min })))
                      }
                    >
                      {min === 0 ? 'بلا' : `${min}د`}
                    </button>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {result?.isValid && (
            <div className="calc-esb-sidebar-facts">
              <div className="calc-esb-fact">
                <Clock size={14} weight="bold" />
                <span>حد السعودية/الإمارات: <strong>40 ساعة</strong>/أسبوع</span>
              </div>
              <div className="calc-esb-fact">
                <Clock size={14} weight="bold" />
                <span>حد مصر/الكويت/قطر: <strong>48 ساعة</strong>/أسبوع</span>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">
          {result?.isValid ? (
            <div className="calc-esb-result-panel" aria-live="polite">

              <div className="calc-esb-result-header">
                <span
                  className="calc-esb-country-badge"
                  style={{
                    color: 'var(--blue)',
                    borderColor: 'color-mix(in srgb, var(--blue) 40%, transparent)',
                    background: 'color-mix(in srgb, var(--blue) 10%, transparent)',
                  }}
                >
                  ⏱️ {result.activeDays} أيام عمل
                </span>
                <span className="calc-esb-live-dot" aria-hidden="true" style={{ background: 'var(--blue)' }} />
              </div>

              <div className="calc-esb-amount-hero">
                <span className="calc-esb-amount-label">إجمالي ساعات الأسبوع</span>
                <div
                  className="calc-esb-amount-value"
                  style={{ color: result.overtimeHours > 0 ? 'var(--amber)' : 'var(--blue)' }}
                >
                  {fmtHours(result.totalHours)}
                </div>
                <div className="calc-esb-amount-meta">
                  <span>عادي: {fmtHours(result.regularHours)}</span>
                  {result.overtimeHours > 0 && (
                    <>
                      <span className="calc-esb-sep">·</span>
                      <span style={{ color: 'var(--amber)' }}>إضافي: {fmtHours(result.overtimeHours)}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Daily breakdown */}
              <div className="wh-day-bars">
                {result.days.map((day, i) => (
                  day.active && day.minutes > 0 ? (
                    <div key={i} className="wh-day-bar-row">
                      <span className="wh-day-bar-label">{DAY_SHORT[i]}</span>
                      <div className="wh-day-bar-track">
                        <div
                          className="wh-day-bar-fill"
                          style={{
                            width: `${Math.min(100, (day.hours / 10) * 100)}%`,
                            background: day.dailyOvertime > 0 ? 'var(--amber)' : 'var(--blue)',
                          }}
                        />
                      </div>
                      <span className="wh-day-bar-value">{fmtHours(day.hours)}</span>
                    </div>
                  ) : null
                ))}
              </div>

              {result.overtimeHours > 0 && (
                <div className="eg-si-tax-note" style={{ borderColor: 'color-mix(in srgb, var(--amber) 40%, transparent)', background: 'color-mix(in srgb, var(--amber) 8%, transparent)' }}>
                  <Warning size={14} weight="fill" style={{ color: 'var(--amber)' }} />
                  <span style={{ color: 'var(--amber)' }}>
                    لديك {fmtHours(result.overtimeHours)} عمل إضافي هذا الأسبوع. وفق نظام العمل السعودي: الأجر الإضافي ≥ 150% من أجر الساعة.
                  </span>
                </div>
              )}

              <ResultActions
                copyText={shareText}
                shareTitle="ساعات العمل الأسبوعية"
                shareText={shareText}
              />

              <div className="calc-esb-reason-strip">
                <Warning size={14} weight="fill" />
                <span>الجدول يُحفظ تلقائياً في هذا الجهاز فقط. استشر قسم الموارد البشرية في شركتك لتفاصيل أجر الإضافي.</span>
              </div>

            </div>
          ) : (
            <div className="calc-esb-empty-state">
              <ClockCountdown size={28} weight="duotone" />
              <p>فعّل الأيام وأدخل أوقات دوامك لحساب مجموع ساعات الأسبوع.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
