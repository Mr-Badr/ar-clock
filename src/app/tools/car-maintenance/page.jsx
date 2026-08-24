import Link from 'next/link';

import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import { HubGuideSection, HubFaq, buildHubFaqSchema } from '@/components/tools-v2/HubGuideSection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function findRoute(slug) {
  const route = CALCULATOR_ROUTES.find((item) => item.slug === slug);
  if (!route) {
    throw new Error(`car-maintenance hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Wave 1 — see keyword-research/car-maintenance-hub/DECISION.md. Chosen after direct-web-research
// ruled out the real-estate-agent hub (khaleejcalculators.com already has a full agent-commission
// calculator suite) — this hub instead targets the MECHANICAL/maintenance side of car ownership
// (oil, tires, service scheduling), a distinct axis from khaleejcalculators' car-related tools
// (which are all financial: loan, ownership cost, trip fuel cost). Pan-Arab, no money fields at
// all, so no Gulf-currency-selector requirement applies here.
const FEATURED_SLUGS = ['vin-check', 'maintenance-tracker', 'warning-lights'];

const TYPE_GROUPS = [
  {
    code: 'schedule',
    name: 'الجدول والمواعيد',
    note: 'متى تفحص كل جزء، ومتتبع شخصي يحسب موعدك القادم فعلياً.',
    slugs: ['car-maintenance-schedule', 'maintenance-tracker'],
  },
  {
    code: 'diagnose',
    name: 'التشخيص والفحص',
    note: 'فهم ما تخبرك به سيارتك، وتحقق من هويتها الحقيقية.',
    slugs: ['warning-lights', 'vin-check'],
  },
  {
    code: 'reference',
    name: 'مرجع وتحويلات',
    note: 'أرقام وتحويلات تحتاجها قبل أي قرار صيانة.',
    slugs: ['tire-guide', 'oil-guide', 'fuel-efficiency'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'من أين أبدأ إذا كنت لا أعرف أي شيء عن صيانة سيارتي؟',
    answer: 'ابدأ بجدول الصيانة الدورية لمعرفة ماذا يُفحص أو يُغيّر عند كل محطة مسافة (5,000، 10,000، 20,000 كم وهكذا)، ثم استخدم متتبع الصيانة لحساب موعدك القادم تحديداً بناءً على قراءة عدادك ومعدل قيادتك الفعلي — لا تحتاج حفظ الجدول كاملاً، الأداة تتذكره عنك.',
  },
  {
    question: 'هل نفس جدول الصيانة يصلح لأي سيارة وأي بلد عربي؟',
    answer: 'الجدول مبني على توافق التوصيات العامة بين الوكالات ومراكز الصيانة، ويصلح كمرجع عام لمعظم السيارات — لكن الرجوع لكتيب الصيانة الخاص بسيارتك يبقى الأدق دائماً، خصوصاً للسيارات الحديثة التي قد تختلف فتراتها عن المعتاد.',
  },
  {
    question: 'ضوء تحذيري أضاء فجأة في لوحة القيادة — من أين أعرف خطورته؟',
    answer: 'اللون يفرّق بين الحالات: الأحمر يعني توقفاً فورياً أو مراجعة عاجلة جداً (حرارة، زيت، فرامل)، بينما الأصفر يعني مراجعة قريبة لكن ليست طارئة بالضرورة. راجع دليل أضواء لوحة القيادة لمعرفة معنى كل ضوء تحديداً قبل أن تقرر متابعة القيادة أو التوقف.',
  },
  {
    question: 'كيف أعرف بيانات سيارتي الحقيقية دون الرجوع لملصق أو وثيقة؟',
    answer: 'رقم الشاصي (VIN) المكوّن من 17 خانة يحمل بلد الصنع وسنة الإنتاج والشركة المصنّعة والموديل — أدخله في أداة فحص رقم الشاصي للحصول على البيانات الحقيقية فوراً دون تسجيل أو رسوم.',
  },
];

function ToolLink({ slug }) {
  const route = findRoute(slug);
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={route.href}>
            <span className="tool-v2-dot" aria-hidden="true">•</span>
            <span className="tool-v2-link-text">{route.shortLabel || route.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{route.description}</TooltipContent>
      </Tooltip>
    </li>
  );
}

export const metadata = buildCanonicalMetadata({
  title: 'دليل صيانة السيارة — جدول الصيانة، الإطارات، وزيت المحرك',
  description:
    'كل ما تحتاج معرفته لصيانة سيارتك بنفسك: جدول الصيانة الدورية الكامل، متتبع يحسب موعدك القادم ويحمّله لتقويمك، محول ضغط الإطارات، ودليل زيت المحرك.',
  keywords: [
    'دليل صيانة السيارة',
    'جدول الصيانة الدورية للسيارة',
    'متتبع صيانة السيارة',
    'محول ضغط الاطارات',
    'افضل زيت محرك',
    'محول استهلاك الوقود',
    'فحص رقم الشاصي',
    'صيانة السيارة كل كم كيلو',
  ],
  url: `${SITE_URL}/tools/car-maintenance`,
});

export default function CarMaintenanceHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'صيانة السيارة', item: `${SITE_URL}/tools/car-maintenance` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'دليل صيانة السيارة',
    url: `${SITE_URL}/tools/car-maintenance`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: toolCount,
      itemListElement: Array.from(allListedSlugs).map((slug, index) => {
        const route = findRoute(slug);
        return {
          '@type': 'ListItem',
          position: index + 1,
          name: route.shortLabel || route.title,
          url: `${SITE_URL}${route.href}`,
        };
      }),
    },
  };
  const faqSchema = buildHubFaqSchema(FAQ_ITEMS);

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-car-maintenance-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 17h14M6 17l1.5-5h9L18 17M8 17v2M16 17v2M7 12l1-4h8l1 4" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="16.5" cy="17.5" r="1.5" />
              </svg>
            </span>
            <h1>دليل صيانة السيارة</h1>
          </div>
          <p>
            من موعد تغيير الزيت إلى ضغط الإطارات — كل ما يحتاجه أي مالك سيارة في مكان واحد، ببيانات
            عامة موثّقة تصح في أي بلد عربي، ومتتبع شخصي يحسب موعدك أنت تحديداً.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدلة وأدوات مرتبطة مباشرة</span>
          </div>
        </div>

        <div className="tool-v2-featured-row">
          {FEATURED_SLUGS.map((slug) => {
            const route = findRoute(slug);
            return (
              <Link key={slug} href={route.href} className="tool-v2-featured-tool">
                <span className="tool-v2-ft-ic" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                  </svg>
                </span>
                <span>
                  <b>{route.shortLabel || route.title}</b>
                  <span>{route.badge}</span>
                </span>
              </Link>
            );
          })}
        </div>

        <TooltipProvider>
          <div className="tool-v2-type-groups">
            {TYPE_GROUPS.map((group) => (
              <div key={group.code} className="tool-v2-type-group">
                <h2>{group.name}</h2>
                {group.note ? <p className="tool-v2-type-group-note">{group.note}</p> : null}
                <ul className="tool-v2-tool-link-list">
                  {group.slugs.map((slug) => (
                    <ToolLink key={slug} slug={slug} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TooltipProvider>

        <HubGuideSection id="hub-faq" title="الأسئلة الشائعة">
          <HubFaq items={FAQ_ITEMS} />
        </HubGuideSection>
      </div>
    </main>
  );
}
