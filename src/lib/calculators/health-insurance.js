/**
 * UAE + Saudi health insurance premium estimator.
 * UAE: Dubai Health Authority (DHA) mandates basic coverage for all residents since 2016.
 * Saudi: CCHI (Council of Cooperative Health Insurance) mandates for private-sector since 2006.
 * All prices are static market-range estimates, not a live quote.
 */

export const HEALTH_COVERAGE_LEVELS = [
  {
    value: 'basic',
    label: 'أساسي (Basic)',
    sub: 'الحد الأدنى الإلزامي — DHA',
    description: 'يغطي العيادات الحكومية والحالات الطارئة. الحد الأدنى المطلوب قانوناً في دبي.',
    perMember: { min: 650, max: 1400 },
  },
  {
    value: 'enhanced',
    label: 'متوسط (Enhanced)',
    sub: 'عيادات خاصة + مستشفيات + دواء',
    description: 'يغطي شبكة أوسع من المستشفيات الخاصة والأدوية والرعاية المزمنة.',
    perMember: { min: 1600, max: 4000 },
  },
  {
    value: 'premium',
    label: 'مميز (Premium)',
    sub: 'تغطية شاملة + أسنان + نظر + مزايا إضافية',
    description: 'أفضل شبكة مستشفيات + أسنان + نظر + غرفة خاصة + إعادة المرضى لبلدانهم.',
    perMember: { min: 4200, max: 12000 },
  },
];

export const FAMILY_SIZES = [
  { value: '1', label: 'فرد واحد',           count: 1 },
  { value: '2', label: 'فردان (زوجان)',        count: 2 },
  { value: '3', label: 'عائلة — 3 أفراد',     count: 3 },
  { value: '4', label: 'عائلة — 4 أفراد',     count: 4 },
  { value: '5', label: 'عائلة — 5 أفراد',     count: 5 },
  { value: '6', label: 'عائلة — 6 أفراد+',    count: 6 },
];

export const AGE_BANDS_HEALTH = [
  { value: '18-35', label: '18 – 35 سنة', factor: 1.00 },
  { value: '36-45', label: '36 – 45 سنة', factor: 1.40 },
  { value: '46-55', label: '46 – 55 سنة', factor: 1.90 },
  { value: '56-60', label: '56 – 60 سنة', factor: 2.60 },
  { value: '60+',   label: '60+ سنة',     factor: 3.50 },
];

export const NETWORK_TYPES = [
  { value: 'dubai',     label: 'دبي — شبكة DHA',                 factor: 1.00 },
  { value: 'abudhabi',  label: 'أبوظبي — شبكة DOHAD/Thiqa',     factor: 1.12 },
  { value: 'sharjah',   label: 'الشارقة / المناطق الشمالية',     factor: 0.90 },
];

/**
 * @param {{ coverageLevel: string, familySize: string, mainAge: string, emirate: string, preExisting: boolean }} p
 * @returns {{ isValid: boolean, totalMin?: number, totalMax?: number, monthlyMin?: number, monthlyMax?: number, perMemberMin?: number, perMemberMax?: number }}
 */
export function estimateHealthInsurancePremium({ coverageLevel, familySize, mainAge, emirate, preExisting }) {
  const level   = HEALTH_COVERAGE_LEVELS.find((l) => l.value === coverageLevel);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = AGE_BANDS_HEALTH.find((a) => a.value === mainAge);
  const network = NETWORK_TYPES.find((n) => n.value === emirate);

  if (!level || !family || !ageBand || !network) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const netFac = network.factor;
  const preFac = preExisting ? 1.30 : 1.0;

  // Main member costs include full age loading
  const mainMin = level.perMember.min * ageFac * netFac * preFac;
  const mainMax = level.perMember.max * ageFac * netFac * preFac;

  // Dependents use a blended factor (spouse ~same age, children ~base)
  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.65) : 0;
  const depMin = level.perMember.min * depAgeFac * netFac;
  const depMax = level.perMember.max * depAgeFac * netFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(50, Math.round(rawMin / 50) * 50);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 50) * 50);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perMemberMin: Math.round(totalMin / count),
    perMemberMax: Math.round(totalMax / count),
    memberCount: count,
    coverageName: level.label,
  };
}

// ── Saudi CCHI health insurance ──────────────────────────────────────────────

export const SAUDI_CCHI_CLASSES = [
  {
    value: 'B',
    label: 'الفئة B — أساسي',
    sub: 'الحد الأدنى الإلزامي (CCHI)',
    description: 'يغطي الطوارئ والعلاج الأساسي في المستشفيات المعتمدة. الحد الأدنى المطلوب لجميع موظفي القطاع الخاص.',
    perMember: { min: 500, max: 1200 },
  },
  {
    value: 'C',
    label: 'الفئة C — معياري',
    sub: 'شبكة أوسع + أدوية + متابعة مزمنة',
    description: 'مستشفيات خاصة مختارة، أدوية، رعاية مزمنة، جراحات إضافية. الخيار الأكثر شيوعاً في الشركات المتوسطة.',
    perMember: { min: 1200, max: 3500 },
  },
  {
    value: 'D',
    label: 'الفئة D — مميز',
    sub: 'مستشفيات كبرى + خدمات موسعة',
    description: 'أفضل شبكة مستشفيات في المملكة + رعاية إضافية + علاج خارج المملكة في بعض الوثائق.',
    perMember: { min: 3500, max: 10000 },
  },
  {
    value: 'E',
    label: 'الفئة E — ممتاز VIP',
    sub: 'تغطية شاملة + أسنان + نظر + علاج خارجي',
    description: 'أعلى مستوى: غرفة خاصة، أسنان، نظر، إخلاء طبي، علاج دولي. للمدراء والتنفيذيين.',
    perMember: { min: 10000, max: 30000 },
  },
];

export const SAUDI_AGE_BANDS = [
  { value: '18-30', label: '18 – 30 سنة', factor: 1.00 },
  { value: '31-40', label: '31 – 40 سنة', factor: 1.40 },
  { value: '41-50', label: '41 – 50 سنة', factor: 2.00 },
  { value: '51-60', label: '51 – 60 سنة', factor: 2.80 },
  { value: '60+',   label: '60+ سنة',     factor: 3.80 },
];

export const SAUDI_REGIONS = [
  { value: 'riyadh',  label: 'الرياض',            factor: 1.05 },
  { value: 'jeddah',  label: 'جدة / مكة المكرمة', factor: 1.08 },
  { value: 'eastern', label: 'المنطقة الشرقية',   factor: 1.02 },
  { value: 'other',   label: 'مناطق أخرى',        factor: 1.00 },
];

/**
 * @param {{ cchiClass: string, familySize: string, mainAge: string, region: string, preExisting: boolean }} p
 */
export function estimateSaudiHealthInsurancePremium({ cchiClass, familySize, mainAge, region, preExisting }) {
  const level   = SAUDI_CCHI_CLASSES.find((l) => l.value === cchiClass);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = SAUDI_AGE_BANDS.find((a) => a.value === mainAge);
  const reg     = SAUDI_REGIONS.find((r) => r.value === region);

  if (!level || !family || !ageBand || !reg) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const regFac = reg.factor;
  const preFac = preExisting ? 1.30 : 1.0;

  const mainMin = level.perMember.min * ageFac * regFac * preFac;
  const mainMax = level.perMember.max * ageFac * regFac * preFac;

  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.60) : 0;
  const depMin = level.perMember.min * depAgeFac * regFac;
  const depMax = level.perMember.max * depAgeFac * regFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(50, Math.round(rawMin / 50) * 50);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 50) * 50);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perMemberMin: Math.round(totalMin / count),
    perMemberMax: Math.round(totalMax / count),
    memberCount: count,
    coverageName: level.label,
  };
}

// ── Qatar health insurance ────────────────────────────────────────────────────
// Market data from GIG Gulf (7 plans), QLM (Prestige/Platinum/Gold),
// Al-Koot (Elite/Diamond/Comprehensive) and Law 22 mandatory minimum.
// Pricing: per person/year before age and pre-existing adjustments.

export const QATAR_HI_TIERS = [
  {
    value: 'basic',
    label: 'أساسي',
    sub: 'Law 22',
    description: 'الحد الأدنى الإلزامي — شبكة محلية، خدمات طارئة وعيادات محددة.',
    perPerson: { min: 800, max: 1500 },
    coverageCeiling: 30000,
  },
  {
    value: 'standard',
    label: 'قياسي',
    sub: 'موصى به',
    description: 'شبكة أوسع، طب عام وتخصصي، أدوية مدعومة، بعض خدمات الأسنان.',
    perPerson: { min: 1500, max: 3500 },
    coverageCeiling: 150000,
  },
  {
    value: 'premium',
    label: 'مميز',
    sub: 'تغطية شاملة',
    description: 'تغطية شاملة محلية + بعض المستشفيات الإقليمية، طب أسنان وبصريات.',
    perPerson: { min: 3500, max: 7000 },
    coverageCeiling: 300000,
  },
  {
    value: 'global',
    label: 'عالمي',
    sub: 'الأعلى',
    description: 'تغطية كاملة محلياً + دولياً، وصول لمستشفى حمد والمراكز العالمية.',
    perPerson: { min: 7000, max: 18000 },
    coverageCeiling: 500000,
  },
];

export const QATAR_HI_AGE_BANDS = [
  { value: '18-30', label: '18 – 30 سنة', factor: 1.0 },
  { value: '31-40', label: '31 – 40 سنة', factor: 1.3 },
  { value: '41-50', label: '41 – 50 سنة', factor: 1.9 },
  { value: '51-60', label: '51 – 60 سنة', factor: 2.7 },
  { value: '60+',   label: '60+ سنة',     factor: 3.8 },
];

/**
 * @param {{ tier: string, familySize: string, mainAge: string, preExisting: boolean }} p
 */
export function estimateQatarHealthInsurancePremium({ tier, familySize, mainAge, preExisting }) {
  const level   = QATAR_HI_TIERS.find((t) => t.value === tier);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = QATAR_HI_AGE_BANDS.find((a) => a.value === mainAge);

  if (!level || !family || !ageBand) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const preFac = preExisting ? 1.35 : 1.0;

  const mainMin = level.perPerson.min * ageFac * preFac;
  const mainMax = level.perPerson.max * ageFac * preFac;

  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.65) : 0;
  const depMin = level.perPerson.min * depAgeFac;
  const depMax = level.perPerson.max * depAgeFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(50, Math.round(rawMin / 50) * 50);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 50) * 50);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perPersonMin: Math.round(totalMin / count),
    perPersonMax: Math.round(totalMax / count),
    memberCount: count,
    tierName: level.label,
    coverageCeiling: level.coverageCeiling,
  };
}

// ── Kuwait Health Insurance ──────────────────────────────────────────────────
// Source: Al-Ahleia Insurance, Gulf Insurance Group (GIG) Kuwait, First Takaful
// MOH mandatory for all expats under Labour Law 2010. 4 market tiers in KWD.

export const KUWAIT_HI_TIERS = [
  {
    value: 'basic',
    label: 'أساسي',
    sub: 'الحد الإلزامي',
    description: 'التغطية الإلزامية لوزارة الصحة — مستشفيات حكومية ومنافذ طبية محددة.',
    perPerson: { min: 50,  max: 140  },
    coverageCeiling: 25000,
  },
  {
    value: 'standard',
    label: 'قياسي',
    sub: 'موصى به',
    description: 'شبكة خاصة موسّعة، طب عام وتخصصي، أدوية جزئية، خدمات طوارئ.',
    perPerson: { min: 140, max: 350  },
    coverageCeiling: 75000,
  },
  {
    value: 'premium',
    label: 'مميز',
    sub: 'شاملة',
    description: 'مستشفيات خاصة + تغطية الأسنان والبصريات، دعم دوائي واسع.',
    perPerson: { min: 350, max: 750  },
    coverageCeiling: 200000,
  },
  {
    value: 'global',
    label: 'عالمي',
    sub: 'الأعلى',
    description: 'تغطية كاملة محلياً ودولياً، وصول لأفضل المستشفيات العالمية.',
    perPerson: { min: 750, max: 2000 },
    coverageCeiling: 1000000,
  },
];

export const KUWAIT_HI_AGE_BANDS = [
  { value: '18-30', label: '18 – 30 سنة', factor: 1.0  },
  { value: '31-40', label: '31 – 40 سنة', factor: 1.25 },
  { value: '41-50', label: '41 – 50 سنة', factor: 1.6  },
  { value: '51-55', label: '51 – 55 سنة', factor: 2.2  },
  { value: '56-60', label: '56 – 60 سنة', factor: 2.9  },
  { value: '60+',   label: '60+ سنة',     factor: 3.8  },
];

export function estimateKuwaitHealthInsurancePremium({ tier, familySize, mainAge, preExisting }) {
  const level   = KUWAIT_HI_TIERS.find((t) => t.value === tier);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = KUWAIT_HI_AGE_BANDS.find((a) => a.value === mainAge);

  if (!level || !family || !ageBand) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const preFac = preExisting ? 1.30 : 1.0;

  const mainMin = level.perPerson.min * ageFac * preFac;
  const mainMax = level.perPerson.max * ageFac * preFac;

  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.65) : 0;
  const depMin = level.perPerson.min * depAgeFac;
  const depMax = level.perPerson.max * depAgeFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(10, Math.round(rawMin / 5) * 5);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 5) * 5);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perPersonMin: Math.round(totalMin / count),
    perPersonMax: Math.round(totalMax / count),
    memberCount: count,
    tierName: level.label,
    coverageCeiling: level.coverageCeiling,
  };
}

// ── Bahrain Health Insurance ──────────────────────────────────────────────────
// Mandatory baseline: SEHATI national program (Decision No. 23 of 2018, effective
// 1 Jan 2019) — employers fund basic coverage for expat workers via work-permit
// fees; annual cap BHD 1,500; excludes dental/optical/maternity/mental health.
// Private supplemental tiers below are market ranges (Bupa, AXA Gulf, GIG Gulf,
// NIC, Al Ahlia) for those upgrading beyond the mandatory baseline.

export const BAHRAIN_HI_TIERS = [
  {
    value: 'basic',
    label: 'أساسي',
    sub: 'مكمّل لسيهاتي (SEHATI)',
    description: 'تغطية تكميلية فوق الحد الإلزامي (سيهاتي) — شبكة محلية محدودة وخدمات أساسية.',
    perPerson: { min: 200, max: 400 },
    coverageCeiling: 15000,
  },
  {
    value: 'standard',
    label: 'قياسي',
    sub: 'موصى به',
    description: 'شبكة خاصة أوسع، طب عام وتخصصي، أدوية جزئية، بعض خدمات الأسنان.',
    perPerson: { min: 400, max: 800 },
    coverageCeiling: 50000,
  },
  {
    value: 'premium',
    label: 'مميز',
    sub: 'شاملة',
    description: 'مستشفيات خاصة كبرى + أسنان وبصريات + رعاية مزمنة موسّعة.',
    perPerson: { min: 800, max: 1500 },
    coverageCeiling: 150000,
  },
  {
    value: 'global',
    label: 'عالمي',
    sub: 'الأعلى',
    description: 'تغطية محلية ودولية شاملة (Cigna Global / Bupa Global) — إخلاء طبي وعلاج خارج البحرين.',
    perPerson: { min: 1500, max: 4000 },
    coverageCeiling: 750000,
  },
];

export const BAHRAIN_HI_AGE_BANDS = [
  { value: '18-30', label: '18 – 30 سنة', factor: 1.0 },
  { value: '31-40', label: '31 – 40 سنة', factor: 1.3 },
  { value: '41-50', label: '41 – 50 سنة', factor: 1.85 },
  { value: '51-60', label: '51 – 60 سنة', factor: 2.6 },
  { value: '60+',   label: '60+ سنة',     factor: 3.6 },
];

/**
 * @param {{ tier: string, familySize: string, mainAge: string, preExisting: boolean }} p
 */
export function estimateBahrainHealthInsurancePremium({ tier, familySize, mainAge, preExisting }) {
  const level   = BAHRAIN_HI_TIERS.find((t) => t.value === tier);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = BAHRAIN_HI_AGE_BANDS.find((a) => a.value === mainAge);

  if (!level || !family || !ageBand) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const preFac = preExisting ? 1.30 : 1.0;

  const mainMin = level.perPerson.min * ageFac * preFac;
  const mainMax = level.perPerson.max * ageFac * preFac;

  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.65) : 0;
  const depMin = level.perPerson.min * depAgeFac;
  const depMax = level.perPerson.max * depAgeFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(20, Math.round(rawMin / 10) * 10);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 10) * 10);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perPersonMin: Math.round(totalMin / count),
    perPersonMax: Math.round(totalMax / count),
    memberCount: count,
    tierName: level.label,
    coverageCeiling: level.coverageCeiling,
  };
}

// ── Oman Health Insurance ──────────────────────────────────────────────────────
// Mandatory baseline: unified health insurance scheme under Ministerial Decision
// 76/2019, issued by the Capital Market Authority (CMA) — insurance regulation now
// sits with the Financial Services Authority (FSA) after the CMA/FSA merger.
// Private-sector employers must insure staff; annual cap OMR 3,000; optional
// add-ons (maternity, pediatrics, dental, optical) sit outside the mandatory floor.
// Private supplemental tiers below are market ranges (Oman Insurance Co., Al Ahlia/
// Generali, Dhofar Insurance, Liva Group, AXA Gulf, Bupa) for upgrading beyond it.

export const OMAN_HI_TIERS = [
  {
    value: 'basic',
    label: 'أساسي',
    sub: 'مكمّل للتأمين الإلزامي',
    description: 'تغطية تكميلية فوق الحد الإلزامي — شبكة محلية محدودة وخدمات أساسية.',
    perPerson: { min: 100, max: 250 },
    coverageCeiling: 20000,
  },
  {
    value: 'standard',
    label: 'قياسي',
    sub: 'موصى به',
    description: 'شبكة خاصة أوسع، طب عام وتخصصي، أدوية جزئية، بعض خدمات الأسنان.',
    perPerson: { min: 300, max: 600 },
    coverageCeiling: 60000,
  },
  {
    value: 'premium',
    label: 'مميز',
    sub: 'شاملة',
    description: 'مستشفيات خاصة كبرى + أسنان وبصريات + ولادة وأطفال + رعاية مزمنة موسّعة.',
    perPerson: { min: 700, max: 1500 },
    coverageCeiling: 200000,
  },
  {
    value: 'global',
    label: 'عالمي',
    sub: 'الأعلى',
    description: 'تغطية محلية ودولية شاملة (Cigna Global / Bupa Global) — إخلاء طبي وعلاج خارج عُمان.',
    perPerson: { min: 1500, max: 4000 },
    coverageCeiling: 750000,
  },
];

export const OMAN_HI_AGE_BANDS = [
  { value: '18-30', label: '18 – 30 سنة', factor: 1.0 },
  { value: '31-40', label: '31 – 40 سنة', factor: 1.3 },
  { value: '41-50', label: '41 – 50 سنة', factor: 1.85 },
  { value: '51-60', label: '51 – 60 سنة', factor: 2.6 },
  { value: '60+',   label: '60+ سنة',     factor: 3.6 },
];

/**
 * @param {{ tier: string, familySize: string, mainAge: string, preExisting: boolean }} p
 */
export function estimateOmanHealthInsurancePremium({ tier, familySize, mainAge, preExisting }) {
  const level   = OMAN_HI_TIERS.find((t) => t.value === tier);
  const family  = FAMILY_SIZES.find((f) => f.value === familySize);
  const ageBand = OMAN_HI_AGE_BANDS.find((a) => a.value === mainAge);

  if (!level || !family || !ageBand) return { isValid: false };

  const count  = family.count;
  const ageFac = ageBand.factor;
  const preFac = preExisting ? 1.30 : 1.0;

  const mainMin = level.perPerson.min * ageFac * preFac;
  const mainMax = level.perPerson.max * ageFac * preFac;

  const depAgeFac = count > 1 ? Math.max(1.0, ageFac * 0.65) : 0;
  const depMin = level.perPerson.min * depAgeFac;
  const depMax = level.perPerson.max * depAgeFac;

  const rawMin = mainMin + depMin * (count - 1);
  const rawMax = mainMax + depMax * (count - 1);

  const totalMin = Math.max(20, Math.round(rawMin / 10) * 10);
  const totalMax = Math.max(totalMin, Math.round(rawMax / 10) * 10);

  return {
    isValid: true,
    totalMin,
    totalMax,
    monthlyMin: Math.round(totalMin / 12),
    monthlyMax: Math.round(totalMax / 12),
    perPersonMin: Math.round(totalMin / count),
    perPersonMax: Math.round(totalMax / count),
    memberCount: count,
    tierName: level.label,
    coverageCeiling: level.coverageCeiling,
  };
}
