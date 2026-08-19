import Link from 'next/link';

import WeaningScheduleTool from '@/components/calculators/WeaningScheduleTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getHealthPageContent } from '@/lib/calculators/health-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'weaning-schedule');
const CONTENT = getHealthPageContent('weaning-schedule');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['pregnancy', 'pregnancy-weeks']);

const TOC_ITEMS = [
  ['weaning-guide', 'لماذا يختلف القوام والكمية كل بضعة أشهر؟'],
  ['weaning-faq', 'الأسئلة الشائعة'],
  ['weaning-sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

// Same 5 stages (age range + texture) as WEANING_STAGES in src/lib/calculators/weaning-schedule.js
// (WHO/UNICEF/AAP-sourced) — shown here as a quick visual overview before the reader enters a
// birth date in the tool below.
const WEANING_TIMELINE = [
  { age: '0-6 أشهر', texture: 'حليب فقط' },
  { age: 'الشهر 6', texture: 'هريس ناعم' },
  { age: '7-8 أشهر', texture: 'مهروس أكثف' },
  { age: '9-11 شهر', texture: 'قطع طرية' },
  { age: '12+ شهر', texture: 'طعام العائلة' },
];

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

export default function WeaningSchedulePage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الصحة والأمومة', item: `${SITE_URL}/tools/health` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['جدول تغذية الرضيع', 'إدخال الطعام للرضيع', 'مراحل الفطام'],
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

      <ToolTopAdSlot slotId="top-weaning-schedule" />
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
          <ToolInArticleAd slotId="mobile-weaning-schedule" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="weaning-guide">
            <h2>لماذا يختلف القوام والكمية كل بضعة أشهر؟</h2>
            <p>
              جهاز الرضيع الهضمي والحركي ينضج تدريجياً — القدرة على المضغ والبلع الآمن للقطع
              الصلبة لا تتطور دفعة واحدة. توصي منظمة الصحة العالمية بالبدء بهريس ناعم في الشهر
              السادس، ثم الانتقال تدريجياً إلى قوام أكثر كثافة وقطعاً طرية بين الشهرين 7 و11،
              وصولاً لطعام العائلة العادي بعد السنة الأولى — الأداة أعلاه تحسب المرحلة المناسبة
              تلقائياً حسب عمر رضيعك الفعلي بدلاً من مقال عام لا يخصّه.
            </p>
            <div className="tool-v2-info-grid">
              {WEANING_TIMELINE.map((stage) => (
                <div className="tool-v2-info-card" key={stage.age}>
                  <h3>{stage.age}</h3>
                  <p className="tool-v2-info-desc">{stage.texture}</p>
                </div>
              ))}
            </div>
            <div className="tool-v2-tip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
              <span>بعد ظهور النتيجة، اضغطي "طباعة الجدول الكامل" للحصول على ورقة مرجعية بكل المراحل الخمس مع تظليل مرحلة رضيعك الحالية — جاهزة للصق على الثلاجة.</span>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-weaning-schedule" />

          <section id="weaning-faq">
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
            <section id="weaning-sources">
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
            <WeaningScheduleTool />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى للحمل والأمومة" />
        </div>
      </div>
    </main>
  );
}
