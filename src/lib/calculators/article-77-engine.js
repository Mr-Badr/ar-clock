// Article 77 of the Saudi Labor Law (نظام العمل، المادة 77) — compensation for contract
// termination by the employer without a lawful reason under Article 74/76.
//
// Verified formula (cross-checked 2026-08-03 against the article's literal text quoted by
// multiple independent law-firm sources, e.g. sukook.com.sa, elmokhtarlaw.com):
//   - Indefinite-term contract: 15 days' wage for each year of service.
//   - Fixed-term contract: wage for the remaining contract period.
//   - Both: compensation must not be less than 2 months' wage — this floor is stated inside
//     Article 77 itself, not a separate rule (confirmed via direct quote of the article text).
// The article gives no explicit rounding rule for partial years, so partial service is prorated
// proportionally (totalDays / 365) — disclosed to the reader as an estimate, not an exact
// entitlement, per the standing "استرشادي وليس استشارة قانونية" rule for legal calculators.

const DAY_MS = 86400000;

function parseDateInput(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function diffDays(startValue, endValue) {
  const start = parseDateInput(startValue);
  const end = parseDateInput(endValue);
  if (!start || !end || end <= start) return null;
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS);
}

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function calculateArticle77Compensation({
  contractType,
  monthlyWage,
  startDate,
  endDate,
  remainingMonths,
}) {
  const wage = Math.max(0, Number(monthlyWage) || 0);
  if (!wage) {
    return { isValid: false };
  }
  const minimumFloor = round(wage * 2);

  if (contractType === 'fixed') {
    const months = Math.max(0, Number(remainingMonths) || 0);
    if (!months) return { isValid: false };
    const raw = round(wage * months);
    const final = Math.max(raw, minimumFloor);
    return {
      isValid: true,
      contractType: 'fixed',
      wage,
      remainingMonths: months,
      raw,
      minimumFloor,
      final,
      flooredByMinimum: final > raw,
    };
  }

  const totalDays = diffDays(startDate, endDate);
  if (totalDays == null || totalDays <= 0) return { isValid: false };
  const dailyWage = wage / 30;
  const years = totalDays / 365;
  const raw = round(dailyWage * 15 * years);
  const final = Math.max(raw, minimumFloor);
  return {
    isValid: true,
    contractType: 'open',
    wage,
    totalDays,
    years: round(years, 2),
    raw,
    minimumFloor,
    final,
    flooredByMinimum: final > raw,
  };
}
