import SaudiSchoolCalendarTool from '@/components/calculators/SaudiSchoolCalendarTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getEducationPageContent } from '@/lib/calculators/education-page-content';
import { SCHOOL_CALENDAR_EVENTS } from '@/lib/calculators/saudi-school-calendar';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'saudi-school-calendar');
const CONTENT = getEducationPageContent('saudi-school-calendar');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

const TOC_ITEMS = [
  ['school-calendar-table', 'كل مواعيد العام الدراسي'],
  ['school-calendar-explainer', 'دليل الفهم'],
  ['school-calendar-faq', 'الأسئلة الشائعة'],
  ['school-calendar-sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const CALENDAR_EXPLAINER = [
  {
    title: 'لماذا التقويم موزّع على فصلين؟',
    content: 'يعتمد التقويم الدراسي السعودي نظام الفصلين، بحيث تفصل إجازة منتصف العام بين الفصل الأول والثاني. هذا التوزيع يمنح فترات راحة منتظمة بدل التركيز على إجازة صيفية طويلة واحدة فقط.',
  },
  {
    title: 'لماذا تختلف إجازتا الفطر والأضحى كل سنة؟',
    content: 'يعتمد عيدا الفطر والأضحى على التقويم الهجري القمري، الذي يتقدم نحو 10 إلى 11 يوماً كل سنة ميلادية. لهذا تختلف مواعيدهما في التقويم الدراسي من عام لآخر، والتاريخ المعروض هنا تقديري ريثما يصدر الإعلان الرسمي برؤية الهلال.',
  },
  {
    title: 'ماذا لو تغيّر التقويم رسمياً؟',
    content: 'تعتمد وزارة التعليم التقويم الدراسي مسبقاً لعدة أعوام، لكنها قد تُصدر تعديلات طفيفة على إجازة بعينها. راجع موقع الوزارة الرسمي عند اقتراب أي إجازة للتأكد من عدم صدور تعديل.',
  },
  {
    title: 'كيف تخطط لإجازتك العائلية؟',
    content: 'حمّل التقويم الكامل كملف .ics من الأداة أعلاه ليُضاف تلقائياً لتطبيق التقويم في جوالك، وستصلك تذكيراته دون الحاجة للعودة لهذه الصفحة كل مرة.',
  },
];

export default function SaudiSchoolCalendarPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التعليم', item: `${SITE_URL}/tools/education` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: ['التقويم الدراسي 1448', 'إجازات المدارس السعودية', 'بداية العام الدراسي'],
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

      <ToolTopAdSlot slotId="top-school-calendar" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-school-calendar" /></div>

        <article className="tool-v2-lane-article">
          <section id="school-calendar-table">
            <h2>كل مواعيد وإجازات العام الدراسي 1448</h2>
            <p>بداية الدراسة وكل إجازة رسمية — العداد في الأداة أعلاه يحسب الأيام المتبقية للإجازة القادمة تلقائياً.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>المناسبة</th><th>التاريخ</th><th>ملاحظة</th></tr></thead>
                <tbody>
                  {SCHOOL_CALENDAR_EVENTS.map((row) => (
                    <tr key={row.slug}>
                      <td>{row.type}</td>
                      <td>{row.dateLabel}</td>
                      <td>{row.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
              مواعيد إجازتَي عيد الفطر وعيد الأضحى تقديرية ومرتبطة برؤية الهلال، وقد تتغير بفارق يوم
              واحد عن الإعلان الرسمي. باقي المواعيد معتمدة من وزارة التعليم ضمن خطة التقويم الدراسي
              للأعوام 1447–1450هـ.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-school-calendar" />

          <section id="school-calendar-explainer">
            <h2>كل ما تحتاج معرفته عن التقويم الدراسي 1448</h2>
            {CALENDAR_EXPLAINER.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </section>

          <section id="school-calendar-faq">
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
            <section id="school-calendar-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><SaudiSchoolCalendarTool /></div>
        </div>
      </div>
    </main>
  );
}
