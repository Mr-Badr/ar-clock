"use client";

import { useState } from 'react';
import { GasPump } from '@phosphor-icons/react';

// Standard conversion constant: 1 US MPG ≈ 235.215 / (L/100km). Derived from
// 1 gallon (US) = 3.78541 L, 1 mile = 1.60934 km → (100 × 3.78541) / 1.60934 ≈ 235.215.
const MPG_CONSTANT = 235.215;

function fromL100km(v) {
  return { l100km: v, kmL: 100 / v, mpg: MPG_CONSTANT / v };
}
function fromKmL(v) {
  const l100km = 100 / v;
  return { l100km, kmL: v, mpg: MPG_CONSTANT / l100km };
}
function fromMpg(v) {
  const l100km = MPG_CONSTANT / v;
  return { l100km, kmL: 100 / l100km, mpg: v };
}

const UNITS = [
  { id: 'l100km', label: 'لتر/100كم', from: fromL100km },
  { id: 'kml', label: 'كم/لتر', from: fromKmL },
  { id: 'mpg', label: 'ميل/غالون (MPG)', from: fromMpg },
];

export default function FuelEfficiencyConverter() {
  const [unitId, setUnitId] = useState('l100km');
  const [value, setValue] = useState('7');

  const unit = UNITS.find((u) => u.id === unitId);
  const num = Number(value);
  const result = value && num > 0 ? unit.from(num) : null;

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><GasPump size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">محول استهلاك الوقود</p>
          <p className="guide-v2-checker-sub">لتر/100كم ↔ كم/لتر ↔ MPG</p>
        </div>
      </div>

      <div className="guide-v2-checker-options" role="group" aria-label="وحدة الإدخال" style={{ marginBottom: 'var(--space-3)' }}>
        {UNITS.map((u) => (
          <button
            key={u.id}
            type="button"
            className={`guide-v2-checker-chip${unitId === u.id ? ' is-active' : ''}`}
            aria-pressed={unitId === u.id}
            onClick={() => setUnitId(u.id)}
          >
            {u.label}
          </button>
        ))}
      </div>

      <div className="tool-v2-field" style={{ marginBottom: 'var(--space-4)' }}>
        <label htmlFor="fe-value">القيمة بوحدة {unit.label}</label>
        <input id="fe-value" type="number" inputMode="decimal" min="0.1" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>

      {result ? (
        <div className="tool-v2-result-stat-row" role="status">
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">لتر/100كم</span>
            <span className="tool-v2-result-stat-value">{result.l100km.toFixed(1)}</span>
          </div>
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">كم/لتر</span>
            <span className="tool-v2-result-stat-value">{result.kmL.toFixed(1)}</span>
          </div>
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">MPG</span>
            <span className="tool-v2-result-stat-value">{result.mpg.toFixed(1)}</span>
          </div>
        </div>
      ) : null}

      <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
        رقم أقل في "لتر/100كم" يعني كفاءة أعلى (وقود أقل)، بعكس "كم/لتر" و"MPG" حيث الرقم الأعلى
        هو الأفضل. متوسط السيارات الاقتصادية يقارب 6-7 لتر/100كم، والدفع الرباعي الكبير قد يتجاوز 12.
      </p>
    </div>
  );
}
