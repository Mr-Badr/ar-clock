/**
 * Egyptian car customs duty estimator.
 * Based on Egyptian Customs Authority tariff schedule (verify vs official source).
 *
 * Calculation chain:
 *   1. CIF value (car price at port)
 *   2. Customs duty   = CIF × customs_rate
 *   3. Development fee = CIF × dev_rate
 *   4. Sales/table tax = CIF × table_rate
 *   5. VAT (14%)      = (CIF + customs + dev + table) × 0.14
 *   Total import cost = CIF + customs + dev + table + VAT
 *
 * Source: Egyptian Customs Authority (مصلحة الجمارك المصرية)
 * IMPORTANT: Rates subject to change — verify against official customs schedule before quoting.
 */

const VAT_RATE = 0.14;

// Non-EU, non-hybrid tariff bands by engine displacement (cc)
const CC_BANDS = [
  {
    id: 'le1600',
    label: '≤ 1600 سم³',
    maxCC: 1600,
    customs: 0.40,
    dev: 0.03,
    table: 0.01,
  },
  {
    id: '1601-1999',
    label: '1601 – 1999 سم³',
    maxCC: 1999,
    customs: 1.35,
    dev: 0.05,
    table: 0.15,
  },
  {
    id: 'ge2000',
    label: '≥ 2000 سم³',
    maxCC: Infinity,
    customs: 1.35,
    dev: 0.085,
    table: 0.30,
  },
];

// EU-origin: 0% customs duty (Egypt–EU Association Agreement)
// Dev fee and table tax still apply at same rates as CC band
const EU_CUSTOMS_OVERRIDE = 0.0;

// Hybrid/EV simplified regime (indicative — verify vs latest decree)
const HEV_BAND = {
  id: 'hybrid',
  label: 'هجينة (HEV/PHEV)',
  customs: 0.30,
  dev: 0.03,
  table: 0.05,
};

const EV_BAND = {
  id: 'ev',
  label: 'كهربائية بالكامل (BEV)',
  customs: 0.15,
  dev: 0.02,
  table: 0.02,
};

export const FUEL_TYPES = [
  { value: 'petrol',  label: 'بنزين / ديزل (ICE)' },
  { value: 'hybrid',  label: 'هجينة (HEV / PHEV)' },
  { value: 'ev',      label: 'كهربائية بالكامل (BEV)' },
];

export const ORIGIN_TYPES = [
  { value: 'non-eu', label: 'غير أوروبي (آسيا / أمريكا / إلخ)' },
  { value: 'eu',     label: 'أوروبي الصنع (EU)' },
];

export const CC_OPTIONS = [
  { value: 'le1600',   label: '≤ 1600 سم³ (سيارات صغيرة / اقتصادية)' },
  { value: '1601-1999', label: '1601 – 1999 سم³ (متوسطة)' },
  { value: 'ge2000',   label: '≥ 2000 سم³ (كبيرة / فاخرة)' },
];

/**
 * @param {object} p
 * @param {number|string}         p.carValue   — CIF value in EGP
 * @param {'le1600'|'1601-1999'|'ge2000'} p.ccBand
 * @param {'non-eu'|'eu'}         p.origin
 * @param {'petrol'|'hybrid'|'ev'} p.fuelType
 * @returns {{ customs, dev, table, vat, total, effectiveCustomsRate, isValid, breakdown }}
 */
export function calculateEgyptCarCustoms({ carValue, ccBand, origin, fuelType }) {
  const cif = parseFloat(carValue) || 0;
  if (cif <= 0) return { isValid: false };

  let rates;
  if (fuelType === 'hybrid') {
    rates = { customs: HEV_BAND.customs, dev: HEV_BAND.dev, table: HEV_BAND.table };
  } else if (fuelType === 'ev') {
    rates = { customs: EV_BAND.customs, dev: EV_BAND.dev, table: EV_BAND.table };
  } else {
    const band = CC_BANDS.find((b) => b.id === ccBand) ?? CC_BANDS[0];
    rates = { customs: band.customs, dev: band.dev, table: band.table };
    if (origin === 'eu') rates = { ...rates, customs: EU_CUSTOMS_OVERRIDE };
  }

  const customs = cif * rates.customs;
  const dev     = cif * rates.dev;
  const table   = cif * rates.table;
  const taxBase = cif + customs + dev + table;
  const vat     = taxBase * VAT_RATE;
  const total   = cif + customs + dev + table + vat;
  const totalDuties = customs + dev + table + vat;

  return {
    isValid: true,
    cif,
    customs:   Math.round(customs),
    dev:       Math.round(dev),
    table:     Math.round(table),
    vat:       Math.round(vat),
    total:     Math.round(total),
    totalDuties: Math.round(totalDuties),
    effectiveRate: ((totalDuties / cif) * 100).toFixed(1),
    rates,
    breakdown: [
      { label: 'قيمة السيارة (CIF)',       amount: Math.round(cif),     pct: 100 },
      { label: 'رسوم جمركية',             amount: Math.round(customs),  pct: +(rates.customs * 100).toFixed(1) },
      { label: 'رسم التنمية',             amount: Math.round(dev),      pct: +(rates.dev * 100).toFixed(1) },
      { label: 'ضريبة الجدول',           amount: Math.round(table),    pct: +(rates.table * 100).toFixed(1) },
      { label: 'ضريبة القيمة المضافة 14%', amount: Math.round(vat),    pct: 14 },
    ],
  };
}
