"use client";

import { CEMENT_KG_PER_M3 } from '@/lib/calculators/building/constants';

const COLORS = {
  M15: '--blue-text',
  M20: '--green-text',
  M25: '--amber-text',
  M30: '--red-text',
};
const MAX = 525;

export default function ConcreteGradeChart() {
  const rows = Object.entries(CEMENT_KG_PER_M3).map(([key, kg]) => ({
    label: `عيار ${key.replace('M', '')}`,
    kg,
    colorVar: COLORS[key],
  }));

  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>كمية الأسمنت لكل متر مكعب حسب العيار</h3>
        <p>كل ما ارتفع العيار (المتانة)، زادت كمية الأسمنت المطلوبة — لهذا يرتفع سعر العيار الأعلى.</p>
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
            <span className="tool-v2-hbar-value">{row.kg} كجم</span>
          </div>
        ))}
      </div>
    </div>
  );
}
