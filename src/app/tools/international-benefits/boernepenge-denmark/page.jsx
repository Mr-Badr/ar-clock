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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'boernepenge-denmark');
const CONTENT = getFinancePageContent('boernepenge-denmark');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['quarterly-schedule', 'دعم الأطفال الفصلي'],
  ['monthly-schedule', 'إعانة الشباب الشهرية'],
  ['rates', 'المبالغ حسب العمر'],
  ['explainer', 'دليل الفهم'],
  ['faq', 'الأسئلة الشائعة'],
];

// Udbetaling Danmark rule (borger.dk): børneydelse (under 15) is paid quarterly on the 20th of
// Jan/Apr/Jul/Oct; ungeydelse (15-17) is paid monthly on the 20th. Both shift to the preceding
// business day when the 20th falls on a weekend.
const QUARTER_MONTHS = [
  { month: 0, label: 'يناير' },
  { month: 3, label: 'أبريل' },
  { month: 6, label: 'يوليو' },
  { month: 9, label: 'أكتوبر' },
];

const AGE_RATES = [
  { label: '0-2 سنوات', amount: '5,370 كرونة', frequency: 'فصلياً' },
  { label: '3-6 سنوات', amount: '4,248 كرونة', frequency: 'فصلياً' },
  { label: '7-14 سنة', amount: '3,342 كرونة', frequency: 'فصلياً' },
  { label: '15-17 سنة', amount: '1,114 كرونة', frequency: 'شهرياً' },
];

const EXPLAINER = [
  { title: 'لماذا يختلف الصرف حسب العمر؟', body: 'يقسّم القانون الدنماركي الإعانة إلى مرحلتين: دعم الأطفال (Børneydelse) للفئة العمرية دون 15 عاماً يُصرف كل ثلاثة أشهر، وإعانة الشباب (Ungeydelse) لمن هم بين 15 و17 عاماً تُصرف شهرياً. الاسمان جزء من نفس النظام الرسمي المعروف باسم Børne- og ungeydelse.' },
  { title: 'هل يحتاج تقديم طلب؟', body: 'لا يحتاج الوالدان عادة لتقديم طلب منفصل؛ يبدأ الصرف تلقائياً بعد تسجيل الطفل في السجل المدني الدنماركي (CPR)، بشرط استيفاء شرط الإقامة/التأمين المطلوب.' },
  { title: 'من يستلم المبلغ؟', body: 'يذهب المبلغ عادة لحساب الوالد الذي يعيش الطفل معه. في حالة الحضانة المشتركة وسكن الوالدين معاً، يُقسَّم المبلغ نصفين بين حسابيهما البنكيين (NemKonto) تلقائياً.' },
  { title: 'ماذا لو تجاوز الدخل الحد الأقصى؟', body: 'إذا تجاوز دخل أحد الوالدين السنوي 961,100 كرونة، يبدأ تخفيض المبلغ تدريجياً وفق نسبة محددة من الدولة، ولا يُلغى المبلغ بالكامل دفعة واحدة عند تجاوز الحد بقليل.' },
];

function shiftToPrecedingBusinessDay(date) {
  const day = date.getUTCDay();
  if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
  else if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

function buildQuarterlySchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    for (const { month, label } of QUARTER_MONTHS) {
      const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 20)));
      rows.push({ year, quarterLabel: label, date, isPast: date.getTime() < todayStartMs });
    }
  }

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  const next = rows.find((row) => !row.isPast);
  const daysRemaining = next ? Math.max(0, Math.ceil((next.date.getTime() - todayStartMs) / 86_400_000)) : null;
  const upcoming = rows.filter((row) => !row.isPast).slice(0, 4);

  return { next, daysRemaining, upcoming };
}

function nextMonthlyPayment(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  for (let offset = 0; offset < 3; offset += 1) {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + offset;
    const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 20)));
    if (date.getTime() >= todayStartMs) {
      const daysRemaining = Math.max(0, Math.ceil((date.getTime() - todayStartMs) / 86_400_000));
      return { date, daysRemaining };
    }
  }
  return null;
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-boernepenge-denmark');
  cacheLife('hours');

  const nowMs = Date.now();
  const { next, daysRemaining, upcoming } = buildQuarterlySchedule(nowMs);
  const monthly = nextMonthlyPayment(nowMs);
  return { next, daysRemaining, upcoming, monthly };
}

export default async function BoernepengeDenmarkPage() {
  const { next, daysRemaining, upcoming, monthly } = await buildPageModel();
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

      <ToolTopAdSlot slotId="top-boernepenge-denmark" />

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
                    الدفعة الفصلية القادمة (<strong>{next.quarterLabel} {next.year}</strong>) تُصرف بتاريخ{' '}
                    <strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(next.date)}</strong>
                    {daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${daysRemaining} يوماً`}.
                  </p>
                </div>
              </div>
            ) : null}

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="quarterly-schedule">
                <h2>متى تُصرف دفعة دعم الأطفال الفصلية القادمة</h2>
                <p>الجدول يُحسب تلقائياً من تاريخ اليوم، مع تطبيق قاعدة تقديم الصرف إذا صادف يوم 20 عطلة نهاية أسبوع.</p>
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
              </section>

              <ToolInArticleAd slotId="mid-boernepenge-denmark" />

              <section id="monthly-schedule">
                <h2>متى تُصرف إعانة الشباب الشهرية القادمة</h2>
                <p>لمن هم بين 15 و17 عاماً، تُصرف الإعانة شهرياً في يوم 20، وليس فصلياً كدعم الأطفال.</p>
                {monthly ? (
                  <p>
                    الدفعة الشهرية القادمة تُصرف بتاريخ <strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(monthly.date)}</strong>
                    {monthly.daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${monthly.daysRemaining} يوماً`}.
                  </p>
                ) : null}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  هذا الجدول محسوب اعتماداً على قاعدة Udbetaling Danmark الرسمية: يوم 20 من كل شهر، مع تقديم الصرف
                  ليوم العمل السابق إذا صادف عطلة نهاية أسبوع أو رسمية.
                </p>
              </section>

              <section id="rates">
                <h2>كم مبلغ دعم الأطفال حسب عمر طفلك</h2>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>الفئة العمرية</th><th>المبلغ</th><th>التكرار</th></tr></thead>
                    <tbody>{AGE_RATES.map((row) => (<tr key={row.label}><td>{row.label}</td><td>{row.amount}</td><td>{row.frequency}</td></tr>))}</tbody>
                  </table>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  المبلغ معفى بالكامل من الضريبة، ويُخفض تدريجياً إذا تجاوز دخل أحد الوالدين 961,100 كرونة في السنة.
                  عند الحضانة المشتركة، يُقسَّم المبلغ نصفين بين حسابي الوالدين البنكيين (NemKonto).
                </p>
              </section>

              <section id="explainer">
                <h2>كل ما تحتاج معرفته عن دعم الأطفال في الدنمارك</h2>
                {EXPLAINER.map((item) => (
                  <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>
                ))}
              </section>

              <section id="faq">
                <h2>أسئلة عن دعم الأطفال في الدنمارك</h2>
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
            <AdBlogSidebar slotId="sidebar-boernepenge-denmark" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
