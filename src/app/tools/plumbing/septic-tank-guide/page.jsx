import Link from 'next/link';
import { Drop, Gauge, ShowerIcon } from '@phosphor-icons/react/ssr';

import SepticTankSizeChecker from '@/components/tools-v2/SepticTankSizeChecker.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'septic-tank-guide');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['types', 'أنواع أنظمة الصرف الصحي المنزلي'],
  ['maintenance', 'كل كم مدة تحتاج تفريغ البيارة'],
  ['sizing', 'ما الحجم المناسب لعائلتك'],
  ['faq', 'الأسئلة الشائعة'],
];

const SYSTEM_TYPES = [
  {
    name: 'بيارة امتصاصية (Soakaway)',
    badge: 'الأشيع في الأحياء السكنية',
    recommended: true,
    rows: [
      ['طريقة العمل', 'تسمح للسائل بالتسرب تدريجياً إلى التربة المحيطة'],
      ['الأنسب لـ', 'التربة الرملية أو النفاذة جيداً'],
      ['الصيانة', 'تحتاج تفريغ الحمأة (الرواسب الصلبة) دورياً'],
      ['التكلفة', 'الأقل بين الأنظمة الشائعة'],
    ],
  },
  {
    name: 'خزان تعفين/تحليل (Septic Tank)',
    rows: [
      ['طريقة العمل', 'يحتجز الصرف ويعالجه جزئياً قبل تصريف السائل'],
      ['الأنسب لـ', 'التربة الطينية أو ضعيفة النفاذية'],
      ['الصيانة', 'تفريغ دوري إلزامي — لا يعتمد على امتصاص التربة'],
      ['التكلفة', 'أعلى من البيارة الامتصاصية عادة'],
    ],
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const FAQ_ITEMS = [
  {
    question: `كل كم مدة يجب تفريغ بيارة الصرف الصحي ${CURRENT_YEAR}؟`,
    answer:
      'يعتمد على حجم البيارة وعدد أفراد الأسرة، لكن المدى الشائع هندسياً هو كل 10 إلى 30 يوماً قبل الامتلاء الكامل عند التصميم القياسي — إن كانت بيارتك تمتلئ أسرع من ذلك بشكل متكرر، فهذا مؤشر أن حجمها أصغر من احتياج منزلك الفعلي. استخدم الحاسبة أعلاه لمعرفة الحجم المناسب فعلياً.',
  },
  {
    question: 'ما الفرق بين البيارة الامتصاصية وخزان التعفين؟',
    answer:
      'البيارة الامتصاصية تسمح للسائل بالتسرب تدريجياً إلى التربة المحيطة، وتناسب الأراضي ذات التربة الرملية أو النفاذة جيداً. خزان التعفين (أو التحليل) يحتجز الصرف بالكامل ويعالجه جزئياً داخل خزان مُحكَم، وهو الخيار الأنسب في التربة الطينية أو ضعيفة النفاذية حيث لا يمكن الاعتماد على امتصاص الأرض.',
  },
  {
    question: 'كيف احسب حجم البيارة المناسب لمنزلي؟',
    answer:
      'راجع الصيغة الأساسية في قسم "ما الحجم المناسب لعائلتك" أعلاه — تعتمد على عدد أفراد الأسرة واستهلاك الفرد اليومي من المياه وعدد أيام الانتظار بين مرات التفريغ. أدخل عدد أفراد أسرتك في الحاسبة أعلاه لحساب الحجم التقريبي مباشرة، مع إمكانية تعديل الرقمين حسب استهلاكك الفعلي.',
  },
  {
    question: 'لماذا تمتلئ البيارة بسرعة رغم حجمها الكبير؟',
    answer:
      'أسباب شائعة: تسرب مياه من صنبور أو خزان معطّل يرفع الاستهلاك الفعلي فوق المعدل الطبيعي، عدد سكان أكبر من التصميم الأصلي للبيارة (استضافة ضيوف بشكل متكرر مثلاً)، أو تربة ضعيفة النفاذية تقلل كفاءة الامتصاص إن كانت البيارة من النوع الامتصاصي أصلاً. راجع استهلاك المياه الفعلي في فاتورتك كخطوة أولى للتشخيص.',
  },
  {
    question: 'ما هي المسافة الآمنة بين البيارة وبئر المياه؟',
    answer:
      'يُشترط عادة ترك مسافة كافية بين البيارة وأي بئر مياه للشرب لتجنب أي تلوث محتمل، والمسافة الدقيقة المطلوبة تختلف حسب نوع التربة ونظام البيارة واشتراطات البلدية في منطقتك تحديداً — راجع الجهة المختصة محلياً قبل تحديد موقع الحفر بدل الاعتماد على رقم عام.',
  },
  {
    question: 'هل رائحة البيارة القوية طبيعية؟',
    answer:
      'رائحة خفيفة عند فتح غطاء البيارة متوقعة، لكن رائحة قوية تصل للمنزل أو الحديقة باستمرار عادة علامة على مشكلة حقيقية: تهوية غير كافية، تسرب في الأنابيب المتجهة للبيارة، أو بيارة قاربت على الامتلاء الكامل وتحتاج تفريغاً عاجلاً.',
  },
  {
    question: `كم تكلفة حفر بيارة صرف صحي لفيلا ${CURRENT_YEAR}؟`,
    answer:
      'التكلفة تختلف بشكل كبير حسب الحجم ونوع التربة (الحفر في تربة صخرية أعلى تكلفة من الرملية) ونوع النظام (امتصاصية أرخص من خزان تعفين مُحكَم عادة). اطلب دائماً عروض أسعار من أكثر من مقاول متخصص في منطقتك ووضّح لهم عدد أفراد الأسرة المتوقع قبل المقارنة، فالحجم المناسب يؤثر مباشرة على السعر النهائي.',
  },
  {
    question: 'كيف اتخلص من رائحة البيارة الكريهة؟',
    answer:
      'تأكد أولاً من وجود تهوية سليمة (أنبوب تهوية يخرج فوق سطح المبنى)، ثم افحص إحكام غطاء البيارة وسلامة وصلات الأنابيب. إن استمرت الرائحة رغم ذلك، قد تكون البيارة قريبة من الامتلاء الكامل وتحتاج تفريغاً — لا تلجأ لمواد كيميائية قوية بشكل متكرر كحل دائم دون معرفة السبب الحقيقي أولاً.',
  },
];

export default function SepticTankGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السباكة', item: `${SITE_URL}/tools/plumbing` },
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

  function pickGuides(slugs) {
    return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
  }
  const RELATED_GUIDES = [
    { route: pickGuides(['water-tanks'])[0], reason: 'لحساب حجم خزان المياه المناسب — الوجه الآخر لاستهلاك منزلك', icon: Drop },
    { route: pickGuides(['leak-detection'])[0], reason: 'تسرب غير مرئي يرفع استهلاك المياه ويُسرّع امتلاء البيارة', icon: ShowerIcon },
    { route: pickGuides(['water-meter'])[0], reason: 'راجع استهلاكك الفعلي إن كانت البيارة تمتلئ أسرع من المتوقع', icon: Gauge },
  ].filter((item) => item.route);

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-septic-tank-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل سباكة — صرف صحي</span>
              <h1>دليل صيانة وتفريغ بيارة الصرف الصحي</h1>
              <p className="guide-v2-lead">
                كل كم مدة تحتاج فعلاً لتفريغ البيارة، ما الفرق بين الأنظمة المختلفة، ولماذا قد
                تمتلئ بيارتك أسرع من المتوقع — دليل عملي مع حاسبة حجم حقيقية بدل التخمين.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Drop size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الحجم المناسب للبيارة يُحسب بضرب عدد أفراد الأسرة × استهلاك الفرد اليومي
                  (95-150 لتر تقريباً) × عدد الأيام قبل التفريغ (10-30 يوماً عادة). إن كانت
                  بيارتك تمتلئ أسرع من كل 10 أيام باستمرار رغم عدم وجود تسرب، فهي على الأرجح
                  أصغر من حاجة منزلك الفعلية — احسب رقمك بالضبط أدناه.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع أنظمة الصرف الصحي المنزلي</h2>
                <p>
                  نظامان شائعان في المنازل غير المتصلة بشبكة الصرف الصحي المركزي، والاختيار
                  بينهما يعتمد بشكل أساسي على نوع التربة لا على التفضيل الشخصي:
                </p>
                <div className="guide-v2-compare-list">
                  {SYSTEM_TYPES.map((type) => (
                    <div className={`guide-v2-compare-card${type.recommended ? ' is-recommended' : ''}`} key={type.name}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{type.name}</span>
                        {type.badge ? <span className="guide-v2-compare-badge">{type.badge}</span> : null}
                      </div>
                      <div className="guide-v2-compare-rows">
                        {type.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <blockquote className="guide-v2-pullquote">
                  <p>لا يوجد نظام "أفضل" مطلقاً — التربة الرملية تناسب البيارة الامتصاصية، والتربة الطينية تحتاج خزان تعفين مُحكَم لأن الأرض لا تمتص السائل بكفاءة كافية.</p>
                </blockquote>
              </section>

              <ToolInArticleAd slotId="mid-septic-tank-guide" />

              <section id="maintenance">
                <h2>كل كم مدة تحتاج تفريغ البيارة</h2>
                <p>
                  لا يوجد جدول ثابت يصلح للجميع — المدة الفعلية تعتمد على حجم البيارة وعدد
                  السكان واستهلاك المياه الحقيقي. علامات تدل على اقتراب موعد التفريغ: رائحة
                  متزايدة بالقرب من موقع البيارة، بطء غير معتاد في تصريف المصارف داخل المنزل،
                  أو ظهور مياه راكدة قرب سطح الأرض فوق البيارة مباشرة.
                </p>
              </section>

              <section id="sizing">
                <h2>ما الحجم المناسب لعائلتك</h2>
                <p>
                  حجم أصغر من حاجتك الفعلية يعني تفريغاً متكرراً مكلفاً، وحجم أكبر بكثير من
                  اللازم يعني تكلفة حفر إضافية بلا داعٍ حقيقي.
                </p>
                <FormulaCard
                  label="الصيغة الأساسية لتقدير الحجم اللازم للبيارة:"
                  note="استهلاك الفرد اليومي يُقدَّر بين 95 و150 لتراً تقريباً شاملاً صرف المطبخ."
                >
                  <span>الحجم اللازم = عدد الأفراد × استهلاك الفرد اليومي × أيام الانتظار</span>
                </FormulaCard>
                <p>استخدم الأداة التالية لحساب الحجم التقريبي المناسب لعدد أفراد أسرتك مباشرة:</p>
                <SepticTankSizeChecker />
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
                    <a href="https://www.ejaba.com/question/%D9%83%D9%8A%D9%81-%D9%8A%D8%AA%D9%85-%D8%AD%D8%B3%D8%A7%D8%A8-%D8%AD%D8%AC%D9%85-%D8%A7%D9%84%D8%AE%D8%B2%D8%A7%D9%86%D8%A7%D8%AA-%D8%A7%D9%84%D9%84%D8%A7%D8%B2%D9%85%D8%A9-%D9%81%D9%8A-%D8%B4%D8%A8%D9%83%D8%A7%D8%AA-%D8%A7%D9%84%D8%B5%D8%B1%D9%81-%D8%A7%D9%84%D8%B5%D8%AD%D9%8A" target="_blank" rel="noreferrer">إجابة — كيف يتم حساب حجم الخزانات اللازمة في شبكات الصرف الصحي</a>
                    {' '}— مصدر معدل الاستهلاك اليومي للفرد ومدة التفريغ.
                  </li>
                  <li>
                    <a href="https://www.handasa.xyz/2020/08/septic-tank-design-building-construction.html" target="_blank" rel="noreferrer">هندسة — البيارة (خزان الصرف الصحي) للمنازل: التعريف والتصميم</a>
                    {' '}— مصدر الفرق بين الأنواع الشائعة.
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في السباكة</p>
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
            <AdBlogSidebar slotId="sidebar-septic-tank-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
