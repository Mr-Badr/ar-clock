import Link from 'next/link';

import AttendanceCostCalculator from '@/components/calculators/AttendanceCostCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'attendance-cost-calculator');

// Computed once at module scope (same pattern as data.js's own `_resolveYear` helper) — never
// call `new Date()` inside a component render body, per docs/PLAN.md §5 step 9 and the recurring
// "new-Date()-in-render" prerender bug logged in project memory.
const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = CURRENT_YEAR + 1;

const FAQ_ITEMS = [
  {
    question: 'ما هو نظام الحضور والانصراف؟',
    answer:
      'نظام يسجّل وقت دخول وخروج كل موظف تلقائياً — إما عبر جهاز فعلي في المكتب (بصمة إصبع، كارت، أو بصمة وجه) أو تطبيق جوال يتحقق من الموقع الجغرافي، ثم يرفع البيانات إلى لوحة تحكم سحابية تربطها عادة بحساب الرواتب والإجازات.',
  },
  {
    question: `كم تكلفة نظام الحضور والانصراف ${CURRENT_YEAR}؟`,
    answer:
      `تختلف حسب النوع: الأنظمة السحابية بدون جهاز تتراوح غالباً بين 5 و30 ريالاً لكل موظف شهرياً حسب المزود والمزايا (Zoho People بحوالي 5 ريالات، ZenHR بحوالي 30 ريالاً)، بينما الأنظمة الكبرى مثل جسر وبيزات لا تُعلن أسعارها وتتطلب طلب عرض سعر مخصص. إن احتجت جهازاً فعلياً أيضاً، أضف تكلفته كرقم منفصل — استخدم الحاسبة أعلاه لتقدير تكلفة شركتك بالضبط.`,
  },
  {
    question: 'هل يوجد نظام حضور وانصراف مجاني؟',
    answer:
      'نعم لفرق صغيرة جداً — Zoho People مثلاً يقدّم خطته السحابية مجاناً بالكامل حتى 5 مستخدمين، وسند (Snad) يبدأ بخطة صفر ريال قبل الترقية لخطط مدفوعة عند الحاجة لمزايا أكثر. أغلب الأنظمة الأخرى مدفوعة بالكامل بمجرد تجاوز فريق صغير جداً.',
  },
  {
    question: 'ما الفرق بين نظام حضور بالجهاز ونظام سحابي بدون جهاز؟',
    answer:
      'نظام الجهاز (بصمة/كارت) يحتاج تركيباً فعلياً في مكان عمل ثابت ويناسب المكاتب والمصانع، بينما التطبيق السحابي (عادة عبر الجوال مع تتبع الموقع الجغرافي) يناسب أكثر فرق المبيعات الميدانية وشركات المقاولات والتوصيل التي لا يعمل موظفوها من مكان ثابت. كثير من الشركات تدمج الاثنين معاً حسب طبيعة كل قسم.',
  },
  {
    question: 'كم سعر جهاز البصمة للحضور والانصراف؟',
    answer:
      'يختلف بشكل كبير حسب الموديل: أجهزة البصمة الأساسية المخصصة للحضور فقط هي الأرخص، أجهزة الكارت وحدها عادة أوفر منها، والأجهزة المدمجة (بصمة + كارت + بصمة وجه في جهاز واحد) هي الأعلى سعراً لأنها تجمع تقنيات متعددة. راجع متاجر متخصصة محلية للسعر الحالي حسب الموديل الذي يناسب عدد موظفيك، ثم أدخل الرقم في حقل تكلفة الجهاز بالحاسبة أعلاه لحساب التكلفة الكاملة.',
  },
  {
    question: 'هل تحتاج شركتي جهازاً فعلياً أم تطبيق جوال فقط؟',
    answer:
      'إن كان معظم موظفيك يعملون من مكتب أو موقع ثابت (إداريون، مصنع، متجر)، الجهاز الفعلي أدق وأصعب على التلاعب. إن كان فريقك ميدانياً (مبيعات، مقاولات، توصيل، صيانة خارجية)، تطبيق الجوال بتتبع الموقع الجغرافي هو الخيار العملي الوحيد فعلياً.',
  },
  {
    question: `ما الفرق بين نظام الحضور والانصراف وبرنامج الموارد البشرية الشامل ${NEXT_YEAR}؟`,
    answer:
      'نظام الحضور والانصراف وظيفة واحدة محددة (تسجيل الدخول والخروج)، بينما برنامج الموارد البشرية الشامل (مثل جسر أو بيزات) يضيف الرواتب والإجازات والتوظيف وتقييم الأداء في منصة واحدة — عادة بسعر أعلى. إن احتجت الحضور فقط، الأنظمة المتخصصة (Zoho People، سند) أرخص من الاشتراك في منصة موارد بشرية كاملة لا تستخدم أغلب مزاياها.',
  },
];

const TOC_ITEMS = [
  ['attendance-types', 'أنواع أنظمة الحضور والانصراف'],
  ['attendance-pricing', 'كم تكلفة نظام الحضور والانصراف فعلياً'],
  ['attendance-choose', 'جهاز أم تطبيق سحابي؟'],
  ['attendance-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

const PRICING_TABLE = [
  { vendor: 'سند (Snad)', price: '0 ← 99 ← 249 ريال/شهر للشركة', note: 'خطط ثابتة لكل شركة، ليست لكل موظف — مناسبة للفرق الصغيرة جداً' },
  { vendor: 'Zoho People', price: '5 ريال/موظف شهرياً (فوترة سنوية)', note: 'مجاني بالكامل حتى 5 مستخدمين' },
  { vendor: 'ZenHR', price: '~30 ريال/موظف شهرياً (فوترة سنوية)', note: 'تنفيذ وتدريب مجانيان للمنشآت أقل من 100 موظف' },
  { vendor: 'Odoo (باقة Standard)', price: '~14 دولاراً/مستخدم شهرياً (فوترة سنوية)', note: 'جزء من نظام إدارة أعمال أشمل، ليس أداة حضور متخصصة فقط' },
  { vendor: 'جسر (Jisr) وبيزات (Bayzat)', price: 'غير معلن — عرض سعر مخصص فقط', note: 'أنظمة موارد بشرية شاملة كبرى، السعر يعتمد على عدد الموظفين والباقة' },
];

export default function AttendanceCostCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الحضور والانصراف', item: `${SITE_URL}/tools/attendance` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['تكلفة نظام الحضور والانصراف', 'مقارنة أسعار أنظمة الحضور والانصراف'],
    keywords: PAGE.keywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-attendance-cost" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle.replace('{{year}}', String(CURRENT_YEAR))}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-attendance-cost" /></div>

        <article className="tool-v2-lane-article">
          <section id="attendance-types">
            <h2>أنواع أنظمة الحضور والانصراف</h2>
            <p>
              خمسة أشكال شائعة تتكرر في السوق، ولكل منها استخدام مختلف تماماً عن الآخر: جهاز
              بصمة الإصبع (الأكثر انتشاراً في المكاتب والمصانع لدقته وسعره المعقول)، جهاز الكارت
              الممغنط (أرخص من البصمة لكن قابل للمشاركة بين الموظفين وهذا عيبه الأساسي)، جهاز
              بصمة الوجه (أسرع في الطابور الصباحي ولا يحتاج لمس)، أجهزة مدمجة تجمع أكثر من تقنية
              في جهاز واحد، وأخيراً تطبيقات الجوال بتتبع الموقع الجغرافي للفرق الميدانية التي لا
              تعمل من مكان ثابت أصلاً.
            </p>
            <PlainBlock eyebrow="الأكثر شيوعاً في المكاتب" title="جهاز بصمة الإصبع">
              الخيار الافتراضي لأغلب الشركات الصغيرة والمتوسطة — دقة عالية في منع انتحال الحضور
              (تسجيل زميل بدل زميله)، وتكلفته أقل بكثير من الأجهزة المدمجة أو أنظمة التعرف على
              الوجه المتقدمة.
            </PlainBlock>
            <PlainBlock eyebrow="للفرق الميدانية فقط" title="تطبيق الجوال بتتبع الموقع">
              الخيار الوحيد العملي لموظفي المبيعات الخارجية وشركات المقاولات والتوصيل — يسجّل
              الحضور والانصراف من موقع العمل الفعلي عبر GPS دون الحاجة لجهاز ثابت في مكان لا
              يتكرر زيارته أصلاً.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-attendance-cost-1" />

          <section id="attendance-pricing">
            <h2>كم تكلفة نظام الحضور والانصراف فعلياً؟</h2>
            <p>
              هذا السؤال بالذات صعب الإجابة عليه في أغلب المواقع العربية لأن معظم الشركات
              (وعلى رأسها جسر وبيزات) لا تنشر أسعارها علناً وتطلب التواصل المباشر لعرض سعر
              مخصص. المزودون التاليون من الاستثناءات القليلة التي تنشر أرقاماً حقيقية:
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>المزود</th>
                    <th>السعر المعلن</th>
                    <th>ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_TABLE.map((row) => (
                    <tr key={row.vendor}>
                      <td>{row.vendor}</td>
                      <td>{row.price}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              الأسعار أعلاه مسجّلة بالريال السعودي من مصادر رسمية، لكن أغلب هذه المنصات (Zoho،
              ZenHR، Odoo) تخدم كل دول الخليج بأسعار متقاربة عالمياً وليست حصراً على السعودية —
              استخدم محدد الدولة في الحاسبة أعلاه لعرض النتيجة بعملتك مباشرة.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-attendance-cost-2" />

          <section id="attendance-choose">
            <h2>جهاز أم تطبيق سحابي؟</h2>
            <p>
              القرار يعتمد على طبيعة عمل موظفيك أكثر من أي عامل آخر. إن كان معظمهم يحضرون
              لمكتب أو موقع عمل ثابت يومياً، الجهاز الفعلي (بصمة أو كارت) أدق وأصعب على
              التلاعب من أي تطبيق جوال. إن كان فريقك يعمل من مواقع متغيرة (مبيعات ميدانية،
              مقاولات، صيانة، توصيل)، تطبيق الجوال بتتبع الموقع هو الخيار العملي الوحيد — لا
              يوجد جهاز فعلي يمكن تركيبه في كل موقع عمل متغير أصلاً.
            </p>
            <PlainBlock eyebrow="قرار مختلط شائع" title="الجمع بين النظامين معاً">
              كثير من الشركات التي لديها فرع إداري ثابت وفريق ميداني في نفس الوقت تستخدم جهازاً
              فعلياً للموظفين الإداريين وتطبيق جوال للفريق الميداني، مع لوحة تحكم سحابية واحدة
              تجمع بيانات الطرفين معاً.
            </PlainBlock>
          </section>

          <section id="attendance-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {FAQ_ITEMS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="attendance-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.zoho.com/people/" target="_blank" rel="noreferrer">Zoho People — صفحة الأسعار الرسمية</a> — مصدر سعر 5 ريال/مستخدم شهرياً والخطة المجانية حتى 5 مستخدمين.</li>
              <li><a href="https://www.zenhr.com/" target="_blank" rel="noreferrer">ZenHR — صفحة الأسعار الرسمية</a> — مصدر سعر ~8 دولار/مستخدم شهرياً وسياسة التنفيذ المجاني للمنشآت الصغيرة.</li>
              <li><a href="https://www.odoo.com/pricing" target="_blank" rel="noreferrer">Odoo — صفحة الأسعار الرسمية</a> — مصدر سعر باقة Standard.</li>
              <li><a href="https://www.jisr.net/" target="_blank" rel="noreferrer">جسر (Jisr)</a> و<a href="https://www.bayzat.com/ar/ksa" target="_blank" rel="noreferrer">بيزات (Bayzat)</a> — منصتا موارد بشرية كبرى، الأسعار غير معلنة وتتطلب طلب عرض سعر مباشر.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><AttendanceCostCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/attendance">
                <span>كل أدوات الحضور والانصراف</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
