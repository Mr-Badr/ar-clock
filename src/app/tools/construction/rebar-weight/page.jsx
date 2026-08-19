import Link from 'next/link';

import RebarWeightCalculator from '@/components/calculators/RebarWeightCalculator.client';
import RebarWeightChart from '@/components/calculators/RebarWeightChart.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { REBAR_DIAMETERS, REBAR_TYPICAL_USE, REBAR_WEIGHT_PER_METER, fmt } from '@/lib/calculators/building/constants';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'rebar');
const CONTENT = getConstructionPageContent('rebar-weight');
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

const RELATED_TOOLS = pickTools(['building', 'sqft-sqm-converter', 'cement']);

const TOC_ITEMS = [
  ['rebar-guide', 'كيف تُحسب المعادلة، ولماذا القطر هو الأهم؟'],
  ['rebar-table', 'جدول أوزان الحديد لكل الأقطار'],
  ['rebar-faq', 'الأسئلة الشائعة'],
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

export default function RebarWeightToolPage() {
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
    about: ['وزن حديد التسليح', 'قطر حديد التسليح', 'أوزان الحديد بالمتر الطولي'],
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

      <ToolTopAdSlot slotId="top-rebar-weight" />
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
          <ToolInArticleAd slotId="mobile-rebar-weight" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="rebar-guide">
            <h2>كيف تُحسب المعادلة، ولماذا القطر هو الأهم؟</h2>
            <p>
              وزن حديد التسليح لا يعتمد على المسافة أو الوزن الكلي مباشرة، بل على القطر أولاً لأن
              القطر مُربَّع في المعادلة — زيادة القطر من 12 إلى 16 ملم ترفع الوزن أكثر بكثير من
              نسبة الزيادة نفسها، لأن 16² أكبر بكثير من 12². لهذا يبدأ أي حساب صحيح بالتأكد من القطر
              الفعلي كما يظهر في المخطط الإنشائي، وليس بتقدير عام.
            </p>

            <RebarWeightChart />

            <FormulaCard
              label="المعادلة التي تحسب وزن المتر الواحد من قطر السيخ:"
              note="تقريب هندسي شائع يتطابق مع الحساب الفيزيائي الدقيق بفارق أقل من 1%."
            >
              <span>الوزن (كجم/م) =</span>
              <Frac num="القطر (مم)²" den="162" />
            </FormulaCard>

            <PlainBlock eyebrow="أشيع خطأ عند الشراء" title="لا تقارن السعر قبل توحيد القطر والطول">
              الخطأ الشائع هو استخدام قطر خاطئ (12 بدل 16 مثلاً) أو نسيان أن المورد يبيع بالطن لا
              بالكيلو. احسب الوزن الدقيق أولاً بالحاسبة أعلاه، ثم حوّله إلى طن قبل طلب عرض السعر أو
              مقارنة الموردين.
            </PlainBlock>
            <PlainBlock eyebrow="الحديد المشرشر مقابل الأملس" title="الفرق في الوزن ضئيل">
              الحديد المشرشر يتمسك بالخرسانة أفضل ويُستخدم غالباً في التسليح الرئيسي للكمرات
              والأعمدة والأسقف. من ناحية الوزن، القطر والطول هما العاملان الأساسيان، فالوزن لنفس
              القطر والطول متقارب حتى لو اختلف شكل السطح.
            </PlainBlock>
          </section>

          <section id="rebar-table">
            <h2>جدول أوزان الحديد لكل الأقطار</h2>
            <p>مرجع سريع لوزن المتر الطولي والاستخدام الشائع لكل قطر تجاري قياسي.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>القطر (ملم)</th><th>وزن المتر (كجم/م)</th><th>وزن سيخ 12م (كجم)</th><th>الاستخدام الشائع</th></tr>
                </thead>
                <tbody>
                  {REBAR_DIAMETERS.map((d) => (
                    <tr key={d}>
                      <td>⌀{d}</td>
                      <td>{fmt(REBAR_WEIGHT_PER_METER[d], 3)}</td>
                      <td>{fmt(REBAR_WEIGHT_PER_METER[d] * 12, 2)}</td>
                      <td>{REBAR_TYPICAL_USE[d]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-rebar-weight" />

          <section id="rebar-faq">
            <h2>الأسئلة الشائعة عن وزن حديد التسليح</h2>
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
            <section id="rebar-sources">
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

          <section id="rebar-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/rebar-weight`}
              title="حاسبة وزن حديد التسليح"
              hint="هل تدير موقعاً هندسياً أو منتدى؟ أضف حاسبة وزن حديد التسليح إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <RebarWeightCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
