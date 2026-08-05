import Link from 'next/link';
import { Lightning } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import InverterSavingsCalculator from '@/components/tools-v2/InverterSavingsCalculator.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'inverter-savings');
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['how', 'كيف يوفر الانفرتر كهرباء فعلياً؟'],
  ['calculator', 'احسب توفيرك'],
  ['compare', 'مقارنة سريعة'],
  ['refrigerant', 'غاز R32 مقابل R410A'],
  ['faq', 'الأسئلة الشائعة'],
];

const COMPARE_ROWS = [
  ['طريقة التشغيل', 'يضبط سرعة الضاغط باستمرار حسب الحاجة'],
  ['استهلاك الكهرباء', 'أقل بنسبة 30-50% تقريباً للمساحة نفسها'],
  ['الصوت', 'أهدأ — لا صدمة تشغيل/إيقاف مفاجئة'],
  ['العمر الافتراضي', 'أطول عادة، وأعطال أقل تكراراً'],
  ['السعر الأولي', 'أعلى من العادي للحجم نفسه'],
];
const COMPARE_ROWS_NORMAL = [
  ['طريقة التشغيل', 'يعمل بتشغيل وإيقاف متكرر للضاغط للحفاظ على الحرارة'],
  ['استهلاك الكهرباء', 'أعلى — كل عملية إعادة تشغيل تسحب تياراً إضافياً'],
  ['الصوت', 'صوت "طنين" ملحوظ عند التشغيل والإيقاف'],
  ['العمر الافتراضي', 'أقصر نسبياً بسبب دورات التشغيل/الإيقاف المتكررة'],
  ['السعر الأولي', 'أقل — خيار اقتصادي عند الشراء فقط'],
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
  { route: pickGuides(['ac-types'])[0], reason: 'قبل أن تشتري، اعرف أي شكل مكيف يناسب مساحتك أصلاً' },
  { route: pickGuides(['energy-label'])[0], reason: 'الانفرتر عامل واحد فقط — بطاقة كفاءة الطاقة تعطيك رقماً رسمياً أدق' },
  { route: pickGuides(['replace-or-repair'])[0], reason: 'مكيفك القديم عادي؟ اعرف هل الاستبدال بانفرتر يستحق الآن' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين مكيف انفرتر ومكيف عادي بالضبط؟',
    answer: 'المكيف العادي يشغّل الضاغط بكامل قوته ثم يوقفه تماماً عند الوصول للحرارة المطلوبة، ويكررها باستمرار. المكيف الانفرتر يضبط سرعة الضاغط تصاعدياً وتنازلياً حسب الحاجة الفعلية دون إيقاف كامل، فيستهلك كهرباء أقل ويحافظ على حرارة أكثر ثباتاً.',
  },
  {
    question: `هل مكيف انفرتر يستحق فرق السعر في ${CURRENT_YEAR}؟`,
    answer: 'في أغلب حالات الاستخدام اليومي بالخليج (تشغيل عدة ساعات يومياً معظم أيام السنة)، نعم — فرق السعر الأولي يُستَرد عادة خلال 2-4 سنوات من فاتورة الكهرباء الأقل، ثم يستمر التوفير طوال عمر الجهاز. استخدم أداة الحساب أعلى الصفحة لمعرفة رقمك التقديري الفعلي.',
  },
  {
    question: 'كم يستهلك المكيف الانفرتر من الكهرباء مقارنة بالعادي؟',
    answer: 'التوفير التقديري الشائع يتراوح بين 30% و50% حسب حجم المكيف وساعات التشغيل ودرجة الحرارة الخارجية. أدخل بيانات مكيفك الفعلية في أداة الحساب أعلى الصفحة للحصول على رقم حقيقي بعملتك، لا نسبة عامة فقط.',
  },
  {
    question: 'أيهما أفضل غاز R32 أم R410A؟',
    answer: 'R32 أحدث وأكثر كفاءة (يحتاج كمية غاز أقل وينقل الحرارة بشكل أفضل) وأقل ضرراً بيئياً، والسوق العالمي يتجه إليه تدريجياً. R410A ما زال منتشراً وغير قابل للاشتعال، لكن كفاءته أقل قليلاً. لا يمكن تحويل جهاز مصمم لغاز معيّن إلى غاز آخر — النوع يُحدَّد عند شراء الجهاز نفسه.',
  },
  {
    question: 'هل المكيف الانفرتر يحتاج صيانة مختلفة عن العادي؟',
    answer: 'لا، نفس مبدأ الصيانة الدورية (تنظيف الفلتر، فحص الغاز، تنظيف الوحدة الخارجية) ينطبق على الاثنين بنفس الجدول تقريباً. راجع دليل جدول صيانة المكيف لمعرفة التوقيت المناسب لبيئتك.',
  },
];

export default function InverterSavingsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التكييف', item: `${SITE_URL}/tools/hvac` },
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

      <ToolTopAdSlot slotId="top-inverter-savings" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — احسب توفيرك</span>
              <h1>مكيف انفرتر أم عادي؟ احسب توفيرك الشهري والسنوي بعملتك</h1>
              <p className="guide-v2-lead">
                الفرق بين الانفرتر والعادي ليس مجرد كلمة تسويقية على الصندوق — هو فرق حقيقي وقابل
                للقياس في فاتورتك. هذا الدليل يشرح كيف يعمل الفرق فعلياً، ثم يعطيك أداة تحسب توفيرك
                التقديري بعملة بلدك حسب حجم مكيفك وساعات تشغيله.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Lightning size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الانفرتر يوفر عادة <strong>30-50%</strong> من استهلاك الكهرباء مقارنة بالمكيف العادي
                  للحجم نفسه، لأنه يضبط سرعة الضاغط بدل تشغيله وإيقافه بالكامل. فرق السعر الأولي
                  يُستَرد عادة خلال 2-4 سنوات من فاتورة الكهرباء الأقل، ثم يستمر التوفير طوال عمر الجهاز.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="how">
                <h2>كيف يوفر الانفرتر كهرباء فعلياً؟</h2>
                <p>
                  المكيف العادي يعمل بمبدأ "الكل أو لا شيء": الضاغط يعمل بأقصى طاقته حتى تصل الغرفة
                  للحرارة المطلوبة، ثم يتوقف تماماً، ثم يعيد التشغيل من الصفر عند ارتفاع الحرارة مجدداً
                  — وإعادة التشغيل هذه هي اللحظة التي تسحب فيها أعلى تيار كهربائي.
                </p>
                <p>
                  المكيف الانفرتر يستخدم محركاً بسرعة متغيرة يرفع وينزل قوة التبريد تدريجياً بدل
                  الإيقاف الكامل، فيحافظ على حرارة شبه ثابتة دون تكرار لحظات "الانطلاق القوي" الأكثر
                  استهلاكاً للكهرباء. هذا الفرق في السلوك هو ما يترجم إلى توفير 30-50% في الاستهلاك.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-inverter-savings" />

              <section id="calculator">
                <h2>احسب توفيرك</h2>
                <p>أدخل حجم مكيفك وساعات تشغيله وسعر الكهرباء لديك للحصول على رقم فعلي بعملتك، لا نسبة عامة:</p>
                <InverterSavingsCalculator />
              </section>

              <section id="compare">
                <h2>مقارنة سريعة</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head">
                      <span className="guide-v2-compare-title">انفرتر</span>
                      <span className="guide-v2-compare-badge">الأوفر تشغيلاً</span>
                    </div>
                    <div className="guide-v2-compare-rows">
                      {COMPARE_ROWS.map(([label, value]) => (
                        <div className="guide-v2-compare-row" key={label}>
                          <span className="guide-v2-compare-row-label">{label}</span>
                          <span className="guide-v2-compare-row-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">عادي</span></div>
                    <div className="guide-v2-compare-rows">
                      {COMPARE_ROWS_NORMAL.map(([label, value]) => (
                        <div className="guide-v2-compare-row" key={label}>
                          <span className="guide-v2-compare-row-label">{label}</span>
                          <span className="guide-v2-compare-row-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section id="refrigerant">
                <h2>غاز R32 مقابل R410A</h2>
                <p>
                  محور توفير آخر منفصل عن الانفرتر تماماً هو نوع غاز التبريد داخل الجهاز. R32 هو الجيل
                  الأحدث: مركّب واحد (وليس خليطاً كـR410A)، ينقل الحرارة بكفاءة أعلى، يحتاج كمية غاز
                  أقل بنحو 30%، وأثره على الاحتباس الحراري أقل بكثير. R410A ما زال الأكثر انتشاراً
                  وغير قابل للاشتعال، لكن السوق العالمي يتحول تدريجياً نحو R32 بسبب كفاءته الأعلى.
                </p>
                <p>
                  لا يمكن "تحديث" جهاز يعمل بغاز معيّن ليعمل بغاز آخر — هذا يُحدَّد عند تصنيع الجهاز
                  نفسه، فتحقق من نوع الغاز في مواصفات أي مكيف جديد تفكر بشرائه إن كانت الكفاءة أولوية
                  لك.
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
                    <a href="https://takyf.com/%D8%A7%D9%84%D9%81%D8%B1%D9%82-%D9%81%D9%8A-%D8%A7%D8%B3%D8%AA%D9%87%D9%84%D8%A7%D9%83-%D8%A7%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81/" target="_blank" rel="noreferrer">تكييفات كاريير وميديا — الفرق في استهلاك الكهرباء بين الانفرتر والعادي</a>
                  </li>
                  <li>
                    <a href="https://blog.totalhomesupply.com/r32-vs-r410a-refrigerant/" target="_blank" rel="noreferrer">Total Home Supply — R32 vs R410A Refrigerant</a>
                  </li>
                  <li>
                    <a href="https://www.voltiat.com/the-difference-between-r32-and-r410a/" target="_blank" rel="noreferrer">فولتيات — الفرق بين R32 وR410A</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في التكييف</p>
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
            <AdBlogSidebar slotId="sidebar-inverter-savings" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
