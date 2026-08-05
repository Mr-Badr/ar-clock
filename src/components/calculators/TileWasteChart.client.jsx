"use client";

import { TILE_PATTERNS } from '@/lib/calculators/building/constants';

const COLORS = {
  straight: '--blue-text',
  diagonal: '--amber-text',
  herringbone: '--amber-text',
  complex: '--red-text',
};
const MAX = 25;

export default function TileWasteChart() {
  const rows = TILE_PATTERNS.map((p) => ({
    label: p.label,
    waste: Number.parseInt(p.waste, 10),
    colorVar: COLORS[p.key] || '--blue-text',
  }));

  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>كم بلاطة إضافية يحتاجها كل نمط تركيب؟</h3>
        <p>كل رقم يعني: من كل 100 بلاطة صافية تحتاجها المساحة، هذا العدد الإضافي الذي يذهب هدراً في القص عند الحواف.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {rows.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.waste / MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">{row.waste} بلاطة</span>
          </div>
        ))}
      </div>
    </div>
  );
}
