/**
 * Net salary calculation after GOSI (social insurance) deductions.
 *
 * Saudi GOSI rates (as of 2024 — Resolution 1/8/2021):
 *   Saudi nationals:     employee 9%, employer 12.5%  → total 21.5%
 *   Non-Saudi employees: employee 0%, employer 2%     → only work-injury (hazard)
 *
 * Contribution base = basic salary + housing allowance (الراتب الأساسي + بدل السكن)
 * Maximum insurable wage (wage ceiling): 45,000 SAR/month
 *
 * Reference: GOSI.gov.sa — نظام التأمينات الاجتماعية
 */

export const GOSI_RATES = {
  saudi: {
    employee: 0.09,
    employer: 0.125,
    label: 'سعودي الجنسية',
    note: '9% من الراتب الخاضع للتأمين',
  },
  nonSaudi: {
    employee: 0,
    employer: 0.02,
    label: 'غير سعودي',
    note: 'لا يُخصم من الموظف — التزام صاحب العمل فقط',
  },
};

export const GOSI_WAGE_CEILING = 45000;

/**
 * @param {object} opts
 * @param {number|string} opts.basicSalary        — الراتب الأساسي (SAR/month)
 * @param {number|string} [opts.housingAllowance] — بدل السكن (default 0)
 * @param {number|string} [opts.otherAllowances]  — بدلات أخرى (لا تدخل وعاء التأمين)
 * @param {'saudi'|'nonSaudi'} [opts.nationality] — جنسية الموظف
 * @returns {object|null}
 */
export function calculateNetSalary({
  basicSalary,
  housingAllowance = 0,
  otherAllowances = 0,
  nationality = 'saudi',
}) {
  const basic = Math.max(0, parseFloat(basicSalary) || 0);
  const housing = Math.max(0, parseFloat(housingAllowance) || 0);
  const other = Math.max(0, parseFloat(otherAllowances) || 0);

  if (basic === 0) return null;

  const grossSalary = basic + housing + other;

  // GOSI base is capped at the wage ceiling
  const gosiBase = Math.min(basic + housing, GOSI_WAGE_CEILING);
  const rates = GOSI_RATES[nationality] ?? GOSI_RATES.saudi;

  const gosiEmployee = Math.round(gosiBase * rates.employee * 100) / 100;
  const gosiEmployer = Math.round(gosiBase * rates.employer * 100) / 100;

  const netSalary = Math.round((grossSalary - gosiEmployee) * 100) / 100;

  return {
    grossSalary,
    basic,
    housing,
    other,
    gosiBase,
    gosiEmployee,
    gosiEmployer,
    netSalary,
    gosiRate: rates,
    isCapped: (basic + housing) > GOSI_WAGE_CEILING,
    isValid: true,
  };
}

export function formatSAR(value) {
  return new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
