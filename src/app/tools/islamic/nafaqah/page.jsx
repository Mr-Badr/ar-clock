import NafaqahTool from '@/components/calculators/gulf-finance/NafaqahTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { ReferenceGrid } from '@/components/tools-v2/ReferenceGrid';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'nafaqah');
const CONTENT = getFinancePageContent('nafaqah');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

// Same limits applied by NafaqahTool.client.jsx after deducting fixed monthly obligations.
const NAFAQAH_LIMITS = [
  { value: 'النطاق المعتاد', meta: '10%-20% من الدخل المتاح' },
  { value: 'الحد الأقصى للحالات الخاصة', meta: '25% من الدخل المتاح' },
  { value: 'الحد الأدنى لكل مستحق', meta: '300 ريال شهرياً' },
  { value: 'السقف الإجمالي', meta: '50% من دخل المنفق' },
];

const TOC_ITEMS = [
  ['nafaqah-guide', 'كيف يقدَّر مبلغ النفقة فعلياً؟'],
  ['nafaqah-faq', 'الأسئلة الشائعة'],
  ['nafaqah-sources', 'مصادر رسمية'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function NafaqahPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الأدوات الإسلامية', item: `${SITE_URL}/tools/islamic` },
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

      <ToolTopAdSlot slotId="top-nafaqah" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-nafaqah" /></div>

        <article className="tool-v2-lane-article">
          <section id="nafaqah-guide">
            <h2>كيف يقدَّر مبلغ النفقة فعلياً؟</h2>
            <p>
              تُقدَّر نفقة الطفل الواحد عادة بين 10% و20% من الدخل المتاح للمنفق، وقد تصل إلى 25% في
              بعض الحالات. الحد الأدنى المعلن لكل مستحق (زوجة أو طفل) هو 300 ريال شهرياً، ولا يجوز
              أن يتجاوز إجمالي النفقة 50% من دخل المنفق — الأداة تطبق الحدين تلقائياً بعد خصم
              الالتزامات الشهرية الثابتة من الدخل. القاضي هو من يحدد المبلغ النهائي فعلياً؛ هذه
              الأداة تعطيك نطاقاً تقريبياً للتخطيط فقط.
            </p>
            <ReferenceGrid items={NAFAQAH_LIMITS} />
          </section>

          <ToolInArticleAd slotId="mid-nafaqah" />

          <section id="nafaqah-faq">
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
            <section id="nafaqah-sources">
              <h2>مصادر رسمية</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><NafaqahTool /></div>
        </div>
      </div>
    </main>
  );
}
