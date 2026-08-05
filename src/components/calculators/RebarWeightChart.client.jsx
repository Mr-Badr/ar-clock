"use client";

import { REBAR_DIAMETERS, REBAR_WEIGHT_PER_METER } from '@/lib/calculators/building/constants';

const MAX = Math.max(...REBAR_DIAMETERS.map((d) => REBAR_WEIGHT_PER_METER[d]));

function colorFor(diameter) {
  if (diameter <= 12) return '--blue-text';
  if (diameter <= 18) return '--green-text';
  if (diameter <= 25) return '--amber-text';
  return '--red-text';
}

export default function RebarWeightChart() {
  const rows = REBAR_DIAMETERS.map((d) => ({
    label: `⌀${d}`,
    kg: REBAR_WEIGHT_PER_METER[d],
    colorVar: colorFor(d),
  }));

  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>كم يزن المتر الطولي حسب القطر؟</h3>
        <p>القطر مُربَّع في المعادلة، لذلك الوزن يقفز بشكل ملحوظ بين الأقطار المتقاربة — وليس بشكل خطي.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {rows.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.kg / MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">{row.kg.toFixed(2)} كجم/م</span>
          </div>
        ))}
      </div>
    </div>
  );
}
