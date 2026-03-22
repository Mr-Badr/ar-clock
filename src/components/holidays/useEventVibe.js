/**
 * components/holidays/useEventVibe.js
 * Logic hook for EventVibeCard.
 *
 * Provides dynamic, event-specific content:
 *   - getCategoryConfig(categoryId)       → visual identity per category
 *   - getUrgencyTier(daysLeft, category)  → urgency state + colors
 *   - getEventHeadline(slug, category, days, name) → emotional headline
 *   - getEventSubtext(slug, category, countryCode) → contextual subtext
 *   - getVibeStats(category, days, slug)  → stat pills specific to the event type
 *   - getArcData(category, days, slug)    → arc percentage + semantic meaning
 *
 * RULES:
 *   - No hardcoded colors — only var(--*) references
 *   - All strings in Arabic
 *   - Every category must have a valid config
 */

/* ── Category visual configurations ─────────────────────────────────── */
const CATEGORY_CONFIG = {
  islamic: {
    emoji: '🌙',
    label: 'مناسبة إسلامية',
    pattern: 'moon',
    accentCssVar: '--accent-alt',
    glowCssVar: '--accent-glow-strong',
    urgencyThresholds: { critical: 3, high: 10, medium: 30 },
  },
  national: {
    emoji: '🏳️',
    label: 'عيد وطني',
    pattern: 'wave',
    accentCssVar: '--success',
    glowCssVar: '--success-soft',
    urgencyThresholds: { critical: 3, high: 7, medium: 30 },
  },
  school: {
    emoji: '📚',
    label: 'مناسبة مدرسية',
    pattern: 'grid',
    accentCssVar: '--warning',
    glowCssVar: '--warning-soft',
    urgencyThresholds: { critical: 7, high: 14, medium: 45 }, // higher urgency earlier
  },
  holidays: {
    emoji: '🏖️',
    label: 'إجازة رسمية',
    pattern: 'wave',
    accentCssVar: '--success',
    glowCssVar: '--success-soft',
    urgencyThresholds: { critical: 2, high: 7, medium: 21 },
  },
  astronomy: {
    emoji: '🌍',
    label: 'فلكي وطبيعي',
    pattern: 'orbit',
    accentCssVar: '--info',
    glowCssVar: '--info-soft',
    urgencyThresholds: { critical: 1, high: 3, medium: 7 },
  },
  business: {
    emoji: '💼',
    label: 'مناسبة أعمال',
    pattern: 'grid',
    accentCssVar: '--accent-alt',
    glowCssVar: '--accent-glow',
    urgencyThresholds: { critical: 2, high: 5, medium: 14 },
  },
  support: {
    emoji: '💰',
    label: 'دعم اجتماعي',
    pattern: 'wave',
    accentCssVar: '--success',
    glowCssVar: '--success-soft',
    urgencyThresholds: { critical: 2, high: 5, medium: 10 },
  },
}

export function getCategoryConfig(categoryId) {
  return CATEGORY_CONFIG[categoryId] ?? CATEGORY_CONFIG.islamic
}

/* ── Urgency tier ─────────────────────────────────────────────────────
 * Returns different levels based on category-specific thresholds.
 * School events trigger urgency earlier (results anxiety is real).
 */
export function getUrgencyTier(daysLeft, categoryId = 'islamic') {
  const config = getCategoryConfig(categoryId)
  const { critical, high, medium } = config.urgencyThresholds

  if (daysLeft <= 0)        return { label: 'اليوم!',    level: 5, cssVar: '--danger',      softVar: '--danger-soft',  ringPulse: true }
  if (daysLeft === 1)       return { label: 'غداً!',     level: 4, cssVar: '--danger',      softVar: '--danger-soft',  ringPulse: true }
  if (daysLeft <= critical) return { label: 'قريب جداً', level: 3, cssVar: '--danger',      softVar: '--danger-soft',  ringPulse: true }
  if (daysLeft <= high)     return { label: 'هذا الأسبوع', level: 2, cssVar: '--warning',   softVar: '--warning-soft', ringPulse: false }
  if (daysLeft <= medium)   return { label: 'هذا الشهر',  level: 1, cssVar: '--accent-alt', softVar: '--accent-alt-soft', ringPulse: false }
  return { label: null, level: 0, cssVar: config.accentCssVar, softVar: '--accent-soft', ringPulse: false }
}

/* ── Event headline — slug-specific, not just category ───────────────
 * The user spent 3 seconds coming to this page. Give them something
 * that feels written specifically for THIS event, not a template.
 */
const SLUG_HEADLINES = {
  'ramadan':           (days) => days <= 7  ? 'رمضان على الأبواب — هيّئ نفسك' : days <= 30 ? 'رمضان يقترب — ابدأ التحضير' : `${days} يوماً تفصلك عن رمضان المبارك`,
  'eid-al-fitr':       (days) => days <= 3  ? 'عيد الفطر المبارك بعد أيام!' : `عيد الفطر يقترب — ${days} يوم متبقي`,
  'eid-al-adha':       (days) => days <= 3  ? 'عيد الأضحى المبارك وشيك!' : `عيد الأضحى بعد ${days} يوم`,
  'hajj-season':       (days) => days <= 10 ? 'الحجاج يستعدون لأقدس رحلة' : `موسم الحج بعد ${days} يوم`,
  'day-of-arafa':      (days) => days <= 3  ? 'أفضل أيام العام — يوم عرفة وشيك' : `يوم عرفة بعد ${days} يوم — صيامه يكفّر سنتين`,
  'laylat-al-qadr':    (days) => days <= 5  ? 'ليلة القدر — خير من ألف شهر' : `ليلة القدر بعد ${days} يوم`,
  'mawlid':            (days) => `ذكرى المولد النبوي الشريف بعد ${days} يوم`,
  'islamic-new-year':  (days) => `رأس السنة الهجرية الجديدة بعد ${days} يوم`,
  'ashura':            (days) => `يوم عاشوراء بعد ${days} يوم — صيامه سنة مؤكدة`,
  'isra-miraj':        (days) => `ذكرى الإسراء والمعراج بعد ${days} يوم`,
  'laylat-al-qadr':    (days) => `ليلة القدر — خير من ألف شهر`,
  'nisf-shaban':       (days) => `ليلة النصف من شعبان بعد ${days} يوم`,
  'first-dhul-hijjah': (days) => `أول ذي الحجة — أفضل أيام السنة — بعد ${days} يوم`,
  'saudi-national-day': (days) => days <= 7 ? 'اليوم الوطني السعودي — الاحتفال قريب!' : `اليوم الوطني السعودي بعد ${days} يوم`,
  'uae-national-day':  (days) => `اليوم الوطني الإماراتي بعد ${days} يوم`,
  'kuwait-national-day': (days) => `اليوم الوطني الكويتي بعد ${days} يوم`,
  'independence-day-algeria': (days) => `ذكرى استقلال الجزائر المجيد بعد ${days} يوم`,
  'bac-results-algeria':  (days) => days <= 14 ? `نتائج الباك قادمة — ${days} يوم للانتظار` : `نتائج الباكالوريا الجزائر بعد ${days} يوم`,
  'thanaweya-results':    (days) => days <= 14 ? `نتيجة الثانوية قريبة — ${days} يوم متبقي` : `نتيجة الثانوية العامة مصر بعد ${days} يوم`,
  'bac-results-morocco':  (days) => `نتائج الباكالوريا المغرب بعد ${days} يوم`,
  'sham-nessim':          (days) => `شم النسيم — ربيع مصر بعد ${days} يوم`,
  'salary-day-saudi':     (days) => days <= 5 ? `الراتب قادم — ${days} أيام فقط!` : `الراتب الحكومي السعودي بعد ${days} يوم`,
  'citizen-account-saudi': (days) => days <= 5 ? `حساب المواطن قادم — ${days} أيام!` : `حساب المواطن بعد ${days} يوم`,
  'salary-day-egypt':     (days) => days <= 5 ? `الراتب قادم — ${days} أيام!` : `الراتب الحكومي مصر بعد ${days} يوم`,
  'new-year':             (days) => `رأس السنة الميلادية بعد ${days} يوم`,
  'summer-season':        (days) => `بداية فصل الصيف فلكياً بعد ${days} يوم`,
  'winter-season':        (days) => `بداية فصل الشتاء فلكياً بعد ${days} يوم`,
  'spring-season':        (days) => `بداية فصل الربيع فلكياً بعد ${days} يوم`,
  'autumn-season':        (days) => `بداية فصل الخريف فلكياً بعد ${days} يوم`,
}

const CATEGORY_HEADLINE_FALLBACKS = {
  islamic:    (name, days) => days <= 10 ? `${name} — الموعد اقترب` : `${days} يوماً على ${name}`,
  national:   (name, days) => days <= 7  ? `احتفلوا — ${name} قريب` : `${days} يوماً على ${name}`,
  school:     (name, days) => days <= 14 ? `${name} — انتبه!` : `${days} يوماً على ${name}`,
  holidays:   (name, days) => days <= 7  ? `الإجازة قريبة — ${days} أيام!` : `${days} يوماً على ${name}`,
  astronomy:  (name, days) => `${name} — موعد فلكي دقيق بعد ${days} يوم`,
  business:   (name, days) => `${days} يوماً على ${name}`,
  support:    (name, days) => days <= 5  ? `${name} — الإيداع قريب!` : `${days} يوماً على ${name}`,
}

export function getEventHeadline(slug, categoryId, daysLeft, eventName) {
  const slugFn = SLUG_HEADLINES[slug]
  if (slugFn) return slugFn(daysLeft)

  const categoryFn = CATEGORY_HEADLINE_FALLBACKS[categoryId] ?? CATEGORY_HEADLINE_FALLBACKS.islamic
  return categoryFn(eventName, daysLeft)
}

/* ── Event subtext ────────────────────────────────────────────────────
 * Contextual one-liner below the headline.
 */
export function getEventSubtext(slug, categoryId, countryCode) {
  const SLUG_SUBTEXTS = {
    'ramadan': 'التواريخ قد تختلف بيوم بين الدول بسبب اختلاف طرق الحساب.',
    'eid-al-fitr': 'يعتمد الموعد النهائي على رؤية هلال شوال.',
    'eid-al-adha': 'يتزامن مع موسم الحج وذبح الأضاحي.',
    'hajj-season': 'يجمع ملايين المسلمين من أنحاء العالم في مكة المكرمة.',
    'day-of-arafa': 'أفضل أيام العام — يُستحب صيامه لغير الحاج.',
    'laylat-al-qadr': 'في الأوتار من آخر عشر ليالٍ — أرجحها ليلة 27.',
    'bac-results-algeria': 'تُنشر النتائج على bac.onec.dz فور الإعلان.',
    'thanaweya-results': 'تُنشر على results.moe.gov.eg أو بالرقم القومي.',
    'bac-results-morocco': 'تُنشر على massar.men.gov.ma.',
    'salary-day-saudi': 'في رمضان يُصرف مبكراً يوم 25.',
    'citizen-account-saudi': 'تحقق عبر تطبيق حساب المواطن أو ca.gov.sa.',
  }

  if (SLUG_SUBTEXTS[slug]) return SLUG_SUBTEXTS[slug]

  const CATEGORY_SUBTEXTS = {
    islamic:   'مناسبة إسلامية — التواريخ الهجرية قد تختلف بيوم بين الدول.',
    national:  'إجازة رسمية في البلاد — احتفالات وطنية.',
    school:    'تابع الجهات الرسمية للتأكيد النهائي.',
    holidays:  'إجازة رسمية — تحقق من تقويم جهة عملك.',
    astronomy: 'موعد فلكي محسوب بدقة — لا يتغير.',
    business:  'تاريخ تقديري — تحقق من الجهات الرسمية.',
    support:   'يُحدَّث شهرياً — قد يتقدم إذا وافق إجازة.',
  }

  return CATEGORY_SUBTEXTS[categoryId] ?? 'تابع آخر المستجدات.'
}

/* ── Arc data: percentage + label ────────────────────────────────────
 * The arc has different semantic meaning per category:
 *   islamic/national/school → progress through the year (how close we are)
 *   business/support        → progress through the month cycle
 *   astronomy               → day of year as percentage
 */
export function getArcData(categoryId, daysLeft) {
  const MAX_DAYS = {
    islamic:    365,
    national:   365,
    school:     365,
    holidays:   365,
    astronomy:  365,
    business:   30,
    support:    30,
  }

  const maxDays = MAX_DAYS[categoryId] ?? 365
  // Arc shows how much of the waiting period has elapsed (countdown → full arc)
  const elapsedPct = Math.max(0, Math.min(100, Math.round(((maxDays - daysLeft) / maxDays) * 100)))

  const RADIUS = 44
  const CIRC = 2 * Math.PI * RADIUS
  const OFFSET = CIRC - (elapsedPct / 100) * CIRC

  return {
    radius: RADIUS,
    circ: CIRC,
    offset: OFFSET,
    pct: elapsedPct,
  }
}

/* ── Stats pills: 2-3 stat chips per category ────────────────────────
 * Each category shows the most relevant numeric context for the event.
 */
export function getVibeStats(categoryId, daysLeft, slug) {
  const weeks  = Math.floor(daysLeft / 7)
  const months = Math.floor(daysLeft / 30)
  const hours  = daysLeft * 24

  switch (categoryId) {
    case 'islamic':
      return [
        { label: 'بالأسابيع', value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
        { label: 'بالأشهر',  value: months > 0 ? `${months} شهر`  : 'هذا الشهر'  },
        { label: 'التقويم',  value: 'هجري قمري' },
      ]

    case 'school':
      return [
        { label: 'أيام الانتظار', value: `${daysLeft} يوم` },
        { label: 'بالأسابيع',     value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
        { label: 'بالساعات',      value: hours < 1000 ? `${hours} ساعة` : `${(hours / 24).toFixed(0)} يوم` },
      ]

    case 'national':
      return [
        { label: 'بالأسابيع', value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
        { label: 'بالأشهر',  value: months > 0 ? `${months} شهر`  : 'هذا الشهر'  },
        { label: 'إجازة رسمية', value: 'نعم' },
      ]

    case 'astronomy':
      return [
        { label: 'أيام دقيقة', value: `${daysLeft} يوم` },
        { label: 'بالأسابيع', value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
        { label: 'الموعد', value: 'فلكي دقيق' },
      ]

    case 'support':
    case 'business': {
      const daysInCycle = categoryId === 'support' ? 30 : 30
      const pctThrough  = Math.round(((daysInCycle - daysLeft) / daysInCycle) * 100)
      return [
        { label: 'أيام متبقية',  value: `${daysLeft} يوم` },
        { label: '% من الشهر',  value: `${Math.max(0, pctThrough)}%` },
        { label: 'دورة الصرف', value: 'شهرية' },
      ]
    }

    case 'holidays':
      return [
        { label: 'أيام للإجازة', value: `${daysLeft} يوم` },
        { label: 'بالأسابيع',   value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
      ]

    default:
      return [
        { label: 'المتبقي', value: `${daysLeft} يوم` },
        { label: 'بالأسابيع', value: weeks > 0 ? `${weeks} أسبوع` : 'هذا الأسبوع' },
      ]
  }
}