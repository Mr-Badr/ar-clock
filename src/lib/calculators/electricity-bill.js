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
