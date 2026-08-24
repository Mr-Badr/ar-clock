import Link from 'next/link';
import {
  AppWindow,
  Bug,
  Car,
  Elevator,
  Fingerprint,
  Garage,
  GraduationCap,
  Hammer,
  HardHat,
  Heartbeat,
  Lightning,
  Mosque,
  Plant,
  Ruler,
  Sparkle,
  SprayBottle,
  Storefront,
  Drop,
  Snowflake,
  VideoCamera,
  Waves,
  Wallet,
} from '@phosphor-icons/react/ssr';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection } from '@/components/tools-v2/HubGuideSection';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

// One distinct, category-specific icon per hub — never share an icon across categories, and
// never fall back to a generic default (owner correction, 2026-08-05: the old grid repeated
// the same icon on every card).
const CATEGORY_ICONS = {
  'gulf-finance': Wallet,
  construction: HardHat,
  plumbing: Drop,
  electrical: Lightning,
  hvac: Snowflake,
  carpenter: Hammer,
  'car-maintenance': Car,
  ecommerce: Storefront,
  cleaning: SprayBottle,
  'pest-control': Bug,
  landscaping: Plant,
  cctv: VideoCamera,
  pools: Waves,
  'aluminum-glass': AppWindow,
  health: Heartbeat,
  education: GraduationCap,
  attendance: Fingerprint,
  'garage-doors': Garage,
  elevators: Elevator,
  welding: Sparkle,
  scaffolding: Ruler,
  islamic: Mosque,
};

// Arabic plural agreement for "أداة" (tool, feminine) — 1/2/3-10/11+ each take a different form.
function formatToolCount(count) {
  if (count === 1) return 'أداة واحدة';
  if (count === 2) return 'أداتان';
  if (count >= 3 && count <= 10) return `${count} أدوات`;
  return `${count} أداة`;
}

// Each new /tools/<category> hub gets one entry here, following the keyword-driven,
// research-first workflow documented in docs/PLAN.md §5 before it's added.
const CATEGORIES = [
  {
    slug: 'gulf-finance',
    name: 'الرواتب والمزايا الخليجية',
    description: 'نهاية الخدمة، تعويض الفصل التعسفي، وتكلفة استقدام عاملة منزلية — لكل دولة حاسبتها.',
    // Kept in sync manually with the actual count computed in
    // /tools/gulf-finance/page.jsx (COUNTRY_GROUPS + MULTI_COUNTRY_TOOLS + SHARIA_TOOLS_SLUGS).
    // **2026-08-03, two removal passes**: 47 of the original 65 tools removed after real
    // per-tool competitor research — see keyword-research/gulf-finance-cleanup-2026-08-03/DECISION.md.
    // **2026-08-04**: Kuwait/Qatar/Bahrain/Oman's real gap (flagged above as "not yet filled")
    // closed with 5 new domestic-worker-recruitment-cost calculators (UAE + the 4 previously-empty
    // countries), each with real primary-source-verified government fees — see
    // keyword-research/domestic-worker-cost/DECISION.md. Morocco and Egypt (down to 1 tool) remain
    // open gaps needing their own research-first pass.
    // **2026-08-04, second pass**: added the eligibility checker + contract generator from the
    // same DECISION.md tool-priority list (✅checker → 🧮calculator → 📄generator) — both Gulf-wide
    // multi-country tools, bringing the total from 23 to 25.
    // **2026-08-05**: +3 — the Denmark/Canada/France diaspora payment-date tools were relocated
    // here from the retired /calculators/* tree (own "مواعيد دفعات دولية" group, not counted as
    // Gulf/Arab finance) as part of eliminating the /calculators URL prefix sitewide.
    toolCount: 28,
  },
  {
    slug: 'construction',
    name: 'البناء والتشييد',
    description: 'تكلفة البناء، وزن الحديد، وتحويل وحدات المساحة — بمصادر سعرية حقيقية.',
    // Kept in sync with /tools/construction/page.jsx TYPE_GROUPS — 9 tools (5 migrated from
    // /calculators/building/* + 1 new unit converter + 1 gypsum-board calculator added 2026-08-01
    // from real, previously-unbuilt DECISION.md demand + 1 waterproofing materials-quantity
    // calculator added 2026-08-03, folded into this hub instead of a new one-tool hub — see
    // keyword-research/construction-hub/ and keyword-research/narrow-tools-2026-08-03/DECISION.md §2
    // + 1 masonry/block-brick quantity calculator added 2026-08-04, using engine data
    // (MASONRY_UNITS_PER_M2) that had existed unused since the hub's original build).
    // Also 2026-08-04: build-cost went Gulf-wide (6-country selector, re-sourced cost_per_m2 for
    // all 6 GCC countries) — see keyword-research/construction-hub/DECISION.md §2.
    // 2026-08-09: +2 — the only 2 articles from the retired /blog section with real traffic
    // (cement bags, rebar weight) migrated here as a new "المقالات" group; /blog deleted entirely.
    toolCount: 11,
  },
  {
    slug: 'plumbing',
    name: 'السباكة',
    description: 'كشف تسربات المياه، خزانات المياه، سخانات المياه، وعداد المياه — أدلة شاملة قبل أي قرار أو تعاقد.',
    // Kept in sync with /tools/plumbing/page.jsx — 4 editorial guides, built from real Keyword
    // Planner data (keyword-research/plumber-hub/DECISION.md), not calculators — see
    // .claude/rules/... hub-not-just-calculators standing rule.
    toolCount: 4,
  },
  {
    slug: 'electrical',
    name: 'الكهرباء',
    description: 'اختيار مولد الكهرباء المناسب، لوحة التوزيع والقواطع، عداد الكهرباء، أرقام الطوارئ، ومحول وحدات وحاسبة استهلاك — كل ما تحتاجه قبل أي قرار كهربائي.',
    // Kept in sync with /tools/electrical/page.jsx — 4 editorial guides + 2 real calculators
    // (unit converter + consumption estimator), built from real Keyword Planner data
    // (keyword-research/electrician-hub/DECISION.md). The 2 calculators were added after a
    // second pass over the FULL keyword export surfaced real تحويل/حاسبة demand the first
    // pass missed — see feedback-analyze-full-keyword-set-not-just-candidates memory.
    toolCount: 6,
  },
  {
    slug: 'hvac',
    name: 'التكييف',
    description: 'أي نوع مكيف يناسبك، كم يوفر لك الانفرتر بالريال، بطاقة كفاءة الطاقة، الصيانة والأعطال.',
    // Kept in sync with /tools/hvac/page.jsx TYPE_GROUPS — 6 pages, built from direct web/
    // competitor research (not Keyword Planner) after confirming tbreed.com/ehsabi.com already
    // own the sizing/converter/consumption-calculator niches — see keyword-research/hvac-hub/DECISION.md.
    toolCount: 6,
  },
  {
    slug: 'carpenter',
    name: 'النجارة',
    description: 'أنواع الخشب ومقياس الصلابة، أبواب وباركيه الخشب، حاسبة الكمية والتكلفة، وصلات النجارة، صيانتها، وأفكار ديكور ودليل مبتدئين.',
    // Waves 1-4 of a multi-wave build (11 pages) — kept in sync with
    // /tools/carpenter/page.jsx TYPE_GROUPS. See keyword-research/carpenter-hub/DECISION.md.
    toolCount: 11,
  },
  {
    slug: 'car-maintenance',
    name: 'صيانة السيارة',
    description: 'جدول الصيانة الدورية، متتبع يحسب موعدك القادم، فحص رقم الشاصي، دليل أضواء لوحة القيادة، ومحولات الإطارات والوقود.',
    // Wave 1 (6 pages, 2026-08-02) + Wave 2 vin-check (2026-08-02, added after real Keyword
    // Planner data validated the demand — see keyword-research/car-maintenance-hub/DECISION.md).
    toolCount: 7,
  },
  {
    slug: 'ecommerce',
    name: 'التجارة الإلكترونية',
    description: 'محقق أهلية زاتكا، فك تشفير كود QR للفاتورة، هامش ربح سلة وزد، ومقارنة شركات الشحن.',
    // Wave 1 (4 pages, 2026-08-02) — chosen after direct web research ruled out a general HR hub
    // (ksatools.com's real sitemap shows 18 mature HR/payroll + document-generator tools already).
    // See keyword-research/ecommerce-hub/DECISION.md.
    toolCount: 4,
  },
  {
    slug: 'cleaning',
    name: 'التنظيف',
    description: 'حاسبة تكلفة تنظيف المنزل، مولّد عرض سعر وعقد شهري، ومتى تحتاج تنظيفاً عميقاً أو تنظيف خزان المياه.',
    // Kept in sync with /tools/cleaning/page.jsx TYPE_GROUPS — 4 tools built after real SERP-gap
    // research confirmed zero Arabic interactive cost calculator exists anywhere in the Gulf
    // market (every "calculator"-looking competitor page is a lead-gen form) — see
    // keyword-research/cleaning-hub/DECISION.md. City-page variants were rejected: every
    // "[service] + city" query tested returned 100% local-business lead-gen results.
    toolCount: 4,
  },
  {
    slug: 'pest-control',
    name: 'مكافحة الحشرات',
    description: 'تكلفة مكافحة الحشرات والنمل الأبيض، حاسبة جرعة المبيد، تقرير معاينة جاهز، ومدقق عقد سنوي أم معالجة لمرة واحدة.',
    // Kept in sync with /tools/pest-control/page.jsx TYPE_GROUPS — 5 tools. Split deliberately
    // between a consumer cost/decision angle and a professional/B2B angle (dosage calculator,
    // inspection-report generator) after research showed "شركة مكافحة حشرات" and any
    // city-qualified cost query are 100% local-business lead-gen intent — see
    // keyword-research/pest-control-hub/DECISION.md.
    toolCount: 5,
  },
  {
    slug: 'landscaping',
    name: 'تنسيق الحدائق',
    description: 'تكلفة تنسيق الحديقة، كمية العشب الصناعي، الري بالتنقيط، اختيار نباتات مناسبة للمناخ الخليجي، حصى الحديقة، وجدول صيانة شهري.',
    // Kept in sync with /tools/landscaping/page.jsx TYPE_GROUPS — 7 tools built after research
    // confirmed "تنسيق حدائق" and every city variant are 100% local-business lead-gen intent,
    // and the one direct "calculator" competitor found (naseemlandscape.com) hides its result
    // behind a lead form — see keyword-research/landscaping-hub/DECISION.md.
    toolCount: 7,
  },
  {
    slug: 'cctv',
    name: 'كاميرات المراقبة',
    description: 'حاسبة سعة تخزين كاميرات المراقبة (NVR/DVR) ودليل اختيار سلكية أم لاسلكية.',
    // Deliberately narrow (2 pages) — "كاميرات مراقبة" itself is a brand/retailer-owned keyword
    // space (512k/mo, only 10% low-competition); this hub picks off the one validated calculator
    // gap instead of competing for the head term. See
    // keyword-research/narrow-tools-2026-08-03/DECISION.md §1. Does NOT mean this category
    // passed the full Hub Gate (docs/PLAN.md §15) — it's the minimal container for one tool.
    toolCount: 2,
  },
  {
    slug: 'pools',
    name: 'المسابح',
    description: 'حاسبة حجم المسبح بالمتر المكعب واللتر، ثم جرعة الكلور المطلوبة مباشرة.',
    // Deliberately single-tool hub — "المسابح" failed the Hub Gate as a strategic category
    // (only 8% low-competition volume, top terms are image/generic search) — owner's explicit
    // verdict was "SKIP category, keep 1 tool". See
    // keyword-research/narrow-tools-2026-08-03/DECISION.md §3.
    toolCount: 1,
  },
  {
    slug: 'aluminum-glass',
    name: 'الألومنيوم والزجاج',
    description: 'أنواع الزجاج (سيكوريت، دبل جلاس، لامينيت)، ألوان الزجاج العاكس، ومقارنة الألومنيوم مع UPVC.',
    // Deliberately single-page hub (2026-08-09) — real Keyword Planner data showed zero volume
    // for every calculator/generator/converter-shaped phrase (weight, meterage, quotes, unit
    // conversion). The real demand is decorative/comparison browsing (colors, types, framing
    // material) — a buying-guide page, not a tool. See
    // keyword-research/aluminum-glass/DECISION.md. Does NOT mean this category passed the full
    // Hub Gate as a strategic calculator category — it's the minimal container for one page.
    toolCount: 1,
  },
  {
    slug: 'attendance',
    name: 'الحضور والانصراف',
    description: 'احسب تكلفة نظام الحضور والانصراف حسب عدد موظفيك، مع مقارنة أسعار حقيقية لأبرز المزودين.',
    // Deliberately single-tool hub (2026-08-10) — real Keyword Planner data on "نظام الحضور
    // والانصراف" (11,500/mo, Low-Medium comp, bid up to 230.35 SAR — the highest CPC found
    // across this whole research round). The adjacent ideas from the same research batch
    // (انتركم، اكسس كنترول تجزئة) were rejected on competition/CPC grounds — see docs/PLAN.md
    // §13 and keyword-research/access-control-intercom-hub/DECISION.md.
    toolCount: 1,
  },
  {
    slug: 'garage-doors',
    name: 'أبواب الجراج',
    description: 'اختر مقاس باب الجراج المناسب لعدد سياراتك، وحل مشاكل الريموت الشائعة قبل الاتصال بفني.',
    // Deliberately single-tool hub (2026-08-10) — real Keyword Planner data on "أبواب الجراج"
    // (59,700/mo, mostly High comp on the broad retail term but real Low-comp gems on
    // informational/decision queries, 28.4 SAR avg top bid). WebSearch-first check found no
    // dedicated Arabic size/troubleshooting selector — only product listings and one-off
    // articles. See docs/PLAN.md §13 and keyword-research/garage-doors-hub/DECISION.md.
    toolCount: 1,
  },
  {
    slug: 'elevators',
    name: 'المصاعد',
    description: 'تحقق من بنود عقد صيانة المصعد قبل التوقيع، وتعرف على أنواع العقود واشتراطات الدفاع المدني الحقيقية.',
    // Deliberately narrow single-tool hub (2026-08-10) — real Keyword Planner data on "صيانة
    // مصاعد" (10,000/mo combined across spellings, Medium comp, bid up to 56.19 SAR). The
    // generic "guide to maintenance contracts" angle was found saturated by 9+ real elevator
    // companies publishing near-identical lead-gen content — this hub deliberately narrows to a
    // compliance-checklist angle grounded in real Civil Defense requirements instead. See
    // docs/PLAN.md §13 and keyword-research/elevators-hub/DECISION.md.
    toolCount: 1,
  },
  {
    slug: 'welding',
    name: 'اللحام',
    description: 'أنواع اللحام (القوس الكهربائي، الأرجون، MIG/CO2) واحسب كمية أقطاب اللحام والتيار المناسب مباشرة.',
    // Differentiation play, not a CPC play (owner verdict, 2026-08-10) — 127,700/mo broad volume
    // on تلحيم/للحام/ورش اللحام (some Low comp), but weak CPC (max 18.8 SAR). Zero Arabic
    // competitor has a real electrode-consumption/amperage calculator despite real English
    // precedent (MachineMFG, Kobelco). Calculators shipped as embedded utility on the pillar
    // guide, not standalone SEO pages — see docs/PLAN.md §13 and
    // keyword-research/welding-hub/DECISION.md.
    toolCount: 1,
  },
  {
    slug: 'scaffolding',
    name: 'السقالات',
    description: 'جدول أسعار حقيقي شامل لكل أنواع السقالات إيجاراً وشراءً، ودليل اختيار النوع المناسب لمشروعك.',
    // Built 2026-08-10 after correcting course mid-research: real Keyword Planner data on
    // سقالات/سقالة (5,000/mo each, Medium comp) decomposed mostly into rental-company brand
    // names and rental/purchase commercial intent — the first read treated that as unbuildable
    // and nearly got rejected outright. Owner correction: don't default to reject on
    // company/commercial-shaped intent — aggregate real, WebFetch-verified data (full pricing
    // table across all types, a real operating company as a due-diligence reference point) into
    // one resource instead. See docs/PLAN.md §13 and keyword-research/scaffolding-hub/DECISION.md.
    toolCount: 1,
  },
  {
    slug: 'islamic',
    name: 'الأدوات الإسلامية',
    description: 'حاسبة زكاة المال الشاملة وحاسبات متخصصة للذهب والأسهم والتجارة والراتب، حسب مذهبك، بأسعار حيّة لأكثر من 20 دولة عربية، ودليل الفروق بين المذاهب الأربعة.',
    // Built 2026-08-10 — by far the largest real Keyword Planner dataset found this session
    // (1.9M+/mo combined, 88% Low comp). v2 (2026-08-11, owner directive): full hub — 4-madhab-
    // aware core calculators, live pricing across 22 Arab currencies (not Gulf-only), 4 dedicated
    // per-asset-type calculators (gold/stocks/trade-goods/salary), a real madhab-comparison guide,
    // a live nisab-today page, and 4 existing fiqh calculators (aqiqah/wasiyya/nafaqah/iddah)
    // cross-listed in from gulf-finance — all cross-linked to each other. Real competitors exist
    // (hasbati.com, arabtoolbox.com, Al-Azhar's own calculator) but none combine a computational
    // 4-madhab selector + persistent Hawl tracking + 20+-currency live pricing + visual results.
    // See docs/PLAN.md §13 and keyword-research/zakat-calculator-tracker/DECISION.md.
    toolCount: 12,
  },
  {
    slug: 'health',
    name: 'الصحة والحمل والعمر',
    description: 'حاسبة الحمل وجدول تغذية الرضيع بالهجري والميلادي، وحاسبات العمر والوقت.',
    // Built 2026-08-04 to fix a real gap: these 11 tools (pregnancy/pregnancy-weeks/
    // weaning-schedule + the 8-tool age cluster) were already live but had ZERO hub card
    // anywhere in /tools. bmi/calories/ovulation/fasting were EXCLUDED from PROMOTION after a
    // real competitive audit found them dominated by webteb.com/altibbi.com/real hospitals/
    // government health ministries — see keyword-research/health-education-hubs/DECISION.md.
    // **2026-08-05**: +6 — those 4 excluded tools plus date-add-subtract/hijri-birthday were
    // relocated here from the retired /calculators/* tree (owner directive: no /calculators path
    // at all) and listed in real groups for internal linking — a URL move, not new promotion.
    toolCount: 17,
  },
  {
    slug: 'education',
    name: 'التعليم',
    description: 'التقويم الدراسي السعودي الكامل — بداية العام، كل الإجازات، وعد تنازلي حي.',
    // Built 2026-08-04 alongside /tools/health, same root cause. Originally single-tool:
    // gpa/gpa-to-percent/weighted-grade were EXCLUDED from PROMOTION after a competitive audit
    // found them dominated by 9+ competitors incl. official university pages and a global
    // calculator giant (rapidtables.org) — see keyword-research/health-education-hubs/DECISION.md.
    // **2026-08-05**: +4 — those 3 tools plus standard-deviation were relocated here from the
    // retired /calculators/* tree (owner directive: no /calculators path at all) and listed in a
    // real "أدوات الطلاب" group for internal linking — a URL move, not new promotion.
    toolCount: 5,
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'الأدوات — حاسبات وأدلة ومدققات مجانية بالعربي',
  description:
    'كل أدوات ميقاتنا المجانية في مكان واحد — حاسبات وأدلة ومدققات مقسّمة حسب الفئة، من الرواتب والمزايا الخليجية إلى البناء والصحة والنوم، وفئات جديدة تُضاف باستمرار.',
  keywords: [
    'حاسبات عربية',
    'ادوات ميقاتنا',
    'حاسبات مالية خليجية',
    'حاسبة مكافأة نهاية الخدمة',
    'حاسبات البناء',
    'حاسبات النوم',
    'حاسبة الزكاة',
    'حاسبات صحية',
    'حاسبات ومدققات مجانية بالعربي',
    'حاسبة تكلفة البناء',
    'حاسبات صيانة السيارات',
    'حاسبات تعليمية',
    'حاسبات التنظيف ومكافحة الحشرات',
    'حاسبات الكهرباء والتكييف',
    'حاسبة القرض والراتب',
    'ادوات ومحولات عربية مجانية',
    'دليل شراء ومقارنة اسعار',
    'مولدات عروض اسعار وعقود',
  ],
  url: `${SITE_URL}/tools`,
});

export default function ToolsHubPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
    ],
  };
  // Category descriptions moved off the visual card (2026-08-05 redesign — icon-first compact
  // tiles, no body text) but kept here so Google still sees them: same "invisible to the user,
  // visible to Google" pattern as calculator-ui-standards.md §0a.
  const categoryListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CATEGORIES.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      description: category.description,
      url: `${SITE_URL}/tools/${category.slug}`,
    })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }} />

      <ToolTopAdSlot slotId="top-tools-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-hub-hero">
          <span className="tool-v2-kicker">الأدوات</span>
          <h1>كل الأدوات في مكان واحد</h1>
          <p className="tool-v2-lead">حاسبات، أدلة، مدققات، ومولّدات مستندات — اختر فئة، وابدأ فوراً بلا تسجيل ولا انتظار.</p>
        </div>

        <div className="tool-v2-cat-grid">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.slug];
            return (
              <Link key={category.slug} href={`/tools/${category.slug}`} className="tool-v2-cat-tile">
                <span className="tool-v2-cat-tile-ic" aria-hidden="true">
                  <Icon size={22} weight="bold" />
                </span>
                <span className="tool-v2-cat-tile-title">{category.name}</span>
                <span className="tool-v2-cat-tile-count">{formatToolCount(category.toolCount)}</span>
              </Link>
            );
          })}
        </div>

        <HubGuideSection id="how-this-works" title="أدوات تنجز المهمة، لا تخمّنها">
          <p>
            كل أداة هنا تعطيك نتيجة حقيقية بدل التقدير بالعين — سواء كانت حاسبة تعطيك رقماً، دليلاً
            يشرح لك القرار خطوة بخطوة، مدققاً يعطيك توصية مبنية على إجاباتك، أو مولّد مستندات يجهّز
            لك ورقة جاهزة للاستخدام. أدخل بياناتك أنت، وستحصل على نتيجة تخصك مباشرة دون تسجيل أو
            انتظار. اختر الفئة التي تحتاجها الآن، أو تصفّح الفئات كلها لتكتشف أداة قد توفر عليك
            وقتاً ومالاً في مرة قادمة.
          </p>
          <p>
            كل أداة هنا مجانية بالكامل ولا تطلب منك حساباً أو بريداً إلكترونياً لاستخدامها —
            استخدمها واحصل على نتيجتك فوراً في نفس الصفحة. الفئات تغطي مجالات يومية حقيقية
            (الرواتب، البناء، الصحة، النوم، المطبخ، السيارة، والمزيد)، ونضيف فئات جديدة كلما وجدنا
            سؤالاً حقيقياً يستحق أداة مخصصة له بدل إجابة عامة لا تخصك.
          </p>
        </HubGuideSection>
      </div>
    </main>
  );
}
