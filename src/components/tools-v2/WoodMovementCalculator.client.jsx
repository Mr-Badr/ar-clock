"use client";

import { useMemo, useState } from 'react';
import { ArrowsOutLineHorizontal } from '@phosphor-icons/react';
import PremiumSelect from './PremiumSelect.client';

// Tangential shrinkage % (green → oven-dry) — U.S. Forest Products Laboratory data via the WoodBin
// reference table, same authoritative source class used across this hub. Movement is computed with
// the standard woodworking "shrinkulator" formula (Hoadley, "Understanding Wood"):
//   movement = width × (ΔMC / FSP) × (tangentialShrinkage / 100)
// FSP (fiber saturation point) ≈ 28, an industry-standard constant, not a guessed number.
const FSP = 28;
const SPECIES = [
  { id: 'beech', name: 'الزان', tangential: 11.9 },
  { id: 'oak-white', name: 'البلوط الأبيض', tangential: 10.5 },
  { id: 'maple', name: 'القيقب', tangential: 9.9 },
  { id: 'oak-red', name: 'البلوط الأحمر', tangential: 8.6 },
  { id: 'poplar', name: 'الحور', tangential: 8.2 },
  { id: 'walnut', name: 'الجوز', tangential: 7.8 },
  { id: 'pine', name: 'الصنوبر', tangential: 6.1 },
  { id: 'teak', name: 'الساج', tangential: 5.8 },
];
const SWINGS = [
  { id: 'mild', label: 'خفيف (2%)', delta: 2, note: 'مكان مكيّف بثبات طوال السنة تقريباً' },
  { id: 'medium', label: 'متوسط (4%)', delta: 4, note: 'منزل عادي بين فصل جاف وفصل رطب' },
  { id: 'high', label: 'كبير (6%)', delta: 6, note: 'مناطق ساحلية أو صحراوية شديدة التفاوت موسمياً' },
];

function fmt(n, digits = 1) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}

export default function WoodMovementCalculator() {
  const [speciesId, setSpeciesId] = useState('beech');
  const [widthCm, setWidthCm] = useState('60');
  const [swingId, setSwingId] = useState('medium');

  const species = SPECIES.find((s) => s.id === speciesId);
  const swing = SWINGS.find((s) => s.id === swingId);

  const { movementCm, gapMm } = useMemo(() => {
    const w = Math.max(0, Number(widthCm) || 0);
    const movement = w * (swing.delta / FSP) * (species.tangential / 100);
    return { movementCm: movement, gapMm: (movement * 10) / 2 };
  }, [widthCm, swing, species]);

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><ArrowsOutLineHorizontal size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">احسب فجوة التمدد اللازمة</p>
          <p className="guide-v2-checker-sub">أداة فيزيائية بحتة — نفس الدقة في أي بلد أو مناخ</p>
        </div>
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="wm-species">نوع الخشب</label>
        <PremiumSelect
          id="wm-species"
          value={speciesId}
          onChange={setSpeciesId}
          options={SPECIES.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="wm-width">عرض اللوح (سم، عرضاً على اتجاه الألياف)</label>
        <input id="wm-width" type="number" inputMode="decimal" min="0" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} placeholder="60" />
      </div>

      <p className="guide-v2-checker-sub" style={{ margin: '0 0 var(--space-2)' }}>شدة التقلب الموسمي في الرطوبة</p>
      <div className="guide-v2-checker-options" role="group" aria-label="شدة التقلب">
        {SWINGS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`guide-v2-checker-chip${swingId === s.id ? ' is-active' : ''}`}
            aria-pressed={swingId === s.id}
            onClick={() => setSwingId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="guide-v2-checker-result is-good" aria-live="polite" style={{ marginTop: 'var(--space-5)' }}>
        <p className="guide-v2-checker-result-label">الحركة المتوقعة عرضاً على مدار الفصول</p>
        <p className="guide-v2-checker-result-value" style={{ direction: 'ltr', textAlign: 'end', display: 'block' }}>
          {fmt(movementCm * 10, 1)} مم
        </p>
        <p className="guide-v2-checker-result-note">
          {swing.note}. اترك فجوة تمدد لا تقل عن <strong>{fmt(gapMm, 1)} مم</strong> على كل جانب (نصف
          الحركة المتوقعة) عند تثبيت اللوح داخل إطار أو خزانة، حتى لا يتشقق أو ينحني عند تمدده.
          الرقم محسوب من نسبة الانكماش المرجعية لهذا النوع ({species.tangential}٪ من الحالة الخضراء
          إلى الجافة تماماً، مصدرها مختبر منتجات الغابات الأمريكي USDA).
        </p>
      </div>
    </div>
  );
}
