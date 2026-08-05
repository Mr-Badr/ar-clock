import Link from 'next/link';

import SqftSqmConverter from '@/components/calculators/SqftSqmConverter.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { COMMON_SQFT_VALUES, fmt, sqftToSqm } from '@/lib/calculators/building/constants';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'sqft-sqm-converter');
const CONTENT = getConstructionPageContent('sqft-sqm-converter');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['building', 'rebar', 'cement']);

const TOC_ITEMS = [
  ['sqft-sqm-guide', 'القدم المربع والمتر المربع — الفرق ومتى تحتاج التحويل'],
  ['sqft-sqm-table', 'جدول تحويل جاهز لأكثر القيم بحثاً'],
  ['sqft-sqm-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

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

export default function SqftSqmConverterPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['تحويل قدم مربع الى متر مربع', 'وحدات المساحة'],
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

      <ToolTopAdSlot slotId="top-sqft-sqm" />
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
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-sqft-sqm" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="sqft-sqm-guide">
            <h2>القدم المربع والمتر المربع — الفرق ومتى تحتاج التحويل</h2>
            <p>
              المتر المربع هو وحدة المساحة الرسمية في السعودية وأغلب دول الخليج، بينما تظهر القدم
              المربع أحياناً في إعلانات عقارية دولية أو مخططات مستوردة. معامل التحويل ثابت ودقيق:
              1 قدم مربع = 0.09290304 متر مربع بالضبط — وليس تقريباً.
            </p>
          </section>

          <section id="sqft-sqm-table">
            <h2>جدول تحويل جاهز لأكثر القيم بحثاً</h2>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>قدم مربع</th><th>متر مربع</th></tr>
                </thead>
                <tbody>
                  {COMMON_SQFT_VALUES.map((sqft) => (
                    <tr key={sqft}>
                      <td>{fmt(sqft)}</td>
                      <td>{fmt(sqftToSqm(sqft), 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-sqft-sqm" />

          <section id="sqft-sqm-faq">
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
            <section id="sqft-sqm-sources">
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

          <section id="sqft-sqm-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/sqft-sqm-converter`}
              title="محول قدم مربع ومتر مربع"
              hint="هل تدير موقعاً عقارياً أو منتدى؟ أضف محول القدم والمتر المربع إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={420}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <SqftSqmConverter />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
