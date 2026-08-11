import Link from 'next/link';
import { Coins, Info, ShieldCheck, Sparkle } from '@phosphor-icons/react/ssr';

import CountryFlag from '@/components/shared/CountryFlag';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getZakatLivePrices } from '@/lib/islamic/zakat-live-prices';
import { NISAB_GOLD_GRAMS, NISAB_GOLD_GRAMS_CAUTIOUS, NISAB_SILVER_GRAMS, NISAB_SILVER_GRAMS_CAUTIOUS } from '@/lib/islamic/zakat-madhab';
import { ARAB_CURRENCIES } from '@/lib/shared/arab-currencies';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-nisab-today');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const GOLD_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-gold-calculator');
const STOCKS_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');
const TRADE_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');
const SALARY_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-salary-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');

// Computed once at module scope — never call `new Date()` inside a component render body.
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['what', 'ما هو النصاب'],
  ['table', 'نصاب اليوم بعملتك'],
  ['related', 'احسب زكاتك بدقة أكبر'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function fmt(n) {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

const FAQ_ITEMS = [
  {
    question: `كم نصاب الزكاة اليوم ${CURRENT_YEAR}؟`,
    answer:
      'نصاب الزكاة قيمة متغيرة يومياً لأنها تُحسب بوزن الذهب (85 جراماً تقريباً) أو الفضة (595 جراماً تقريباً) مضروباً في سعر السوق العالمي، لا مبلغاً ثابتاً. الجدول أعلى الصفحة يعرض القيمة الحالية تلقائياً بعملتك.',
  },
  {
    question: 'نصاب الذهب أم نصاب الفضة — أيهما أستخدم؟',
    answer:
      'نصاب الفضة أقل قيمة عادة من نصاب الذهب (لأن سعر الذهب ارتفع نسبياً أكثر من الفضة عبر الزمن)، لذلك تختار كثير من هيئات الإفتاء المعاصرة، ومنها اللجنة الدائمة للإفتاء بالسعودية، نصاب الفضة كأساس لتقدير النقد — وهو ما يُعرف بمبدأ "الأحظ للفقراء". كلا النصابين رأي معتبر شرعاً.',
  },
  {
    question: 'لماذا يختلف رقم النصاب بالجرام بين المصادر (85 أم 92 جراماً)؟',
    answer:
      'هذا ليس خلافاً بين المذاهب، بل خلافاً في طريقة تحويل الوحدة الشرعية الكلاسيكية (20 مثقالاً) إلى جرامات حديثة. 85 جراماً هو التقريب الأكثر شيوعاً وتستخدمه أغلب الحاسبات، بينما يذكر بعض المصادر (ومنها فتوى محددة لدى الشيخ ابن باز) رقماً أدق قدره 92 جراماً. الفرق بسيط ولا يُغيّر النتيجة جوهرياً.',
  },
];

export default async function ZakatNisabTodayPage() {
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
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-zakat-nisab-today" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — نصاب حي</span>
              <h1>نصاب الزكاة اليوم بعملة أكثر من 20 دولة عربية</h1>
              <p className="guide-v2-lead">
                قيمة نصاب الزكاة تتغيّر يومياً مع سعر الذهب والفضة العالمي — هذا الجدول محدَّث
                تلقائياً من السوق العالمية، بالذهب وبالفضة معاً، بعملتك مباشرة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Coins size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  نصاب الذهب 85 جراماً تقريباً، ونصاب الفضة 595 جراماً تقريباً — إن بلغت أموالك
                  أياً من القيمتين ومرّ عليها حول هجري كامل، وجبت عليك الزكاة. اعرف القيمة الحالية
                  بعملتك في الجدول أدناه، ثم استخدم <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link> لحساب زكاتك بدقة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هو النصاب</h2>
                <p>
                  النصاب هو الحد الأدنى من المال الذي يجب أن تملكه ليصبح إخراج الزكاة واجباً عليك.
                  يُحسب بوزن ثابت من الذهب (85 جراماً تقريباً) أو الفضة (595 جراماً تقريباً)، لكن
                  قيمته النقدية تتغير يومياً مع تغير سعر المعدنين في السوق العالمية — لهذا لا يوجد
                  رقم ثابت بالريال أو الجنيه، بل قيمة حية تحسبها من سعر اليوم.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-zakat-nisab-1" />

              <section id="table">
                <h2>نصاب اليوم بعملتك</h2>
                {livePrices ? (
                  <p className="guide-v2-checker-result-note" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkle size={14} weight="fill" aria-hidden="true" />
                    الأسعار محدَّثة تلقائياً من السوق العالمية كل ساعة.
                  </p>
                ) : (
                  <p className="guide-v2-checker-result-note">تعذّر جلب الأسعار الحية حالياً — حاول تحديث الصفحة بعد قليل.</p>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table className="guide-v2-data-table">
                    <thead>
                      <tr>
                        <th>الدولة</th>
                        <th>نصاب الذهب (85 جم)</th>
                        <th>نصاب الفضة (595 جم)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ARAB_CURRENCIES.map((c) => {
                        const priced = livePrices?.byCountry?.[c.code];
                        const goldNisab = priced ? priced.goldPerGramByKarat[24] * NISAB_GOLD_GRAMS : null;
                        const silverNisab = priced ? priced.silverPerGram * NISAB_SILVER_GRAMS : null;
                        return (
                          <tr key={c.code}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <CountryFlag code={c.code} label={c.country} /> {c.country}
                            </td>
                            <td>{goldNisab ? `${fmt(goldNisab)} ${c.short}` : 'راجع الحاسبة'}</td>
                            <td>{silverNisab ? `${fmt(silverNisab)} ${c.short}` : 'راجع الحاسبة'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <Info size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  الدول المعلَّمة بـ"راجع الحاسبة" لها فروق سعر صرف حقيقية بين السعر الرسمي والسوق
                  المحلي (كلبنان وسوريا والسودان واليمن وليبيا) — أدخل سعر الذهب/الفضة يدوياً حسب
                  مصدر تثق به في {' '}
                  <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>.
                </p>
                <p className="guide-v2-checker-result-note">
                  ملاحظة: بعض المصادر (ومنها فتوى محددة لدى الشيخ ابن باز) تذكر رقماً أدق للنصاب
                  قدره {NISAB_GOLD_GRAMS_CAUTIOUS} جراماً للذهب و{NISAB_SILVER_GRAMS_CAUTIOUS} جراماً
                  للفضة، نتيجة اختلاف طريقة تحويل الوحدة الشرعية الكلاسيكية — هذا الجدول يستخدم
                  التقريب الأكثر شيوعاً ({NISAB_GOLD_GRAMS}/{NISAB_SILVER_GRAMS} جراماً)، والفرق لا
                  يُغيّر النتيجة جوهرياً.
                </p>
              </section>

              <section id="related" aria-label="أدوات ذات صلة">
                <h2>احسب زكاة كل نوع مال بدقة أكبر</h2>
                <p>
                  بعد معرفة النصاب، احسب زكاتك الفعلية في الحاسبة المناسبة لنوع مالك:{' '}
                  <Link href={GOLD_PAGE.href}>{GOLD_PAGE.shortLabel}</Link> قطعة بقطعة،{' '}
                  <Link href={STOCKS_PAGE.href}>{STOCKS_PAGE.shortLabel}</Link> حسب نيتك،{' '}
                  <Link href={TRADE_PAGE.href}>{TRADE_PAGE.shortLabel}</Link> لأصحاب المتاجر،
                  و<Link href={SALARY_PAGE.href}>{SALARY_PAGE.shortLabel}</Link> للموظفين. ولماذا
                  تختلف طريقة تقدير النصاب بين المذاهب؟ راجع{' '}
                  <Link href={MADHAHIB_PAGE.href}>{MADHAHIB_PAGE.shortLabel}</Link>.
                </p>
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
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://binbaz.org.sa/fatwas/12410" target="_blank" rel="noreferrer">موقع الشيخ ابن باز — مقدار نصاب الذهب والفضة بالغرامات</a>
                  </li>
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  أسعار الذهب والفضة من السوق العالمية، وأسعار الصرف من مزوّد بيانات عام — تقديرية
                  وليست دقيقة للاستخدام التجاري، تحقّق من السعر المحلي ليوم إخراج الزكاة الفعلي.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-nisab-today" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
