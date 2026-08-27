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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'soldes-france');
const CONTENT = getFinancePageContent('soldes-france');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['soldes-schedule', 'الموعد'],
  ['explainer', 'دليل الفهم'],
  ['faq', 'الأسئلة الشائعة'],
];

const SALE_DURATION_DAYS = 28; // 4 weeks, per loi PACTE 2019 (Article L.310-3 du Code de commerce)

// Legal rule (arrêté du 27 mai 2019): winter sales start the 2nd Wednesday of January,
// unless that Wednesday falls after the 12th, in which case they start the 1st Wednesday.
function winterSalesStart(year) {
  const secondWed = nthWeekdayOfMonth(year, 0, 3, 2); // month 0 = January, weekday 3 = Wednesday, 2nd occurrence
  return secondWed.getUTCDate() > 12 ? nthWeekdayOfMonth(year, 0, 3, 1) : secondWed;
}

// Summer sales start the last Wednesday of June, unless that Wednesday falls after the 28th,
// in which case they start the second-to-last Wednesday.
function summerSalesStart(year) {
  const lastWed = lastWeekdayOfMonth(year, 5, 3); // month 5 = June
  if (lastWed.getUTCDate() > 28) {
    const d = new Date(lastWed);
    d.setUTCDate(d.getUTCDate() - 7);
    return d;
  }
  return lastWed;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
  const d = new Date(Date.UTC(year, monthIndex, 1));
  let count = 0;
  while (true) {
    if (d.getUTCDay() === weekday) {
      count += 1;
      if (count === n) return d;
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

function lastWeekdayOfMonth(year, monthIndex, weekday) {
  const d = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  while (d.getUTCDay() !== weekday) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return d;
}

function buildSoldesSchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear() - 1, now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    const winterStart = winterSalesStart(year);
    const winterEnd = new Date(winterStart);
    winterEnd.setUTCDate(winterEnd.getUTCDate() + SALE_DURATION_DAYS - 1);
    rows.push({ year, seasonLabel: 'الشتوية', start: winterStart, end: winterEnd });

    const summerStart = summerSalesStart(year);
    const summerEnd = new Date(summerStart);
    summerEnd.setUTCDate(summerEnd.getUTCDate() + SALE_DURATION_DAYS - 1);
    rows.push({ year, seasonLabel: 'الصيفية', start: summerStart, end: summerEnd });
  }

  rows.sort((a, b) => a.start.getTime() - b.start.getTime());

  const active = rows.find((row) => todayStartMs >= row.start.getTime() && todayStartMs <= row.end.getTime());
  const next = active || rows.find((row) => row.start.getTime() > todayStartMs);
  const daysRemaining = next && !active
    ? Math.max(0, Math.ceil((next.start.getTime() - todayStartMs) / 86_400_000))
    : null;
  const daysLeftInActive = active
    ? Math.max(0, Math.ceil((active.end.getTime() - todayStartMs) / 86_400_000))
    : null;
  const upcoming = rows.filter((row) => row.end.getTime() >= todayStartMs).slice(0, 4);

  return { active, next, daysRemaining, daysLeftInActive, upcoming };
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-soldes-france');
  cacheLife('hours');

  const nowMs = Date.now();
  return buildSoldesSchedule(nowMs);
}

const EXPLAINER = [
  { title: 'لماذا التاريخ متحرك كل سنة؟', body: 'لا يحدد القانون الفرنسي رقم يوم ثابت لبداية التخفيضات، بل يربطها بيوم أربعاء محدد في الشهر (الثاني في يناير، أو الأخير في يونيو)، مع استثناء إذا وقع هذا الأربعاء متأخراً جداً في الشهر. لهذا يتحرك التاريخ الفعلي بين سنة وأخرى بضعة أيام فقط.' },
  { title: 'الفرق بين soldes والعروض العادية', body: 'طوال السنة، يُمنع التاجر الفرنسي قانوناً من البيع بأقل من سعر التكلفة. خلال فترة soldes الرسمية فقط (4 أسابيع مرتين سنوياً)، يُسمح له بذلك استثناءً — وهذا ما يميزها قانونياً عن أي "تخفيضات" أو "عروض" أخرى تُعلن خارج هذه الفترة.' },
  { title: 'هل نفس الموعد في كل فرنسا؟', body: 'محافظات الحدود الشرقية (مورت وموزيل، ميوز، موزيل، فوج) تبدأ التخفيضات الشتوية قبل أسبوع من باقي فرنسا. كورسيكا وأقاليم ما وراء البحار (الجواديلوب، مارتينيك، ريونيون وغيرها) تملك تواريخ خاصة يحددها المحافظ المحلي كل سنة.' },
  { title: 'شرط البضاعة المخفضة', body: 'يشترط القانون أن تكون البضاعة معروضة للبيع ومدفوعة الثمن لدى التاجر منذ شهر واحد على الأقل قبل بداية فترة soldes، لمنع إدخال بضاعة جديدة خصيصاً بأسعار وهمية مرتفعة ثم "تخفيضها".' },
];

export default async function SoldesFrancePage() {
  const { active, next, daysRemaining, daysLeftInActive, upcoming } = await buildPageModel();
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

      <ToolTopAdSlot slotId="top-soldes-france" />

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
                  {active ? (
                    <>
                      التخفيضات <strong>{active.seasonLabel} {active.year}</strong> جارية الآن، وتنتهي بتاريخ{' '}
                      <strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(active.end)}</strong>
                      {daysLeftInActive === 0 ? ' — اليوم آخر يوم' : ` — يتبقى ${daysLeftInActive} يوماً على نهايتها`}.
                    </>
                  ) : next ? (
                    <>
                      التخفيضات القادمة (<strong>{next.seasonLabel} {next.year}</strong>) تبدأ بتاريخ{' '}
                      <strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(next.start)}</strong>
                      {daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${daysRemaining} يوماً`}.
                    </>
                  ) : null}
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="soldes-schedule">
                <h2>{active ? 'التخفيضات جارية الآن في فرنسا' : 'متى تبدأ التخفيضات القادمة في فرنسا'}</h2>
                <p>الجدول يُحسب تلقائياً من تاريخ اليوم حسب قاعدة Code de commerce، فيبقى دقيقاً كل سنة دون تحديث يدوي.</p>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>الفترة</th><th>السنة</th><th>البداية</th><th>النهاية</th></tr></thead>
                    <tbody>
                      {upcoming.map((row) => (
                        <tr key={`${row.year}-${row.seasonLabel}`}>
                          <td>{row.seasonLabel}</td>
                          <td>{row.year}</td>
                          <td><strong style={{ color: 'var(--green-text)' }}>{formatGregorianAr(row.start)}</strong></td>
                          <td>{formatGregorianAr(row.end)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  هذا الجدول محسوب اعتماداً على المادة L.310-3 من قانون التجارة الفرنسي وقرار 27 مايو 2019: التخفيضات
                  الشتوية تبدأ ثاني أربعاء من يناير (أو الأول إذا وقع الثاني بعد يوم 12)، والصيفية تبدأ آخر أربعاء من
                  يونيو (أو ما قبله إذا وقع بعد يوم 28)، وتستمر كل فترة 4 أسابيع بالضبط من الساعة 8 صباحاً. محافظات
                  الحدود الشرقية وكورسيكا وما وراء البحار قد تملك تواريخ مختلفة قليلاً — راجع الجهة الرسمية المحلية
                  للتأكيد.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-soldes-france" />

              <section id="explainer">
                <h2>كل ما تحتاج معرفته عن soldes في فرنسا</h2>
                {EXPLAINER.map((item) => (
                  <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>
                ))}
              </section>

              <section id="faq">
                <h2>أسئلة عن مواعيد soldes في فرنسا</h2>
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
            <AdBlogSidebar slotId="sidebar-soldes-france" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
