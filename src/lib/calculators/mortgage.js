/**
 * Saudi / Gulf mortgage (Islamic home finance) calculator.
 * Uses Murabaha-style flat profit calculation common in KSA.
 *
 * Mode 1 — Affordability: given salary + obligations, what's the max financing?
 * Mode 2 — Installment:   given property price + down payment, what's the monthly payment?
 */

// Saudi DBR (Debt Burden Ratio) cap per SAMA guidelines
const DBR_CAP_STANDARD  = 0.33; // 33% of salary for most borrowers
const DBR_CAP_SUPPORTED = 0.45; // 45% with housing support (الدعم السكني)

export const LOAN_TERMS = [
  { value: 10, label: '10 سنوات' },
  { value: 15, label: '15 سنة' },
  { value: 20, label: '20 سنة' },
  { value: 25, label: '25 سنة' },
  { value: 30, label: '30 سنة' },
];

export const DOWN_PAYMENT_OPTIONS = [
  { value: 10, label: '10% (الحد الأدنى لغير المستفيد من البنك)' },
  { value: 15, label: '15%' },
  { value: 20, label: '20%' },
  { value: 25, label: '25%' },
  { value: 30, label: '30%' },
  { value: 0,  label: 'بدون دفعة أولى (بعض برامج الدعم)' },
];

/**
 * Monthly Murabaha payment for a given loan amount and rate/term.
 * Uses a standard amortization formula as proxy for flat-profit schedule.
 * @param {number} principal
 * @param {number} annualRatePct  — annual profit margin %
 * @param {number} termYears
 */
export function calcMonthlyPayment(principal, annualRatePct, termYears) {
  if (annualRatePct === 0) return principal / (termYears * 12);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Mode 2 — Installment calculator.
 */
export function calcMortgageInstallment({ propertyPrice, downPaymentPct, annualRatePct, termYears }) {
  const price      = parseFloat(propertyPrice) || 0;
  const dpPct      = parseFloat(downPaymentPct) ?? 10;
  const rate       = parseFloat(annualRatePct)  || 4.5;
  const term       = parseInt(termYears)         || 20;

  if (price <= 0 || term <= 0) return { isValid: false };

  const downPayment   = price * (dpPct / 100);
  const loanAmount    = price - downPayment;
  const monthly       = calcMonthlyPayment(loanAmount, rate, term);
  const totalPayments = monthly * term * 12;
  const totalProfit   = totalPayments - loanAmount;

  return {
    isValid: true,
    propertyPrice: price,
    downPayment,
    loanAmount,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    annualRatePct: rate,
    termYears: term,
    dpPct,
  };
}

/**
 * Mode 1 — Affordability calculator.
 * Returns max loan and max property price for a given salary.
 */
export function calcMortgageAffordability({ salary, obligations, annualRatePct, termYears, hasHousingSupport, downPaymentPct }) {
  const s           = parseFloat(salary)      || 0;
  const obs         = parseFloat(obligations) || 0;
  const rate        = parseFloat(annualRatePct) || 4.5;
  const term        = parseInt(termYears)      || 20;
  const dpPct       = parseFloat(downPaymentPct) ?? 10;
  const dbrCap      = hasHousingSupport ? DBR_CAP_SUPPORTED : DBR_CAP_STANDARD;

  if (s <= 0) return { isValid: false };

  const maxMonthly  = Math.max(0, s * dbrCap - obs);
  if (maxMonthly <= 0) return { isValid: true, maxMonthly: 0, maxLoan: 0, maxProperty: 0, dbrCap, salary: s, obligations: obs };

  const r = rate / 100 / 12;
  const n = term * 12;
  const maxLoan = r > 0
    ? (maxMonthly * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n))
    : maxMonthly * n;

  const maxProperty = dpPct > 0 ? maxLoan / (1 - dpPct / 100) : maxLoan;

  return {
    isValid: true,
    maxMonthly: Math.round(maxMonthly),
    maxLoan:     Math.round(maxLoan),
    maxProperty: Math.round(maxProperty),
    dbrCap,
    salary: s,
    obligations: obs,
    rate,
    termYears: term,
  };
}

// ── UAE mortgage — Central Bank of UAE LTV rules ─────────────────────────────

export const UAE_PROPERTY_TYPES = [
  { value: 'first-resident',   label: 'مقيم — منزل أول (≤ 5M د.إ)',   maxLtv: 0.80 },
  { value: 'first-national',   label: 'مواطن إماراتي — منزل أول',      maxLtv: 0.85 },
  { value: 'first-high-value', label: 'مقيم — منزل أول (> 5M د.إ)',    maxLtv: 0.70 },
  { value: 'second',           label: 'منزل ثانٍ / استثماري (مقيم)',    maxLtv: 0.65 },
  { value: 'non-resident',     label: 'غير مقيم',                       maxLtv: 0.50 },
];

export const UAE_LOAN_TERMS = [
  { value: 5,  label: '5 سنوات' },
  { value: 10, label: '10 سنوات' },
  { value: 15, label: '15 سنوات' },
  { value: 20, label: '20 سنوات' },
  { value: 25, label: '25 سنة (الحد الأقصى)' },
];

// UAE Central Bank DBR cap = 50% for residents
const UAE_DBR_CAP = 0.50;

/**
 * @param {{ propertyPrice: number|string, propertyType: string, annualRatePct: number, termYears: number }} p
 */
export function calcUaeMortgageInstallment({ propertyPrice, propertyType, annualRatePct, termYears }) {
  const price = parseFloat(propertyPrice) || 0;
  if (price <= 0) return { isValid: false };

  const typeInfo = UAE_PROPERTY_TYPES.find((t) => t.value === propertyType) ?? UAE_PROPERTY_TYPES[0];
  const maxLtv = typeInfo.maxLtv;
  const maxLoan = Math.floor(price * maxLtv);
  const minDown = price - maxLoan;
  const monthly = calcMonthlyPayment(maxLoan, annualRatePct, termYears);
  const totalPayments = monthly * termYears * 12;
  const totalProfit = totalPayments - maxLoan;

  return {
    isValid: true,
    propertyPrice: price,
    maxLtv,
    maxLoan,
    minDownPayment: minDown,
    minDownPct: Math.round((1 - maxLtv) * 100),
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    annualRatePct,
    termYears,
    propertyTypeLabel: typeInfo.label,
  };
}

/**
 * @param {{ salary: number|string, obligations: number|string, annualRatePct: number, termYears: number }} p
 */
export function calcUaeMortgageAffordability({ salary, obligations, annualRatePct, termYears }) {
  const sal  = parseFloat(salary)      || 0;
  const obs  = parseFloat(obligations) || 0;
  const rate = annualRatePct;
  const term = parseInt(termYears)     || 25;

  if (sal <= 0) return { isValid: false };

  const maxMonthly = sal * UAE_DBR_CAP - obs;
  if (maxMonthly <= 0) return { isValid: true, maxLoan: 0, maxProperty: 0, maxMonthly: 0, salary: sal, obligations: obs, dbrCap: UAE_DBR_CAP, rate, termYears: term };

  const r = (rate / 100) / 12;
  const n = term * 12;
  const maxLoan = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);

  // Assume 80% LTV (resident, first home standard)
  const maxProperty = Math.round(maxLoan / 0.80);

  return {
    isValid: true,
    maxLoan,
    maxProperty,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbrCap: UAE_DBR_CAP,
    rate,
    termYears: term,
  };
}

// ── Qatar Mortgage (QCB July 2023 regulations) ────────────────────────────────

export const QATAR_BORROWER_TYPES_MORTGAGE = [
  { value: 'qatari',       label: 'قطري',          dbr: 0.75 },
  { value: 'resident',     label: 'مقيم (وافد)',    dbr: 0.50 },
  { value: 'non-resident', label: 'غير مقيم',       dbr: 0.50 },
];

export const QATAR_PROPERTY_TYPES_MORTGAGE = [
  { value: 'residential',        label: 'سكني (للاستخدام الشخصي)',  threshold: 6_000_000 },
  { value: 'investment',         label: 'استثماري / تجاري',          threshold: 10_000_000 },
  { value: 'under-construction', label: 'تحت الإنشاء',               threshold: null },
];

export const QATAR_MORTGAGE_TERMS = [
  { value: 5,  label: '5 سنوات' },
  { value: 10, label: '10 سنوات' },
  { value: 15, label: '15 سنة' },
  { value: 20, label: '20 سنة' },
  { value: 25, label: '25 سنة' },
  { value: 30, label: '30 سنة (قطري — سكني)' },
];

function _qatarLtv(borrowerType, propertyType, propertyValue) {
  if (propertyType === 'under-construction') {
    return borrowerType === 'qatari' ? { ltv: 0.60, maxTerm: 20 } : { ltv: 0.50, maxTerm: 15 };
  }
  if (propertyType === 'residential') {
    const t = 6_000_000;
    if (borrowerType === 'qatari')
      return propertyValue <= t ? { ltv: 0.80, maxTerm: 30 } : { ltv: 0.75, maxTerm: 30 };
    if (borrowerType === 'resident')
      return propertyValue <= t ? { ltv: 0.75, maxTerm: 25 } : { ltv: 0.70, maxTerm: 25 };
    return { ltv: 0.60, maxTerm: 20 };
  }
  // investment
  const t = 10_000_000;
  if (borrowerType === 'qatari')
    return propertyValue <= t ? { ltv: 0.75, maxTerm: 25 } : { ltv: 0.70, maxTerm: 25 };
  if (borrowerType === 'resident')
    return propertyValue <= t ? { ltv: 0.70, maxTerm: 25 } : { ltv: 0.65, maxTerm: 25 };
  return propertyValue <= t ? { ltv: 0.60, maxTerm: 20 } : { ltv: 0.60, maxTerm: 15 };
}

function _calcIslamicInstallment(principal, flatRatePct, termYears) {
  const n = termYears * 12;
  if (n <= 0) return 0;
  const total = principal * (1 + (flatRatePct / 100) * termYears);
  return total / n;
}

export function calcQatarMortgageInstallment({ borrowerType, propertyType, propertyValue, annualRatePct, termYears, financeType }) {
  const price = parseFloat(propertyValue) || 0;
  if (price <= 0) return { isValid: false };
  const rate  = parseFloat(annualRatePct) || 4.5;
  const { ltv, maxTerm } = _qatarLtv(borrowerType, propertyType, price);
  const term   = Math.min(parseInt(termYears) || maxTerm, maxTerm);
  const maxLoan = Math.floor(price * ltv);
  const minDown = price - maxLoan;
  const monthly = financeType === 'islamic'
    ? _calcIslamicInstallment(maxLoan, rate, term)
    : calcMonthlyPayment(maxLoan, rate, term);
  const totalPayments = monthly * term * 12;
  const totalProfit   = totalPayments - maxLoan;
  return {
    isValid: true,
    propertyValue: price,
    ltv,
    maxTerm,
    termYears: term,
    maxLoan,
    minDownPayment: Math.round(minDown),
    minDownPct: Math.round((1 - ltv) * 100),
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    annualRatePct: rate,
    financeType,
  };
}

export function calcQatarMortgageAffordability({ borrowerType, propertyType, salary, obligations, annualRatePct, termYears, financeType }) {
  const sal = parseFloat(salary) || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };
  const rate = parseFloat(annualRatePct) || 4.5;
  const borrower = QATAR_BORROWER_TYPES_MORTGAGE.find((b) => b.value === borrowerType) ?? QATAR_BORROWER_TYPES_MORTGAGE[0];
  const dbr  = borrower.dbr;
  const { ltv, maxTerm } = _qatarLtv(borrowerType, propertyType, 0);
  const term = Math.min(parseInt(termYears) || maxTerm, maxTerm);
  const maxMonthly = Math.max(0, sal * dbr - obs);
  let maxLoan;
  if (financeType === 'islamic') {
    const denom = (1 + (rate / 100) * term) / (term * 12);
    maxLoan = denom > 0 ? Math.round(maxMonthly / denom) : 0;
  } else {
    const r = (rate / 100) / 12;
    const n = term * 12;
    maxLoan = r > 0
      ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
      : Math.round(maxMonthly * n);
  }
  const maxProperty = ltv > 0 ? Math.round(maxLoan / ltv) : maxLoan;
  return {
    isValid: true,
    maxLoan,
    maxProperty,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr,
    ltv,
    minDownPct: Math.round((1 - ltv) * 100),
    termYears: term,
    maxTerm,
  };
}

// ── Kuwait Housing Finance (CBK rules — no mortgage law yet) ─────────────────

// Kuwait: commercial banks offer salary-backed housing installment loans.
// True mortgage law still in draft (as of 2026). CBK caps: KD 70,000, 15 years, DBR 40%.
// Kuwait Credit Bank (KCB): 0% government program for nationals only (long wait list).

export const KUWAIT_FINANCE_TYPES = [
  { value: 'conventional', label: 'تقليدي (فائدة متناقصة)' },
  { value: 'islamic',      label: 'إسلامي (مرابحة)' },
];

export const KUWAIT_HOUSING_TERMS = [
  { value: 60,  label: '5 سنوات' },
  { value: 84,  label: '7 سنوات' },
  { value: 120, label: '10 سنوات' },
  { value: 144, label: '12 سنة' },
  { value: 180, label: '15 سنة (الحد الأقصى)' },
];

const KW_MAX_LOAN = 70000;
const KW_DBR      = 0.40;

export function calcKuwaitHousingInstallment({ loanAmount, annualRatePct, termMonths, financeType }) {
  const loan = Math.min(parseFloat(loanAmount) || 0, KW_MAX_LOAN);
  if (loan <= 0) return { isValid: false };
  const rate = parseFloat(annualRatePct) || 5.5;
  const n    = parseInt(termMonths) || 180;
  let monthly;
  if (financeType === 'islamic') {
    const years = n / 12;
    monthly = _calcIslamicInstallment(loan, rate, years);
  } else {
    const r = (rate / 100) / 12;
    monthly = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  }
  const totalPayments = monthly * n;
  const totalProfit   = totalPayments - loan;
  return {
    isValid: true,
    loanAmount: loan,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    termMonths: n,
    annualRatePct: rate,
    financeType,
    cappedAtMax: parseFloat(loanAmount) > KW_MAX_LOAN,
  };
}

export function calcKuwaitHousingAffordability({ salary, obligations, annualRatePct, termMonths, financeType }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };
  const rate = parseFloat(annualRatePct) || 5.5;
  const n    = parseInt(termMonths)    || 180;
  const maxMonthly = Math.max(0, sal * KW_DBR - obs);
  let rawMaxLoan;
  if (financeType === 'islamic') {
    const years = n / 12;
    const denom = (1 + (rate / 100) * years) / n;
    rawMaxLoan = denom > 0 ? maxMonthly / denom : 0;
  } else {
    const r = (rate / 100) / 12;
    rawMaxLoan = r > 0
      ? maxMonthly * (1 - Math.pow(1 + r, -n)) / r
      : maxMonthly * n;
  }
  const maxLoan = Math.min(Math.round(rawMaxLoan), KW_MAX_LOAN);
  const capUsed = rawMaxLoan > KW_MAX_LOAN ? 'cbk-cap' : 'dbr';
  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr: KW_DBR,
    capUsed,
    termMonths: n,
  };
}

// ── Bahrain Mortgage (CBB rules) ─────────────────────────────────────────────
// Source: Central Bank of Bahrain (CBB) Mortgage Finance Rulebook (Module MF)
// LTV: 70% residential nationals / 60% residential expats / 60% investment
// DBR: 50% (matching CBB retail banking directive)
// Max term: 25 years nationals, 20 years expats
// Finance types: conventional reducing balance + Islamic Murabaha

export const BAHRAIN_MORTGAGE_BORROWER_TYPES = [
  { value: 'national', label: 'بحريني (مواطن)', ltv: 0.70, maxTerm: 25, dbr: 0.50 },
  { value: 'expat',    label: 'وافد مقيم',       ltv: 0.60, maxTerm: 20, dbr: 0.50 },
];

export const BAHRAIN_MORTGAGE_PROPERTY_TYPES = [
  { value: 'residential',       label: 'سكني',               ltvAdjust:  0    },
  { value: 'investment',        label: 'استثماري / تجاري',   ltvAdjust: -0.10 },
  { value: 'under-construction',label: 'تحت الإنشاء',        ltvAdjust: -0.10 },
];

export const BAHRAIN_MORTGAGE_FINANCE_TYPES = [
  { value: 'conventional', label: 'تقليدي (فائدة متناقصة)' },
  { value: 'islamic',      label: 'إسلامي (مرابحة)' },
];

export const BAHRAIN_MORTGAGE_TERMS_NATIONAL = [
  { value: 5,  label: '5 سنوات'  },
  { value: 10, label: '10 سنوات' },
  { value: 15, label: '15 سنة'   },
  { value: 20, label: '20 سنة'   },
  { value: 25, label: '25 سنة (الحد الأقصى)' },
];

export const BAHRAIN_MORTGAGE_TERMS_EXPAT = [
  { value: 5,  label: '5 سنوات'  },
  { value: 10, label: '10 سنوات' },
  { value: 15, label: '15 سنة'   },
  { value: 20, label: '20 سنة (الحد الأقصى)' },
];

export function calcBahrainMortgageInstallment({ borrowerType, propertyType, propertyValue, annualRatePct, termYears, financeType }) {
  const price = parseFloat(propertyValue) || 0;
  if (price <= 0) return { isValid: false };

  const borrower  = BAHRAIN_MORTGAGE_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_MORTGAGE_BORROWER_TYPES[0];
  const propType  = BAHRAIN_MORTGAGE_PROPERTY_TYPES.find((p) => p.value === propertyType) ?? BAHRAIN_MORTGAGE_PROPERTY_TYPES[0];
  const rate      = parseFloat(annualRatePct) || 5.5;
  const ltv       = Math.max(0.40, borrower.ltv + propType.ltvAdjust);
  const maxTerm   = borrower.maxTerm;
  const term      = Math.min(parseInt(termYears) || maxTerm, maxTerm);
  const maxLoan   = Math.floor(price * ltv);
  const minDown   = price - maxLoan;

  let monthly;
  if (financeType === 'islamic') {
    monthly = _calcIslamicInstallment(maxLoan, rate, term);
  } else {
    const r = (rate / 100) / 12;
    const n = term * 12;
    monthly = r > 0 ? maxLoan * r / (1 - Math.pow(1 + r, -n)) : maxLoan / n;
  }

  const totalPayments = monthly * term * 12;

  return {
    isValid: true,
    propertyValue: price,
    ltv,
    ltvPct: Math.round(ltv * 100),
    maxTerm,
    termYears: term,
    maxLoan,
    minDownPayment: Math.round(minDown),
    minDownPct: Math.round((1 - ltv) * 100),
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalPayments - maxLoan),
    annualRatePct: rate,
    financeType,
    borrowerType,
  };
}

export function calcBahrainMortgageAffordability({ borrowerType, propertyType, salary, obligations, annualRatePct, termYears, financeType }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };

  const borrower  = BAHRAIN_MORTGAGE_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_MORTGAGE_BORROWER_TYPES[0];
  const propType  = BAHRAIN_MORTGAGE_PROPERTY_TYPES.find((p) => p.value === propertyType) ?? BAHRAIN_MORTGAGE_PROPERTY_TYPES[0];
  const rate      = parseFloat(annualRatePct) || 5.5;
  const ltv       = Math.max(0.40, borrower.ltv + propType.ltvAdjust);
  const maxTerm   = borrower.maxTerm;
  const term      = Math.min(parseInt(termYears) || maxTerm, maxTerm);
  const maxMonthly = Math.max(0, sal * borrower.dbr - obs);

  let maxLoan;
  if (financeType === 'islamic') {
    const denom = (1 + (rate / 100) * term) / (term * 12);
    maxLoan = denom > 0 ? Math.round(maxMonthly / denom) : 0;
  } else {
    const r = (rate / 100) / 12;
    const n = term * 12;
    maxLoan = r > 0
      ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
      : Math.round(maxMonthly * n);
  }

  const maxProperty = ltv > 0 ? Math.round(maxLoan / ltv) : maxLoan;

  return {
    isValid: true,
    maxLoan,
    maxProperty,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr: borrower.dbr,
    ltv,
    ltvPct: Math.round(ltv * 100),
    minDownPct: Math.round((1 - ltv) * 100),
    termYears: term,
    maxTerm,
    borrowerType,
  };
}
