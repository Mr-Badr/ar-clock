"use client";

import { useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Circle, Timer } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { getHijriParts } from '@/lib/hijri-utils';
import { calculatePregnancy, formatPregnancyWeek, TRIMESTER_INFO } from '@/lib/calculators/pregnancy';

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '25 يوم', value: 25 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatHijriDate(parts) {
  if (!parts || !parts.hijriDay) return '';
  return `${parts.hijriDay} ${parts.hijriMonthName} ${parts.hijriYear} هـ`;
}

export default function PregnancyCalculator() {
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

  const tInfo = result ? (TRIMESTER_INFO[result.trimester] || TRIMESTER_INFO[1]) : null;
  const eddHijri = result?.edd ? getHijriParts(result.edd) : null;

  const shareText = result?.isValid
    ? [
        `أنا في ${formatPregnancyWeek(result.weeksPregnant, result.extraDays)} من الحمل`,
        `موعد الولادة المتوقع: ${formatDateAr(result.edd)}`,
        eddHijri ? `(${formatHijriDate(eddHijri)})` : '',
        `${result.progressPercent}% من الحمل مكتمل`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const reachedMilestones = result?.milestones?.filter((m) => m.reached || m.current) ?? [];
  const upcomingMilestones = result?.milestones?.filter((m) => !m.reached && !m.current) ?? [];

  return (
    <div className="calc-app pregnancy-tool" aria-label="حاسبة الحمل وموعد الولادة">
      <div className="calc-esb-layout">

        {/* ── FORM ─────────────────────────────────── */}
        <div className="calc-esb-form-col">
          <div
            className="calc-surface-card calc-esb-form-card"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-1)',
            }}
          >
            <div className="calc-esb-form-body">

              {/* LMP date */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="pregnancy-lmp">أول يوم في آخر دورة شهرية</Label>
                </div>
                <input
                  id="pregnancy-lmp"
                  type="date"
                  className="pregnancy-date-input"
                  value={lmpDate}
                  max={maxDate}
                  min={minDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  dir="ltr"
                />
                <p className="calc-hint">
                  أدخل أول يوم في آخر دورة شهرية — ليس يوم التأخر أو اختبار الحمل.
                  {' '}<a href="/date/converter" className="pregnancy-hint-link">حوّلي التاريخ من هجري ↔ ميلادي</a>
                </p>
              </div>

              {/* Cycle length */}
              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">2</span>
                  <Label>طول الدورة الشهرية</Label>
                </div>
                <div className="calc-kbd-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                  {CYCLE_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      className={`chip calc-chip-button${cycleLength === preset.value ? ' is-active' : ''}`}
                      onClick={() => setCycleLength(preset.value)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="calc-hint">المعيار الطبي هو 28 يوم — غيّري هذا فقط إذا كانت دورتك منتظمة بطول مختلف.</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ───────────────────────────────── */}
        <div className="calc-esb-result-col">

          {!lmpDate && (
            <div className="calc-esb-empty-state">
              <Baby size={32} weight="duotone" style={{ color: '#e11d48' }} />
              <p>أدخلي تاريخ آخر دورة لمعرفة أسبوع حملك وموعد الولادة بالميلادي والهجري.</p>
            </div>
          )}

          {lmpDate && (!result || !result.isValid) && (
            <div className="calc-esb-empty-state">
              <Baby size={28} weight="duotone" style={{ color: '#e11d48' }} />
              <p>التاريخ يبدو خارج النطاق — تأكدي من إدخال أول يوم في آخر دورة (خلال آخر 42 أسبوعاً).</p>
            </div>
          )}

          {result?.isValid && tInfo && (
            <div className="calc-result-hero-panel pregnancy-result" aria-live="polite">

              {/* Week + Trimester */}
              <div className="pregnancy-week-hero">
                <span className="calc-result-hero-label">أنتِ الآن في</span>
                <div
                  className="calc-result-hero-value"
                  style={{ color: tInfo.color, fontSize: '2rem', lineHeight: 1.1 }}
                >
                  {formatPregnancyWeek(result.weeksPregnant, result.extraDays)}
                </div>
                <span
                  className="bmi-category-badge"
                  style={{
                    background: `${tInfo.color}20`,
                    color: tInfo.color,
                    border: `1px solid ${tInfo.color}40`,
                    display: 'inline-block',
                    marginTop: '0.35rem',
                  }}
                >
                  {tInfo.label} · {tInfo.range}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pregnancy-progress-wrap">
                <div className="pregnancy-progress-track">
                  <div
                    className="pregnancy-progress-fill"
                    style={{ width: `${result.progressPercent}%`, background: tInfo.color }}
                    aria-label={`${result.progressPercent}% من الحمل مكتمل`}
                  />
                </div>
                <div className="pregnancy-progress-labels">
                  <span>الأسبوع 1</span>
                  <span style={{ color: tInfo.color, fontWeight: 700 }}>{result.progressPercent}% مكتمل</span>
                  <span>الأسبوع 40</span>
                </div>
              </div>

              {/* EDD breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    موعد الولادة المتوقع (ميلادي)
                  </span>
                  <strong>{formatDateAr(result.edd)}</strong>
                </div>
                {eddHijri && (
                  <div className="calc-esb-brow">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CalendarBlank size={14} weight="bold" />
                      موعد الولادة (هجري)
                    </span>
                    <strong>{formatHijriDate(eddHijri)}</strong>
                  </div>
                )}
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Timer size={14} weight="bold" />
                    {result.daysToEdd >= 0 ? 'باقي على الولادة' : 'مضى على موعد الولادة'}
                  </span>
                  <strong>{Math.abs(result.daysToEdd)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>أيام الحمل المنقضية</span>
                  <strong>{result.daysPregnant} يوم ({result.weeksPregnant} أسبوع)</strong>
                </div>
              </div>

              {/* Milestone timeline */}
              {upcomingMilestones.length > 0 && (
                <div className="pregnancy-milestones">
                  <p className="pregnancy-milestones-title">المحطات القادمة</p>
                  {upcomingMilestones.slice(0, 4).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--upcoming">
                      <Circle size={15} weight="regular" style={{ color: 'var(--fg-subtle)', flexShrink: 0, marginTop: 2 }} />
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
                  {reachedMilestones.slice(-4).map((m) => (
                    <div key={m.week} className="pregnancy-milestone-row pregnancy-milestone--done">
                      <CheckCircle size={15} weight="fill" style={{ color: tInfo.color, flexShrink: 0, marginTop: 2 }} />
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
                موعد الولادة تقدير استرشادي بناءً على آخر دورة — راجعي طبيبك لتأكيد التاريخ بالسونار.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة الحمل"
                shareText={shareText}
              />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
