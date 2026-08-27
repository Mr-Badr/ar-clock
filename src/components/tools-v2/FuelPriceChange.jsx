// FuelPriceChange.jsx — small shared renderer for the month-over-month price-change indicator
// used on uae-fuel-prices (and any future fuel-price page). Reads a `changeFromLastMonth` value
// straight from fuel-prices-data.js/fuel-prices-live.js: positive = price rose (shown in red,
// matching the site's existing --red-text "up = costs you more" convention), negative =
// price fell (green), 0 = confirmed unchanged, null = not yet confirmed against a second source
// (see fuel-prices-data.js's own header comment) — rendered as "—", never as a fabricated 0.
export default function FuelPriceChange({ value, currency }) {
  if (value === null || value === undefined) {
    return <span className="fuel-price-change fuel-price-change--unknown">—</span>;
  }
  if (value === 0) {
    return <span className="fuel-price-change fuel-price-change--flat">— ثابت</span>;
  }
  const rose = value > 0;
  const absValue = Math.abs(value);
  // Dynamic precision: Lebanon's USD prices carry real month-over-month changes as small as
  // 0.004 — a flat .toFixed(2) rounded that to "0.00" while still showing a colored up/down
  // arrow, which reads as a contradiction (an arrow implying change next to a magnitude implying
  // none). Found 2026-08-25 verifying the Lebanon page against a live openvan.camp pull.
  const decimals = absValue < 0.01 ? 4 : absValue < 0.1 ? 3 : 2;
  const magnitude = absValue.toFixed(decimals);
  return (
    <span className={`fuel-price-change fuel-price-change--${rose ? 'up' : 'down'}`}>
      {rose ? '▲' : '▼'} {magnitude} {currency}
    </span>
  );
}
