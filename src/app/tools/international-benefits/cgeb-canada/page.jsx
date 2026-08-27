import { cacheLife, cacheTag } from 'next/cache';
import { CalendarBlank } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { formatGregorianAr } from '@/lib/holidays-engine';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cgeb-canada');
const CONTENT = getFinancePageContent('cgeb-canada');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['pay-schedule', 'الموعد القادم'],
  ['explainer', 'دليل الفهم'],
  ['faq', 'الأسئلة الشائعة'],
];

// CRA rule: payment falls on the 5th of Jan/Apr/Jul/Oct; if that day is a weekend, it moves
// to the preceding business day. Computed dynamically so the schedule stays correct every year.
const PAYMENT_MONTHS = [
  { month: 0, label: 'يناير' },
  { month: 3, label: 'أبريل' },
  { month: 6, label: 'يوليو' },
  { month: 9, label: 'أكتوبر' },
];

const EXPLAINER = [
  { title: 'ما الذي تغير في يوليو 2026؟', body: 'غيّرت الحكومة الكندية اسم إعانة ضريبة السلع والخدمات (GST/HST Credit) إلى دعم المقاضي والأساسيات (Canada Groceries and Essentials Benefit) اعتباراً من يوليو 2026، مع زيادة 25% على المبلغ مثبّتة حتى 2031. الآلية نفسها — تقديم إقرار ضريبي، صرف ربعي — لم تتغير.' },
  { title: 'كم المبلغ بعد الزيادة؟', body: 'بعد زيادة 25%، يبلغ المبلغ السنوي التقريبي نحو 666 دولاراً للفرد الأعزب، ونحو 873 دولاراً للزوجين، إضافة إلى نحو 230 دولاراً لكل طفل دون 19 عاماً. الرقم الدقيق مرتبط بدخلك الأسري المُصرَّح في إقرارك — راجع CRA My Account لمعرفة مبلغك.' },
  { title: 'هل تحتاج للتقديم؟', body: 'لا يوجد طلب منفصل لدعم المقاضي والأساسيات. يكفي أن تقدّم إقرارك الضريبي كل سنة حتى بلا دخل، وتحسب CRA أهليتك ومبلغك تلقائياً بناءً على دخل أسرتك وعدد أفرادها.' },
  { title: 'لماذا يتحرك موعد الصرف كل سنة؟', body: 'الأصل أن الدفعة تصلك يوم 5 من الشهر، لكن إذا وافق هذا اليوم سبتاً أو أحداً، تُصرف الدفعة في آخر يوم عمل قبله. لهذا يظهر التاريخ الفعلي مختلفاً بضعة أيام من سنة لأخرى — الجدول أعلاه يطبق هذه القاعدة تلقائياً.' },
];

function shiftToPrecedingBusinessDay(date) {
  const day = date.getUTCDay();
  if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
  else if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

function buildCgebSchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    for (const { month, label } of PAYMENT_MONTHS) {
      const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 5)));
      rows.push({ year, quarterLabel: label, date, isPast: date.getTime() < todayStartMs });
    }
  }

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  const next = rows.find((row) => !row.isPast);
  const daysRemaining = next ? Math.max(0, Math.ceil((next.date.getTime() - todayStartMs) / 86_400_000)) : null;
  const upcoming = rows.filter((row) => !row.isPast).slice(0, 4);

  return { next, daysRemaining, upcoming };
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-cgeb-canada');
  cacheLife('hours');

  const nowMs = Date.now();
  return buildCgebSchedule(nowMs);
}

export default async function CgebCanadaPage() {
  const { next, daysRemaining, upcoming } = await buildPageModel();
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مواعيد ودفعات دولية', item: `${SITE_URL}/tools/international-benefits` },
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

      <ToolTopAdSlot slotId="top-cgeb-canada" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">{CONTENT.hero.badge}</span>
              <h1>{PAGE.heroTitle}</h1>
              <p className="guide-v2-lead">{PAGE.description}</p>
            </div>

            {next ? (
              <div className="guide-v2-verdict">
                <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarBlank size={20} weight="bold" /></span>
                <div>
                  <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                  <p className="guide-v2-verdict-body">
                    الدفعة القادمة (<strong>{next.quarterLabel} {next.year}</strong>) تُصرف بتاريخ{' '}
                    <strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(next.date)}</strong>
                    {daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${daysRemaining} يوماً`}.
                  </p>
                </div>
              </div>
            ) : null}

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="pay-schedule">
                <h2>متى تُصرف دفعة دعم المقاضي والأساسيات القادمة</h2>
                <p>الجدول يُحسب تلقائياً من تاريخ اليوم، مع تطبيق قاعدة تقديم الصرف إذا صادف اليوم الخامس عطلة نهاية أسبوع.</p>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>الربع</th><th>السنة</th><th>تاريخ الصرف</th></tr></thead>
                    <tbody>
                      {upcoming.map((row) => (
                        <tr key={`${row.year}-${row.quarterLabel}`}>
                          <td>{row.quarterLabel}</td>
                          <td>{row.year}</td>
                          <td><strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(row.date)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  هذا الجدول محسوب اعتماداً على القاعدة المعتمدة من وكالة الإيرادات الكندية (CRA): الدفعة في اليوم
                  الخامس من يناير وأبريل ويوليو وأكتوبر، وتُقدَّم ليوم العمل السابق إذا صادفت عطلة نهاية أسبوع. في
                  حالات نادرة قد تُعلن CRA تعديلاً استثنائياً بسبب عطلة رسمية فيدرالية — تحقق من موقع CRA الرسمي
                  قرب الموعد للتأكيد.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-cgeb-canada" />

              <section id="explainer">
                <h2>كل ما تحتاج معرفته عن دعم المقاضي والأساسيات</h2>
                {EXPLAINER.map((item) => (
                  <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>
                ))}
              </section>

              <section id="faq">
                <h2>أسئلة عن دعم المقاضي والأساسيات في كندا</h2>
                <div className="guide-v2-faq">
                  {faqItems.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              {CONTENT.sources?.length > 0 && (
                <section id="sources">
                  <h2>مصادر</h2>
                  <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
                </section>
              )}
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-cgeb-canada" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
