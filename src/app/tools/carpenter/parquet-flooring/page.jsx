import Link from 'next/link';
import { Drop, SquaresFour, TreeStructure } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import FlooringTypeChecker from '@/components/tools-v2/FlooringTypeChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'parquet-flooring');

const TOC_ITEMS = [
  ['types', 'أنواع الباركيه وأسعارها المرجعية'],
  ['checker', 'أي نوع أرضية يناسبك؟'],
  ['maintenance', 'الفرق في الصيانة بين الأنواع'],
  ['faq', 'الأسئلة الشائعة'],
];

const TYPES = [
  { icon: TreeStructure, title: 'باركيه طبيعي', facts: ['خشب حقيقي 100٪', 'نطاق مرجعي: نحو 300 ريال/م²', 'يمكن صنفرته وتلميعه لعقود'] },
  { icon: SquaresFour, title: 'باركيه HDF', facts: ['ألياف خشب مضغوطة بطبقة تصميم علوية', 'نطاق مرجعي: نحو 70 ريال/م²', 'مقاوم للخدش أفضل من الطبيعي'] },
  { icon: Drop, title: 'أرضية SPC', facts: ['مركّب حجري-بلاستيكي، ليس خشباً فعلياً', 'نطاق مرجعي قريب من HDF', 'المقاوم الوحيد للماء فعلياً بين الثلاثة'] },
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
  { route: pickGuides(['wood-types'])[0], reason: 'الباركيه الطبيعي مصنوع من نفس أنواع الخشب — قارنها هنا' },
  { route: pickGuides(['furniture-care'])[0], reason: 'نفس مبادئ العناية بالأثاث الخشبي تنطبق على الباركيه الطبيعي' },
  { route: pickGuides(['wood-problems'])[0], reason: 'خدوش أو بهتان بالأرضية؟ نفس الحلول المنزلية تصلح غالباً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين الباركيه الطبيعي واللامينيت (HDF)؟',
    answer: 'الطبيعي خشب حقيقي بالكامل — أغلى وأفخم، ويمكن صنفرته وإعادة تلميعه لعقود عند تضرره. HDF ألياف خشب مضغوطة عليها طبقة تصميم تحاكي مظهر الخشب — أرخص بكثير وأكثر مقاومة للخدش اليومي، لكن لا يمكن ترميمه بنفس الطريقة عند تضرره بعمق.',
  },
  {
    question: 'هل الباركيه يتحمل الماء؟',
    answer: 'الباركيه الطبيعي وHDF كلاهما يتضرران من التعرض المتكرر للماء أو الرطوبة العالية — لا يُنصح بهما في الحمامات أو المطابخ المعرّضة لانسكاب متكرر. أرضيات SPC هي الخيار المقاوم للماء فعلياً بين الأنواع الثلاثة لهذه المناطق تحديداً.',
  },
  {
    question: 'كم سعر متر الباركيه في السعودية؟',
    answer: 'يتراوح تقريباً من 50 ريال للمتر (اقتصادي) إلى 70 ريال (HDF متوسط شامل التركيب) إلى نحو 300 ريال للمتر (طبيعي فاخر كالبلوط) — أرقام مرجعية من السوق الحالي تختلف حسب المدينة والموديل، اطلب عرض سعر حقيقي دائماً.',
  },
  {
    question: 'أيهما أنسب للاستخدام اليومي المكثف؟',
    answer: 'HDF بسماكة 12 مم فأكثر يقاوم الخدش والاحتكاك اليومي أفضل من الباركيه الطبيعي عملياً، وهو الخيار الأشيع حالياً للمساحات كثيرة الاستخدام كالممرات وغرف المعيشة العائلية.',
  },
];

export default function ParquetFlooringPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'النجارة', item: `${SITE_URL}/tools/carpenter` },
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

      <ToolTopAdSlot slotId="top-parquet-flooring" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — دليل شراء</span>
              <h1>أنواع الباركيه: مقارنة محايدة بين الطبيعي وHDF وSPC</h1>
              <p className="guide-v2-lead">
                "باركيه" اسم يُستخدم لثلاثة منتجات مختلفة تماماً في التركيب والمتانة والسعر. هذا
                الدليل يوضح الفرق الحقيقي بينها، بعيداً عن تسويق شركات الأرضيات.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><SquaresFour size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>مساحات جافة فاخرة:</strong> باركيه طبيعي. <strong>استخدام يومي مكثف
                  (أطفال، حركة عالية):</strong> HDF. <strong>مطبخ أو حمام أو أي مكان قرب الماء:</strong>{' '}
                  SPC — المقاوم الوحيد للماء فعلياً بين الثلاثة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع الباركيه وأسعارها المرجعية</h2>
                <div className="guide-v2-type-grid">
                  {TYPES.map((t) => (
                    <div className="guide-v2-type-card" key={t.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <t.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{t.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {t.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginTop: 'var(--space-3)' }}>
                  الأرقام مرجعية من السوق السعودي الحالي، وتختلف حسب المدينة والموديل — اطلب عرض سعر حقيقي دائماً قبل الشراء.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-parquet-flooring" />

              <section id="checker">
                <h2>أي نوع أرضية يناسبك؟</h2>
                <p>اختر وصف حالتك الأقرب:</p>
                <FlooringTypeChecker />
              </section>

              <section id="maintenance">
                <h2>الفرق في الصيانة بين الأنواع</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">طبيعي</span><span className="guide-v2-compare-badge">قابل للترميم</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>يحتاج تلميعاً دورياً بمواد مخصصة، لكن يمكن صنفرته وإعادة طلائه بالكامل عند التضرر — عمره الافتراضي الأطول بين الثلاثة.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">HDF</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>تنظيف بمسح جاف أو رطب خفيف كافٍ عادة. لا يمكن ترميمه بالصنفرة — الضرر العميق يعني استبدال القطعة المتضررة بالكامل.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">SPC</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>الأسهل صيانة — يتحمل المسح المبلل بالكامل دون قلق، مناسب تماماً للمساحات التي تحتاج تنظيفاً متكرراً.</p>
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
                    <a href="https://makkahexperts.com/blog/parquet-types-guide/" target="_blank" rel="noreferrer">Makkah Experts — أنواع الباركيه: مقارنة بين الخشب وHDF واللامينيت</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في النجارة</p>
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
            <AdBlogSidebar slotId="sidebar-parquet-flooring" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
