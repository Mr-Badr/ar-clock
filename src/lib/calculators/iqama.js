/**
 * Iqama / visa expiry calculator.
 *
 * Covers the most common residence and visit permit types for Saudi Arabia and UAE.
 * All dates handled as Gregorian; Hijri display via getHijriParts() at call site.
 *
 * Fine rules (Saudi):
 *   - Iqama overstay: 100 SAR/day (max 50,000 SAR) — نظام الإقامة 2023
 *   - Exit/re-entry visa overstay: 100 SAR/day
 *   - Visit visa overstay: 100 SAR/day (tourist visa amnesty sometimes applies)
 * Fine rules (UAE):
 *   - Visa overstay: 50 AED/day for first 6 months, 100 AED/day after
 *
 * Reference: Saudi MOI — absher.sa; UAE GDRFA — gdrfa.gov.ae
 */

const MS_PER_DAY = 86_400_000;

export const VISA_TYPES = {
  // Saudi
  iqama_1yr: {
    id: 'iqama_1yr',
    label: 'إقامة سعودية — سنة',
    country: 'sa',
    durationDays: 365,
    graceDays: 0,
    finePerDay: 100,
    fineCurrency: 'SAR',
    renewalWarningDays: 60,
    hint: 'يُنصح بالتجديد قبل انتهاء الإقامة بـ 60 يوماً على الأقل.',
  },
  iqama_2yr: {
    id: 'iqama_2yr',
    label: 'إقامة سعودية — سنتان',
    country: 'sa',
    durationDays: 730,
    graceDays: 0,
    finePerDay: 100,
    fineCurrency: 'SAR',
    renewalWarningDays: 60,
    hint: 'يُنصح بالتجديد قبل انتهاء الإقامة بـ 60 يوماً على الأقل.',
  },
  visit_sa_90: {
    id: 'visit_sa_90',
    label: 'تأشيرة زيارة سعودية — 90 يوم',
    country: 'sa',
    durationDays: 90,
    graceDays: 0,
    finePerDay: 100,
    fineCurrency: 'SAR',
    renewalWarningDays: 14,
    hint: 'تأشيرة الزيارة غير قابلة للتمديد — يجب المغادرة قبل انتهائها.',
  },
  visit_sa_30: {
    id: 'visit_sa_30',
    label: 'تأشيرة عمرة / زيارة — 30 يوم',
    country: 'sa',
    durationDays: 30,
    graceDays: 0,
    finePerDay: 100,
    fineCurrency: 'SAR',
    renewalWarningDays: 7,
    hint: 'تأشيرة العمرة والزيارة القصيرة — الخروج إلزامي قبل انتهائها.',
  },
  // UAE
  uae_residence_2yr: {
    id: 'uae_residence_2yr',
    label: 'إقامة إماراتية — سنتان',
    country: 'ae',
    durationDays: 730,
    graceDays: 30,
    finePerDay: 50,
    fineCurrency: 'AED',
    renewalWarningDays: 60,
    hint: 'مهلة السماح بعد الانتهاء 30 يوماً ثم غرامة 50 درهم/يوم لأول 6 أشهر.',
  },
  uae_residence_3yr: {
    id: 'uae_residence_3yr',
    label: 'إقامة إماراتية — 3 سنوات',
    country: 'ae',
    durationDays: 1095,
    graceDays: 30,
    finePerDay: 50,
    fineCurrency: 'AED',
    renewalWarningDays: 60,
    hint: 'الإقامة الذهبية وبعض إقامات الكفالة تمتد 3 سنوات.',
  },
  visit_uae_30: {
    id: 'visit_uae_30',
    label: 'تأشيرة زيارة إماراتية — 30 يوم',
    country: 'ae',
    durationDays: 30,
    graceDays: 10,
    finePerDay: 50,
    fineCurrency: 'AED',
    renewalWarningDays: 7,
    hint: 'مهلة 10 أيام ثم غرامة 50 درهم/يوم.',
  },
  visit_uae_90: {
    id: 'visit_uae_90',
    label: 'تأشيرة زيارة إماراتية — 90 يوم',
    country: 'ae',
    durationDays: 90,
    graceDays: 10,
    finePerDay: 50,
    fineCurrency: 'AED',
    renewalWarningDays: 14,
    hint: 'مهلة 10 أيام ثم غرامة 50 درهم/يوم.',
  },
};

/**
 * Calculate iqama/visa status from issue date.
 *
 * @param {object} opts
 * @param {string}  opts.issueDate  — YYYY-MM-DD (Gregorian)
 * @param {string}  opts.visaTypeId — key in VISA_TYPES
 * @param {Date}    [opts.today]    — reference today (default: new Date())
 * @returns {object|null}
 */
export function calculateIqamaExpiry({ issueDate, visaTypeId, today = new Date() }) {
  if (!issueDate || !visaTypeId) return null;

  const issue = new Date(issueDate);
  issue.setHours(0, 0, 0, 0);
  if (isNaN(issue.getTime())) return null;

  const ref = new Date(today);
  ref.setHours(0, 0, 0, 0);

  const vt = VISA_TYPES[visaTypeId];
  if (!vt) return null;

  const expiry = new Date(issue.getTime() + vt.durationDays * MS_PER_DAY);
  const graceEnd = new Date(expiry.getTime() + vt.graceDays * MS_PER_DAY);

  const daysToExpiry = Math.round((expiry - ref) / MS_PER_DAY);
  const daysToGraceEnd = Math.round((graceEnd - ref) / MS_PER_DAY);
  const daysOverstayed = daysToGraceEnd < 0 ? Math.abs(daysToGraceEnd) : 0;

  let status;
  if (daysToExpiry > vt.renewalWarningDays) {
    status = 'valid';
  } else if (daysToExpiry > 0) {
    status = 'expiring_soon';
  } else if (daysToGraceEnd >= 0) {
    status = 'in_grace';
  } else {
    status = 'overstayed';
  }

  const estimatedFine = daysOverstayed > 0
    ? daysOverstayed * vt.finePerDay
    : 0;

  return {
    issueDate: issue,
    expiryDate: expiry,
    graceEndDate: graceEnd,
    daysToExpiry,
    daysToGraceEnd,
    daysOverstayed,
    estimatedFine,
    status,
    visaType: vt,
    isValid: true,
  };
}

export function getStatusMeta(status) {
  const map = {
    valid: { label: 'سارية', color: '#16a34a', bg: '#dcfce7', icon: '✓' },
    expiring_soon: { label: 'تنتهي قريباً', color: '#d97706', bg: '#fef3c7', icon: '⚠' },
    in_grace: { label: 'في مهلة السماح', color: '#ea580c', bg: '#ffedd5', icon: '⏳' },
    overstayed: { label: 'منتهية — مخالفة', color: '#dc2626', bg: '#fee2e2', icon: '✗' },
  };
  return map[status] ?? map.valid;
}
