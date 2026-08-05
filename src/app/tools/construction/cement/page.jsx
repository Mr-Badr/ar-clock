import Link from 'next/link';

import CementCalculator from '@/components/calculators/CementCalculator.client';
import ConcreteGradeChart from '@/components/calculators/ConcreteGradeChart.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { MIX_GRADES } from '@/lib/calculators/building/constants';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cement');
const CONTENT = getConstructionPageContent('cement');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
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

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['rebar', 'building', 'tiles']);

const TOC_ITEMS = [
  ['cement-guide', 'الأسمنت ليس هو الخرسانة'],
  ['cement-faq', 'الأسئلة الشائعة'],
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

export default function CementToolPage() {
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
    about: ['حساب كمية الأسمنت', 'خلطة الخرسانة', 'نسب الاسمنت والرمل والحصى'],
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

      <ToolTopAdSlot slotId="top-cement" />
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
          <ToolInArticleAd slotId="mobile-cement" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="cement-guide">
            <h2>الأسمنت ليس هو الخرسانة</h2>
            <p>
              الأسمنت مادة رابطة فقط، أما الخرسانة فهي خليط من الأسمنت والماء والرمل والحصى بنسب
              محددة حسب العيار (قوة الخرسانة المطلوبة). كل عيار له معدل أسمنت مختلف لكل متر مكعب —
              كلما زاد العيار زاد معدل الأسمنت المطلوب.
            </p>

            <ConcreteGradeChart />

            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>العيار</th><th>الاستخدام الشائع</th><th>المتانة</th></tr>
                </thead>
                <tbody>
                  {MIX_GRADES.map((g) => (
                    <tr key={g.key}>
                      <td>{g.label}</td>
                      <td>{g.use}</td>
                      <td>{g.strength}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PlainBlock eyebrow="لا تختر العيار حسب السعر فقط" title="كل عيار له استخدام هندسي محدد">
              اختيار عيار أقل من المطلوب يوفّر أسمنتاً الآن لكن يضعف العنصر الإنشائي لاحقاً. راجع
              دائماً المخطط الهندسي إن وُجد — الحاسبة تعطيك تقديراً سريعاً للشراء، وليست بديلاً عن
              قرار المهندس المسؤول عن المشروع.
            </PlainBlock>
            <PlainBlock eyebrow="سؤال شائع عند الطلب من المورد" title="بالكيس أم بالمتر المكعب جاهزة؟">
              للكميات الصغيرة، يشتري أغلب الناس الأسمنت بالكيس ويخلطون الخرسانة في الموقع. للكميات
              الكبيرة (أكثر من 5-10 م³)، يكون طلب خرسانة جاهزة (Ready-Mix) من مصنع غالباً أوفر وقتاً
              وأدق في النسب — استخدم نتيجة هذه الحاسبة للمقارنة مع عرض سعر المصنع.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-cement" />

          <section id="cement-faq">
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
            <section id="cement-sources">
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

          <section id="cement-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/cement`}
              title="حاسبة الأسمنت والخرسانة"
              hint="هل تدير موقعاً هندسياً أو منتدى؟ أضف حاسبة الأسمنت إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <CementCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
