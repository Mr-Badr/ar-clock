"use client";

import { useState } from 'react';
import { Buildings, Plus, Share as ShareIcon, Sparkle, Trash, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import PremiumSelect from '@/components/tools-v2/PremiumSelect.client';
import { GYPSUM_BOARD_SIZES, GYPSUM_WASTE_LEVELS, calcGypsumBoard, fmt } from '@/lib/calculators/building/constants';

const WASTE_META = {
  simple: { icon: Buildings, color: 'blue' },
  complex: { icon: Sparkle, color: 'amber' },
  heavy: { icon: Warning, color: 'red' },
};

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

export default function GypsumBoardCalculator() {
  const [rooms, setRooms] = useState([{ width: 4, length: 4 }]);
  const [sizeIndex, setSizeIndex] = useState(0); // default 120×240
  const [wasteKey, setWasteKey] = useState('simple');

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
  const selectedSize = GYPSUM_BOARD_SIZES[sizeIndex] || GYPSUM_BOARD_SIZES[0];
  const hasInput = totalAreaM2 > 0;
  const result = hasInput ? calcGypsumBoard(totalAreaM2, selectedSize.area, wasteKey) : null;
  const selectedWaste = GYPSUM_WASTE_LEVELS.find((w) => w.key === wasteKey);

  const shareText = result
    ? `حاسبة الجبس بورد: ${fmt(result.sheetsWithWaste)} لوح لمساحة ${fmt(totalAreaM2, 1)} م² — مقاس ${selectedSize.label}`
    : '';

  return (
    <div aria-label="حاسبة كمية الجبس بورد">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> شامل نسبة الهدر</span>
      </div>

      <div className="tool-v2-field">
        <label>مساحة الأسقف أو الجدران</label>
        <div className="tool-v2-rebar-rows">
          {rooms.map((room, index) => (
            <div key={index} className="tool-v2-rebar-row">
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`gyp-w-${index}`}>العرض (م)</label>
                <input
                  id={`gyp-w-${index}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={room.width}
                  onChange={(e) => updateRoom(index, 'width', e.target.value)}
                />
              </div>
              <div className="tool-v2-rebar-row-field">
                <label htmlFor={`gyp-l-${index}`}>الطول (م)</label>
                <input
                  id={`gyp-l-${index}`}
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
                aria-label={`حذف المساحة ${index + 1}`}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="tool-v2-add-row-btn" onClick={addRoom}>
          <Plus size={16} weight="bold" /> إضافة مساحة أخرى
        </button>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="gyp-size">مقاس اللوح</label>
        <PremiumSelect
          id="gyp-size"
          value={sizeIndex}
          onChange={(v) => setSizeIndex(Number(v))}
          options={GYPSUM_BOARD_SIZES.map((s, i) => ({ value: i, label: `${s.label} — ${fmt(s.area, 2)} م²/لوح` }))}
        />
      </div>

      <div className="tool-v2-field">
        <label>نوع الغرفة</label>
        <div className="tool-v2-choice-list">
          {GYPSUM_WASTE_LEVELS.map((w) => {
            const meta = WASTE_META[w.key] || {};
            const Icon = meta.icon || Buildings;
            const active = wasteKey === w.key;
            return (
              <label
                key={w.key}
                className={`tool-v2-choice-card${active ? ' is-active' : ''}`}
                htmlFor={`gyp-waste-${w.key}`}
              >
                <input
                  type="radio"
                  id={`gyp-waste-${w.key}`}
                  name="gyp-waste"
                  checked={active}
                  onChange={() => setWasteKey(w.key)}
                />
                <span className={`tool-v2-choice-icon tool-v2-choice-icon--${meta.color || 'blue'}`} aria-hidden="true">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="tool-v2-choice-body">
                  <span className="tool-v2-choice-title">
                    {w.label}
                    {w.badge ? <span className="tool-v2-choice-badge">{w.badge}</span> : null}
                  </span>
                  <span className="tool-v2-choice-desc">{w.desc}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {result ? (
        <div aria-live="polite">
          <div className="tool-v2-result-hero">
            <span className="tool-v2-result-label">عدد الألواح المطلوبة</span>
            <div className="tool-v2-result-value">{fmt(result.sheetsWithWaste)} لوح</div>
            <div className="tool-v2-result-meta">شامل هامش هدر {Math.round(result.wasteFactor * 100)}% — {selectedWaste?.label}</div>
          </div>

          <div className="tool-v2-breakdown-list">
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">المساحة الإجمالية</span>
              <span className="tool-v2-breakdown-value">{fmt(totalAreaM2, 1)} م²</span>
            </div>
            <div className="tool-v2-breakdown-row">
              <span className="tool-v2-breakdown-label">ألواح بدون هدر</span>
              <span className="tool-v2-breakdown-value">{fmt(Math.ceil(result.netSheets))} لوح</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tool-v2-empty-state">
          <Warning size={28} weight="duotone" />
          <p>أدخل أبعاد صحيحة لمساحة واحدة على الأقل.</p>
        </div>
      )}

      <div className="tool-v2-action-row">
        <button
          type="button"
          className="tool-v2-action-btn is-primary"
          onClick={() => shareResult('حاسبة كمية الجبس بورد', shareText)}
          disabled={!result}
        >
          <ShareIcon size={18} weight="bold" /> مشاركة
        </button>
      </div>
    </div>
  );
}
