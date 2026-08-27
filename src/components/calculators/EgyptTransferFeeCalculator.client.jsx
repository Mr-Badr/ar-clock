"use client";

import { useMemo, useState } from 'react';
import { Info } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Real, tiered flat registration fee at the Egyptian Real Estate Registry (الشهر العقاري) —
// verified via direct scrape of a mainstream news source (Shorouk News), 2026-08-25. Flat fee
// tiers by property area, not a percentage.
const REGISTRATION_TIERS = [
  { maxArea: 100, fee: 500 },
  { maxArea: 200, fee: 1000 },
  { maxArea: 300, fee: 1500 },
  { maxArea: Infinity, fee: 2000 },
];
const DISPOSITION_TAX_RATE = 2.5; // % of contract value — legally the seller's obligation

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

export default function EgyptTransferFeeCalculator() {
  const [area, setArea] = useState('120');
  const [contractValue, setContractValue] = useState('2000000');

  const effectiveArea = Math.max(0, Number(area) || 0);
  const effectiveValue = Math.max(0, Number(contractValue) || 0);

  const result = useMemo(() => {
    const tier = REGISTRATION_TIERS.find((t) => effectiveArea <= t.maxArea) ?? REGISTRATION_TIERS[REGISTRATION_TIERS.length - 1];
    const registrationFee = tier.fee;
    const dispositionTax = effectiveValue * (DISPOSITION_TAX_RATE / 100);
    const total = registrationFee + dispositionTax;
    return { registrationFee, dispositionTax, total };
  }, [effectiveArea, effectiveValue]);

  return (
    <div aria-label="حاسبة رسوم الشهر العقاري في مصر">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge">
          <span className="tool-v2-live-dot" aria-hidden="true" />
          مصر
        </span>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label htmlFor="eg-area">
            مساحة العقار (م²)
            <FieldHint text="رسوم التسجيل رسم ثابت حسب فئة المساحة، وليست نسبة من قيمة العقار." />
          </label>
          <input id="eg-area" type="number" inputMode="decimal" min="0" step="10" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="tool-v2-field">
          <label htmlFor="eg-value">قيمة العقد (جنيه)</label>
          <input id="eg-value" type="number" inputMode="decimal" min="0" step="10000" value={contractValue} onChange={(e) => setContractValue(e.target.value)} />
        </div>
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">إجمالي رسوم التسجيل والضريبة</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.total)}</span>
              <span className="tool-v2-result-stat-label">جنيه</span>
            </span>
          </div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">رسم التسجيل الثابت (حسب المساحة)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.registrationFee)} جنيه</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">ضريبة التصرفات العقارية ({DISPOSITION_TAX_RATE}%)</span>
            <span className="tool-v2-breakdown-value">{fmt(result.dispositionTax)} جنيه</span>
          </div>
        </div>

        <div className="tool-v2-note-strip">
          <Info size={15} weight="fill" />
          <span>ضريبة التصرفات العقارية مستحقة قانوناً على البائع، لكن يتحملها المشتري عملياً في كثير من الحالات لإتمام نقل الملكية والتعامل مع المرافق. راجع عقدك لمعرفة من يتحملها فعلياً في حالتك.</span>
        </div>
      </div>
    </div>
  );
}
