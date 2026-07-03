/**
 * Electricity bill calculator — Saudi SEC & UAE DEWA residential tariffs.
 *
 * Saudi SEC tiers (Royal Decree M/56, 2018 — still current 2024):
 *   0–2,000 kWh: 0.05 SAR/kWh  | 2,001–4,000: 0.10  | 4,001–6,000: 0.20  | 6,001+: 0.30
 *   + Fixed service charge: 5.175 SAR/month
 *   + VAT 15% (applied to entire bill including service charge)
 *
 * UAE DEWA residential tiers (2024):
 *   0–2,000 kWh: 0.23 AED/kWh  | 2,001–4,000: 0.28  | 4,001–6,000: 0.32  | 6,001+: 0.38
 *   + Distribution charge: 0.038 AED/kWh (flat)
 *   + Fixed service charge: 6.6 AED/month
 *   + Fuel surcharge (variable — approx 0.06 AED/kWh, updated monthly by DEWA)
 *   + VAT 5%
 *
 * Sources: sec.gov.sa/ar — dewa.gov.ae/en/business/register/tariff-and-regulations
 */

// ─── Saudi SEC ────────────────────────────────────────────────────────────────

const _SA_TIERS = [
  { upTo: 2000, rate: 0.05 },
  { upTo: 4000, rate: 0.10 },
  { upTo: 6000, rate: 0.20 },
  { upTo: Infinity, rate: 0.30 },
];

const _SA_SERVICE_CHARGE = 5.175; // SAR/month
const _SA_VAT = 0.15;

/**
 * @param {number} kWh — monthly consumption
 * @returns {{ tierBreakdown, energyCharge, serviceCharge, subtotal, vat, total, currency }}
 */
export function calculateSaudiElectricityBill(kWh) {
  if (!Number.isFinite(kWh) || kWh < 0) return null;

  const tierBreakdown = [];
  let remaining = kWh;
  let prevLimit = 0;
  let energyCharge = 0;

  for (const tier of _SA_TIERS) {
    if (remaining <= 0) break;
    const tierLimit = tier.upTo === Infinity ? remaining : tier.upTo - prevLimit;
    const consumed = Math.min(remaining, tierLimit);
    const charge = consumed * tier.rate;
    tierBreakdown.push({
      from: prevLimit + 1 > kWh ? null : prevLimit + 1,
      to: tier.upTo === Infinity ? kWh : Math.min(prevLimit + tierLimit, kWh),
      consumed,
      rate: tier.rate,
      charge,
    });
    energyCharge += charge;
    remaining -= consumed;
    prevLimit = tier.upTo === Infinity ? kWh : tier.upTo;
  }

  const serviceCharge = _SA_SERVICE_CHARGE;
  const subtotal = energyCharge + serviceCharge;
  const vat = subtotal * _SA_VAT;
  const total = subtotal + vat;

  return {
    tierBreakdown: tierBreakdown.filter(t => t.consumed > 0),
    energyCharge,
    serviceCharge,
    subtotal,
    vat,
    total,
    currency: 'SAR',
    country: 'sa',
  };
}

// ─── UAE DEWA ─────────────────────────────────────────────────────────────────

const _AE_TIERS = [
  { upTo: 2000, rate: 0.23 },
  { upTo: 4000, rate: 0.28 },
  { upTo: 6000, rate: 0.32 },
  { upTo: Infinity, rate: 0.38 },
];

const _AE_DISTRIBUTION_RATE = 0.038; // AED/kWh flat
const _AE_FUEL_SURCHARGE_RATE = 0.06; // AED/kWh (approx — DEWA updates monthly)
const _AE_SERVICE_CHARGE = 6.6;       // AED/month
const _AE_VAT = 0.05;

export function calculateUAEElectricityBill(kWh) {
  if (!Number.isFinite(kWh) || kWh < 0) return null;

  const tierBreakdown = [];
  let remaining = kWh;
  let prevLimit = 0;
  let energyCharge = 0;

  for (const tier of _AE_TIERS) {
    if (remaining <= 0) break;
    const tierLimit = tier.upTo === Infinity ? remaining : tier.upTo - prevLimit;
    const consumed = Math.min(remaining, tierLimit);
    const charge = consumed * tier.rate;
    tierBreakdown.push({
      from: prevLimit + 1 > kWh ? null : prevLimit + 1,
      to: tier.upTo === Infinity ? kWh : Math.min(prevLimit + tierLimit, kWh),
      consumed,
      rate: tier.rate,
      charge,
    });
    energyCharge += charge;
    remaining -= consumed;
    prevLimit = tier.upTo === Infinity ? kWh : tier.upTo;
  }

  const distributionCharge = kWh * _AE_DISTRIBUTION_RATE;
  const fuelSurcharge = kWh * _AE_FUEL_SURCHARGE_RATE;
  const serviceCharge = _AE_SERVICE_CHARGE;
  const subtotal = energyCharge + distributionCharge + fuelSurcharge + serviceCharge;
  const vat = subtotal * _AE_VAT;
  const total = subtotal + vat;

  return {
    tierBreakdown: tierBreakdown.filter(t => t.consumed > 0),
    energyCharge,
    distributionCharge,
    fuelSurcharge,
    serviceCharge,
    subtotal,
    vat,
    total,
    currency: 'AED',
    country: 'ae',
    fuelSurchargeNote: 'رسوم الوقود تقريبية — تحدّثها هيئة كهرباء دبي شهرياً',
  };
}

// ─── Egypt EGYPTERA (Residential) ─────────────────────────────────────────────
//
// Egyptian Electricity Regulatory Authority (EGYPTERA) — Apr-2026 tariff.
// Rates are MARGINAL (progressive) — each tier's rate applies only to kWh in that band.
// Source: https://www.egyptera.org
// VERIFY vs official EGYPTERA bulletin before publishing.

const _EG_ELEC_TIERS = [
  { upTo: 50,       rate: 0.68 },
  { upTo: 100,      rate: 0.78 },
  { upTo: 200,      rate: 0.95 },
  { upTo: 350,      rate: 1.55 },
  { upTo: 650,      rate: 1.95 },
  { upTo: 1000,     rate: 2.10 },
  { upTo: Infinity, rate: 2.23 },
];

const _EG_ELEC_SERVICE_CHARGE = 2.0;  // EGP/month (indicative fixed admin fee)

/**
 * @param {number} kWh — monthly consumption
 * @returns {{ tierBreakdown, energyCharge, serviceCharge, subtotal, total, currency }}
 */
export function calculateEgyptElectricityBill(kWh) {
  if (!Number.isFinite(kWh) || kWh < 0) return null;

  const tierBreakdown = [];
  let remaining  = kWh;
  let prevLimit  = 0;
  let energyCharge = 0;

  for (const tier of _EG_ELEC_TIERS) {
    if (remaining <= 0) break;
    const tierSize  = tier.upTo === Infinity ? remaining : tier.upTo - prevLimit;
    const consumed  = Math.min(remaining, tierSize);
    const charge    = consumed * tier.rate;
    tierBreakdown.push({ from: prevLimit, to: Math.min(prevLimit + tierSize, kWh), consumed, rate: tier.rate, charge });
    energyCharge += charge;
    remaining    -= consumed;
    prevLimit    = tier.upTo === Infinity ? kWh : tier.upTo;
  }

  const serviceCharge = _EG_ELEC_SERVICE_CHARGE;
  const subtotal      = energyCharge + serviceCharge;

  return {
    tierBreakdown: tierBreakdown.filter(t => t.consumed > 0),
    energyCharge,
    serviceCharge,
    subtotal,
    total: subtotal,  // no VAT on residential electricity in Egypt
    currency: 'EGP',
    country: 'eg',
  };
}

// ─── Egypt Water Bill (HCWW / holding company residential) ────────────────────
//
// Holding Company for Water and Wastewater (HCWW) — residential tiers.
// Sewage = 65% of water bill. Regulatory fee = 0.5 EGP flat. VAT 14%.
// VERIFY vs https://www.hcww.com.eg before publishing.

const _EG_WATER_TIERS = [
  { upTo: 10,       rate: 2.0 },
  { upTo: 20,       rate: 3.0 },
  { upTo: 30,       rate: 5.0 },
  { upTo: Infinity, rate: 8.0 },
];

const _EG_WATER_SEWAGE_RATE    = 0.65;  // 65% of water charge
const _EG_WATER_REG_FEE        = 0.50;  // EGP/month flat
const _EG_WATER_VAT            = 0.14;

/**
 * @param {number} cubicMeters — monthly water consumption (m³)
 * @returns {{ tierBreakdown, waterCharge, sewageCharge, regFee, vat, total, currency }}
 */
export function calculateEgyptWaterBill(cubicMeters) {
  if (!Number.isFinite(cubicMeters) || cubicMeters < 0) return null;

  const tierBreakdown = [];
  let remaining   = cubicMeters;
  let prevLimit   = 0;
  let waterCharge = 0;

  for (const tier of _EG_WATER_TIERS) {
    if (remaining <= 0) break;
    const tierSize = tier.upTo === Infinity ? remaining : tier.upTo - prevLimit;
    const consumed = Math.min(remaining, tierSize);
    const charge   = consumed * tier.rate;
    tierBreakdown.push({ from: prevLimit, to: Math.min(prevLimit + tierSize, cubicMeters), consumed, rate: tier.rate, charge });
    waterCharge += charge;
    remaining   -= consumed;
    prevLimit   = tier.upTo === Infinity ? cubicMeters : tier.upTo;
  }

  const sewageCharge = waterCharge * _EG_WATER_SEWAGE_RATE;
  const regFee       = _EG_WATER_REG_FEE;
  const subtotal     = waterCharge + sewageCharge + regFee;
  const vat          = subtotal * _EG_WATER_VAT;
  const total        = subtotal + vat;

  return {
    tierBreakdown: tierBreakdown.filter(t => t.consumed > 0),
    waterCharge,
    sewageCharge,
    regFee,
    vat,
    total,
    currency: 'EGP',
    country: 'eg',
  };
}

export function getEgyptConsumptionCategory(kWh) {
  if (kWh <= 50)  return { label: 'منخفض جداً', color: 'var(--green-text)' };
  if (kWh <= 200) return { label: 'منخفض',      color: 'var(--green-text)' };
  if (kWh <= 500) return { label: 'متوسط',      color: 'var(--amber)' };
  if (kWh <= 800) return { label: 'مرتفع',      color: 'var(--red-text)' };
  return                  { label: 'مرتفع جداً', color: 'var(--red)' };
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export function formatBillAmount(amount, currency) {
  return new Intl.NumberFormat('ar-SA-u-nu-latn', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getConsumptionCategory(kWh, country) {
  if (country === 'ae') {
    if (kWh <= 500) return { label: 'منخفض جداً', color: '#16a34a' };
    if (kWh <= 1500) return { label: 'منخفض', color: '#65a30d' };
    if (kWh <= 3000) return { label: 'متوسط', color: '#d97706' };
    if (kWh <= 5000) return { label: 'مرتفع', color: '#ea580c' };
    return { label: 'مرتفع جداً', color: '#dc2626' };
  }
  // Saudi
  if (kWh <= 800) return { label: 'منخفض جداً', color: '#16a34a' };
  if (kWh <= 2000) return { label: 'منخفض', color: '#65a30d' };
  if (kWh <= 4000) return { label: 'متوسط', color: '#d97706' };
  if (kWh <= 6000) return { label: 'مرتفع', color: '#ea580c' };
  return { label: 'مرتفع جداً', color: '#dc2626' };
}
