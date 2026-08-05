import Link from 'next/link';

import PregnancyWeeksTool from '@/components/calculators/PregnancyWeeksTool.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pregnancy-weeks');
const CONTENT = getHealthPageContent('pregnancy-weeks');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['pregnancy', 'weaning-schedule']);

const TOC_ITEMS = [
  ['weeks-months-table', 'الأسابيع والأشهر'],
  ['pregnancy-weeks-faq', 'الأسئلة الشائعة'],
  ['pregnancy-weeks-sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const WEEKS_TO_MONTHS = [
  { weeks: '1–4', month: 'الشهر الأول', trimester: 'الثلث الأول', notes: 'بداية تشكّل الجنين — أهم مرحلة' },
  { weeks: '5–8', month: 'الشهر الثاني', trimester: 'الثلث الأول', notes: 'الغثيان يبدأ — ابدئي حمض الفوليك' },
  { weeks: '9–12', month: 'الشهر الثالث', trimester: 'الثلث الأول', notes: 'فحص النوكال — نهاية الثلث الأول' },
  { weeks: '13–16', month: 'الشهر الرابع', trimester: 'الثلث الثاني', notes: 'الغثيان يخف — أول حركات' },
  { weeks: '17–20', month: 'الشهر الخامس', trimester: 'الثلث الثاني', notes: 'الفحص التشريحي المفصّل والجنس' },
  { weeks: '21–24', month: 'الشهر السادس', trimester: 'الثلث الثاني', notes: 'الجنين يسمع ويستجيب' },
  { weeks: '25–28', month: 'الشهر السابع', trimester: 'الثلث الثاني', notes: 'بداية الثلث الثالث — فحص السكر' },
  { weeks: '29–32', month: 'الشهر الثامن', trimester: 'الثلث الثالث', notes: 'الرئتان تنضجان — فحوصات مكثّفة' },
  { weeks: '33–36', month: 'الشهر التاسع', trimester: 'الثلث الثالث', notes: 'الجنين يتهيأ للوضع — زيارات أسبوعية' },
  { weeks: '37–40', month: 'الشهر العاشر', trimester: 'الثلث الثالث', notes: 'حمل كامل — الولادة منتظرة' },
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

export default function PregnancyWeeksPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الصحة والعمر', item: `${SITE_URL}/tools/health` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: ['أسبوع الحمل', 'الحمل بالأسابيع', 'تحويل أسابيع الحمل لأشهر'],
    keywords: SEARCH_COVERAGE.metadataKeywords,
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

      <ToolTopAdSlot slotId="top-pregnancy-weeks" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pregnancy-weeks" /></div>

        <article className="tool-v2-lane-article">
          <section id="weeks-months-table">
            <h2>تحويل أسابيع الحمل إلى أشهر — الجدول الكامل</h2>
            <p>الحمل 40 أسبوعاً يتوزع على ثلاثة أثلاث وعشرة أشهر — هذا الجدول يجيب على سؤال «أنا في أي شهر؟» بدقة.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الأسابيع</th><th>الشهر</th><th>الثلث</th><th>أبرز ما يحدث</th></tr></thead>
                <tbody>
                  {WEEKS_TO_MONTHS.map((row) => (
                    <tr key={row.weeks}><td>{row.weeks}</td><td>{row.month}</td><td>{row.trimester}</td><td>{row.notes}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pregnancy-weeks" />

          <section id="pregnancy-weeks-faq">
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
            <section id="pregnancy-weeks-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><PregnancyWeeksTool /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى للحمل والأمومة" />
        </div>
      </div>
    </main>
  );
}
