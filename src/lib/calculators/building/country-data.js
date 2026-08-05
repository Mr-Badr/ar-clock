/**
 * Building Calculator — Country Data (14 Arab Countries)
 * cost_per_m2 values cover the full built area (materials + labour + contractor).
 *
 * **2026-08-04 re-sourcing (6 GCC countries only — sa/ae/kw/qa/bh/om)**: cross-checked against
 * real 2025/2026 published cost guides and industry reports (WebSearch/WebFetch, no Keyword
 * Planner round this time per owner's explicit go-ahead to skip the CSV step for construction —
 * see `keyword-research/construction-hub/DECISION.md` §2). Non-GCC countries (eg/jo/ma/dz/tn/iq/
 * lb/ly) were NOT touched this pass — still the original rough estimates, flagged for a future
 * pass. Per-country sources and confidence notes are on each country's `cost_per_m2` block below.
 * These stay real MARKET-PRICE RANGES (private contractor pricing, not a government rate card),
 * so "correct" here means "matches multiple independent 2025/2026 published guides," not a single
 * official number — same honesty standard applied to every other tool this session.
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
    // Re-sourced 2026-08-04 (was 900/1400/2200/3500/5500 — economy/standard tiers were meaningfully
    // higher than fresh 2025/2026 guides support). Sources: site-engineer.net's Riyadh finish-level
    // table (economy ~1,100/standard ~1,500/luxury ~2,000/premium ~2,800 SAR/m², shell+finish),
    // benna.com.sa's 2025 guide (economy 800-1,200/standard 1,300-1,800/premium 2,000-3,500+
    // SAR/m²), and Bayut's villa range (finished residential villas 3,400-7,600 SAR/m², upper
    // bound used to calibrate super_lux). Shell/skeleton ~600-800 SAR/m² per benna's structural-
    // cost breakdown (~57% of standard-tier total).
    cost_per_m2: {
      skeleton: 750, economy: 1050, standard: 1650, luxury: 2800, super_lux: 4500,
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
    // Re-sourced 2026-08-04 (was 8000/13000/20000/35000/60000 — roughly 1.5-2x too high across
    // every tier vs current 2026 guides). Sources: aqaar24.com's 250m² breakdown (shell 3,500-
    // 5,000/half-finished 5,500-7,500/fully-finished 7,500-10,000+ EGP/m²) and kaydc-eg.com's
    // finish-level table (economy 5,000-7,000/standard 7,500-8,500/luxury 10,000+ EGP/m²) — two
    // independent 2026 guides that broadly agree.
    cost_per_m2: {
      skeleton: 4000, economy: 6000, standard: 8000, luxury: 11000, super_lux: 16000,
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
    // Re-sourced 2026-08-04 (was 700/1200/1900/3200/6000 — roughly 2-3x too LOW against every
    // 2025/2026 source found, the largest gap of any GCC country in this audit). Sources: Knight
    // Frank's UAE Construction Landscape Review Q2 2025 (standard villas ~AED 4,200/m², high-end
    // villas ~AED 11,000/m² — used directly to anchor standard/super_lux), plus contractor guides
    // (engelvoelkers.com, optimal.ae, capitalassociated.com) quoting AED 300-500/sqft standard,
    // 600-850/sqft mid-luxury, 900-1,400+/sqft luxury (≈AED 3,230-15,070/m² across tiers).
    cost_per_m2: {
      skeleton: 2000, economy: 3000, standard: 4200, luxury: 7500, super_lux: 11000,
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
    // Re-sourced 2026-08-04 (was 180/280/450/750/1200 — standard tier was somewhat high against
    // the concrete data point found). Source: a 500 sqm mid-range Kuwaiti villa build totals
    // KWD 125,000-175,000 (≈KWD 250-350/m²) per architect-guide reporting (znsoarchitects.com);
    // ultra-luxury quoted as "exceeding KWD 400/m²". Weaker confidence than SA/AE/QA — only one
    // concrete villa-total data point found, not a tiered per-m² table — flagged for re-check.
    cost_per_m2: {
      skeleton: 150, economy: 220, standard: 320, luxury: 500, super_lux: 850,
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
    // Re-sourced 2026-08-04 (was 850/1350/2100/3800/7000 — standard/luxury tiers were below the
    // real quoted contractor range). Source: Qatar contractor guides (buildersnirvana.com,
    // arabmls.org) — mid-range finishes quoted at QAR 2,500-3,500/m², high-end/bespoke QAR
    // 5,000-8,000/m²+.
    cost_per_m2: {
      skeleton: 1400, economy: 2000, standard: 3000, luxury: 5500, super_lux: 8000,
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
    // Re-sourced 2026-08-04 — WEAKEST confidence of the 6 GCC countries in this audit. Only one
    // usable data point found: Bahraini press reporting "basic construction costs" at just over
    // BHD 100/m², up from BHD 85/m² the prior year (newsofbahrain.com, Sept 2025) — used to anchor
    // skeleton; the rest of the ladder is proportionally scaled from the old figures, NOT
    // independently sourced per tier. Flag this country for a dedicated re-check before treating
    // economy/standard/luxury/super_lux as anything more than a rough scaled estimate.
    cost_per_m2: {
      skeleton: 120, economy: 200, standard: 320, luxury: 550, super_lux: 900,
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
    // Verified 2026-08-04 — already well-calibrated, values kept as-is. Sources: Sands Of Wealth's
    // Muscat construction-cost figure (~OMR 514/m², essentially matches the existing "standard"
    // tier), and premium Integrated Tourism Complex developments quoted at OMR 750-1,000/m²
    // (matches the existing "luxury" tier closely). The only GCC country where the pre-existing
    // numbers needed no correction.
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
    // Re-sourced 2026-08-04 (was 280/450/700/1200/2000 — roughly 1.5-3x too high across every
    // tier). Source: nabd.com/صوت عمّان's 2026 Amman guide with a clear 5-tier breakdown (shell-
    // only 150-200/economy finish 220-300/medium finish 300-400/good finish 400-500/luxury
    // 500-650 JOD/m²), cross-checked against its own worked example (200m² house: shell 34,000
    // JOD ≈170/m², economy finish 52,000 JOD ≈260/m², medium finish 70,000 JOD ≈350/m²).
    cost_per_m2: {
      skeleton: 175, economy: 260, standard: 350, luxury: 450, super_lux: 575,
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
    // Re-sourced 2026-08-04 (was 3500/5500/8500/14000/22000 — modest downward adjustment, the
    // original estimate was already close). Source: lechantier.ma's own construction-cost
    // calculator tool (a direct Moroccan competitor to this page) publishes three tiers:
    // economic 3,500-6,300/standard 6,300-8,300/high-end 8,300-12,000 MAD/m², verified against
    // its own worked example (150m² G+1 villa, Casablanca, standard quality ≈9,545 MAD/m²
    // including architect fees).
    cost_per_m2: {
      skeleton: 3600, economy: 4900, standard: 7300, luxury: 10000, super_lux: 15000,
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
    // Re-sourced 2026-08-04 (was 55000/90000/140000/250000/400000 — roughly 2-2.7x too high).
    // Source: logementdz.com's 2026 guide gives labor-only shell cost at 8,000-15,000 DZD/m² and
    // a 100m² shell total of 3.5-5 million DZD (35,000-50,000 DZD/m² including materials); the
    // same guide notes finishing costs "equal or exceed" structural costs but gives no exact
    // finished-tier figures, so economy/standard/luxury/super_lux here are derived from that
    // structure cost using the same finish-to-shell ratios observed in better-sourced neighbor
    // markets — lower confidence than Egypt/Jordan/Morocco, flagged for a follow-up pass if a
    // clearer per-tier Algerian source turns up.
    cost_per_m2: {
      skeleton: 40000, economy: 55000, standard: 75000, luxury: 110000, super_lux: 150000,
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
    // Re-sourced 2026-08-04 (was 700/1100/1700/3000/5000 — the original estimate was already
    // close, only a minor adjustment). Sources agree construction by neighborhood tier runs
    // "شعبية" (popular) ~1,200/"متوسطة" (mid) ~1,800/"راقية" (upscale) 4,000+ TND/m² for 2025-2026.
    cost_per_m2: {
      skeleton: 750, economy: 1200, standard: 1800, luxury: 3000, super_lux: 4500,
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
    // Re-sourced 2026-08-04 (was 650000/1100000/1750000/3200000/5500000 — moderate downward
    // adjustment). Source: webhisab.com's 2025 Iraq guide gives shell-only ("كرستة وعمل")
    // cost ≈400,000 IQD/m² and a rough 40%-structure/60%-finishing split, implying a standard
    // finished cost near 1,000,000 IQD/m² — a single, weaker data point than Egypt/Jordan/
    // Morocco, flagged for a follow-up pass.
    cost_per_m2: {
      skeleton: 450000, economy: 700000, standard: 1000000, luxury: 1800000, super_lux: 2800000,
    },
    regions: {
      baghdad:  { name: 'بغداد',        m: 1.00 },
      basra:    { name: 'البصرة',       m: 0.92 },
      erbil:    { name: 'أربيل',        m: 0.95 },
      najaf:    { name: 'النجف',        m: 0.88 },
      other:    { name: 'محافظات أخرى', m: 0.82 },
    },
  },

  lb: {
    slug:        'lebanon',
    countryKey:  'lb',
    name:        'لبنان',
    nameShort:   'لبنان',
    currency:    'USD',
    symbol:      '$',
    flag:        '🇱🇧',
    dialectNote: 'الأسعار بالدولار الأمريكي (USD) — التعامل النقدي السائد بعد 2022',
    cementUnit:  'كيس',
    rebarUnit:   'طن',
    defaults: {
      cement_50kg: 12,
      rebar_ton:   1100,
      sand_m3:     28,
      gravel_m3:   38,
      labor_day:   50,
      tile_mid_m2: 22,
    },
    // Re-sourced 2026-08-04 (was 350/550/900/1600/3000 — roughly 2x too high on the lower tiers).
    // Source: 2026 Lebanon guides (post-2022 dollarized market) give apartment-in-building
    // construction at 150-200 USD/m², standalone village-house standard spec at 250-300 USD/m²,
    // and luxury residential projects at 500-1,500 USD/m² all-in (materials + labor + fees).
    cost_per_m2: {
      skeleton: 120, economy: 175, standard: 275, luxury: 700, super_lux: 1400,
    },
    regions: {
      beirut:   { name: 'بيروت',       m: 1.00 },
      tripoli:  { name: 'طرابلس',      m: 0.88 },
      sidon:    { name: 'صيدا',        m: 0.85 },
      zahle:    { name: 'زحلة',        m: 0.82 },
      other:    { name: 'مناطق أخرى', m: 0.80 },
    },
  },

  ly: {
    slug:       'libya',
    countryKey: 'ly',
    name:       'ليبيا',
    nameShort:  'ليبيا',
    currency:   'LYD',
    symbol:     'د.ل',
    flag:       '🇱🇾',
    cementUnit: 'كيس',
    rebarUnit:  'طن',
    defaults: {
      cement_50kg: 18,
      rebar_ton:   3200,
      sand_m3:     60,
      gravel_m3:   80,
      labor_day:   80,
      tile_mid_m2: 55,
    },
    // Checked 2026-08-04 as part of the non-GCC re-sourcing pass — no reliable text-extractable
    // 2025/2026 Libyan cost-per-m² source was found (search results were TikTok/Facebook video
    // posts with no readable pricing in the preview). Left unchanged from the original rough
    // estimate; still flagged for a future pass when a real published guide surfaces.
    cost_per_m2: {
      skeleton: 700, economy: 1150, standard: 1800, luxury: 3200, super_lux: 5500,
    },
    regions: {
      tripoli:  { name: 'طرابلس',      m: 1.00 },
      benghazi: { name: 'بنغازي',      m: 0.93 },
      misrata:  { name: 'مصراتة',      m: 0.90 },
      other:    { name: 'مناطق أخرى', m: 0.82 },
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
