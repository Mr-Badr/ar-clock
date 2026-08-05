/**
 * Domestic-worker / private-driver recruitment cost calculators — UAE, Kuwait, Qatar, Bahrain,
 * Oman. Saudi Arabia already has its own calculator + engine function
 * (`DOMESTIC_WORKER_GOV_FEES`/`calculateDomesticWorkerCost` in `./engine.js`) — not touched here.
 *
 * Every fee/figure below is sourced from `keyword-research/domestic-worker-cost/DECISION.md` §6
 * (a real primary-source verification pass, 2026-08-04). Each constant's source-confidence is
 * noted in its comment: "أساسي" (primary government source, confirmed) vs. "ثانوي" (secondary
 * source only — PRO-services blogs, competitor sites — presented as an editable estimate, never
 * a hard confirmed figure). Per docs/PLAN.md §2/§5 step 8: any number that isn't primary-source
 * confirmed must stay user-editable with a clear "قابل للتعديل" framing, not a locked default.
 */

// ─── UAE ──────────────────────────────────────────────────────────────────────
// Government fee: 100+100+100 AED (application + issuance + smart-service) — primary source
// (icp.gov.ae), but generic to all visa categories, not domestic-worker-specific. The Tadbeer/
// private-office package (5,000-17,000+ AED) is secondary-only (multiple PRO-services blogs
// agree on the range, no primary MOHRE/Tadbeer number found) — kept as an editable default.
export const UAE_GOV_VISA_FEE = 300; // أساسي (icp.gov.ae) — لكنه رسم تأشيرة عام لا خاص بالعمالة المنزلية تحديداً
export const UAE_DEFAULT_PACKAGE_FEE = 9000; // ثانوي — منتصف نطاق 5,000-17,000 درهم المتداول

export function calculateUaeDomesticWorkerCost({ monthlySalary, packageFee, contractYears = 2 }) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  const pkg = Math.max(0, Number(packageFee) || 0);
  const years = Math.max(1, Math.round(Number(contractYears) || 2));

  const oneTimeGovFee = UAE_GOV_VISA_FEE;
  const totalSalaryCost = round(salary * 12 * years);
  const grandTotal = round(oneTimeGovFee + pkg + totalSalaryCost);
  const firstYearCost = round(oneTimeGovFee + pkg + salary * 12);

  return {
    isValid: salary > 0,
    contractYears: years,
    oneTimeGovFee,
    packageFee: round(pkg),
    totalSalaryCost,
    grandTotal,
    firstYearCost,
  };
}

// ─── Kuwait ───────────────────────────────────────────────────────────────────
// Kafala-transfer fee via PAM's "Ashal" platform: 150 KWD — ثانوي (khaleejcalculators.com only,
// no primary PAM fee schedule fetched). Cabinet-set minimum wage 75 KWD/month (Ministerial
// Resolution 14/2017) — ثانوي (news citation, not the decree text itself) — used as a suggested
// editable default, never a locked minimum. Total recruitment estimate 700-1,500 KWD — ثانوي.
export const KUWAIT_KAFALA_TRANSFER_FEE = 150; // ثانوي
export const KUWAIT_DEFAULT_MIN_WAGE = 75; // ثانوي — القرار الوزاري 14/2017 (لم يُجلَب نص القرار مباشرة)
export const KUWAIT_DEFAULT_RECRUITMENT_FEE = 1100; // ثانوي — منتصف نطاق 700-1,500 دينار

export function calculateKuwaitDomesticWorkerCost({ monthlySalary, recruitmentFee, contractYears = 2 }) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  const fee = Math.max(0, Number(recruitmentFee) || 0);
  const years = Math.max(1, Math.round(Number(contractYears) || 2));

  const oneTimeGovFee = KUWAIT_KAFALA_TRANSFER_FEE;
  const totalSalaryCost = round(salary * 12 * years);
  const grandTotal = round(oneTimeGovFee + fee + totalSalaryCost);
  const firstYearCost = round(oneTimeGovFee + fee + salary * 12);

  return {
    isValid: salary > 0,
    contractYears: years,
    oneTimeGovFee,
    recruitmentFee: round(fee),
    totalSalaryCost,
    grandTotal,
    firstYearCost,
  };
}

// ─── Qatar ────────────────────────────────────────────────────────────────────
// Recruitment-fee CAPS by nationality — أساسي (Ministry of Commerce & Industry Decision No.
// 1/2022, price-cap committee, fetched directly). These are official MAXIMUMS, not necessarily
// the actual charged price — worded as such in the UI. Minimum wage 1,800 QAR (1,000 basic +
// 500 housing + 300 food, Law 17/2020) — شبه-أساسي (two independent quasi-official sources,
// original mol.gov.qa text unreachable this pass). Admin fee 500-1,000 QAR — ثانوي.
export const QATAR_NATIONALITY_CAPS = {
  indonesia: { label: 'إندونيسيا', cap: 17000 },
  srilanka: { label: 'سريلانكا', cap: 16000 },
  philippines: { label: 'الفلبين', cap: 15000 },
  bangladesh: { label: 'بنغلاديش', cap: 14000 },
  india: { label: 'الهند', cap: 14000 },
  kenya: { label: 'كينيا', cap: 9000 },
  ethiopia: { label: 'إثيوبيا', cap: 9000 },
};
export const QATAR_DEFAULT_MIN_WAGE = 1800; // شبه-أساسي — 1,000 أساسي + 500 سكن + 300 إعاشة
export const QATAR_DEFAULT_ADMIN_FEE = 750; // ثانوي — منتصف نطاق 500-1,000 ريال

export function calculateQatarDomesticWorkerCost({ monthlySalary, recruitmentFee, adminFee, contractYears = 2 }) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  const recruitment = Math.max(0, Number(recruitmentFee) || 0);
  const admin = Math.max(0, Number(adminFee) || 0);
  const years = Math.max(1, Math.round(Number(contractYears) || 2));

  const oneTimeFees = round(recruitment + admin);
  const totalSalaryCost = round(salary * 12 * years);
  const grandTotal = round(oneTimeFees + totalSalaryCost);
  const firstYearCost = round(oneTimeFees + salary * 12);

  return {
    isValid: salary > 0,
    contractYears: years,
    recruitmentFee: round(recruitment),
    adminFee: round(admin),
    totalSalaryCost,
    grandTotal,
    firstYearCost,
  };
}

// ─── Bahrain ──────────────────────────────────────────────────────────────────
// Work-permit fee schedule — أساسي، مؤكد من مصدرين رسميين مستقلين (lmra.gov.bh + bahrain.bh,
// آخر تحديث 23-01-2025): رسم شامل حسب مدة الطلب (جديد أو تجديد)، لا رسماً سنوياً منفصلاً.
export const BAHRAIN_PERMIT_FEES = {
  new1: { label: 'تصريح جديد — سنة واحدة', years: 1, fee: 86 },
  new2: { label: 'تصريح جديد — سنتان', years: 2, fee: 118 },
  renew0_5: { label: 'تجديد — 6 أشهر', years: 0.5, fee: 23.5 },
  renew1: { label: 'تجديد — سنة واحدة', years: 1, fee: 42 },
  renew2: { label: 'تجديد — سنتان', years: 2, fee: 79 },
};

export function calculateBahrainDomesticWorkerCost({ monthlySalary, recruitmentFee, permitKey = 'new2' }) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  const fee = Math.max(0, Number(recruitmentFee) || 0);
  const permit = BAHRAIN_PERMIT_FEES[permitKey] || BAHRAIN_PERMIT_FEES.new2;
  const years = permit.years;

  const totalSalaryCost = round(salary * 12 * years);
  const grandTotal = round(permit.fee + fee + totalSalaryCost);
  const firstYearSalary = round(salary * 12 * Math.min(1, years));

  return {
    isValid: salary > 0,
    permit,
    permitFee: permit.fee,
    recruitmentFee: round(fee),
    totalSalaryCost,
    grandTotal,
    firstYearCost: round(permit.fee + fee + firstYearSalary),
  };
}

// ─── Oman ─────────────────────────────────────────────────────────────────────
// Work-permit fee — أساسي، مصدر مباشر mol.gov.om (صفحة محدَّثة 04/08/2026): يعتمد على عدد
// العمال الحاليين لدى الكفيل (1-3 مقابل 4 فأكثر)، وليس على مدة العقد. الراتب المقترح
// (500-1,000 ريال عماني) ثانوي فقط — نطاق شائع غير مؤكد كحد رسمي.
export const OMAN_PERMIT_FEES = {
  upTo3: { label: '1 إلى 3 عمال لدى الكفيل', fee: 101 },
  fourPlus: { label: '4 عمال فأكثر لدى الكفيل', fee: 141 },
};
export const OMAN_DEFAULT_SALARY = 750; // ثانوي — منتصف نطاق 500-1,000 ريال عماني

export function calculateOmanDomesticWorkerCost({ monthlySalary, recruitmentFee, workerTier = 'upTo3', contractYears = 2 }) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  const fee = Math.max(0, Number(recruitmentFee) || 0);
  const years = Math.max(1, Math.round(Number(contractYears) || 2));
  const permit = OMAN_PERMIT_FEES[workerTier] || OMAN_PERMIT_FEES.upTo3;

  const totalSalaryCost = round(salary * 12 * years);
  const grandTotal = round(permit.fee + fee + totalSalaryCost);
  const firstYearCost = round(permit.fee + fee + salary * 12);

  return {
    isValid: salary > 0,
    contractYears: years,
    permit,
    permitFee: permit.fee,
    recruitmentFee: round(fee),
    totalSalaryCost,
    grandTotal,
    firstYearCost,
  };
}

function round(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
