import { getSiteEnv } from '@/lib/env.server';
import publishedEventsList from '@/data/holidays/generated/published-events-list.json';

export const SITE_BRAND = 'ميقاتنا';
export const SITE_BRAND_EN = 'Miqatona';
export const SITE_CONTACT_EMAIL = 'contact@miqatona.com';
export const SITE_LEGACY_BRANDS = ['ميقاتنا', 'Miqatona'];
export const SITE_PRIMARY_DOMAIN = 'https://miqatona.com';

// Every name a real person might type or a scraper might record for this brand. Fed into
// Organization.alternateName / WebSite.alternateName (SiteWideSchemas.jsx) so Google can tie
// all of these strings to the same entity — the goal is that "miqatona", "ميقاتنا", "موقع
// ميقاتنا", and the common mis-transliterations all resolve to this site as the top result.
// "ميقاتنا" is deliberately close to the Islamic term ميقات, which is the main thing we're
// disambiguating against in the Arabic SERP.
export const SITE_BRAND_ALT_NAMES = [
  'ميقاتنا',
  'Miqatona',
  'miqatona',
  'موقع ميقاتنا',
  'منصة ميقاتنا',
  'ميقاتنا دوت كوم',
  'miqatona.com',
  'Miqatuna',
  'Mikatona',
  'Meqatona',
  'Miqatna',
];

export const SITE_SLOGAN =
  'كل ما يهمّك يوميًا: أدوات وحاسبات عربية، ومواعيد المناسبات، والوقت والتاريخ.';

// Official brand profiles on third-party platforms — fed into Organization.sameAs and used to
// build the brand's entity graph / Knowledge Panel. sameAs is the single biggest off-page lever
// for owning a branded SERP: Google trusts a brand name far more once the same name is
// corroborated across independent, verified profiles.
//
// ACTION REQUIRED (owner): create these accounts as "ميقاتنا / Miqatona", link each one's bio
// back to https://miqatona.com, then paste the real profile URLs here. Also worth adding once
// they exist: a Google Business Profile, a Wikidata item, and a LinkedIn/Crunchbase company
// page. Until a URL is real, leave it out — a sameAs pointing at a 404 or a non-brand account
// hurts more than an empty list.
export const SITE_SOCIAL_PROFILES = [
  // 'https://x.com/miqatona',
  // 'https://www.facebook.com/miqatona',
  // 'https://www.instagram.com/miqatona',
  // 'https://www.youtube.com/@miqatona',
  // 'https://www.linkedin.com/company/miqatona',
  // 'https://www.tiktok.com/@miqatona',
  // 'https://www.wikidata.org/wiki/QXXXXXXX',
];
// Lead with tools + holidays (owner directive, 2026-08-13: "we like to focus on tools and
// holidays as the main things") — /tools is the site's largest and deepest content investment
// (130+ real tools across 20+ professional/household categories, every one research-first per
// event-creation-lessons.md) yet the old identity strings led with "time and date," burying
// tools as an afterthought in the very Organization/WebSite JSON-LD that renders on every single
// page via SiteWideSchemas.jsx. Time/date/imsakiya stay real, cited, functional pillars — this
// is a reorder for entity/topic signals, not a deletion.
//
// "أدوات" (tools), not "حاسبات" (calculators), is the umbrella word (owner correction,
// 2026-08-13: "we are more than just keywords... we are tools in different categories" — an
// earlier draft of this file over-indexed on repeating "حاسبة X" everywhere). The real content
// mix per src/lib/calculators/data.js is genuinely varied — calculators (حاسبة), buying/how-to
// guides (دليل), trackers (متتبع), eligibility checkers (مدقق), quote/report generators
// (مولّد) — spanning construction, car maintenance, HVAC/electrical, plumbing, carpentry,
// e-commerce, pest control/landscaping, health, education, personal finance, and Islamic
// calculators. That breadth of TOOL TYPE across many CATEGORIES is the actual differentiator
// competitor "calculator-only" sites (arabiccalculator.com, hesaby.net) don't have — the
// identity strings should say that, not just repeat "حاسبة" with a different noun after it.
//
// Homepage VISIBLE copy (page.jsx's own HOME_TITLE/HOME_DESCRIPTION, the H1 in CopyBlock.jsx) is
// deliberately left untouched here — the owner is rebuilding the full homepage/navbar/footer
// visually (withone.ai-inspired reference coming later) and homepage copy will be redone
// together with that, not piecemeal now.
export const SITE_APP_NAME = `${SITE_BRAND} | أدوات وحاسبات عربية لعشرات المجالات، ومواعيد المناسبات`;
export const SITE_HOME_TITLE = 'ميقاتنا | أدوات وحاسبات عربية لكل مجال، ومواعيد المناسبات';
export const SITE_TITLE = SITE_HOME_TITLE;
export const SITE_DESCRIPTION =
  'ميقاتنا منصة عربية تجمع أدوات وحاسبات ودلائل عملية لعشرات المجالات، ومواعيد المناسبات والأعياد بعدّ تنازلي دقيق، والوقت والتاريخ الهجري والميلادي.';

const CURRENT_GREGORIAN_YEAR = new Date().getFullYear();
const NEXT_GREGORIAN_YEAR = CURRENT_GREGORIAN_YEAR + 1;

function normalizeKeyword(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function uniqKeywords(values) {
  return Array.from(new Set(values.map(normalizeKeyword).filter(Boolean)));
}

function buildEventKeywordVariants(events) {
  if (!Array.isArray(events)) return [];

  return events.flatMap((event) => {
    const name = normalizeKeyword(event?.name);
    if (!name) return [];

    return [
      name,
      `كم باقي على ${name}`,
      `متى ${name}`,
      `موعد ${name}`,
      `${name} ${CURRENT_GREGORIAN_YEAR}`,
      `${name} ${NEXT_GREGORIAN_YEAR}`,
      `كم باقي على ${name} ${CURRENT_GREGORIAN_YEAR}`,
      `متى ${name} ${CURRENT_GREGORIAN_YEAR}`,
      `موعد ${name} ${CURRENT_GREGORIAN_YEAR}`,
    ];
  });
}

// Real terms only — every entry below is pulled verbatim from an already-shipped tool's own
// researched `keywords[]` in src/lib/calculators/data.js, not invented here. Renamed from
// SITE_CALCULATOR_KEYWORDS and rebalanced 2026-08-13 (owner correction: "we are more than just
// keywords... we are tools in different categories, we should have stronger keywords" — the
// prior version leaned almost entirely on repeating "حاسبة X" across categories). Deliberately
// mixes tool TYPES — calculators (حاسبة), buying/how-to guides (دليل), trackers (متتبع),
// eligibility checkers (مدقق) — across every one of the 25 real category clusters in
// data.js (finance, carpenter, age, islamic, building, sleep, landscaping, health,
// car-maintenance, hvac, electrical, plumbing, pest-control, education, personal-finance,
// ecommerce, cleaning, construction, cctv, welding, scaffolding, pools, garage-doors, elevators,
// attendance, aluminum-glass), so every category has at least one real representative term here
// — not because this specific tag drives ranking (it doesn't, see note below), but because a
// meta tag that names 4 categories while the site has 25 undersells the site the same way the
// old identity strings did.
//
// IMPORTANT — what this constant actually does: it feeds ONLY `<meta name="keywords">`
// (layout.tsx → SITE_KEYWORDS), which Google has publicly confirmed since 2009 it does not use
// for ranking or crawl/index priority AT ALL — no meta tag makes Google "index faster." The
// mechanisms that actually do that are already in good shape and don't need this tag to work:
// (1) EVERY one of the 130+ tools already has its own real, unique `keywords[]` in data.js
// feeding that tool's own <title>/<meta description>/on-page content — that per-page targeting
// is what Google actually reads; (2) the sitemap already lists all 168 /tools URLs (verified
// live, 2026-08-13); (3) Organization.knowsAbout/WebSite.about (SITE_SCHEMA_TOPICS below) IS a
// real entity/topic signal Google does use. Keep this list accurate for hygiene and honesty, not
// because it's a ranking lever.
export const SITE_TOOLS_KEYWORDS = uniqKeywords([
  'الأدوات',
  'أدوات عربية',
  'قسم الأدوات',
  'أدوات وحاسبات عربية',
  // finance / gulf-finance / personal-finance
  'حاسبة مكافأة نهاية الخدمة',
  'حساب نهاية الخدمة',
  'حاسبة القسط الشهري',
  'حاسبة القروض',
  'حاسبة ضريبة القيمة المضافة',
  'حاسبة النسبة المئوية',
  'صندوق الطوارئ',
  'سداد الديون',
  // age
  'حاسبة العمر',
  'احسب عمرك',
  'كم عمري',
  'حاسبة العمر بالهجري والميلادي',
  // islamic (zakat)
  'حاسبة الزكاة',
  'زكاة المال',
  'نصاب الزكاة',
  'زكاة الذهب',
  // building / construction
  'حاسبة تكلفة البناء',
  'سعر متر البناء',
  'حاسبة وزن حديد التسليح',
  'حاسبة الدهان',
  'حاسبة البلاط',
  // carpenter
  'دليل المبتدئين في النجارة',
  'انواع الخشب',
  'افضل انواع الخشب للأثاث',
  // sleep
  'حاسبات النوم الذكي',
  'متى أنام',
  'كم ساعة نوم أحتاج',
  // health
  'حاسبة الحمل',
  'مؤشر كتلة الجسم',
  // car-maintenance
  'متتبع صيانة السيارة',
  'تذكير تغيير الزيت',
  'فحص رقم الشاصي',
  // hvac
  'دليل أنواع المكيفات',
  'انواع المكيفات',
  'افضل انواع المكيفات',
  // electrical
  'حاسبة استهلاك الكهرباء',
  'دليل عداد الكهرباء',
  'دليل لوحة الكهرباء والقواطع',
  // plumbing
  'دليل كشف تسربات المياه',
  'دليل خزانات المياه',
  // pest-control
  'حاسبة جرعة المبيد',
  'كيف احسب كمية المبيد',
  // landscaping
  'حاسبة تكلفة تنسيق حديقة',
  'كم تكلفة تنسيق حديقة',
  // education
  'حاسبة المعدل الدراسي',
  'حاسبة الانحراف المعياري',
  // ecommerce
  'محقق اهلية زاتكا',
  'هل انا مشمول بزاتكا المرحلة الثانية',
  // cleaning
  'حاسبة تكلفة التنظيف',
  'تكلفة تنظيف المنزل',
  // cctv
  'حساب سعة تخزين كاميرات المراقبة',
  // welding
  'دليل اللحام وحاسبة الأقطاب والتيار',
  // scaffolding
  'دليل أسعار وأنواع السقالات',
  // pools
  'حاسبة حجم المسبح وجرعة الكلور',
  // garage-doors
  'دليل اختيار مقاس باب الجراج',
  // elevators
  'مدقق عقد صيانة المصعد',
  // attendance
  'حاسبة تكلفة نظام الحضور والانصراف',
  // aluminum-glass
  'دليل أنواع وألوان زجاج الشبابيك',
  // domestic-worker eligibility (finance cluster, distinct enough to name separately)
  'مدقق أهلية استقدام عاملة منزلية',
  'شروط استقدام عاملة منزلية',
]);

const SITE_STATIC_KEYWORDS = [
  SITE_BRAND,
  SITE_BRAND_EN,
  ...SITE_LEGACY_BRANDS,
  'الوقت',
  'الساعة',
  'الوقت الان',
  'الساعة الان',
  'الوقت الآن',
  'الساعة الآن',
  'كم الساعة',
  'توقيت',
  'التاريخ',
  'هجري',
  'ميلادي',
  'التقويم',
  'تحويل التاريخ',
  'محول التاريخ',
  'تاريخ اليوم',
  'تاريخ اليوم هجري',
  'تاريخ اليوم ميلادي',
  'فرق التوقيت',
  'حاسبة فرق التوقيت',
  'تحويل الوقت',
  'العد التنازلي',
  'المناسبات',
  'الأعياد',
  'الإجازات الرسمية',
  'الأحداث القادمة',
  'الوقت الان في مدينتي',
  'الوقت الآن في مدينتي',
  'معرفة فرق التوقيت بين الدول',
  'تاريخ اليوم بالهجري والميلادي',
  'أداة تحويل التاريخ من هجري إلى ميلادي والعكس',
  'العد التنازلي لأهم المناسبات والأعياد والإجازات الرسمية',
  'مرجع عربي عملي للوقت والمواعيد في الوطن العربي والعالم',
];

export const SITE_EVENT_KEYWORDS = uniqKeywords(
  buildEventKeywordVariants(publishedEventsList),
);

export const SITE_KEYWORDS = uniqKeywords([
  ...SITE_STATIC_KEYWORDS,
  ...SITE_TOOLS_KEYWORDS,
  ...SITE_EVENT_KEYWORDS,
]);

// Feeds Organization.knowsAbout + WebSite.about in SiteWideSchemas.jsx — rendered on every page,
// so this is one of the highest-leverage entity/topic signals on the whole site. Expanded
// 2026-08-13 (owner: "focus on tools and holidays as the main things") from a list that only
// named 2 tool topics ("الحاسبات المالية"/"الأدوات المالية") despite /tools now covering 20+ real
// categories (130+ calculators/guides, per src/lib/calculators/data.js) — pulled from the actual
// shipped category names, not invented. Also drops 'المدونة العربية' and 'فهرس الأدوات': /blog and
// /fahras were both fully retired (see CLAUDE.md's 2026-08-09 note) — a live Organization schema
// should never claim a topic for a section that no longer exists.
export const SITE_SCHEMA_TOPICS = [
  'أدوات وحاسبات عربية',
  'المناسبات والإجازات',
  'عداد المناسبات',
  'العد التنازلي للمناسبات',
  'الوقت الان',
  'الوقت الآن',
  'فرق التوقيت',
  'التاريخ الهجري',
  'التاريخ الميلادي',
  'محول التاريخ',
  'تحويل التاريخ',
  'التقويم الهجري',
  'التقويم الميلادي',
  'حاسبة العمر',
  'التمويل الشخصي والحاسبات المالية',
  'القسط الشهري',
  'مكافأة نهاية الخدمة',
  'ضريبة القيمة المضافة',
  'النسبة المئوية',
  'الزكاة',
  'البناء والإنشاء',
  'صيانة السيارات',
  'الكهرباء والتكييف',
  'السباكة',
  'النوم والصحة',
  'النجارة والأثاث الخشبي',
  'مكافحة الحشرات وتنسيق الحدائق',
  'الخدمات المنزلية والتنظيف',
  'التعليم والمعدل الدراسي',
  'التجارة الإلكترونية وزاتكا',
];

export const SITE_DEFAULT_LOCALE = 'ar-SA';
export const SITE_SUPPORTED_LOCALES = ['ar-SA', 'ar-EG', 'ar-MA', 'ar-AE'];
const SITE_CANONICAL_ALIAS_HOSTS = new Set([
  'www.miqatona.com',
  'miqatona.com',
]);

function normalizeSiteUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

function canonicalizeSiteUrl(value) {
  const normalized = normalizeSiteUrl(value);
  if (!normalized) return null;

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'miqatona.com' || SITE_CANONICAL_ALIAS_HOSTS.has(hostname)) {
      return SITE_PRIMARY_DOMAIN;
    }

    return normalized;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  const env = getSiteEnv();
  const explicitSiteUrl =
    canonicalizeSiteUrl(env.NEXT_PUBLIC_BASE_URL) ||
    canonicalizeSiteUrl(env.NEXT_PUBLIC_SITE_URL);

  if (explicitSiteUrl) return explicitSiteUrl;
  if (env.NODE_ENV === 'production') return SITE_PRIMARY_DOMAIN;

  return (
    canonicalizeSiteUrl(env.VERCEL_URL) ||
    canonicalizeSiteUrl(env.VERCEL_PROJECT_PRODUCTION_URL) ||
    SITE_PRIMARY_DOMAIN
  );
}

export function getMetadataBase() {
  return new URL(getSiteUrl());
}
