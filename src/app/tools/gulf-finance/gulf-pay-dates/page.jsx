import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';
import { CalendarBlank } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import CountryFlag from '@/components/shared/CountryFlag';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getHolidayCoreEventBySlug } from '@/lib/holidays/repository';
import { getNextEventDate, formatGregorianAr } from '@/lib/holidays-engine';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gulf-pay-dates');
const CONTENT = getFinancePageContent('gulf-pay-dates');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['schedule', 'جدول المواعيد — مرتب حسب الأقرب'],
  ['explainer', 'دليل الفهم'],
  ['faq', 'الأسئلة الشائعة'],
];

const GULF_COUNTRIES = {
  sa: { name: 'السعودية' }, ae: { name: 'الإمارات' }, kw: { name: 'الكويت' },
  qa: { name: 'قطر' }, bh: { name: 'البحرين' }, om: { name: 'عُمان' },
};

const GULF_PAY_SLUGS_META = {
  'salary-day-saudi': { authority: 'وزارة المالية' },
  'salary-day-uae': { authority: 'نظام حماية الأجور' },
  'salary-day-kuwait': { authority: 'ديوان الخدمة المدنية' },
  'salary-day-qatar': { authority: 'وزارة المالية' },
  'salary-day-bahrain': { authority: 'جهاز الخدمة المدنية' },
  'salary-day-oman': { authority: 'وزارة العمل' },
  'pension-day-saudi': { authority: 'هيئة التقاعد' },
  'pension-day-uae': { authority: 'الهيئة العامة للمعاشات' },
  'pension-day-kuwait': { authority: 'الهيئة العامة للتأمينات الاجتماعية' },
  'pension-day-bahrain': { authority: 'هيئة التأمينات الاجتماعية' },
  'pension-day-oman': { authority: 'الهيئة العامة للتأمينات الاجتماعية' },
  'citizen-account-saudi': { authority: 'برنامج حساب المواطن' },
  'hafez-saudi': { authority: 'صندوق الموارد البشرية' },
  'housing-support-saudi': { authority: 'برنامج سكني' },
  'reef-support-saudi': { authority: 'وزارة البيئة والمياه والزراعة' },
  'sand-payment-saudi': { authority: 'التأمينات الاجتماعية GOSI' },
  'social-security-saudi': { authority: 'وزارة الموارد البشرية' },
  'housing-allowance-kuwait': { authority: 'وزارة الشؤون الاجتماعية' },
  'national-labor-support-kuwait': { authority: 'الهيئة العامة للقوى العاملة' },
  'social-assistance-kuwait': { authority: 'وزارة الشؤون الاجتماعية' },
  'cost-of-living-allowance-bahrain': { authority: 'الحكومة البحرينية' },
  'social-assistance-bahrain': { authority: 'وزارة التنمية الاجتماعية' },
  'job-security-oman': { authority: 'الحماية الاجتماعية' },
  'social-security-qatar': { authority: 'وزارة التنمية الاجتماعية' },
  'nafis-uae': { authority: 'برنامج نافس' },
};

function buildGulfPayRows(nowMs) {
  const rows = [];
  for (const [slug, meta] of Object.entries(GULF_PAY_SLUGS_META)) {
    const core = getHolidayCoreEventBySlug(slug);
    if (!core) continue;
    const country = GULF_COUNTRIES[core._countryCode] || null;
    const nextDate = getNextEventDate(core, {}, nowMs);
    const daysRemaining = Math.max(0, Math.ceil((nextDate.getTime() - nowMs) / 86_400_000));
    rows.push({
      slug, program: core.name, country: country?.name || '', countryCode: core._countryCode || '',
      authority: meta.authority, nextDate, daysRemaining,
    });
  }
  rows.sort((left, right) => left.nextDate.getTime() - right.nextDate.getTime());
  return rows;
}

const PAY_EXPLAINER = [
  { title: 'لماذا تختلف مواعيد الصرف بين دول الخليج؟', body: 'الكويت وقطر تصرفان الراتب الحكومي في اليوم الأول من الشهر التالي، بينما تعتمد البحرين اليوم 22 والسعودية اليوم 27 والإمارات اليوم 25 وعُمان اليوم 28. هذا الفارق ناتج عن اختلاف دورة معالجة كشوف الرواتب في كل جهاز حكومي، وليس تأخيراً أو خللاً.' },
  { title: 'متى يتأخر الراتب أو يتقدم؟', body: 'أغلب دول الخليج تُقدّم الصرف إلى آخر يوم عمل قبل العطلة إذا وافق الموعد إجازة نهاية أسبوع أو مناسبة رسمية. الكويت تحديداً تستثني الجمعة والسبت وتصرف الراتب يوم الخميس في هذه الحالة.' },
  { title: 'الفرق بين موعد الإيداع وموعد الاستلام', body: 'يُودَع الراتب أو الدعم رسمياً في التاريخ المحدد من الجهة المسؤولة، لكن ظهوره في رصيدك قد يستغرق ساعات قليلة بحسب البنك الذي تتعامل معه.' },
  { title: 'كيف تستخدم هذا الجدول إذا كنت تتابع أكثر من برنامج', body: 'إذا كنت تتابع رواتب أو دعماً في أكثر من دولة خليجية، احفظ هذه الصفحة كمرجع شهري. الجدول يرتب كل المواعيد تلقائياً من الأقرب إلى الأبعد.' },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-gulf-pay-dates');
  cacheLife('hours');
  return buildGulfPayRows(Date.now());
}

export default async function GulfPayDatesPage() {
  const rows = await buildPageModel();
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

      <ToolTopAdSlot slotId="top-gulf-pay-dates" />

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
                  الجدول أدناه يرتب <strong>{rows.length}</strong> موعد صرف عبر الخليج تلقائياً من
                  الأقرب إلى الأبعد — أقرب موعد الآن: <strong>{rows[0]?.program}</strong>
                  {rows[0] ? ` (${rows[0].daysRemaining === 0 ? 'اليوم' : `بعد ${rows[0].daysRemaining} يوم`})` : ''}.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="schedule">
                <h2>جدول المواعيد — مرتب حسب الأقرب</h2>
                <p>الجدول مرتب تلقائياً من أقرب موعد صرف إلى أبعده اعتماداً على تاريخ اليوم.</p>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>البرنامج</th><th>الدولة</th><th>الموعد القادم</th><th>كم باقي</th><th>الجهة</th><th>العداد</th></tr></thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.slug}>
                          <td>{row.program}</td>
                          <td><CountryFlag code={row.countryCode} /> {row.country}</td>
                          <td><strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(row.nextDate)}</strong></td>
                          <td>{row.daysRemaining === 0 ? 'اليوم' : `${row.daysRemaining} يوم`}</td>
                          <td>{row.authority}</td>
                          <td><Link href={`/holidays/${row.slug}`}>عد تنازلي ←</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  المواعيد أعلاه هي الأنماط الشهرية المعتمدة رسمياً لكل برنامج. في حالات استثنائية
                  (إجازات رسمية، مناسبات وطنية) قد تُصدر الجهات المختصة في كل دولة قراراً بتقديم
                  الصرف ليوم عمل سابق. راجع صفحة العداد الخاصة بكل موعد للتفاصيل الكاملة.
                </p>
                <p style={{ marginTop: 'var(--space-3)' }}>
                  تتابع راتبك الشهري؟ راجع أيضاً{' '}
                  <Link href="/tools/fuel-prices/compare">مقارنة أسعار البنزين في 13 دولة عربية</Link>.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-gulf-pay-dates" />

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
            <AdBlogSidebar slotId="sidebar-gulf-pay-dates" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
