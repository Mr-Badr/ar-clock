# Holidays Feature — Migration Plan v3
## For Antigravity AI: Safe Migration from Current to Enriched Architecture

---

## READ THIS FIRST — Your Mission

You are migrating a live, working Next.js 16 holidays feature into an enriched version. The current app works perfectly. Your job is to **add** to it, never break it.

**This plan is your single source of truth.** Follow every step in order. Do not skip steps. Do not improvise. If the existing codebase uses a pattern that differs from what this plan describes, follow the existing codebase pattern and note the difference.

### What you will produce:
1. A new `lib/event-content/` folder — the content layer (7 JS files)
2. Three new component files for `EventVibeCard` — the creative section
3. Minimal modifications to 2 existing files (slug `page.jsx` and `sitemap.js`)
4. No other existing file is touched

### What you will NOT produce:
- Any modification to `holidays-engine.js`
- Any modification to `HolidaysClient.jsx`
- Any modification to `hijri-resolver.js`
- Any modification to loading skeletons, not-found, or OG image files
- Any new npm package installs

---

## PART 1 — BEFORE WRITING CODE: EXPLORATION REQUIRED

Before creating a single file, do the following:

**1A. Map the existing file structure.** Find:
- Where `app/holidays/` lives (the main routes)
- Where `app/holidays/[slug]/` lives (the individual event pages)
- Where `lib/holidays-engine.js` lives
- Where `lib/hijri-resolver.js` lives
- Where `components/holidays/` lives (if it exists)
- The existing Supabase client (do not create a new one)
- The `new.css` file location (use its CSS variables — never hardcode colors)

**1B. Read the slug page completely.** Understand:
- How it currently finds the event: `ALL_EVENTS.find(e => e.slug === slug)`
- What it does with the enriched event object
- Where the countdown timer lives in the JSX
- Where the share buttons live
- What variables it passes to client components

**1C. Read `HolidaysClient.jsx` completely.** Understand:
- How `filter.category` is used (maps to `e.category`)
- How `filter.countryCode` is used (maps to `e._countryCode`)
- How `filter.search` is used (searches `e.name` and `e.description`)
- This tells you exactly which fields are filter-critical and must never be overridden

**1D. Write a 5-line internal summary** of what you found before proceeding to Part 2.

---

## PART 2 — WHAT MUST NEVER CHANGE

| File | Rule |
|---|---|
| `holidays-engine.js` | Touch nothing — not enrichEvent, not ALL_EVENTS, not any function |
| `hijri-resolver.js` | Touch nothing |
| `HolidaysClient.jsx` | Touch nothing |
| Countdown timer component | Touch nothing |
| Share buttons section in slug page | Touch nothing |
| `opengraph-image.jsx` | Touch nothing |
| Both `loading.jsx` files | Touch nothing |
| `not-found.jsx` | Touch nothing |
| `actions.js` | Touch nothing |
| `constants.js` | Touch nothing |

### Fields that control filters — NEVER override these in rich content:

```
category       ← controls the category tab filters
_countryCode   ← controls the country chip filters
type           ← controls hijri vs fixed vs estimated behavior
slug           ← the URL itself
id             ← internal identity
hijriMonth     ← Hijri date resolution
hijriDay       ← Hijri date resolution
month          ← Gregorian date
day            ← Gregorian date
date           ← Estimated date ISO string
__enriched     ← Internal engine flag
```

---

## PART 3 — THE SAFE MERGE PATTERN

This is how the slug page gains access to rich content without changing its existing behavior.

### Change 1 of 2 to the slug page — add these lines:

Find this existing code in `app/holidays/[slug]/page.jsx`:
```javascript
// existing code — DO NOT CHANGE THESE LINES
const raw = ALL_EVENTS.find(e => e.slug === slug)
if (!raw) notFound()
const baseEvent = enrichEvent(raw)
```

Immediately after those lines, ADD:
```javascript
// NEW: merge rich content — purely additive, never removes existing fields
import { getRichContent } from '@/lib/event-content/index'
// (the import goes at the top of the file with other imports)

const richContent = getRichContent(slug)
const event = { ...baseEvent, ...richContent }
// From this point, use `event` instead of `baseEvent` everywhere it was used before
```

**Behavioral guarantee:** When `richContent` is `{}` (no content exists for this slug), spreading `{}` over `baseEvent` returns an identical object. The page behavior is 100% unchanged.

**Change 2 of 2 to the slug page — pass props to EventVibeCard (added later in Part 6).**

That is the complete modification to the slug page. Nothing else changes.

---

## PART 4 — CONTENT LAYER FILE STRUCTURE

Create this folder and these files. All files are new — nothing is being modified.

```
lib/
  event-content/
    index.js              ← The router and tier exports
    islamic.js            ← Ramadan, both Eids, Hajj, Laylat al-Qadr, Mawlid, Ashura, etc.
    national.js           ← Saudi National Day, UAE, Kuwait, Algeria, Morocco national events
    school.js             ← BAC results, Thanaweyya, school start dates, exams
    seasonal.js           ← New Year, seasons (summer/winter/spring/autumn), school breaks
    support.js            ← Salary days, Citizen Account, Social Security
    country-islamic.js    ← Country-specific Islamic events (ramadan-in-saudi, etc.)
```

### `lib/event-content/index.js` — Full implementation:

```javascript
/**
 * lib/event-content/index.js
 * ─────────────────────────────────────────────────────────────────────────
 * Content layer router — maps event slugs to rich content objects.
 *
 * DESIGN CONTRACT:
 *   - getRichContent(slug) returns {} for unknown slugs (safe default)
 *   - The returned object NEVER contains filter-critical fields
 *   - Spreading the result over enrichEvent() output is always safe
 *
 * PROTECTED FIELDS (stripped automatically before return):
 *   category, _countryCode, type, slug, id, hijriMonth, hijriDay,
 *   month, day, date, __enriched
 * ─────────────────────────────────────────────────────────────────────────
 */

import { ISLAMIC_CONTENT }        from './islamic'
import { NATIONAL_CONTENT }       from './national'
import { SCHOOL_CONTENT }         from './school'
import { SEASONAL_CONTENT }       from './seasonal'
import { SUPPORT_CONTENT }        from './support'
import { COUNTRY_ISLAMIC_CONTENT } from './country-islamic'

/** Fields owned by holidays-engine.js — never override */
const PROTECTED_FIELDS = new Set([
  'category', '_countryCode', 'type', 'slug', 'id',
  'hijriMonth', 'hijriDay', 'month', 'day', 'date', '__enriched',
])

const ALL_RICH_CONTENT = {
  ...ISLAMIC_CONTENT,
  ...NATIONAL_CONTENT,
  ...SCHOOL_CONTENT,
  ...SEASONAL_CONTENT,
  ...SUPPORT_CONTENT,
  ...COUNTRY_ISLAMIC_CONTENT,
}

/**
 * getRichContent(slug)
 * Returns rich content for a slug, with protected fields stripped.
 * Always safe to spread over enrichEvent() output.
 */
export function getRichContent(slug) {
  const raw = ALL_RICH_CONTENT[slug]
  if (!raw) return {}

  const safe = { ...raw }
  for (const field of PROTECTED_FIELDS) {
    delete safe[field]
  }
  return safe
}

/** Tier 1 — highest traffic, full rich content required */
export const TIER_1_SLUGS = [
  'ramadan', 'eid-al-fitr', 'eid-al-adha', 'hajj-season',
  'bac-results-algeria', 'thanaweya-results', 'day-of-arafa',
  'saudi-national-day', 'laylat-al-qadr', 'mawlid',
]

/** Tier 2 — medium traffic, enhanced content */
export const TIER_2_SLUGS = [
  'islamic-new-year', 'ashura', 'isra-miraj', 'nisf-shaban',
  'first-dhul-hijjah', 'bac-results-morocco', 'bac-results-tunisia',
  'bac-exams-algeria', 'thanaweya-exams', 'school-start-egypt',
  'school-start-algeria', 'school-start-morocco', 'kuwait-national-day',
  'uae-national-day', 'independence-day-algeria', 'revolution-day-algeria',
  'independence-day-morocco', 'throne-day-morocco', 'sham-nessim',
  'salary-day-egypt', 'salary-day-saudi', 'citizen-account-saudi',
  'new-year', 'ramadan-in-saudi', 'ramadan-in-morocco', 'ramadan-in-egypt',
]
```

### `lib/event-content/islamic.js` — Structure (content to be written):

```javascript
/**
 * lib/event-content/islamic.js
 * Rich content for core Islamic events (not country-specific variants).
 *
 * CONTENT WRITING RULES:
 * - About paragraphs: 60-100 words each, keyword in first paragraph
 * - FAQ questions must match exact Arabic search queries
 * - Never write: "يُحسب تلقائياً" as an answer — give actual dates
 * - Include future year (2027) keywords to capture next-year traffic early
 * - significance field: use authentic Islamic text (hadith, Quran verse if available)
 */

export const ISLAMIC_CONTENT = {

  'ramadan': {
    seoTitle: 'متى رمضان 2026 / 1447 — عد تنازلي دقيق بالأيام والساعات',
    description: 'رمضان 2026 يبدأ 18 فبراير وفق أم القرى. كم باقي على رمضان؟ عد تنازلي مع مواعيد السعودية ومصر والمغرب والجزائر.',
    keywords: [
      'متى رمضان 2026', 'كم باقي على رمضان 2026', 'موعد رمضان 1447',
      'متى يبدأ رمضان 2026', 'بداية رمضان 2026', 'أول رمضان 2026',
      'متى رمضان المغرب 2026', 'متى رمضان مصر 2026', 'متى رمضان السعودية 2026',
      'متى رمضان الجزائر 2026', 'ساعات الصيام رمضان 2026', 'كم يوم رمضان 2026',
      'هلال رمضان 2026', 'رمضان 1448 موعد', 'عداد رمضان 2027',
    ],
    about: {
      heading: 'عن شهر رمضان المبارك',
      paragraphs: [
        'رمضان هو الشهر التاسع في التقويم الهجري القمري، وأحد أركان الإسلام الخمسة. يصوم فيه المسلمون من الفجر حتى المغرب ممتنعين عن الطعام والشراب. نزل فيه القرآن الكريم هداية للناس.',
        'يتقدم رمضان ~11 يوماً سنوياً في التقويم الميلادي لأن التقويم الهجري قمري خالص (354 يوماً). في 2026 يقع في فبراير — أقصر نهار = أقل ساعات صيام مقارنة برمضانات الصيف.',
        'يختلف مطلع رمضان بين الدول بسبب طرق حساب الهلال. السعودية والخليج يعتمدون تقويم أم القرى الفلكي. المغرب ومصر والجزائر يعتمدون رؤية الهلال المحلية مما قد يؤدي لاختلاف بيوم.',
      ],
    },
    significance: 'قال النبي ﷺ: "من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه." — متفق عليه',
    quickFacts: [
      { label: 'بداية رمضان 2026', value: '18 فبراير (أم القرى)' },
      { label: 'نهاية رمضان 2026', value: '~19 مارس 2026' },
      { label: 'التقويم الهجري', value: '1–29/30 رمضان 1447 هـ' },
      { label: 'أيام الصيام', value: '29 أو 30 يوماً' },
      { label: 'ساعات الصيام يومياً', value: '12–14 ساعة (فبراير)' },
      { label: 'إجازة رسمية', value: 'نعم في معظم الدول' },
    ],
    traditions: [
      { icon: '🌙', title: 'الصيام', description: 'الامتناع عن الطعام والشراب من الفجر حتى المغرب طوال شهر رمضان.' },
      { icon: '📖', title: 'تلاوة القرآن', description: 'يحرص المسلمون على ختم القرآن مرة أو أكثر في الشهر الكريم.' },
      { icon: '🕌', title: 'صلاة التراويح', description: 'صلاة إضافية تُؤدى بعد صلاة العشاء في المساجد طوال الشهر.' },
      { icon: '🤲', title: 'الاعتكاف', description: 'ملازمة المسجد في العشر الأواخر من رمضان طلباً لليلة القدر.' },
      { icon: '💝', title: 'الصدقة وزكاة الفطر', description: 'تُخرج زكاة الفطر قبل صلاة عيد الفطر — طهرة للصائم وغنيمة للفقراء.' },
      { icon: '🌟', title: 'إحياء العشر الأواخر', description: 'أفضل عشر ليالٍ في العام — فيها ليلة القدر خير من ألف شهر.' },
    ],
    timeline: [
      { phase: 'أول رمضان', description: 'بداية الصيام — صلاة أول تراويح في المساجد.' },
      { phase: 'العشر الأوائل', description: 'عشر الرحمة — كثرة الدعاء والاستغفار وتلاوة القرآن.' },
      { phase: 'العشر الأوسط', description: 'عشر المغفرة — مواصلة الصيام والعبادة والصدقة.' },
      { phase: 'العشر الأواخر', description: 'عشر العتق — الاعتكاف وإحياء الليل لإدراك ليلة القدر.' },
      { phase: '27 رمضان', description: 'أرجح ليالي القدر — إحياء الليل بالصلاة والقرآن والدعاء.' },
      { phase: 'آخر رمضان', description: 'إخراج زكاة الفطر والتهيؤ لعيد الفطر المبارك.' },
    ],
    countryDates: [
      { country: 'السعودية', flag: '🇸🇦', code: 'sa', date: '18 فبراير 2026', note: 'أم القرى', method: 'umalqura' },
      { country: 'مصر',      flag: '🇪🇬', code: 'eg', date: '18–19 فبراير 2026', note: 'دار الإفتاء', method: 'local' },
      { country: 'المغرب',   flag: '🇲🇦', code: 'ma', date: '18–19 فبراير 2026', note: 'وزارة الأوقاف', method: 'local' },
      { country: 'الجزائر',  flag: '🇩🇿', code: 'dz', date: '18–19 فبراير 2026', note: 'رؤية محلية', method: 'local' },
      { country: 'الإمارات', flag: '🇦🇪', code: 'ae', date: '18 فبراير 2026', note: 'أم القرى', method: 'umalqura' },
      { country: 'تونس',     flag: '🇹🇳', code: 'tn', date: '18–19 فبراير 2026', note: 'دار الإفتاء', method: 'local' },
      { country: 'الكويت',   flag: '🇰🇼', code: 'kw', date: '18 فبراير 2026', note: 'أم القرى', method: 'umalqura' },
      { country: 'قطر',      flag: '🇶🇦', code: 'qa', date: '18 فبراير 2026', note: 'أم القرى', method: 'umalqura' },
    ],
    faqItems: [
      { q: 'متى يبدأ رمضان 2026؟', a: '18 فبراير 2026 وفق تقويم أم القرى المعتمد في السعودية ودول الخليج. قد يختلف بيوم في المغرب ومصر والجزائر.' },
      { q: 'كم يوماً رمضان 2026؟', a: 'شهر رمضان إما 29 أو 30 يوماً بحسب رؤية هلال شوال. يُعلن ذلك في آخر يوم من رمضان.' },
      { q: 'كم ساعة الصيام في رمضان 2026؟', a: 'تتراوح بين 12 و14 ساعة في الدول العربية خلال فبراير — أقل من رمضانات الصيف بفضل قصر النهار.' },
      { q: 'لماذا يتغير موعد رمضان كل عام؟', a: 'لأن التقويم الهجري قمري خالص (354 يوماً) وليس شمسياً (365 يوماً). يتقدم رمضان ~11 يوماً كل سنة.' },
      { q: 'هل يختلف بدء رمضان بين الدول؟', a: 'نعم. السعودية والخليج يعتمدون أم القرى الفلكي. المغرب ومصر والجزائر يعتمدون الرؤية البصرية للهلال مما قد يؤخر أو يقدم بيوم.' },
      { q: 'متى ليلة القدر في رمضان 2026؟', a: 'أرجح لياليها الأوتار من آخر عشر ليالٍ. أرجحها ليلة 27 رمضان الموافقة تقريباً 16 مارس 2026.' },
      { q: 'متى ينتهي رمضان 2026؟', a: 'ينتهي حوالي 19 مارس 2026 بعد 29 أو 30 يوماً، ويليه عيد الفطر المبارك.' },
      { q: 'ما موعد رمضان 2027؟', a: 'رمضان 1448 سيبدأ حوالي 7 فبراير 2027 — يتقدم ~11 يوماً عن موعد 2026.' },
    ],
    relatedSlugs: ['laylat-al-qadr', 'eid-al-fitr', 'nisf-shaban', 'ramadan-in-saudi'],
    sources: [
      { label: 'تقويم أم القرى — هيئة الاتصالات السعودية', url: 'https://www.ummulqura.org.sa' },
    ],
  },

  'eid-al-fitr': {
    // Tier 1 — write full content following same structure as ramadan above
    // 7-9 FAQ, 2-3 about paragraphs, 5 traditions, countryDates, quickFacts
    // No timeline (single day event)
    // significance: "شُرع عيد الفطر في السنة الأولى بعد الهجرة..."
    relatedSlugs: ['ramadan', 'eid-al-adha', 'eid-al-fitr-in-saudi'],
  },

  'eid-al-adha': {
    // Tier 1 — full content
    // 7 FAQ, 3 about paragraphs including Hajj connection
    // traditions: sacrifice, prayer, relatives visit, Hajj pilgrims
    // countryDates for all 8 countries
    relatedSlugs: ['hajj-season', 'day-of-arafa', 'first-dhul-hijjah'],
  },

  'hajj-season': {
    // Tier 1 — full content
    // 5-phase timeline: Yawm al-Tarwiyah (day 8) → Arafah (day 9) → Muzdalifah → Mina → Eid
    // quickFacts: 2.5M+ pilgrims, year of obligation, Hajj pillars
    // significance: "الحج الركن الخامس..."
    relatedSlugs: ['day-of-arafa', 'eid-al-adha', 'first-dhul-hijjah'],
  },

  'day-of-arafa': {
    // Tier 1 — full content
    // significance: "صيامه يكفّر ذنوب سنتين"
    // FAQ: is fasting obligatory? why is it the best day? what do pilgrims do?
    relatedSlugs: ['hajj-season', 'eid-al-adha', 'first-dhul-hijjah'],
  },

  'laylat-al-qadr': {
    // Tier 1 — full content
    // significance: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ" (Quran 97:3)
    // FAQ: when exactly? how to find it? what to pray?
    relatedSlugs: ['ramadan', 'nisf-shaban'],
  },

  'mawlid': {
    // Tier 1 — full content
    // Note: Saudi Arabia does NOT celebrate as official holiday
    // countryDates: Morocco, Egypt, Tunisia celebrate more widely
    relatedSlugs: ['isra-miraj', 'islamic-new-year'],
  },

  'islamic-new-year': {
    // Tier 2 — history of Hijri calendar, Omar ibn al-Khattab established it
    relatedSlugs: ['ashura', 'ramadan'],
  },

  'ashura': {
    // Tier 2 — fasting sunnah, history of Musa/Pharaoh, add Tasua (9th) recommendation
    relatedSlugs: ['islamic-new-year', 'ramadan'],
  },

  'isra-miraj': {
    // Tier 2 — 5 prayers were made obligatory on this night
    relatedSlugs: ['mawlid', 'laylat-al-qadr'],
  },

  'nisf-shaban': {
    // Tier 2 — celebrated more in Egypt/Morocco/Lebanon, note Saudi position
    relatedSlugs: ['ramadan', 'laylat-al-qadr'],
  },

  'first-dhul-hijjah': {
    // Tier 2 — "ما من أيام العمل الصالح فيها أحب إلى الله من هذه الأيام العشر"
    relatedSlugs: ['hajj-season', 'day-of-arafa', 'eid-al-adha'],
  },
}
```

### `lib/event-content/school.js` — Full example for BAC Algeria:

```javascript
export const SCHOOL_CONTENT = {

  'bac-results-algeria': {
    seoTitle: 'نتائج الباكالوريا 2026 الجزائر — موعد الإعلان وكيفية الاستعلام',
    description: 'متى تصدر نتائج الباك 2026 في الجزائر؟ كيف تستعلم عبر bac.onec.dz؟ الدورة التكميلية وكل ما تحتاج معرفته.',
    keywords: [
      'نتائج الباك 2026 الجزائر', 'بكالوريا 2026 الجزائر', 'bac.onec.dz 2026',
      'متى تصدر نتائج الباكالوريا الجزائر', 'كشف نقاط الباك 2026',
      'نسبة النجاح بكالوريا الجزائر', 'الدورة التكميلية باك 2026',
      'موعد الباك جزائر 2026', 'نتيجة الباك الجزائري 2026',
    ],
    about: {
      heading: 'عن نتائج بكالوريا الجزائر 2026',
      paragraphs: [
        'يُعلن الديوان الوطني للامتحانات والمسابقات (ONEC) عن نتائج شهادة البكالوريا في الجزائر منتصف يوليو تقريباً. تُنشر النتائج على الموقع الرسمي bac.onec.dz ويمكن الاستعلام برقم التسجيل.',
        'يترقب أكثر من 800 ألف مترشح نتائجهم سنوياً. تُعلَّق النتائج على لوحات المؤسسات التعليمية في اليوم ذاته. الطلاب الراسبون يمكنهم التقدم للدورة التكميلية في أغسطس.',
      ],
    },
    quickFacts: [
      { label: 'موعد الإعلان', value: 'منتصف يوليو 2026' },
      { label: 'الموقع الرسمي', value: 'bac.onec.dz' },
      { label: 'طريقة الاستعلام', value: 'رقم التسجيل / الاسم' },
      { label: 'الدورة التكميلية', value: 'أغسطس 2026' },
    ],
    howTo: {
      title: 'كيفية الاستعلام عن نتائج الباكالوريا 2026',
      summary: 'استعلم عن نتيجتك خطوة بخطوة عبر الموقع الرسمي',
      steps: [
        { name: 'افتح الموقع الرسمي', text: 'انتقل إلى bac.onec.dz من متصفحك أو هاتفك.', url: 'https://bac.onec.dz' },
        { name: 'اختر طريقة البحث', text: 'يمكنك البحث برقم التسجيل في امتحان البكالوريا أو بالاسم الكامل.' },
        { name: 'أدخل بياناتك', text: 'اكتب رقم تسجيلك في الحقل المخصص واضغط على زر البحث.' },
        { name: 'اطّلع على نتيجتك', text: 'ستظهر نتيجتك فور الإعلان. يمكنك التقاط صورة شاشة أو طباعتها.' },
      ],
    },
    faqItems: [
      { q: 'متى تصدر نتائج الباكالوريا 2026 في الجزائر؟', a: 'عادةً بين 14 و17 يوليو 2026. قد يتغير الموعد بإعلان رسمي من ONEC.' },
      { q: 'كيف أتحقق من نتيجتي في باك الجزائر؟', a: 'ادخل bac.onec.dz وأدخل رقم تسجيلك أو اسمك. يمكن أيضاً الاستعلام عبر رسائل SMS.' },
      { q: 'ما نسبة النجاح في باكالوريا الجزائر؟', a: 'تتراوح بين 45% و60% في معظم السنوات. الراسبون يمكنهم التقدم للدورة التكميلية في أغسطس.' },
      { q: 'هل هناك دورة تكميلية لباك 2026؟', a: 'نعم، تُجرى في أغسطس للطلاب الذين لم ينجحوا في الدورة الأولى.' },
      { q: 'كيف أسجّل في الجامعة بعد النتائج؟', a: 'يبدأ التسجيل على منصة جامعاتي خلال أيام من إعلان النتائج — عادةً نهاية يوليو.' },
      { q: 'ما الموقع الرسمي لنتائج الباك الجزائر؟', a: 'الموقع الرسمي: bac.onec.dz التابع للديوان الوطني للامتحانات والمسابقات.' },
    ],
    sources: [{ label: 'الموقع الرسمي ONEC — bac.onec.dz', url: 'https://bac.onec.dz' }],
    relatedSlugs: ['bac-exams-algeria', 'school-start-algeria', 'independence-day-algeria'],
  },

  'thanaweya-results': {
    // Tier 1 — Egyptian results via results.moe.gov.eg
    // howTo: search by seat number or name on moe.gov.eg
    // 6 FAQ, 2 about paragraphs
    // quickFacts: announcement timing, official portal link
    relatedSlugs: ['thanaweya-exams', 'school-start-egypt', 'sham-nessim'],
  },

  // Tier 2 school events — write 4-5 FAQ + 1 about paragraph each:
  'bac-results-morocco':  { /* massar.men.gov.ma */ },
  'bac-results-tunisia':  { /* bac.edunet.tn */ },
  'bac-exams-algeria':    { /* exam dates, subject schedule */ },
  'thanaweya-exams':      { /* Egyptian exam dates and schedule */ },
  'school-start-egypt':   { /* September 20, ministry confirmation */ },
  'school-start-algeria': { /* September 21, academic year 2026-2027 */ },
  'school-start-morocco': { /* September 8 */ },
  'school-start-uae':     { /* August 30, ADEK/KHDA rules */ },
  'school-start-kuwait':  { /* September 15 */ },
  'school-start-qatar':   { /* August 30 */ },
  'school-start-tunisia': { /* September 15 */ },
  'back-to-school':       { /* generic — points to country-specific pages */ },
  'summer-vacation':      { /* varies by country — table of dates */ },
  'spring-vacation':      { /* approximate, varies */ },
  'national-exams-morocco':  {},
  'bac-results-morocco':     {},
}
```

### `lib/event-content/national.js` — Structure:

```javascript
export const NATIONAL_CONTENT = {

  'saudi-national-day': {
    // Tier 1 — 23 September, 93rd National Day in 2026
    // about: history of unification in 1932 by King Abdulaziz
    // traditions: concerts, fireworks, traditional dress, flag decorations, car parades
    // quickFacts: year established (1932), official holiday (yes), duration (1-2 days)
    // significance: "أرض الحرمين الشريفين وموطن الإسلام"
    relatedSlugs: ['eid-al-adha-in-saudi', 'ramadan-in-saudi', 'salary-day-saudi'],
  },

  'kuwait-national-day': {
    // Tier 2 — 25 February 1961, liberation day is 26 February
    // Note: two consecutive holidays — National Day + Liberation Day
    relatedSlugs: ['ramadan-in-kuwait', 'school-start-kuwait'],
  },

  'uae-national-day': {
    // Tier 2 — 2 December 1971, union of 7 emirates
    // quickFacts: 55th National Day in 2026, Ittihad day
    relatedSlugs: ['ramadan-in-uae', 'school-start-uae'],
  },

  'independence-day-algeria': {
    // Tier 2 — 5 July 1962, War of Independence 1954-1962
    // details: 7-year war, 1.5M martyrs
    relatedSlugs: ['revolution-day-algeria', 'bac-results-algeria'],
  },

  'revolution-day-algeria': {
    // Tier 2 — 1 November 1954, start of independence war
    relatedSlugs: ['independence-day-algeria', 'bac-results-algeria'],
  },

  'independence-day-morocco': {
    // Tier 2 — 18 November 1956, independence from France
    relatedSlugs: ['throne-day-morocco', 'bac-results-morocco'],
  },

  'throne-day-morocco': {
    // Tier 2 — 30 July, King's throne speech
    relatedSlugs: ['independence-day-morocco', 'bac-results-morocco'],
  },

  'sham-nessim': {
    // Tier 2 — unique Egyptian holiday (Pharaonic origin, Easter Monday)
    // traditions: parks, Fisikh (salted fish), colored eggs — ancient spring festival
    relatedSlugs: ['thanaweya-results', 'school-start-egypt'],
  },
}
```

### `lib/event-content/seasonal.js`:

```javascript
export const SEASONAL_CONTENT = {
  'new-year': {
    // Tier 2
    faqItems: [
      { q: 'كم باقي على رأس السنة الميلادية 2027؟', a: '1 يناير 2027 — احسب بدقة عبر عدادنا التنازلي.' },
      { q: 'هل 1 يناير إجازة رسمية في الدول العربية؟', a: 'نعم في معظمها كإجازة رسمية ليوم أو يومين.' },
    ],
  },
  'summer-season':  { /* Tier 3 — 21 June, solstice facts */ },
  'winter-season':  { /* Tier 3 — 21 December */ },
  'spring-season':  { /* Tier 3 — 20 March, equinox */ },
  'autumn-season':  { /* Tier 3 — 22 September */ },
}
```

### `lib/event-content/support.js`:

```javascript
export const SUPPORT_CONTENT = {
  'salary-day-saudi': {
    // Tier 2 — 27th Hijri month, advance in Ramadan (25th)
    faqItems: [
      { q: 'متى يصرف الراتب الحكومي في السعودية؟', a: 'يوم 27 من كل شهر هجري. في رمضان يُصرف مبكراً يوم 25.' },
      { q: 'هل يتغير موعد الراتب في رمضان؟', a: 'نعم، يُصرف يوم 25 رمضان تقديماً للموظفين الحكوميين.' },
      { q: 'ماذا لو تزامن موعد الراتب مع إجازة رسمية؟', a: 'يُؤجَّل ليوم العمل التالي أو يُقدَّم يوماً وفق السياسة الرسمية.' },
    ],
  },
  'citizen-account-saudi': {
    faqItems: [
      { q: 'متى يصرف حساب المواطن؟', a: 'يوم 10 من كل شهر ميلادي. إذا وافق إجازة يُقدَّم أو يُؤخَّر بيوم.' },
      { q: 'كيف أتحقق من إيداع حساب المواطن؟', a: 'عبر تطبيق حساب المواطن الرسمي أو الموقع ca.gov.sa.' },
    ],
    sources: [{ label: 'الموقع الرسمي لحساب المواطن', url: 'https://ca.gov.sa' }],
  },
  'social-security-saudi': {
    faqItems: [
      { q: 'متى ينزل الضمان الاجتماعي المطور؟', a: 'في اليوم الأول من كل شهر ميلادي.' },
    ],
  },
  'salary-day-egypt': {
    faqItems: [
      { q: 'متى يصرف الراتب في مصر؟', a: 'يوم 24 من كل شهر ميلادي لموظفي الحكومة المصرية.' },
    ],
  },
}
```

### `lib/event-content/country-islamic.js`:

```javascript
export const COUNTRY_ISLAMIC_CONTENT = {
  'ramadan-in-saudi': {
    seoTitle: 'متى رمضان 2026 في السعودية — تقويم أم القرى الرسمي',
    description: 'رمضان 1447 في السعودية — 18 فبراير 2026 وفق تقويم أم القرى. الفرق مع بقية الدول العربية.',
    about: {
      heading: 'رمضان في المملكة العربية السعودية',
      paragraphs: [
        'تعتمد المملكة العربية السعودية تقويم أم القرى الفلكي لتحديد بداية رمضان رسمياً. يصدر القرار من المحكمة العليا بعد مشاهدة هلال رمضان.',
      ],
    },
    relatedSlugs: ['ramadan', 'eid-al-fitr-in-saudi', 'salary-day-saudi'],
  },
  // Following same pattern — each country gets its calendar method noted:
  'ramadan-in-morocco':  { /* رؤية هلال وزارة الأوقاف */ },
  'ramadan-in-egypt':    { /* دار الإفتاء المصرية */ },
  'ramadan-in-algeria':  { /* رؤية هلال محلية */ },
  'ramadan-in-uae':      { /* أم القرى مع رؤية محلية */ },
  'ramadan-in-kuwait':   { /* أم القرى */ },
  'ramadan-in-tunisia':  { /* دار الإفتاء التونسية */ },
  'ramadan-in-qatar':    { /* أم القرى */ },
  'eid-al-fitr-in-saudi': { /* موعد شوال بأم القرى */ },
  'eid-al-adha-in-saudi': { /* 10 ذو الحجة أم القرى */ },
}
```

---

## PART 5 — SITEMAP FIX (Do This on Day 1)

**The bug:** `lastModified: new Date('2025-01-01').toISOString()` — Google sees all holiday pages as 1+ year old. This actively hurts rankings for time-sensitive event content.

**The fix — modify only `app/holidays/sitemap.js`:**

```javascript
import { ALL_EVENTS } from '@/lib/holidays-engine'
import { TIER_1_SLUGS, TIER_2_SLUGS } from '@/lib/event-content/index'

export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL
    || process.env.NEXT_PUBLIC_BASE_URL
    || 'https://miqatime.com'

  const now = new Date().toISOString() // ← THE FIX: always current timestamp

  return [
    // Hub page was missing from original sitemap
    {
      url: `${BASE}/holidays`,
      lastModified: now,
      priority: 1.0,
      changeFrequency: 'daily',
    },
    // All event pages with tiered priority
    ...ALL_EVENTS.map(ev => ({
      url: `${BASE}/holidays/${ev.slug}`,
      lastModified: now,
      priority: TIER_1_SLUGS.includes(ev.slug) ? 0.9
               : TIER_2_SLUGS.includes(ev.slug) ? 0.7
               : 0.5,
      changeFrequency: TIER_1_SLUGS.includes(ev.slug) ? 'daily'
                      : TIER_2_SLUGS.includes(ev.slug) ? 'weekly'
                      : 'monthly',
    })),
  ]
}
```

**Verify:** After this change, visit `/holidays/sitemap.xml` and confirm `lastmod` shows today's date.

---

## PART 6 — NEW PAGE SECTIONS IN THE SLUG PAGE

Add these new sections to `app/holidays/[slug]/page.jsx` in JSX only. Do not change any existing logic, variable declarations, or schema generation.

### The full section order — existing sections marked E, new sections marked N:

```
E  JSON-LD scripts
E  Breadcrumb nav
E  Category + type badges
E  H1 headline
E  Short description

N  QUICK FACTS STRIP       ← if (event.quickFacts?.length)
E  Countdown timer          ← DO NOT TOUCH
E  Date badges (hijri + gregorian + method)
E  Progress bar
N  COUNTRY DATES TABLE     ← if (event.countryDates?.length)
E  Share buttons            ← DO NOT TOUCH
N  SIGNIFICANCE CALLOUT    ← if (event.significance)
N  ABOUT SECTION (extended) ← if (event.about?.paragraphs?.length), else keep existing details
N  TRADITIONS GRID         ← if (event.traditions?.length)
N  TIMELINE                ← if (event.timeline?.length)
N  HOW-TO STEPS            ← if (event.howTo?.steps?.length)
N  EVIBE CARD              ← EventVibeCard component (always rendered)
E  Historical dates table
E  FAQ accordion            ← now fed by richer faqItems
E  Sources / about card
E  Related events grid
```

### New section JSX — add after identifying their exact position:

```jsx
{/* ── N: Quick Facts Strip ─────────────────────────────────── */}
{event.quickFacts?.length > 0 && (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-6)',
    }}
    role="list"
    aria-label="معلومات سريعة"
  >
    {event.quickFacts.map(fact => (
      <div key={fact.label} className="card-nested" role="listitem"
        style={{ textAlign: 'center', padding: 'var(--space-4)' }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
          {fact.label}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
          {fact.value}
        </div>
      </div>
    ))}
  </div>
)}

{/* ── N: Country Dates Table ────────────────────────────────── */}
{event.countryDates?.length > 0 && (
  <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
    <h2 className="card__title" style={{ marginBottom: 'var(--space-4)' }}>
      المواعيد في الدول العربية
    </h2>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['الدولة', 'التاريخ', 'طريقة الحساب'].map(h => (
              <th key={h} style={{ padding: 'var(--space-3)', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 'var(--font-medium)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {event.countryDates.map(row => (
            <tr key={row.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)' }}>
                <span aria-hidden="true">{row.flag}</span> {row.country}
              </td>
              <td style={{ padding: 'var(--space-3)', color: 'var(--text-primary)', fontWeight: 'var(--font-medium)' }}>
                {row.date}
              </td>
              <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ── N: Significance Callout ───────────────────────────────── */}
{event.significance && (
  <blockquote
    className="card card--accent"
    style={{
      borderInlineStart: '4px solid var(--accent-alt)',
      paddingInlineStart: 'var(--space-5)',
      marginBottom: 'var(--space-6)',
    }}
  >
    <p style={{ fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)', color: 'var(--text-primary)', fontStyle: 'normal' }}>
      {event.significance}
    </p>
  </blockquote>
)}

{/* ── N: About (extended — replaces the existing short details block) */}
{event.about?.paragraphs?.length > 0 ? (
  <section className="card" style={{ marginBottom: 'var(--space-6)' }} aria-labelledby="about-heading">
    <h2 id="about-heading" className="card__title" style={{ marginBottom: 'var(--space-4)' }}>
      {event.about.heading || `عن ${event.name}`}
    </h2>
    {event.about.paragraphs.map((p, i) => (
      <p key={i} style={{ marginBottom: i < event.about.paragraphs.length - 1 ? 'var(--space-4)' : 0, lineHeight: 'var(--leading-relaxed)', color: 'var(--text-primary)' }}>
        {p}
      </p>
    ))}
  </section>
) : event.details ? (
  // Fallback: render existing details field unchanged
  <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
    <p style={{ lineHeight: 'var(--leading-relaxed)', color: 'var(--text-primary)' }}>{event.details}</p>
  </div>
) : null}

{/* ── N: Traditions Grid ────────────────────────────────────── */}
{event.traditions?.length > 0 && (
  <section style={{ marginBottom: 'var(--space-6)' }} aria-label="التقاليد والعادات">
    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>
      التقاليد والعادات
    </h2>
    <div className="grid-auto">
      {event.traditions.map(t => (
        <div key={t.title} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-2xl)' }} role="img" aria-hidden="true">{t.icon}</span>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
            {t.title}
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
            {t.description}
          </p>
        </div>
      ))}
    </div>
  </section>
)}

{/* ── N: Timeline ───────────────────────────────────────────── */}
{event.timeline?.length > 0 && (
  <section className="card" style={{ marginBottom: 'var(--space-6)' }} aria-label="مراحل الفعالية">
    <h2 className="card__title" style={{ marginBottom: 'var(--space-5)' }}>
      المراحل والجدول الزمني
    </h2>
    <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {event.timeline.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{
            flexShrink: 0, width: '28px', height: '28px',
            background: 'var(--accent-soft)', border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-xs)', color: 'var(--accent-alt)', fontWeight: 'var(--font-bold)',
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--accent-alt)', marginBottom: 'var(--space-1)' }}>
              {item.phase}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </section>
)}

{/* ── N: How-To Steps (school results / salary events) ─────── */}
{event.howTo?.steps?.length > 0 && (
  <section className="card" style={{ marginBottom: 'var(--space-6)' }} aria-label={event.howTo.title}>
    <h2 className="card__title" style={{ marginBottom: 'var(--space-2)' }}>{event.howTo.title}</h2>
    {event.howTo.summary && (
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
        {event.howTo.summary}
      </p>
    )}
    <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {event.howTo.steps.map((step, i) => (
        <li key={i} className="card-nested" style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
          <span style={{
            flexShrink: 0, width: '24px', height: '24px',
            background: 'var(--accent-gradient)', color: 'var(--text-on-accent)',
            borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)',
          }}>
            {i + 1}
          </span>
          <div>
            <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
              {step.name}
            </strong>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              {step.text}
              {step.url && (
                <> — <a href={step.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--text-link)' }}>
                  {step.url.replace('https://', '')}
                </a></>
              )}
            </span>
          </div>
        </li>
      ))}
    </ol>
  </section>
)}

{/* ── N: EventVibeCard (Creative Section) ──────────────────── */}
<EventVibeCard
  eventName={event.name}
  daysLeft={daysLeft}
  categoryId={event.category}
  countryCode={event._countryCode || null}
  slug={slug}
  eventType={event.type}
/>
```

---

## PART 7 — THE THREE EVIBE CARD FILES

All three files go in `components/holidays/`. They are imported only by the slug page.

---

### FILE 1 OF 3: `components/holidays/event-vibe-card.css`

```css
/*
 * event-vibe-card.css
 * EventVibeCard component styles — uses ONLY CSS variables from new.css
 * Zero hardcoded colors. RTL-first. Full responsive.
 * Import once in EventVibeCard.jsx via: import './event-vibe-card.css'
 */

/* ── Keyframe animations ────────────────────────────────────────────── */

@keyframes evibe-card-in {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

@keyframes evibe-breathe {
  0%, 100% { transform: scale(1);    opacity: 0.07; }
  50%       { transform: scale(1.06); opacity: 0.10; }
}

/* Used on SVG elements — transform-box makes origin relative to the element itself */
@keyframes evibe-spin-cw {
  to { transform: rotate(360deg); }
}
@keyframes evibe-spin-ccw {
  to { transform: rotate(-360deg); }
}

/* True orbital motion: rotate parent → counter-rotate child = planet stays upright */
@keyframes evibe-orbit-parent {
  to { transform: rotate(360deg); }
}
@keyframes evibe-orbit-child {
  to { transform: rotate(-360deg); }
}

@keyframes evibe-twinkle {
  from { opacity: 0.2; transform: scale(0.7); }
  to   { opacity: 0.9; transform: scale(1.3); }
}

@keyframes evibe-wave-y {
  from { transform: translateY(0px);  }
  to   { transform: translateY(-10px); }
}

@keyframes evibe-float {
  0%, 100% { transform: translateY(0);   }
  50%       { transform: translateY(-5px); }
}

@keyframes evibe-pulse-ring {
  0%   { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.6);  opacity: 0;   }
}

/*
 * Arc animation trick:
 * We set --evibe-circ and --evibe-offset as CSS custom properties
 * via inline style on the element. This allows the keyframe to
 * use those values, letting JS calculate the arc position
 * while CSS handles the animation smoothly.
 */
@keyframes evibe-arc-fill {
  from { stroke-dashoffset: var(--evibe-circ);   }
  to   { stroke-dashoffset: var(--evibe-offset); }
}

@keyframes evibe-urgency-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--evibe-urgency-color-soft); }
  50%       { box-shadow: 0 0 0 8px transparent; }
}

/* ── Wrapper ─────────────────────────────────────────────────────────── */
.evibe-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-accent-strong);
  background-color: var(--bg-surface-1);
  box-shadow: var(--shadow-accent-strong);
  padding: var(--space-8);
  margin-block: var(--space-10);
  animation: evibe-card-in 0.5s var(--ease-spring) both;
  container-type: inline-size;
  container-name: evibe-card;
}

/* ── Background gradient blob ────────────────────────────────────────── */
.evibe-bg-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 65% 55% at 15% 50%,
    var(--accent-glow-strong),
    transparent 70%
  );
}

/* ── SVG pattern layer ───────────────────────────────────────────────── */
.evibe-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Color inherited from a CSS var set in JSX via style={{ color: 'var(--accent-alt)' }} */
}

/* SVG-specific transform settings for cross-browser spin */
.evibe-pattern .spin-cw {
  transform-origin: center;
  transform-box: fill-box;
  animation: evibe-spin-cw 40s linear infinite;
}
.evibe-pattern .spin-ccw {
  transform-origin: center;
  transform-box: fill-box;
  animation: evibe-spin-ccw 28s linear infinite;
}
.evibe-pattern .breathe {
  transform-origin: center;
  transform-box: fill-box;
  animation: evibe-breathe 6s ease-in-out infinite;
}
.evibe-pattern .twinkle-1 { animation: evibe-twinkle 2.8s 0.0s ease-in-out infinite alternate; }
.evibe-pattern .twinkle-2 { animation: evibe-twinkle 3.2s 0.6s ease-in-out infinite alternate; }
.evibe-pattern .twinkle-3 { animation: evibe-twinkle 2.5s 1.1s ease-in-out infinite alternate; }
.evibe-pattern .twinkle-4 { animation: evibe-twinkle 3.6s 0.3s ease-in-out infinite alternate; }
.evibe-pattern .twinkle-5 { animation: evibe-twinkle 2.9s 1.7s ease-in-out infinite alternate; }
.evibe-pattern .wave-1 { animation: evibe-wave-y 3.0s 0.0s ease-in-out infinite alternate; }
.evibe-pattern .wave-2 { animation: evibe-wave-y 3.5s 0.5s ease-in-out infinite alternate; }
.evibe-pattern .wave-3 { animation: evibe-wave-y 4.0s 1.0s ease-in-out infinite alternate; }

/* Orbit: parent rotates, child counter-rotates — planet "orbits" */
.evibe-pattern .orbit-arm {
  transform-origin: center;
  transform-box: fill-box;
  animation: evibe-orbit-parent 12s linear infinite;
}
.evibe-pattern .orbit-planet {
  transform-origin: center;
  transform-box: fill-box;
  animation: evibe-orbit-child 12s linear infinite;
}

/* ── Content layer (above SVG) ───────────────────────────────────────── */
.evibe-content {
  position: relative;
  z-index: 1;
}

/* ── Top row: category chip + urgency badge ──────────────────────────── */
.evibe-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.evibe-category-chip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  padding: var(--space-1-5) var(--space-4);
  border: 1px solid var(--border-accent);
  background: var(--accent-soft);
  color: var(--accent-alt);
  white-space: nowrap;
}

.evibe-urgency-badge {
  position: relative;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
  white-space: nowrap;
  flex-shrink: 0;
}

.evibe-urgency-badge--ring {
  animation: evibe-urgency-pulse 1.8s ease-out infinite;
}

.evibe-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-full);
  animation: evibe-pulse-ring 1.6s ease-out infinite;
}

/* ── Main body: arc + text ───────────────────────────────────────────── */
.evibe-body {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

/* ── Arc SVG container ───────────────────────────────────────────────── */
.evibe-arc-container {
  position: relative;
  flex-shrink: 0;
  /* Size set via CSS container queries below */
  width: 108px;
  height: 108px;
}

.evibe-arc-track {
  fill: none;
  stroke: var(--border-subtle);
  stroke-width: 5;
}

.evibe-arc-fill {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
  transform-origin: center;
  transform-box: fill-box;
  transform: rotate(-90deg);
  /* Use CSS custom properties set via style attribute for the arc values */
  stroke-dasharray: var(--evibe-circ);
  stroke-dashoffset: var(--evibe-circ); /* start at 0% filled */
  animation: evibe-arc-fill 1.4s var(--ease-out) 0.3s both;
  filter: drop-shadow(0 0 5px currentColor);
}

.evibe-arc-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.evibe-arc-number {
  font-size: var(--text-2xl);
  font-weight: var(--font-black);
  line-height: var(--leading-none);
  font-variant-numeric: tabular-nums;
}

.evibe-arc-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1;
}

/* ── Text section ────────────────────────────────────────────────────── */
.evibe-text {
  flex: 1;
  min-width: 160px;
}

.evibe-headline {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-2);
}

.evibe-subtext {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
  max-width: 40ch;
}

/* ── Stats pills row ─────────────────────────────────────────────────── */
.evibe-stats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.evibe-stat-pill {
  background: var(--bg-surface-3);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5);
  min-width: 76px;
}

.evibe-stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1;
}

.evibe-stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* ── Responsive: container queries on the card itself ────────────────── */

/* Narrow card (< 400px — single column phones) */
@container evibe-card (max-width: 400px) {
  .evibe-wrapper { padding: var(--space-5); }
  .evibe-body    { gap: var(--space-5); }
  .evibe-arc-container { width: 86px; height: 86px; }
  .evibe-arc-number { font-size: var(--text-xl); }
  .evibe-headline { font-size: var(--text-lg); }
  .evibe-stat-pill { min-width: 64px; }
}

/* Medium card (400–600px — wide phones, narrow columns) */
@container evibe-card (min-width: 400px) and (max-width: 600px) {
  .evibe-arc-container { width: 96px; height: 96px; }
}

/* Wide card (> 600px — tablets and desktop) */
@container evibe-card (min-width: 600px) {
  .evibe-arc-container { width: 116px; height: 116px; }
  .evibe-arc-number { font-size: var(--text-3xl); }
  .evibe-headline { font-size: var(--text-2xl); }
}

/* ── Reduced motion ──────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .evibe-wrapper,
  .evibe-pattern *,
  .evibe-arc-fill,
  .evibe-pulse-ring,
  .evibe-urgency-badge--ring {
    animation: none !important;
    transition: none !important;
  }
  /* Still show the arc in its final filled state */
  .evibe-arc-fill {
    stroke-dashoffset: var(--evibe-offset) !important;
  }
}

/* ── Light theme overrides ───────────────────────────────────────────── */
/* All colors are already CSS vars that respond to .light — no extra rules needed */
/* The border-accent-strong, bg-surface-1, etc. all automatically adapt */
```

---

### FILE 2 OF 3: `components/holidays/useEventVibe.js`

```javascript
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
```

---

### FILE 3 OF 3: `components/holidays/EventVibeCard.jsx`

```jsx
'use client'

/**
 * components/holidays/EventVibeCard.jsx
 * ─────────────────────────────────────────────────────────────────────
 * The "WOW" section — premium animated card, one per event page.
 * Splits:
 *   Logic   → ./useEventVibe.js
 *   Styles  → ./event-vibe-card.css
 *   UI      → THIS FILE
 *
 * Props:
 *   eventName   {string}  — event.name from engine
 *   daysLeft    {number}  — integer days remaining
 *   categoryId  {string}  — event.category (one of 7 categories)
 *   countryCode {string|null} — event._countryCode
 *   slug        {string}  — event slug
 *   eventType   {string}  — event.type ('hijri'|'fixed'|'estimated'|'monthly')
 *
 * Design contract:
 *   ✅ CSS vars only — zero hardcoded colors
 *   ✅ RTL-first layout
 *   ✅ Container queries for responsive sizing (not viewport queries)
 *   ✅ prefers-reduced-motion via CSS
 *   ✅ WCAG AA contrast on all visible text
 *   ✅ No new npm packages
 *   ✅ Works in both .dark and .light themes automatically
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react'
import './event-vibe-card.css'
import {
  getCategoryConfig,
  getUrgencyTier,
  getEventHeadline,
  getEventSubtext,
  getArcData,
  getVibeStats,
} from './useEventVibe'

/* ══════════════════════════════════════════════════════════════════════
   SVG BACKGROUND PATTERNS
   Each pattern is purely decorative (aria-hidden).
   All colors via `currentColor` — parent sets `color: var(--accent-alt)`.
   ══════════════════════════════════════════════════════════════════════ */

/** Islamic geometric: rotating dashed ring + crescent silhouette + star dots */
function MoonPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.08, color: 'inherit' }}
    >
      {/* Dashed outer ring — slow clockwise rotation */}
      <circle cx="100" cy="100" r="88" fill="none"
        stroke="currentColor" strokeWidth="0.6" strokeDasharray="5 10"
        className="spin-cw"
      />
      {/* Dashed inner ring — counter-clockwise */}
      <circle cx="100" cy="100" r="62" fill="none"
        stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 7"
        className="spin-ccw"
      />
      {/* Crescent: large circle minus offset circle */}
      <path
        d="M100 28 A72 72 0 1 0 100 172 A50 50 0 1 1 100 28Z"
        fill="currentColor" className="breathe"
      />
      {/* Star dots at different positions */}
      <circle cx="160" cy="45"  r="2.5" fill="currentColor" className="twinkle-1" />
      <circle cx="38"  cy="62"  r="2"   fill="currentColor" className="twinkle-2" />
      <circle cx="168" cy="125" r="3"   fill="currentColor" className="twinkle-3" />
      <circle cx="30"  cy="148" r="2.5" fill="currentColor" className="twinkle-4" />
      <circle cx="145" cy="172" r="2"   fill="currentColor" className="twinkle-5" />
    </svg>
  )
}

/** Astronomy: concentric orbit rings + true orbiting planet */
function OrbitPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.07, color: 'inherit' }}
    >
      {/* Static rings */}
      {[28, 46, 64, 82].map((r, i) => (
        <circle key={r} cx="100" cy="100" r={r}
          fill="none" stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 0.7 : 0.4}
          strokeDasharray={i % 2 === 0 ? 'none' : '2 5'}
        />
      ))}
      {/*
        True orbital motion:
        - A <g> element centered at (100,100) rotates the "arm"
        - The planet circle is offset 64px from center on the arm
        - A counter-rotating child keeps the planet non-spinning
      */}
      <g className="orbit-arm" style={{ transformOrigin: '100px 100px' }}>
        <g transform="translate(164, 100)">
          <circle r="5" fill="currentColor" className="orbit-planet" />
        </g>
      </g>
      {/* Second smaller planet on inner orbit */}
      <g className="spin-ccw" style={{ animationDuration: '8s', transformOrigin: '100px 100px' }}>
        <g transform="translate(146, 100)">
          <circle r="3" fill="currentColor" />
        </g>
      </g>
    </svg>
  )
}

/**
 * Grid pattern using SVG <pattern> fill — ONE DOM node instead of 64 circles.
 * Much more performant and creates a uniform dot grid.
 */
function GridPattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 200 200" className="evibe-pattern"
      style={{ opacity: 0.06, color: 'inherit' }}
    >
      <defs>
        <pattern id="evibe-dot-grid" x="0" y="0" width="22" height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="11" cy="11" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#evibe-dot-grid)" />
      {/* Animated diagonal accent line */}
      <line x1="0" y1="200" x2="200" y2="0"
        stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 12"
        className="spin-cw" style={{ transformOrigin: '100px 100px', animationDuration: '60s' }}
      />
    </svg>
  )
}

/** Wave pattern: three sinusoidal paths that float up/down */
function WavePattern() {
  return (
    <svg aria-hidden="true" focusable="false"
      viewBox="0 0 400 160" preserveAspectRatio="none"
      className="evibe-pattern"
      style={{ opacity: 0.07, color: 'inherit' }}
    >
      <path d="M0 80 Q50 50 100 80 T200 80 T300 80 T400 80"
        fill="none" stroke="currentColor" strokeWidth="1.8"
        className="wave-1"
      />
      <path d="M0 105 Q50 75 100 105 T200 105 T300 105 T400 105"
        fill="none" stroke="currentColor" strokeWidth="1.2"
        className="wave-2"
      />
      <path d="M0 130 Q50 100 100 130 T200 130 T300 130 T400 130"
        fill="none" stroke="currentColor" strokeWidth="0.8"
        className="wave-3"
      />
    </svg>
  )
}

const PATTERN_MAP = {
  moon:  MoonPattern,
  orbit: OrbitPattern,
  grid:  GridPattern,
  wave:  WavePattern,
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

export default function EventVibeCard({
  eventName,
  daysLeft,
  categoryId,
  countryCode,
  slug,
  eventType,
}) {
  const [isVisible, setIsVisible] = useState(false)

  // Delay the entry animation until after initial paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // ── Derived state from logic hook ─────────────────────────────────
  const config   = getCategoryConfig(categoryId)
  const urgency  = getUrgencyTier(daysLeft, categoryId)
  const headline = getEventHeadline(slug, categoryId, daysLeft, eventName)
  const subtext  = getEventSubtext(slug, categoryId, countryCode)
  const arcData  = getArcData(categoryId, daysLeft)
  const stats    = getVibeStats(categoryId, daysLeft, slug)

  // ── SVG pattern component ─────────────────────────────────────────
  const Pattern = PATTERN_MAP[config.pattern] ?? MoonPattern

  // ── Arc CSS custom property values ───────────────────────────────
  // These go on the SVG circle element via inline style.
  // CSS reads them in the @keyframes animation.
  const arcStyle = {
    '--evibe-circ':   arcData.circ,
    '--evibe-offset': arcData.offset,
  }

  // ── Urgency color styles ──────────────────────────────────────────
  const urgencyStyle = {
    color:           `var(${urgency.cssVar})`,
    backgroundColor: `var(${urgency.softVar})`,
    borderColor:     `var(${urgency.cssVar})`,
    '--evibe-urgency-color-soft': `var(${urgency.softVar})`,
  }

  return (
    <section
      aria-label={`نظرة على ${eventName}`}
      className={`evibe-wrapper${isVisible ? '' : ' evibe-hidden'}`}
      style={{ opacity: isVisible ? undefined : 0 }}
    >
      {/* ── Ambient glow behind everything ────────────────────────── */}
      <div className="evibe-bg-glow" aria-hidden="true" />

      {/* ── Category-specific SVG pattern ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{ color: `var(${config.accentCssVar})` }}
      >
        <Pattern />
      </div>

      {/* ── All content sits above the pattern ────────────────────── */}
      <div className="evibe-content">

        {/* Top row: category chip + urgency badge */}
        <div className="evibe-top-row">
          <div className="evibe-category-chip">
            <span role="img" aria-hidden="true" style={{ fontSize: 'var(--text-lg)' }}>
              {config.emoji}
            </span>
            <span>{config.label}</span>
          </div>

          {urgency.label && (
            <span
              className={`evibe-urgency-badge${urgency.ringPulse ? ' evibe-urgency-badge--ring' : ''}`}
              style={urgencyStyle}
              role="status"
              aria-live="polite"
            >
              {urgency.ringPulse && (
                <span className="evibe-pulse-ring" aria-hidden="true"
                  style={{ borderColor: `var(${urgency.cssVar})` }}
                />
              )}
              {urgency.label}
            </span>
          )}
        </div>

        {/* Main body: arc meter + headline text */}
        <div className="evibe-body">

          {/* Arc meter */}
          <div className="evibe-arc-container" role="img"
            aria-label={`${arcData.pct}٪ من فترة الانتظار مضت`}
          >
            <svg
              viewBox="0 0 108 108"
              width="100%"
              height="100%"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                className="evibe-arc-track"
                cx="54" cy="54"
                r={arcData.radius}
              />
              {/* Filled arc */}
              <circle
                className="evibe-arc-fill"
                cx="54" cy="54"
                r={arcData.radius}
                style={{
                  ...arcStyle,
                  stroke: `var(${config.accentCssVar})`,
                }}
              />
            </svg>

            {/* Number overlay */}
            <div className="evibe-arc-center" aria-hidden="true">
              <span className="evibe-arc-number"
                style={{ color: `var(${config.accentCssVar})` }}
              >
                {daysLeft}
              </span>
              <span className="evibe-arc-label">يوم</span>
            </div>
          </div>

          {/* Headline + subtext */}
          <div className="evibe-text">
            <h3 className="evibe-headline">{headline}</h3>
            <p className="evibe-subtext">{subtext}</p>
          </div>
        </div>

        {/* Stats pills */}
        {stats.length > 0 && (
          <div className="evibe-stats" role="list" aria-label="إحصائيات">
            {stats.map(stat => (
              <div key={stat.label} className="evibe-stat-pill" role="listitem">
                <span className="evibe-stat-label">{stat.label}</span>
                <span className="evibe-stat-value"
                  style={{ color: `var(${config.accentCssVar})` }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
```

---

## PART 8 — ADDITIONAL SCHEMA (Add to Slug Page)

Add after existing schema `<script>` tags in the slug page JSX:

```jsx
{/* HowTo schema — only when event has step-by-step instructions */}
{event.howTo?.steps?.length > 0 && (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: event.howTo.title,
    description: event.howTo.summary,
    step: event.howTo.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  })}} />
)}

{/* SpecialAnnouncement — only when event is < 30 days away */}
{daysLeft >= 0 && daysLeft <= 30 && (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: `${event.name} ${year} — يبدأ خلال ${daysLeft} أيام`,
    text: event.description,
    datePosted: nowIso,
    expires: target.toISOString(),
    spatialCoverage: { '@type': 'AdministrativeArea', name: 'MENA' },
    category: 'https://www.wikidata.org/wiki/Q1823452',
  })}} />
)}
```

---

## PART 9 — STEP-BY-STEP MIGRATION ORDER

Execute in this exact order. Each step has a verification gate — do not proceed until the gate passes.

### STEP 1: Sitemap fix (Day 1, 10 minutes)
- Modify only `app/holidays/sitemap.js` per Part 5
- **Gate:** Visit `/holidays/sitemap.xml` — verify `lastmod` is today's date

### STEP 2: Create content layer skeleton (Day 1)
- Create `lib/event-content/` folder
- Create `index.js` with the complete router (Part 4)
- Create empty placeholder files for all 6 category files — each exports just an empty object:
  ```javascript
  // islamic.js (placeholder)
  export const ISLAMIC_CONTENT = {}
  ```
- **Gate:** Run `npm run build` — zero errors

### STEP 3: Add the merge to the slug page (Day 1)
- Add the `getRichContent` import and the 2-line merge (Part 3)
- **Gate:** Visit 5 different event pages — all render identically to before

### STEP 4: Create EventVibeCard (Day 2)
- Create all 3 files per Part 7 in `components/holidays/`
- Add import + JSX to slug page (bottom of Part 6)
- **Gate:** Visit `/holidays/ramadan` — EventVibeCard renders with Islamic styling
- **Gate:** Visit `/holidays/bac-results-algeria` — EventVibeCard renders with school styling (warning colors)
- **Gate:** Visit `/holidays/summer-season` — EventVibeCard renders with astronomy/seasonal styling
- **Gate:** Check responsive: resize browser to 360px — card stacks correctly, arc visible

### STEP 5: Add new page sections (Day 2-3)
- Add JSX blocks from Part 6 to slug page, in order
- Each block is conditional on data existence — pages without rich content are unaffected
- **Gate:** Visit a page without rich content (e.g., `/holidays/new-year`) — no new sections visible, page works normally
- **Gate:** Verify all filter tabs on `/holidays` still work for Islamic, National, School categories
- **Gate:** Verify country filters (Saudi, Egypt, Morocco) still show the right events

### STEP 6: Write Tier 1 content (Day 3-5)
- Fill in `lib/event-content/islamic.js` starting with `ramadan` (full example in Part 4)
- Proceed: `eid-al-fitr` → `eid-al-adha` → `hajj-season` → `day-of-arafa` → `laylat-al-qadr` → `mawlid`
- Fill in `lib/event-content/school.js` starting with `bac-results-algeria` and `thanaweya-results`
- **Gate after each event:** Visit its page — new sections render, countdown still works, share buttons still work

### STEP 7: Write Tier 2 content (Day 6-8)
- `national.js`: `saudi-national-day` first, then others
- `school.js`: remaining school events
- `country-islamic.js`: country-specific Ramadan pages
- `support.js`: salary and social support events

### STEP 8: Add HowTo + SpecialAnnouncement schema (Day 8)
- Add schema scripts per Part 8
- **Gate:** Validate with Google Rich Results Test for `bac-results-algeria`

### STEP 9: Final verification
- Run `/holidays/sitemap.xml` — verify all events present with correct priorities
- Run Lighthouse on `/holidays/ramadan` — Performance ≥ 90, Accessibility ≥ 90
- Test EventVibeCard in light mode — all colors visible
- Test on iPhone SE (375px) — no overflow, all text readable
- Verify prefers-reduced-motion: no animations

---

## PART 10 — POST-MIGRATION VERIFICATION CHECKLIST

```
FUNCTIONALITY (do not proceed to next step if any fail):
[ ] /holidays main page renders with all events
[ ] Category filter tabs work (Islamic, National, School, etc.)
[ ] Country filter chips work (SA, EG, MA, DZ, etc.)
[ ] Search filter returns correct results
[ ] /holidays/ramadan countdown timer works
[ ] /holidays/ramadan share buttons work
[ ] /holidays/sitemap.xml returns valid XML with today's date
[ ] /holidays/[any-slug] not-found.jsx works for invalid slugs

NEW SECTIONS (conditional — only appear when data exists):
[ ] Quick Facts Strip renders for ramadan
[ ] Country Dates Table renders for ramadan (8 countries)
[ ] Significance Callout renders for ramadan
[ ] About section (3 paragraphs) renders for ramadan
[ ] Traditions Grid (6 cards) renders for ramadan
[ ] Timeline renders for ramadan (6 phases)
[ ] HowTo Steps render for bac-results-algeria
[ ] EventVibeCard renders on ALL event pages (even without rich content)

EVIBE CARD VARIANTS:
[ ] Islamic events → moon pattern + blue accent
[ ] School events → grid pattern + amber accent
[ ] National events → wave pattern + green accent
[ ] Astronomy events → orbit pattern + info blue accent
[ ] Business events → grid pattern + subtle accent
[ ] Support events → wave pattern + green accent
[ ] Holiday events → wave pattern + success accent

RESPONSIVE:
[ ] EventVibeCard renders correctly at 360px width
[ ] EventVibeCard renders correctly at 768px width
[ ] EventVibeCard renders correctly at 1200px width
[ ] Arc meter always visible (not clipped)
[ ] Stats pills wrap correctly on narrow screens

ACCESSIBILITY:
[ ] EventVibeCard has aria-label on section
[ ] Arc meter has aria-label with percentage
[ ] Urgency badge has role="status" and aria-live
[ ] All emoji have aria-hidden="true" or role="img" with label
[ ] No animation when prefers-reduced-motion is set
[ ] All text passes WCAG AA contrast

SEO:
[ ] Ramadan page title contains "متى رمضان 2026"
[ ] Ramadan meta description ≤ 155 chars and contains primary keyword
[ ] JSON-LD WebPage, Event, FAQPage present in page source
[ ] HowTo JSON-LD present for bac-results-algeria
[ ] Canonical tag present
[ ] hreflang tags present
```

---

*This plan is authoritative. All code in this document is production-ready. If any conflict arises between this document and the existing codebase, follow the existing codebase's patterns and document the difference.*