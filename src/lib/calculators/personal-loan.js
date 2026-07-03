/**
 * Personal loan affordability + installment calculator.
 * Saudi: SAMA cap = max(salary × 60 months, DBR 33%)
 * UAE:   CBUAE cap = DBR 50%, max unsecured AED 250,000
 *
 * Two modes per country:
 *  - installment: given loan amount → monthly payment
 *  - affordability: given salary → max loan amount
 */

// ── Saudi (SAMA) ─────────────────────────────────────────────────────────────

const SAMA_DBR = 0.33;
const SAMA_MAX_MULTIPLIER = 60; // max = 60 months of salary

export const SAUDI_LOAN_TERMS = [
  { value: 12,  label: '12 شهراً (سنة)' },
  { value: 24,  label: '24 شهراً (سنتان)' },
  { value: 36,  label: '36 شهراً (3 سنوات)' },
  { value: 48,  label: '48 شهراً (4 سنوات)' },
  { value: 60,  label: '60 شهراً (5 سنوات) — الحد الأقصى' },
];

export const UAE_PERSONAL_LOAN_TERMS = [
  { value: 12,  label: '12 شهراً (سنة)' },
  { value: 24,  label: '24 شهراً (سنتان)' },
  { value: 36,  label: '36 شهراً (3 سنوات)' },
  { value: 48,  label: '48 شهراً (4 سنوات)' },
  { value: 60,  label: '60 شهراً (5 سنوات)' },
  { value: 84,  label: '84 شهراً (7 سنوات)' },
];

// ── Shared amortization ───────────────────────────────────────────────────────

function calcMonthlyPayment(principal, annualRatePct, termMonths) {
  if (annualRatePct === 0) return principal / termMonths;
  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ── Saudi installment ─────────────────────────────────────────────────────────

/**
 * @param {{ loanAmount: number|string, annualRatePct: number, termMonths: number }} p
 */
export function calcSaudiLoanInstallment({ loanAmount, annualRatePct, termMonths }) {
  const principal = parseFloat(loanAmount) || 0;
  if (principal <= 0) return { isValid: false };

  const monthly      = calcMonthlyPayment(principal, annualRatePct, termMonths);
  const totalPayments = monthly * termMonths;
  const totalProfit   = totalPayments - principal;

  return {
    isValid: true,
    principal,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    annualRatePct,
    termMonths,
  };
}

// ── Saudi affordability ───────────────────────────────────────────────────────

/**
 * @param {{ salary: number|string, obligations: number|string, annualRatePct: number, termMonths: number }} p
 */
export function calcSaudiLoanAffordability({ salary, obligations, annualRatePct, termMonths }) {
  const sal  = parseFloat(salary)      || 0;
  const obs  = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };

  const maxMonthly  = sal * SAMA_DBR - obs;
  const samaCap1    = sal * SAMA_MAX_MULTIPLIER; // salary-multiple cap

  if (maxMonthly <= 0) return { isValid: true, maxLoan: 0, maxMonthly: 0, salary: sal, obligations: obs, dbrCap: SAMA_DBR, termMonths };

  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const dbrDrivenMax = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);

  const maxLoan = Math.min(dbrDrivenMax, samaCap1);

  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbrCap: SAMA_DBR,
    samaCap1: Math.round(samaCap1),
    termMonths,
    annualRatePct,
    capUsed: maxLoan === Math.round(samaCap1) ? 'salary-multiple' : 'dbr',
  };
}

// ── UAE installment ───────────────────────────────────────────────────────────

const CBUAE_DBR      = 0.50;
const UAE_MAX_UNSECURED = 250000; // AED

/**
 * @param {{ loanAmount: number|string, annualRatePct: number, termMonths: number }} p
 */
export function calcUaeLoanInstallment({ loanAmount, annualRatePct, termMonths }) {
  const principal = parseFloat(loanAmount) || 0;
  if (principal <= 0) return { isValid: false };

  const monthly       = calcMonthlyPayment(principal, annualRatePct, termMonths);
  const totalPayments = monthly * termMonths;
  const totalProfit   = totalPayments - principal;
  const exceedsUnsecuredCap = principal > UAE_MAX_UNSECURED;

  return {
    isValid: true,
    principal,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    annualRatePct,
    termMonths,
    exceedsUnsecuredCap,
    unsecuredCapAED: UAE_MAX_UNSECURED,
  };
}

// ── UAE affordability ─────────────────────────────────────────────────────────

/**
 * @param {{ salary: number|string, obligations: number|string, annualRatePct: number, termMonths: number }} p
 */
export function calcUaeLoanAffordability({ salary, obligations, annualRatePct, termMonths }) {
  const sal  = parseFloat(salary)      || 0;
  const obs  = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };

  const maxMonthly = sal * CBUAE_DBR - obs;
  if (maxMonthly <= 0) return { isValid: true, maxLoan: 0, maxMonthly: 0, salary: sal, obligations: obs, dbrCap: CBUAE_DBR, termMonths };

  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const dbrDrivenMax = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);

  const maxLoan = Math.min(dbrDrivenMax, UAE_MAX_UNSECURED);

  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbrCap: CBUAE_DBR,
    unsecuredCapAED: UAE_MAX_UNSECURED,
    termMonths,
    annualRatePct,
    exceedsUnsecuredCap: dbrDrivenMax > UAE_MAX_UNSECURED,
    capUsed: dbrDrivenMax > UAE_MAX_UNSECURED ? 'unsecured-cap' : 'dbr',
  };
}

// ── Kuwait (CBK) ──────────────────────────────────────────────────────────────
// CBK regulations: DBR 40% for Kuwaiti nationals, 30% for expats
// Max loan: 15× net monthly salary for nationals (cap KWD 70,000); KWD 15,000 for expats
// Max term: 60 months

const CBK_DBR_NATIONAL = 0.40;
const CBK_DBR_EXPAT    = 0.30;
const CBK_MAX_EXPAT    = 15000; // KWD
const CBK_MAX_NATIONAL_MULTIPLIER = 15; // × monthly salary
const CBK_MAX_NATIONAL = 70000; // KWD hard ceiling

export const KUWAIT_LOAN_TERMS = [
  { value: 12,  label: '12 شهراً (سنة)' },
  { value: 24,  label: '24 شهراً (سنتان)' },
  { value: 36,  label: '36 شهراً (3 سنوات)' },
  { value: 48,  label: '48 شهراً (4 سنوات)' },
  { value: 60,  label: '60 شهراً (5 سنوات) — الحد الأقصى' },
];

/**
 * @param {{ loanAmount: number|string, annualRatePct: number, termMonths: number, borrowerType: 'national'|'expat' }} p
 */
export function calcKuwaitLoanInstallment({ loanAmount, annualRatePct, termMonths, borrowerType = 'national' }) {
  const principal = parseFloat(loanAmount) || 0;
  if (principal <= 0) return { isValid: false };

  const maxLoan = borrowerType === 'expat' ? CBK_MAX_EXPAT : CBK_MAX_NATIONAL;
  const exceedsCap = principal > maxLoan;

  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const monthly = r > 0
    ? Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
    : Math.round(principal / n);

  const totalPayments = monthly * n;
  const totalProfit   = totalPayments - principal;

  return {
    isValid: true,
    principal,
    monthly,
    totalPayments,
    totalProfit,
    termMonths,
    annualRatePct,
    exceedsCap,
    maxLoanKWD: maxLoan,
    borrowerType,
    dbrCap: borrowerType === 'expat' ? CBK_DBR_EXPAT : CBK_DBR_NATIONAL,
  };
}

/**
 * @param {{ salary: number|string, obligations: number|string, annualRatePct: number, termMonths: number, borrowerType: 'national'|'expat' }} p
 */
export function calcKuwaitLoanAffordability({ salary, obligations, annualRatePct, termMonths, borrowerType = 'national' }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };

  const dbr = borrowerType === 'expat' ? CBK_DBR_EXPAT : CBK_DBR_NATIONAL;
  const maxMonthly = sal * dbr - obs;
  if (maxMonthly <= 0) return { isValid: true, maxLoan: 0, maxMonthly: 0, salary: sal, obligations: obs, dbrCap: dbr, termMonths };

  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const dbrDrivenMax = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);

  const hardCap   = borrowerType === 'expat'
    ? CBK_MAX_EXPAT
    : Math.min(sal * CBK_MAX_NATIONAL_MULTIPLIER, CBK_MAX_NATIONAL);
  const maxLoan   = Math.min(dbrDrivenMax, hardCap);
  const capUsed   = dbrDrivenMax > hardCap
    ? (borrowerType === 'expat' ? 'expat-cap' : 'salary-multiple')
    : 'dbr';

  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbrCap: dbr,
    termMonths,
    annualRatePct,
    exceedsCap: dbrDrivenMax > hardCap,
    capUsed,
    hardCap,
    borrowerType,
  };
}

// ── Qatar (QCB) ───────────────────────────────────────────────────────────────
// Qatar Central Bank regulations:
// DBR: 50% of net salary for all borrowers (Qatari and expat alike)
// Max loan: QAR 2,000,000 for Qataris; QAR 400,000 for expats (or 1M for govt expats)
// Max term: 120 months (10 years) Qataris; 48 months (4 years) expats
// Min salary: QAR 5,000 Qataris; QAR 3,000 expats

const QCB_DBR = 0.50;
const QCB_MAX_QATARI = 2000000; // QAR
const QCB_MAX_EXPAT  = 400000;  // QAR (standard; some banks allow 1M for govt employees)

export const QATAR_LOAN_TERMS_NATIONAL = [
  { value: 12,  label: '12 شهراً (سنة)' },
  { value: 24,  label: '24 شهراً (سنتان)' },
  { value: 36,  label: '36 شهراً (3 سنوات)' },
  { value: 48,  label: '48 شهراً (4 سنوات)' },
  { value: 60,  label: '60 شهراً (5 سنوات)' },
  { value: 84,  label: '84 شهراً (7 سنوات)' },
  { value: 120, label: '120 شهراً (10 سنوات) — الحد الأقصى' },
];

export const QATAR_LOAN_TERMS_EXPAT = [
  { value: 12, label: '12 شهراً (سنة)' },
  { value: 24, label: '24 شهراً (سنتان)' },
  { value: 36, label: '36 شهراً (3 سنوات)' },
  { value: 48, label: '48 شهراً (4 سنوات) — الحد الأقصى للوافد' },
];

/**
 * @param {{ loanAmount: number|string, annualRatePct: number, termMonths: number, borrowerType: 'national'|'expat' }} p
 */
export function calcQatarLoanInstallment({ loanAmount, annualRatePct, termMonths, borrowerType = 'national' }) {
  const principal = parseFloat(loanAmount) || 0;
  if (principal <= 0) return { isValid: false };

  const maxLoan      = borrowerType === 'expat' ? QCB_MAX_EXPAT : QCB_MAX_QATARI;
  const exceedsCap   = principal > maxLoan;
  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const monthly = r > 0
    ? Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
    : Math.round(principal / n);

  const totalPayments = monthly * n;
  const totalProfit   = totalPayments - principal;

  return {
    isValid: true,
    principal,
    monthly,
    totalPayments,
    totalProfit,
    termMonths,
    annualRatePct,
    exceedsCap,
    maxLoanQAR: maxLoan,
    borrowerType,
    dbrCap: QCB_DBR,
  };
}

/**
 * @param {{ salary: number|string, obligations: number|string, annualRatePct: number, termMonths: number, borrowerType: 'national'|'expat' }} p
 */
export function calcQatarLoanAffordability({ salary, obligations, annualRatePct, termMonths, borrowerType = 'national' }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };

  const maxMonthly = sal * QCB_DBR - obs;
  if (maxMonthly <= 0) return { isValid: true, maxLoan: 0, maxMonthly: 0, salary: sal, obligations: obs, dbrCap: QCB_DBR, termMonths };

  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  const dbrDrivenMax = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);

  const hardCap = borrowerType === 'expat' ? QCB_MAX_EXPAT : QCB_MAX_QATARI;
  const maxLoan = Math.min(dbrDrivenMax, hardCap);
  const capUsed = dbrDrivenMax > hardCap
    ? (borrowerType === 'expat' ? 'expat-cap' : 'national-cap')
    : 'dbr';

  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbrCap: QCB_DBR,
    termMonths,
    annualRatePct,
    exceedsCap: dbrDrivenMax > hardCap,
    capUsed,
    hardCap,
    borrowerType,
  };
}

// ── Bahrain (CBB — Central Bank of Bahrain) ──────────────────────────────────

// CBB CM-8: DBR 50% of gross income for ALL borrowers (nationals + expats)
// High-earner threshold: BHD 3,000/month — DBR may be relaxed at bank discretion
// Max term: 84 months nationals, 60 months expats (practical bank cap)
// Max amounts (bank-set): BHD 100-150K nationals, BHD 60K expats

const CBB_DBR = 0.50;
const CBB_HIGH_EARNER = 3000;    // BHD — threshold above which DBR may flex
const CBB_MAX_NATIONAL = 100000; // BHD — common practical cap (NBB: 150K possible)
const CBB_MAX_EXPAT    = 60000;  // BHD — standard cap (Standard Chartered)

export const BAHRAIN_BORROWER_TYPES = [
  { value: 'national', label: 'بحريني (مواطن)', maxTerm: 84, maxLoan: CBB_MAX_NATIONAL },
  { value: 'expat',    label: 'وافد مقيم',       maxTerm: 60, maxLoan: CBB_MAX_EXPAT },
];

export const BAHRAIN_LOAN_TERMS_NATIONAL = [
  { value: 12, label: '12 شهراً (سنة)' },
  { value: 24, label: '24 شهراً (سنتان)' },
  { value: 36, label: '36 شهراً (3 سنوات)' },
  { value: 48, label: '48 شهراً (4 سنوات)' },
  { value: 60, label: '60 شهراً (5 سنوات)' },
  { value: 72, label: '72 شهراً (6 سنوات)' },
  { value: 84, label: '84 شهراً (7 سنوات — الحد الأقصى)' },
];

export const BAHRAIN_LOAN_TERMS_EXPAT = [
  { value: 12, label: '12 شهراً (سنة)' },
  { value: 24, label: '24 شهراً (سنتان)' },
  { value: 36, label: '36 شهراً (3 سنوات)' },
  { value: 48, label: '48 شهراً (4 سنوات)' },
  { value: 60, label: '60 شهراً (5 سنوات — الحد المعتاد للوافدين)' },
];

export function calcBahrainLoanInstallment({ loanAmount, annualRatePct, termMonths, borrowerType }) {
  const borrower = BAHRAIN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_BORROWER_TYPES[0];
  const loan = Math.min(parseFloat(loanAmount) || 0, borrower.maxLoan);
  if (loan <= 0) return { isValid: false };
  const r = (parseFloat(annualRatePct) / 100) / 12;
  const n = Math.min(parseInt(termMonths) || borrower.maxTerm, borrower.maxTerm);
  const monthly = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  const totalPayments = monthly * n;
  const totalProfit   = totalPayments - loan;
  return {
    isValid: true,
    loanAmount: loan,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalProfit),
    termMonths: n,
    annualRatePct: parseFloat(annualRatePct),
    cappedAtMax: parseFloat(loanAmount) > borrower.maxLoan,
    maxLoan: borrower.maxLoan,
    borrowerType,
  };
}

export function calcBahrainLoanAffordability({ salary, obligations, annualRatePct, termMonths, borrowerType }) {
  const borrower = BAHRAIN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? BAHRAIN_BORROWER_TYPES[0];
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };
  const r = (parseFloat(annualRatePct) / 100) / 12;
  const n = Math.min(parseInt(termMonths) || borrower.maxTerm, borrower.maxTerm);
  const dbr = CBB_DBR;
  const maxMonthly = Math.max(0, sal * dbr - obs);
  const rawMaxLoan = r > 0
    ? maxMonthly * (1 - Math.pow(1 + r, -n)) / r
    : maxMonthly * n;
  const maxLoan = Math.min(Math.round(rawMaxLoan), borrower.maxLoan);
  const capUsed = rawMaxLoan > borrower.maxLoan ? 'bank-cap' : 'dbr';
  const isHighEarner = sal >= CBB_HIGH_EARNER;
  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr,
    capUsed,
    termMonths: n,
    isHighEarner,
    borrowerType,
    maxLoanCap: borrower.maxLoan,
  };
}

// ── Oman Personal Loan (CBO rules) ───────────────────────────────────────────
// Source: Central Bank of Oman (CBO) Consumer Protection Rules 2020
// DBR: 50% of net salary (all borrowers)
// Max term: 120 months nationals, 60 months expats
// OMR (Omani Rial) currency

const CBO_DBR = 0.50;

export const OMAN_BORROWER_TYPES = [
  { value: 'national', label: 'عماني (مواطن)',   maxTerm: 120, maxLoan: null },
  { value: 'expat',    label: 'وافد مقيم',       maxTerm: 60,  maxLoan: 30000 },
];

export const OMAN_LOAN_TERMS_NATIONAL = [
  { value: 12,  label: '12 شهراً (سنة)'           },
  { value: 24,  label: '24 شهراً (سنتان)'          },
  { value: 36,  label: '36 شهراً (3 سنوات)'        },
  { value: 48,  label: '48 شهراً (4 سنوات)'        },
  { value: 60,  label: '60 شهراً (5 سنوات)'        },
  { value: 84,  label: '84 شهراً (7 سنوات)'        },
  { value: 120, label: '120 شهراً (10 سنوات — الحد الأقصى)' },
];

export const OMAN_LOAN_TERMS_EXPAT = [
  { value: 12, label: '12 شهراً (سنة)'           },
  { value: 24, label: '24 شهراً (سنتان)'          },
  { value: 36, label: '36 شهراً (3 سنوات)'        },
  { value: 48, label: '48 شهراً (4 سنوات)'        },
  { value: 60, label: '60 شهراً (5 سنوات — الحد الأقصى)' },
];

export function calcOmanLoanInstallment({ loanAmount, annualRatePct, termMonths, borrowerType = 'national' }) {
  const borrower = OMAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? OMAN_BORROWER_TYPES[0];
  let loan = parseFloat(loanAmount) || 0;
  if (borrower.maxLoan) loan = Math.min(loan, borrower.maxLoan);
  if (loan <= 0) return { isValid: false };
  const rate = parseFloat(annualRatePct) || 7.5;
  const n    = Math.min(parseInt(termMonths) || 60, borrower.maxTerm);
  const r    = (rate / 100) / 12;
  const monthly = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  const totalPayments = monthly * n;
  return {
    isValid: true,
    loanAmount: loan,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalPayments - loan),
    termMonths: n,
    annualRatePct: rate,
    cappedAtMax: borrower.maxLoan !== null && parseFloat(loanAmount) > borrower.maxLoan,
    borrowerType,
  };
}

export function calcOmanLoanAffordability({ salary, obligations, annualRatePct, termMonths, borrowerType = 'national' }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };
  const borrower   = OMAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? OMAN_BORROWER_TYPES[0];
  const rate       = parseFloat(annualRatePct) || 7.5;
  const n          = Math.min(parseInt(termMonths) || 60, borrower.maxTerm);
  const r          = (rate / 100) / 12;
  const maxMonthly = Math.max(0, sal * CBO_DBR - obs);
  let rawMaxLoan   = r > 0
    ? maxMonthly * (1 - Math.pow(1 + r, -n)) / r
    : maxMonthly * n;
  let capUsed = 'dbr';
  if (borrower.maxLoan !== null && rawMaxLoan > borrower.maxLoan) {
    rawMaxLoan = borrower.maxLoan;
    capUsed    = 'bank-cap';
  }
  return {
    isValid: true,
    maxLoan: Math.round(rawMaxLoan),
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr: CBO_DBR,
    capUsed,
    termMonths: n,
    maxLoanCap: borrower.maxLoan,
    borrowerType,
  };
}

// ── Egypt Personal Loan (CBE rules) ──────────────────────────────────────────
// Source: Central Bank of Egypt (CBE) retail banking circular 2022
// DBR: 35% private/expat, 40% government/public sector
// Max term: 60 months private, 84 months government employees
// EGP (Egyptian Pound) currency — rates high post-2024 hikes (~25–30%)

const CBE_DBR_PRIVATE = 0.35;
const CBE_DBR_GOVT    = 0.40;

export const EGYPT_LOAN_BORROWER_TYPES = [
  { value: 'private', label: 'موظف قطاع خاص / أعمال حرة', dbr: CBE_DBR_PRIVATE, maxTerm: 60, minSalary: 3000  },
  { value: 'govt',    label: 'موظف حكومي / قطاع عام',      dbr: CBE_DBR_GOVT,    maxTerm: 84, minSalary: 2000  },
  { value: 'expat',   label: 'أجنبي مقيم',                  dbr: CBE_DBR_PRIVATE, maxTerm: 48, minSalary: 5000  },
];

export const EGYPT_LOAN_TERMS_PRIVATE = [
  { value: 12, label: '12 شهراً (سنة)'           },
  { value: 24, label: '24 شهراً (سنتان)'          },
  { value: 36, label: '36 شهراً (3 سنوات)'        },
  { value: 48, label: '48 شهراً (4 سنوات)'        },
  { value: 60, label: '60 شهراً (5 سنوات — الحد الأقصى)' },
];

export const EGYPT_LOAN_TERMS_GOVT = [
  { value: 12, label: '12 شهراً (سنة)'           },
  { value: 24, label: '24 شهراً (سنتان)'          },
  { value: 36, label: '36 شهراً (3 سنوات)'        },
  { value: 48, label: '48 شهراً (4 سنوات)'        },
  { value: 60, label: '60 شهراً (5 سنوات)'        },
  { value: 84, label: '84 شهراً (7 سنوات — قطاع عام)' },
];

export const EGYPT_LOAN_TERMS_EXPAT = [
  { value: 12, label: '12 شهراً (سنة)'           },
  { value: 24, label: '24 شهراً (سنتان)'          },
  { value: 36, label: '36 شهراً (3 سنوات)'        },
  { value: 48, label: '48 شهراً (4 سنوات — الحد الأقصى)' },
];

export function calcEgyptLoanInstallment({ loanAmount, annualRatePct, termMonths, borrowerType = 'private' }) {
  const loan = parseFloat(loanAmount) || 0;
  if (loan <= 0) return { isValid: false };
  const borrower = EGYPT_LOAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? EGYPT_LOAN_BORROWER_TYPES[0];
  const rate     = parseFloat(annualRatePct) || 27.0;
  const n        = Math.min(parseInt(termMonths) || 60, borrower.maxTerm);
  const r        = (rate / 100) / 12;
  const monthly  = r > 0 ? loan * r / (1 - Math.pow(1 + r, -n)) : loan / n;
  const totalPayments = monthly * n;
  return {
    isValid: true,
    loanAmount: loan,
    monthly: Math.round(monthly),
    totalPayments: Math.round(totalPayments),
    totalProfit: Math.round(totalPayments - loan),
    termMonths: n,
    annualRatePct: rate,
    borrowerType,
  };
}

export function calcEgyptLoanAffordability({ salary, obligations, annualRatePct, termMonths, borrowerType = 'private' }) {
  const sal = parseFloat(salary)      || 0;
  const obs = parseFloat(obligations) || 0;
  if (sal <= 0) return { isValid: false };
  const borrower   = EGYPT_LOAN_BORROWER_TYPES.find((b) => b.value === borrowerType) ?? EGYPT_LOAN_BORROWER_TYPES[0];
  const rate       = parseFloat(annualRatePct) || 27.0;
  const n          = Math.min(parseInt(termMonths) || 60, borrower.maxTerm);
  const r          = (rate / 100) / 12;
  const maxMonthly = Math.max(0, sal * borrower.dbr - obs);
  const maxLoan    = r > 0
    ? Math.round(maxMonthly * (1 - Math.pow(1 + r, -n)) / r)
    : Math.round(maxMonthly * n);
  const belowMinSalary = sal < borrower.minSalary;
  return {
    isValid: true,
    maxLoan,
    maxMonthly: Math.round(maxMonthly),
    salary: sal,
    obligations: obs,
    dbr: borrower.dbr,
    termMonths: n,
    belowMinSalary,
    minSalary: borrower.minSalary,
    borrowerType,
  };
}
