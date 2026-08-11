import Link from 'next/link';
import { ShieldCheck, Sparkle } from '@phosphor-icons/react/ssr';

import ZakatGoldCalculator from '@/components/calculators/ZakatGoldCalculator.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getZakatLivePrices } from '@/lib/islamic/zakat-live-prices';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-gold-calculator');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');
const NISAB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-nisab-today');
const STOCKS_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');
const TRADE_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['calculator', 'احسب زكاة ذهبك قطعة بقطعة'],
  ['karat', 'تحويل العيار وحساب الوزن الخالص'],
  ['jewelry', 'حكم زكاة الحلي حسب مذهبك'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const KARAT_TABLE = [
  ['24', '1.000 (خالص)', '100 جرام عيار 24 = 100 جرام خالص'],
  ['22', '0.917', '100 جرام عيار 22 = 91.7 جرام خالص'],
  ['21', '0.875', '100 جرام عيار 21 = 87.5 جرام خالص'],
  ['18', '0.750', '100 جرام عيار 18 = 75 جرام خالص'],
  ['14', '0.583', '100 جرام عيار 14 = 58.3 جرام خالص'],
  ['10', '0.417', '100 جرام عيار 10 = 41.7 جرام خالص'],
];

const FAQ_ITEMS = [
  {
    question: `كم زكاة 100 جرام ذهب عيار 21 ${CURRENT_YEAR}؟`,
    answer:
      'أولاً حوّل الوزن إلى الذهب الخالص: 100 جرام عيار 21 = 87.5 جراماً خالصاً (100 × 21/24). ثم اضرب هذا الوزن في سعر جرام الذهب الخالص (عيار 24) اليوم، فتحصل على قيمة القطعة. إن بلغت هذه القيمة (مع بقية أموالك) النصاب ومرّ عليها حول هجري كامل، فزكاتها 2.5% من القيمة. استخدم الحاسبة أعلى الصفحة لحساب هذا تلقائياً.',
  },
  {
    question: 'هل زكاة الذهب المستعمل تختلف عن الذهب الجديد؟',
    answer:
      'لا فرق في الحكم بين الذهب الجديد والمستعمل — العبرة بوزن الذهب الخالص وقيمته السوقية الحالية، لا بحالته أو تاريخ شرائه. ما يختلف هو حكم الحلي المُعَدّ للاستعمال الشخصي تحديداً، الذي يتوقف على مذهبك (راجع القسم أدناه).',
  },
  {
    question: 'هل تجب الزكاة على الذهب الملبوس يومياً؟',
    answer:
      'يختلف الحكم حسب مذهبك: المذهب الحنفي يوجب الزكاة في كل حلي الذهب والفضة إذا بلغ النصاب، بغض النظر عن الاستخدام — وهو القول الأحوط. جمهور العلماء (المالكية والشافعية والحنابلة) لا يوجبون الزكاة في الحلي المُعَدّ للُبس المعتاد غير المدَّخر. اختر مذهبك في الحاسبة أعلاه لترى الفرق في مبلغ زكاتك مباشرة.',
  },
  {
    question: 'كيف أحسب زكاة ذهب مختلط العيارات؟',
    answer:
      'أضف كل قطعة على حدة في الحاسبة أعلاه بوزنها وعيارها الخاص — الحاسبة تحوّل كل قطعة إلى وزنها الخالص تلقائياً وتجمعها معاً، فلا تحتاج لحساب كل قطعة يدوياً أو لتقدير متوسط عيار غير دقيق.',
  },
];

export default async function ZakatGoldCalculatorPage() {
  const livePrices = await getZakatLivePrices();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الأدوات الإسلامية', item: `${SITE_URL}/tools/islamic` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-zakat-gold-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — الذهب والفضة</span>
              <h1>حاسبة زكاة الذهب والفضة — قطعة بقطعة</h1>
              <p className="guide-v2-lead">
                أضف كل قطعة ذهب أو فضة تملكها بوزنها وعيارها الخاص — سبائك، حلي، أو مختلطة —
                والحاسبة تحوّل كل قطعة لوزنها الخالص وتحسب زكاتك حسب مذهبك تلقائياً، بأسعار حية
                لأكثر من 20 دولة عربية.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Sparkle size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  زكاة الذهب والفضة 2.5% من قيمتهما إذا بلغا النصاب (85 جراماً ذهباً أو 595 جراماً
                  فضة تقريباً) ومرّ عليهما حول هجري كامل. حكم حلي الزينة المستخدم يختلف باختلاف
                  مذهبك — الحنفية يوجبونه، وجمهور العلماء لا يوجبونه.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="calculator">
                <h2>احسب زكاة ذهبك قطعة بقطعة</h2>
                <p>
                  أضف كل قطعة على حدة — سبيكة، خاتم، سوار، أو أي قطعة أخرى — بوزنها وعيارها،
                  وحدّد إن كانت للادخار أو للاستعمال الشخصي:
                </p>
                <ZakatGoldCalculator livePrices={livePrices} />
              </section>

              <ToolInArticleAd slotId="mid-zakat-gold-1" />

              <section id="karat">
                <h2>تحويل العيار وحساب الوزن الخالص</h2>
                <p>
                  العيار يحدد نسبة الذهب الخالص في القطعة — الزكاة تُحسب على وزن الذهب الخالص فقط،
                  لا وزن القطعة كاملة إن كانت مخلوطة بمعادن أخرى:
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      {KARAT_TABLE.map(([karat, fraction, example]) => (
                        <div className="guide-v2-compare-row" key={karat}>
                          <span className="guide-v2-compare-row-label">عيار {karat}</span>
                          <span className="guide-v2-compare-row-value">النسبة الخالصة: {fraction} — {example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-gold-2" />

              <section id="jewelry">
                <h2>حكم زكاة الحلي حسب مذهبك</h2>
                <p>
                  من أكثر المسائل بحثاً في زكاة الذهب: هل تجب الزكاة على الحلي الذي تلبسه فعلاً،
                  أم فقط على الذهب المُدَّخر؟ الجواب يختلف حسب مذهبك — راجع{' '}
                  <Link href={MADHAHIB_PAGE.href}>{MADHAHIB_PAGE.shortLabel}</Link> للتفصيل الكامل
                  بمصادر كل رأي، أو اختر مذهبك مباشرة في الحاسبة أعلاه لترى الأثر على مبلغ زكاتك.
                </p>
                <blockquote className="guide-v2-pullquote">
                  <p>
                    تريد حساب زكاة كل أموالك معاً (نقد، أسهم، ذهب، ديون) في مكان واحد؟ استخدم{' '}
                    <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>. تريد معرفة قيمة النصاب
                    الحية فقط بلا حاسبة؟ راجع <Link href={NISAB_PAGE.href}>{NISAB_PAGE.shortLabel}</Link>.
                    تملك أيضاً أسهماً أو بضاعة تجارية؟ استخدم{' '}
                    <Link href={STOCKS_PAGE.href}>{STOCKS_PAGE.shortLabel}</Link> أو{' '}
                    <Link href={TRADE_PAGE.href}>{TRADE_PAGE.shortLabel}</Link>.
                  </p>
                </blockquote>
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {FAQ_ITEMS.map((item) => (
                    <details key={item.question}>
                      <summary>
                        {item.question}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                      </summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر فقهية</h2>
                <ul className="guide-v2-sources">
                  <li><a href="https://www.islamweb.net/ar/fatwa/137296" target="_blank" rel="noreferrer">إسلام ويب — حكم زكاة الحلي المُعَدّ للاستعمال (الحنفية والجمهور)</a></li>
                  <li><a href="https://binbaz.org.sa/fatwas/12410" target="_blank" rel="noreferrer">موقع الشيخ ابن باز — مقدار نصاب الذهب والفضة بالغرامات</a></li>
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  محتوى فقهي سنّي معتمد فقط، يغطي المذاهب الأربعة. أداة استرشادية وليست فتوى شخصية.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-gold-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
