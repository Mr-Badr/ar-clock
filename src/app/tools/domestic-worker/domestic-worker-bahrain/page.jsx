import Link from 'next/link';

import BahrainDomesticWorkerCostCalculator from '@/components/calculators/BahrainDomesticWorkerCostCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import { BAHRAIN_PERMIT_FEES } from '@/lib/calculators/domestic-worker-engine';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'domestic-worker-cost-bahrain');
const CONTENT = getFinancePageContent('domestic-worker-cost-bahrain');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['dwb-guide', 'جدول رسوم تصريح العمل الرسمي (LMRA)'],
  ['dwb-faq', 'الأسئلة الشائعة'],
  ['dwb-related', 'نفس الحاسبة في دول خليجية أخرى'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const SIBLING_TOOLS = pickTools([
  'domestic-worker-cost', 'domestic-worker-cost-uae', 'domestic-worker-cost-kuwait',
  'domestic-worker-cost-qatar', 'domestic-worker-cost-oman',
]);

export default function DomesticWorkerCostBahrainPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الاستقدام والعمالة المنزلية', item: `${SITE_URL}/tools/domestic-worker` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-dw-bahrain" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-dw-bahrain" /></div>

        <article className="tool-v2-lane-article">
          <section id="dwb-guide">
            <h2>جدول رسوم تصريح العمل الرسمي (LMRA)</h2>
            <p>
              على عكس أغلب دول الخليج، البحرين تنشر جدول رسوم شاملاً ودقيقاً لكل حالة — لا حاجة
              لتخمين أو تجميع بنود متفرقة يدوياً.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>نوع الطلب والمدة</th><th>الرسم الإجمالي</th></tr></thead>
                <tbody>
                  {Object.values(BAHRAIN_PERMIT_FEES).map((p) => (
                    <tr key={p.label}><td>{p.label}</td><td>{p.fee} د.ب</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-dw-bahrain" />

          <section id="dwb-faq">
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
            <section id="dwb-sources">
              <h2>مصادر رسمية</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}

          <section id="dwb-related">
            <h2>نفس الحاسبة في دول خليجية أخرى</h2>
            <p>الرسوم والشروط تختلف فعلياً من دولة لأخرى — اختر بلدك:</p>
            <nav className="tool-v2-related-grid" aria-label="حاسبات دول أخرى">
              {SIBLING_TOOLS.map((tool) => (
                <Link key={tool.slug} href={tool.href}>
                  <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                  {tool.shortLabel || tool.title}
                </Link>
              ))}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><BahrainDomesticWorkerCostCalculator /></div>
        </div>
      </div>
    </main>
  );
}
