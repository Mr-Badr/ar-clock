import Link from 'next/link';
import { CalendarBlank } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'saudi-pay-dates');
const CONTENT = getFinancePageContent('saudi-pay-dates');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['schedule', 'جدول مواعيد الصرف'],
  ['explainer', 'دليل الفهم'],
  ['faq', 'الأسئلة الشائعة'],
];

const SAUDI_PAY_SCHEDULE = [
  { type: 'الراتب الحكومي', day: 'يوم 27', rule: 'ميلادي — إذا صادف جمعة أو إجازة صُرف قبله', authority: 'وزارة المالية', slug: 'salary-day-saudi', note: 'يشمل موظفي الحكومة والجيش والأمن' },
  { type: 'حساب المواطن', day: 'يوم 10', rule: 'ميلادي — دفعات ربع سنوية (3 أشهر دفعة)', authority: 'برنامج حساب المواطن', slug: 'citizen-account-saudi', note: 'يختلف بحسب فئة الأسرة ودخلها' },
  { type: 'راتب التقاعد', day: 'يوم 1', rule: 'ميلادي — أول الشهر', authority: 'هيئة التقاعد', slug: 'pension-day-saudi', note: 'للمتقاعدين المدنيين والعسكريين' },
  { type: 'حافز (الباحثون عن عمل)', day: 'يوم 5', rule: 'ميلادي — شرط تفعيل البحث الشهري', authority: 'وزارة الموارد البشرية', slug: 'hafez-saudi', note: 'يشترط التسجيل النشط في برنامج حافز' },
  { type: 'الضمان الاجتماعي المطوّر', day: 'يوم 1', rule: 'ميلادي — أول الشهر', authority: 'وزارة الموارد البشرية', slug: 'social-security-saudi', note: 'للأسر والأفراد المستوفين لشروط الأهلية' },
  { type: 'دعم السكن', day: 'يوم 24', rule: 'ميلادي', authority: 'برنامج سكني', slug: 'housing-support-saudi', note: 'دعم الإيجار والتمويل العقاري المدعوم' },
  { type: 'تعويض ساند (التأمين ضد التعطل)', day: 'يوم 1 تقريباً', rule: 'ميلادي — خلال الأسبوع الأول من الشهر', authority: 'المؤسسة العامة للتأمينات الاجتماعية GOSI', slug: 'sand-payment-saudi', note: 'لمن فقد عمله بشكل غير اختياري وكان مشتركاً في GOSI' },
  { type: 'دعم ريف (التنمية الريفية)', day: 'يوم 1 – 10', rule: 'ميلادي — يُصرف خلال العشرة الأيام الأولى', authority: 'وزارة البيئة والمياه والزراعة', slug: 'reef-support-saudi', note: 'لصغار المنتجين الزراعيين والأسر المنتجة' },
  { type: 'مكافأة الجامعة', day: 'يوم 27 (الأشيع)', rule: 'ميلادي — يختلف الموعد الفعلي بين الجامعات', authority: 'الجامعات السعودية / وزارة التعليم', slug: 'university-stipend-saudi', note: 'للطلاب والطالبات المنتظمين — راجع إعلان جامعتك' },
];

const PAY_EXPLAINER = [
  { title: 'لماذا مواعيد الصرف مختلفة لكل برنامج؟', body: 'الراتب الحكومي يرتبط باليوم 27 لأن الوزارة تحتاج وقتاً لمعالجة كشوف الرواتب. حساب المواطن يُصرف في اليوم 10 لأن دوراته ربع سنوية. حافز يُصرف في اليوم 5 لأنه مرتبط بجداول وزارة الموارد البشرية. معرفة منطق كل موعد يساعدك في التخطيط المسبق دون الحاجة إلى انتظار الإعلان كل مرة.' },
  { title: 'متى يتأخر الراتب أو يتقدم؟', body: 'في المناسبات الوطنية الكبرى (اليوم الوطني، العيدان، غيرها) تُصدر الجهات المعنية قرارات بتقديم الصرف يوماً أو يومين. لا تُعلَن هذه القرارات مسبقاً في الغالب — تابع الحساب الرسمي لكل برنامج في الأيام التي تسبق الموعد.' },
  { title: 'الفرق بين موعد الإيداع وموعد الاستلام', body: 'يُودَع الراتب رسمياً في اليوم المحدد، لكن ظهوره في رصيد الحساب قد يستغرق بضع ساعات بحسب بنكك. إذا لم يظهر الراتب بحلول نهاية يوم الصرف، تواصل مع البنك أولاً قبل مراجعة الجهة الحكومية.' },
  { title: 'كيف تستخدم هذه الصفحة بشكل عملي', body: 'إذا كنت تستفيد من أكثر من برنامج (مثلاً راتب حكومي + حساب المواطن + دعم سكن)، احفظ هذه الصفحة كمرجع شهري. اضغط على رابط العداد الخاص بكل موعد لترى الأيام المتبقية بدقة.' },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function SaudiPayDatesPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
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
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-saudi-pay-dates" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">{CONTENT.hero.badge}</span>
              <h1>{PAGE.heroTitle}</h1>
              <p className="guide-v2-lead">{PAGE.description}</p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarBlank size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الراتب الحكومي يُصرف يوم <strong>27</strong> من كل شهر، وحساب المواطن يوم
                  <strong> 10</strong>، وراتب التقاعد أول الشهر — راجع الجدول الكامل أدناه وافتح عدّاد
                  كل موعد لمعرفة الأيام المتبقية بدقة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="schedule">
                <h2>جدول مواعيد الصرف</h2>
                <p>قاعدة كل صرف والموعد المعتاد — اضغط على العداد لرؤية الأيام المتبقية.</p>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>النوع</th><th>موعد الصرف</th><th>الجهة</th><th>ملاحظة</th><th>العداد</th></tr></thead>
                    <tbody>
                      {SAUDI_PAY_SCHEDULE.map((row) => (
                        <tr key={row.slug}>
                          <td>{row.type}</td>
                          <td><strong style={{ color: 'var(--green-text)' }}>{row.day}</strong> — {row.rule}</td>
                          <td>{row.authority}</td>
                          <td>{row.note}</td>
                          <td><Link href={`/holidays/${row.slug}`}>عد تنازلي ←</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  المواعيد أعلاه هي الأنماط الشهرية المعتمدة. في حالات استثنائية (إجازات رسمية، مناسبات
                  وطنية) قد تُصدر الجهات المختصة قرارات بتقديم الصرف. راجع الإعلان الرسمي لكل برنامج
                  للتأكيد.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-saudi-pay-dates" />

              <section id="explainer">
                <h2>دليل الفهم</h2>
                {PAY_EXPLAINER.map((item) => (
                  <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>
                ))}
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {faqItems.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-saudi-pay-dates" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
