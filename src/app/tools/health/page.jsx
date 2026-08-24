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
    throw new Error(`health hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Built 2026-08-04 to fix a real, concrete gap: these tools were already live but had ZERO hub
// card anywhere in /tools — undiscoverable by browsing, and the old /calculators/health hub-index
// page was broken (seo:validate flagged it, unregistered in the sitemap manifest). Only tools
// that survived a real competitive audit are FEATURED here — see
// keyword-research/health-education-hubs/DECISION.md for the full per-tool SERP check.
// bmi/calories/fasting/ovulation were EXCLUDED from featuring/new investment (dominated by
// webteb.com/altibbi.com/real hospitals/government health ministries — not winnable), but per an
// owner directive 2026-08-05 ("no /calculators path should exist at all") they were still
// relocated here from the retired /calculators/* tree and listed in a real group below — that's
// a URL/discoverability move, not a redesign/content investment decision.
const FEATURED_SLUGS = ['weaning-schedule', 'pregnancy', 'hijri'];

const TYPE_GROUPS = [
  {
    code: 'motherhood',
    name: 'الحمل والرضاعة',
    note: 'حاسبات مبنية على مصادر طبية رسمية (WHO، اليونيسف، AAP) لا تقدير عام.',
    slugs: ['pregnancy', 'pregnancy-weeks', 'weaning-schedule'],
  },
  {
    code: 'age-time',
    name: 'العمر والوقت',
    note: 'العمر بالهجري والميلادي، وفرق العمر، وزوايا ممتعة — من صفحة واحدة واضحة.',
    slugs: ['age-calculator', 'hijri', 'difference', 'birth-day', 'milestones', 'countdown', 'planets', 'retirement', 'date-add-subtract', 'hijri-birthday'],
  },
  {
    code: 'daily-health',
    name: 'صحة يومية',
    note: '',
    slugs: ['bmi', 'calories', 'fasting', 'ovulation'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'أنا حامل وأريد معرفة موعد الولادة المتوقع — من أين أبدأ؟',
    answer: 'حاسبة الحمل تعطيك موعد الولادة التقريبي وتتبع أسبوع الحمل بناءً على تاريخ آخر دورة، مبنية على نفس الطريقة المعتمدة طبياً. تذكّري أن الرقم تقديري دائماً — طبيبتك المتابعة لحملك هي المرجع الدقيق لموعدك الفعلي.',
  },
  {
    question: 'متى أبدأ إدخال الأطعمة الصلبة لطفلي؟',
    answer: 'جدول تغذية الرضيع يوضح لك التوقيت والمراحل المعتمدة من منظمات صحية دولية (كمنظمة الصحة العالمية ومنظمة اليونيسف)، مع ترتيب منطقي لإدخال الأطعمة تدريجياً. استشيري طبيب طفلك دائماً قبل أي تغيير في نظامه الغذائي، خصوصاً إن كان لديه حساسية معروفة.',
  },
  {
    question: 'ما الفرق بين عمري بالميلادي وعمري بالهجري؟',
    answer: 'السنة الهجري القمرية أقصر من السنة الميلادية بنحو 11 يوماً، فيتراكم الفرق مع الوقت ليصبح عمرك الهجري رقماً مختلفاً فعلياً عن عمرك الميلادي، لا مجرد تسمية أخرى لنفس الرقم. احسب عمرك بالتقويمين معاً في حاسبة العمر الهجري لترى الفرق الحقيقي بنفسك.',
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
  title: 'حاسبات الصحة والحمل والعمر بالعربي',
  description: 'حاسبات الحمل وجدول تغذية الرضيع بالهجري والميلادي، وحاسبات العمر والوقت — مبنية على مصادر طبية رسمية لا تقدير عام.',
  keywords: [
    'حاسبات صحية',
    'حاسبة الحمل',
    'حاسبة اسابيع الحمل',
    'حاسبة التبويض',
    'حاسبة السعرات الحرارية',
    'حاسبة مؤشر كتلة الجسم',
  ],
  url: `${SITE_URL}/tools/health`,
});

export default function HealthCategoryHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الصحة والعمر', item: `${SITE_URL}/tools/health` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات الصحة والحمل والعمر',
    url: `${SITE_URL}/tools/health`,
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

      <ToolTopAdSlot slotId="top-health-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
              </svg>
            </span>
            <h1>الصحة والحمل والعمر</h1>
          </div>
          <p>
            من موعد الولادة وجدول تغذية الرضيع إلى عمرك بالهجري وفرق العمر — كل حاسبة هنا مبنية
            على مصدر طبي أو حسابي حقيقي، لا تقدير عام.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> حاسبة مرتبطة مباشرة</span>
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
