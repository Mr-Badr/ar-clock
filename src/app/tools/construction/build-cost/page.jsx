import Link from 'next/link';

import BuildCostCalculator from '@/components/calculators/BuildCostCalculator.client';
import BuildCostFinishChart from '@/components/calculators/BuildCostFinishChart.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { FINISH_LEVELS } from '@/lib/calculators/building/constants';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'building');
const CONTENT = getConstructionPageContent('build-cost');
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

const RELATED_TOOLS = pickTools(['rebar', 'cement', 'sqft-sqm-converter', 'tiles', 'building-paint']);

const TOC_ITEMS = [
  ['build-cost-guide', 'كيف تُحسب التكلفة، وما الذي يغيّر الرقم؟'],
  ['build-cost-stages', 'مراحل العمل ونطاق السعر لكل مرحلة'],
  ['build-cost-scope', 'ما الذي لا تشمله هذه الحاسبة؟'],
  ['build-cost-faq', 'الأسئلة الشائعة'],
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

export default function BuildCostToolPage() {
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
    about: ['تكلفة البناء', 'سعر متر البناء', 'تكلفة بناء فيلا الخليج'],
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

      <ToolTopAdSlot slotId="top-build-cost" />
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
          <ToolInArticleAd slotId="mobile-build-cost" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="build-cost-guide">
            <h2>كيف تُحسب التكلفة، وما الذي يغيّر الرقم؟</h2>
            <p>
              تكلفة البناء تعتمد على خمسة عوامل رئيسية: الدولة (الفرق بين السعودية والإمارات وحده
              يمكن أن يضاعف السعر أكثر من مرتين)، المساحة وعدد الأدوار، مرحلة العمل (عظم فقط أو مع
              تشطيب أو تسليم مفتاح)، المدينة داخل الدولة نفسها (الرياض وجدة ومكة تختلف عن بعضها، وكذلك
              دبي وأبوظبي والشارقة)، ونوع المبنى (فيلا أم شقة أم تجاري). الحاسبة أعلاه تجمع هذه
              العوامل الخمسة معاً وتعطيك نطاقاً سعرياً واقعياً بدل رقم واحد وهمي الدقة.
            </p>

            <BuildCostFinishChart />

            <div className="tool-v2-tip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
              <span>النتيجة نطاق سعري (حد أدنى وحد أقصى) وليست رقماً واحداً — لأن أسعار المواد والعمالة تتغير، ولأن كل مشروع له تفاصيله.</span>
            </div>

            <PlainBlock eyebrow="الأكثر تأثيراً على السعر" title="الدولة أولاً، ثم مرحلة العمل">
              فيلا بتشطيب عادي في دبي تكلّف تقريباً ضعف نفس الفيلا في الرياض للمتر المربع الواحد —
              اختر دولتك أولاً في الحاسبة قبل أي مقارنة. بعدها، الفرق بين "عظم فقط" و"تسليم مفتاح"
              يمكن أن يضاعف التكلفة الإجمالية 2-3 مرات إضافية. حدّد بدقة ما تحتاجه فعلاً قبل مقارنة
              عروض المقاولين — كثير من الالتباس يحدث عندما يقارن شخص عرض "عظم" بعرض "تسليم مفتاح"
              على أنهما نفس الشيء.
            </PlainBlock>
            <PlainBlock eyebrow="لا تنسها عند طلب عرض السعر" title="المدينة تغيّر السعر أيضاً">
              داخل كل دولة، العاصمة أو المدن الكبرى عادة أعلى تكلفة من المدن الأصغر بسبب أسعار
              الأراضي والعمالة المحلية — مكة المكرمة والمدينة المنورة وجدة أعلى من الدمام أو الطائف
              في السعودية، وأبوظبي أعلى قليلاً من الشارقة أو عجمان في الإمارات. اختر مدينتك في
              الحاسبة أعلاه لتعديل النطاق تلقائياً.
            </PlainBlock>
          </section>

          <section id="build-cost-stages">
            <h2>مراحل العمل ونطاق السعر لكل مرحلة</h2>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>المرحلة</th><th>ماذا تشمل؟</th></tr>
                </thead>
                <tbody>
                  {FINISH_LEVELS.map((f) => (
                    <tr key={f.key}>
                      <td>{f.label}</td>
                      <td>{f.subLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <details className="tool-v2-collapse">
            <summary>
              <h2 id="build-cost-scope">ما الذي لا تشمله هذه الحاسبة؟</h2>
              <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="tool-v2-collapse-body">
              <p>هذه الحاسبة تقديرية استرشادية لا تشمل:</p>
              <ul>
                <li><strong>سعر الأرض</strong> — التكلفة هنا للبناء فقط، لا تشمل شراء الأرض.</li>
                <li><strong>رسوم الرخص والاشتراكات</strong> — رخصة البناء، اشتراك الكهرباء والمياه، وأي رسوم بلدية.</li>
                <li><strong>تصاميم معمارية معقدة</strong> — الأشكال غير المعتادة أو الأرض الصعبة (منحدرة، صخرية) ترفع التكلفة عن النطاق المعروض.</li>
              </ul>
              <p>راجع مقاولاً مرخصاً لعرض سعر نهائي دقيق يشمل مخططك الفعلي.</p>
            </div>
          </details>

          <ToolInArticleAd slotId="mid-build-cost" />

          <section id="build-cost-faq">
            <h2>الأسئلة الشائعة عن تكلفة البناء</h2>
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
            <section id="build-cost-sources">
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

          <section id="build-cost-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/build-cost`}
              title="حاسبة تكلفة البناء"
              hint="هل تدير موقعاً عقارياً أو منتدى؟ أضف حاسبة تكلفة البناء إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <BuildCostCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
