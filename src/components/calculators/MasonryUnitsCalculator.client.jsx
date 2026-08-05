"use client";

import { useState } from 'react';
import { Buildings, Info, Share as ShareIcon, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MASONRY_UNITS_PER_M2, calcMasonryUnits, fmt } from '@/lib/calculators/building/constants';

// Human-language description per unit type — real Arabic-market naming (بلك مجوف vs طوب أحمر),
// matches the phrasing used by every competitor found in research (toolsri.com, webcety.com,
// brickcal.com).
const UNIT_META = {
  red_brick: { badge: 'تقليدي', desc: 'الأكثر شيوعاً في الجدران الداخلية والواجهات المعمارية — عدد أكبر لكل م² لكن كل قطعة أصغر.' },
  block_20: { badge: 'الأكثر شيوعاً', desc: 'الأشيع في الجدران الخارجية الحاملة — سماكة 20 سم توفر عزلاً حرارياً وصوتياً أفضل.' },
  block_15: { desc: 'خيار متوسط السماكة — يُستخدم غالباً في الجدران الداخلية غير الحاملة.' },
  block_10: { desc: 'الأقل سماكة — يُستخدم للجدران الفاصلة الخفيفة وغير الحاملة فقط.' },
};

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

async function shareResult(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ النتيجة إلى الحافظة');
  } catch {
    toast.error('تعذر نسخ النتيجة');
  }
}

export default function MasonryUnitsCalculator() {
  const [wallArea, setWallArea] = useState('60');
  const [openingsArea, setOpeningsArea] = useState('6');
  const [unitKey, setUnitKey] = useState('block_20');

  const wallAreaNum = Math.max(0, Number(wallArea) || 0);
  const openingsAreaNum = Math.max(0, Number(openingsArea) || 0);
  const hasInput = wallAreaNum > 0;
  const result = hasInput ? calcMasonryUnits(wallAreaNum, openingsAreaNum, unitKey) : null;

  const shareText = result
    ? `حاسبة كمية الطوب والبلوك: ${fmt(result.unitsWithWaste)} قطعة (${result.unit.label}) لمساحة صافية ${fmt(result.netAreaM2, 1)} م² + ${fmt(result.mortarBags)} كيس مونة`
    : '';

  return (
    <div aria-label="حاسبة كمية الطوب والبلوك">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> شامل نسبة الهدر</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="masonry-wall-area">
          مساحة الجدار الإجمالية (م²)
          <FieldHint text="الطول × الارتفاع لكل جدار، مجموعة معاً — قبل خصم الأبواب والنوافذ." />
        </label>
        <input
          id="masonry-wall-area"
          type="number"
          inputMode="decimal"
          min="0"
          value={wallArea}
          onChange={(e) => setWallArea(e.target.value)}
          placeholder="60"
        />
      </div>

      <div className="tool-v2-field">
        <label htmlFor="masonry-openings-area">
          مساحة الأبواب والنوافذ (م²)
          <FieldHint text="مجموع مساحات كل الفتحات — تُخصم من مساحة الجدار قبل حساب عدد القطع." />
        </label>
        <input
          id="masonry-openings-area"
          type="number"
          inputMode="decimal"
          min="0"
          value={openingsArea}
          onChange={(e) => setOpeningsArea(e.target.value)}
          placeholder="6"
        />
      </div>

      <div className="tool-v2-field">
        <label>نوع الوحدة</label>
        <div className="tool-v2-choice-list">
          {Object.entries(MASONRY_UNITS_PER_M2).map(([key, unit]) => {
            const meta = UNIT_META[key] || {};
            const active = unitKey === key;
            return (
              <label
                key={key}
                className={`tool-v2-choice-card${active ? ' is-active' : ''}`}
                htmlFor={`masonry-unit-${key}`}
              >
                <input
                  type="radio"
                  id={`masonry-unit-${key}`}
                  name="masonry-unit"
                  checked={active}
                  onChange={() => setUnitKey(key)}
                />
                <span className="tool-v2-choice-icon tool-v2-choice-icon--blue" aria-hidden="true">
                  <Buildings size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {unit.label} — {unit.dims}
                    {meta.badge ? <span className="tool-v2-choice-badge">{meta.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{meta.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">العدد المطلوب (شامل الهدر)</span>
            <div className="tool-v2-result-value">{fmt(result.unitsWithWaste)} قطعة</div>
            <div className="tool-v2-result-meta">{result.unit.label} — مساحة صافية {fmt(result.netAreaM2, 1)} م²</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">بدون هامش هدر</span>
              <span className="tool-v2-breakdown-value">{fmt(Math.ceil(result.netUnits))} قطعة</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">أكياس المونة (لصق) التقديرية</span>
              <span className="tool-v2-breakdown-value">{fmt(result.mortarBags)} كيس</span>
            </div>
          </div>

          <div className="tool-v2-note-strip">
            <Info size={15} weight="fill" />
            <span>يشمل الرقم هامش هدر 8% للقطع والكسر أثناء التركيب — الهامش المعتمد لدى مقاولي البناء عادة.</span>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل مساحة جدار صحيحة أكبر من صفر.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة كمية الطوب والبلوك', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
