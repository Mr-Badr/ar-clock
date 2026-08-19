import { Suspense } from 'react';
import Link from 'next/link';

import CleaningQuoteGenerator from '@/components/calculators/CleaningQuoteGenerator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { ReferenceGrid } from '@/components/tools-v2/ReferenceGrid';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getCleaningPageContent } from '@/lib/calculators/cleaning-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cleaning-quote-generator');
const CONTENT = getCleaningPageContent('quote-generator');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['cleaning-cost-calculator', 'cleaning-deep-clean-checker', 'cleaning-water-tank-tracker']);

// Same service/addon labels used by CleaningCostCalculator.client.jsx's CLEAN_TYPES + ADDONS.
const QUOTE_COMMON_ITEMS = ['تنظيف عادي', 'تنظيف عميق', 'بعد تشطيب أو دهان', 'بعد انتقال (تسليم/استلام)', 'تنظيف سجاد وكنب', 'واجهات زجاجية خارجية', 'تنظيف خزان المياه'].map((value) => ({ value }));

const TOC_ITEMS = [
  ['quote-guide', 'ما الذي يجعل عرض السعر يبدو احترافياً؟'],
  ['quote-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function RelatedToolsCard({ items, heading }) {
  if (!items.length) return null;
  return (
    <aside className="tool-v2-related-card" aria-label="أدوات مشابهة">
      <div className="tool-v2-related-card__head">{heading}</div>
      <nav className="tool-v2-related-card__list">
        {items.map((tool, index) => (
          <Link key={tool.slug} href={tool.href} className={index === 0 ? 'is-featured' : undefined}>
            {index === 0 ? (
              <span className="tool-v2-related-ic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>
              </span>
            ) : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function CleaningQuoteGeneratorPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التنظيف', item: `${SITE_URL}/tools/cleaning` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['عرض سعر تنظيف', 'نموذج عقد تنظيف شهري'],
    keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-cleaning-quote" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>

          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>
              {TOC_ITEMS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-cleaning-quote" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="quote-guide">
            <h2>ما الذي يجعل عرض السعر يبدو احترافياً؟</h2>
            <p>
              الفرق بين عرض سعر يوحي بالثقة وآخر يبدو مرتجلاً ليس التصميم، بل الوضوح: بنود مفصّلة
              بدل رقم واحد، تاريخ ومدة صلاحية واضحين، وشروط دفع مكتوبة صراحة بدل الاعتماد على
              اتفاق شفهي. المولّد أعلاه يبني لك هذا المستند تلقائياً بمجرد تعبئة الحقول.
            </p>
            <p>بنود شائعة تظهر في عروض أسعار التنظيف — أضفها من القائمة الجاهزة في الأداة أعلاه:</p>
            <ReferenceGrid items={QUOTE_COMMON_ITEMS} />
            <PlainBlock eyebrow="اربط الأداتين ببعض" title="من الحاسبة مباشرة إلى عرض السعر">
              إن جئت لهذه الصفحة من حاسبة تكلفة التنظيف، ستجد الرقم الذي حسبته معبّأً تلقائياً في
              أول بند — عدّله أو أضف بنوداً أخرى ثم حمّل المستند مباشرة.
            </PlainBlock>
            <PlainBlock eyebrow="العقد الشهري مختلف عن عرض السعر" title="اختر الوضع المناسب">
              عرض السعر والفاتورة يخدمان زيارة تنظيف واحدة أو مقارنة الأسعار قبل الاتفاق. العقد
              الشهري وثيقة مختلفة تحدد التزاماً مستمراً (عدد الزيارات ومدة العقد وشروط الإنهاء) —
              بدّل بين الوضعين من الأزرار أعلى الأداة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-cleaning-quote" />

          <section id="quote-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    {item.question}
                    <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="quote-sources">
              <h2>مصادر</h2>
              <ul>
                {sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                    {source.description ? ` — ${source.description}` : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <Suspense fallback={<div className="tool-v2-empty-state">جارِ التحميل…</div>}>
              <CleaningQuoteGenerator />
            </Suspense>
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في التنظيف" />
        </div>
      </div>
    </main>
  );
}
