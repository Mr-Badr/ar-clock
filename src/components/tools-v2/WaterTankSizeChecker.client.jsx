"use client";

import { useState } from 'react';
import { Drop } from '@phosphor-icons/react';

// Estimate: 150 لتر/فرد/يوم (تقدير هندسي شائع للاستهلاك المنزلي) × 3 أيام احتياط لتغطية
// انقطاع مؤقت في التزويد — مذكور صراحة في النص أسفل الأداة، وليس رقماً نهائياً غير قابل للنقاش.
const BUCKETS = [
  { id: '1-2', label: '1-2', people: 2 },
  { id: '3-4', label: '3-4', people: 4 },
  { id: '5-6', label: '5-6', people: 6 },
  { id: '7-9', label: '7-9', people: 9 },
  { id: '10+', label: '10+', people: 13 },
];
const COMMON_SIZES = [500, 1000, 1500, 2000, 3000, 5000, 7000, 10000];

function recommend(people) {
  const raw = people * 150 * 3;
  const size = COMMON_SIZES.find((s) => s >= raw);
  return size || 10000;
}

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Cylindrical: V = π × r² × h. Rectangular: V = L × W × H. Both computed in
// centimeters then converted to liters (1 liter = 1000 cm³) — the two
// physical shapes almost every Gulf home water tank comes in.
function calcTankVolume(shape, dims) {
  const cm3ToLiters = (cm3) => cm3 / 1000;
  if (shape === 'cylinder') {
    const diameter = Math.max(0, Number(dims.diameter) || 0);
    const height = Math.max(0, Number(dims.height) || 0);
    const radius = diameter / 2;
    return cm3ToLiters(Math.PI * radius * radius * height);
  }
  const length = Math.max(0, Number(dims.length) || 0);
  const width = Math.max(0, Number(dims.width) || 0);
  const height = Math.max(0, Number(dims.height) || 0);
  return cm3ToLiters(length * width * height);
}

export default function WaterTankSizeChecker() {
  const [mode, setMode] = useState('by-family'); // 'by-family' | 'by-dimensions'

  // Mode A — by family size (existing)
  const [active, setActive] = useState('3-4');
  const bucket = BUCKETS.find((b) => b.id === active);
  const size = recommend(bucket.people);
  const isLarge = active === '10+';

  // Mode B — by physical dimensions
  const [shape, setShape] = useState('cylinder');
  const [dims, setDims] = useState({ diameter: '110', height: '130', length: '150', width: '100' });
  const volumeLiters = calcTankVolume(shape, dims);
  const hasDims = shape === 'cylinder'
    ? Number(dims.diameter) > 0 && Number(dims.height) > 0
    : Number(dims.length) > 0 && Number(dims.width) > 0 && Number(dims.height) > 0;

  function updateDim(field, value) {
    setDims((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Drop size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">{mode === 'by-family' ? 'ما سعة الخزان المناسبة لعائلتك؟' : 'احسب سعة خزانك الحالي من أبعاده'}</p>
          <p className="guide-v2-checker-sub">{mode === 'by-family' ? 'اختر عدد أفراد الأسرة' : 'أدخل أبعاد الخزان بالسنتيمتر'}</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="طريقة الحساب" style={{ marginBottom: 'var(--space-3)' }}>
        <button
          type="button"
          className={`guide-v2-checker-chip${mode === 'by-family' ? ' is-active' : ''}`}
          aria-pressed={mode === 'by-family'}
          onClick={() => setMode('by-family')}
        >
          أي سعة أشتري؟
        </button>
        <button
          type="button"
          className={`guide-v2-checker-chip${mode === 'by-dimensions' ? ' is-active' : ''}`}
          aria-pressed={mode === 'by-dimensions'}
          onClick={() => setMode('by-dimensions')}
        >
          احسب سعة خزاني الحالي
        </button>
      </div>

      {mode === 'by-family' ? (
        <>
          <div className="guide-v2-checker-options" role="group" aria-label="عدد أفراد الأسرة">
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`guide-v2-checker-chip${active === b.id ? ' is-active' : ''}`}
                aria-pressed={active === b.id}
                onClick={() => setActive(b.id)}
              >
                {b.label} أفراد
              </button>
            ))}
          </div>
          <div className="guide-v2-checker-result" aria-live="polite">
            <p className="guide-v2-checker-result-label">السعة الموصى بها</p>
            <p className="guide-v2-checker-result-value">
              {isLarge ? `${fmt(size)} لتر فأكثر` : `نحو ${fmt(size)} لتر`}
            </p>
            <p className="guide-v2-checker-result-note">
              {isLarge
                ? 'لعائلة كبيرة أو عمارة سكنية صغيرة، راجع مقاولاً لتوزيع السعة على أكثر من خزان بدل خزان واحد ضخم.'
                : 'مبني على تقدير 150 لتراً للفرد يومياً + احتياط 3 أيام لتغطية أي انقطاع مؤقت في التزويد. عدّل الرقم إذا كان استهلاك منزلك أعلى من المعتاد.'}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="guide-v2-checker-options" role="group" aria-label="شكل الخزان" style={{ marginBottom: 'var(--space-3)' }}>
            <button
              type="button"
              className={`guide-v2-checker-chip${shape === 'cylinder' ? ' is-active' : ''}`}
              aria-pressed={shape === 'cylinder'}
              onClick={() => setShape('cylinder')}
            >
              دائري (أسطواني)
            </button>
            <button
              type="button"
              className={`guide-v2-checker-chip${shape === 'rectangular' ? ' is-active' : ''}`}
              aria-pressed={shape === 'rectangular'}
              onClick={() => setShape('rectangular')}
            >
              مستطيل
            </button>
          </div>

          {shape === 'cylinder' ? (
            <div className="tool-v2-field-row-pair">
              <div className="tool-v2-field">
                <label htmlFor="tank-diameter">القطر (سم)</label>
                <input
                  id="tank-diameter"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={dims.diameter}
                  onChange={(e) => updateDim('diameter', e.target.value)}
                  placeholder="110"
                />
              </div>
              <div className="tool-v2-field">
                <label htmlFor="tank-height-c">الارتفاع (سم)</label>
                <input
                  id="tank-height-c"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={dims.height}
                  onChange={(e) => updateDim('height', e.target.value)}
                  placeholder="130"
                />
              </div>
            </div>
          ) : (
            <div className="tool-v2-field-row-pair">
              <div className="tool-v2-field">
                <label htmlFor="tank-length">الطول (سم)</label>
                <input
                  id="tank-length"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={dims.length}
                  onChange={(e) => updateDim('length', e.target.value)}
                  placeholder="150"
                />
              </div>
              <div className="tool-v2-field">
                <label htmlFor="tank-width">العرض (سم)</label>
                <input
                  id="tank-width"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={dims.width}
                  onChange={(e) => updateDim('width', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div className="tool-v2-field">
                <label htmlFor="tank-height-r">الارتفاع (سم)</label>
                <input
                  id="tank-height-r"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={dims.height}
                  onChange={(e) => updateDim('height', e.target.value)}
                  placeholder="130"
                />
              </div>
            </div>
          )}

          {hasDims ? (
            <div className="guide-v2-checker-result" aria-live="polite">
              <p className="guide-v2-checker-result-label">السعة التقريبية</p>
              <p className="guide-v2-checker-result-value">{fmt(volumeLiters)} لتر</p>
              <p className="guide-v2-checker-result-note">
                حساب هندسي مباشر من الأبعاد الداخلية للخزان (
                {shape === 'cylinder' ? 'حجم أسطوانة = π × نصف القطر² × الارتفاع' : 'حجم متوازي مستطيلات = الطول × العرض × الارتفاع'}
                ). القياس الفعلي قد يقل قليلاً عن الرقم النظري بسبب سماكة جدار الخزان — اطرح 3-5 سم من كل بُعد للقياس من الداخل إن أردت دقة أعلى.
              </p>
            </div>
          ) : (
            <div className="guide-v2-checker-result" aria-live="polite">
              <p className="guide-v2-checker-result-note">أدخل الأبعاد لحساب السعة.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
