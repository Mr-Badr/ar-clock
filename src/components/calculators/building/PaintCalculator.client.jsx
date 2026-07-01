'use client';

import { useMemo, useState, useCallback } from 'react';
import { Minus, Plus, PaintBucket, Info } from '@phosphor-icons/react';

// ─── Paint data ──────────────────────────────────────────────────────────────

const PAINT_TYPES = [
  {
    id: 'interior_economy',
    label: 'داخلي اقتصادي',
    sub: 'جدران واسعة',
    coverage: 10,
    icon: '🏠',
    note: 'كميات كبيرة بسعر منخفض',
  },
  {
    id: 'interior_standard',
    label: 'داخلي عادي',
    sub: 'الأكثر استخداماً',
    coverage: 12,
    icon: '🏠',
    note: 'توازن بين الجودة والسعر',
    recommended: true,
  },
  {
    id: 'interior_premium',
    label: 'داخلي فاخر',
    sub: 'تغطية ممتازة',
    coverage: 14,
    icon: '✨',
    note: 'قد تكفي طبقة واحدة',
  },
  {
    id: 'exterior_standard',
    label: 'خارجي عادي',
    sub: 'واجهات خارجية',
    coverage: 8,
    icon: '🏗️',
    note: 'متين للأسطح المكشوفة',
  },
  {
    id: 'exterior_premium',
    label: 'خارجي فاخر',
    sub: 'مقاوم للرطوبة',
    coverage: 10,
    icon: '🏗️',
    note: 'مقاوم للطقس والأشعة',
  },
  {
    id: 'primer',
    label: 'أستر / بريمر',
    sub: 'طبقة أساسية',
    coverage: 8,
    icon: '🖌️',
    note: 'ضروري قبل لون جديد أو جدار جديد',
  },
];

const DOOR_AREA   = 1.80;
const WINDOW_AREA = 1.44;

// ─── Calc ─────────────────────────────────────────────────────────────────────

function calcPaint({ length, width, height, doors, windows, coats, paintId }) {
  const paint     = PAINT_TYPES.find((p) => p.id === paintId) ?? PAINT_TYPES[1];
  const wallArea  = 2 * (length + width) * height;
  const openings  = doors * DOOR_AREA + windows * WINDOW_AREA;
  const netArea   = Math.max(0, wallArea - openings);
  const totalArea = netArea * coats;
  const liters    = totalArea / paint.coverage;
  const cans5L    = Math.ceil(liters / 5);
  const cans20L   = Math.ceil(liters / 20);
  const safeL     = liters * 1.12;
  const safeCans5L = Math.ceil(safeL / 5);
  const openPct   = wallArea > 0 ? (openings / wallArea) * 100 : 0;
  return {
    wallArea, openings, netArea, totalArea,
    liters, cans5L, cans20L, safeCans5L, openPct,
    coverage: paint.coverage,
    paintLabel: paint.label,
  };
}

function fmt(n, d = 1) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stepper({ value, min = 0, max = 20, onChange, label }) {
  return (
    <div className="pc-stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="pc-stepper-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="تقليل"
      >
        <Minus size={13} weight="bold" />
      </button>
      <span className="pc-stepper-val" aria-live="polite">{value}</span>
      <button
        type="button"
        className="pc-stepper-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="زيادة"
      >
        <Plus size={13} weight="bold" />
      </button>
    </div>
  );
}

function DimSlider({ label, unit, value, min, max, step, onChange }) {
  const handleInput = useCallback(
    (e) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v >= min && v <= max) onChange(v);
    },
    [min, max, onChange],
  );

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="pc-dim">
      <div className="pc-dim-head">
        <label className="pc-dim-label">{label}</label>
        <div className="pc-dim-val-wrap">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInput}
            className="pc-dim-input"
            aria-label={`${label} بالمتر`}
          />
          <span className="pc-dim-unit">{unit}</span>
        </div>
      </div>
      <div className="pc-range-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="pc-range"
          style={{ '--pct': `${pct}%` }}
          aria-label={label}
        />
        <div className="pc-range-bounds">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PaintCalculator() {
  const [length,  setLength]  = useState(4.5);
  const [width,   setWidth]   = useState(3.5);
  const [height,  setHeight]  = useState(2.8);
  const [doors,   setDoors]   = useState(1);
  const [windows, setWindows] = useState(2);
  const [coats,   setCoats]   = useState(2);
  const [paintId, setPaintId] = useState('interior_standard');

  const result = useMemo(
    () => calcPaint({ length, width, height, doors, windows, coats, paintId }),
    [length, width, height, doors, windows, coats, paintId],
  );

  const netPct = result.wallArea > 0
    ? (result.netArea / result.wallArea) * 100
    : 0;

  return (
    <div className="pc-layout">

      {/* ── Controls ─────────────────────────────── */}
      <div className="pc-controls">

        {/* Step 1: Dimensions */}
        <section className="pc-section" aria-labelledby="pc-s1">
          <h3 className="pc-section-title" id="pc-s1">
            <span className="pc-step-num" aria-hidden="true">1</span>
            أبعاد الغرفة
          </h3>
          <div className="pc-dims">
            <DimSlider label="الطول"    unit="م" value={length} min={1}  max={20} step={0.1} onChange={setLength} />
            <DimSlider label="العرض"    unit="م" value={width}  min={1}  max={20} step={0.1} onChange={setWidth}  />
            <DimSlider label="الارتفاع" unit="م" value={height} min={2}  max={6}  step={0.1} onChange={setHeight} />
          </div>
        </section>

        {/* Step 2: Openings */}
        <section className="pc-section" aria-labelledby="pc-s2">
          <h3 className="pc-section-title" id="pc-s2">
            <span className="pc-step-num" aria-hidden="true">2</span>
            الفتحات
            <span className="pc-section-sub">تُطرح من المساحة</span>
          </h3>
          <div className="pc-openings">
            <div className="pc-opening">
              <span className="pc-opening-emoji" aria-hidden="true">🚪</span>
              <div className="pc-opening-copy">
                <span className="pc-opening-label">أبواب</span>
                <span className="pc-opening-hint">{fmt(DOOR_AREA, 2)} م² / باب</span>
              </div>
              <Stepper value={doors}   min={0} max={10} onChange={setDoors}   label="عدد الأبواب" />
            </div>
            <div className="pc-opening">
              <span className="pc-opening-emoji" aria-hidden="true">🪟</span>
              <div className="pc-opening-copy">
                <span className="pc-opening-label">نوافذ</span>
                <span className="pc-opening-hint">{fmt(WINDOW_AREA, 2)} م² / نافذة</span>
              </div>
              <Stepper value={windows} min={0} max={20} onChange={setWindows} label="عدد النوافذ" />
            </div>
            <div className="pc-opening">
              <span className="pc-opening-emoji" aria-hidden="true">🖌️</span>
              <div className="pc-opening-copy">
                <span className="pc-opening-label">عدد الطبقات</span>
                <span className="pc-opening-hint">طبقتان هو المعيار</span>
              </div>
              <Stepper value={coats}   min={1} max={4}  onChange={setCoats}   label="عدد الطبقات" />
            </div>
          </div>
        </section>

        {/* Step 3: Paint type */}
        <section className="pc-section" aria-labelledby="pc-s3">
          <h3 className="pc-section-title" id="pc-s3">
            <span className="pc-step-num" aria-hidden="true">3</span>
            نوع الدهان
          </h3>
          <div className="pc-types">
            {PAINT_TYPES.map((p) => {
              const active = paintId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`pc-type${active ? ' pc-type--active' : ''}`}
                  onClick={() => setPaintId(p.id)}
                  aria-pressed={active}
                >
                  {p.recommended && (
                    <span className="pc-type-rec" aria-label="الأكثر استخداماً">★</span>
                  )}
                  <span className="pc-type-icon" aria-hidden="true">{p.icon}</span>
                  <span className="pc-type-name">{p.label}</span>
                  <span className="pc-type-sub">{p.sub}</span>
                  <span className="pc-type-cov">{p.coverage} م²/ل</span>
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {/* ── Live Results ─────────────────────────── */}
      <div className="pc-results" aria-live="polite" aria-label="نتيجة حاسبة الدهان">

        {/* Area breakdown */}
        <div className="pc-area-card">
          <div className="pc-area-head">
            <span className="pc-area-title">تفصيل المساحة</span>
            <span className="pc-area-gross">{fmt(result.wallArea)} م²</span>
          </div>

          <div
            className="pc-bar-wrap"
            role="img"
            aria-label={`${fmt(netPct, 0)}% مساحة صافية`}
          >
            <div className="pc-bar">
              <div className="pc-bar-net"  style={{ width: `${Math.min(100, netPct)}%` }} />
              {result.openPct > 0 && (
                <div className="pc-bar-open" style={{ width: `${Math.min(100, result.openPct)}%` }} />
              )}
            </div>
            <div className="pc-bar-legend">
              <span className="pc-bar-key --net">
                <span className="pc-bar-dot --net" />
                دهان {fmt(result.netArea)} م²
              </span>
              {result.openings > 0 && (
                <span className="pc-bar-key --open">
                  <span className="pc-bar-dot --open" />
                  فتحات {fmt(result.openings)} م²
                </span>
              )}
            </div>
          </div>

          <div className="pc-area-rows">
            <div className="pc-area-row">
              <span>مساحة الجدران الكلية</span>
              <strong>{fmt(result.wallArea)} م²</strong>
            </div>
            {result.openings > 0 && (
              <div className="pc-area-row --minus">
                <span>تُطرح الفتحات</span>
                <strong>−{fmt(result.openings)} م²</strong>
              </div>
            )}
            <div className="pc-area-row --net">
              <span>المساحة الصافية</span>
              <strong>{fmt(result.netArea)} م²</strong>
            </div>
            {coats > 1 && (
              <div className="pc-area-row --coats">
                <span>× {coats} طبقات</span>
                <strong>{fmt(result.totalArea)} م²</strong>
              </div>
            )}
          </div>
        </div>

        {/* Hero result */}
        <div className="pc-hero">
          <div className="pc-hero-top">
            <div className="pc-hero-icon-wrap">
              <PaintBucket size={22} weight="fill" aria-hidden="true" />
            </div>
            <div>
              <p className="pc-hero-label">كمية الدهان المطلوبة</p>
              <p className="pc-hero-liters">{fmt(result.liters)} <span>لتر</span></p>
            </div>
          </div>

          <div className="pc-cans">
            <div className="pc-can">
              <span className="pc-can-num">{result.cans5L}</span>
              <span className="pc-can-lbl">علبة 5 لتر</span>
            </div>
            <span className="pc-can-or" aria-hidden="true">أو</span>
            <div className="pc-can">
              <span className="pc-can-num">{result.cans20L}</span>
              <span className="pc-can-lbl">علبة 20 لتر</span>
            </div>
          </div>

          <div className="pc-safety">
            <Info size={13} weight="fill" className="pc-safety-ico" aria-hidden="true" />
            <span>
              اشترِ <strong>{result.safeCans5L} علبة 5 لتر</strong> — يشمل 12% احتياط للإصلاحات
            </span>
          </div>
        </div>

        {/* Summary row */}
        <div className="pc-meta">
          <div className="pc-meta-row">
            <span>نوع الدهان</span>
            <strong>{result.paintLabel}</strong>
          </div>
          <div className="pc-meta-row">
            <span>التغطية</span>
            <strong>{result.coverage} م²/لتر</strong>
          </div>
          <div className="pc-meta-row">
            <span>عدد الطبقات</span>
            <strong>{coats}</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
