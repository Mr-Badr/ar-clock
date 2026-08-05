import Link from 'next/link';

import ArtificialGrassCalculator from '@/components/calculators/ArtificialGrassCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getLandscapingPageContent } from '@/lib/calculators/landscaping-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-artificial-grass');
const CONTENT = getLandscapingPageContent('artificial-grass');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: CONTENT.faqItems });

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['landscaping-garden-cost', 'landscaping-garden-gravel', 'landscaping-quote-generator']);

const TOC_ITEMS = [
  ['grass-guide', 'عشب طبيعي أم صناعي — أيهما أنسب لحديقتك؟'],
  ['grass-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

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
            {index === 0 ? <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg></span> : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function ArtificialGrassCalculatorPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'تنسيق الحدائق', item: `${SITE_URL}/tools/landscaping` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({ siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description, about: ['حاسبة العشب الصناعي', 'عشب صناعي سعر المتر'], keywords: SEARCH_COVERAGE.metadataKeywords });
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-artificial-grass" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-artificial-grass" /></div>

        <article className="tool-v2-lane-article">
          <section id="grass-guide">
            <h2>عشب طبيعي أم صناعي — أيهما أنسب لحديقتك؟</h2>
            <p>
              في مناخ الخليج الحار تحديداً، الفرق ليس فقط بصرياً. العشب الطبيعي يبرّد المكان
              طبيعياً ويحتاج ري يومي شبه ثابت طوال السنة، بينما العشب الصناعي لا يحتاج ماء إطلاقاً
              ويبقى أخضراً حتى في أشد أشهر الصيف حرارة، مقابل تكلفة تركيب أولى أعلى.
            </p>
            <PlainBlock eyebrow="الخطأ الأشيع عند شراء العشب الصناعي" title="تجاهل نسبة الهدر">
              كثيرون يشترون بالضبط مساحة الأرض المقاسة، فيكتشفون لاحقاً نقصاً عند القص للزوايا أو
              محاذاة اتجاه الألياف بين اللفات. هامش 10% الافتراضي في الحاسبة أعلاه يحل هذه المشكلة
              من البداية.
            </PlainBlock>
            <PlainBlock eyebrow="لماذا عرض اللفة يهم" title="عرض أكبر يعني لحاماً أقل">
              لفات 4 أمتار تقلل عدد خطوط اللحام الظاهرة مقارنة بلفات 2 متر لنفس المساحة — مهم
              بصرياً خصوصاً في المساحات المستطيلة الواسعة والمكشوفة للنظر من زاوية واحدة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-artificial-grass" />

          <section id="grass-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="grass-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><ArtificialGrassCalculator /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في تنسيق الحدائق" />
        </div>
      </div>
    </main>
  );
}
