/**
 * Dubai company formation cost estimator (AED).
 * Data: official DED/free-zone published fee schedules (indicative ranges).
 * VERIFY against official sources before quoting: DED, DMCC, JAFZA, SPC, etc.
 */

export const JURISDICTION_TYPES = [
  { value: 'mainland',  label: 'براً (Mainland / DED)', description: 'تجارة حرة في السوق الإماراتي' },
  { value: 'freezone',  label: 'منطقة حرة (Free Zone)', description: 'ملكية 100% أجنبية، أسرع وأرخص' },
];

export const ACTIVITY_TYPES = [
  { value: 'trading',        label: 'تجارة (Trading)',          mainlandMod: 1.1, freezoneMod: 1.0 },
  { value: 'services',       label: 'خدمات (Professional)',     mainlandMod: 1.0, freezoneMod: 0.9 },
  { value: 'tech',           label: 'تقنية / ابتكار (Tech)',    mainlandMod: 1.0, freezoneMod: 0.85 },
  { value: 'manufacturing',  label: 'تصنيع (Manufacturing)',    mainlandMod: 1.2, freezoneMod: 1.1 },
  { value: 'ecommerce',      label: 'تجارة إلكترونية (E-com)', mainlandMod: 1.0, freezoneMod: 0.9 },
];

export const VISA_COUNTS = [
  { value: '0',  label: 'بدون تأشيرات',     count: 0 },
  { value: '1',  label: 'تأشيرة واحدة',     count: 1 },
  { value: '2',  label: 'تأشيرتان',         count: 2 },
  { value: '5',  label: '5 تأشيرات',        count: 5 },
  { value: '10', label: '10 تأشيرات',       count: 10 },
];

export const OFFICE_TYPES = [
  { value: 'virtual', label: 'عنوان افتراضي (Virtual)',  cost: 3000 },
  { value: 'flexi',   label: 'فليكسي ديسك (Flexi Desk)', cost: 10000 },
  { value: 'shared',  label: 'مكتب مشترك (Co-working)',  cost: 20000 },
  { value: 'private', label: 'مكتب خاص (Private Office)', cost: 40000 },
];

// Mainland base costs (AED) — DED, per year
const MAINLAND_BASE = {
  license:          { min: 10000, max: 25000 },
  nameReservation:  { min: 620,   max: 2100 },   // AED 620 local name, AED 2100 foreign name
  initialApproval:  { min: 120,   max: 150 },
  commercialReg:    { min: 200,   max: 400 },
  licenseReg:       { min: 600,   max: 600 },
  knowledgeFee:     { fixed: 10 },
  innovationFee:    { fixed: 10 },
  establishmentCard:{ min: 1200,  max: 1500 },
};

// Free zone base costs (AED) — DMCC/SPC indicative
const FREEZONE_BASE = {
  license:          { min: 7500,  max: 15000 },
  nameReservation:  { min: 500,   max: 1000 },
  registration:     { min: 3000,  max: 6000 },
  annualFee:        { min: 5000,  max: 10000 },
};

// Per visa cost (AED) — medical + Emirates ID + entry permit + labor card
const VISA_COST_PER_PERSON = { min: 1500, max: 2500 };

/**
 * @param {object} p
 * @param {'mainland'|'freezone'} p.jurisdiction
 * @param {string} p.activity
 * @param {string} p.visaCount  — '0','1','2','5','10'
 * @param {'virtual'|'flexi'|'shared'|'private'} p.officeType
 * @param {boolean} p.foreignName
 * @returns {{ items, totalMin, totalMax, isValid }}
 */
export function estimateDubaiCompanySetup({ jurisdiction, activity, visaCount, officeType, foreignName }) {
  const activityData = ACTIVITY_TYPES.find((a) => a.value === activity) ?? ACTIVITY_TYPES[0];
  const officeCost   = OFFICE_TYPES.find((o) => o.value === officeType)?.cost ?? 0;
  const visas        = VISA_COUNTS.find((v) => v.value === visaCount)?.count ?? 0;

  const items = [];

  if (jurisdiction === 'mainland') {
    const mod = activityData.mainlandMod;
    items.push({
      label: 'رخصة تجارية (DED)',
      min: Math.round(MAINLAND_BASE.license.min * mod),
      max: Math.round(MAINLAND_BASE.license.max * mod),
      note: 'تتجدد سنوياً',
    });
    items.push({
      label: 'حجز اسم التجاري',
      min: foreignName ? MAINLAND_BASE.nameReservation.max : MAINLAND_BASE.nameReservation.min,
      max: foreignName ? MAINLAND_BASE.nameReservation.max : MAINLAND_BASE.nameReservation.min,
    });
    items.push({
      label: 'الموافقة الأولية',
      min: MAINLAND_BASE.initialApproval.min,
      max: MAINLAND_BASE.initialApproval.max,
    });
    items.push({
      label: 'السجل التجاري',
      min: MAINLAND_BASE.commercialReg.min,
      max: MAINLAND_BASE.commercialReg.max,
    });
    items.push({
      label: 'تسجيل الرخصة',
      min: MAINLAND_BASE.licenseReg.fixed,
      max: MAINLAND_BASE.licenseReg.fixed,
    });
    items.push({
      label: 'رسوم المعرفة والابتكار',
      min: MAINLAND_BASE.knowledgeFee.fixed + MAINLAND_BASE.innovationFee.fixed,
      max: MAINLAND_BASE.knowledgeFee.fixed + MAINLAND_BASE.innovationFee.fixed,
    });
    items.push({
      label: 'بطاقة المنشأة',
      min: MAINLAND_BASE.establishmentCard.min,
      max: MAINLAND_BASE.establishmentCard.max,
    });
  } else {
    const mod = activityData.freezoneMod;
    items.push({
      label: 'رخصة المنطقة الحرة',
      min: Math.round(FREEZONE_BASE.license.min * mod),
      max: Math.round(FREEZONE_BASE.license.max * mod),
      note: 'تشمل الرسوم الأساسية',
    });
    items.push({
      label: 'حجز اسم التجاري',
      min: FREEZONE_BASE.nameReservation.min,
      max: FREEZONE_BASE.nameReservation.max,
    });
    items.push({
      label: 'رسوم التسجيل',
      min: FREEZONE_BASE.registration.min,
      max: FREEZONE_BASE.registration.max,
    });
    items.push({
      label: 'الرسوم السنوية',
      min: FREEZONE_BASE.annualFee.min,
      max: FREEZONE_BASE.annualFee.max,
      note: 'مستقلة عن رسوم الرخصة في بعض المناطق',
    });
  }

  if (officeCost > 0) {
    items.push({
      label: `مكتب (${OFFICE_TYPES.find((o) => o.cost === officeCost)?.label ?? ''})`,
      min: officeCost,
      max: officeCost,
      note: 'تقديري — يختلف بحسب المنطقة',
    });
  }

  if (visas > 0) {
    items.push({
      label: `${visas} تأشيرة إقامة (رسوم + طبي + بصمة)`,
      min: visas * VISA_COST_PER_PERSON.min,
      max: visas * VISA_COST_PER_PERSON.max,
      note: 'لكل فرد: إذن دخول + فحص طبي + هوية إماراتية + بطاقة عمل',
    });
  }

  const totalMin = items.reduce((s, i) => s + i.min, 0);
  const totalMax = items.reduce((s, i) => s + i.max, 0);

  return { items, totalMin, totalMax, isValid: true };
}
