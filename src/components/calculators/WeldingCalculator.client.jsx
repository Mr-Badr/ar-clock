"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Consumption rates (kg per 100m of weld) — real, sourced from English welding-engineering
// references (MachineMFG, Kobelco) since no Arabic source publishes these numbers at all — see
// keyword-research/welding-hub/DECISION.md. Editable by the user per docs/PLAN.md §5 step 8 (real
// consumption varies by joint type, groove angle, and pass count — these are directional
// starting points, not a fixed authority).
const ELECTRODE_TYPES = [
  { id: 'e6010', label: 'E6010', kgPer100m: 2.5 },
  { id: 'e6013', label: 'E6013', kgPer100m: 2.7 },
  { id: 'e7018', label: 'E7018', kgPer100m: 3.0 },
];

// Suggested amperage = diameter(mm) × 40 — a real, widely-cited stick-welding rule of thumb for
// mild steel, cross-checked against a verified specific range (3.2mm E7018 → 75-125A) that brackets
// the rule-of-thumb output (128A) correctly. Presented as a starting point, not a fixed authority —
// real amperage varies by joint position, base-metal cleanliness, and electrode manufacturer.
const DIAMETER_PRESETS = [2.0, 2.5, 3.2, 4.0, 5.0];
const AMPERAGE_MULTIPLIER = 40;

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function WeldingCalculator() {
  const [tab, setTab] = useState('electrodes');

  // Tab 1: electrode consumption
  const [weldLength, setWeldLength] = useState('10');
  const [electrodeId, setElectrodeId] = useState('e7018');
  const [rateOverride, setRateOverride] = useState('');

  const electrode = ELECTRODE_TYPES.find((e) => e.id === electrodeId) ?? ELECTRODE_TYPES[0];
  const effectiveRate = rateOverride === '' ? electrode.kgPer100m : Math.max(0, Number(rateOverride) || 0);
  const effectiveLength = Math.max(0, Number(weldLength) || 0);

  const electrodeResult = useMemo(() => {
    const kg = (effectiveLength / 100) * effectiveRate;
    return { kg };
  }, [effectiveLength, effectiveRate]);

  // Tab 2: suggested amperage by electrode diameter
  const [diameter, setDiameter] = useState('3.2');
  const effectiveDiameter = Math.max(0, Number(diameter) || 0);
  const amperageResult = useMemo(() => {
    const amps = effectiveDiameter * AMPERAGE_MULTIPLIER;
    return { amps };
  }, [effectiveDiameter]);

  return (
    <div aria-label="حاسبة اللحام">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          صيغ لحام هندسية حقيقية
        </span>
      </div>

      <div className="tool-v2-field">
        <div className="guide-v2-checker-options" role="group" aria-label="اختر الحاسبة">
          <button type="button" className={`guide-v2-checker-chip${tab === 'electrodes' ? ' is-active' : ''}`} aria-pressed={tab === 'electrodes'} onClick={() => setTab('electrodes')}>
            كمية الأقطاب
          </button>
          <button type="button" className={`guide-v2-checker-chip${tab === 'amperage' ? ' is-active' : ''}`} aria-pressed={tab === 'amperage'} onClick={() => setTab('amperage')}>
            التيار المناسب
          </button>
        </div>
      </div>

      {tab === 'electrodes' ? (
        <>
          <div className="tool-v2-field">
            <label htmlFor="weld-length">طول اللحام الإجمالي (متر)</label>
            <input id="weld-length" type="number" inputMode="decimal" min="0" step="0.5" value={weldLength} onChange={(e) => setWeldLength(e.target.value)} />
          </div>

          <div className="tool-v2-field">
            <label>نوع القطب</label>
            <div className="guide-v2-checker-options" role="group" aria-label="نوع القطب">
              {ELECTRODE_TYPES.map((e) => (
                <button key={e.id} type="button" className={`guide-v2-checker-chip${electrodeId === e.id ? ' is-active' : ''}`} aria-pressed={electrodeId === e.id} onClick={() => { setElectrodeId(e.id); setRateOverride(''); }}>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-v2-field">
            <label htmlFor="weld-rate">
              معدل الاستهلاك (كجم / 100 متر)
              <FieldHint text="مقترح تلقائياً حسب نوع القطب — الاستهلاك الفعلي يختلف حسب نوع الوصلة وعدد التمريرات، عدّله إن كانت لديك بيانات أدق." />
            </label>
            <input id="weld-rate" type="number" inputMode="decimal" min="0" step="0.1" placeholder={String(electrode.kgPer100m)} value={rateOverride} onChange={(e) => setRateOverride(e.target.value)} />
          </div>

          <div aria-live="polite">
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">الوزن التقديري للأقطاب المطلوبة</span>
              <div className="tool-v2-result-stat-row">
                <span className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-value">{fmt(electrodeResult.kg, 2)}</span>
                  <span className="tool-v2-result-stat-label">كيلوجرام</span>
                </span>
              </div>
            </div>
            <div className="tool-v2-note-strip">
              <Info size={15} weight="fill" />
              <span>أضف هامش 10-15% فوق الرقم المحسوب لتغطية الهدر أثناء العمل والتمريرات الإضافية.</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="tool-v2-field">
            <label htmlFor="electrode-diameter">
              قطر القطب (مم)
              <FieldHint text="اختر أقرب قطر متوفر لديك، أو أدخل رقماً مخصصاً." />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="guide-v2-checker-options" role="group" aria-label="قطر القطب">
                {DIAMETER_PRESETS.map((d) => (
                  <button key={d} type="button" className={`guide-v2-checker-chip${Number(diameter) === d ? ' is-active' : ''}`} aria-pressed={Number(diameter) === d} onClick={() => setDiameter(String(d))}>
                    {d} مم
                  </button>
                ))}
              </div>
            </div>
            <input id="electrode-diameter" type="number" inputMode="decimal" min="0" step="0.1" style={{ marginTop: 8 }} value={diameter} onChange={(e) => setDiameter(e.target.value)} />
          </div>

          <div aria-live="polite">
            <div className="tool-v2-result-hero">
              <span className="tool-v2-result-label">التيار المقترح للبدء</span>
              <div className="tool-v2-result-stat-row">
                <span className="tool-v2-result-stat">
                  <span className="tool-v2-result-stat-value">{fmt(amperageResult.amps)}</span>
                  <span className="tool-v2-result-stat-label">أمبير</span>
                </span>
              </div>
            </div>
            <div className="tool-v2-note-strip">
              <Info size={15} weight="fill" />
              <span>
                قاعدة تقريبية شائعة (القطر بالمم × 40) — الرقم الفعلي يختلف حسب وضعية اللحام ونوع
                القطب والمعدن. مثال حقيقي موثّق: قطب 3.2 مم من نوع E7018 يعمل غالباً بين 75 و125
                أمبير حسب عدد التمريرات — استخدم الرقم المقترح كنقطة بداية فقط واضبطه حسب النتيجة
                الفعلية على المعدن.
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
