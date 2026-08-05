// ZATCA e-invoicing Phase 2 (integration/"الربط والتكامل") wave thresholds — Saudi-only, real
// regulatory data. Waves proceed largest-revenue-first; each new wave lowers the threshold,
// pulling in progressively smaller businesses. Sourced 2026-08-02 (see
// keyword-research/ecommerce-hub/DECISION.md for the full source list) — re-verify before reusing
// this file in a future session, since ZATCA announces new waves periodically and this list will
// go stale. Revenue figures are "الإيرادات الخاضعة لضريبة القيمة المضافة" (VAT-subject revenue)
// in SAR, checked against 2022/2023/2024/2025 (the specific eligible years vary slightly per
// wave per the official announcement — captured per-wave below where confirmed).
export const ZATCA_WAVES = [
  { wave: 25, thresholdSar: 187_500, years: [2022, 2023, 2024, 2025], deadline: '2027-02-01', deadlineLabel: '1 فبراير 2027', status: 'current' },
  { wave: 24, thresholdSar: 375_000, years: [2022, 2023, 2024], deadline: '2026-06-30', deadlineLabel: '30 يونيو 2026', status: 'passed' },
];

// Sorted ascending by threshold so the first match (smallest threshold the revenue still clears)
// is the correct (earliest-eligible, i.e. most inclusive) wave.
const WAVES_ASC = [...ZATCA_WAVES].sort((a, b) => a.thresholdSar - b.thresholdSar);

export function resolveZatcaWave(revenueSar) {
  const revenue = Number(revenueSar);
  if (!Number.isFinite(revenue) || revenue <= 0) return null;
  const match = WAVES_ASC.find((w) => revenue > w.thresholdSar);
  return match || null;
}
