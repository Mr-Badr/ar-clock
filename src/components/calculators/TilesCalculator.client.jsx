"use client";

import { useState } from 'react';
import { Buildings, Info, Plus, Share as ShareIcon, Sparkle, Trash, Warning, Wrench } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { TILE_PATTERNS, TILE_SIZES, calcTiles, fmt } from '@/lib/calculators/building/constants';

// Human-language description + icon/color per pattern — TILE_PATTERNS (building/constants.js)
// stays the source of numeric truth (waste %), this only adds display metadata.
const PATTERN_META = {
  straight: { icon: Buildings, color: 'blue', badge: 'الأكثر شيوعاً', desc: 'أسرع تركيب وأقل هدر — الخيار الافتراضي لمعظم الغرف المستطيلة العادية.' },
  diagonal: { icon: Sparkle, color: 'amber', desc: 'شكل بصري مميز، لكنه يحتاج قطعاً إضافياً عند كل حافة فيرتفع الهدر قليلاً.' },
  herringbone: { icon: Wrench, color: 'amber', desc: 'نمط متداخل يحتاج خبرة أعلى في التركيب وهدراً أكبر في القطع — شائع في المداخل والصالات.' },
  complex: { icon: Warning, color: 'red', desc: 'تصاميم مخصصة أو أشكال غير منتظمة — أعلى نسبة هدر، احسب كمية إضافية دائماً.' },
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

export default function TilesCalculator() {
  const [rooms, setRooms] = useState([{ width: 4, length: 4 }]);
  const [tileSizeIndex, setTileSizeIndex] = useState(4); // default 60x60
  const [pattern, setPattern] = useState('straight');
  const [customBoxSize, setCustomBoxSize] = useState('');

  function updateRoom(index, field, value) {
    const parsed = Math.max(0, Number(value) || 0);
    setRooms((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: parsed } : r)));
  }

  function addRoom() {
    setRooms((prev) => [...prev, { width: 4, length: 4 }]);
  }

  function removeRoom(index) {
    setRooms((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const totalAreaM2 = rooms.reduce((sum, r) => sum + r.width * r.length, 0);
  const selectedSize = TILE_SIZES[tileSizeIndex] || TILE_SIZES[4];
  const parsedBoxSize = Number.parseInt(customBoxSize, 10);
  const tilesPerBox = Number.isFinite(parsedBoxSize) && parsedBoxSize > 0 ? parsedBoxSize : selectedSize.defaultPerBox;
  const hasInput = totalAreaM2 > 0;
  const result = hasInput ? calcTiles(totalAreaM2, selectedSize.w, selectedSize.h, pattern, tilesPerBox) : null;
  const selectedPattern = TILE_PATTERNS.find((p) => p.key === pattern);

  const shareText = result
    ? `حاسبة البلاط: ${fmt(result.boxes)} كرتونة (${fmt(result.tilesWithWaste)} بلاطة) لمساحة ${fmt(totalAreaM2, 1)} م² — مقاس ${selectedSize.label}`
    : '';

  return (
    <div aria-label="حاسبة البلاط والسيراميك">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> شامل نسبة الهدر</span>
      </div>

      <div className="tool-v2-field">
        <label>
          مساحة الغرف
          <FieldHint text="أضف كل غرفة على حدة بطولها وعرضها — الحاسبة تجمعها كلها." />
        </label>
        <div className="tool-v2-rebar-rows">
          {rooms.map((room, index) => (
            <div key={index} className="tool-v2-rebar-row">
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`tile-w-${index}`}>العرض (م)</label>
                <input
                  id={`tile-w-${index}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={room.width}
                  onChange={(e) => updateRoom(index, 'width', e.target.value)}
                />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`tile-l-${index}`}>الطول (م)</label>
                <input
                  id={`tile-l-${index}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={room.length}
                  onChange={(e) => updateRoom(index, 'length', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="tool-v2-rebar-row-remove"
                onClick={() => removeRoom(index)}
                disabled={rooms.length === 1}
                aria-label={`حذف الغرفة ${index + 1}`}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-add-row-btn" onClick={addRoom}>
          <Plus size={16} weight="bold" /> إضافة غرفة أخرى
        </button>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="tile-size">مقاس البلاطة</label>
        <PremiumSelect
          id="tile-size"
          value={tileSizeIndex}
          onChange={(v) => setTileSizeIndex(Number(v))}
          options={TILE_SIZES.map((s, i) => ({ value: i, label: `${s.label} سم` }))}
        />
      </div>

      <div className="tool-v2-field">
        <label>
          نمط التركيب
          <FieldHint text="الأنماط القطرية والمعقدة تحتاج قطعاً أكثر عند الحواف، لذلك نسبة الهدر فيها أعلى." />
        </label>
        <div className="tool-v2-choice-list">
          {TILE_PATTERNS.map((p) => {
            const meta = PATTERN_META[p.key] || {};
            const Icon = meta.icon || Buildings;
            const active = pattern === p.key;
            return (
              <label
                key={p.key}
                className={`tool-v2-choice-card${active ? ' is-active' : ''}`}
                htmlFor={`tile-pattern-${p.key}`}
              >
                <input
                  type="radio"
                  id={`tile-pattern-${p.key}`}
                  name="tile-pattern"
                  checked={active}
                  onChange={() => setPattern(p.key)}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${meta.color || 'blue'}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {p.label}
                    {meta.badge ? <span className="tool-v2-choice-badge">{meta.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{meta.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="tile-box">عدد البلاط في الكرتونة (اختياري)</label>
        <input
          id="tile-box"
          type="number"
          inputMode="numeric"
          min="0"
          value={customBoxSize}
          onChange={(e) => setCustomBoxSize(e.target.value)}
          placeholder={String(selectedSize.defaultPerBox)}
        />
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">عدد الكراتين المطلوبة</span>
            <div className="tool-v2-result-value">{fmt(result.boxes)} كرتونة</div>
            <div className="tool-v2-result-meta">{fmt(result.tilesWithWaste)} بلاطة — شامل هدر {selectedPattern?.waste}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">المساحة الإجمالية</span>
              <span className="tool-v2-breakdown-value">{fmt(totalAreaM2, 1)} م²</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">بلاط بدون هدر</span>
              <span className="tool-v2-breakdown-value">{fmt(Math.ceil(result.netTiles))} بلاطة</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاد صحيحة لغرفة واحدة على الأقل.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة البلاط والسيراميك', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
