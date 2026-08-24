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
    throw new Error(`ecommerce hub: no CALCULATOR_ROUTES entry for slug "${slug}"`);
  }
  return route;
}

// Wave 1 — see keyword-research/ecommerce-hub/DECISION.md. Chosen after direct-web-research
// rejected a general HR hub (ksatools.com's real sitemap shows a mature, comprehensive
// /tools/hr-and-payroll + /tools/templates-and-generators catalog, 18 tools total) — this hub
// instead targets what ksatools' own /tools/ecommerce category (only 4 generic tools) does NOT
// cover: ZATCA Phase-2 compliance (Saudi-only per the standing gov-tool targeting rule) and
// platform-fee-aware profit/shipping tools.
const FEATURED_SLUGS = ['zatca-eligibility', 'store-profit-margin', 'zatca-qr-explainer'];

const TYPE_GROUPS = [
  {
    code: 'zatca',
    name: 'الفوترة الإلكترونية (زاتكا)',
    note: 'تحقق من التزامك، وافهم ماذا تحمل فاتورتك فعلياً.',
    slugs: ['zatca-eligibility', 'zatca-qr-explainer'],
  },
  {
    code: 'store',
    name: 'إدارة المتجر',
    note: 'أرقام حقيقية بعد رسوم منصتك، لا تقديراً عاماً.',
    slugs: ['store-profit-margin', 'shipping-cost-comparison'],
  },
];

const FAQ_ITEMS = [
  {
    question: 'كيف أعرف إن كان متجري مشمولاً بمرحلة الربط والتكامل مع زاتكا؟',
    answer: 'الشمول يعتمد على إيراداتك السنوية الخاضعة للضريبة ومقارنتها بعتبة الموجة الحالية — أدخل رقم إيراداتك في محقق الأهلية لمعرفة موقفك فوراً بدل الانتظار حتى يصلك إشعار رسمي قد يكون متأخراً.',
  },
  {
    question: 'لماذا هامش ربحي على الورق أعلى من الرقم الفعلي في حسابي البنكي؟',
    answer: 'لأن عمولة المنصة (سلة أو زد) ورسوم بوابة الدفع وتكلفة الشحن تُخصم قبل أن يصلك المبلغ، وأغلب أصحاب المتاجر يحسبون هامشهم من سعر البيع فقط دون طرح هذه الرسوم. احسب هامشك الحقيقي بعد كل الخصومات في الأداة لمعرفة ربحك الفعلي لكل عملية بيع.',
  },
  {
    question: 'كيف أتحقق أن فاتورة استلمتها من مورد أو أصدرها متجري صحيحة فعلاً؟',
    answer: 'كود QR في أي فاتورة ضريبية سعودية يحمل بيانات أساسية (اسم البائع، الرقم الضريبي، التاريخ، الإجمالي) يمكن التحقق منها مباشرة دون تطبيق خارجي — استخدم أداة فحص كود QR لقراءة محتوى الفاتورة والتأكد من مطابقتها للمذكور عليها ورقياً.',
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
  title: 'أدوات التجارة الإلكترونية — زاتكا، هامش الربح، والشحن',
  description:
    'أدوات مجانية لأصحاب المتاجر الإلكترونية في السعودية: تحقق من أهليتك لمرحلة زاتكا الثانية، افهم كود QR لفاتورتك، احسب هامش ربحك الحقيقي بعد عمولة سلة أو زد، وقارن شركات الشحن.',
  keywords: [
    'ادوات التجارة الالكترونية',
    'اهلية زاتكا المرحلة الثانية',
    'كود qr الفاتورة الضريبية',
    'حاسبة هامش ربح متجر سلة',
    'حاسبة هامش ربح متجر زد',
    'مقارنة شركات الشحن',
    'ادوات المتاجر الالكترونية السعودية',
  ],
  url: `${SITE_URL}/tools/ecommerce`,
});

export default function EcommerceHubPage() {
  const allListedSlugs = new Set(TYPE_GROUPS.flatMap((g) => g.slugs));
  const toolCount = allListedSlugs.size;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التجارة الإلكترونية', item: `${SITE_URL}/tools/ecommerce` },
    ],
  };
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'أدوات التجارة الإلكترونية',
    url: `${SITE_URL}/tools/ecommerce`,
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

      <ToolTopAdSlot slotId="top-ecommerce-hub" />

      <div className="container mx-auto px-4 tool-v2-hub-content">
        <div className="tool-v2-cat-hero">
          <div className="tool-v2-cat-hero-top">
            <span className="tool-v2-cat-ic" aria-hidden="true">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M3 6h18l-2 11H5L3 6ZM3 6 2 3H0M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
              </svg>
            </span>
            <h1>أدوات التجارة الإلكترونية</h1>
          </div>
          <p>
            من التزامك مع زاتكا إلى هامش ربحك الفعلي واختيار شركة الشحن — كل ما يحتاجه صاحب المتجر
            الإلكتروني السعودي في مكان واحد، ببيانات حقيقية لا تقديراً عاماً.
          </p>
          <div className="tool-v2-cat-meta">
            <span><b>{toolCount}</b> أدوات مرتبطة مباشرة</span>
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
