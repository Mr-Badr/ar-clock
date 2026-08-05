import Link from 'next/link';

import GypsumBoardCalculator from '@/components/calculators/GypsumBoardCalculator.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { GYPSUM_BOARD_SIZES, GYPSUM_WASTE_LEVELS } from '@/lib/calculators/building/constants';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gypsum-board');
const CONTENT = getConstructionPageContent('gypsum-board');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['tiles', 'building-paint', 'building']);

const TOC_ITEMS = [
  ['gypsum-guide', 'مقاس اللوح ونسبة الهدر — كيف نحسبها؟'],
  ['gypsum-faq', 'الأسئلة الشائعة'],
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

export default function GypsumBoardToolPage() {
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
    about: ['حساب كمية الجبس بورد', 'عدد ألواح السقف المعلق', 'نسبة هدر الجبس بورد'],
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

      <ToolTopAdSlot slotId="top-gypsum-board" />
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
          <ToolInArticleAd slotId="mobile-gypsum-board" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="gypsum-guide">
            <h2>مقاس اللوح ونسبة الهدر — كيف نحسبها؟</h2>
            <p>
              المقاس القياسي في السعودية والخليج هو 120×240 سم (2.88 متر مربع للوح الواحد). نسبة
              الهدر تختلف حسب تعقيد الغرفة — غرفة مستطيلة بسيطة تحتاج هدراً أقل من غرفة بها فتحات
              إضاءة وزوايا كثيرة، لأن كل قصة إضافية عند حافة أو فتحة تعني جزءاً من اللوح لا يُستخدم.
            </p>

            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>مقاس اللوح</th><th>المساحة لكل لوح</th></tr>
                </thead>
                <tbody>
                  {GYPSUM_BOARD_SIZES.map((s) => (
                    <tr key={s.label}>
                      <td>{s.label}</td>
                      <td>{s.area} م²</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tool-v2-table-wrap" style={{ marginTop: 'var(--space-4)' }}>
              <table className="tool-v2-table">
                <thead>
                  <tr><th>نوع الغرفة</th><th>نسبة الهدر</th></tr>
                </thead>
                <tbody>
                  {GYPSUM_WASTE_LEVELS.map((w) => (
                    <tr key={w.key}>
                      <td>{w.label}</td>
                      <td>{Math.round(w.waste * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-gypsum-board" />

          <section id="gypsum-faq">
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
            <section id="gypsum-sources">
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

          <section id="gypsum-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/gypsum-board`}
              title="حاسبة كمية الجبس بورد"
              hint="هل تدير موقعاً هندسياً أو منتدى؟ أضف حاسبة الجبس بورد إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={520}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <GypsumBoardCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
