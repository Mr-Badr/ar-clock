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
          <div className="calc-surface-card calc-esb-form-card">
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
                <div className="calc-kbd-row">
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
              <Baby size={32} weight="duotone" className="ovulation-empty-icon" />
              <p>أدخلي تاريخ آخر دورة لمعرفة يوم التبويض والفترة الخصبة.</p>
            </div>
          )}

          {lmpDate && result?.isValid && (
            <div className="calc-esb-result-panel ovulation-result" aria-live="polite">
              <div className="calc-esb-result-header">
                <span className="calc-esb-country-badge calc-esb-country-badge--bh">❤️ حاسبة التبويض</span>
                <span className="calc-esb-live-dot ovulation-live-dot" aria-hidden="true" />
              </div>

              {/* Fertile window status */}
              {result.isInFertileWindow && (
                <div className="ovulation-banner--active">
                  <CheckCircle size={16} weight="fill" />
                  أنتِ الآن في الفترة الخصبة
                </div>
              )}

              {/* Ovulation date */}
              <div className="ovulation-date-hero">
                <span className="calc-esb-amount-label">يوم التبويض المتوقع</span>
                <div className="ovulation-date-value">
                  {formatDateAr(result.ovulationDate)}
                </div>
                {ovHijri && (
                  <div className="ovulation-hijri-date">
                    {formatHijriDate(ovHijri)}
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="calc-esb-breakdown">
                <div className="calc-esb-brow calc-esb-brow--total">
                  <span className="calc-icon-label">
                    <CalendarBlank size={14} weight="bold" />
                    الفترة الخصبة
                  </span>
                  <strong>
                    {formatDateAr(result.fertileStart)} — {formatDateAr(result.fertileEnd)}
                  </strong>
                </div>
                <div className="calc-esb-brow">
                  <span className="calc-icon-label">
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
                      <span className="ovulation-hijri-date" style={{ display: 'block' }}>
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
                <div>
                  <p className="ovulation-cycles-heading">الدورات القادمة</p>
                  {result.nextCycles.map((cycle, i) => (
                    <div key={i} className="calc-esb-brow ovulation-cycle-row">
                      <span className="ovulation-cycle-num">دورة {i + 2}</span>
                      <div className="ovulation-cycle-dates">
                        <div><strong>{formatDateAr(cycle.ovulationDate)}</strong> — التبويض</div>
                        <div className="ovulation-cycle-fertile">{formatDateAr(cycle.fertileStart)} ← {formatDateAr(cycle.fertileEnd)} (خصبة)</div>
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
