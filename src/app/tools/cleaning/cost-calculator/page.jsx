import Link from 'next/link';

import CleaningCostCalculator from '@/components/calculators/CleaningCostCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getCleaningPageContent } from '@/lib/calculators/cleaning-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cleaning-cost-calculator');
const CONTENT = getCleaningPageContent('cost-calculator');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['cleaning-quote-generator', 'cleaning-deep-clean-checker', 'cleaning-water-tank-tracker']);

const TOC_ITEMS = [
  ['cleaning-cost-guide', 'ما الذي يحدد سعر تنظيف منزلك فعلياً؟'],
  ['cleaning-cost-faq', 'الأسئلة الشائعة'],
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

export default function CleaningCostCalculatorPage() {
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
    about: ['تكلفة تنظيف المنزل', 'كم سعر تنظيف الشقة بالمتر'],
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

      <ToolTopAdSlot slotId="top-cleaning-cost" />
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
          <ToolInArticleAd slotId="mobile-cleaning-cost" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="cleaning-cost-guide">
            <h2>ما الذي يحدد سعر تنظيف منزلك فعلياً؟</h2>
            <p>
              أكبر خطأ عند مقارنة عروض التنظيف: مقارنة رقم إجمالي واحد دون معرفة ما الذي يشمله.
              السعر الحقيقي يتحدد بثلاثة عوامل مجتمعة: <strong>المساحة</strong> (كل متر إضافي وقت
              عمل إضافي)، <strong>نوع التنظيف</strong> (العميق يحتاج ضعف الوقت تقريباً مقارنة
              بالعادي)، و<strong>التكرار</strong> (الاتفاق الدوري يقلل سعر الزيارة الواحدة). هذا
              بالضبط ما تحسبه الأداة أعلاه بشكل منفصل وواضح، بدل رقم واحد غامض.
            </p>
            <PlainBlock eyebrow="لماذا التنظيف العميق أغلى بكثير؟" title="الوقت هو الفارق، لا المواد">
              التنظيف العادي يغطي الأسطح الظاهرة فقط. التنظيف العميق يضيف خلف الأثاث والأجهزة،
              الزوايا والسقوف، وأحياناً غسيل مفصّل للمطبخ والحمامات بالكامل — عمل يستهلك ضعف الوقت
              تقريباً لنفس المساحة، ولهذا يرتفع السعر بنسبة مماثلة، وليس لأن المواد المستخدمة أغلى.
            </PlainBlock>
            <PlainBlock eyebrow="لماذا يختلف السعر بين شركة وأخرى لنفس المساحة؟" title="اطلب دائماً تفصيل البنود">
              شركتان قد تعرضان رقمين مختلفين لنفس المساحة لأن إحداهما تحسب عدد ساعات عمل أطول أو
              تُدخل عمالاً أكثر. اطلب دائماً معرفة عدد العمال والساعات المقدّرة، لا الرقم الإجمالي
              وحده — استخدم النطاق الذي تعطيه الحاسبة أعلاه كمرجع عادل لمقارنة العروض.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-cleaning-cost" />

          <section id="cleaning-cost-faq">
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
            <section id="cleaning-cost-sources">
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
            <CleaningCostCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في التنظيف" />
        </div>
      </div>
    </main>
  );
}
