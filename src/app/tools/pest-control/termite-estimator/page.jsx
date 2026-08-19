import Link from 'next/link';

import TermiteCostEstimator from '@/components/calculators/TermiteCostEstimator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPestControlPageContent } from '@/lib/calculators/pest-control-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pest-control-termite-estimator');
const CONTENT = getPestControlPageContent('termite-estimator');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['pest-control-cost-estimator', 'pest-control-contract-checker', 'pest-control-dosage-calculator']);

const TOC_ITEMS = [
  ['termite-guide', 'لماذا يُحسب النمل الأبيض بالمتر الطولي لا بالمساحة'],
  ['termite-faq', 'الأسئلة الشائعة'],
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

// Same ratePerMeter values used by TermiteCostEstimator.client.jsx's METHODS array (soil=40,
// bait=55, fumigation=65) — shown here relative to each other, not a separately invented scale.
const METHOD_BARS = [
  { label: 'حقن التربة', rate: 40, colorVar: '--green-text' },
  { label: 'محطات الطعوم', rate: 55, colorVar: '--amber-text' },
  { label: 'التبخير', rate: 65, colorVar: '--red-text' },
];
const METHOD_MAX = 65;

function TermiteMethodChart() {
  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>مقارنة سريعة بين طرق المعالجة الثلاث</h3>
        <p>السعر النسبي لكل متر طولي من محيط الأساس — حقن التربة الأسرع والأوفر، التبخير الأعلى تكلفة وللإصابات الشديدة فقط.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {METHOD_BARS.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.rate / METHOD_MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">{row.rate}/م</span>
          </div>
        ))}
      </div>
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

export default function TermiteEstimatorPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مكافحة الحشرات', item: `${SITE_URL}/tools/pest-control` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['مكافحة النمل الابيض', 'تكلفة علاج النمل الابيض'],
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

      <ToolTopAdSlot slotId="top-termite-cost" />
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
          <ToolInArticleAd slotId="mobile-termite-cost" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="termite-guide">
            <h2>لماذا يُحسب النمل الأبيض بالمتر الطولي لا بالمساحة</h2>
            <p>
              النمل الأبيض يدخل المبنى غالباً عبر التربة المحيطة بالأساس، لا عبر الأسطح الداخلية —
              لهذا تركّز المعالجة الفعالة (حقن التربة أو محطات الطعوم) على محيط أساس المبنى بالمتر
              الطولي، بخلاف رش الحشرات العامة الذي يُسعَّر بمساحة العقار الداخلية. هذا فرق جوهري في
              طريقة الحساب، وهو ما تطبّقه الحاسبة أعلاه تلقائياً.
            </p>
            <PlainBlock eyebrow="لا تعرف محيط أساس مبناك؟" title="احسبه من الطول والعرض">
              إن كان مبناك مستطيل الشكل تقريباً، أدخل الطول والعرض التقريبيين في الأداة أعلاه
              وستحسب المحيط تلقائياً بالمعادلة: 2 × (الطول + العرض).
            </PlainBlock>
            <PlainBlock eyebrow="أي طريقة تختار؟" title="حقن التربة الأسرع، الطعوم الأشمل">
              حقن التربة يمنع دخول نمل جديد بسرعة وتكلفة أقل نسبياً. الطعوم أبطأ لكنها تستهدف
              القضاء على المستعمرة بالكامل بمرور الوقت. التبخير يُحجز عادة للإصابات الشديدة داخل
              الهيكل الخشبي نفسه. قارن نطاق التكلفة الفعلي للثلاثة معاً في جدول النتيجة أدناه.
            </PlainBlock>
            <TermiteMethodChart />
          </section>

          <ToolInArticleAd slotId="mid-termite-cost" />

          <section id="termite-faq">
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
            <section id="termite-sources">
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
            <TermiteCostEstimator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في مكافحة الحشرات" />
        </div>
      </div>
    </main>
  );
}
