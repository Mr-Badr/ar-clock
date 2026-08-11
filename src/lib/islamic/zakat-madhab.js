// The single source of truth for every madhab-conditional rule used by both Zakat calculators and
// both Zakat article pages — so the interactive math and the written comparison content can never
// drift apart (the comparison table renders directly from MADHABS[].rules, not hand-duplicated
// copy). Every rule below is sourced; see keyword-research/zakat-expansion-2026-08/FIQH-SOURCES.md
// for the full verification trail (Sunni sources only, per owner directive 2026-08-10/11).
//
// Real, sourced fiqh figures — not stylistic choices:
export const NISAB_GOLD_GRAMS = 85; // 85g pure (24k) gold — the near-universal popular figure used
// by every competitor checked this session (arabtoolbox.com, hasbati.com, Al-Azhar's own
// calculator). Not a madhab difference — all four schools agree the classical unit is 20 mithqal;
// the gram figure is a unit-conversion-methodology question. Ibn Baz's own site states a more
// precise 92g in one specific fatwa (binbaz.org.sa/fatwas/12410) — kept as a content note (see the
// "الأحوط" note rendered alongside the Nisab result), not swapped in as the default, since 85g
// matches near-universal convention and avoids a silent, confusing change for returning users.
export const NISAB_GOLD_GRAMS_CAUTIOUS = 92; // Ibn Baz's own more precise figure — shown as a note.
export const NISAB_SILVER_GRAMS = 595;
export const NISAB_SILVER_GRAMS_CAUTIOUS = 644; // same source, same "shown as a note" treatment.
export const ZAKAT_RATE = 0.025; // ربع العشر — 2.5%, agreed across all four schools.

// Zakat al-Fitr Sa' weights by grain type — see FIQH-SOURCES.md §4.
export const FITR_STAPLES = [
  { id: 'rice', label: 'أرز' },
  { id: 'wheat', label: 'قمح' },
  { id: 'flour', label: 'دقيق' },
  { id: 'dates', label: 'تمر' },
  { id: 'barley', label: 'شعير' },
];

export const MADHABS = [
  {
    id: 'hanafi',
    name: 'الحنفي',
    whereCommon: 'تركيا، بلاد الشام، العراق، مصر (نطاق واسع)، شبه القارة الهندية',
    color: 'blue',
    rules: {
      jewelryZakatable: true,
      defaultNisabBasis: 'silver',
      fitrCashAllowed: true,
      // Half-Sa' for wheat/flour/raisins, full Sa' for dates/barley — the Hanafi school
      // distinguishes by grain type, unlike the other three (see FIQH-SOURCES.md §4).
      fitrSaaKgByStaple: { wheat: 1.625, flour: 1.625, rice: 3.25, dates: 3.25, barley: 3.25 },
    },
    sources: [
      { label: 'إسلام ويب — حكم زكاة الحلي المُعَدّ للاستعمال (الحنفية والجمهور)', url: 'https://www.islamweb.net/ar/fatwa/137296' },
      { label: 'دار الإفتاء المصرية — مقدار زكاة الفطر عند السادة الحنفية', url: 'https://www.dar-alifta.org/ar/fatwa/details/11208' },
    ],
  },
  {
    id: 'maliki',
    name: 'المالكي',
    whereCommon: 'المغرب، الجزائر، تونس، ليبيا، موريتانيا (شمال أفريقيا عموماً)',
    color: 'green',
    rules: {
      jewelryZakatable: false,
      defaultNisabBasis: 'gold',
      fitrCashAllowed: false,
      fitrCashCaveat: 'موقف المالكية من أشد المذاهب رفضاً لإخراج زكاة الفطر نقداً كلاسيكياً — الطعام هو الأصل عندهم تحديداً.',
      fitrSaaKgByStaple: { wheat: 2.04, flour: 2.04, rice: 2.04, dates: 2.04, barley: 2.04 },
    },
    sources: [
      { label: 'إسلام ويب — حكم زكاة الحلي المُعَدّ للاستعمال', url: 'https://www.islamweb.net/ar/fatwa/137296' },
    ],
  },
  {
    id: 'shafii',
    name: 'الشافعي',
    whereCommon: 'اليمن، شرق أفريقيا، جنوب شرق آسيا',
    color: 'amber',
    rules: {
      jewelryZakatable: false,
      defaultNisabBasis: 'gold',
      fitrCashAllowed: false,
      fitrCashCaveat: 'الموقف الكلاسيكي إخراجها طعاماً، وبعض هيئات الإفتاء المعاصرة تجيز النقد لتيسير التوزيع — تحقّق من فتوى بلدك.',
      fitrSaaKgByStaple: { wheat: 2.04, flour: 2.04, rice: 2.04, dates: 2.04, barley: 2.04 },
    },
    sources: [
      { label: 'إسلام ويب — حكم زكاة الحلي المُعَدّ للاستعمال', url: 'https://www.islamweb.net/ar/fatwa/137296' },
    ],
  },
  {
    id: 'hanbali',
    name: 'الحنبلي',
    whereCommon: 'السعودية (المذهب الرسمي للإفتاء)',
    color: 'red',
    rules: {
      jewelryZakatable: false,
      defaultNisabBasis: 'silver', // "الأحظ للفقراء" — موقف اللجنة الدائمة الفعلي للأوراق النقدية.
      fitrCashAllowed: false,
      fitrCashCaveat: 'الموقف الكلاسيكي إخراجها طعاماً، وبعض هيئات الإفتاء المعاصرة تجيز النقد لتيسير التوزيع — تحقّق من فتوى بلدك.',
      fitrSaaKgByStaple: { wheat: 3, flour: 3, rice: 3, dates: 3, barley: 3 }, // ابن باز: "ثلاثة كيلو تقريباً" احتياطاً.
    },
    sources: [
      { label: 'موقع الشيخ ابن باز — حكم زكاة الأموال في المساهمات التجارية والاستثمارية', url: 'https://binbaz.org.sa/fatwas/2569' },
      { label: 'موقع الشيخ ابن باز — تفصيل أحوال زكاة الدين', url: 'https://binbaz.org.sa/fatwas/6264' },
      { label: 'موقع الشيخ ابن باز — مقدار نصاب الذهب والفضة بالغرامات', url: 'https://binbaz.org.sa/fatwas/12410' },
      { label: 'موقع الشيخ ابن باز — مقدار الصاع في زكاة الفطر بالكيلو', url: 'https://binbaz.org.sa/fatwas/9263' },
    ],
  },
  {
    id: 'cautious',
    name: 'لا أعرف — اتبع الأحوط',
    whereCommon: 'الخيار الافتراضي لمن لا يتبع مذهباً محدداً',
    color: 'blue',
    recommended: true,
    // Deliberately the branch yielding the larger obligation on every axis — internally
    // consistent, matches the existing Ibn-Baz-sourced default so nothing silently changes for
    // users who don't pick a madhab, and is explainable in one sentence.
    rules: {
      jewelryZakatable: true,
      defaultNisabBasis: 'silver',
      fitrCashAllowed: true,
      fitrSaaKgByStaple: { wheat: 3, flour: 3, rice: 3, dates: 3, barley: 3 },
    },
    sources: [
      { label: 'موقع الشيخ ابن باز — مقدار الصاع في زكاة الفطر بالكيلو', url: 'https://binbaz.org.sa/fatwas/9263' },
    ],
  },
];

export function getMadhabRules(id) {
  return MADHABS.find((m) => m.id === id) ?? MADHABS.find((m) => m.id === 'cautious');
}

export function getFitrSaaKg(madhabId, stapleId) {
  const madhab = getMadhabRules(madhabId);
  return madhab.rules.fitrSaaKgByStaple[stapleId] ?? madhab.rules.fitrSaaKgByStaple.wheat;
}

// Real, sourced fiqh nuance NOT implemented as a computed calculator branch — see
// FIQH-SOURCES.md §2 for why. Rendered as content only (the madhab-comparison table), never as a
// silent toggle that changes a number: the disagreement is genuinely narrower and messier than a
// clean per-madhab binary (it includes an internal Hanbali split), and no source found addresses
// whether it extends from metal-to-metal into metal-to-cash — implementing it as logic would be an
// unverified reach on a religious calculation.
export const GOLD_SILVER_COMBINING_NOTE = {
  hanafi: 'يجيز ضم الذهب والفضة معاً لبلوغ النصاب إن لم يبلغه أحدهما منفرداً.',
  maliki: 'يجيز ضم الذهب والفضة معاً لبلوغ النصاب، كالحنفية.',
  shafii: 'لا يُضم الذهب إلى الفضة — يجب أن يبلغ كل معدن نصابه الخاص منفرداً.',
  hanbali: 'الرواية المعتمدة (وهي ما رجع إليه الإمام أحمد أخيراً): لا يُضم الذهب إلى الفضة، مع وجود رواية أخرى بالجواز.',
};
