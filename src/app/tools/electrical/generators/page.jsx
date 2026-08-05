import Link from 'next/link';
import { Gauge, Lightning, Phone, SquaresFour, Warning } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import GeneratorSizeChecker from '@/components/tools-v2/GeneratorSizeChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'generators');
const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = CURRENT_YEAR + 1;

const TOC_ITEMS = [
  ['sizing', 'كيف تختار الحجم المناسب؟'],
  ['fuel-type', 'بنزين أم ديزل أم غاز؟'],
  ['safety', 'السلامة أولاً'],
  ['buying-tips', 'نصائح قبل الشراء'],
  ['faq', 'الأسئلة الشائعة'],
];

const FUEL_TYPES = [
  {
    title: 'ديزل',
    badge: 'الأوفر تشغيلاً',
    rows: [
      ['تكلفة التشغيل', 'أقل — الديزل أرخص لكل كيلوواط/ساعة'],
      ['العمر الافتراضي', 'أطول — محركات الديزل مصممة للعمل الطويل'],
      ['السعر الأولي', 'أعلى من البنزين للحجم نفسه'],
      ['الأنسب لـ', 'استخدام متكرر أو تشغيل لساعات طويلة'],
    ],
  },
  {
    title: 'بنزين',
    rows: [
      ['تكلفة التشغيل', 'أعلى نسبياً لكل ساعة تشغيل'],
      ['السعر الأولي', 'أقل — خيار اقتصادي للاستخدام المتقطع'],
      ['الصيانة', 'أبسط ومتوفرة في أغلب الورش'],
      ['الأنسب لـ', 'انقطاعات قصيرة ومتفرقة، أو الاستخدام المتنقل'],
    ],
  },
  {
    title: 'غاز طبيعي / بروبان',
    rows: [
      ['الاعتمادية', 'يعمل طالما خط الغاز متصل — لا حاجة لتخزين وقود'],
      ['الانبعاثات', 'أنظف احتراقاً من الديزل والبنزين'],
      ['التوفر', 'يحتاج خط تغذية غاز ثابت — غير مناسب لكل موقع'],
      ['الأنسب لـ', 'التركيب الثابت للمنزل مع خط غاز جاهز'],
    ],
  },
];

const BUYING_TIPS = [
  { title: 'ماركة معروفة بتوفر قطع الغيار', body: 'مولد بلا قطع غيار متاحة محلياً يتحول لعبء عند أول عطل. اسأل عن توفر الصيانة وقطع الغيار في مدينتك قبل الشراء، لا بعده.' },
  { title: 'مستوى الضوضاء (ديسيبل)', body: 'المولدات "الكاتمة للصوت" أغلى لكنها ضرورية إذا كان المولد قريباً من غرف النوم أو الجيران. اسأل عن رقم الديسيبل عند مسافة 7 أمتار، لا عن وصف عام مثل "هادئ".' },
  { title: 'اختر حجماً أكبر قليلاً من حسابك', body: 'حساب الحمل بالضبط ثم شراء نفس الرقم يترك صفر هامش لإضافة جهاز جديد لاحقاً أو لتذبذب التيار عند بدء تشغيل جهاز. زيادة 20-30% عن الرقم المحسوب هي الممارسة المتبعة فعلياً لدى بائعي المولدات.' },
  { title: 'تحقق من نوع القاطع والتأريض', body: 'مولد بلا قاطع حماية داخلي أو تأريض صحيح يعرّض أجهزتك للتلف عند تذبذب الجهد. هذه نقطة تفتيش أساسية، لا رفاهية إضافية.' },
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
  { route: pickGuides(['breaker-panel'])[0], reason: 'لتوصيل المولد بأمان عبر لوحة تحويل مناسبة', icon: SquaresFour },
  { route: pickGuides(['meter'])[0], reason: 'إذا كان سبب بحثك أصلاً ارتفاع فاتورة الكهرباء لا الانقطاع', icon: Gauge },
  { route: pickGuides(['emergency-numbers'])[0], reason: 'اتصل بشركة الكهرباء أولاً قبل افتراض أن العطل من عندك', icon: Phone },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: `كم حجم مولد الكهرباء المناسب للمنزل ${CURRENT_YEAR}؟`,
    answer: 'اجمع واط الأجهزة التي تريد تشغيلها فعلياً أثناء الانقطاع (وليس كل أجهزة المنزل)، ثم أضف هامش أمان 25-30% لتغطية تيار بدء التشغيل، خاصة إن كان بينها مكيف أو مضخة مياه. استخدم أداة الحساب أعلى هذه الصفحة للحصول على رقم مباشر بالكيلو فولت أمبير (kVA) بدل التخمين.',
  },
  {
    question: 'هل مولد الديزل أفضل من مولد البنزين؟',
    answer: 'يعتمد على نمط استخدامك. الديزل أوفر في التشغيل الطويل أو المتكرر وعمره الافتراضي أطول، لكن سعره الأولي أعلى. البنزين أرخص عند الشراء وأبسط في الصيانة، وهو خيار منطقي لانقطاعات قصيرة ومتفرقة لا تتكرر كثيراً.',
  },
  {
    question: 'كم تكلفة مولد كهرباء منزلي؟',
    answer: 'لا يوجد رقم ثابت — السعر يتغير حسب الحجم بالكيلو فولت أمبير، نوع الوقود، الماركة، ومستوى عزل الصوت. المولدات الصغيرة (2-5 كيلو) أرخص بكثير من مولدات المنزل الكامل (10 كيلو فأكثر). استخدم أداة الحساب أعلى الصفحة لمعرفة الحجم أولاً، فهو ما يحدد نطاق السعر المناسب لك.',
  },
  {
    question: 'هل يمكن تشغيل المولد داخل المنزل أو الجراج المغلق؟',
    answer: 'لا، أبداً. جميع المولدات التي تعمل بالاحتراق (بنزين أو ديزل) تصدر غاز أول أكسيد الكربون، وهو عديم الرائحة واللون وقاتل في الأماكن المغلقة. شغّل المولد دائماً في مكان مفتوح جيد التهوية، بعيداً عن النوافذ والأبواب، مهما كانت الظروف الجوية.',
  },
  {
    question: 'ما الفرق بين مولد كهرباء منزلي ومولد كاتم للصوت؟',
    answer: 'المولد الكاتم (Silent/Soundproof) له هيكل عازل يقلل الضوضاء بشكل كبير مقارنة بالمولد المفتوح العادي، وهو ضروري إذا كان موقع التركيب قريباً من غرف النوم أو المنازل المجاورة. الفارق ينعكس في السعر — المولد الكاتم أغلى للحجم نفسه.',
  },
  {
    question: 'هل يحتاج المولد المنزلي تأريضاً؟',
    answer: 'نعم. التأريض الصحيح يحمي أجهزتك الكهربائية من تلف مفاجئ عند تذبذب الجهد ويحميك أنت من خطر الصعق. تأكد أن المولد أو لوحة التحويل المرتبطة به لديها نقطة تأريض واضحة قبل توصيله بأي جهاز حساس.',
  },
  {
    question: `أي مولد كهرباء ${NEXT_YEAR} يستحق الشراء المبكر بدل الانتظار؟`,
    answer: 'إذا كانت منطقتك تشهد انقطاعات متكررة موسمياً (صيفاً غالباً بسبب ضغط التكييف على الشبكة)، فشراء المولد قبل الموسم أفضل من الانتظار حتى ترتفع الأسعار مع زيادة الطلب. القاعدة نفسها تنطبق كل عام تقريباً.',
  },
];

export default function GeneratorsGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الكهرباء', item: `${SITE_URL}/tools/electrical` },
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

      <ToolTopAdSlot slotId="top-generators" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل كهرباء — دليل شراء</span>
              <h1>أي مولد كهرباء يناسب منزلك؟ الحجم والوقود والسعر</h1>
              <p className="guide-v2-lead">
                شراء مولد أصغر من حاجتك يعني أجهزة تتوقف عند أول انقطاع، وشراء مولد أكبر بكثير يعني
                مالاً ووقوداً مهدوراً. هذا الدليل يشرح كيف تحسب الحجم الصحيح بالواط، متى تختار
                ديزل أو بنزين أو غاز، وأهم نقاط السلامة قبل أول تشغيل.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Lightning size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  اجمع واط الأجهزة التي تحتاجها فعلاً وقت الانقطاع، أضف <strong>هامش أمان 25-30%</strong>{' '}
                  لتيار بدء التشغيل، ثم اختر أقرب حجم تجاري أعلى — لا الأقرب الأدنى. الديزل أوفر
                  للاستخدام المتكرر، والبنزين أنسب للانقطاعات القصيرة والمتفرقة. ولا تشغّل المولد
                  أبداً داخل مكان مغلق.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="sizing">
                <h2>كيف تختار الحجم المناسب؟</h2>
                <p>
                  أكثر خطأ شائع هو الحكم على المولد بحجمه العام ("مولد كبير" أو "مولد صغير") بدل
                  حساب الواط الفعلي. القاعدة العملية: اجمع الأجهزة التي تريدها أن تعمل أثناء
                  الانقطاع فقط — لا كل أجهزة المنزل — ثم أضف هامشاً لتيار بدء التشغيل، لأن المكيفات
                  والمضخات تسحب تياراً أعلى بكثير للحظات عند بدء الدوران مقارنة بتشغيلها المستمر.
                </p>

                <GeneratorSizeChecker />

                <p>
                  اختيار مولد أكبر قليلاً من الرقم المحسوب فكرة جيدة دائماً — يمنحك هامشاً لإضافة
                  جهاز جديد لاحقاً بدل شراء مولد ثانٍ بعد أشهر قليلة.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-generators" />

              <section id="fuel-type">
                <h2>بنزين أم ديزل أم غاز؟</h2>
                <p>
                  لا يوجد نوع وقود "أفضل" بإطلاق — القرار يعتمد على مدى تكرار استخدامك للمولد
                  ومدة كل تشغيل:
                </p>
                <div className="guide-v2-compare-list">
                  {FUEL_TYPES.map((fuel) => (
                    <div className={`guide-v2-compare-card${fuel.badge ? ' is-recommended' : ''}`} key={fuel.title}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{fuel.title}</span>
                        {fuel.badge ? <span className="guide-v2-compare-badge">{fuel.badge}</span> : null}
                      </div>
                      <div className="guide-v2-compare-rows">
                        {fuel.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="safety">
                <h2>السلامة أولاً</h2>
                <p>
                  المولدات التي تعمل بالاحتراق (بنزين أو ديزل) تصدر غاز أول أكسيد الكربون — عديم
                  الرائحة واللون، وقاتل في الأماكن المغلقة خلال دقائق معدودة.
                </p>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    لا تشغّل المولد أبداً داخل المنزل أو الجراج أو أي مساحة مغلقة، حتى مع فتح
                    الأبواب والنوافذ. ضعه دائماً في مكان مفتوح جيد التهوية، وعلى مسافة كافية من
                    النوافذ والفتحات.
                  </span>
                </div>
                <p>
                  تأكد أيضاً من التأريض الصحيح للمولد أو للوحة التحويل المرتبطة به — تذبذب الجهد
                  بدون تأريض قد يتلف أجهزتك الحساسة (مكيفات، ثلاجات، إلكترونيات) قبل أن تلاحظ
                  المشكلة.
                </p>
              </section>

              <section id="buying-tips">
                <h2>نصائح قبل الشراء</h2>
                <div className="guide-v2-compare-list">
                  {BUYING_TIPS.map((t) => (
                    <div className="guide-v2-compare-card" key={t.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{t.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{t.body}</p>
                    </div>
                  ))}
                </div>
                <blockquote className="guide-v2-pullquote">
                  <p>مولد بلا قطع غيار متاحة في مدينتك ليس صفقة رابحة، مهما بدا سعره جيداً.</p>
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
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://www.genpower.com/ar/frequently-asked-questions-detail/what-should-i-consider-when-buying-a-generator" target="_blank" rel="noreferrer">Genpower — ما الذي يجب مراعاته عند شراء مولد</a>
                    {' '}— معايير اختيار الحجم ونوع الوقود من جهة تصنيع مولدات.
                  </li>
                  <li>
                    <a href="https://www.total-jo.com/post/%D9%83%D9%8A%D9%81%D9%8A%D8%A9-%D8%AD%D8%B3%D8%A7%D8%A8-%D8%AD%D8%AC%D9%85-%D8%A7%D9%84%D9%85%D9%88%D9%84%D8%AF-%D8%A7%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A6%D9%8A-%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%B3%D8%A8-%D9%84%D8%A7%D8%AD%D8%AA%D9%8A%D8%A7%D8%AC%D8%A7%D8%AA%D9%83" target="_blank" rel="noreferrer">توتال الأردن — طريقة حساب حجم المولد الكهربائي المناسب</a>
                    {' '}— منهجية حساب الأحمال وهامش الأمان.
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في الكهرباء</p>
                <div className="guide-v2-related-grid">
                  {RELATED_GUIDES.map(({ route, reason, icon: Icon }) => (
                    <Link key={route.slug} href={route.href} className="guide-v2-related-tile">
                      <span className="guide-v2-related-tile-icon" aria-hidden="true"><Icon size={16} weight="bold" /></span>
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
            <AdBlogSidebar slotId="sidebar-electrical-generators" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
