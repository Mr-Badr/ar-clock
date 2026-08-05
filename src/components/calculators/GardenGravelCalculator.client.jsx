"use client";

import { useMemo, useState } from 'react';
import { Info, Package, Path, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

const AREA_TYPES = [
  { id: 'path', label: 'ممر', defaultDepth: 5, icon: Path },
  { id: 'bed', label: 'حوض زينة', defaultDepth: 8, icon: Package },
  { id: 'full', label: 'تغطية كاملة للحديقة', defaultDepth: 5, icon: Path },
];
const GRAVEL_TYPES = [
  { id: 'white', label: 'حصى أبيض', density: 1500 },
  { id: 'colored', label: 'حصى ملوّن', density: 1550 },
  { id: 'pea', label: 'زلط (حصى ناعم)', density: 1650 },
  { id: 'basalt', label: 'حجر بازلت', density: 1750 },
];
const BAG_SIZE_KG = 25;

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

export default function GardenGravelCalculator() {
  const [areaTypeId, setAreaTypeId] = useState('path');
  const [length, setLength] = useState('8');
  const [width, setWidth] = useState('1');
  const [depth, setDepth] = useState('5');
  const [gravelId, setGravelId] = useState('white');

  const areaType = AREA_TYPES.find((a) => a.id === areaTypeId);
  const gravel = GRAVEL_TYPES.find((g) => g.id === gravelId);

  function selectAreaType(id) {
    setAreaTypeId(id);
    const at = AREA_TYPES.find((a) => a.id === id);
    setDepth(String(at.defaultDepth));
  }

  const l = Math.max(0, Number(length) || 0);
  const w = Math.max(0, Number(width) || 0);
  const d = Math.max(0, Number(depth) || 0);
  const hasInput = l > 0 && w > 0 && d > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const volumeM3 = l * w * (d / 100);
    const weightKg = volumeM3 * gravel.density;
    const bags = Math.ceil(weightKg / BAG_SIZE_KG);
    return { volumeM3, weightKg, bags };
  }, [l, w, d, gravel, hasInput]);

  return (
    <div aria-label="حاسبة كمية الحصى للحديقة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> بالمتر والسنتيمتر</span>
      </div>

      <div className="tool-v2-field">
        <label>نوع المساحة</label>
        <div className="tool-v2-choice-list">
          {AREA_TYPES.map((a) => {
            const Icon = a.icon;
            const active = areaTypeId === a.id;
            return (
              <label key={a.id} className={`tool-v2-choice-card${active ? ' is-active' : ''}`} htmlFor={`area-${a.id}`}>
                <input type="radio" id={`area-${a.id}`} name="area-type" checked={active} onChange={() => selectAreaType(a.id)} />
                <span className="tool-v2-choice-icon tool-v2-choice-icon--amber" aria-hidden="true"><Icon size={18} weight="bold" /></span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">{a.label}</span>
                  <span className="tool-v2-choice-desc">عمق مقترح {a.defaultDepth} سم — قابل للتعديل</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="gravel-length">الطول (م)</label>
          <input id="gravel-length" type="number" inputMode="decimal" min="0" step="0.5" value={length} onChange={(e) => setLength(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="gravel-width">العرض (م)</label>
          <input id="gravel-width" type="number" inputMode="decimal" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="gravel-depth">
          العمق (سم)
          <FieldHint text="القيمة المقترحة تتغير تلقائياً حسب نوع المساحة، ويمكنك تعديلها يدوياً دائماً." />
        </label>
        <input id="gravel-depth" type="number" inputMode="decimal" min="0" step="1" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </div>

      <div className="tool-v2-field">
        <label>نوع الحصى</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نوع الحصى">
          {GRAVEL_TYPES.map((g) => (
            <button key={g.id} type="button" className={`guide-v2-checker-chip${gravelId === g.id ? ' is-active' : ''}`} aria-pressed={gravelId === g.id} onClick={() => setGravelId(g.id)}>{g.label}</button>
          ))}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">عدد الأكياس المطلوبة (25 كجم/كيس)</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{result.bags}</span>
                <span className="tool-v2-result-stat-label">كيس</span>
              </span>
            </div>
            <div className="tool-v2-result-meta">الوزن الإجمالي ≈ {fmt(result.weightKg)} كجم</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">الحجم الإجمالي</span>
              <span className="tool-v2-breakdown-value">{fmt(result.volumeM3, 2)} م³</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاداً وعمقاً أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
