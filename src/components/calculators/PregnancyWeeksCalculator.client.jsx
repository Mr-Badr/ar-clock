"use client";

import { useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  calculatePregnancy,
  formatPregnancyWeek,
  TRIMESTER_INFO,
  PREGNANCY_MILESTONES,
} from '@/lib/calculators/pregnancy';

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

export default function PregnancyWeeksCalculator() {
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = today.toISOString().split('T')[0];
  const minDate = new Date(today.getTime() - 294 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const result = useMemo(() => {
    if (!lmpDate) return null;
    return calculatePregnancy({ lmpDate, cycleLength, today: new Date() });
  }, [lmpDate, cycleLength]);

  const tInfo = result ? (TRIMESTER_INFO[result.trimester] ?? TRIMESTER_INFO[1]) : null;

  const nextMilestone = result?.milestones?.find((m) => !m.reached && !m.current);
  const currentMilestone = result?.milestones?.find((m) => m.current);

  const shareText = result?.isValid
    ? `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل\n${tInfo?.label ?? ''}\nموعد الولادة المتوقع: ${formatDateAr(result.edd)}\n${result.progressPercent}% مكتمل`
    : '';

  return (
    <div className="calc-app pregnancy-weeks-tool" aria-label="حاسبة أسابيع الحمل">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div className="calc-surface-card calc-esb-form-card">
            <div className="calc-esb-form-body">

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="pw-lmp">أول يوم في آخر دورة شهرية</Label>
                </div>
                <input
                  id="pw-lmp"
                  type="date"
                  className="pregnancy-date-input"
                  value={lmpDate}
                  max={maxDate}
                  min={minDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  dir="ltr"
                />
                <p className="calc-hint">
                  لا تعرفي التاريخ الميلادي؟{' '}
                  <a href="/date/converter" className="pregnancy-hint-link">حوّلي من هجري ↔ ميلادي</a>
                </p>
              </div>

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>طول الدورة</Label>
                </div>
                <div className="calc-kbd-row">
                  {CYCLE_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      className={`chip calc-chip-button${cycleLength === p.value ? ' is-active' : ''}`}
                      onClick={() => setCycleLength(p.value)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RESULTS ─────────────────────────────── */}
        <div className="calc-esb-result-col">
          {!result && (
            <div className="pregnancy-weeks-empty">
              <Baby size={48} weight="duotone" className="pregnancy-empty-icon" />
              <p>أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك الحالي</p>
            </div>
          )}

          {result?.isValid && (
            <>
              {/* Week display */}
              <div
                className="pregnancy-weeks-card"
                style={{
                  border: `2px solid ${tInfo?.color ?? 'var(--border)'}`,
                  background: `${tInfo?.color ?? 'var(--color-accent)'}12`,
                }}
              >
                <Baby size={32} color={tInfo?.color} weight="duotone" />
                <div className="pregnancy-weeks-value" style={{ color: tInfo?.color }}>
                  {formatPregnancyWeek(result.weeksPregnant, result.extraDays)}
                </div>
                <div className="pregnancy-weeks-subtitle">
                  {tInfo?.label} ({tInfo?.range})
                </div>

                {/* Progress bar */}
                <div className="pregnancy-weeks-progress-track">
                  <div
                    className="pregnancy-weeks-progress-fill"
                    style={{ width: `${result.progressPercent}%`, background: tInfo?.color }}
                  />
                </div>
                <div className="pregnancy-weeks-pct">
                  {result.progressPercent}% من الحمل مكتمل
                </div>
              </div>

              {/* Key dates */}
              <div className="pregnancy-weeks-dates-grid">
                <div className="calc-result-chip">
                  <span className="chip-label">أيام الحمل</span>
                  <span className="chip-value">{result.daysPregnant} يوم</span>
                </div>
                <div className="calc-result-chip">
                  <span className="chip-label">باقي على الولادة</span>
                  <span className="chip-value">{Math.max(0, result.daysToEdd)} يوم</span>
                </div>
                <div className="calc-result-chip">
                  <span className="chip-label">موعد الولادة المتوقع</span>
                  <span className="chip-value">{formatDateAr(result.edd)}</span>
                </div>
              </div>

              {/* Current milestone */}
              {currentMilestone && (
                <div className="pregnancy-weeks-milestone">
                  <CheckCircle size={20} color={tInfo?.color} weight="fill" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div className="pregnancy-weeks-milestone__title">الأسبوع الحالي: {currentMilestone.label}</div>
                    <div className="pregnancy-weeks-milestone__detail">{currentMilestone.detail}</div>
                  </div>
                </div>
              )}

              {/* Next milestone */}
              {nextMilestone && (
                <div className="pregnancy-weeks-milestone pregnancy-weeks-milestone--next">
                  <CalendarBlank size={20} color="var(--text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div className="pregnancy-weeks-milestone__title">المحطة القادمة — الأسبوع {nextMilestone.week}: {nextMilestone.label}</div>
                    <div className="pregnancy-weeks-milestone__detail">{nextMilestone.detail}</div>
                    <div className="pregnancy-weeks-milestone__date">{formatDateAr(nextMilestone.date)}</div>
                  </div>
                </div>
              )}

              <ResultActions shareText={shareText} />
            </>
          )}

          {result && !result.isValid && (
            <p className="pregnancy-weeks-error">
              التاريخ المدخل يتجاوز 42 أسبوعاً — أدخلي تاريخ آخر دورة صحيح.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
