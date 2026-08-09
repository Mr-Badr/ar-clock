"use client";

import { useEffect, useMemo, useState } from 'react';
import { Baby, CalendarBlank, CheckCircle, ShareNetwork, Timer } from '@phosphor-icons/react';
import { toast } from 'sonner';

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

async function shareResult(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch { /* cancelled */ }
  }
  try { await navigator.clipboard.writeText(text); toast.success('تم نسخ النتيجة إلى الحافظة'); }
  catch { toast.error('تعذر نسخ النتيجة'); }
}

export default function OvulationCalculator() {
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  // Date bounds and "today" are only computed client-side, post-mount — a bare
  // new Date() call during render breaks Next.js static prerendering without a
  // Suspense boundary (empty strings are a safe no-constraint default for the
  // date input's min/max before the effect runs).
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDateBounds({
      max: today.toISOString().split('T')[0],
      min: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  }, []);

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
    <div aria-label="حاسبة التبويض">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><Baby size={14} weight="bold" /> حاسبة التبويض <span className="tool-v2-live-dot" aria-hidden="true" /></span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="ovulation-lmp">أول يوم في آخر دورة شهرية</label>
        <input id="ovulation-lmp" type="date" value={lmpDate} max={dateBounds.max} min={dateBounds.min} onChange={(e) => setLmpDate(e.target.value)} dir="ltr" />
        <span className="tool-v2-option-hint">أدخل أول يوم في آخر دورة شهرية لحساب يوم التبويض والفترة الخصبة.</span>
      </div>

      <div className="tool-v2-field">
        <label>طول الدورة الشهرية</label>
        <div className="tool-v2-option-list tool-v2-option-list--grid" role="group" aria-label="طول الدورة الشهرية">
          {CYCLE_PRESETS.map((preset) => (
            <button key={preset.value} type="button" className={`tool-v2-chip${cycleLength === preset.value ? ' is-active' : ''}`} onClick={() => setCycleLength(preset.value)}>{preset.label}</button>
          ))}
        </div>
        <span className="tool-v2-option-hint">التبويض يحدث عادةً قبل 14 يوماً من الدورة التالية — طول الدورة يحدد الموعد الدقيق.</span>
      </div>

      {lmpDate && result?.isValid ? (
        <div aria-live="polite">
          {result.isInFertileWindow && (
            <div className="tool-v2-note-strip">
              <CheckCircle size={15} weight="fill" />
              <span>أنتِ الآن في الفترة الخصبة</span>
            </div>
          )}

          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">يوم التبويض المتوقع</span>
            <div className="tool-v2-result-value">{formatDateAr(result.ovulationDate)}</div>
            {ovHijri ? <div className="tool-v2-result-meta">{formatHijriDate(ovHijri)}</div> : null}
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><CalendarBlank size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> الفترة الخصبة</span>
              <span className="tool-v2-breakdown-value">{formatDateAr(result.fertileStart)} — {formatDateAr(result.fertileEnd)}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label"><Timer size={14} weight="bold" style={{ verticalAlign: '-2px' }} /> {result.daysToOvulation >= 0 ? 'باقي على التبويض' : 'مضى على التبويض'}</span>
              <span className="tool-v2-breakdown-value">{Math.abs(result.daysToOvulation)} يوم</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الدورة التالية المتوقعة</span>
              <span className="tool-v2-breakdown-value">{formatDateAr(result.nextPeriod)}{nextPeriodHijri ? ` — ${formatHijriDate(nextPeriodHijri)}` : ''}</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">باقي على الدورة</span>
              <span className="tool-v2-breakdown-value">{Math.max(0, result.daysToNextPeriod)} يوم</span>
            </div>
          </div>

          {result.nextCycles?.length > 0 && (
            <>
              <div className="tool-v2-mini-block-head"><span>الدورات القادمة</span></div>
              <div className="tool-v2-breakdown-list">
                {result.nextCycles.map((cycle, i) => (
                  <div key={i} className="tool-v2-breakdown-row">
                    <span className="tool-v2-breakdown-label">دورة {i + 2}</span>
                    <span className="tool-v2-breakdown-value">{formatDateAr(cycle.ovulationDate)} (تبويض) — {formatDateAr(cycle.fertileStart)}←{formatDateAr(cycle.fertileEnd)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="tool-v2-note-strip">
            <span>النتيجة تقدير استرشادي بناءً على نمط الدورة — يختلف التبويض الفعلي ويتأثر بعوامل صحية متعددة. راجعي طبيبك لأي قرار طبي.</span>
          </div>

          <div className="tool-v2-action-row">
            <button type="button" className="tool-v2-action-btn is-primary" onClick={() => shareResult('حاسبة التبويض', shareText)}>
              <ShareNetwork size={18} weight="bold" /> مشاركة
            </button>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Baby size={28} weight="duotone" />
          <p>أدخلي تاريخ آخر دورة لمعرفة يوم التبويض والفترة الخصبة.</p>
        </div>
      )}
    </div>
  );
}
