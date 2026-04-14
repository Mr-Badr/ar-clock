/**
 * Building Calculator — Country Data (12 Arab Countries)
 * Prices are reasonable estimates (Mid-2025). Users can override them.
 * cost_per_m2 values cover the full built area (materials + labour + contractor).
 */

export const COUNTRY_DATA = {
  sa: {
    slug:        'saudi-arabia',
    countryKey:  'sa',
    name:        'المملكة العربية السعودية',
    nameShort:   'السعودية',
    currency:    'SAR',
    symbol:      'ر.س',
    flag:        '🇸🇦',
    unitSystem:  'gulf',
    cementUnit:  'كيس',
    rebarUnit:   'طن',
    defaults: {
      cement_50kg: 18,
      rebar_ton:   2800,
      sand_m3:     25,
      gravel_m3:   30,
      labor_day:   120,
      tile_mid_m2: 45,
    },
    cost_per_m2: {
      skeleton: 900, economy: 1400, standard: 2200, luxury: 3500, super_lux: 5500,
    },
    regions: {
      riyadh:  { name: 'الرياض',          m: 1.00 },
      jeddah:  { name: 'جدة',             m: 1.08 },
      mecca:   { name: 'مكة المكرمة',     m: 1.15 },
      medina:  { name: 'المدينة المنورة', m: 1.05 },
      dammam:  { name: 'الدمام',          m: 0.95 },
      khobar:  { name: 'الخبر',           m: 0.97 },
      taif:    { name: 'الطائف',          m: 0.90 },
      other:   { name: 'مناطق أخرى',     m: 0.88 },
    },
  },

  eg: {
    slug:        'egypt',
    countryKey:  'eg',
    name:        'مصر',
    nameShort:   'مصر',
    currency:    'EGP',
    symbol:      'ج.م',
    flag:        '🇪🇬',
    dialectNote: 'يُستخدم "شيكارة" بدل "كيس" للأسمنت',
    cementUnit:  'شيكارة',
    rebarUnit:   'طن',
    defaults: {
      cement_50kg: 205,
      rebar_ton:   38000,
      sand_m3:     400,
      gravel_m3:   550,
      labor_day:   350,
      tile_mid_m2: 300,
    },
    cost_per_m2: {
      skeleton: 8000, economy: 13000, standard: 20000, luxury: 35000, super_lux: 60000,
    },
    regions: {
      cairo:       { name: 'القاهرة الكبرى',  m: 1.00 },
      alexandria:  { name: 'الإسكندرية',      m: 0.92 },
      giza:        { name: 'الجيزة',          m: 1.05 },
      new_cities:  { name: 'المدن الجديدة',   m: 1.15 },
      october:     { name: '6 أكتوبر',        m: 1.10 },
      delta:       { name: 'الدلتا',          m: 0.82 },
      upper_egypt: { name: 'الصعيد',          m: 0.75 },
      other:       { name: 'محافظات أخرى',    m: 0.78 },
    },
  },

  ae: {
    slug:       'uae',
    countryKey: 'ae',
    name:       'الإمارات العربية المتحدة',
    nameShort:  'الإمارات',
    currency:   'AED',
    symbol:     'د.إ',
    flag:       '🇦🇪',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 12,
      rebar_ton:   2500,
      sand_m3:     30,
      gravel_m3:   40,
      labor_day:   150,
      tile_mid_m2: 80,
    },
    cost_per_m2: {
      skeleton: 700, economy: 1200, standard: 1900, luxury: 3200, super_lux: 6000,
    },
    regions: {
      dubai:    { name: 'دبي',         m: 1.00 },
      abudhabi: { name: 'أبوظبي',     m: 1.05 },
      sharjah:  { name: 'الشارقة',    m: 0.88 },
      ajman:    { name: 'عجمان',      m: 0.82 },
      rak:      { name: 'رأس الخيمة', m: 0.78 },
      fujairah: { name: 'الفجيرة',    m: 0.80 },
      other:    { name: 'إمارات أخرى',m: 0.80 },
    },
  },

  kw: {
    slug:       'kuwait',
    countryKey: 'kw',
    name:       'الكويت',
    nameShort:  'الكويت',
    currency:   'KWD',
    symbol:     'د.ك',
    flag:       '🇰🇼',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 2.5,
      rebar_ton:   280,
      sand_m3:     5,
      gravel_m3:   6,
      labor_day:   20,
      tile_mid_m2: 12,
    },
    cost_per_m2: {
      skeleton: 180, economy: 280, standard: 450, luxury: 750, super_lux: 1200,
    },
    regions: {
      capital:   { name: 'العاصمة',    m: 1.00 },
      ahmadi:    { name: 'الأحمدي',   m: 0.95 },
      hawalli:   { name: 'حولي',      m: 0.98 },
      jahra:     { name: 'الجهراء',   m: 0.90 },
      farwaniya: { name: 'الفروانية', m: 0.93 },
    },
  },

  qa: {
    slug:       'qatar',
    countryKey: 'qa',
    name:       'قطر',
    nameShort:  'قطر',
    currency:   'QAR',
    symbol:     'ر.ق',
    flag:       '🇶🇦',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 14,
      rebar_ton:   2600,
      sand_m3:     28,
      gravel_m3:   36,
      labor_day:   130,
      tile_mid_m2: 65,
    },
    cost_per_m2: {
      skeleton: 850, economy: 1350, standard: 2100, luxury: 3800, super_lux: 7000,
    },
    regions: {
      doha:  { name: 'الدوحة',      m: 1.00 },
      lusail: { name: 'لوسيل',     m: 1.05 },
      other: { name: 'مناطق أخرى', m: 0.88 },
    },
  },

  bh: {
    slug:       'bahrain',
    countryKey: 'bh',
    name:       'البحرين',
    nameShort:  'البحرين',
    currency:   'BHD',
    symbol:     'د.ب',
    flag:       '🇧🇭',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 1.2,
      rebar_ton:   220,
      sand_m3:     4,
      gravel_m3:   5,
      labor_day:   15,
      tile_mid_m2: 8,
    },
    cost_per_m2: {
      skeleton: 160, economy: 250, standard: 400, luxury: 700, super_lux: 1100,
    },
    regions: {
      manama: { name: 'المنامة',      m: 1.00 },
      riffa:  { name: 'الرفاع',      m: 0.95 },
      other:  { name: 'مناطق أخرى', m: 0.90 },
    },
  },

  om: {
    slug:       'oman',
    countryKey: 'om',
    name:       'سلطنة عُمان',
    nameShort:  'عُمان',
    currency:   'OMR',
    symbol:     'ر.ع',
    flag:       '🇴🇲',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 2.8,
      rebar_ton:   310,
      sand_m3:     5,
      gravel_m3:   7,
      labor_day:   18,
      tile_mid_m2: 9,
    },
    cost_per_m2: {
      skeleton: 200, economy: 320, standard: 500, luxury: 850, super_lux: 1400,
    },
    regions: {
      muscat:   { name: 'مسقط الكبرى', m: 1.00 },
      salalah:  { name: 'صلالة',        m: 0.90 },
      sohar:    { name: 'صحار',         m: 0.88 },
      other:    { name: 'محافظات أخرى', m: 0.85 },
    },
  },

  jo: {
    slug:       'jordan',
    countryKey: 'jo',
    name:       'الأردن',
    nameShort:  'الأردن',
    currency:   'JOD',
    symbol:     'د.أ',
    flag:       '🇯🇴',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 5.5,
      rebar_ton:   680,
      sand_m3:     12,
      gravel_m3:   15,
      labor_day:   25,
      tile_mid_m2: 18,
    },
    cost_per_m2: {
      skeleton: 280, economy: 450, standard: 700, luxury: 1200, super_lux: 2000,
    },
    regions: {
      amman: { name: 'عمّان',      m: 1.00 },
      zarqa: { name: 'الزرقاء',   m: 0.85 },
      irbid: { name: 'إربد',      m: 0.88 },
      aqaba: { name: 'العقبة',    m: 0.92 },
      other: { name: 'مناطق أخرى',m: 0.83 },
    },
  },

  ma: {
    slug:        'morocco',
    countryKey:  'ma',
    name:        'المغرب',
    nameShort:   'المغرب',
    currency:    'MAD',
    symbol:      'د.م',
    flag:        '🇲🇦',
    unitSystem:  'moroccan',
    dialectNote: 'يُستخدم "خنشة" بدل "كيس" و"قنطار" (100كجم) للحديد',
    cementUnit:  'خنشة',
    rebarUnit:   'قنطار',
    defaults: {
      cement_50kg: 80,
      rebar_ton:   9000,
      sand_m3:     320,
      gravel_m3:   750,
      labor_day:   300,
      tile_mid_m2: 80,
    },
    cost_per_m2: {
      skeleton: 3500, economy: 5500, standard: 8500, luxury: 14000, super_lux: 22000,
    },
    regions: {
      casablanca: { name: 'الدار البيضاء', m: 1.00 },
      rabat:      { name: 'الرباط',        m: 0.97 },
      marrakesh:  { name: 'مراكش',         m: 0.92 },
      fes:        { name: 'فاس',           m: 0.88 },
      tanger:     { name: 'طنجة',          m: 0.95 },
      agadir:     { name: 'أكادير',        m: 0.90 },
      meknes:     { name: 'مكناس',         m: 0.85 },
      other:      { name: 'مدن أخرى',      m: 0.80 },
    },
  },

  dz: {
    slug:       'algeria',
    countryKey: 'dz',
    name:       'الجزائر',
    nameShort:  'الجزائر',
    currency:   'DZD',
    symbol:     'د.ج',
    flag:       '🇩🇿',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 600,
      rebar_ton:   120000,
      sand_m3:     4000,
      gravel_m3:   5500,
      labor_day:   1500,
      tile_mid_m2: 1800,
    },
    cost_per_m2: {
      skeleton: 55000, economy: 90000, standard: 140000, luxury: 250000, super_lux: 400000,
    },
    regions: {
      algiers:     { name: 'الجزائر العاصمة', m: 1.00 },
      oran:        { name: 'وهران',            m: 0.90 },
      constantine: { name: 'قسنطينة',          m: 0.88 },
      annaba:      { name: 'عنابة',            m: 0.85 },
      other:       { name: 'ولايات أخرى',      m: 0.78 },
    },
  },

  tn: {
    slug:       'tunisia',
    countryKey: 'tn',
    name:       'تونس',
    nameShort:  'تونس',
    currency:   'TND',
    symbol:     'د.ت',
    flag:       '🇹🇳',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 12,
      rebar_ton:   2200,
      sand_m3:     25,
      gravel_m3:   35,
      labor_day:   45,
      tile_mid_m2: 45,
    },
    cost_per_m2: {
      skeleton: 700, economy: 1100, standard: 1700, luxury: 3000, super_lux: 5000,
    },
    regions: {
      tunis:   { name: 'تونس العاصمة', m: 1.00 },
      sfax:    { name: 'صفاقس',        m: 0.90 },
      sousse:  { name: 'سوسة',         m: 0.92 },
      other:   { name: 'ولايات أخرى',  m: 0.85 },
    },
  },

  iq: {
    slug:       'iraq',
    countryKey: 'iq',
    name:       'العراق',
    nameShort:  'العراق',
    currency:   'IQD',
    symbol:     'د.ع',
    flag:       '🇮🇶',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 8000,
      rebar_ton:   1400000,
      sand_m3:     25000,
      gravel_m3:   35000,
      labor_day:   20000,
      tile_mid_m2: 25000,
    },
    cost_per_m2: {
      skeleton: 650000, economy: 1100000, standard: 1750000, luxury: 3200000, super_lux: 5500000,
    },
    regions: {
      baghdad:  { name: 'بغداد',        m: 1.00 },
      basra:    { name: 'البصرة',       m: 0.92 },
      erbil:    { name: 'أربيل',        m: 0.95 },
      najaf:    { name: 'النجف',        m: 0.88 },
      other:    { name: 'محافظات أخرى', m: 0.82 },
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const COUNTRY_LIST = Object.values(COUNTRY_DATA);

// Slug → countryKey lookup
export const SLUG_TO_KEY = Object.fromEntries(
  COUNTRY_LIST.map((c) => [c.slug, c.countryKey]),
);

/** For Next.js generateStaticParams */
export function getBuildingCountrySlugs() {
  return COUNTRY_LIST.map((c) => ({ country: c.slug }));
}

/** Get country data by slug (for [country] dynamic pages) */
export function getCountryBySlug(slug) {
  const key = SLUG_TO_KEY[slug];
  return key ? COUNTRY_DATA[key] : null;
}

/**
 * Format a monetary amount with the country symbol.
 * Uses Arabic-locale number grouping but Latin digits for readability.
 */
export function formatCurrency(amount, symbol, decimals = 0) {
  if (!isFinite(amount) || amount === 0) return `0 ${symbol}`;
  const rounded = decimals === 0 ? Math.round(amount) : amount;
  const formatted = new Intl.NumberFormat('ar-SA-u-nu-latn', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  }).format(rounded);
  return `${formatted} ${symbol}`;
}

/** Format a plain number with Arabic grouping */
export function fmt(n, decimals = 0) {
  if (!isFinite(n)) return '0';
  return new Intl.NumberFormat('ar-SA-u-nu-latn', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(decimals === 0 ? Math.round(n) : n);
}
