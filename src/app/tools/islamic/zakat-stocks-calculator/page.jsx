import Link from 'next/link';
import { ShieldCheck, TrendUp } from '@phosphor-icons/react/ssr';

import ZakatStocksCalculator from '@/components/calculators/ZakatStocksCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');
const TRADE_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');

const TOC_ITEMS = [
  ['types', 'مضاربة أم استثمار — لماذا يهم'],
  ['calculator', 'احسب زكاة أسهمك'],
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
    question: 'ما الفرق بين زكاة أسهم المضاربة وأسهم الاستثمار؟',
    answer:
      'أسهم المضاربة (تُشترى وتُباع بقصد الربح من فروق الأسعار) تُزكّى بكامل قيمتها السوقية يوم وجوب الزكاة، كعروض التجارة تماماً. أسهم الاستثمار (يحتفظ بها صاحبها طويلاً للاستفادة من الأرباح السنوية دون نية بيعها) تُزكّى أرباحها فقط إذا حال عليها الحول، لا أصل قيمة السهم — لأن أصل السهم يمثل حصة في أصول ثابتة (مصانع، عقارات، معدات) لا تجب فيها الزكاة مباشرة.',
  },
  {
    question: 'كيف أعرف إن كانت أسهمي للمضاربة أم للاستثمار؟',
    answer:
      'العبرة بنيتك الحقيقية وقت الشراء، لا بمدة الاحتفاظ الفعلية. إن اشتريت السهم بقصد بيعه عند ارتفاع سعره فهو مضاربة، حتى لو احتفظت به سنوات دون بيع بالفعل. إن اشتريته للاستفادة من توزيعات الأرباح السنوية دون نية بيع فهو استثمار، حتى لو بعته لاحقاً لحاجة طارئة.',
  },
  {
    question: 'هل تجب الزكاة على صناديق الاستثمار المتداولة؟',
    answer:
      'نعم، تُعامَل معاملة الأسهم من حيث المبدأ — إن كان الصندوق يتداول بأصول قابلة للبيع بقصد الربح فتُزكّى بكامل القيمة، وإن كان استثمارياً طويل الأجل فتُزكّى عوائده. تحقق من نشرة الصندوق لمعرفة طبيعة أصوله بدقة.',
  },
  {
    question: 'هل يمكنني استخدام "وعاء الزكاة" الذي تنشره الشركة نفسها؟',
    answer:
      'نعم، وهو أدق من التقدير العام إن كان متوفراً. بعض الشركات المدرجة (خاصة في السوق السعودي) تنشر "زكاة السهم" أو "وعاء الزكاة" لكل سهم في تقاريرها المالية السنوية، وهو رقم محسوب فعلياً من أصول الشركة الزكوية مقسوماً على عدد الأسهم — استخدمه مباشرة إن وجدته بدل التقدير بحاسبة عامة.',
  },
];

export default async function ZakatStocksCalculatorPage() {
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

      <ToolTopAdSlot slotId="top-zakat-stocks-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — الأسهم</span>
              <h1>حاسبة زكاة الأسهم — مضاربة، استثمار، أو محفظة مختلطة</h1>
              <p className="guide-v2-lead">
                زكاة الأسهم تعتمد على نيتك من الشراء أكثر من أي شيء آخر — احسبها بدقة حسب النوع
                الصحيح، أو قسّم محفظتك المختلطة بين النوعين.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><TrendUp size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أسهم المضاربة (بيع وشراء بقصد الربح) تُزكّى بكامل قيمتها السوقية. أسهم الاستثمار
                  (طويلة الأجل، للأرباح السنوية) تُزكّى أرباحها فقط. اختر النوع الصحيح في الحاسبة
                  أدناه — الفرق في النتيجة كبير جداً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>مضاربة أم استثمار — لماذا يهم</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">أسهم المضاربة</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النية</span><span className="guide-v2-compare-row-value">شراء وبيع لتحقيق ربح من فروق الأسعار</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">تُزكّى</span><span className="guide-v2-compare-row-value">كامل القيمة السوقية، كعروض التجارة</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">أسهم الاستثمار</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النية</span><span className="guide-v2-compare-row-value">الاحتفاظ طويلاً للاستفادة من الأرباح السنوية</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">تُزكّى</span><span className="guide-v2-compare-row-value">الأرباح الموزَّعة فقط، لا أصل قيمة السهم</span></div>
                    </div>
                  </div>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-stocks-1" />

              <section id="calculator">
                <h2>احسب زكاة أسهمك</h2>
                <p>اختر النوع الصحيح حسب نيتك الحقيقية من الشراء:</p>
                <ZakatStocksCalculator livePrices={livePrices} />
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  تريد حساب زكاة أموالك الأخرى (نقد، ذهب، عروض تجارة) معها في مكان واحد؟ استخدم{' '}
                  <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>. تملك أيضاً بضاعة أو
                  مخزوناً تجارياً؟ استخدم <Link href={TRADE_PAGE.href}>{TRADE_PAGE.shortLabel}</Link>.
                  ولماذا نصاب الأسهم دائماً على أساس الفضة؟ راجع{' '}
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
                  <li><a href="https://binbaz.org.sa/fatwas/2569" target="_blank" rel="noreferrer">موقع الشيخ ابن باز — حكم زكاة الأموال في المساهمات التجارية والاستثمارية</a></li>
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
            <AdBlogSidebar slotId="sidebar-zakat-stocks-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
