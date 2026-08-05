"use client";

import { getCountryBySlug } from '@/lib/calculators/building/country-data';
import { FINISH_LEVELS, formatCurrency } from '@/lib/calculators/building/constants';

const COLORS = {
  skeleton: '--blue-text',
  economy: '--blue-text',
  standard: '--green-text',
  luxury: '--amber-text',
  super_lux: '--red-text',
};

const SAUDI = getCountryBySlug('saudi-arabia');
const MAX = Math.max(...Object.values(SAUDI?.cost_per_m2 || { max: 5500 }));

export default function BuildCostFinishChart() {
  const rows = FINISH_LEVELS.map((f) => ({
    label: f.label,
    cost: SAUDI?.cost_per_m2?.[f.key] ?? 0,
    colorVar: COLORS[f.key] || '--blue-text',
  }));

  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>كم يضيف كل مستوى تشطيب على سعر المتر؟</h3>
        <p>هذه أسعار المتر المربع في الرياض (خط الأساس) قبل معامل تعديل المدينة — استخدمها للمقارنة بين المستويات، لا كسعر نهائي.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {rows.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.cost / MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">{formatCurrency(row.cost, SAUDI?.symbol)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
