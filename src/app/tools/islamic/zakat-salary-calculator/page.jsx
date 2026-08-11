import Link from 'next/link';
import { Bank, ShieldCheck } from '@phosphor-icons/react/ssr';

import ZakatSalaryCalculator from '@/components/calculators/ZakatSalaryCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-salary-calculator');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');
const NISAB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-nisab-today');

const TOC_ITEMS = [
  ['methods', 'حول موحّد أم حول لكل دفعة'],
  ['calculator', 'احسب زكاة راتبك'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const FAQ_ITEMS = [
  {
    question: 'كيف احسب زكاة راتبي إذا كنت أدَّخر منه شهرياً؟',
    answer:
      'أسهل طريقة عملية (وهي ما تنصح به أغلب هيئات الإفتاء المعاصرة للموظفين): حدّد يوماً ثابتاً كل سنة هجرية، وفي ذلك اليوم احسب كل ما تبقى لديك من مدخرات الراتب (وأي أموال أخرى) وزكِّها كاملة، بغض النظر عن تاريخ استلام كل دفعة راتب على حدة.',
  },
  {
    question: 'هل يجب أن أحسب حولاً منفصلاً لكل راتب شهري؟',
    answer:
      'هذا هو الرأي الأدق نظرياً عند بعض الفقهاء (كل دفعة راتب لها حولها الخاص من تاريخ استلامها)، لكنه معقّد التطبيق عملياً لأنه يعني تتبع تواريخ استحقاق منفصلة لعشرات الدفعات. الطريقة الموحّدة (حول واحد لكل المدخرات) أسهل وأشيع في الفتاوى المعاصرة الموجَّهة للموظفين، وتجزئ إن شاء الله.',
  },
  {
    question: 'ماذا لو أنفقت كل راتبي ولم أدَّخر شيئاً؟',
    answer:
      'لا زكاة عليك إن لم تملك مالاً بلغ النصاب واستمر معك حولاً كاملاً — الزكاة تجب على المدَّخر الفائض عن حاجتك، لا على الدخل نفسه وقت استلامه.',
  },
];

export default async function ZakatSalaryCalculatorPage() {
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

      <ToolTopAdSlot slotId="top-zakat-salary-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — الراتب والمدخرات</span>
              <h1>حاسبة زكاة الراتب والمدخرات الشهرية</h1>
              <p className="guide-v2-lead">
                هل تحتاج حولاً منفصلاً لكل راتب، أم يكفي حول واحد لكل مدخراتك؟ الطريقتان حقيقيتان،
                لكن إحداهما عملية أكثر لأغلب الموظفين — احسب زكاتك بالطريقة الصحيحة لحالتك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Bank size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الأسهل والأشيع في الفتاوى المعاصرة: حدّد يوماً ثابتاً كل سنة هجرية وزكِّ فيه كل
                  مدخراتك المتراكمة من الراتب دفعة واحدة، بدل تتبع حول منفصل لكل راتب شهري.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="methods">
                <h2>حول موحّد أم حول لكل دفعة</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head">
                      <span className="guide-v2-compare-title">حول موحّد</span>
                      <span className="guide-v2-compare-badge">الأشيع في الفتاوى المعاصرة</span>
                    </div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">الفكرة</span><span className="guide-v2-compare-row-value">يوم واحد ثابت كل سنة هجرية تُزكّي فيه كل مدخراتك المتبقية دفعة واحدة</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">الميزة</span><span className="guide-v2-compare-row-value">بسيط، سهل التتبع، لا يحتاج تسجيل تاريخ كل راتب</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">حول لكل دفعة</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">الفكرة</span><span className="guide-v2-compare-row-value">كل راتب شهري له حوله الخاص من تاريخ استلامه</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">التحدي</span><span className="guide-v2-compare-row-value">يحتاج تتبع عشرات تواريخ الاستحقاق المنفصلة — معقّد عملياً</span></div>
                    </div>
                  </div>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-salary-1" />

              <section id="calculator">
                <h2>احسب زكاة راتبك</h2>
                <ZakatSalaryCalculator livePrices={livePrices} />
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  تريد تتبع تاريخ حول دقيق يُحفظ على جهازك وتعود له كل عام؟ استخدم متتبع الحول في{' '}
                  <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>. تريد معرفة قيمة النصاب
                  الحية بعملتك أولاً؟ راجع <Link href={NISAB_PAGE.href}>{NISAB_PAGE.shortLabel}</Link>.
                  ولماذا تختلف طريقة حساب الحول أحياناً بين المذاهب؟ راجع{' '}
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
                <h2 className="guide-v2-sources-head">مصادر فقهية</h2>
                <ul className="guide-v2-sources">
                  <li><a href="https://www.islamweb.net/ar/fatwa/121013" target="_blank" rel="noreferrer">إسلام ويب — مذاهب العلماء في زكاة ما يُدخر من الرواتب الشهرية</a></li>
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  محتوى فقهي سنّي معتمد فقط. أداة استرشادية وليست فتوى شخصية.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-salary-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
