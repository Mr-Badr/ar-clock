import Link from 'next/link';
import { Truck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import ShippingCarrierChecker from '@/components/tools-v2/ShippingCarrierChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'shipping-cost-comparison');

const TOC_ITEMS = [
  ['compare', 'مقارنة سريعة'],
  ['checker', 'أيهما يناسب متجرك؟'],
  ['factors', 'ماذا يحدد تكلفة الشحن فعلياً'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function pickGuides(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_GUIDES = [
  { route: pickGuides(['store-profit-margin'])[0], reason: 'أدخل تكلفة الشحن التي اخترتها لتحسب هامشك الحقيقي' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'أيهما أرخص، أرامكس أم سمسا؟',
    answer: 'لا يوجد جواب واحد ثابت — يعتمد على وزن الشحنة، الوجهة، وحجم الاتفاقية بينك وبين الناقل. سمسا غالباً أوفر للشحن المحلي داخل السعودية، وأرامكس أقوى في الشحن الدولي. اطلب عرض سعر فعلياً من الاثنين لحجم شحناتك المتوقع قبل القرار النهائي.',
  },
  {
    question: 'هل يمكنني الحصول على أسعار أرخص عبر سلة أو زد؟',
    answer: 'نعم — كل من سلة وزد لديهما اتفاقيات أسعار مخفّضة مسبقة مع شركات الشحن (تشمل سمسا وغيرها) متاحة تلقائياً للمتاجر المسجّلة على المنصة، وعادة أرخص من التعامل المباشر مع الناقل كفرد.',
  },
  {
    question: 'ما الفرق بين الشحن المحلي والدولي من ناحية اختيار الناقل؟',
    answer: 'للشحن المحلي داخل السعودية، الشبكة الواسعة والانتشار الجغرافي هما الأهم (تميّز سمسا هنا). للشحن الدولي، الخبرة الجمركية والشراكات العالمية أهم بكثير (تميّز أرامكس هنا) — اختيار الناقل الخطأ لنوع شحنتك يكلفك وقتاً وتكلفة إضافية.',
  },
  {
    question: 'هل تدعم الشركتان الدفع عند الاستلام؟',
    answer: 'نعم، كلا الناقلين يدعمان خدمة الدفع عند الاستلام (COD) وهي شائعة جداً في السوق السعودي — لكن رسوم هذه الخدمة ومدة تحويل المبلغ لحسابك تختلف، فتحقق منها ضمن عرض السعر الذي تطلبه.',
  },
];

export default function ShippingCostComparisonPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التجارة الإلكترونية', item: `${SITE_URL}/tools/ecommerce` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: PAGE.heroTitle,
    description: PAGE.description,
    inLanguage: 'ar',
    mainEntityOfPage: `${SITE_URL}${PAGE.href}`,
    keywords: PAGE.keywords,
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'ميقاتنا',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-shipping-cost-comparison" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">تجارة إلكترونية — مقارنة</span>
              <h1>أرامكس أم سمسا؟ مقارنة محايدة لاختيار شركة الشحن</h1>
              <p className="guide-v2-lead">
                لا يوجد "أفضل" مطلق — الاختيار الصحيح يعتمد على وجهة شحناتك وأولويتك. قارن الاثنين
                هنا، ثم احصل على توصية مباشرة لحالتك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Truck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>سمسا</strong> عادة أقوى للشحن المحلي السريع داخل السعودية —
                  <strong> أرامكس</strong> عادة أقوى للشحن الدولي وخارج الخليج.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="compare">
                <h2>مقارنة سريعة</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">سمسا</span><span className="guide-v2-compare-badge">الأفضل للشحن المحلي</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>انتشار جغرافي واسع داخل السعودية، أسعار تنافسية للشحن المحلي، الأكثر استخداماً من متاجر سلة وزد.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">أرامكس</span><span className="guide-v2-compare-badge">الأفضل للشحن الدولي</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>شبكة لوجستية دولية ناضجة، خبرة جمركية أعمق، تغطية جغرافية واسعة خارج الخليج.</p>
                  </div>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-shipping-cost-comparison" />

              <section id="checker">
                <h2>أيهما يناسب متجرك؟</h2>
                <ShippingCarrierChecker />
              </section>

              <section id="factors">
                <h2>ماذا يحدد تكلفة الشحن فعلياً</h2>
                <ul>
                  <li><strong>الوزن والأبعاد:</strong> الشحنات الأثقل أو الكبيرة الحجم (Volumetric Weight) تُحتسب بسعر أعلى، وأحياناً حسب الأكبر بين الوزن الفعلي والحجمي.</li>
                  <li><strong>الوجهة:</strong> التوصيل داخل نفس المدينة أرخص من التوصيل بين المدن، والدولي أغلى من الخليجي.</li>
                  <li><strong>حجم شحناتك الشهري:</strong> المتاجر التي تشحن بكميات كبيرة تحصل عادة على أسعار تعاقدية أقل من الأسعار المعلنة للأفراد.</li>
                  <li><strong>خدمات إضافية:</strong> الدفع عند الاستلام، التأمين على الشحنة، أو التوصيل السريع (Express) كلها ترفع التكلفة الأساسية.</li>
                </ul>
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
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في التجارة الإلكترونية</p>
                <div className="guide-v2-related-grid">
                  {RELATED_GUIDES.map(({ route, reason }) => (
                    <Link key={route.slug} href={route.href} className="guide-v2-related-tile">
                      <p className="guide-v2-related-tile-title">{route.shortLabel}</p>
                      <p className="guide-v2-related-tile-reason">{reason}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-shipping-cost-comparison" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
