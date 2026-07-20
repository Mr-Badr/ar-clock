// Legal basis: Saudi Personal Status Law (نظام الأحوال الشخصية، 1443/1444H) and its executive
// regulations. Real Saudi courts determine the exact amount case-by-case based on: the payer's
// financial capacity (solvent/insolvent), number of dependents, existing debts, housing situation,
// and other income sources — there is no single fixed formula. The ranges below are the commonly
// published estimation criteria (10-20%, sometimes up to 25%, per child of available income; a
// SAR 300/month floor per dependent; a combined cap of 50% of the payer's total income) — an
// ESTIMATE for planning purposes, not a binding calculation. The Ministry of Justice's own
// electronic calculator is embedded inside the authenticated Najiz lawsuit-filing flow, not a
// public standalone tool, so it cannot be reproduced exactly here — this mirrors the same
// estimate-only framing every real competitor in this space (manielaw-sa.com, hasbati.com) uses.
const MIN_SAR_PER_DEPENDENT = 300;
const PER_CHILD_LOW_RATIO = 0.10;
const PER_CHILD_HIGH_RATIO = 0.20;
const WIFE_LOW_RATIO = 0.10;
const WIFE_HIGH_RATIO = 0.15;
const TOTAL_INCOME_CAP_RATIO = 0.5;

/**
 * @param {{ payerMonthlyIncome: number, monthlyDebts: number, childrenCount: number,
 *   includeWifeMaintenance: boolean }} input
 */
export function computeNafaqahEstimate({
  payerMonthlyIncome,
  monthlyDebts,
  childrenCount,
  includeWifeMaintenance,
}) {
  const income = Math.max(0, Number(payerMonthlyIncome) || 0);
  if (income <= 0) return null;

  const debts = Math.max(0, Number(monthlyDebts) || 0);
  const children = Math.max(0, Math.floor(Number(childrenCount) || 0));
  const availableIncome = Math.max(0, income - debts);

  let childLow = children * availableIncome * PER_CHILD_LOW_RATIO;
  let childHigh = children * availableIncome * PER_CHILD_HIGH_RATIO;
  if (children > 0) {
    childLow = Math.max(childLow, children * MIN_SAR_PER_DEPENDENT);
    childHigh = Math.max(childHigh, childLow);
  }

  let wifeLow = 0;
  let wifeHigh = 0;
  if (includeWifeMaintenance) {
    wifeLow = Math.max(availableIncome * WIFE_LOW_RATIO, MIN_SAR_PER_DEPENDENT);
    wifeHigh = Math.max(availableIncome * WIFE_HIGH_RATIO, wifeLow);
  }

  const rawLow = childLow + wifeLow;
  const rawHigh = childHigh + wifeHigh;
  const cap = income * TOTAL_INCOME_CAP_RATIO;
  const isCapped = rawHigh > cap;

  const totalHigh = Math.min(rawHigh, cap);
  const totalLow = Math.min(rawLow, totalHigh);

  return {
    income,
    debts,
    availableIncome,
    children,
    includeWifeMaintenance,
    childLow: Math.round(childLow),
    childHigh: Math.round(childHigh),
    wifeLow: Math.round(wifeLow),
    wifeHigh: Math.round(wifeHigh),
    totalLow: Math.round(totalLow),
    totalHigh: Math.round(totalHigh),
    isCapped,
    cap: Math.round(cap),
  };
}
