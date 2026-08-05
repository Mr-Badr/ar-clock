import Link from 'next/link';
import { Storefront } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import StoreProfitMarginCalculator from '@/components/tools-v2/StoreProfitMarginCalculator.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'store-profit-margin');

const TOC_ITEMS = [
  ['why', 'لماذا الهامش الظاهري يخدعك'],
  ['calculator', 'احسب هامشك الحقيقي'],
  ['fees', 'عمولات سلة وزد الفعلية'],
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
  { route: pickGuides(['shipping-cost-comparison'])[0], reason: 'تكلفة الشحن جزء من هامشك — قارن الناقلين' },
  { route: pickGuides(['zatca-eligibility'])[0], reason: 'تحقق من التزامك الضريبي وأنت تخطط لهامشك' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم عمولة سلة على كل عملية بيع؟',
    answer: 'سلة تأخذ 2.5% من قيمة كل عملية بيع تتم عبر بوابات الدفع المدمجة في المنصة — هذا غير رسوم بوابة الدفع نفسها التي قد تُحتسب بشكل منفصل حسب مزوّد الدفع.',
  },
  {
    question: 'كم عمولة زد؟',
    answer: 'زد تأخذ 3% من قيمة عملية البيع تقريباً. تحقق دائماً من اتفاقيتك الفعلية مع المنصة، فقد تختلف النسبة حسب باقة اشتراكك أو اتفاقيات خاصة.',
  },
  {
    question: 'لماذا هامش الربح الذي أحسبه يدوياً يبدو دائماً أعلى من الواقع؟',
    answer: 'غالباً لأن الحساب اليدوي يقتصر على "سعر البيع ناقص تكلفة المنتج" فقط، متجاهلاً عمولة المنصة ورسوم بوابة الدفع وتكلفة الشحن التي يتحملها المتجر — هذه التكاليف مجتمعة قد تلتهم 5-10% إضافية من كل عملية بيع.',
  },
  {
    question: 'هل رسوم بوابة الدفع تُخصم دائماً؟',
    answer: 'نعم، أي عملية دفع إلكتروني (بطاقة، Apple Pay، مدى) تمر عبر بوابة دفع تفرض رسوماً — تختلف النسبة حسب مزوّد الخدمة، لذا عدّل الرقم في الأداة أعلاه ليطابق اتفاقيتك الفعلية بدل الاعتماد على رقم عام.',
  },
];

export default function StoreProfitMarginPage() {
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

      <ToolTopAdSlot slotId="top-store-profit-margin" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">تجارة إلكترونية — حاسبة</span>
              <h1>حاسبة هامش ربح متجرك: بعد عمولة سلة أو زد فعلياً</h1>
              <p className="guide-v2-lead">
                معظم الحاسبات تتجاهل عمولة منصتك — هذه تحسبها فعلياً حسب سلة أو زد، مع رسوم بوابة
                الدفع وتكلفة الشحن، لتعرف صافي ربحك الحقيقي.
              </p>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا الهامش الظاهري يخدعك</h2>
                <p>
                  إذا بعت منتجاً بـ100 ريال تكلفته 40 ريالاً، يبدو هامشك 60%. لكن بعد خصم عمولة
                  المنصة (2.5-3%) ورسوم بوابة الدفع (عادة حول 2.75%) وتكلفة الشحن إن تحمّلتها،
                  هامشك الفعلي قد ينخفض إلى 50% أو أقل — فرق كبير عند حساب أرباحك الشهرية الحقيقية.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-store-profit-margin" />

              <section id="calculator">
                <h2>احسب هامشك الحقيقي</h2>
                <StoreProfitMarginCalculator />
              </section>

              <section id="fees">
                <h2>عمولات سلة وزد الفعلية</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">سلة</span><span className="guide-v2-compare-badge">2.5%</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عمولة على عمليات البيع عبر بوابات الدفع المدمجة، بالإضافة لباقات اشتراك شهرية منفصلة حسب حجم متجرك.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">زد</span><span className="guide-v2-compare-badge">~3%</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>نسبة قريبة من سلة، مع اختلافات محتملة حسب باقتك — تحقق دائماً من لوحة تحكم متجرك لرقمك الدقيق.</p>
                  </div>
                </div>
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
                    <a href="https://help.salla.sa/" target="_blank" rel="noreferrer">مركز مساعدة سلة — رسوم وعمولات المنصة</a>
                  </li>
                </ul>
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
            <AdBlogSidebar slotId="sidebar-store-profit-margin" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
