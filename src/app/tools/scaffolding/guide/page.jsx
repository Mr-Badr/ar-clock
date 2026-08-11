import Link from 'next/link';
import { Ruler, ShieldCheck, Wrench } from '@phosphor-icons/react/ssr';

import ScaffoldingQuantityChecker from '@/components/tools-v2/ScaffoldingQuantityChecker.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'scaffolding-guide');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['pricing', 'جدول أسعار السقالات الكامل'],
  ['types', 'أنواع السقالات وأيها تختار'],
  ['checklist', 'قبل التعاقد مع شركة سقالات'],
  ['sizing', 'قدّر الكمية التي تحتاجها'],
  ['faq', 'الأسئلة الشائعة'],
];

// Real, sourced pricing (verified via direct WebFetch of riyadhsp.com, not a search-engine AI
// summary — an earlier lighter check had conflated an unrelated car-shade pricing page as if it
// were scaffolding data; discarded once caught, see keyword-research/scaffolding-hub/DECISION.md
// and the standing lesson in feedback-verify-numbers-via-webfetch-2026-08-10).
const PRICING_TABLE = [
  { type: 'إطارية (Frame)', rent: '25-40 ريال/م² شهرياً', buyNew: '150-250 ريال/م²', buyUsed: '80-120 ريال/م' },
  { type: 'أنبوبية (Tube & Coupler)', rent: '35-55 ريال/م² شهرياً', buyNew: '200-350 ريال/م²', buyUsed: '110-180 ريال/م' },
  { type: 'حلزونية (Ring-lock)', rent: '50-80 ريال/م شهرياً', buyNew: '300-500 ريال/م', buyUsed: '—' },
  { type: 'متحركة (Mobile)', rent: '40-70 ريال/م شهرياً', buyNew: '250-400 ريال/م', buyUsed: '—' },
  { type: 'برج سقالة (3×3م، ارتفاع 6م)', rent: '800-1,500 ريال شهرياً', buyNew: '8,000-15,000 ريال', buyUsed: '—' },
];

const TYPES_TABLE = [
  { name: 'إطارية (Frame)', rows: [['طريقة التركيب', 'الأسرع والأسهل — إطارات جاهزة التجميع'], ['الأنسب لـ', 'واجهات منتظمة وارتفاعات متوسطة'], ['التكلفة', 'الأقل بين الأنظمة الاحترافية']] },
  { name: 'أنبوبية (Tube & Coupler)', rows: [['طريقة التركيب', 'مرنة جداً — تتشكل حسب أي هندسة مبنى'], ['الأنسب لـ', 'واجهات غير منتظمة أو مبانٍ معقدة الشكل'], ['التكلفة', 'أعلى من الإطارية بسبب مرونتها']] },
  { name: 'حلزونية (Ring-lock)', rows: [['طريقة التركيب', 'أسرع تجميعاً من الأنبوبية بنفس المرونة تقريباً'], ['الأنسب لـ', 'مشاريع كبيرة تحتاج تركيباً وفكاً متكرراً'], ['التكلفة', 'الأعلى، لكنها توفر وقت العمالة']] },
  { name: 'متحركة (Mobile)', rows: [['طريقة التركيب', 'على عجلات — تُنقل بلا تفكيك كامل'], ['الأنسب لـ', 'أعمال داخلية أو صيانة نقطية متعددة المواقع'], ['التكلفة', 'متوسطة، ترتفع مع الارتفاع المطلوب']] },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const FAQ_ITEMS = [
  {
    question: `كم سعر إيجار السقالة بالمتر ${CURRENT_YEAR}؟`,
    answer:
      'يختلف حسب النوع: السقالة الإطارية من 25 إلى 40 ريالاً للمتر المربع شهرياً، الأنبوبية من 35 إلى 55 ريالاً، والحلزونية من 50 إلى 80 ريالاً للمتر شهرياً. راجع الجدول أعلى الصفحة للمقارنة الكاملة بين كل الأنواع إيجاراً وشراءً.',
  },
  {
    question: 'ما الفرق بين السقالة الإطارية والأنبوبية؟',
    answer:
      'الإطارية تُركَّب من قطع جاهزة التجميع بسرعة، وهي الخيار الأرخص والأسرع للواجهات المنتظمة الشكل. الأنبوبية تُبنى من أنابيب ووصلات كوبلر منفصلة، ما يمنحها مرونة أكبر بكثير للتكيف مع أي هندسة مبنى غير منتظمة، لكنها تحتاج وقت تركيب أطول وتكلفتها أعلى قليلاً.',
  },
  {
    question: 'هل شراء السقالة أوفر من إيجارها؟',
    answer:
      'يعتمد على مدة الاستخدام المتوقعة. بحساب تقريبي: سقالة أنبوبية جديدة تكلف 200-350 ريالاً للمتر المربع شراءً، مقابل 35-55 ريالاً شهرياً إيجاراً — أي أن نقطة التعادل تقع تقريباً بين 5 و7 أشهر إيجار متواصل. لمشروع أقصر من ذلك، الإيجار أوفر بوضوح؛ لمشاريع مقاولين مستمرة على مدار السنة، الشراء يوفر أكثر على المدى الطويل.',
  },
  {
    question: `ما هي أنواع السقالات المتوفرة في السوق ${CURRENT_YEAR}؟`,
    answer:
      'أربعة أنظمة احترافية شائعة: الإطارية (الأسرع تركيباً والأرخص)، الأنبوبية (الأكثر مرونة لأي شكل مبنى)، الحلزونية (Ring-lock، الأسرع تجميعاً للمشاريع الكبيرة)، والمتحركة (على عجلات للأعمال الداخلية). يُضاف إليها من ناحية المادة: سقالات الحديد (الأشيع، مقاومة صدأ محدودة في البيئات الساحلية) وسقالات الألمنيوم (أخف وزناً وأعلى مقاومة للتآكل، لكن بتكلفة أعلى).',
  },
  {
    question: 'ماذا أتحقق منه قبل التعاقد مع شركة سقالات؟',
    answer:
      'أربع نقاط أساسية: هل الفنيون القائمون على التركيب حاصلون على شهادة سلامة معتمدة (مثل TÜV)؟ هل تقدّم الشركة عقداً مكتوباً يوضح المدة والسعر وقطع الغيار المشمولة؟ هل لديها سجل مشاريع فعلي يمكن التحقق منه (عدد مشاريع، سنوات خبرة)؟ وهل تشمل الخدمة التركيب والفك معاً أم تحتاج التعاقد مع طرف منفصل لكل منهما؟',
  },
  {
    question: 'هل السقالة المستعملة آمنة للاستخدام؟',
    answer:
      'يمكن أن تكون آمنة تماماً إن فُحصت جيداً قبل الشراء أو الاستئجار — تحقق من عدم وجود صدأ عميق يضعف الأنابيب، سلامة آليات القفل والوصلات، واستقامة القطع دون انحناء واضح. أسعار المستعمل أقل بوضوح من الجديد (110-180 ريالاً للمتر للأنبوبية مقابل 200-350 ريالاً جديدة)، لكن التوفير لا يستحق المخاطرة إن كانت القطع تالفة فعلياً — افحص شخصياً أو استعن بفني قبل الشراء.',
  },
  {
    question: 'كم تكلفة تركيب وفك السقالة بشكل منفصل عن الإيجار؟',
    answer:
      'التركيب الاحترافي يتراوح عادة بين 20 و40 ريالاً للمتر المربع، والفك بين 15 و30 ريالاً للمتر — تأكد دائماً إن كانت هذه الخدمة مشمولة ضمن سعر الإيجار المعروض عليك أو تُحاسَب إضافياً، فبعض العروض "الرخيصة" تخفي هذه التكلفة لتظهر أقل في المقارنة الأولى.',
  },
];

export default function ScaffoldingGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السقالات', item: `${SITE_URL}/tools/scaffolding` },
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

      <ToolTopAdSlot slotId="top-scaffolding-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل مقاولات — أسعار وأنواع</span>
              <h1>دليل أسعار وأنواع السقالات الكامل</h1>
              <p className="guide-v2-lead">
                جدول أسعار حقيقي شامل لكل نوع سقالة إيجاراً وشراءً، دليل اختيار النوع المناسب
                لمشروعك، وما يجب التحقق منه قبل التعاقد مع أي شركة — في مكان واحد بدل التنقل بين
                عروض متفرقة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Ruler size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  لمشروع قصير المدة، الإيجار أوفر دائماً تقريباً (نقطة التعادل مع الشراء تقع عند
                  5-7 أشهر إيجار متواصل للسقالة الأنبوبية). للواجهات المنتظمة اختر الإطارية
                  (الأرخص والأسرع)، وللمباني غير المنتظمة أو المعقدة اختر الأنبوبية رغم كلفتها
                  الأعلى قليلاً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="pricing">
                <h2>جدول أسعار السقالات الكامل</h2>
                <p>
                  نطاقات أسعار حقيقية من السوق السعودي، إيجاراً وشراءً (جديد ومستعمل حيث تتوفر
                  بيانات)، لكل الأنظمة الشائعة:
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      {PRICING_TABLE.map((row) => (
                        <div className="guide-v2-compare-row" key={row.type} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                          <span className="guide-v2-compare-row-label" style={{ fontWeight: 700 }}>{row.type}</span>
                          <span className="guide-v2-compare-row-value">إيجار: {row.rent}</span>
                          <span className="guide-v2-compare-row-value">شراء جديد: {row.buyNew}</span>
                          {row.buyUsed !== '—' ? <span className="guide-v2-compare-row-value">شراء مستعمل: {row.buyUsed}</span> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="guide-v2-note">
                  <Ruler size={18} weight="fill" aria-hidden="true" />
                  <span>
                    الأسعار تقديرية وتختلف حسب المدينة والكمية ومدة التعاقد — اطلب دائماً عرض
                    سعر مكتوباً يوضح ما إذا كان التركيب والفك مشمولين أم يُحاسَبان إضافياً.
                  </span>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-scaffolding-guide-1" />

              <section id="types">
                <h2>أنواع السقالات وأيها تختار</h2>
                <p>
                  أربعة أنظمة تغطي معظم المشاريع، والاختيار بينها يعتمد على شكل المبنى وميزانيتك
                  أكثر من التفضيل الشخصي:
                </p>
                <div className="guide-v2-compare-list">
                  {TYPES_TABLE.map((type) => (
                    <div className="guide-v2-compare-card" key={type.name}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{type.name}</span>
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
                  <p>من ناحية المادة: الحديد هو الأشيع والأوفر، لكنه عرضة للصدأ خلال سنوات قليلة في البيئات الساحلية حتى مع الطلاء المقاوم. الألمنيوم أخف وزناً وأعلى مقاومة للتآكل، بتكلفة شراء أعلى.</p>
                </blockquote>
              </section>

              <ToolInArticleAd slotId="mid-scaffolding-guide-2" />

              <section id="checklist">
                <h2>قبل التعاقد مع شركة سقالات</h2>
                <p>
                  أربع نقاط تحقق حقيقية توفر عليك مشاكل لاحقة، بدل الاعتماد على السعر الأقل فقط:
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label"><ShieldCheck size={16} weight="bold" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />شهادة سلامة للفنيين</span>
                        <span className="guide-v2-compare-row-value">اسأل تحديداً عن شهادة معتمدة دولياً مثل TÜV — بعض الشركات الجادة في السوق السعودي تذكرها صراحة كجزء من مؤهلات فريقها.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label"><Wrench size={16} weight="bold" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 6 }} />عقد مكتوب واضح</span>
                        <span className="guide-v2-compare-row-value">المدة، السعر الإجمالي، وهل التركيب والفك والصيانة أثناء الإيجار مشمولون أم منفصلون.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">سجل مشاريع فعلي</span>
                        <span className="guide-v2-compare-row-value">اطلب أمثلة مشاريع سابقة قابلة للتحقق، لا مجرد "خبرة طويلة" كعبارة عامة.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">فحص القطع المستعملة</span>
                        <span className="guide-v2-compare-row-value">إن كانت الصفقة تشمل قطعاً مستعملة، افحصها شخصياً (صدأ، انحناء، سلامة الوصلات) قبل التوقيع.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="sizing">
                <h2>قدّر الكمية التي تحتاجها</h2>
                <p>
                  قبل طلب عرض سعر، اعرف تقديراً تقريبياً لعدد القطع اللازمة لواجهة مشروعك —
                  يساعدك على تقييم أي عرض سعر معروض عليك بشكل أفضل:
                </p>
                <ScaffoldingQuantityChecker />
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
                    <a href="https://riyadhsp.com/articles/scaffolding-supply-prices-saudi" target="_blank" rel="noreferrer">أسعار توريد السقالات في السعودية {CURRENT_YEAR}</a>
                    {' '}— مصدر جدول الأسعار الكامل لكل الأنواع (إيجاراً وشراءً).
                  </li>
                  <li>
                    <a href="https://rowadsc.com.sa/about/" target="_blank" rel="noreferrer">سقالات الرواد — عن الشركة</a>
                    {' '}— مثال حقيقي موثّق لشركة سعودية بفنيين حاصلين على شهادة TÜV، مذكور كمرجع لمعايير الاختيار لا كإعلان.
                  </li>
                </ul>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-scaffolding-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
