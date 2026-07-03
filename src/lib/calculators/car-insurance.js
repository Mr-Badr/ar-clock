/**
 * Saudi/UAE car insurance premium estimator.
 * Returns estimated range (SAR/AED) based on static actuarial proxies.
 * All numbers are public-domain estimates — not a quote engine.
 */

const DRIVER_AGE_BANDS = [
  { value: '18-21', label: '18 – 21 سنة', multiplier: 2.5, tpMin: 1500, tpMax: 3500 },
  { value: '22-25', label: '22 – 25 سنة', multiplier: 1.7, tpMin: 1100, tpMax: 2500 },
  { value: '26-30', label: '26 – 30 سنة', multiplier: 1.2, tpMin: 750, tpMax: 1600 },
  { value: '31-45', label: '31 – 45 سنة', multiplier: 1.0, tpMin: 600, tpMax: 1400 },
  { value: '46-60', label: '46 – 60 سنة', multiplier: 1.1, tpMin: 650, tpMax: 1550 },
  { value: '60+',   label: '60+ سنة',     multiplier: 1.3, tpMin: 800, tpMax: 1800 },
];

const CITY_FACTORS = {
  riyadh: { label: 'الرياض',  factor: 1.15 },
  jeddah: { label: 'جدة',     factor: 1.07 },
  other:  { label: 'مدن أخرى', factor: 1.0 },
};

const NO_CLAIM_DISCOUNTS = {
  '0':  { label: 'لا يوجد',  discount: 0 },
  '1-2':{ label: 'سنة – سنتان', discount: 0.10 },
  '3-4':{ label: '3 – 4 سنوات', discount: 0.20 },
  '5+': { label: '5 سنوات فأكثر', discount: 0.30 },
};

const COMP_RATES_BY_AGE = {
  new:  { min: 0.030, max: 0.045 },
  '1-3':{ min: 0.026, max: 0.038 },
  '4-6':{ min: 0.022, max: 0.032 },
  '7+': { min: 0.018, max: 0.026 },
};

const COMP_MIN = 1500;
const COMP_MAX = 12000;
const TP_GLOBAL_MIN = 500;

// ── UAE-specific data ────────────────────────────────────────────────────────

export const UAE_CITY_FACTORS = {
  dubai:    { label: 'دبي',        factor: 1.20 },
  abudhabi: { label: 'أبوظبي',    factor: 1.10 },
  sharjah:  { label: 'الشارقة',   factor: 1.05 },
  other:    { label: 'مدن أخرى', factor: 1.0  },
};

export const UAE_DRIVER_AGE_BANDS = [
  { value: '18-21', label: '18 – 21 سنة', multiplier: 2.2,  tpMin: 1500, tpMax: 3500 },
  { value: '22-25', label: '22 – 25 سنة', multiplier: 1.6,  tpMin: 1100, tpMax: 2500 },
  { value: '26-30', label: '26 – 30 سنة', multiplier: 1.2,  tpMin:  800, tpMax: 1800 },
  { value: '31-45', label: '31 – 45 سنة', multiplier: 1.0,  tpMin:  700, tpMax: 1600 },
  { value: '46-60', label: '46 – 60 سنة', multiplier: 1.1,  tpMin:  750, tpMax: 1800 },
  { value: '60+',   label: '60+ سنة',     multiplier: 1.3,  tpMin:  900, tpMax: 2200 },
];

export const UAE_COMP_RATES_BY_AGE = {
  new:  { min: 0.028, max: 0.042 },
  '1-3':{ min: 0.024, max: 0.036 },
  '4-6':{ min: 0.020, max: 0.030 },
  '7+': { min: 0.016, max: 0.024 },
};

const UAE_COMP_MIN = 1800;
const UAE_COMP_MAX = 15000;
const UAE_TP_GLOBAL_MIN = 650;

export function estimateUaeCarInsurancePremium({ coverageType, carValue, carAge, driverAge, city, noClaimYears }) {
  const ageBand  = UAE_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const cityFact = UAE_CITY_FACTORS[city] ?? UAE_CITY_FACTORS.other;
  const ncDisc   = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  if (!ageBand) return { low: 0, high: 0, isValid: false };

  const cityMul = cityFact.factor;
  const ncMul   = 1 - ncDisc.discount;
  const ageMul  = ageBand.multiplier;

  if (coverageType === 'third-party') {
    const low  = Math.max(UAE_TP_GLOBAL_MIN, Math.round(ageBand.tpMin * cityMul * ncMul / 50) * 50);
    const high = Math.round(ageBand.tpMax * cityMul * ncMul / 50) * 50;
    return { low, high, isValid: true };
  }

  const val = parseFloat(carValue) || 0;
  if (val <= 0) return { low: 0, high: 0, isValid: false };

  const rates  = UAE_COMP_RATES_BY_AGE[carAge] ?? UAE_COMP_RATES_BY_AGE['1-3'];
  const rawLow = val * rates.min * ageMul * cityMul * ncMul;
  const rawHigh= val * rates.max * ageMul * cityMul * ncMul;
  const low    = Math.max(UAE_COMP_MIN, Math.round(rawLow  / 50) * 50);
  const high   = Math.min(UAE_COMP_MAX, Math.round(rawHigh / 50) * 50);
  return { low: Math.min(low, high), high, isValid: true };
}

export function getUaePriceFactors({ coverageType, carValue, carAge, driverAge, city, noClaimYears }) {
  const ageBand = UAE_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const ncDisc  = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  const factors = [];
  if (ageBand && ageBand.multiplier > 1.0) {
    factors.push({ icon: 'up', label: `السن (${ageBand.label})`, effect: `× ${ageBand.multiplier} أعلى من معدل 31–45 سنة` });
  } else if (ageBand && ageBand.multiplier <= 1.0) {
    factors.push({ icon: 'ok', label: `السن (${ageBand.label})`, effect: 'نطاق السن المثلى — أفضل سعر' });
  }
  if (city === 'dubai')    factors.push({ icon: 'up', label: 'المدينة (دبي)',     effect: '+ 20% نظراً لضغط المرور وارتفاع نسبة الحوادث' });
  if (city === 'abudhabi') factors.push({ icon: 'up', label: 'المدينة (أبوظبي)', effect: '+ 10%' });
  if (city === 'sharjah')  factors.push({ icon: 'up', label: 'المدينة (الشارقة)', effect: '+ 5%' });
  if (ncDisc.discount > 0) {
    factors.push({ icon: 'down', label: `سجل الحوادث (${ncDisc.label})`, effect: `- ${ncDisc.discount * 100}% خصم الخلو من المطالبات` });
  }
  if (coverageType === 'comprehensive') {
    const rates = UAE_COMP_RATES_BY_AGE[carAge] ?? UAE_COMP_RATES_BY_AGE['1-3'];
    factors.push({ icon: 'info', label: 'عمر السيارة', effect: `معدل ${(rates.min * 100).toFixed(1)}–${(rates.max * 100).toFixed(1)}% من قيمتها` });
    const val = parseFloat(carValue);
    if (val > 0) factors.push({ icon: 'info', label: 'قيمة السيارة', effect: `${val.toLocaleString('ar-AE')} د.إ — أساس الحساب` });
  }
  return factors;
}

// ── Saudi exports (keep for backward compat) ────────────────────────────────
export { DRIVER_AGE_BANDS, CITY_FACTORS, NO_CLAIM_DISCOUNTS, COMP_RATES_BY_AGE };

/**
 * @param {object} p
 * @param {'third-party'|'comprehensive'} p.coverageType
 * @param {number|string} p.carValue  — SAR, used for comprehensive only
 * @param {'new'|'1-3'|'4-6'|'7+'} p.carAge
 * @param {'18-21'|'22-25'|'26-30'|'31-45'|'46-60'|'60+'} p.driverAge
 * @param {'riyadh'|'jeddah'|'other'} p.city
 * @param {'0'|'1-2'|'3-4'|'5+'} p.noClaimYears
 * @returns {{ low: number, high: number, isValid: boolean }}
 */
export function estimateCarInsurancePremium({ coverageType, carValue, carAge, driverAge, city, noClaimYears }) {
  const ageBand  = DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const cityFact = CITY_FACTORS[city] ?? CITY_FACTORS.other;
  const ncDisc   = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];

  if (!ageBand) return { low: 0, high: 0, isValid: false };

  const cityMul   = cityFact.factor;
  const ncMul     = 1 - ncDisc.discount;
  const ageMul    = ageBand.multiplier;

  if (coverageType === 'third-party') {
    const low  = Math.max(TP_GLOBAL_MIN, Math.round(ageBand.tpMin * cityMul * ncMul / 50) * 50);
    const high = Math.round(ageBand.tpMax * cityMul * ncMul / 50) * 50;
    return { low, high, isValid: true };
  }

  // Comprehensive
  const val = parseFloat(carValue) || 0;
  if (val <= 0) return { low: 0, high: 0, isValid: false };

  const rates = COMP_RATES_BY_AGE[carAge] ?? COMP_RATES_BY_AGE['1-3'];
  const rawLow  = val * rates.min * ageMul * cityMul * ncMul;
  const rawHigh = val * rates.max * ageMul * cityMul * ncMul;

  const low  = Math.max(COMP_MIN, Math.round(rawLow  / 50) * 50);
  const high = Math.min(COMP_MAX, Math.round(rawHigh / 50) * 50);

  return { low: Math.min(low, high), high, isValid: true };
}

/**
 * Returns a list of human-readable price factors explaining what drives the estimate.
 */
export function getPriceFactors({ coverageType, carValue, carAge, driverAge, city, noClaimYears }) {
  const ageBand = DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const ncDisc  = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  const factors = [];

  if (ageBand && ageBand.multiplier > 1.0) {
    factors.push({ icon: 'up', label: `السن (${ageBand.label})`, effect: `× ${ageBand.multiplier} أعلى من معدل 31–45 سنة` });
  } else if (ageBand && ageBand.multiplier <= 1.0) {
    factors.push({ icon: 'ok', label: `السن (${ageBand.label})`, effect: 'نطاق السن المثلى — أفضل سعر' });
  }
  if (city === 'riyadh') {
    factors.push({ icon: 'up', label: 'المدينة (الرياض)', effect: '+ 15% نظراً لارتفاع نسبة المطالبات' });
  }
  if (city === 'jeddah') {
    factors.push({ icon: 'up', label: 'المدينة (جدة)', effect: '+ 7%' });
  }
  if (ncDisc.discount > 0) {
    factors.push({ icon: 'down', label: `سجل الحوادث (${ncDisc.label})`, effect: `- ${ncDisc.discount * 100}% خصم الخلو من المطالبات` });
  }
  if (coverageType === 'comprehensive') {
    const rates = COMP_RATES_BY_AGE[carAge] ?? COMP_RATES_BY_AGE['1-3'];
    factors.push({ icon: 'info', label: `عمر السيارة`, effect: `معدل ${(rates.min * 100).toFixed(1)}–${(rates.max * 100).toFixed(1)}% من قيمتها` });
    const val = parseFloat(carValue);
    if (val > 0) {
      factors.push({ icon: 'info', label: 'قيمة السيارة', effect: `${val.toLocaleString('ar-SA')} ر.س — أساس الحساب` });
    }
  }
  return factors;
}

// ── Kuwait car insurance ──────────────────────────────────────────────────────

export const KUWAIT_AREA_FACTORS = {
  capital:    { label: 'محافظة العاصمة',          factor: 1.15 },
  hawalli:    { label: 'محافظة حولي / الفروانية', factor: 1.10 },
  ahmadi:     { label: 'محافظة الأحمدي',           factor: 1.05 },
  jahra:      { label: 'محافظة الجهراء',           factor: 1.02 },
  other:      { label: 'مناطق أخرى',              factor: 1.00 },
};

export const KUWAIT_DRIVER_AGE_BANDS = [
  { value: '18-21', label: '18 – 21 سنة', multiplier: 2.2, tpMin: 55,  tpMax: 140 },
  { value: '22-25', label: '22 – 25 سنة', multiplier: 1.6, tpMin: 45,  tpMax: 100 },
  { value: '26-30', label: '26 – 30 سنة', multiplier: 1.2, tpMin: 38,  tpMax:  80 },
  { value: '31-45', label: '31 – 45 سنة', multiplier: 1.0, tpMin: 32,  tpMax:  70 },
  { value: '46-60', label: '46 – 60 سنة', multiplier: 1.1, tpMin: 35,  tpMax:  80 },
  { value: '60+',   label: '60+ سنة',     multiplier: 1.3, tpMin: 40,  tpMax:  95 },
];

export const KUWAIT_COMP_RATES_BY_AGE = {
  new:  { min: 0.028, max: 0.044 },
  '1-3':{ min: 0.024, max: 0.036 },
  '4-6':{ min: 0.020, max: 0.030 },
  '7+': { min: 0.016, max: 0.024 },
};

const KW_COMP_MIN = 100;  // KWD
const KW_COMP_MAX = 3000; // KWD
const KW_TP_MIN   = 30;   // KWD

/**
 * @param {{ coverageType: string, carValue: number|string, carAge: string, driverAge: string, area: string, noClaimYears: string }} p
 * @returns {{ low: number, high: number, isValid: boolean }}
 */
export function estimateKuwaitCarInsurancePremium({ coverageType, carValue, carAge, driverAge, area, noClaimYears }) {
  const ageBand  = KUWAIT_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const areaFact = KUWAIT_AREA_FACTORS[area] ?? KUWAIT_AREA_FACTORS.other;
  const ncDisc   = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  if (!ageBand) return { low: 0, high: 0, isValid: false };

  const areaMul  = areaFact.factor;
  const ncMul    = 1 - ncDisc.discount;
  const ageMul   = ageBand.multiplier;

  if (coverageType === 'third-party') {
    const low  = Math.max(KW_TP_MIN, Math.round(ageBand.tpMin * areaMul * ncMul));
    const high = Math.round(ageBand.tpMax * areaMul * ncMul);
    return { low, high: Math.max(low, high), isValid: true };
  }

  const val = parseFloat(carValue) || 0;
  if (val <= 0) return { low: 0, high: 0, isValid: false };

  const rates   = KUWAIT_COMP_RATES_BY_AGE[carAge] ?? KUWAIT_COMP_RATES_BY_AGE['1-3'];
  const rawLow  = val * rates.min * ageMul * areaMul * ncMul;
  const rawHigh = val * rates.max * ageMul * areaMul * ncMul;
  const low     = Math.max(KW_COMP_MIN, Math.round(rawLow  / 5) * 5);
  const high    = Math.min(KW_COMP_MAX, Math.round(rawHigh / 5) * 5);
  return { low: Math.min(low, high), high, isValid: true };
}

export function getKuwaitPriceFactors({ coverageType, carValue, carAge, driverAge, area, noClaimYears }) {
  const ageBand = KUWAIT_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const ncDisc  = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  const factors = [];
  if (ageBand) {
    if (ageBand.multiplier > 1.0) {
      factors.push({ icon: 'up', label: `السن (${ageBand.label})`, effect: `× ${ageBand.multiplier} فوق الأساس` });
    } else {
      factors.push({ icon: 'ok', label: `السن (${ageBand.label})`, effect: 'نطاق السن المثلى' });
    }
  }
  if (area === 'capital')  factors.push({ icon: 'up', label: 'محافظة العاصمة',           effect: '+ 15% كثافة مرورية' });
  if (area === 'hawalli')  factors.push({ icon: 'up', label: 'حولي / الفروانية',         effect: '+ 10%' });
  if (area === 'ahmadi')   factors.push({ icon: 'up', label: 'الأحمدي',                 effect: '+ 5%' });
  if (ncDisc.discount > 0) {
    factors.push({ icon: 'down', label: `خلو المطالبات (${ncDisc.label})`, effect: `- ${ncDisc.discount * 100}% خصم` });
  }
  if (coverageType === 'comprehensive') {
    const rates = KUWAIT_COMP_RATES_BY_AGE[carAge] ?? KUWAIT_COMP_RATES_BY_AGE['1-3'];
    factors.push({ icon: 'info', label: 'عمر السيارة', effect: `${(rates.min * 100).toFixed(1)}–${(rates.max * 100).toFixed(1)}% من القيمة` });
  }
  return factors;
}

// ── Qatar car insurance ───────────────────────────────────────────────────────

export const QATAR_AREA_FACTORS = {
  doha:     { label: 'الدوحة',            factor: 1.12 },
  rayyan:   { label: 'الريان',            factor: 1.08 },
  wakra:    { label: 'الوكرة',            factor: 1.04 },
  khor:     { label: 'الخور والذخيرة',   factor: 1.02 },
  other:    { label: 'بلديات أخرى',       factor: 1.00 },
};

export const QATAR_DRIVER_AGE_BANDS = [
  { value: '18-21', label: '18 – 21 سنة', multiplier: 2.0, tpMin: 1000, tpMax: 2800 },
  { value: '22-25', label: '22 – 25 سنة', multiplier: 1.5, tpMin:  850, tpMax: 2200 },
  { value: '26-30', label: '26 – 30 سنة', multiplier: 1.2, tpMin:  700, tpMax: 1800 },
  { value: '31-45', label: '31 – 45 سنة', multiplier: 1.0, tpMin:  600, tpMax: 1500 },
  { value: '46-60', label: '46 – 60 سنة', multiplier: 1.1, tpMin:  650, tpMax: 1650 },
  { value: '60+',   label: '60+ سنة',     multiplier: 1.3, tpMin:  750, tpMax: 2000 },
];

export const QATAR_COMP_RATES_BY_AGE = {
  new:  { min: 0.025, max: 0.042 },
  '1-3':{ min: 0.022, max: 0.035 },
  '4-6':{ min: 0.018, max: 0.028 },
  '7+': { min: 0.014, max: 0.022 },
};

const QA_COMP_MIN = 500;   // QAR
const QA_COMP_MAX = 15000; // QAR
const QA_TP_MIN   = 500;   // QAR

/**
 * @param {{ coverageType: string, carValue: number|string, carAge: string, driverAge: string, area: string, noClaimYears: string }} p
 * @returns {{ low: number, high: number, isValid: boolean }}
 */
export function estimateQatarCarInsurancePremium({ coverageType, carValue, carAge, driverAge, area, noClaimYears }) {
  const ageBand  = QATAR_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const areaFact = QATAR_AREA_FACTORS[area] ?? QATAR_AREA_FACTORS.other;
  const ncDisc   = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  if (!ageBand) return { low: 0, high: 0, isValid: false };

  const areaMul = areaFact.factor;
  const ncMul   = 1 - ncDisc.discount;
  const ageMul  = ageBand.multiplier;

  if (coverageType === 'third-party') {
    const low  = Math.max(QA_TP_MIN, Math.round(ageBand.tpMin * areaMul * ncMul));
    const high = Math.round(ageBand.tpMax * areaMul * ncMul);
    return { low, high: Math.max(low, high), isValid: true };
  }

  const val = parseFloat(carValue) || 0;
  if (val <= 0) return { low: 0, high: 0, isValid: false };

  const rates   = QATAR_COMP_RATES_BY_AGE[carAge] ?? QATAR_COMP_RATES_BY_AGE['1-3'];
  const rawLow  = val * rates.min * ageMul * areaMul * ncMul;
  const rawHigh = val * rates.max * ageMul * areaMul * ncMul;
  const low     = Math.max(QA_COMP_MIN, Math.round(rawLow  / 10) * 10);
  const high    = Math.min(QA_COMP_MAX, Math.round(rawHigh / 10) * 10);
  return { low: Math.min(low, high), high, isValid: true };
}

export function getQatarPriceFactors({ coverageType, carValue, carAge, driverAge, area, noClaimYears }) {
  const ageBand = QATAR_DRIVER_AGE_BANDS.find((b) => b.value === driverAge);
  const ncDisc  = NO_CLAIM_DISCOUNTS[noClaimYears] ?? NO_CLAIM_DISCOUNTS['0'];
  const factors = [];
  if (ageBand) {
    if (ageBand.multiplier > 1.0) {
      factors.push({ icon: 'up', label: `السن (${ageBand.label})`, effect: `× ${ageBand.multiplier} فوق الأساس` });
    } else {
      factors.push({ icon: 'ok', label: `السن (${ageBand.label})`, effect: 'نطاق السن المثلى' });
    }
  }
  if (area === 'doha')   factors.push({ icon: 'up', label: 'الدوحة',  effect: '+ 12% كثافة مرورية' });
  if (area === 'rayyan') factors.push({ icon: 'up', label: 'الريان',  effect: '+ 8%' });
  if (area === 'wakra')  factors.push({ icon: 'up', label: 'الوكرة',  effect: '+ 4%' });
  if (ncDisc.discount > 0) {
    factors.push({ icon: 'down', label: `خلو المطالبات (${ncDisc.label})`, effect: `- ${ncDisc.discount * 100}% خصم` });
  }
  if (coverageType === 'comprehensive') {
    const rates = QATAR_COMP_RATES_BY_AGE[carAge] ?? QATAR_COMP_RATES_BY_AGE['1-3'];
    factors.push({ icon: 'info', label: 'عمر السيارة', effect: `${(rates.min * 100).toFixed(1)}–${(rates.max * 100).toFixed(1)}% من القيمة` });
  }
  return factors;
}
