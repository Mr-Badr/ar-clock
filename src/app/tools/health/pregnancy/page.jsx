import Link from 'next/link';

import PregnancyTool from '@/components/calculators/PregnancyTool.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pregnancy');
const CONTENT = getHealthPageContent('pregnancy');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['pregnancy-weeks', 'weaning-schedule']);

const TOC_ITEMS = [
  ['pregnancy-method', 'قاعدة ناجيل والتاريخ الهجري'],
  ['pregnancy-trimesters', 'مراحل الحمل الثلاثة'],
  ['pregnancy-milestones', 'محطات الحمل'],
  ['pregnancy-faq', 'الأسئلة الشائعة'],
  ['pregnancy-sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TRIMESTER_ROWS = [
  { num: 1, label: 'الثلث الأول', weeks: 'الأسبوع 1–12', highlight: 'تكوين الأعضاء الحيوية', checks: 'فحص النوكال، تحليل دم كامل' },
  { num: 2, label: 'الثلث الثاني', weeks: 'الأسبوع 13–27', highlight: 'النمو والحركة الأولى', checks: 'الفحص التشريحي (18–20)، سكر الحمل' },
  { num: 3, label: 'الثلث الثالث', weeks: 'الأسبوع 28–40', highlight: 'نضج الرئتين والوزن', checks: 'مراقبة الوضع، تحضير الولادة' },
];

const MILESTONE_ROWS = [
  { week: 4, label: 'غياب الدورة', detail: 'اختبري الحمل المنزلي وابدئي حمض الفوليك' },
  { week: 8, label: 'أول زيارة طبيب', detail: 'تأكيد الحمل وإنشاء ملف متابعة' },
  { week: 12, label: 'نهاية الثلث الأول', detail: 'فحص النوكال — الخطر الكبير ينخفض' },
  { week: 20, label: 'الفحص التشريحي', detail: 'فحص الأعضاء وتحديد الجنس' },
  { week: 28, label: 'بداية الثلث الثالث', detail: 'الرئتان تبدآن إنتاج السورفكتانت' },
  { week: 40, label: 'موعد الولادة', detail: 'EDD — التقدير النهائي' },
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

export default function PregnancyPage() {
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
    about: ['موعد الولادة', 'حاسبة الحمل', 'أسبوع الحمل بالهجري والميلادي'],
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

      <ToolTopAdSlot slotId="top-pregnancy" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pregnancy" /></div>

        <article className="tool-v2-lane-article">
          <section id="pregnancy-method">
            <h2>قاعدة ناجيل والتاريخ الهجري — كيف نحسب موعد الولادة</h2>
            <p>
              الحاسبة تعتمد على قاعدة ناجيل (Naegele&apos;s Rule) — الأساس الطبي المعتمد منذ 1830 وما
              زال الأطباء يستخدمونه: موعد الولادة = آخر دورة + 280 يوماً، مع تعديل بسيط حسب طول
              دورتك الفعلي. الميزة الإضافية هنا التي لا تقدمها معظم الحاسبات العربية: موعد الولادة
              بالتقويم الهجري أيضاً، مفيد لمتابعة المناسبات الأسرية والدينية.
            </p>
            <div className="tool-v2-tip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
              <span>الموعد تقدير استرشادي — فقط 5% من النساء يلدن في اليوم بالضبط. معظم الولادات بين الأسبوع 38 والأسبوع 42.</span>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-pregnancy" />

          <section id="pregnancy-trimesters">
            <h2>مراحل الحمل الثلاثة — ما يحدث وما تتوقعينه</h2>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المرحلة</th><th>الأسابيع</th><th>الأبرز</th><th>الفحوصات الرئيسية</th></tr></thead>
                <tbody>
                  {TRIMESTER_ROWS.map((row) => (
                    <tr key={row.num}><td>{row.label}</td><td>{row.weeks}</td><td>{row.highlight}</td><td>{row.checks}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="pregnancy-milestones">
            <h2>أبرز محطات الحمل من الأسبوع 4 إلى 40</h2>
            <p>تُحسب هذه المحطات تلقائياً في الحاسبة أعلاه بناءً على تاريخ دورتك، مع مواعيدها المتوقعة.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>الأسبوع</th><th>المحطة</th><th>ما يحدث</th></tr></thead>
                <tbody>
                  {MILESTONE_ROWS.map((m) => (<tr key={m.week}><td>أسبوع {m.week}</td><td>{m.label}</td><td>{m.detail}</td></tr>))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="pregnancy-faq">
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
            <section id="pregnancy-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><PregnancyTool /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى للحمل والأمومة" />
        </div>
      </div>
    </main>
  );
}
