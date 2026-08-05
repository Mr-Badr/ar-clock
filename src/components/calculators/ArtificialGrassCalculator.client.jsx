"use client";

import { useMemo, useState } from 'react';
import { Info, Ruler, Warning } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

const ROLL_WIDTHS = [2, 4];

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

export default function ArtificialGrassCalculator() {
  const [inputMode, setInputMode] = useState('dimensions');
  const [length, setLength] = useState('6');
  const [width, setWidth] = useState('4');
  const [directArea, setDirectArea] = useState('24');
  const [rollWidth, setRollWidth] = useState(2);
  const [wastePercent, setWastePercent] = useState('10');
  const [pricePerSqm, setPricePerSqm] = useState('70');

  const area = useMemo(() => {
    if (inputMode === 'area') return Math.max(0, Number(directArea) || 0);
    return Math.max(0, Number(length) || 0) * Math.max(0, Number(width) || 0);
  }, [inputMode, length, width, directArea]);

  const hasInput = area > 0;

  const result = useMemo(() => {
    if (!hasInput) return null;
    const waste = Math.max(0, Number(wastePercent) || 0);
    const effectiveArea = area * (1 + waste / 100);
    const linearMeters = Math.ceil(effectiveArea / rollWidth);
    const actualAreaPurchased = linearMeters * rollWidth;
    const seams = Math.max(0, linearMeters - 1);
    const seamTapeLength = seams * rollWidth;
    const price = Math.max(0, Number(pricePerSqm) || 0);
    const totalCost = actualAreaPurchased * price;
    return { effectiveArea, linearMeters, actualAreaPurchased, seamTapeLength, totalCost };
  }, [area, wastePercent, rollWidth, pricePerSqm, hasInput]);

  return (
    <div aria-label="حاسبة كمية العشب الصناعي">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> بمقاسات لفات السوق الخليجي</span>
      </div>

      <div className="tool-v2-field">
        <label>طريقة إدخال المساحة</label>
        <div className="guide-v2-checker-options" role="group" aria-label="طريقة الإدخال">
          <button type="button" className={`guide-v2-checker-chip${inputMode === 'dimensions' ? ' is-active' : ''}`} aria-pressed={inputMode === 'dimensions'} onClick={() => setInputMode('dimensions')}>طول × عرض</button>
          <button type="button" className={`guide-v2-checker-chip${inputMode === 'area' ? ' is-active' : ''}`} aria-pressed={inputMode === 'area'} onClick={() => setInputMode('area')}>مساحة مباشرة</button>
        </div>
      </div>

      {inputMode === 'dimensions' ? (
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="grass-length">الطول (م)</label>
            <input id="grass-length" type="number" inputMode="decimal" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="grass-width">العرض (م)</label>
            <input id="grass-width" type="number" inputMode="decimal" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
        </div>
      ) : (
        <div className="tool-v2-field">
          <label htmlFor="grass-area">المساحة الإجمالية (م²)</label>
          <input id="grass-area" type="number" inputMode="decimal" min="0" step="1" value={directArea} onChange={(e) => setDirectArea(e.target.value)} />
        </div>
      )}

      <div className="tool-v2-field">
        <label>عرض لفة العشب</label>
        <div className="guide-v2-checker-options" role="group" aria-label="عرض اللفة">
          {ROLL_WIDTHS.map((w) => (
            <button key={w} type="button" className={`guide-v2-checker-chip${rollWidth === w ? ' is-active' : ''}`} aria-pressed={rollWidth === w} onClick={() => setRollWidth(w)}>{w} متر</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="grass-waste">
            نسبة الهدر (%)
            <FieldHint text="ارفعها إلى 15-20% للأشكال كثيرة الزوايا أو غير المستطيلة." />
          </label>
          <input id="grass-waste" type="number" inputMode="decimal" min="0" max="50" step="1" value={wastePercent} onChange={(e) => setWastePercent(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="grass-price">سعر المتر المربع (تقريبي، قابل للتعديل)</label>
          <input id="grass-price" type="number" inputMode="decimal" min="0" step="1" value={pricePerSqm} onChange={(e) => setPricePerSqm(e.target.value)} />
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">الأمتار الطولية المطلوب شراؤها</span>
            <div className="tool-v2-result-stat-row">
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{result.linearMeters}</span>
                <span className="tool-v2-result-stat-label">متر طولي</span>
              </span>
              <span className="tool-v2-result-stat-sep" aria-hidden="true">×</span>
              <span className="tool-v2-result-stat">
                <span className="tool-v2-result-stat-value">{rollWidth}</span>
                <span className="tool-v2-result-stat-label">متر عرض اللفة</span>
              </span>
            </div>
            <div className="tool-v2-result-meta">المساحة الفعلية المشتراة ≈ {fmt(result.actualAreaPurchased, 1)} م²</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">طول شريط اللحام التقديري</span>
              <span className="tool-v2-breakdown-value">{fmt(result.seamTapeLength, 1)} متر</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">التكلفة الإجمالية التقديرية</span>
              <span className="tool-v2-breakdown-value">{fmt(result.totalCost)}</span>
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Ruler size={15} weight="fill" />
            <span>احرص على تركيب كل اللفات بنفس اتجاه ألياف العشب لتفادي فروق لون واضحة عند خطوط اللحام.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاداً أو مساحة صحيحة أكبر من صفر.</p>
        </div>
      )}
    </div>
  );
}
