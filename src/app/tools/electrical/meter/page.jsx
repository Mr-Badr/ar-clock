import Link from 'next/link';
import { Gauge, Lightning, Phone, SquaresFour, Warning } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'meter');
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['reading', 'كيف تقرأ عداد الكهرباء؟'],
  ['transfer', 'نقل ملكية العداد وتسجيل عداد جديد'],
  ['bill-spike', 'لماذا ارتفعت فاتورتك فجأة؟'],
  ['complaint', 'خطوات تقديم شكوى'],
  ['faq', 'الأسئلة الشائعة'],
];

const BILL_SPIKE_REASONS = [
  { title: 'موسم التكييف', body: 'ارتفاع درجات الحرارة يرفع استهلاك المكيفات بشكل حاد — وهو السبب الأشيع للارتفاع المفاجئ في فصل الصيف تحديداً، حتى بدون أي تغيير في نمط استخدامك.' },
  { title: 'شريحة استهلاك أعلى', body: 'أغلب أنظمة التسعير في الخليج تدريجية — كل شريحة استهلاك أعلى تُحتسب بسعر أعلى للكيلوواط/ساعة. زيادة بسيطة في الاستهلاك قد تدفعك لشريحة أغلى فيرتفع إجمالي الفاتورة بنسبة أكبر من نسبة زيادة الاستهلاك نفسها.' },
  { title: 'قراءة تقديرية غير دقيقة', body: 'إذا تعذّر الوصول للعداد لقراءته فعلياً، تُصدر بعض الشركات فاتورة بقراءة تقديرية تُصحَّح لاحقاً — ما قد يظهر كفرق كبير دفعة واحدة عند القراءة الفعلية التالية.' },
  { title: 'جهاز معطوب يسحب تياراً أعلى', body: 'جهاز كهربائي قديم أو به عطل داخلي (خاصة الثلاجة أو المكيف) قد يسحب كهرباء أكثر بكثير من استهلاكه الطبيعي دون أن يظهر ذلك في أدائه الظاهري.' },
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
  { route: pickGuides(['emergency-numbers'])[0], reason: 'انقطاع كامل بلا سبب واضح؟ اتصل برقم الطوارئ مباشرة', icon: Phone },
  { route: pickGuides(['breaker-panel'])[0], reason: 'إذا كان الاشتباه في قاطع يفصل لا في العداد نفسه', icon: SquaresFour },
  { route: pickGuides(['generators'])[0], reason: 'انقطاعات متكررة في منطقتك؟ فكّر في مولد احتياطي', icon: Lightning },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: `كيف تقرأ عداد الكهرباء ${CURRENT_YEAR}؟`,
    answer: 'العدادات الرقمية الحديثة تعرض القراءة مباشرة على شاشة صغيرة — سجّل الأرقام الظاهرة من اليسار لليمين. العدادات الأقدم ذات المؤشرات الدوارة تُقرأ من اليسار لليمين أيضاً، مع تجاهل أي مؤشر أحمر أو عشري في آخر الرقم. أغلب شركات الكهرباء الخليجية توفر أيضاً تطبيقاً رسمياً يعرض القراءة والاستهلاك دون الحاجة للذهاب إلى موقع العداد فعلياً.',
  },
  {
    question: 'كيف تنقل ملكية عداد الكهرباء إلى اسمك؟',
    answer: 'تتطلب أغلب شركات الكهرباء الخليجية تسجيل الدخول عبر التطبيق أو الموقع الرسمي بحساب مالك العقار السابق أو صاحب الطلب، إدخال رقم العداد أو رقم الهوية، ورفع مستندات الملكية أو عقد الإيجار. تُعالَج أغلب الطلبات الإلكترونية خلال 24 ساعة، ويصلك رقم حساب جديد باسمك بعد اكتمال النقل.',
  },
  {
    question: 'ما هي خطوات تسجيل عداد كهرباء جديد؟',
    answer: 'يبدأ الطلب عادة عبر التطبيق أو الموقع الرسمي لشركة الكهرباء، برفع مستندات الملكية أو عقد الإيجار وصك الأرض أو رخصة البناء حسب حالة العقار. بعد المراجعة، تُحدَّد زيارة فنية لتركيب العداد وتفعيل الاشتراك. المدة الفعلية تختلف حسب اكتمال جاهزية التمديدات الداخلية للعقار.',
  },
  {
    question: 'ما أسباب ارتفاع فاتورة الكهرباء المفاجئ؟',
    answer: 'الأسباب الأشيع: موسم التكييف الذي يرفع الاستهلاك بشكل حاد، الانتقال لشريحة تسعير أعلى بسبب زيادة الاستهلاك التدريجية، قراءة تقديرية غير دقيقة تُصحَّح لاحقاً، أو جهاز معطوب يسحب تياراً أعلى من الطبيعي دون أن يظهر ذلك في أدائه.',
  },
  {
    question: 'كيف تقدّم شكوى على فاتورة كهرباء؟',
    answer: 'قدّم الشكوى عبر التطبيق الرسمي أو خط خدمة العملاء لشركة الكهرباء، مع ذكر رقم الحساب أو العداد ووصف واضح للمشكلة (فرق كبير عن المعتاد، قراءة تبدو خاطئة، إلخ). أغلب الشركات تعطيك رقم طلب متابعة فور تسجيل الشكوى، وقد تُرسل فنياً لإعادة القراءة الفعلية في حالات النزاع على دقة الرقم.',
  },
  {
    question: 'هل يمكن معرفة فاتورة الكهرباء بدون تسجيل دخول؟',
    answer: 'أغلب شركات الكهرباء الخليجية تتيح الاستعلام السريع برقم الحساب أو رقم العداد فقط عبر خدمة على موقعها الرسمي، دون الحاجة لتسجيل دخول كامل — لكن للحصول على تفاصيل الفاتورة الكاملة أو سدادها، غالباً تحتاج حساباً مسجّلاً باسمك.',
  },
];

export default function MeterGuidePage() {
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

      <ToolTopAdSlot slotId="top-meter" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل كهرباء — خدمات</span>
              <h1>عداد الكهرباء: كيف تقرأه وتنقله وتحل مشاكل الفاتورة المرتفعة</h1>
              <p className="guide-v2-lead">
                فاتورة كهرباء أعلى من المعتاد بلا سبب واضح، أو عداد بحاجة لنقل ملكية بعد شراء
                عقار أو استئجاره — هذا الدليل يشرح القراءة، خطوات النقل والتسجيل، وأسباب
                الارتفاع المفاجئ الأشيع.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Gauge size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  اقرأ العداد من اليسار لليمين وتجاهل أي مؤشر عشري. نقل الملكية وتسجيل عداد جديد
                  يتمّان غالباً عبر التطبيق الرسمي للشركة خلال <strong>24 ساعة</strong> بعد رفع
                  المستندات. أشيع سبب لارتفاع الفاتورة فجأة هو <strong>موسم التكييف</strong> مدمجاً
                  مع الانتقال لشريحة تسعير أعلى — لا عطلاً في العداد نفسه غالباً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="reading">
                <h2>كيف تقرأ عداد الكهرباء؟</h2>
                <p>
                  العدادات الرقمية الحديثة (الذكية) تعرض القراءة مباشرة على شاشة LCD صغيرة —
                  سجّل الأرقام كما تظهر من اليسار إلى اليمين. العدادات الأقدم ذات المؤشرات
                  الدوارة (Dial Meters) تُقرأ بالطريقة نفسها، لكن مع تجاهل أي مؤشر باللون الأحمر
                  أو خانة عشرية في نهاية الرقم — تلك خانات كسور لا تُحتسب ضمن القراءة الأساسية.
                </p>
                <p>
                  أغلب شركات الكهرباء الخليجية توفر تطبيقاً رسمياً يعرض قراءة العداد والاستهلاك
                  التراكمي مباشرة، دون الحاجة للذهاب فعلياً لموقع العداد لتسجيل الرقم يدوياً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-meter" />

              <section id="transfer">
                <h2>نقل ملكية العداد وتسجيل عداد جديد</h2>
                <p>
                  عند شراء عقار أو استئجاره، يحتاج العداد لنقل الملكية إلى اسمك — والعملية غالباً
                  إلكترونية بالكامل عبر تطبيق أو موقع شركة الكهرباء:
                </p>
                <div className="guide-v2-steps">
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">تسجيل الدخول أو إنشاء حساب</p>
                      <p className="guide-v2-step-body">عبر التطبيق الرسمي أو موقع شركة الكهرباء، باستخدام رقم الهوية أو رقم العداد.</p>
                    </div>
                  </div>
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">رفع المستندات المطلوبة</p>
                      <p className="guide-v2-step-body">عادة عقد الإيجار أو صك الملكية، ورقم العداد الحالي أو موقعه بدقة.</p>
                    </div>
                  </div>
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">إدخال القراءة الحالية</p>
                      <p className="guide-v2-step-body">لتوثيق نقطة بداية الاستهلاك الجديد باسمك، وتحديد المسؤولية عن الفاتورة السابقة بدقة.</p>
                    </div>
                  </div>
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">المعالجة وإصدار رقم حساب جديد</p>
                      <p className="guide-v2-step-body">تُعالَج أغلب الطلبات الإلكترونية خلال 24 ساعة، ويصلك رقم حساب جديد بالملكية الجديدة.</p>
                    </div>
                  </div>
                </div>
                <p>
                  تسجيل عداد جديد لعقار لم يُوصَّل بالشبكة من قبل يتطلب خطوة إضافية: زيارة فنية
                  لتركيب العداد نفسه بعد اكتمال التمديدات الداخلية للعقار وموافقة الجهات المعنية.
                </p>
              </section>

              <section id="bill-spike">
                <h2>لماذا ارتفعت فاتورتك فجأة؟</h2>
                <p>
                  قبل افتراض وجود عطل في العداد، راجع الأسباب الأشيع أولاً — أغلب حالات الارتفاع
                  المفاجئ لها تفسير عملي بسيط:
                </p>
                <div className="guide-v2-compare-list">
                  {BILL_SPIKE_REASONS.map((r) => (
                    <div className="guide-v2-compare-card" key={r.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{r.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{r.body}</p>
                    </div>
                  ))}
                </div>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    إذا كانت الفاتورة أعلى بشكل غير منطقي إطلاقاً (أضعاف الاستهلاك المعتاد بلا أي
                    تغيير في نمط استخدامك)، قدّم شكوى رسمية بدل افتراض أنها فاتورة صحيحة يجب دفعها.
                  </span>
                </div>
              </section>

              <section id="complaint">
                <h2>خطوات تقديم شكوى</h2>
                <p>
                  إذا كانت الفاتورة تبدو خاطئة فعلاً، أو رقم القراءة غير منطقي مقارنة باستهلاكك
                  المعتاد، قدّم شكوى رسمية عبر القنوات التالية بدل الدفع دون تحقق:
                </p>
                <ul>
                  <li>عبر التطبيق الرسمي لشركة الكهرباء — قسم "الشكاوى" أو "خدمة العملاء"</li>
                  <li>عبر خط خدمة العملاء الهاتفي، مع تجهيز رقم الحساب أو العداد مسبقاً</li>
                  <li>وصف واضح للمشكلة: فرق كبير عن المعتاد، قراءة تبدو خاطئة، أو خطأ في اسم صاحب الحساب</li>
                  <li>الاحتفاظ برقم الطلب الذي تحصل عليه فور تسجيل الشكوى لمتابعتها لاحقاً</li>
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

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://attaqa.net/2024/10/30/%D8%AA%D9%88%D8%AB%D9%8A%D9%82-%D8%B9%D8%AF%D8%A7%D8%AF-%D8%A7%D9%84%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1-%D9%81%D9%8A-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D8%AE%D8%AF%D9%85%D8%A9-%D8%A5/" target="_blank" rel="noreferrer">الطاقة — توثيق عداد الكهرباء في السعودية</a>
                    {' '}— خدمة تسجيل وتوثيق العداد إلكترونياً.
                  </li>
                  <li>
                    <a href="https://alaamal.com.sa/product/transfer-of-ownership-of-a-meter/" target="_blank" rel="noreferrer">منصة الأعمال — نقل ملكية عداد كهرباء</a>
                    {' '}— خطوات ومستندات نقل الملكية.
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
            <AdBlogSidebar slotId="sidebar-electrical-meter" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
