import Link from 'next/link';
import { Package, ShieldCheck } from '@phosphor-icons/react/ssr';

import ZakatTradeGoodsCalculator from '@/components/calculators/ZakatTradeGoodsCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');
const STOCKS_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');

const TOC_ITEMS = [
  ['what', 'ما هي عروض التجارة'],
  ['calculator', 'احسب زكاة نشاطك التجاري'],
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
    question: 'ما هي عروض التجارة في الزكاة؟',
    answer:
      'كل ما اشتريته أو أنتجته بقصد إعادة بيعه لتحقيق ربح — بضاعة المتجر، وحدات عقارية معدّة للبيع، سيارات معروضة للبيع في معرض، وما شابه. لا يدخل في ذلك الأصول التي تستخدمها لإدارة النشاط دون بيعها (المحل نفسه، الرفوف، السيارة التي توصّل بها الطلبات).',
  },
  {
    question: 'كيف أقيّم بضاعتي لحساب الزكاة؟',
    answer:
      'بسعر البيع الحالي في السوق (القيمة السوقية العادلة) يوم وجوب الزكاة، لا بسعر الشراء الأصلي ولا بسعر التكلفة. إن كان لديك بضاعة قديمة انخفضت قيمتها السوقية، احسب بسعرها الحالي الفعلي لا سعر شرائها.',
  },
  {
    question: 'هل تدخل معدات المحل وأثاثه في زكاة عروض التجارة؟',
    answer:
      'لا، الأصول الثابتة المستخدَمة في تشغيل النشاط (المحل، الرفوف، أجهزة الكاشير، السيارات المستخدَمة للتوصيل) لا تدخل في وعاء زكاة عروض التجارة لأنها ليست معدّة للبيع — العبرة بما هو مخصص للبيع فعلياً.',
  },
];

export default async function ZakatTradeGoodsCalculatorPage() {
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

      <ToolTopAdSlot slotId="top-zakat-trade-goods-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — عروض التجارة</span>
              <h1>حاسبة زكاة عروض التجارة والمخزون التجاري</h1>
              <p className="guide-v2-lead">
                احسب زكاة بضاعتك ومخزونك التجاري بسعر البيع الحالي، بعد خصم ديون النشاط — لأصحاب
                المتاجر والمشاريع التجارية الصغيرة والمتوسطة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Package size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  زكاة عروض التجارة ربع العشر (2.5%) من القيمة السوقية الحالية للبضاعة المعدّة
                  للبيع + النقد والمستحقات، بعد خصم ديون النشاط — إذا بلغ المجموع النصاب ومرّ عليه
                  حول هجري كامل.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هي عروض التجارة</h2>
                <p>
                  عروض التجارة هي كل ما اشتراه أو أنتجه صاحب النشاط بقصد إعادة بيعه لتحقيق ربح —
                  وليس كل ما يملكه النشاط. الأصول الثابتة (المحل، المعدات، السيارات المستخدمة
                  للتشغيل) خارج وعاء هذه الزكاة تماماً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-zakat-trade-1" />

              <section id="calculator">
                <h2>احسب زكاة نشاطك التجاري</h2>
                <ZakatTradeGoodsCalculator livePrices={livePrices} />
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  لديك أيضاً ذهب أو أسهم أو أموال شخصية تريد ضمها لحساب زكاتك الكاملة؟ استخدم{' '}
                  <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>. نشاطك يشمل أسهماً
                  متداولة أيضاً؟ استخدم <Link href={STOCKS_PAGE.href}>{STOCKS_PAGE.shortLabel}</Link>.
                  للفروق الفقهية بين المذاهب في قياس وعاء الزكاة، راجع{' '}
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
                  <li><a href="https://binbaz.org.sa/fatwas/5827" target="_blank" rel="noreferrer">موقع الشيخ ابن باز — كيفية زكاة من عنده بضاعة، وله وعليه ديون</a></li>
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
            <AdBlogSidebar slotId="sidebar-zakat-trade-goods-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
