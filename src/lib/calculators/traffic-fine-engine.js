// Saudi traffic violation early-payment discount (المادة 75 من نظام المرور) — verified
// 2026-08-03 against multiple 2026-dated Arabic news sources (sabq.org, almamlakatv.com,
// sadasaudi.net) after finding two commonly-cited but WRONG figures: the "50% discount" was a
// one-time amnesty on accumulated violations that ended 2025-04-18 and was not renewed, and a
// "30% discount before 17 Feb 2026" belongs to JORDAN's traffic system (pm.gov.jo), not Saudi —
// confirmed by re-checking each source's actual country before using it. The real STANDING rule:
//   - 25% discount on an individual violation if paid within 45 days of its registration date.
//   - 9 violation categories are excluded from this discount (see EXCLUDED_CATEGORIES below).
//   - Installment via Absher: 3-12 months, must be requested within 90 days of registration.
// This calculator only models the standing 45-day/25% rule — NOT the ambiguous "30 extra days
// within a 90-day deferral" edge case some sources mention without full clarity, to avoid
// stating a specific number we can't verify precisely.

export const EXCLUDED_CATEGORIES = [
  'التفحيط أو القيادة المتهورة المعرّضة لحياة الآخرين',
  'حوادث جسيمة (إصابة أو وفاة)',
  'مخالفات مدارس تعليم القيادة',
  'مخالفات وزن أو أبعاد المركبة والفحص الدوري',
  'مخالفات ورش الصيانة',
  'مخالفات إصدار رخص القيادة الدولية',
  'مخالفات تستوجب حجز الرخصة',
  'مخالفات معارض السيارات',
  'بيع أو التصرف بمركبة سعودية خارج المملكة دون نظام',
];

const DAY_MS = 86400000;
const DISCOUNT_WINDOW_DAYS = 45;
const DISCOUNT_RATE = 0.25;

function parseDateInput(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function calculateTrafficFineDiscount({ amount, violationDate, todayIso, isExcludedType, installmentMonths }) {
  const total = Math.max(0, Number(amount) || 0);
  const violation = parseDateInput(violationDate);
  const today = parseDateInput(todayIso) || new Date();
  if (!total || !violation || violation > today) {
    return { isValid: false };
  }

  const daysSince = Math.floor((today.getTime() - violation.getTime()) / DAY_MS);
  const withinWindow = daysSince <= DISCOUNT_WINDOW_DAYS;
  const eligible = withinWindow && !isExcludedType;

  const discountAmount = eligible ? round(total * DISCOUNT_RATE) : 0;
  const payableNow = eligible ? round(total - discountAmount) : total;

  const months = Math.min(12, Math.max(1, Number(installmentMonths) || 1));
  const monthlyInstallment = round(total / months);

  return {
    isValid: true,
    total,
    daysSince,
    withinWindow,
    isExcludedType: Boolean(isExcludedType),
    eligible,
    discountAmount,
    payableNow,
    daysLeft: withinWindow ? DISCOUNT_WINDOW_DAYS - daysSince : 0,
    installmentMonths: months,
    monthlyInstallment,
  };
}
