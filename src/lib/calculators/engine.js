import { VAT_COUNTRIES } from '@/lib/calculators/data';
import { DEFAULT_GLOBAL_CURRENCY } from '@/lib/calculators/currency-options';

const ARABIC_LATIN_LOCALE = 'ar-u-nu-latn';
const DAY_MS = 24 * 60 * 60 * 1000;

function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/[,\s]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function round(value, digits = 2) {
  const factor = 10 ** digits;
  return Math.round((toNumber(value) + Number.EPSILON) * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseDateInput(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

function daysInMonthUTC(year, monthIndex) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function addMonths(dateValue, monthsToAdd) {
  const date = parseDateInput(dateValue);
  if (!date) return null;

  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + monthsToAdd);
  const maxDay = daysInMonthUTC(result.getUTCFullYear(), result.getUTCMonth());
  result.setUTCDate(Math.min(originalDay, maxDay));

  return result.toISOString().slice(0, 10);
}

function formatArabicDurationUnit(value, singularLabel, dualLabel, pluralLabel) {
  if (!value) return null;
  if (value === 1) return `${formatNumber(value)} ${singularLabel}`;
  if (value === 2) return `${formatNumber(value)} ${dualLabel}`;
  return `${formatNumber(value)} ${pluralLabel}`;
}

function formatServiceDuration(service) {
  if (!service?.isValid) return '';

  const parts = [
    formatArabicDurationUnit(service.years, 'سنة', 'سنتان', 'سنوات'),
    formatArabicDurationUnit(service.months, 'شهر', 'شهران', 'أشهر'),
    formatArabicDurationUnit(service.days, 'يوم', 'يومان', 'أيام'),
  ].filter(Boolean);

  if (!parts.length) return 'أقل من يوم';
  if (parts.length === 1) return parts[0];

  return `${parts.slice(0, -1).join(' و')} و${parts[parts.length - 1]}`;
}

function diffDates(startValue, endValue) {
  const start = parseDateInput(startValue);
  const end = parseDateInput(endValue);

  if (!start || !end || end < start) {
    return {
      isValid: false,
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      decimalYears: 0,
    };
  }

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += previousMonth.getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / DAY_MS);

  return {
    isValid: true,
    years,
    months,
    days,
    totalDays,
    decimalYears: totalDays / 365.2425,
  };
}

export function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(ARABIC_LATIN_LOCALE, {
    maximumFractionDigits: 2,
    ...options,
  }).format(toNumber(value));
}

export function formatCurrency(value, currency = DEFAULT_GLOBAL_CURRENCY) {
  return new Intl.NumberFormat(ARABIC_LATIN_LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));
}

export function formatPercent(value, digits = 1) {
  return `${formatNumber(value, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatDateArabic(value) {
  const parsed = parseDateInput(value);
  if (!parsed) return '';

  return new Intl.DateTimeFormat(ARABIC_LATIN_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export function getVatCountry(code) {
  return VAT_COUNTRIES.find((country) => country.code === code) || VAT_COUNTRIES[0];
}

export function getEndOfServiceBracket(serviceYears) {
  if (serviceYears < 2) return { label: 'أقل من سنتين', multiplier: 0 };
  if (serviceYears < 5) return { label: 'من سنتين إلى أقل من 5 سنوات', multiplier: 1 / 3 };
  if (serviceYears < 10) return { label: 'من 5 إلى أقل من 10 سنوات', multiplier: 2 / 3 };
  return { label: '10 سنوات فأكثر', multiplier: 1 };
}

export function calculateEndOfServiceBenefit({
  salary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const basicSalary = Math.max(0, toNumber(salary));
  const service = diffDates(startDate, endDate);

  if (!basicSalary || !service.isValid) {
    return {
      isValid: false,
      salary: basicSalary,
      service,
      fullAward: 0,
      award: 0,
      entitlementPercent: 0,
    };
  }

  const firstFiveYears = Math.min(service.decimalYears, 5);
  const remainingYears = Math.max(service.decimalYears - 5, 0);
  const firstFiveAmount = basicSalary * 0.5 * firstFiveYears;
  const remainingAmount = basicSalary * remainingYears;
  const fullAward = firstFiveAmount + remainingAmount;

  const resignationBracket = getEndOfServiceBracket(service.decimalYears);
  const multiplier =
    reason === 'resignation'
      ? resignationBracket.multiplier
      : 1;

  const award = fullAward * multiplier;
  const entitlementPercent = round(multiplier * 100, 1);
  const wholeYearsAmount =
    Math.min(service.years, 5) * basicSalary * 0.5 +
    Math.max(service.years - 5, 0) * basicSalary;
  const partialAmount = Math.max(fullAward - wholeYearsAmount, 0);

  return {
    isValid: true,
    salary: basicSalary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    firstFiveYears,
    remainingYears,
    firstFiveAmount: round(firstFiveAmount),
    remainingAmount: round(remainingAmount),
    partialAmount: round(partialAmount),
    fullAward: round(fullAward),
    award: round(award),
    entitlementPercent,
    resignationBracket,
  };
}

export function buildEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  reason = 'resignation',
  waitMonths = 0,
}) {
  const current = calculateEndOfServiceBenefit({ salary, startDate, endDate, reason });
  const projectedEndDate = addMonths(endDate, waitMonths);
  const projected = projectedEndDate
    ? calculateEndOfServiceBenefit({ salary, startDate, endDate: projectedEndDate, reason })
    : { isValid: false, award: 0 };

  return {
    current,
    projected,
    projectedEndDate,
    difference: round(projected.award - current.award),
  };
}

export function buildEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 2, label: 'ثلث المكافأة عند الاستقالة' },
    { years: 5, label: 'ثلثان عند الاستقالة' },
    { years: 10, label: 'المكافأة كاملة عند الاستقالة' },
  ];

  return milestones.map((item) => ({
    ...item,
    date: addMonths(startDate, item.years * 12),
  }));
}

function addMonthsFromReference(referenceDateIso, monthsToAdd) {
  if (!referenceDateIso) return null;
  const months = Math.max(0, Math.round(toNumber(monthsToAdd)));
  const now = new Date(referenceDateIso);
  if (Number.isNaN(now.getTime())) return null;
  const target = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth() + months,
    now.getUTCDate(),
  ));

  return target.toISOString().slice(0, 10);
}

export function calculateEmergencyFund({
  monthlyExpenses,
  targetMonths = 3,
  currentSavings = 0,
  monthlyContribution = 0,
  referenceDateIso = null,
}) {
  const expenses = Math.max(0, toNumber(monthlyExpenses));
  const months = Math.max(1, Math.round(toNumber(targetMonths)));
  const current = Math.max(0, toNumber(currentSavings));
  const contribution = Math.max(0, toNumber(monthlyContribution));
  const targetAmount = round(expenses * months);
  const remainingAmount = round(Math.max(targetAmount - current, 0));
  const coverageMonths = expenses > 0 ? current / expenses : 0;
  const progressPercent = targetAmount > 0 ? clamp((current / targetAmount) * 100, 0, 100) : 0;
  const monthsToGoal = remainingAmount === 0
    ? 0
    : contribution > 0
      ? Math.ceil(remainingAmount / contribution)
      : null;

  let status = 'ضعيف';
  if (progressPercent >= 100 || coverageMonths >= months) status = 'ممتاز';
  else if (progressPercent >= 50 || coverageMonths >= Math.min(months, 3)) status = 'جيد';

  return {
    isValid: expenses > 0,
    monthlyExpenses: expenses,
    targetMonths: months,
    currentSavings: current,
    monthlyContribution: contribution,
    targetAmount,
    remainingAmount,
    coverageMonths: round(coverageMonths, 1),
    progressPercent: round(progressPercent, 1),
    monthsToGoal,
    targetDate: monthsToGoal === null ? null : addMonthsFromReference(referenceDateIso, monthsToGoal),
    recommendedRange: months <= 3 ? 'حد أدنى مقبول' : months <= 6 ? 'منطقة آمنة شائعة' : 'حماية عالية',
    status,
  };
}

function computeSavingsPayment(goalAmount, currentSavings, months, annualReturn) {
  const goal = Math.max(0, toNumber(goalAmount));
  const current = Math.max(0, toNumber(currentSavings));
  const totalMonths = Math.max(1, Math.round(toNumber(months)));
  const monthlyRate = Math.max(0, toNumber(annualReturn)) / 1200;

  const grownCurrent = current * ((1 + monthlyRate) ** totalMonths);
  if (grownCurrent >= goal) return 0;

  if (monthlyRate === 0) {
    return (goal - current) / totalMonths;
  }

  const annuityFactor = (((1 + monthlyRate) ** totalMonths) - 1) / monthlyRate;
  if (annuityFactor <= 0) return 0;

  return (goal - grownCurrent) / annuityFactor;
}

export function calculateSavingsGoal({
  goalAmount,
  currentSavings = 0,
  months = 12,
  annualReturn = 0,
  referenceDateIso = null,
}) {
  const goal = Math.max(0, toNumber(goalAmount));
  const current = Math.max(0, toNumber(currentSavings));
  const totalMonths = Math.max(1, Math.round(toNumber(months)));
  const returnRate = Math.max(0, toNumber(annualReturn));
  const monthlyRequired = round(Math.max(0, computeSavingsPayment(goal, current, totalMonths, returnRate)));
  const weeklyRequired = round((monthlyRequired * 12) / 52);
  const extraSixMonths = totalMonths + 6;
  const monthlyRequiredExtended = round(Math.max(0, computeSavingsPayment(goal, current, extraSixMonths, returnRate)));
  const gapNow = round(Math.max(goal - current, 0));

  return {
    isValid: goal > 0,
    goalAmount: goal,
    currentSavings: current,
    months: totalMonths,
    annualReturn: returnRate,
    gapNow,
    monthlyRequired,
    weeklyRequired,
    targetDate: addMonthsFromReference(referenceDateIso, totalMonths),
    monthlyRequiredExtended,
    monthlyDifferenceIfExtended: round(Math.max(monthlyRequired - monthlyRequiredExtended, 0)),
  };
}

export function calculateNetWorth({
  cash = 0,
  investments = 0,
  properties = 0,
  otherAssets = 0,
  loans = 0,
  creditCards = 0,
  otherLiabilities = 0,
}) {
  const assetEntries = [
    { key: 'cash', label: 'النقد والمدخرات', value: Math.max(0, toNumber(cash)) },
    { key: 'investments', label: 'الاستثمارات', value: Math.max(0, toNumber(investments)) },
    { key: 'properties', label: 'الممتلكات', value: Math.max(0, toNumber(properties)) },
    { key: 'otherAssets', label: 'أصول أخرى', value: Math.max(0, toNumber(otherAssets)) },
  ];
  const liabilityEntries = [
    { key: 'loans', label: 'القروض', value: Math.max(0, toNumber(loans)) },
    { key: 'creditCards', label: 'بطاقات الائتمان', value: Math.max(0, toNumber(creditCards)) },
    { key: 'otherLiabilities', label: 'التزامات أخرى', value: Math.max(0, toNumber(otherLiabilities)) },
  ];

  const totalAssets = round(assetEntries.reduce((sum, item) => sum + item.value, 0));
  const totalLiabilities = round(liabilityEntries.reduce((sum, item) => sum + item.value, 0));
  const netWorth = round(totalAssets - totalLiabilities);
  const liabilitiesRatio = totalAssets > 0 ? round((totalLiabilities / totalAssets) * 100, 1) : 0;

  let status = 'تحتاج خطة';
  let nextStep = 'ابدأ بحصر أصولك والتزاماتك بوضوح ثم خفف الديون الأعلى كلفة أولاً.';
  if (netWorth >= 0 && liabilitiesRatio <= 35) {
    status = 'جيد';
    nextStep = 'حافظ على نمو الأصول المنتجة وراجع توزيع السيولة والطوارئ بانتظام.';
  }
  if (netWorth > 0 && liabilitiesRatio <= 20) {
    status = 'ممتاز';
    nextStep = 'أنت في وضع مريح نسبياً. ركز الآن على زيادة الأصول طويلة الأجل وتحسين العائد.';
  }

  return {
    isValid: totalAssets > 0 || totalLiabilities > 0,
    assetEntries,
    liabilityEntries,
    totalAssets,
    totalLiabilities,
    netWorth,
    liabilitiesRatio,
    status,
    nextStep,
  };
}

function normalizeDebtItems(debts = []) {
  return debts
    .map((debt, index) => ({
      id: debt.id || `debt-${index + 1}`,
      name: debt.name || `دين ${index + 1}`,
      balance: Math.max(0, toNumber(debt.balance)),
      annualRate: Math.max(0, toNumber(debt.annualRate)),
      minimumPayment: Math.max(0, toNumber(debt.minimumPayment)),
    }))
    .filter((debt) => debt.balance > 0 && debt.minimumPayment > 0);
}

function sortDebtIndexes(items, method) {
  return items
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => {
      if (method === 'avalanche') {
        if (b.annualRate !== a.annualRate) return b.annualRate - a.annualRate;
        return a.balance - b.balance;
      }
      if (a.balance !== b.balance) return a.balance - b.balance;
      return b.annualRate - a.annualRate;
    })
    .map((item) => item.index);
}

export function simulateDebtPayoff({
  debts = [],
  extraPayment = 0,
  method = 'snowball',
  referenceDateIso = null,
}) {
  const normalizedDebts = normalizeDebtItems(debts);
  if (!normalizedDebts.length) {
    return {
      isValid: false,
      months: 0,
      totalInterest: 0,
      payoffDate: null,
      debts: [],
    };
  }

  const totalBudget = normalizedDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0) + Math.max(0, toNumber(extraPayment));
  const working = normalizedDebts.map((debt) => ({ ...debt }));
  const debtSnapshots = [];
  let totalInterest = 0;
  let months = 0;

  while (months < 600 && working.some((debt) => debt.balance > 0.01)) {
    months += 1;
    working.forEach((debt) => {
      if (debt.balance <= 0) return;
      const interest = debt.balance * (debt.annualRate / 100 / 12);
      debt.balance += interest;
      totalInterest += interest;
    });

    const active = working.filter((debt) => debt.balance > 0.01);
    const sortedIndexes = sortDebtIndexes(active, method);
    const sortedActive = sortedIndexes.map((index) => active[index]);
    let remainingBudget = totalBudget;
    const focusDebt = sortedActive[0] || null;

    sortedActive.slice(1).forEach((debt) => {
      const payment = Math.min(debt.balance, debt.minimumPayment);
      debt.balance = round(Math.max(0, debt.balance - payment), 2);
      remainingBudget -= payment;
    });

    if (focusDebt) {
      const payment = Math.min(focusDebt.balance, Math.max(remainingBudget, 0));
      focusDebt.balance = round(Math.max(0, focusDebt.balance - payment), 2);
      remainingBudget -= payment;
    }

    if (remainingBudget > 0) {
      sortedActive.slice(1).forEach((debt) => {
        if (remainingBudget <= 0 || debt.balance <= 0) return;
        const extra = Math.min(debt.balance, remainingBudget);
        debt.balance = round(Math.max(0, debt.balance - extra), 2);
        remainingBudget -= extra;
      });
    }

    if (months <= 12 || months % 6 === 0) {
      debtSnapshots.push({
        month: months,
        balances: working.map((debt) => ({
          name: debt.name,
          balance: round(debt.balance),
        })),
      });
    }
  }

  return {
    isValid: true,
    method,
    months,
    payoffDate: addMonthsFromReference(referenceDateIso, months),
    totalInterest: round(totalInterest),
    totalPaid: round(totalBudget * months),
    debtSnapshots,
    debts: working.map((debt) => ({
      name: debt.name,
      annualRate: debt.annualRate,
      minimumPayment: debt.minimumPayment,
    })),
  };
}

export function compareDebtPayoffPlans({
  debts = [],
  extraPayment = 0,
  referenceDateIso = null,
}) {
  const normalizedDebts = normalizeDebtItems(debts);
  const baseline = simulateDebtPayoff({ debts: normalizedDebts, extraPayment: 0, method: 'avalanche', referenceDateIso });
  const snowball = simulateDebtPayoff({ debts: normalizedDebts, extraPayment, method: 'snowball', referenceDateIso });
  const avalanche = simulateDebtPayoff({ debts: normalizedDebts, extraPayment, method: 'avalanche', referenceDateIso });

  return {
    isValid: normalizedDebts.length > 0,
    baseline,
    snowball,
    avalanche,
    monthsSavedWithExtra: baseline.isValid && avalanche.isValid ? Math.max(baseline.months - avalanche.months, 0) : 0,
    interestSavedWithAvalanche: snowball.isValid && avalanche.isValid ? round(Math.max(snowball.totalInterest - avalanche.totalInterest, 0)) : 0,
  };
}

function normalizeMonths(years, months) {
  const directMonths = Math.round(toNumber(months));
  if (directMonths > 0) return directMonths;
  return Math.max(1, Math.round(toNumber(years) * 12));
}

function buildFixedSchedule({ principal, annualRate, months }) {
  const years = months / 12;
  const totalInterest = principal * (annualRate / 100) * years;
  const monthlyPrincipal = principal / months;
  const monthlyInterest = totalInterest / months;
  const monthlyPayment = monthlyPrincipal + monthlyInterest;

  let remaining = principal;
  const schedule = [];

  for (let month = 1; month <= months; month += 1) {
    remaining = Math.max(0, remaining - monthlyPrincipal);
    schedule.push({
      month,
      payment: round(monthlyPayment),
      principalPaid: round(monthlyPrincipal),
      interestPaid: round(monthlyInterest),
      balance: round(remaining),
    });
  }

  return {
    monthlyPayment: round(monthlyPayment),
    totalInterest: round(totalInterest),
    totalPaid: round(monthlyPayment * months),
    schedule,
  };
}

function buildReducingSchedule({ principal, annualRate, months, extraPayment = 0 }) {
  const monthlyRate = annualRate / 100 / 12;
  const basePayment =
    monthlyRate === 0
      ? principal / months
      : principal * (monthlyRate / (1 - (1 + monthlyRate) ** -months));

  const paymentWithExtra = basePayment + Math.max(0, toNumber(extraPayment));
  let balance = principal;
  let totalInterest = 0;
  const schedule = [];
  let month = 0;

  while (balance > 0.01 && month < 600) {
    month += 1;
    const interestPaid = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = Math.min(balance, paymentWithExtra - interestPaid);
    const payment = principalPaid + interestPaid;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interestPaid;

    schedule.push({
      month,
      payment: round(payment),
      principalPaid: round(principalPaid),
      interestPaid: round(interestPaid),
      balance: round(balance),
    });

    if (principalPaid <= 0) break;
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);

  return {
    monthlyPayment: round(basePayment),
    actualMonthlyOutflow: round(paymentWithExtra),
    totalInterest: round(totalInterest),
    totalPaid: round(totalPaid),
    schedule,
  };
}

export function calculateMonthlyInstallment({
  loanAmount,
  downPayment = 0,
  years = 5,
  months = 0,
  annualRate = 5,
  interestType = 'reducing',
  adminFee = 0,
  insuranceFee = 0,
  appraisalFee = 0,
}) {
  const amount = Math.max(0, toNumber(loanAmount));
  const upfront = Math.max(0, toNumber(downPayment));
  const principal = Math.max(0, amount - upfront);
  const termMonths = normalizeMonths(years, months);
  const rate = Math.max(0, toNumber(annualRate));
  const fees =
    Math.max(0, toNumber(adminFee)) +
    Math.max(0, toNumber(insuranceFee)) +
    Math.max(0, toNumber(appraisalFee));

  if (!principal || !termMonths) {
    return {
      isValid: false,
      principal,
      months: termMonths,
      totalFees: round(fees),
    };
  }

  const core =
    interestType === 'fixed'
      ? buildFixedSchedule({ principal, annualRate: rate, months: termMonths })
      : buildReducingSchedule({ principal, annualRate: rate, months: termMonths });

  const totalPaid = core.totalPaid + fees;

  return {
    isValid: true,
    principal: round(principal),
    originalAmount: round(amount),
    downPayment: round(upfront),
    annualRate: rate,
    months: termMonths,
    years: round(termMonths / 12, 2),
    interestType,
    totalFees: round(fees),
    monthlyPayment: round(core.monthlyPayment),
    monthlyOutflow: round(core.actualMonthlyOutflow || core.monthlyPayment),
    totalInterest: round(core.totalInterest),
    totalPaid: round(totalPaid),
    interestShare: principal ? round((core.totalInterest / principal) * 100, 1) : 0,
    schedule: core.schedule,
  };
}

export function calculateEarlyPaymentPlan(input) {
  const extraPayment = Math.max(0, toNumber(input.extraPayment));
  const base = calculateMonthlyInstallment(input);

  if (!base.isValid || !extraPayment) {
    return {
      isValid: base.isValid,
      base,
      payoffMonths: base.months || 0,
      interestSaved: 0,
      totalSaved: 0,
      isEstimate: false,
    };
  }

  if (input.interestType === 'fixed') {
    const principalPart = base.principal / base.months;
    const payoffMonths = Math.max(1, Math.ceil(base.principal / (principalPart + extraPayment)));
    const reducedInterest = base.totalInterest * (payoffMonths / base.months);
    const totalPaid = base.principal + reducedInterest + base.totalFees;

    return {
      isValid: true,
      base,
      payoffMonths,
      interestSaved: round(base.totalInterest - reducedInterest),
      totalSaved: round(base.totalPaid - totalPaid),
      isEstimate: true,
    };
  }

  const accelerated = buildReducingSchedule({
    principal: base.principal,
    annualRate: base.annualRate,
    months: base.months,
    extraPayment,
  });

  return {
    isValid: true,
    base,
    payoffMonths: accelerated.schedule.length,
    interestSaved: round(base.totalInterest - accelerated.totalInterest),
    totalSaved: round(base.totalPaid - (accelerated.totalPaid + base.totalFees)),
    isEstimate: false,
  };
}

export function calculateBorrowingCapacity({
  monthlyBudget,
  annualRate = 5,
  years = 5,
  months = 0,
  interestType = 'reducing',
}) {
  const budget = Math.max(0, toNumber(monthlyBudget));
  const rate = Math.max(0, toNumber(annualRate));
  const termMonths = normalizeMonths(years, months);

  if (!budget || !termMonths) {
    return {
      isValid: false,
      principal: 0,
    };
  }

  let principal = 0;

  if (interestType === 'fixed') {
    principal = budget * termMonths / (1 + (rate / 100) * (termMonths / 12));
  } else {
    const monthlyRate = rate / 100 / 12;
    principal =
      monthlyRate === 0
        ? budget * termMonths
        : budget * ((1 - (1 + monthlyRate) ** -termMonths) / monthlyRate);
  }

  return {
    isValid: true,
    principal: round(principal),
    months: termMonths,
  };
}

export function calculateDebtToIncome({
  monthlyPayments,
  monthlyIncome,
}) {
  const payments = Math.max(0, toNumber(monthlyPayments));
  const income = Math.max(0, toNumber(monthlyIncome));
  const ratio = income ? (payments / income) * 100 : 0;

  return {
    ratio: round(ratio, 1),
    status:
      ratio < 33
        ? 'safe'
        : ratio <= 50
          ? 'warning'
          : 'danger',
  };
}

export function calculateVatAdd(amount, rate) {
  const base = Math.max(0, toNumber(amount));
  const vatRate = Math.max(0, toNumber(rate));
  const tax = base * (vatRate / 100);

  return {
    base: round(base),
    tax: round(tax),
    total: round(base + tax),
  };
}

export function calculateVatExtract(amount, rate) {
  const total = Math.max(0, toNumber(amount));
  const vatRate = Math.max(0, toNumber(rate));

  if (!vatRate) {
    return {
      base: round(total),
      tax: 0,
      total: round(total),
    };
  }

  const base = total / (1 + vatRate / 100);
  const tax = total - base;

  return {
    base: round(base),
    tax: round(tax),
    total: round(total),
  };
}

export function calculateVatReturn({
  salesAmount,
  purchaseAmount,
  rate,
  amountsIncludeVat = true,
}) {
  const sales = Math.max(0, toNumber(salesAmount));
  const purchases = Math.max(0, toNumber(purchaseAmount));
  const vatRate = Math.max(0, toNumber(rate));

  const outputs = amountsIncludeVat
    ? calculateVatExtract(sales, vatRate)
    : calculateVatAdd(sales, vatRate);
  const inputs = amountsIncludeVat
    ? calculateVatExtract(purchases, vatRate)
    : calculateVatAdd(purchases, vatRate);
  const net = outputs.tax - inputs.tax;

  return {
    outputs,
    inputs,
    net: round(net),
    status: net >= 0 ? 'due' : 'refund',
  };
}

export function calculateDiscountAndVat({
  amount,
  discountRate,
  vatRate,
}) {
  const original = Math.max(0, toNumber(amount));
  const discount = clamp(toNumber(discountRate), 0, 100);
  const discounted = original * (1 - discount / 100);
  const vat = discounted * (Math.max(0, toNumber(vatRate)) / 100);

  return {
    original: round(original),
    discounted: round(discounted),
    discountValue: round(original - discounted),
    tax: round(vat),
    total: round(discounted + vat),
  };
}

export function calculateMarginAndVat({
  cost,
  marginRate,
  vatRate,
}) {
  const baseCost = Math.max(0, toNumber(cost));
  const margin = Math.max(0, toNumber(marginRate));
  const sellingBeforeVat = baseCost * (1 + margin / 100);
  const tax = sellingBeforeVat * (Math.max(0, toNumber(vatRate)) / 100);

  return {
    cost: round(baseCost),
    sellingBeforeVat: round(sellingBeforeVat),
    tax: round(tax),
    total: round(sellingBeforeVat + tax),
  };
}

export function calculatePercentageOfValue(percent, value) {
  const normalizedPercent = toNumber(percent);
  const normalizedValue = toNumber(value);
  const result = normalizedValue * (normalizedPercent / 100);

  return {
    percent: normalizedPercent,
    value: normalizedValue,
    result: round(result),
  };
}

export function calculateWhatPercent(part, whole) {
  const normalizedPart = toNumber(part);
  const normalizedWhole = toNumber(whole);
  const result = normalizedWhole ? (normalizedPart / normalizedWhole) * 100 : 0;

  return {
    part: normalizedPart,
    whole: normalizedWhole,
    result: round(result, 2),
  };
}

export function calculateAdjustedValue(value, percent, mode = 'increase') {
  const original = toNumber(value);
  const normalizedPercent = toNumber(percent);
  const delta = original * (normalizedPercent / 100);
  const finalValue =
    mode === 'decrease'
      ? original - delta
      : original + delta;

  return {
    original,
    percent: normalizedPercent,
    mode,
    delta: round(delta),
    result: round(finalValue),
  };
}

export function calculatePercentChange(fromValue, toValue) {
  const previous = toNumber(fromValue);
  const current = toNumber(toValue);
  const difference = current - previous;
  const percentChange = previous ? (difference / previous) * 100 : 0;

  return {
    fromValue: previous,
    toValue: current,
    difference: round(difference),
    percentChange: round(percentChange, 2),
    direction:
      difference > 0
        ? 'increase'
        : difference < 0
          ? 'decrease'
          : 'same',
  };
}

export function calculateSequentialDiscounts(amount, discounts = []) {
  const original = Math.max(0, toNumber(amount));
  let current = original;
  const steps = discounts
    .map((value) => clamp(toNumber(value), 0, 100))
    .filter((value) => value > 0)
    .map((value, index) => {
      const discountAmount = current * (value / 100);
      current -= discountAmount;

      return {
        step: index + 1,
        rate: value,
        discountAmount: round(discountAmount),
        balance: round(current),
      };
    });

  return {
    original: round(original),
    finalAmount: round(current),
    totalDiscount: round(original - current),
    effectiveRate: original ? round(((original - current) / original) * 100, 2) : 0,
    steps,
  };
}

export function splitAmountByPercentages(amount, percentages = []) {
  const total = Math.max(0, toNumber(amount));
  const values = percentages.map((value) => Math.max(0, toNumber(value)));
  const allocations = values.map((value, index) => ({
    index,
    percentage: value,
    amount: round(total * (value / 100)),
  }));
  const usedPercentage = values.reduce((sum, value) => sum + value, 0);
  const allocatedAmount = allocations.reduce((sum, row) => sum + row.amount, 0);

  return {
    total: round(total),
    allocations,
    usedPercentage: round(usedPercentage, 2),
    remainingPercentage: round(100 - usedPercentage, 2),
    remainingAmount: round(total - allocatedAmount),
  };
}

export function calculateMultiChange(initialValue, changes = []) {
  const start = toNumber(initialValue);
  let current = start;
  const steps = changes
    .map((value) => toNumber(value))
    .filter((value) => value !== 0)
    .map((value, index) => {
      current *= 1 + value / 100;

      return {
        step: index + 1,
        percent: value,
        value: round(current),
      };
    });

  return {
    initialValue: round(start),
    finalValue: round(current),
    totalChangeAmount: round(current - start),
    totalChangePercent: start ? round(((current - start) / start) * 100, 2) : 0,
    steps,
  };
}

// GOSI rates (Saudi Arabia):
//   Saudi employee: 9.75% (employee share) + 9.75% employer — total 19.5%
//   Expat employee: 0% (no GOSI contribution for non-Saudis on pension branch)
//   Both: hazard insurance 2% paid by employer only (not deducted from salary)
// UAE: no personal income tax; GPSSA for UAE nationals = 5% employee share
const GOSI_RATES = {
  none:   { label: 'لا خصومات',         employeeRate: 0 },
  saudi:  { label: 'سعودي (GOSI 9.75%)', employeeRate: 0.0975 },
  uae:    { label: 'إماراتي (GPSSA 5%)',  employeeRate: 0.05 },
};

export { GOSI_RATES };

export function calculateSalaryBreakdown({
  monthlySalary,
  hoursPerDay = 8,
  daysPerMonth = 30,
  extraMonths = 0,
  gosiType = 'none',
}) {
  const monthly = toNumber(monthlySalary);
  const hpd = Math.max(1, toNumber(hoursPerDay) || 8);
  const dpm = Math.max(1, toNumber(daysPerMonth) || 30);
  const extra = toNumber(extraMonths);

  const gosiRate = GOSI_RATES[gosiType]?.employeeRate ?? 0;
  const gosiMonthly = round(monthly * gosiRate);
  const netMonthly = round(monthly - gosiMonthly);

  const annual = round(monthly * (12 + extra));
  const netAnnual = round(netMonthly * (12 + extra));
  const semiMonthly = round(monthly / 2);
  const weekly = round((monthly * 12) / 52);
  const daily = round(monthly / dpm);
  const hourly = round(daily / hpd, 4);
  const minutely = round(hourly / 60, 4);

  return {
    isValid: monthly > 0,
    monthly: round(monthly),
    netMonthly,
    gosiMonthly,
    gosiRate,
    gosiType,
    annual,
    netAnnual,
    semiMonthly,
    weekly,
    daily,
    hourly,
    minutely,
    hoursPerDay: hpd,
    daysPerMonth: dpm,
    extraMonths: extra,
  };
}

// ── Annual Leave Calculator ──────────────────────────────────────────────────
// Country leave entitlement rules
export const ANNUAL_LEAVE_COUNTRIES = {
  sa: {
    label: 'السعودية',
    flag: '🇸🇦',
    daysPerMonth: 30,
    entitlement: (years) => years >= 5 ? 30 : 21,
    entitlementNote: (years) => years >= 5 ? '30 يوم (5 سنوات+)' : '21 يوم (أقل من 5 سنوات)',
  },
  ae: {
    label: 'الإمارات',
    flag: '🇦🇪',
    daysPerMonth: 30,
    entitlement: (years) => years >= 1 ? 30 : Math.floor(years * 30),
    entitlementNote: () => '30 يوم في السنة',
  },
  kw: {
    label: 'الكويت',
    flag: '🇰🇼',
    daysPerMonth: 30,
    entitlement: (years) => 30,
    entitlementNote: () => '30 يوم في السنة',
  },
  qa: {
    label: 'قطر',
    flag: '🇶🇦',
    daysPerMonth: 30,
    entitlement: (years) => years >= 5 ? 30 : 21,
    entitlementNote: (years) => years >= 5 ? '30 يوم (5 سنوات+)' : '21 يوم (أقل من 5 سنوات)',
  },
  bh: {
    label: 'البحرين',
    flag: '🇧🇭',
    daysPerMonth: 30,
    entitlement: (years) => 30,
    entitlementNote: () => '30 يوم في السنة',
  },
  om: {
    label: 'سلطنة عُمان',
    flag: '🇴🇲',
    daysPerMonth: 30,
    entitlement: (years) => years >= 1 ? 30 : Math.floor(years * 30),
    entitlementNote: () => '30 يوم في السنة',
  },
  eg: {
    label: 'مصر',
    flag: '🇪🇬',
    daysPerMonth: 30,
    entitlement: (years) => years >= 10 ? 30 : years >= 1 ? 21 : 15,
    entitlementNote: (years) => years >= 10 ? '30 يوم (10 سنوات+)' : years >= 1 ? '21 يوم' : '15 يوم (في سنة الخدمة الأولى)',
  },
  jo: {
    label: 'الأردن',
    flag: '🇯🇴',
    daysPerMonth: 30,
    entitlement: (years) => years >= 5 ? 21 : 14,
    entitlementNote: (years) => years >= 5 ? '21 يوم (5 سنوات+)' : '14 يوم',
  },
};

export function calculateAnnualLeave({
  monthlySalary,
  yearsWorked,
  daysUsed = 0,
  country = 'sa',
}) {
  const salary = toNumber(monthlySalary);
  const years = Math.max(0, toNumber(yearsWorked));
  const used = Math.max(0, toNumber(daysUsed));
  const countryData = ANNUAL_LEAVE_COUNTRIES[country] || ANNUAL_LEAVE_COUNTRIES.sa;
  const dpm = countryData.daysPerMonth;

  const entitledDays = countryData.entitlement(years);
  const balance = Math.max(0, entitledDays - used);
  const dailySalary = round(salary / dpm);
  const leaveBalance = round(balance * dailySalary);
  const totalLeaveValue = round(entitledDays * dailySalary);
  const accrualPerMonth = round(entitledDays / 12, 4);

  return {
    isValid: salary > 0 && years >= 0,
    entitledDays,
    daysUsed: used,
    balance,
    dailySalary,
    leaveBalance,
    totalLeaveValue,
    accrualPerMonth,
    yearsWorked: years,
    entitlementNote: countryData.entitlementNote(years),
    daysPerMonth: dpm,
  };
}

// ── Zakat Calculator ─────────────────────────────────────────────────────────
// Nisab thresholds (approximate — user should verify with a scholar or current prices)
// Gold nisab: 85g | Silver nisab: 595g
// Zakat rate: 2.5% (1/40)
export const ZAKAT_NISAB_GOLD_GRAMS = 85;
export const ZAKAT_NISAB_SILVER_GRAMS = 595;
export const ZAKAT_RATE = 0.025;

export function calculateZakat({
  cash = 0,
  bankDeposits = 0,
  gold = 0,
  silver = 0,
  investments = 0,
  businessInventory = 0,
  receivables = 0,
  debts = 0,
  goldPricePerGram = 0,
  silverPricePerGram = 0,
  nisabBasis = 'gold',
}) {
  const cashVal = toNumber(cash);
  const bankVal = toNumber(bankDeposits);
  const goldVal = toNumber(gold);
  const silverVal = toNumber(silver);
  const investVal = toNumber(investments);
  const businessVal = toNumber(businessInventory);
  const receivablesVal = toNumber(receivables);
  const debtsVal = toNumber(debts);
  const goldPrice = toNumber(goldPricePerGram);
  const silverPrice = toNumber(silverPricePerGram);

  const goldMarketValue = round(goldVal * goldPrice);
  const silverMarketValue = round(silverVal * silverPrice);

  const totalAssets = round(
    cashVal + bankVal + goldMarketValue + silverMarketValue + investVal + businessVal + receivablesVal,
  );
  const netZakatable = Math.max(0, round(totalAssets - debtsVal));

  // Nisab in currency
  const nisabGoldValue = goldPrice > 0 ? round(ZAKAT_NISAB_GOLD_GRAMS * goldPrice) : 0;
  const nisabSilverValue = silverPrice > 0 ? round(ZAKAT_NISAB_SILVER_GRAMS * silverPrice) : 0;
  const nisab = nisabBasis === 'silver' ? nisabSilverValue : nisabGoldValue;

  const meetsNisab = nisab > 0 ? netZakatable >= nisab : null;
  const zakatDue = meetsNisab ? round(netZakatable * ZAKAT_RATE) : 0;
  const hasAssets = netZakatable > 0;

  return {
    isValid: hasAssets,
    totalAssets,
    netZakatable,
    nisab,
    nisabGoldValue,
    nisabSilverValue,
    meetsNisab,
    zakatDue,
    zakatRate: ZAKAT_RATE,
    breakdown: {
      cash: cashVal,
      bankDeposits: bankVal,
      gold: goldMarketValue,
      silver: silverMarketValue,
      investments: investVal,
      businessInventory: businessVal,
      receivables: receivablesVal,
      debts: debtsVal,
    },
  };
}

// ── BMI + Ideal Weight + TDEE ─────────────────────────────────────────────────
export function calculateBMI({
  weightKg,
  heightCm,
  age,
  gender = 'male',
  activityLevel = 'moderate',
}) {
  const weight = toNumber(weightKg);
  const height = toNumber(heightCm);
  const ageVal = toNumber(age);

  if (weight <= 0 || height <= 0) return { isValid: false };

  const heightM = height / 100;
  const bmi = round(weight / (heightM * heightM), 1);

  let category, categoryAr, color;
  if (bmi < 18.5) { category = 'underweight'; categoryAr = 'نقص في الوزن'; color = '#3b82f6'; }
  else if (bmi < 25) { category = 'normal'; categoryAr = 'وزن مثالي'; color = '#10b981'; }
  else if (bmi < 30) { category = 'overweight'; categoryAr = 'زيادة طفيفة'; color = '#f59e0b'; }
  else if (bmi < 35) { category = 'obese1'; categoryAr = 'سمنة (درجة أولى)'; color = '#ef4444'; }
  else { category = 'obese2'; categoryAr = 'سمنة مفرطة'; color = '#dc2626'; }

  // Ideal weight range for this height (BMI 18.5–24.9)
  const idealMin = round(18.5 * heightM * heightM, 1);
  const idealMax = round(24.9 * heightM * heightM, 1);

  // Hamwi ideal weight formula
  const hamwi = gender === 'male'
    ? round(48 + 2.7 * Math.max(0, (height - 152.4) / 2.54), 1)
    : round(45.4 + 2.3 * Math.max(0, (height - 152.4) / 2.54), 1);

  const weightDiff = round(weight - (idealMin + idealMax) / 2, 1);

  // Mifflin-St Jeor BMR
  let bmr;
  if (ageVal > 0) {
    bmr = gender === 'male'
      ? round(10 * weight + 6.25 * height - 5 * ageVal + 5)
      : round(10 * weight + 6.25 * height - 5 * ageVal - 161);
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  const tdee = bmr ? round(bmr * (activityMultipliers[activityLevel] || 1.55)) : null;

  return {
    isValid: true,
    bmi,
    category,
    categoryAr,
    color,
    idealMin,
    idealMax,
    hamwi,
    weightDiff,
    bmr,
    tdee,
    bmiPercent: clamp(Math.round(((bmi - 10) / (45 - 10)) * 100), 0, 100),
  };
}

// ─── UAE End of Service (Federal Decree-Law No. 33 of 2021) ──────────────────

// Resignation entitlement brackets under UAE law
// (same brackets apply to early exit from limited contracts)
export function getUaeEndOfServiceBracket(serviceYears) {
  if (serviceYears < 1) return { label: 'أقل من سنة', multiplier: 0 };
  if (serviceYears < 3) return { label: 'من سنة إلى أقل من 3 سنوات', multiplier: 1 / 3 };
  if (serviceYears < 5) return { label: 'من 3 إلى أقل من 5 سنوات', multiplier: 2 / 3 };
  return { label: '5 سنوات فأكثر', multiplier: 1 };
}

export function calculateUaeEndOfServiceBenefit({
  basicSalary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const salary = Math.max(0, toNumber(basicSalary));
  const service = diffDates(startDate, endDate);

  if (!salary || !service.isValid) {
    return {
      isValid: false,
      salary,
      service,
      dailyRate: 0,
      firstFiveAmount: 0,
      remainingAmount: 0,
      fullGratuity: 0,
      gratuity: 0,
      entitlementPercent: 0,
    };
  }

  // UAE formula: (basic salary ÷ 30) × 21 days/year (first 5 yrs) or 30 days/year (after)
  const dailyRate = salary / 30;
  const firstFiveYears = Math.min(service.decimalYears, 5);
  const remainingYears = Math.max(service.decimalYears - 5, 0);
  const firstFiveAmount = dailyRate * 21 * firstFiveYears;
  const remainingAmount = dailyRate * 30 * remainingYears;
  const fullGratuity = firstFiveAmount + remainingAmount;

  const resignationBracket = getUaeEndOfServiceBracket(service.decimalYears);
  const multiplier = reason === 'resignation' ? resignationBracket.multiplier : 1;
  const gratuity = fullGratuity * multiplier;

  // Breakdown: whole years vs partial year (for display)
  const wholeFirstFive = Math.min(service.years, 5) * dailyRate * 21;
  const wholeRemaining = Math.max(service.years - 5, 0) * dailyRate * 30;
  const partialAmount = Math.max(fullGratuity - wholeFirstFive - wholeRemaining, 0);

  return {
    isValid: true,
    salary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    dailyRate: round(dailyRate, 4),
    firstFiveYears,
    remainingYears,
    firstFiveAmount: round(firstFiveAmount),
    remainingAmount: round(remainingAmount),
    partialAmount: round(partialAmount),
    fullGratuity: round(fullGratuity),
    gratuity: round(gratuity),
    entitlementPercent: round(multiplier * 100, 1),
    resignationBracket,
  };
}

export function buildUaeEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  reason = 'resignation',
  waitMonths = 0,
}) {
  const current = calculateUaeEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason });
  const months = Math.max(0, Math.round(toNumber(waitMonths)));
  const projDate = (() => {
    const d = parseDateInput(endDate);
    if (!d) return null;
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
    return t.toISOString().slice(0, 10);
  })();
  const projected = projDate
    ? calculateUaeEndOfServiceBenefit({ basicSalary: salary, startDate, endDate: projDate, reason })
    : { isValid: false, gratuity: 0 };

  return {
    current,
    projected,
    projectedEndDate: projDate,
    difference: round((projected.gratuity || 0) - current.gratuity),
  };
}

export function buildUaeEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 1, label: 'ثلث المكافأة عند الاستقالة' },
    { years: 3, label: 'ثلثا المكافأة عند الاستقالة' },
    { years: 5, label: 'مكافأة كاملة عند الاستقالة + معدل 30 يوماً/سنة' },
  ];
  return milestones.map((item) => ({
    ...item,
    date: (() => {
      const d = parseDateInput(startDate);
      if (!d) return null;
      const t = new Date(Date.UTC(d.getUTCFullYear() + item.years, d.getUTCMonth(), d.getUTCDate()));
      return t.toISOString().slice(0, 10);
    })(),
  }));
}

// ─── Qatar End-of-Service (Law No. 14 of 2004, Article 54) ──────────────────
// Flat 21 days per year for ALL service lengths (2024 reform abolished old tiers)
// NO resignation penalty — unique among GCC countries

export function calculateQatarEndOfServiceBenefit({
  basicSalary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const salary = Math.max(0, toNumber(basicSalary));
  const service = diffDates(startDate, endDate);

  if (!salary || !service.isValid) {
    return {
      isValid: false,
      salary,
      service,
      dailyRate: 0,
      gratuityFull: 0,
      gratuity: 0,
      entitlementPercent: 100,
      isForfeited: false,
    };
  }

  // Qatar formula: (salary ÷ 30) × 21 days × years served
  const dailyRate = salary / 30;
  const gratuityFull = dailyRate * 21 * service.decimalYears;

  // Art. 61 gross misconduct = full forfeiture; all other reasons = 100%
  const isForfeited = reason === 'misconduct';
  const gratuity = isForfeited ? 0 : gratuityFull;

  const wholeYearsAmount = service.years * dailyRate * 21;
  const partialAmount = Math.max(gratuityFull - wholeYearsAmount, 0);

  return {
    isValid: true,
    salary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    dailyRate: round(dailyRate, 4),
    gratuityFull: round(gratuityFull),
    wholeYearsAmount: round(wholeYearsAmount),
    partialAmount: round(partialAmount),
    gratuity: round(gratuity),
    entitlementPercent: isForfeited ? 0 : 100,
    isForfeited,
  };
}

export function buildQatarEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  waitMonths = 0,
}) {
  const current = calculateQatarEndOfServiceBenefit({ basicSalary: salary, startDate, endDate });
  const months = Math.max(0, Math.round(toNumber(waitMonths)));
  const projDate = (() => {
    const d = parseDateInput(endDate);
    if (!d) return null;
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
    return t.toISOString().slice(0, 10);
  })();
  const projected = projDate
    ? calculateQatarEndOfServiceBenefit({ basicSalary: salary, startDate, endDate: projDate })
    : { isValid: false, gratuity: 0 };

  return {
    current,
    projected,
    projectedEndDate: projDate,
    difference: round((projected.gratuity || 0) - current.gratuity),
  };
}

export function buildQatarEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 1, label: 'حد الاستحقاق الأدنى (سنة كاملة)' },
    { years: 5, label: '5 سنوات — استحقاق كامل 21 يوم/سنة' },
    { years: 10, label: '10 سنوات — استحقاق كامل 21 يوم/سنة' },
  ];
  return milestones.map((item) => ({
    ...item,
    date: (() => {
      const d = parseDateInput(startDate);
      if (!d) return null;
      const t = new Date(Date.UTC(d.getUTCFullYear() + item.years, d.getUTCMonth(), d.getUTCDate()));
      return t.toISOString().slice(0, 10);
    })(),
  }));
}

// ─── Kuwait End-of-Service (Law No. 6 of 2010) ──────────────────────────────

export function getKuwaitEndOfServiceBracket(serviceYears) {
  if (serviceYears < 3) return { label: 'أقل من 3 سنوات', multiplier: 0 };
  if (serviceYears < 5) return { label: 'من 3 إلى أقل من 5 سنوات', multiplier: 0.5 };
  if (serviceYears < 10) return { label: 'من 5 إلى أقل من 10 سنوات', multiplier: 2 / 3 };
  return { label: '10 سنوات فأكثر', multiplier: 1 };
}

export function calculateKuwaitEndOfServiceBenefit({
  basicSalary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const salary = Math.max(0, toNumber(basicSalary));
  const service = diffDates(startDate, endDate);

  if (!salary || !service.isValid) {
    return {
      isValid: false,
      salary,
      service,
      dailyRate: 0,
      firstFiveAmount: 0,
      remainingAmount: 0,
      fullGratuity: 0,
      cappedFullGratuity: 0,
      isCapped: false,
      gratuity: 0,
      entitlementPercent: 0,
    };
  }

  // Kuwait formula: daily rate = salary ÷ 26
  // First 5 years: 15 working days/year; after 5 years: 30 working days/year
  const dailyRate = salary / 26;
  const firstFiveYears = Math.min(service.decimalYears, 5);
  const remainingYears = Math.max(service.decimalYears - 5, 0);
  const firstFiveAmount = dailyRate * 15 * firstFiveYears;
  const remainingAmount = dailyRate * 30 * remainingYears;
  const fullGratuity = firstFiveAmount + remainingAmount;

  // 18-month statutory cap
  const cap = salary * 18;
  const cappedFullGratuity = Math.min(fullGratuity, cap);
  const isCapped = fullGratuity > cap;

  const resignationBracket = getKuwaitEndOfServiceBracket(service.decimalYears);
  const multiplier = reason === 'resignation' ? resignationBracket.multiplier : 1;
  const gratuity = cappedFullGratuity * multiplier;

  const wholeFirstFive = Math.min(service.years, 5) * dailyRate * 15;
  const wholeRemaining = Math.max(service.years - 5, 0) * dailyRate * 30;
  const partialAmount = Math.max(fullGratuity - wholeFirstFive - wholeRemaining, 0);

  return {
    isValid: true,
    salary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    dailyRate: round(dailyRate, 4),
    firstFiveYears,
    remainingYears,
    firstFiveAmount: round(firstFiveAmount),
    remainingAmount: round(remainingAmount),
    partialAmount: round(partialAmount),
    fullGratuity: round(fullGratuity),
    cappedFullGratuity: round(cappedFullGratuity),
    isCapped,
    cap: round(cap),
    gratuity: round(gratuity),
    entitlementPercent: round(multiplier * 100, 1),
    resignationBracket,
  };
}

export function buildKuwaitEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  reason = 'resignation',
  waitMonths = 0,
}) {
  const current = calculateKuwaitEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason });
  const months = Math.max(0, Math.round(toNumber(waitMonths)));
  const projDate = (() => {
    const d = parseDateInput(endDate);
    if (!d) return null;
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
    return t.toISOString().slice(0, 10);
  })();
  const projected = projDate
    ? calculateKuwaitEndOfServiceBenefit({ basicSalary: salary, startDate, endDate: projDate, reason })
    : { isValid: false, gratuity: 0 };

  return {
    current,
    projected,
    projectedEndDate: projDate,
    difference: round((projected.gratuity || 0) - current.gratuity),
  };
}

export function buildKuwaitEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 3, label: '50% من المكافأة عند الاستقالة' },
    { years: 5, label: '66.7% من المكافأة + معدل 30 يوماً/سنة' },
    { years: 10, label: 'مكافأة كاملة عند الاستقالة' },
  ];
  return milestones.map((item) => ({
    ...item,
    date: (() => {
      const d = parseDateInput(startDate);
      if (!d) return null;
      const t = new Date(Date.UTC(d.getUTCFullYear() + item.years, d.getUTCMonth(), d.getUTCDate()));
      return t.toISOString().slice(0, 10);
    })(),
  }));
}

// ─── Bahrain End-of-Service (Law No. 36 of 2012, Article 116) ────────────────

export function getBahrainEndOfServiceBracket(serviceYears) {
  if (serviceYears < 1) return { label: 'أقل من سنة', multiplier: 0 };
  if (serviceYears < 3) return { label: 'من سنة إلى أقل من 3 سنوات', multiplier: 1 / 3 };
  if (serviceYears < 5) return { label: 'من 3 إلى أقل من 5 سنوات', multiplier: 2 / 3 };
  return { label: '5 سنوات فأكثر', multiplier: 1 };
}

export function calculateBahrainEndOfServiceBenefit({
  basicSalary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const salary = Math.max(0, toNumber(basicSalary));
  const service = diffDates(startDate, endDate);

  if (!salary || !service.isValid) {
    return {
      isValid: false,
      salary,
      service,
      dailyRate: 0,
      firstThreeAmount: 0,
      remainingAmount: 0,
      fullGratuity: 0,
      gratuity: 0,
      entitlementPercent: 0,
    };
  }

  // Bahrain formula: daily rate = salary ÷ 30
  // First 3 years: 15 days/year (half month); after 3 years: 30 days/year (full month)
  const dailyRate = salary / 30;
  const firstThreeYears = Math.min(service.decimalYears, 3);
  const remainingYears = Math.max(service.decimalYears - 3, 0);
  const firstThreeAmount = dailyRate * 15 * firstThreeYears;
  const remainingAmount = dailyRate * 30 * remainingYears;
  const fullGratuity = firstThreeAmount + remainingAmount;

  const resignationBracket = getBahrainEndOfServiceBracket(service.decimalYears);
  const multiplier = reason === 'resignation' ? resignationBracket.multiplier : 1;
  const gratuity = fullGratuity * multiplier;

  const wholeFirstThree = Math.min(service.years, 3) * dailyRate * 15;
  const wholeRemaining = Math.max(service.years - 3, 0) * dailyRate * 30;
  const partialAmount = Math.max(fullGratuity - wholeFirstThree - wholeRemaining, 0);

  return {
    isValid: true,
    salary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    dailyRate: round(dailyRate, 4),
    firstThreeYears,
    remainingYears,
    firstThreeAmount: round(firstThreeAmount),
    remainingAmount: round(remainingAmount),
    partialAmount: round(partialAmount),
    fullGratuity: round(fullGratuity),
    gratuity: round(gratuity),
    entitlementPercent: round(multiplier * 100, 1),
    resignationBracket,
  };
}

export function buildBahrainEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  reason = 'resignation',
  waitMonths = 0,
}) {
  const current = calculateBahrainEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason });
  const months = Math.max(0, Math.round(toNumber(waitMonths)));
  const projDate = (() => {
    const d = parseDateInput(endDate);
    if (!d) return null;
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
    return t.toISOString().slice(0, 10);
  })();
  const projected = projDate
    ? calculateBahrainEndOfServiceBenefit({ basicSalary: salary, startDate, endDate: projDate, reason })
    : { isValid: false, gratuity: 0 };

  return {
    current,
    projected,
    projectedEndDate: projDate,
    difference: round((projected.gratuity || 0) - current.gratuity),
  };
}

export function buildBahrainEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 1, label: '33.3% من المكافأة عند الاستقالة' },
    { years: 3, label: '66.7% من المكافأة + معدل 30 يوم/سنة' },
    { years: 5, label: 'مكافأة كاملة عند الاستقالة' },
  ];
  return milestones.map((item) => ({
    ...item,
    date: (() => {
      const d = parseDateInput(startDate);
      if (!d) return null;
      const t = new Date(Date.UTC(d.getUTCFullYear() + item.years, d.getUTCMonth(), d.getUTCDate()));
      return t.toISOString().slice(0, 10);
    })(),
  }));
}

// ─── Egypt End-of-Service (Labour Law No. 12 of 2003, Art. 120–121) ──────────
export function getEgyptEndOfServiceBracket(serviceYears) {
  if (serviceYears < 5)  return { label: 'أقل من 5 سنوات',         multiplier: 0 };
  if (serviceYears < 10) return { label: 'من 5 إلى أقل من 10 سنوات', multiplier: 0.5 };
  return                        { label: '10 سنوات فأكثر',           multiplier: 1 };
}

export function calculateEgyptEndOfServiceBenefit({
  basicSalary,
  startDate,
  endDate,
  reason = 'contract_end',
}) {
  const salary = Math.max(0, toNumber(basicSalary));
  const service = diffDates(startDate, endDate);

  if (!salary || !service.isValid) {
    return {
      isValid: false,
      salary,
      service,
      dailyRate: 0,
      firstTenAmount: 0,
      remainingAmount: 0,
      partialAmount: 0,
      fullGratuity: 0,
      gratuity: 0,
      entitlementPercent: 0,
    };
  }

  // Art. 120: daily rate = salary ÷ 30
  // First 10 years: 30 days/year (1 month). After 10 years: 45 days/year (1.5 months).
  const dailyRate = salary / 30;
  const firstTenYears   = Math.min(service.decimalYears, 10);
  const remainingYears  = Math.max(service.decimalYears - 10, 0);
  const firstTenAmount  = dailyRate * 30 * firstTenYears;
  const remainingAmount = dailyRate * 45 * remainingYears;
  const fullGratuity    = firstTenAmount + remainingAmount;

  // Art. 121: resignation multiplier
  const resignationBracket = getEgyptEndOfServiceBracket(service.decimalYears);
  const multiplier = reason === 'resignation' ? resignationBracket.multiplier : 1;
  const gratuity   = fullGratuity * multiplier;

  const wholeTen      = Math.min(service.years, 10) * dailyRate * 30;
  const wholeRemain   = Math.max(service.years - 10, 0) * dailyRate * 45;
  const partialAmount = Math.max(fullGratuity - wholeTen - wholeRemain, 0);

  return {
    isValid: true,
    salary,
    reason,
    service,
    serviceLabel: formatServiceDuration(service),
    dailyRate: round(dailyRate, 4),
    firstTenYears,
    remainingYears,
    firstTenAmount:   round(firstTenAmount),
    remainingAmount:  round(remainingAmount),
    partialAmount:    round(partialAmount),
    fullGratuity:     round(fullGratuity),
    gratuity:         round(gratuity),
    entitlementPercent: round(multiplier * 100, 1),
    resignationBracket,
  };
}

export function buildEgyptEndOfServiceComparison({
  salary,
  startDate,
  endDate,
  reason = 'resignation',
  waitMonths = 0,
}) {
  const current = calculateEgyptEndOfServiceBenefit({ basicSalary: salary, startDate, endDate, reason });
  const months  = Math.max(0, Math.round(toNumber(waitMonths)));
  const projDate = (() => {
    const d = parseDateInput(endDate);
    if (!d) return null;
    const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, d.getUTCDate()));
    return t.toISOString().slice(0, 10);
  })();
  const projected = projDate
    ? calculateEgyptEndOfServiceBenefit({ basicSalary: salary, startDate, endDate: projDate, reason })
    : { isValid: false, gratuity: 0 };

  return {
    current,
    projected,
    projectedEndDate: projDate,
    difference: round((projected.gratuity || 0) - current.gratuity),
  };
}

export function buildEgyptEndOfServiceMilestones(startDate) {
  const milestones = [
    { years: 5,  label: '50% من المكافأة عند الاستقالة' },
    { years: 10, label: 'مكافأة كاملة + معدل 45 يوم/سنة' },
    { years: 15, label: 'أكثر من 5 سنوات بالمعدل الكامل' },
  ];
  return milestones.map((item) => ({
    ...item,
    date: (() => {
      const d = parseDateInput(startDate);
      if (!d) return null;
      const t = new Date(Date.UTC(d.getUTCFullYear() + item.years, d.getUTCMonth(), d.getUTCDate()));
      return t.toISOString().slice(0, 10);
    })(),
  }));
}

// ─── Egypt Social Insurance (Law 148/2019) ───────────────────────────────────

export const EGYPT_SI_EMPLOYER_RATE = 0.1875;

export function calculateEgyptSocialInsurance({ monthlySalary }) {
  const salary = parseFloat(monthlySalary);
  if (!salary || salary <= 0 || isNaN(salary)) return { isValid: false };

  const siBase         = Math.min(salary, EGYPT_SI_MAX_MONTHLY);
  const employeeShare  = round(siBase * EGYPT_SI_EMPLOYEE_RATE);
  const employerShare  = round(siBase * EGYPT_SI_EMPLOYER_RATE);
  const totalShare     = round(employeeShare + employerShare);
  const netAfterSi     = round(salary - employeeShare);
  const cappedNote     = salary > EGYPT_SI_MAX_MONTHLY;

  return {
    isValid: true,
    salary,
    siBase,
    employeeShare,
    employerShare,
    totalShare,
    netAfterSi,
    cappedNote,
    employeePct:  (EGYPT_SI_EMPLOYEE_RATE * 100).toFixed(0),
    employerPct:  (EGYPT_SI_EMPLOYER_RATE * 100).toFixed(2),
  };
}

// ─── Morocco Net Salary (CNSS + IR) ──────────────────────────────────────────

const MOROCCO_CNSS_RATE        = 0.0448; // short-term
const MOROCCO_CNSS_AMO_RATE    = 0.0629; // AMO long-term
const MOROCCO_CNSS_TRAINING    = 0.0052; // professional training
const MOROCCO_CNSS_TOTAL       = MOROCCO_CNSS_RATE + MOROCCO_CNSS_AMO_RATE + MOROCCO_CNSS_TRAINING;
const MOROCCO_CNSS_MAX_MONTHLY = 6000;   // MAD (2025 cap for some components — full for AMO)

const MOROCCO_IR_BRACKETS = [
  { upTo: 30000,   rate: 0 },
  { upTo: 50000,   rate: 0.10 },
  { upTo: 60000,   rate: 0.20 },
  { upTo: 80000,   rate: 0.30 },
  { upTo: 180000,  rate: 0.34 },
  { upTo: Infinity, rate: 0.38 },
];

export function calculateMoroccoNetSalary({ monthlyGross }) {
  const salary = parseFloat(monthlyGross);
  if (!salary || salary <= 0 || isNaN(salary)) return { isValid: false };

  const cnssDeduction  = round(salary * MOROCCO_CNSS_TOTAL);
  const annualGross    = round(salary * 12);
  const annualTaxable  = Math.max(0, round(annualGross - cnssDeduction * 12));

  let remaining       = annualTaxable;
  let totalIRAnnual   = 0;
  const bracketDetail = [];

  for (let i = 0; i < MOROCCO_IR_BRACKETS.length; i++) {
    const b        = MOROCCO_IR_BRACKETS[i];
    const prevUpTo = i === 0 ? 0 : MOROCCO_IR_BRACKETS[i - 1].upTo;
    const width    = b.upTo === Infinity ? remaining : (b.upTo - prevUpTo);
    const taxable  = Math.max(0, Math.min(width, remaining));
    if (taxable <= 0) break;

    const tax = round(taxable * b.rate);
    totalIRAnnual += tax;
    bracketDetail.push({
      rate:   b.rate,
      label:  `${(b.rate * 100).toFixed(0)}%`,
      from:   prevUpTo,
      to:     b.upTo === Infinity ? annualTaxable : b.upTo,
      amount: round(taxable),
      tax,
      pct:    annualTaxable > 0 ? (taxable / annualTaxable) * 100 : 0,
    });
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  const monthlyIR        = round(totalIRAnnual / 12);
  const netMonthly       = round(salary - cnssDeduction - monthlyIR);
  const effectiveIRRate  = annualGross > 0 ? round((totalIRAnnual / annualGross) * 100, 2) : 0;

  return {
    isValid: true,
    salary,
    cnssDeduction,
    cnssRatePct:  (MOROCCO_CNSS_TOTAL * 100).toFixed(2),
    annualGross,
    annualTaxable,
    monthlyIR,
    netMonthly,
    effectiveIRRate,
    bracketDetail,
  };
}

// ─── Jordan End-of-Service (Labour Law No. 8 of 1996, Art. 32) ───────────────

export function getJordanEndOfServiceBracket(serviceYears) {
  if (serviceYears < 1)  return { pct: 0,   label: 'أقل من سنة — لا يوجد استحقاق' };
  if (serviceYears < 3)  return { pct: 33.3, label: 'من 1 إلى أقل من 3 سنوات — ثلث المكافأة' };
  return                        { pct: 100,  label: '3 سنوات فأكثر — مكافأة كاملة' };
}

export function calculateJordanEndOfServiceBenefit({ basicSalary, startDate, endDate, reason }) {
  const salary = parseFloat(basicSalary);
  if (!salary || salary <= 0 || isNaN(salary)) return { isValid: false };

  const service = diffDates(startDate, endDate);
  if (!service.isValid) return { isValid: false };

  const dailyRate    = round(salary / 30);
  const fullGratuity = round(service.decimalYears * 30 * dailyRate);

  let entitlementPct = 100;
  let resignationBracket = null;
  if (reason === 'resignation') {
    const bracket      = getJordanEndOfServiceBracket(service.decimalYears);
    entitlementPct     = bracket.pct;
    resignationBracket = bracket;
  }

  const gratuity = round(fullGratuity * (entitlementPct / 100));

  return {
    isValid: true,
    salary,
    dailyRate,
    service,
    fullGratuity,
    gratuity,
    entitlementPercent: entitlementPct,
    resignationBracket,
    serviceLabel: formatServiceDuration(service),
  };
}

// ─── Egypt Income Tax (Law 91/2005, 2023 amendment brackets) ─────────────────

const EGYPT_IT_BRACKETS = [
  { upTo: 15000,   rate: 0,     label: 'إعفاء (0%)' },
  { upTo: 30000,   rate: 0.025, label: '2.5%' },
  { upTo: 45000,   rate: 0.10,  label: '10%' },
  { upTo: 60000,   rate: 0.15,  label: '15%' },
  { upTo: 200000,  rate: 0.20,  label: '20%' },
  { upTo: 400000,  rate: 0.225, label: '22.5%' },
  { upTo: Infinity, rate: 0.25, label: '25%' },
];

export const EGYPT_SI_EMPLOYEE_RATE = 0.11;
export const EGYPT_SI_MAX_MONTHLY   = 10400;

export function calculateEgyptIncomeTax({ monthlySalary, includeInsurance = true }) {
  const salary = parseFloat(monthlySalary);
  if (!salary || salary <= 0 || isNaN(salary)) return { isValid: false };

  const siBase    = Math.min(salary, EGYPT_SI_MAX_MONTHLY);
  const siMonthly = includeInsurance ? round(siBase * EGYPT_SI_EMPLOYEE_RATE) : 0;
  const siAnnual  = siMonthly * 12;

  const annualGross    = round(salary * 12);
  const annualTaxable  = Math.max(0, round(annualGross - siAnnual));

  let remaining       = annualTaxable;
  let totalTaxAnnual  = 0;
  const bracketBreakdown = [];

  for (let i = 0; i < EGYPT_IT_BRACKETS.length; i++) {
    const bracket  = EGYPT_IT_BRACKETS[i];
    const prevUpTo = i === 0 ? 0 : EGYPT_IT_BRACKETS[i - 1].upTo;
    const width    = bracket.upTo === Infinity ? remaining : (bracket.upTo - prevUpTo);
    const taxable  = Math.max(0, Math.min(width, remaining));
    if (taxable <= 0) break;

    const taxInBracket = round(taxable * bracket.rate);
    totalTaxAnnual    += taxInBracket;

    bracketBreakdown.push({
      label:         bracket.label,
      rate:          bracket.rate,
      from:          prevUpTo,
      to:            bracket.upTo === Infinity ? annualTaxable : bracket.upTo,
      taxableAmount: round(taxable),
      taxAmount:     taxInBracket,
      pct:           annualTaxable > 0 ? (taxable / annualTaxable) * 100 : 0,
    });

    remaining -= taxable;
    if (remaining <= 0) break;
  }

  totalTaxAnnual       = round(totalTaxAnnual);
  const monthlyTax     = round(totalTaxAnnual / 12);
  const netMonthly     = round(salary - siMonthly - monthlyTax);
  const effectiveTaxRate = annualGross > 0 ? round((totalTaxAnnual / annualGross) * 100, 2) : 0;

  return {
    isValid: true,
    salary,
    siMonthly,
    siAnnual,
    annualGross,
    annualTaxable,
    totalTaxAnnual,
    monthlyTax,
    netMonthly,
    effectiveTaxRate,
    bracketBreakdown,
  };
}

// ─── UAE Corporate Tax (Federal Decree-Law 47/2022) ──────────────────────────
// 0% on taxable income ≤ AED 375,000
// 9% on taxable income above AED 375,000
// Small Business Relief: eligible if annual revenue ≤ AED 3,000,000
const UAE_CT_THRESHOLD    = 375000;   // exempt band
const UAE_CT_RATE         = 0.09;     // 9% on income above threshold
const UAE_SBR_MAX_REVENUE = 3000000;  // small business relief ceiling

export const UAE_CT_THRESHOLD_VALUE    = UAE_CT_THRESHOLD;
export const UAE_CT_RATE_VALUE         = UAE_CT_RATE;
export const UAE_SBR_MAX_REVENUE_VALUE = UAE_SBR_MAX_REVENUE;

export function calculateUaeCorporateTax({ annualProfit, annualRevenue = 0 }) {
  const profit  = parseFloat(String(annualProfit).replace(/,/g, '')) || 0;
  const revenue = parseFloat(String(annualRevenue).replace(/,/g, '')) || 0;
  if (profit < 0 || isNaN(profit)) return { isValid: false };

  const eligibleForSBR = revenue > 0 && revenue <= UAE_SBR_MAX_REVENUE;
  const taxableIncome  = profit;
  const taxableAbove   = Math.max(0, taxableIncome - UAE_CT_THRESHOLD);
  const taxDue         = round(taxableAbove * UAE_CT_RATE);
  const netAfterTax    = round(profit - taxDue);
  const effectiveRate  = profit > 0 ? round((taxDue / profit) * 100, 2) : 0;

  return {
    isValid:        true,
    profit,
    revenue,
    taxableIncome,
    exemptBand:     Math.min(taxableIncome, UAE_CT_THRESHOLD),
    taxableAbove,
    taxDue,
    netAfterTax,
    effectiveRate,
    eligibleForSBR,
    rate:           UAE_CT_RATE,
  };
}

// ─── Bill Splitter ────────────────────────────────────────────────────────────
export function calculateBillSplit({ billAmount, tipPercent = 0, numPeople = 2 }) {
  const amount = parseFloat(String(billAmount).replace(/,/g, '')) || 0;
  const tip    = parseFloat(String(tipPercent))  || 0;
  const people = parseInt(String(numPeople), 10) || 2;
  if (amount <= 0 || people < 1) return { isValid: false };

  const tipAmount   = round(amount * tip / 100);
  const total       = round(amount + tipAmount);
  const perPerson   = round(total / people);
  const perPersonNoTip = round(amount / people);

  return {
    isValid:       true,
    billAmount:    amount,
    tipPercent:    tip,
    tipAmount,
    total,
    numPeople:     people,
    perPerson,
    perPersonNoTip,
  };
}

// ─── Work Hours Calculator ─────────────────────────────────────────────────────
const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function parseTimeToMinutes(str) {
  const [h, m] = (str || '').split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

export function calculateWorkHours({ schedule, regularDailyHours = 8, regularWeeklyHours = 40 }) {
  if (!Array.isArray(schedule) || schedule.length !== 7) return { isValid: false };

  let totalMinutes = 0;
  const days = schedule.map((day, i) => {
    const name = DAY_NAMES_AR[i];
    if (!day.active) return { active: false, minutes: 0, hours: 0, dailyOvertime: 0, name };

    const startMin = parseTimeToMinutes(day.start);
    const endMin   = parseTimeToMinutes(day.end);
    if (startMin === null || endMin === null || endMin <= startMin) {
      return { active: true, minutes: 0, hours: 0, dailyOvertime: 0, name, invalid: true };
    }

    const breakMin  = Math.max(0, parseInt(day.breakMin, 10) || 0);
    const worked    = Math.max(0, endMin - startMin - breakMin);
    const workedH   = worked / 60;
    const overtime  = round(Math.max(0, workedH - regularDailyHours), 2);
    totalMinutes   += worked;

    return { active: true, minutes: worked, hours: round(workedH, 2), dailyOvertime: overtime, name };
  });

  const totalHours    = round(totalMinutes / 60, 2);
  const overtimeHours = round(Math.max(0, totalHours - regularWeeklyHours), 2);
  const regularHours  = round(Math.min(totalHours, regularWeeklyHours), 2);
  const activeDays    = days.filter((d) => d.active && d.minutes > 0).length;

  return {
    isValid: true,
    days,
    totalMinutes,
    totalHours,
    regularHours,
    overtimeHours,
    activeDays,
  };
}
