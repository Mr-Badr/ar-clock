/**
 * Iqama / visa expiry calculator.
 *
 * Covers the most common residence and visit permit types for Saudi Arabia and UAE.
 * All dates handled as Gregorian; Hijri display via getHijriParts() at call site.
 *
 * Fine rules (Saudi) — نظام الإقامة، وزارة الداخلية:
 *   - Iqama (residence) overstay: 100 SAR/day, capped at 50,000 SAR total
 *   - Visit / Umrah visa overstay: 100 SAR/day, no published cap
 * Fine rules (UAE) — الهيئة الاتحادية للهوية والجنسية (ICP) / GDRFA:
 *   - Overstay fine: 50 AED/day for the first 180 days after the grace period ends,
 *     then 100 AED/day for every day after that
 *
 * Reference: Saudi MOI — absher.sa; UAE GDRFA/ICP — gdrfa.gov.ae, icp.gov.ae
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
    fineCapAmount: 50000,
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
    fineCapAmount: 50000,
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
    fineCapAmount: null,
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
    fineCapAmount: null,
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
    fineTier2PerDay: 100,
    fineTier1Days: 180,
    fineCurrency: 'AED',
    renewalWarningDays: 60,
    hint: 'مهلة السماح بعد الانتهاء 30 يوماً، ثم غرامة 50 درهم/يوم لأول 180 يوماً و100 درهم/يوم بعدها.',
  },
  uae_residence_3yr: {
    id: 'uae_residence_3yr',
    label: 'إقامة إماراتية — 3 سنوات',
    country: 'ae',
    durationDays: 1095,
    graceDays: 30,
    finePerDay: 50,
    fineTier2PerDay: 100,
    fineTier1Days: 180,
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
    fineTier2PerDay: 100,
    fineTier1Days: 180,
    fineCurrency: 'AED',
    renewalWarningDays: 7,
    hint: 'مهلة 10 أيام بعد الانتهاء، ثم غرامة 50 درهم/يوم لأول 180 يوماً.',
  },
  visit_uae_90: {
    id: 'visit_uae_90',
    label: 'تأشيرة زيارة إماراتية — 90 يوم',
    country: 'ae',
    durationDays: 90,
    graceDays: 10,
    finePerDay: 50,
    fineTier2PerDay: 100,
    fineTier1Days: 180,
    fineCurrency: 'AED',
    renewalWarningDays: 14,
    hint: 'مهلة 10 أيام بعد الانتهاء، ثم غرامة 50 درهم/يوم لأول 180 يوماً.',
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

  const { estimatedFine, fineBreakdown, fineCapped } = calculateOverstayFine(vt, daysOverstayed);

  return {
    issueDate: issue,
    expiryDate: expiry,
    graceEndDate: graceEnd,
    daysToExpiry,
    daysToGraceEnd,
    daysOverstayed,
    estimatedFine,
    fineBreakdown,
    fineCapped,
    fineCapAmount: vt.fineCapAmount || null,
    status,
    visaType: vt,
    isValid: true,
  };
}

function calculateOverstayFine(vt, daysOverstayed) {
  if (daysOverstayed <= 0) {
    return { estimatedFine: 0, fineBreakdown: [], fineCapped: false };
  }

  // Two-tier fine (UAE): 50/day for the first N days, higher rate after.
  if (vt.fineTier2PerDay) {
    const tier1Days = Math.min(daysOverstayed, vt.fineTier1Days);
    const tier2Days = Math.max(daysOverstayed - vt.fineTier1Days, 0);
    const fineBreakdown = [];
    if (tier1Days > 0) {
      fineBreakdown.push({
        label: `أول ${vt.fineTier1Days} يوماً`,
        days: tier1Days,
        rate: vt.finePerDay,
        amount: tier1Days * vt.finePerDay,
      });
    }
    if (tier2Days > 0) {
      fineBreakdown.push({
        label: `بعد ${vt.fineTier1Days} يوماً`,
        days: tier2Days,
        rate: vt.fineTier2PerDay,
        amount: tier2Days * vt.fineTier2PerDay,
      });
    }
    const estimatedFine = fineBreakdown.reduce((sum, row) => sum + row.amount, 0);
    return { estimatedFine, fineBreakdown, fineCapped: false };
  }

  // Flat-rate fine (Saudi), optionally capped.
  let estimatedFine = daysOverstayed * vt.finePerDay;
  let fineCapped = false;
  if (vt.fineCapAmount && estimatedFine > vt.fineCapAmount) {
    estimatedFine = vt.fineCapAmount;
    fineCapped = true;
  }
  const fineBreakdown = [{
    label: `${daysOverstayed} يوم تجاوز`,
    days: daysOverstayed,
    rate: vt.finePerDay,
    amount: daysOverstayed * vt.finePerDay,
  }];

  return { estimatedFine, fineBreakdown, fineCapped };
}

export function getStatusMeta(status) {
  const map = {
    valid: { label: 'الإقامة سارية', tone: 'success' },
    expiring_soon: { label: 'تنتهي قريباً', tone: 'warning' },
    in_grace: { label: 'في مهلة السماح', tone: 'warning' },
    overstayed: { label: 'منتهية — تجاوز', tone: 'danger' },
  };
  return map[status] ?? map.valid;
}
