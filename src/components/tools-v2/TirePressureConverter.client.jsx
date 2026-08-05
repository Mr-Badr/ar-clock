"use client";

import { useState } from 'react';
import { Gauge } from '@phosphor-icons/react';

// 1 bar = 14.5038 psi = 100 kPa (exact by kPa definition, psi/bar via standard conversion factor)
const PSI_PER_BAR = 14.5038;
const KPA_PER_BAR = 100;

function fromPsi(psi) {
  const bar = psi / PSI_PER_BAR;
  return { psi, bar, kpa: bar * KPA_PER_BAR };
}
function fromBar(bar) {
  return { psi: bar * PSI_PER_BAR, bar, kpa: bar * KPA_PER_BAR };
}
function fromKpa(kpa) {
  const bar = kpa / KPA_PER_BAR;
  return { psi: bar * PSI_PER_BAR, bar, kpa };
}

const UNITS = [
  { id: 'psi', label: 'PSI', from: fromPsi },
  { id: 'bar', label: 'بار', from: fromBar },
  { id: 'kpa', label: 'كيلوباسكال', from: fromKpa },
];

export default function TirePressureConverter() {
  const [unitId, setUnitId] = useState('psi');
  const [value, setValue] = useState('32');

  const unit = UNITS.find((u) => u.id === unitId);
  const num = Number(value);
  const result = value && !Number.isNaN(num) ? unit.from(num) : null;

  return (
    <div className="guide-v2-checker">
      <div className="guide-v2-checker-head">
        <span className="guide-v2-checker-icon" aria-hidden="true"><Gauge size={18} weight="bold" /></span>
        <div>
          <p className="guide-v2-checker-title">محول ضغط الإطارات</p>
          <p className="guide-v2-checker-sub">PSI ↔ بار ↔ كيلوباسكال</p>
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
        <label htmlFor="tp-value">القيمة بوحدة {unit.label}</label>
        <input id="tp-value" type="number" inputMode="decimal" min="0" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>

      {result ? (
        <div className="tool-v2-result-stat-row" role="status">
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">PSI</span>
            <span className="tool-v2-result-stat-value">{result.psi.toFixed(1)}</span>
          </div>
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">بار</span>
            <span className="tool-v2-result-stat-value">{result.bar.toFixed(2)}</span>
          </div>
          <div className="tool-v2-result-stat">
            <span className="tool-v2-result-stat-label">كيلوباسكال</span>
            <span className="tool-v2-result-stat-value">{result.kpa.toFixed(0)}</span>
          </div>
        </div>
      ) : null}

      <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
        ضغط الإطارات الموصى به لمعظم سيارات الركاب يتراوح بين 30 و35 PSI (نحو 2.1–2.4 بار) — لكن
        الرقم الدقيق لسيارتك مطبوع دائماً على ملصق داخل إطار الباب الأمامي، وليس على الإطار نفسه.
      </p>
    </div>
  );
}
