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
    throw new Error(`fuel-prices hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// New category (2026-08-25), split out of /tools/gulf-finance — see fuel-prices-registry.js's
// header for the full history (openvan.camp live source, per-country verification, then this
// split once the country count made "gulf-finance" an inaccurate label for a pan-Arab feature).
// Grouped by sub-region, matching how a reader actually scans this kind of list — not
// alphabetical, not by GDP, by where the country geographically sits.
const FEATURED_SLUGS = ['saudi-fuel-prices', 'uae-fuel-prices', 'compare'];

const TYPE_GROUPS = [
  {
    code: 'gulf',
    name: 'دول الخليج',
    note: '',
    slugs: [
      'saudi-fuel-prices', 'uae-fuel-prices', 'kuwait-fuel-prices',
      'qatar-fuel-prices', 'bahrain-fuel-prices', 'oman-fuel-prices',
    ],
  },
  {
    code: 'north-africa',
    name: 'شمال أفريقيا',
    note: '',
    slugs: ['egypt-fuel-prices', 'morocco-fuel-prices', 'algeria-fuel-prices', 'tunisia-fuel-prices'],
  },
  {
    code: 'levant',
    name: 'المشرق العربي',
    note: '',
    slugs: ['jordan-fuel-prices', 'iraq-fuel-prices', 'lebanon-fuel-prices'],
  },
  {
    code: 'compare',
    name: 'مقارنة شاملة',
    note: 'كل الدول جنباً إلى جنب في صفحة واحدة.',
    slugs: ['compare'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'كيف أختار الدولة التي أريد معرفة سعر الوقود فيها؟',
    answer: 'اختر دولتك من المجموعة المناسبة أعلاه (الخليج، شمال أفريقيا، أو المشرق العربي) للوصول مباشرة إلى صفحتها المخصصة، وفيها كل الأنواع المتوفرة (بنزين بدرجاته وديزل) مع مقارنة بالقراءة السابقة ومصدر الإعلان الرسمي.',
  },
  {
    question: 'ما الفرق بين صفحة كل دولة وصفحة المقارنة الشاملة؟',
    answer: 'صفحة كل دولة تعطيك تفاصيل كاملة عن دولتك فقط: كل الأنواع، آلية التسعير، ومن يحدد السعر. صفحة المقارنة الشاملة تعرض كل الدول الـ13 في بطاقات جنباً إلى جنب لمن يريد استعراضاً سريعاً بلا تنقل بين صفحات منفصلة.',
  },
  {
    question: 'هل الأسعار هنا محدّثة تلقائياً بلا تدخل يدوي؟',
    answer: 'نعم — كل صفحة هنا تُحدَّث تلقائياً من مصدر مباشر، وتوضح بجانب السعر إن كانت البيانات مباشرة الآن أو آخر تحديث مؤكد تعذّر تجديده مباشرة. لا يوجد رقم يُدخَل يدوياً في هذه الصفحات.',
  },
  {
    question: 'هل يمكنني حفظ هذه الصفحة والرجوع إليها كل أسبوع؟',
    answer: 'هذا بالضبط الهدف منها — احفظ صفحة دولتك كمرجع دائم بدل البحث من جديد كل مرة. الجدول والمؤشر (▲/▼) يوضحان لك فوراً إن تغير السعر منذ آخر زيارة.',
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
  title: 'أسعار الوقود اليوم — البنزين والديزل في 13 دولة عربية',
  description:
    'سعر لتر البنزين والديزل اليوم في السعودية والإمارات والكويت وقطر والبحرين وعُمان ومصر والمغرب والأردن والجزائر وتونس والعراق ولبنان — كل دولة بصفحتها الخاصة، محدثة تلقائياً من مصدر مباشر.',
  keywords: [
    'اسعار الوقود اليوم',
    'سعر البنزين اليوم',
    'اسعار البنزين في الدول العربية',
    'اسعار الوقود في دول الخليج',
    'سعر الديزل اليوم',
    'مقارنة اسعار البنزين',
  ],
  url: `${SITE_URL}/tools/fuel-prices`,
});

export default function FuelPricesCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'أسعار الوقود', item: `${SITE_URL}/tools/fuel-prices` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أسعار الوقود في الدول العربية',
    url: `${SITE_URL}/tools/fuel-prices`,
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

      <ToolTopAdSlot slotId="top-fuel-prices-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M14 21V8a1 1 0 0 1 1-1h1M3 21h11M5 21V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17M16 9h1.5a1.5 1.5 0 0 1 1.5 1.5V17a1.5 1.5 0 0 0 3 0v-6l-3-3" />
              </svg>
            </span>
            <h1>أسعار الوقود اليوم في الدول العربية</h1>
          </div>
          <p>
            سعر لتر البنزين والديزل، لحظة بلحظة، لكل دولة بصفحتها الخاصة — بلا حاجة للبحث من جديد كل
            مرة. اختر دولتك أدناه، أو افتح المقارنة الشاملة لعرض كل الدول معاً.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> صفحة</span>
            <span><b>13</b> دولة عربية</span>
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
