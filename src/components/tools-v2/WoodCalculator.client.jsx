"use client";

import { useMemo, useState } from 'react';
import { Ruler as RulerIcon, ArrowsLeftRight } from '@phosphor-icons/react';

const M3_TO_FT3 = 35.3147;
const CM_TO_INCH = 1 / 2.54;

function fmt(n, digits = 2) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function WoodCalculator() {
  const [length, setLength] = useState('2');
  const [width, setWidth] = useState('20');
  const [thickness, setThickness] = useState('2');
  const [count, setCount] = useState('10');
  const [pricePerM3, setPricePerM3] = useState('');

  const { volumePerBoard, totalVolume, totalCost, boardFeet } = useMemo(() => {
    const l = Math.max(0, Number(length) || 0);
    const w = Math.max(0, Number(width) || 0) / 100;
    const t = Math.max(0, Number(thickness) || 0) / 100;
    const c = Math.max(0, Number(count) || 0);
    const perBoard = l * w * t;
    const total = perBoard * c;
    const price = Math.max(0, Number(pricePerM3) || 0);
    return {
      volumePerBoard: perBoard,
      totalVolume: total,
      totalCost: total * price,
      boardFeet: total * M3_TO_FT3,
    };
  }, [length, width, thickness, count, pricePerM3]);

  // Small standalone unit converter — independent state from the main calculator above.
  const [convValue, setConvValue] = useState('1');
  const [convDirection, setConvDirection] = useState('m3-ft3');
  const convResult = useMemo(() => {
    const v = Number(convValue) || 0;
    switch (convDirection) {
      case 'm3-ft3': return v * M3_TO_FT3;
      case 'ft3-m3': return v / M3_TO_FT3;
      case 'cm-inch': return v * CM_TO_INCH;
      case 'inch-cm': return v / CM_TO_INCH;
      default: return 0;
    }
  }, [convValue, convDirection]);
  const CONV_LABELS = {
    'm3-ft3': ['متر مكعب', 'قدم مكعب'],
    'ft3-m3': ['قدم مكعب', 'متر مكعب'],
    'cm-inch': ['سنتيمتر', 'انش'],
    'inch-cm': ['انش', 'سنتيمتر'],
  };

  return (
    <div>
      <div className="guide-v2-checker">
        <div className="guide-v2-checker-head">
          <span className="guide-v2-checker-icon" aria-hidden="true"><RulerIcon size={18} weight="bold" /></span>
          <div>
            <p className="guide-v2-checker-title">احسب كمية الخشب وتكلفته</p>
            <p className="guide-v2-checker-sub">أدخل أبعاد اللوح الواحد وعدد الألواح</p>
          </div>
        </div>

        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wc-length">طول اللوح (متر)</label>
            <input id="wc-length" type="number" inputMode="decimal" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value)} placeholder="2" />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wc-width">عرض اللوح (سم)</label>
            <input id="wc-width" type="number" inputMode="decimal" min="0" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="20" />
          </div>
        </div>
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="wc-thickness">سماكة اللوح (سم)</label>
            <input id="wc-thickness" type="number" inputMode="decimal" min="0" step="0.1" value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="2" />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="wc-count">عدد الألواح</label>
            <input id="wc-count" type="number" inputMode="numeric" min="0" value={count} onChange={(e) => setCount(e.target.value)} placeholder="10" />
          </div>
        </div>
        <div className="tool-v2-field">
          <label htmlFor="wc-price">سعر المتر المكعب (اختياري، بعملتك)</label>
          <input id="wc-price" type="number" inputMode="decimal" min="0" value={pricePerM3} onChange={(e) => setPricePerM3(e.target.value)} placeholder="مثال: 2500" />
        </div>

        <div className="guide-v2-checker-result is-good" aria-live="polite">
          <p className="guide-v2-checker-result-label">الكمية الإجمالية المطلوبة</p>
          <p className="guide-v2-checker-result-value" style={{ direction: 'ltr', textAlign: 'end', display: 'block' }}>
            {fmt(totalVolume, 3)} م³
          </p>
          <p className="guide-v2-checker-result-note">
            بمعنى {fmt(volumePerBoard, 4)} م³ للوح الواحد × {count || 0} لوحاً = {fmt(totalVolume, 3)} م³ إجمالاً
            (ما يعادل تقريباً {fmt(boardFeet, 1)} قدم مكعب، وحدة الأسواق الأمريكية إن قارنتها بمصدر أجنبي).
            {Number(pricePerM3) > 0 ? ` بسعر ${fmt(pricePerM3, 0)} لكل متر مكعب، التكلفة التقديرية الإجمالية ${fmt(totalCost, 0)}.` : ''}
          </p>
        </div>
      </div>

      <div className="guide-v2-checker" style={{ marginTop: 'var(--space-6)' }}>
        <div className="guide-v2-checker-head">
          <span className="guide-v2-checker-icon" aria-hidden="true"><ArrowsLeftRight size={18} weight="bold" /></span>
          <div>
            <p className="guide-v2-checker-title">محول وحدات سريع</p>
            <p className="guide-v2-checker-sub">قدم مكعب ↔ متر مكعب، سنتيمتر ↔ انش</p>
          </div>
        </div>
        <div className="tool-v2-field-row-pair">
          <div className="tool-v2-field">
            <label htmlFor="conv-value">القيمة</label>
            <input id="conv-value" type="number" inputMode="decimal" value={convValue} onChange={(e) => setConvValue(e.target.value)} />
          </div>
          <div className="tool-v2-field">
            <label htmlFor="conv-dir">التحويل</label>
            <select id="conv-dir" value={convDirection} onChange={(e) => setConvDirection(e.target.value)}>
              <option value="m3-ft3">متر مكعب ← قدم مكعب</option>
              <option value="ft3-m3">قدم مكعب ← متر مكعب</option>
              <option value="cm-inch">سنتيمتر ← انش</option>
              <option value="inch-cm">انش ← سنتيمتر</option>
            </select>
          </div>
        </div>
        <div className="guide-v2-checker-result" aria-live="polite">
          <p className="guide-v2-checker-result-note" style={{ marginTop: 0 }}>
            {fmt(Number(convValue) || 0, 3)} {CONV_LABELS[convDirection][0]} = <strong style={{ color: 'var(--amber-text)' }}>{fmt(convResult, 4)} {CONV_LABELS[convDirection][1]}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
