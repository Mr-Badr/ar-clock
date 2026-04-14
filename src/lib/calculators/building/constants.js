/**
 * Building Calculator — Engineering Constants & Formulas
 * All values are internationally recognized physical/engineering standards.
 * These never change and do not need updating.
 *
 * Sources: ACI 318, ECP 203 (Egyptian Code), SBC (Saudi Building Code)
 */

// ─── Material Densities (kg/m³) ─────────────────────────────────────────────

export const DENSITIES = {
  cement: 1440,
  sand_dry: 1600,
  sand_wet: 1800,
  gravel_dry: 1700,
  gravel_wet: 1900,
  concrete_wet: 2400,
  concrete_dry: 2350,
  rebar_steel: 7850,
  water: 1000,
};

// Factor to convert dry volume to wet volume (globally fixed physical constant)
export const DRY_TO_WET_FACTOR = 1.54;

// ─── Concrete Mix Ratios (cement : sand : gravel by volume) ─────────────────

export const MIX_RATIOS = {
  M15: { cement: 1, sand: 2.0, gravel: 4.0 },
  M20: { cement: 1, sand: 1.5, gravel: 3.0 },
  M25: { cement: 1, sand: 1.0, gravel: 2.0 },
  M30: { cement: 1, sand: 0.75, gravel: 1.5 },
};

export const MIX_GRADES = [
  { key: 'M15', label: 'عيار 150 — M15', use: 'أعمال بسيطة وغير إنشائية',      strength: '15 نيوتن/مم²' },
  { key: 'M20', label: 'عيار 200 — M20', use: 'أعمدة وكمرات (مباني عادية)',     strength: '20 نيوتن/مم²' },
  { key: 'M25', label: 'عيار 250 — M25', use: 'أساسات وقواعد',                  strength: '25 نيوتن/مم²' },
  { key: 'M30', label: 'عيار 300 — M30', use: 'منشآت ثقيلة وجسور',              strength: '30 نيوتن/مم²' },
];

// كجم أسمنت لكل م³ خرسانة (قيم قياسية ثابتة)
export const CEMENT_KG_PER_M3 = {
  M15: 270,
  M20: 370,
  M25: 450,
  M30: 525,
};

// نسبة الماء / الأسمنت (ACI 318)
export const WATER_CEMENT_RATIOS = {
  M15: 0.55,
  M20: 0.50,
  M25: 0.45,
  M30: 0.40,
};

// ─── Rebar Weights (kg/m) ────────────────────────────────────────────────────
// Formula: W = d² / 162  where d is diameter in mm
// Derived from: W = ρ × (π/4) × d²  with ρ = 7850 kg/m³

export const REBAR_DIAMETERS = [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];

export const REBAR_WEIGHT_PER_METER = {
   8: 0.395,
  10: 0.617,
  12: 0.888,
  14: 1.208,
  16: 1.578,
  18: 1.998,
  20: 2.466,
  22: 2.984,
  25: 3.853,
  28: 4.830,
  32: 6.313,
};

export const REBAR_CROSS_SECTION = {
   8: 0.503,
  10: 0.785,
  12: 1.131,
  14: 1.539,
  16: 2.011,
  18: 2.545,
  20: 3.142,
  22: 3.801,
  25: 4.909,
  28: 6.158,
  32: 8.042,
};

export const REBAR_TYPICAL_USE = {
   8: 'كانات — حديد توزيع',
  10: 'أسقف — بلاطات',
  12: 'أسقف — كمرات',
  14: 'أعمدة صغيرة',
  16: 'أعمدة متوسطة',
  18: 'أساسات',
  20: 'أساسات ثقيلة',
  22: 'مشاريع كبيرة',
  25: 'منشآت ثقيلة',
  28: 'منشآت ثقيلة',
  32: 'جسور ضخمة',
};

// معدلات الحديد (كجم / م³ خرسانة) — ACI 318 + ECP 203
export const REBAR_RATES_PER_M3 = {
  isolated_footing: { min: 80,  max: 120, typical: 100, label: 'قاعدة منفردة'   },
  strip_footing:    { min: 80,  max: 100, typical: 90,  label: 'حزام أساس'      },
  raft_slab:        { min: 100, max: 160, typical: 130, label: 'شبكة أساس'      },
  columns:          { min: 100, max: 160, typical: 120, label: 'أعمدة'           },
  beams:            { min: 100, max: 150, typical: 120, label: 'كمرات'           },
  flat_slab:        { min: 70,  max: 100, typical: 85,  label: 'سقف مصمت'       },
  ribbed_slab:      { min: 60,  max: 90,  typical: 75,  label: 'سقف هوردي'      },
};

// ─── Tile Waste Percentages by Pattern ──────────────────────────────────────

export const TILE_WASTE = {
  straight:    0.10,
  diagonal:    0.15,
  herringbone: 0.20,
  complex:     0.25,
};

export const TILE_PATTERNS = [
  { key: 'straight',    label: 'مستقيم',        waste: '10%', icon: '▦' },
  { key: 'diagonal',    label: 'قطري 45°',       waste: '15%', icon: '◈' },
  { key: 'herringbone', label: 'هيرنج بون',      waste: '20%', icon: '▧' },
  { key: 'complex',     label: 'معقد / مخصص',    waste: '25%', icon: '⬡' },
];

export const TILE_SIZES = [
  { label: '20×20', w: 20, h: 20, defaultPerBox: 25 },
  { label: '30×30', w: 30, h: 30, defaultPerBox: 11 },
  { label: '40×40', w: 40, h: 40, defaultPerBox: 6  },
  { label: '45×45', w: 45, h: 45, defaultPerBox: 5  },
  { label: '60×60', w: 60, h: 60, defaultPerBox: 4  },
  { label: '60×120',w: 60, h: 120,defaultPerBox: 2  },
  { label: '80×80', w: 80, h: 80, defaultPerBox: 2  },
  { label: '100×100',w:100, h: 100,defaultPerBox: 1  },
];

// ─── Paint Coverage ──────────────────────────────────────────────────────────

export const PAINT_COVERAGE_PER_LITER = {
  primer:        10,
  interior_mat:  10,
  interior_silk:  9,
  exterior:       8,
  waterproof:     6,
};

export const PAINT_COATS = {
  primer: 1, interior_mat: 2, interior_silk: 2, exterior: 2, waterproof: 2,
};

// ─── Masonry Units per m² of wall ───────────────────────────────────────────

export const MASONRY_UNITS_PER_M2 = {
  red_brick: { perM2: 60,   label: 'طوب أحمر',     dims: '25×12×6.5 سم', mortarBags: 0.5 },
  block_20:  { perM2: 12.5, label: 'بلك 20 مجوف',  dims: '40×20×20 سم',  mortarBags: 0.3 },
  block_15:  { perM2: 12.5, label: 'بلك 15 مجوف',  dims: '40×15×20 سم',  mortarBags: 0.3 },
  block_10:  { perM2: 12.5, label: 'بلك 10 مجوف',  dims: '40×10×20 سم',  mortarBags: 0.25 },
};

// ─── Building Finish Levels ──────────────────────────────────────────────────

export const FINISH_LEVELS = [
  { key: 'skeleton',  label: 'هيكل فقط',      subLabel: 'عظم',          emoji: '🏗️', color: '#6B7280' },
  { key: 'economy',   label: 'اقتصادي',        subLabel: 'تشطيب خفيف',  emoji: '🏠', color: '#10B981' },
  { key: 'standard',  label: 'عادي',           subLabel: 'التشطيب الأكثر شيوعاً', emoji: '🏡', color: '#3B82F6' },
  { key: 'luxury',    label: 'لوكس',           subLabel: 'تشطيب راقٍ',  emoji: '✨', color: '#F59E0B' },
  { key: 'super_lux', label: 'سوبر لوكس',     subLabel: 'أعلى مستوى',  emoji: '👑', color: '#8B5CF6' },
];

// نوع المبنى — معامل تعديل التكلفة
export const BUILDING_TYPE_MULTIPLIER = {
  villa:      1.00,
  apartment:  0.88,
  commercial: 1.15,
};

export const BUILDING_TYPES = [
  { key: 'villa',      label: 'فيلا / منزل'   },
  { key: 'apartment',  label: 'شقة / عمارة'    },
  { key: 'commercial', label: 'تجاري / مكتبي'  },
];

// توزيع التكلفة الإجمالية (نسب تقريبية — تشطيب عادي)
export const COST_BREAKDOWN_STANDARD = {
  structure:  0.35,
  finishes:   0.22,
  walls:      0.18,
  mep:        0.15,
  foundation: 0.10,
};

export const COST_BREAKDOWN_LABELS = {
  structure:  'الهيكل الإنشائي',
  finishes:   'التشطيبات',
  walls:      'الجدران',
  mep:        'الكهرباء والسباكة',
  foundation: 'الأساسات',
};

// أكياس أسمنت (50كجم) لكل م² مبنى (تقديري شامل)
export const CEMENT_BAGS_PER_M2 = {
  skeleton: 2.5, economy: 3.5, standard: 4.2, luxury: 5.0, super_lux: 6.0,
};

// أطنان حديد لكل م² مبنى (تقديري)
export const REBAR_TONS_PER_M2 = {
  skeleton: 0.032, economy: 0.038, standard: 0.044, luxury: 0.050, super_lux: 0.056,
};

// ─── Chart Colors ────────────────────────────────────────────────────────────

export const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

// ─── Calculation Functions ───────────────────────────────────────────────────

/**
 * Calculate concrete ingredients for a given volume and grade.
 * @param {number}  volumeM3     - Target concrete volume in m³
 * @param {string}  grade        - 'M15' | 'M20' | 'M25' | 'M30'
 * @param {number}  bagWeightKg  - Cement bag weight (default 50 kg)
 * @param {number}  wasteFactor  - Waste fraction e.g. 0.05 = 5%
 */
export function calcConcrete(volumeM3, grade = 'M20', bagWeightKg = 50, wasteFactor = 0.05) {
  const cementKgPerM3 = CEMENT_KG_PER_M3[grade];
  const ratio = MIX_RATIOS[grade];
  const totalParts = ratio.cement + ratio.sand + ratio.gravel;

  const cementKg  = volumeM3 * cementKgPerM3 * (1 + wasteFactor);
  const bags      = Math.ceil(cementKg / bagWeightKg);
  const sandM3    = (volumeM3 * (ratio.sand   / totalParts) * DRY_TO_WET_FACTOR) * (1 + wasteFactor);
  const gravelM3  = (volumeM3 * (ratio.gravel / totalParts) * DRY_TO_WET_FACTOR) * (1 + wasteFactor);
  const waterL    = volumeM3 * cementKgPerM3 * WATER_CEMENT_RATIOS[grade] * 1000;

  return { cementKg, bags, sandM3, gravelM3, waterL };
}

/**
 * Calculate rebar weight and cost.
 * @param {number} diameterMm   - Bar diameter in mm
 * @param {number} totalLengthM - Total bar length in metres
 * @param {number} pricePerTon  - Price per ton in local currency (optional)
 */
export function calcRebarWeight(diameterMm, totalLengthM, pricePerTon = 0) {
  const weightPerMeter = REBAR_WEIGHT_PER_METER[diameterMm] ?? (diameterMm * diameterMm / 162);
  const totalKg   = totalLengthM * weightPerMeter;
  const totalTons = totalKg / 1000;
  const barsOf12m = Math.ceil(totalLengthM / 12);
  const cost      = pricePerTon > 0 ? totalTons * pricePerTon : 0;

  return { weightPerMeter, totalKg, totalTons, barsOf12m, cost };
}

/**
 * Calculate tiles needed for a surface area.
 */
export function calcTiles(areaM2, tileSizeW, tileSizeH, pattern = 'straight', tilesPerBox = 4) {
  const tilesPerM2     = 10000 / (tileSizeW * tileSizeH);
  const wasteFactor    = TILE_WASTE[pattern] ?? 0.10;
  const netTiles       = areaM2 * tilesPerM2;
  const tilesWithWaste = Math.ceil(netTiles * (1 + wasteFactor));
  const boxes          = Math.ceil(tilesWithWaste / tilesPerBox);

  return { tilesPerM2, netTiles, tilesWithWaste, boxes, wasteFactor };
}

/**
 * Calculate building total cost range from physical inputs.
 */
export function calcBuildingCost(
  areaM2,
  floors,
  finishLevel,
  countryData,
  buildingType = 'villa',
  regionMultiplier = 1.0,
) {
  const baseCostPerM2  = countryData.cost_per_m2[finishLevel] ?? 0;
  const typeMultiplier = BUILDING_TYPE_MULTIPLIER[buildingType] ?? 1.0;
  const totalArea      = areaM2 * floors;

  const midCost      = totalArea * baseCostPerM2 * typeMultiplier * regionMultiplier;
  const minCost      = midCost * 0.85;
  const maxCost      = midCost * 1.20;
  const costPerM2Mid = midCost / totalArea;
  const costPerM2Min = minCost / totalArea;
  const costPerM2Max = maxCost / totalArea;

  // Quick material estimates
  const cementBags  = Math.round(totalArea * (CEMENT_BAGS_PER_M2[finishLevel] ?? 4));
  const rebarTons   = parseFloat((totalArea * (REBAR_TONS_PER_M2[finishLevel] ?? 0.044)).toFixed(2));

  // Cost breakdown
  const breakdown = Object.entries(COST_BREAKDOWN_STANDARD).map(([key, pct]) => ({
    key,
    name:  COST_BREAKDOWN_LABELS[key],
    value: Math.round(midCost * pct),
    pct:   Math.round(pct * 100) + '%',
  }));

  return {
    totalArea, midCost, minCost, maxCost,
    costPerM2Mid, costPerM2Min, costPerM2Max,
    cementBags, rebarTons, breakdown,
  };
}

// ─── Re-export formatting helpers from country-data ─────────────────────────
// This lets components import fmt/formatCurrency from one file (constants.js)
// instead of having to know they live in country-data.js.
export { fmt, formatCurrency } from '@/lib/calculators/building/country-data';
