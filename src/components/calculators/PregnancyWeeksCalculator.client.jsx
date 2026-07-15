"use client";

import { useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Circle, Timer } from '@phosphor-icons/react';

import { CalcInput as Input } from '@/components/calculators/controls.client';
import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import {
  calculatePregnancy,
  formatPregnancyWeek,
  TRIMESTER_INFO,
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

  const reachedMilestones = result?.milestones?.filter((m) => m.reached || m.current) ?? [];
  const upcomingMilestones = result?.milestones?.filter((m) => !m.reached && !m.current) ?? [];

  const shareText = result?.isValid
    ? [
        `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل`,
        `${tInfo?.label ?? ''} · ${result.progressPercent}% مكتمل`,
        `موعد الولادة المتوقع: ${formatDateAr(result.edd)}`,
      ].filter(Boolean).join('\n')
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
                <Input
                  id="pw-lmp"
                  type="date"
                  dir="ltr"
                  value={lmpDate}
                  max={maxDate}
                  min={minDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                />
                <p className="calc-hint">
                  لا تعرفين التاريخ الميلادي؟{' '}
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
                <p className="calc-hint">المعيار الطبي 28 يوم — غيّري فقط إذا كانت دورتك منتظمة بطول مختلف.</p>
              </div>

            </div>
          </div>

          {/* Sidebar quick facts */}
          <div className="calc-esb-sidebar-facts">
            <div className="calc-esb-fact">
              <CalendarBlank size={15} weight="bold" />
              <span>طول الدورة: <strong>{cycleLength} يوم</strong></span>
            </div>
            {result?.isValid && (
              <div className="calc-esb-fact">
                <Baby size={15} weight="bold" />
                <span>{tInfo?.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">

          {!result && (
            <div className="calc-esb-empty-state">
              <Baby size={28} weight="duotone" className="pregnancy-empty-icon" />
              <p>أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك الحالي وموعد الولادة المتوقع فوراً.</p>
            </div>
          )}

          {result && !result.isValid && (
            <div className="calc-esb-empty-state">
              <Baby size={28} weight="duotone" className="pregnancy-empty-icon" />
              <p>التاريخ المدخل يتجاوز 42 أسبوعاً — تأكدي من صحة تاريخ آخر دورة.</p>
            </div>
          )}

          {result?.isValid && tInfo && (
            <div className={`calc-esb-result-panel pregnancy-result pregnancy-result--${tInfo.level}`} aria-live="polite">
              <div className="calc-esb-result-header">
                <span className={`calc-esb-country-badge pregnancy-trimester-badge--${tInfo.level}`}>🤰 أسبوع الحمل</span>
                <span className="calc-esb-live-dot" aria-hidden="true" />
              </div>

              {/* Week + Trimester */}
              <div className="pregnancy-week-hero">
                <span className="calc-esb-amount-label">أنتِ الآن في</span>
                <div className={`calc-esb-amount-value pregnancy-week-value--${tInfo.level}`}>
                  {formatPregnancyWeek(result.weeksPregnant, result.extraDays)}
                </div>
                <span className={`pregnancy-category-badge pregnancy-category-badge--${tInfo.level}`}>
                  {tInfo.label} · {tInfo.range}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pregnancy-progress-wrap">
                <div className="pregnancy-progress-track">
                  <div
                    className={`pregnancy-progress-fill pregnancy-progress-fill--${tInfo.level}`}
                    style={{ width: `${result.progressPercent}%` }}
                    aria-label={`${result.progressPercent}% من الحمل مكتمل`}
                  />
                </div>
                <div className="pregnancy-progress-labels">
                  <span>الأسبوع 1</span>
                  <span className={`pregnancy-progress-pct--${tInfo.level}`}>{result.progressPercent}% مكتمل</span>
                  <span>الأسبوع 40</span>
                </div>
              </div>

              {/* Key dates breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span className="calc-icon-label">
                    <CalendarBlank size={14} weight="bold" />
                    موعد الولادة المتوقع
                  </span>
                  <strong>{formatDateAr(result.edd)}</strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
                    <Timer size={14} weight="bold" />
                    {result.daysToEdd >= 0 ? 'باقي على الولادة' : 'مضى على موعد الولادة'}
                  </span>
                  <strong>{Math.abs(result.daysToEdd)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>أيام الحمل المنقضية</span>
                  <strong>{result.daysPregnant} يوم</strong>
                </div>
              </div>

              {/* Milestones */}
              {upcomingMilestones.length > 0 && (
                <div className="pregnancy-milestones">
                  <p className="pregnancy-milestones-title">المحطات القادمة</p>
                  {upcomingMilestones.slice(0, 3).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--upcoming">
                      <Circle size={15} weight="regular" className="milestone-icon" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div className="pregnancy-milestone-text">
                        <span className="pregnancy-milestone-week">أسبوع {m.week}</span>
                        <span className="pregnancy-milestone-label">{m.label}</span>
                      </div>
                      <span className="pregnancy-milestone-date">{formatDateAr(m.date)}</span>
                    </div>
                  ))}
                </div>
              )}

              {reachedMilestones.length > 0 && (
                <div className="pregnancy-milestones">
                  <p className="pregnancy-milestones-title">محطات مررتِ بها</p>
                  {reachedMilestones.slice(-3).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--done">
                      <CheckCircle size={15} weight="fill" className={`pregnancy-milestone-check--${tInfo.level}`} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div className="pregnancy-milestone-text">
                        <span className="pregnancy-milestone-week">أسبوع {m.week}</span>
                        <span className="pregnancy-milestone-label">{m.label}</span>
                      </div>
                      <span className="pregnancy-milestone-date">{formatDateAr(m.date)}</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="bmi-disclaimer">
                نتيجة تقديرية وفق قاعدة ناجيل الطبية — راجعي طبيبك لتأكيد أسبوع الحمل، خاصة عبر سونار الأسبوع 8–14.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة أسابيع الحمل"
                shareText={shareText}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
