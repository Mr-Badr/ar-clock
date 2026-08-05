"use client";

// Plain CSS bars, not a charting library — recharts fought the RTL+dark-theme combination (bars
// rendered as a single solid rect instead of 6 colored ones); this is simpler and guaranteed to
// render correctly in every theme/direction.
const DATA = [
  { label: 'داخلي فاخر', coverage: 14, colorVar: '--amber-text' },
  { label: 'داخلي عادي', coverage: 12, colorVar: '--green-text' },
  { label: 'داخلي اقتصادي', coverage: 10, colorVar: '--blue-text' },
  { label: 'خارجي فاخر', coverage: 10, colorVar: '--blue-text' },
  { label: 'خارجي عادي', coverage: 8, colorVar: '--blue-text' },
  { label: 'أستر / بريمر', coverage: 8, colorVar: '--amber-text' },
];
const MAX = 14;

export default function PaintCoverageChart() {
  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>كم متراً يغطي لتر الدهان الواحد؟</h3>
        <p>كل رقم يعني: لتر واحد من هذا النوع يكفي تقريباً لهذه المساحة — كلما زاد الرقم احتجت دهاناً أقل.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {DATA.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.coverage / MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">{row.coverage} م²/ل</span>
          </div>
        ))}
      </div>
    </div>
  );
}
