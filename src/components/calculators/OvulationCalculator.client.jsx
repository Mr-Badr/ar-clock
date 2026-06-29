"use client";

import { useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, Timer } from '@phosphor-icons/react';

import ResultActions from '@/components/calculators/ResultActions.client';
import { Label } from '@/components/ui/label';
import { getHijriParts } from '@/lib/hijri-utils';
import { calculateOvulation } from '@/lib/calculators/pregnancy';

const CYCLE_PRESETS = [
  { label: '21 يوم', value: 21 },
  { label: '25 يوم', value: 25 },
  { label: '28 يوم (معيار)', value: 28 },
  { label: '30 يوم', value: 30 },
  { label: '35 يوم', value: 35 },
];

function formatDateAr(date) {
  if (!date) return '';
  return date.toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatHijriDate(parts) {
  if (!parts || !parts.hijriDay) return '';
  return `${parts.hijriDay} ${parts.hijriMonthName} ${parts.hijriYear} هـ`;
}

export default function OvulationCalculator() {
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = today.toISOString().split('T')[0];
  const minDate = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const result = useMemo(() => {
    if (!lmpDate) return null;
    return calculateOvulation({ lmpDate, cycleLength, today: new Date() });
  }, [lmpDate, cycleLength]);

  const ovHijri = result?.ovulationDate ? getHijriParts(result.ovulationDate) : null;
  const nextPeriodHijri = result?.nextPeriod ? getHijriParts(result.nextPeriod) : null;

  const shareText = result?.isValid
    ? [
        `موعد التبويض المتوقع: ${formatDateAr(result.ovulationDate)}`,
        `الفترة الخصبة: ${formatDateAr(result.fertileStart)} — ${formatDateAr(result.fertileEnd)}`,
        `الدورة التالية: ${formatDateAr(result.nextPeriod)}`,
      ].join('\n')
    : '';

  return (
    <div className="calc-app ovulation-tool" aria-label="حاسبة التبويض">
      <div className="calc-esb-layout">

        {/* ── FORM ──────────────────────────────── */}
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

              <div className="calc-esb-field">
                <div className="calc-esb-field-label">
                  <span className="calc-esb-step">1</span>
                  <Label htmlFor="ovulation-lmp">أول يوم في آخر دورة شهرية</Label>
                </div>
                <input
                  id="ovulation-lmp"
                  type="date"
                  className="pregnancy-date-input"
                  value={lmpDate}
                  max={maxDate}
                  min={minDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  dir="ltr"
                />
                <p className="calc-hint">أدخل أول يوم في آخر دورة شهرية لحساب يوم التبويض والفترة الخصبة.</p>
              </div>

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
                <p className="calc-hint">التبويض يحدث عادةً قبل 14 يوماً من الدورة التالية — طول الدورة يحدد الموعد الدقيق.</p>
              </div>

            </div>
          </div>
        </div>

        {/* ── RESULT ────────────────────────────── */}
        <div className="calc-esb-result-col">
          {!lmpDate && (
            <div className="calc-esb-empty-state">
              <Baby size={32} weight="duotone" style={{ color: '#2563eb' }} />
              <p>أدخلي تاريخ آخر دورة لمعرفة يوم التبويض والفترة الخصبة.</p>
            </div>
          )}

          {lmpDate && result?.isValid && (
            <div className="calc-result-hero-panel --blue ovulation-result" aria-live="polite">

              {/* Fertile window status */}
              {result.isInFertileWindow && (
                <div
                  className="ovulation-banner ovulation-banner--active"
                  style={{ background: '#16a34a20', border: '1px solid #16a34a40', borderRadius: 'var(--radius)', padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 700, color: '#16a34a' }}
                >
                  <CheckCircle size={16} weight="fill" />
                  أنتِ الآن في الفترة الخصبة
                </div>
              )}

              {/* Ovulation date */}
              <div style={{ textAlign: 'center' }}>
                <span className="calc-result-hero-label">يوم التبويض المتوقع</span>
                <div className="calc-result-hero-value" style={{ color: '#2563eb', fontSize: '1.5rem', lineHeight: 1.2 }}>
                  {formatDateAr(result.ovulationDate)}
                </div>
                {ovHijri && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--fg-subtle)', marginTop: '0.3rem' }}>
                    {formatHijriDate(ovHijri)}
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarBlank size={14} weight="bold" />
                    الفترة الخصبة
                  </span>
                  <strong>
                    {formatDateAr(result.fertileStart)} — {formatDateAr(result.fertileEnd)}
                  </strong>
                </div>
                <div className="calc-esb-brow">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Timer size={14} weight="bold" />
                    {result.daysToOvulation >= 0 ? 'باقي على التبويض' : 'مضى على التبويض'}
                  </span>
                  <strong>{Math.abs(result.daysToOvulation)} يوم</strong>
                </div>
                <div className="calc-esb-brow">
                  <span>الدورة التالية المتوقعة</span>
                  <strong>
                    {formatDateAr(result.nextPeriod)}
                    {nextPeriodHijri && (
                      <span style={{ fontWeight: 400, color: 'var(--fg-subtle)', fontSize: '0.82rem', display: 'block' }}>
                        {formatHijriDate(nextPeriodHijri)}
                      </span>
                    )}
                  </strong>
                </div>
                <div className="calc-esb-brow">
                  <span>باقي على الدورة</span>
                  <strong>{Math.max(0, result.daysToNextPeriod)} يوم</strong>
                </div>
              </div>

              {/* Next 3 cycles */}
              {result.nextCycles?.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    الدورات القادمة
                  </p>
                  {result.nextCycles.map((cycle, i) => (
                    <div key={i} className="calc-esb-brow" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem', alignItems: 'start' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', minWidth: '5rem' }}>
                        دورة {i + 2}
                      </span>
                      <div style={{ fontSize: '0.82rem' }}>
                        <div><strong style={{ color: '#2563eb' }}>{formatDateAr(cycle.ovulationDate)}</strong> — التبويض</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{formatDateAr(cycle.fertileStart)} ← {formatDateAr(cycle.fertileEnd)} (خصبة)</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="bmi-disclaimer">
                النتيجة تقدير استرشادي بناءً على نمط الدورة — يختلف التبويض الفعلي ويتأثر بعوامل صحية متعددة. راجعي طبيبك لأي قرار طبي.
              </p>

              <ResultActions
                copyText={shareText}
                shareTitle="حاسبة التبويض"
                shareText={shareText}
              />

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
