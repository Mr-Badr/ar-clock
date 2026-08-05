"use client";

import { useMemo, useState } from 'react';
import { Drop, Info, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Directional Gulf-climate emitter flow-rate defaults (editable) — sourced from irrigation-design
// guidance cited in keyword-research/landscaping-hub/DECISION.md §3: large trees 4-8 L/hr,
// shrubs/small plants 2-4 L/hr, commercial emitters generally 2-10 L/hr.
const PLANT_TYPES = [
  { id: 'tree', label: 'شجرة كبيرة', flowRate: 6, spacing: 60, emittersPerPlant: 2 },
  { id: 'shrub', label: 'شجيرة متوسطة', flowRate: 4, spacing: 40, emittersPerPlant: 1 },
  { id: 'small', label: 'نبتة صغيرة', flowRate: 2, spacing: 30, emittersPerPlant: 1 },
];

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

export default function DripIrrigationCalculator() {
  const [mode, setMode] = useState('plants');
  const [plantTypeId, setPlantTypeId] = useState('shrub');
  const [plantCount, setPlantCount] = useState('20');
  const [lineLength, setLineLength] = useState('15');
  const [spacing, setSpacing] = useState('40');
  const [flowRate, setFlowRate] = useState('4');
  const [dailyWaterNeed, setDailyWaterNeed] = useState('');

  const plantType = PLANT_TYPES.find((p) => p.id === plantTypeId);

  function selectPlantType(id) {
    setPlantTypeId(id);
    const pt = PLANT_TYPES.find((p) => p.id === id);
    setSpacing(String(pt.spacing));
    setFlowRate(String(pt.flowRate));
  }

  const totalEmitters = useMemo(() => {
    if (mode === 'plants') {
      const count = Math.max(0, Number(plantCount) || 0);
      return count * (plantType.emittersPerPlant || 1);
    }
    const len = Math.max(0, Number(lineLength) || 0) * 100; // to cm
    const sp = Math.max(1, Number(spacing) || 1);
    return Math.floor(len / sp);
  }, [mode, plantCount, plantType, lineLength, spacing]);

  const hasInput = totalEmitters > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const rate = Math.max(0, Number(flowRate) || 0);
    const totalGPH = totalEmitters * rate;
    const dailyNeed = Math.max(0, Number(dailyWaterNeed) || 0);
    const runtimeMinutes = totalGPH > 0 && dailyNeed > 0 ? (dailyNeed / totalGPH) * 60 : null;
    return { totalGPH, runtimeMinutes };
  }, [totalEmitters, flowRate, dailyWaterNeed, hasInput]);

  return (
    <div aria-label="حاسبة الري بالتنقيط">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> بالمتر واللتر مباشرة</span>
      </div>

      <div className="tool-v2-field">
        <label>طريقة الإدخال</label>
        <div className="guide-v2-checker-options" role="group" aria-label="طريقة الإدخال">
          <button type="button" className={`guide-v2-checker-chip${mode === 'plants' ? ' is-active' : ''}`} aria-pressed={mode === 'plants'} onClick={() => setMode('plants')}>عدد النباتات</button>
          <button type="button" className={`guide-v2-checker-chip${mode === 'line' ? ' is-active' : ''}`} aria-pressed={mode === 'line'} onClick={() => setMode('line')}>طول خط الزراعة</button>
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نوع النبات (يضبط معدل التصرف والمسافة تلقائياً)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع النبات">
          {PLANT_TYPES.map((p) => (
            <button key={p.id} type="button" className={`guide-v2-checker-chip${plantTypeId === p.id ? ' is-active' : ''}`} aria-pressed={plantTypeId === p.id} onClick={() => selectPlantType(p.id)}>{p.label}</button>
          ))}
        </div>
      </div>

      {mode === 'plants' ? (
        <div className="tool-v2-field">
          <label htmlFor="plant-count">عدد النباتات</label>
          <input id="plant-count" type="number" inputMode="numeric" min="0" step="1" value={plantCount} onChange={(e) => setPlantCount(e.target.value)} />
        </div>
      ) : (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="line-length">طول خط الزراعة (م)</label>
            <input id="line-length" type="number" inputMode="decimal" min="0" step="1" value={lineLength} onChange={(e) => setLineLength(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="drip-spacing">المسافة بين النقّاطات (سم)</label>
            <input id="drip-spacing" type="number" inputMode="decimal" min="1" step="5" value={spacing} onChange={(e) => setSpacing(e.target.value)} />
          </div>
        </div>
      )}

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="flow-rate">
            معدل تصرف النقّاطة (لتر/ساعة)
            <FieldHint text="قيمة افتراضية حسب نوع النبات — عدّلها حسب النقّاطات الفعلية التي تستخدمها." />
          </label>
          <input id="flow-rate" type="number" inputMode="decimal" min="0" step="0.5" value={flowRate} onChange={(e) => setFlowRate(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="daily-need">الاحتياج المائي اليومي (لتر — اختياري)</label>
          <input id="daily-need" type="number" inputMode="decimal" min="0" step="1" value={dailyWaterNeed} onChange={(e) => setDailyWaterNeed(e.target.value)} />
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">إجمالي النقّاطات المطلوبة</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{totalEmitters}</span>
                <span className="tool-v2-result-stat-label">نقّاطة</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">×</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{fmt(result.totalGPH, 1)}</span>
                <span className="tool-v2-result-stat-label">لتر/ساعة إجمالاً</span>
              </span>
            </div>
            {result.runtimeMinutes !== null ? (
              <div className="tool-v2-result-meta">مدة التشغيل اليومية الموصى بها ≈ {fmt(result.runtimeMinutes, 0)} دقيقة</div>
            ) : null}
          </div>

          <div className="tool-v2-note-strip">
            <Drop size={15} weight="fill" />
            <span>وزّع النقّاطات بالتساوي على طول الخط، واختبر ضغط المياه فعلياً بعد التركيب — ضغط منخفض جداً يقلل التصرف الحقيقي عن الرقم النظري.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل عدد النباتات أو طول خط الزراعة.</p>
        </div>
      )}
    </div>
  );
}
