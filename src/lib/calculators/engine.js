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
    serviceLabel:
      `${service.years} سنة و${service.months} شهر` +
      (service.days ? ` و${service.days} يوم` : ''),
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
