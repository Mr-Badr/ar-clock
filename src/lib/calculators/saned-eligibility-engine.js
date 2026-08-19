/**
 * SANED (ساند) — Saudi unemployment insurance eligibility + registration-deadline logic.
 * Saudi-specific only (GOSI-administered system, no Gulf-wide equivalent) — see
 * `.claude/rules/event-creation-lessons.md` / `calculator-ui-standards.md` §0a: government-scheme
 * tools stay country-specific, never generalized.
 *
 * Every figure sourced directly from GOSI's official pages (WebFetch-verified 2026-08-18, not a
 * search-summary paraphrase):
 * - https://www.gosi.gov.sa/GOSIOnline/Unemployment_Insurance_(SANED)?locale=ar_SA
 * - https://www.gosi.gov.sa/GOSIOnline/(en_US)__FAQ_Unemployment_Insurance_(SANED)
 *
 * Real Keyword Planner data (2026-08-18) showed the actual search intent is 100% eligibility/
 * registration ("شروط استحقاق ساند", "طريقة التسجيل في ساند"), not amount calculation — every
 * "حاسبة راتب ساند"-style phrase came back with zero measurable volume, and a real deep
 * competitor (ksatools.com/tools/saned-calculator) already owns the amount-calculator angle with
 * article citations and worked examples. This engine centers on eligibility + the 90-day
 * registration deadline (a stateful countdown, on-brand for a time/date utility site) and keeps
 * the compensation estimate as a light secondary feature only.
 */

// Contribution-period requirement scales with how many times SANED has been claimed before.
export const CONTRIBUTION_REQUIREMENTS = [
  { claimNumber: 1, requiredMonths: 12, windowMonths: 36, label: 'المرة الأولى' },
  { claimNumber: 2, requiredMonths: 18, windowMonths: 36, label: 'المرة الثانية' },
  { claimNumber: 3, requiredMonths: 24, windowMonths: 36, label: 'المرة الثالثة' },
  { claimNumber: 4, requiredMonths: 36, windowMonths: 48, label: 'الرابعة أو أكثر' },
];

export const REGISTRATION_DEADLINE_DAYS = 90;
export const MAX_BENEFIT_MONTHS = 12;
export const MAX_AGE = 60;

// Compensation tiers (secondary feature — see file header). Caps are real GOSI-published ceilings.
export const COMPENSATION_TIERS = [
  { fromMonth: 1, toMonth: 3, rate: 0.6, cap: 9000 },
  { fromMonth: 4, toMonth: 12, rate: 0.5, cap: 7500 },
];

export function getContributionRequirement(claimNumber) {
  const n = Math.max(1, Number(claimNumber) || 1);
  return CONTRIBUTION_REQUIREMENTS.find((r) => r.claimNumber === Math.min(n, 4))
    || CONTRIBUTION_REQUIREMENTS[CONTRIBUTION_REQUIREMENTS.length - 1];
}

/**
 * jobLossReason: 'endOfContract' | 'employerTerminatedNoFault' | 'resigned' | 'disciplinaryDismissal'
 * Only the first two count as "involuntary" per GOSI's own language (لا استقالة ولا فصل تأديبي بسببك).
 */
export function isInvoluntaryJobLoss(jobLossReason) {
  return jobLossReason === 'endOfContract' || jobLossReason === 'employerTerminatedNoFault';
}

export function checkSanedEligibility({
  isSaudi,
  age,
  jobLossReason,
  hasOtherIncome,
  ableToWork,
  claimNumber,
  contributedMonths,
}) {
  const involuntary = isInvoluntaryJobLoss(jobLossReason);
  const ageOk = Number(age) > 0 && Number(age) < MAX_AGE;
  const requirement = getContributionRequirement(claimNumber);
  const contributionOk = Math.max(0, Number(contributedMonths) || 0) >= requirement.requiredMonths;

  const checks = [
    { id: 'nationality', ok: !!isSaudi, label: 'الجنسية السعودية' },
    { id: 'age', ok: ageOk, label: `العمر أقل من ${MAX_AGE} سنة` },
    { id: 'involuntary', ok: involuntary, label: 'فقدان العمل خارج إرادتك (لا استقالة، لا فصل تأديبي)' },
    { id: 'noIncome', ok: !hasOtherIncome, label: 'لا يوجد دخل من عمل أو نشاط خاص آخر' },
    { id: 'ableToWork', ok: !!ableToWork, label: 'قادر على العمل' },
    { id: 'contribution', ok: contributionOk, label: `${requirement.requiredMonths} شهر اشتراك على الأقل خلال آخر ${requirement.windowMonths} شهراً` },
  ];

  const passedCount = checks.filter((c) => c.ok).length;
  const eligible = checks.every((c) => c.ok);

  return { eligible, checks, passedCount, total: checks.length, requirement };
}

/**
 * jobLossDate: JS Date (or null if not provided yet).
 * Returns registration-deadline status relative to today.
 */
export function getRegistrationDeadline(jobLossDate, today = new Date()) {
  if (!(jobLossDate instanceof Date) || Number.isNaN(jobLossDate.getTime())) return null;
  const deadline = new Date(jobLossDate.getTime());
  deadline.setDate(deadline.getDate() + REGISTRATION_DEADLINE_DAYS);
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / msPerDay);
  return {
    deadline,
    daysRemaining,
    isPastDeadline: daysRemaining < 0,
    isUrgent: daysRemaining >= 0 && daysRemaining <= 14,
  };
}

/** Secondary feature — rough compensation estimate. Not the tool's centerpiece (see file header). */
export function estimateSanedCompensation(monthlySalary) {
  const salary = Math.max(0, Number(monthlySalary) || 0);
  if (!salary) return null;
  return COMPENSATION_TIERS.map((tier) => ({
    ...tier,
    monthlyAmount: Math.min(salary * tier.rate, tier.cap),
  }));
}
