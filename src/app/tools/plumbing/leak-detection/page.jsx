import Link from 'next/link';
import { Drop, Fire, Gauge, Warning } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'leak-detection');

const TOC_ITEMS = [
  ['how-it-works', 'كيف تعمل أجهزة الكشف بدون تكسير؟'],
  ['warning-signs', 'علامات تدل على تسرب مخفي'],
  ['cost', 'كم تكلف خدمة كشف التسربات؟'],
  ['choosing-company', 'كيف تختار شركة موثوقة؟'],
  ['faq', 'الأسئلة الشائعة'],
];

const DETECTION_METHODS = [
  {
    title: 'الاستماع الصوتي (Acoustic)',
    body: 'جهاز حساس يلتقط صوت اندفاع الماء من ثقب صغير داخل الجدار أو تحت البلاط — صوت لا تسمعه أذنك المجردة، لكن الجهاز يحدد موقعه بدقة تصل لسنتيمترات قليلة.',
  },
  {
    title: 'التصوير الحراري (Thermal Imaging)',
    body: 'كاميرا ترصد فروق الحرارة على سطح الجدار أو الأرضية — الماء المتسرب يبرّد أو يبلّل المنطقة المحيطة به بشكل مختلف عن باقي السطح، فيظهر كبقعة واضحة على الشاشة.',
  },
  {
    title: 'غاز التتبع (Tracer Gas)',
    body: 'يُفرَّغ الماء من الخط مؤقتاً ويُضخّ بدلاً منه غاز آمن خفيف (هيدروجين ممزوج بنيتروجين عادة) يتسرب من نفس نقطة تسرب الماء ويصعد لسطح الأرض، حيث يلتقطه جهاز استشعار حساس.',
  },
  {
    title: 'قياس الضغط (Pressure Test)',
    body: 'يُغلَق الخط ويُقاس مدى انخفاض الضغط داخله خلال فترة زمنية محددة — انخفاض غير طبيعي يؤكد وجود تسرب في ذلك الخط تحديداً، قبل تحديد موقعه بالضبط بجهاز آخر.',
  },
];

const WARNING_SIGNS = [
  'صوت تنقيط أو هسيس خفيف من داخل الجدار حتى مع إغلاق كل الصنابير',
  'انتفاخ أو تقشّر الدهان على الحائط، خاصة قرب الأرضية',
  'بقع رطوبة صفراء أو بنية على السقف — إشارة على أن التسرب نازل من الدور العلوي',
  'رائحة عفن أو رطوبة مستمرة في الحمام أو المطبخ بلا سبب واضح',
  'ظهور عفن أو فطريات سوداء على الحوائط أو تحت الأحواض',
  'ضعف مفاجئ في ضغط المياه من الصنبور أو الدُش',
  'ارتفاع غير مبرر في فاتورة المياه الشهرية مقارنة باستهلاكك المعتاد',
];

const CHOOSE_CRITERIA = [
  { title: 'أجهزة كشف حقيقية لا تخمين', body: 'اسأل مباشرة: هل تستخدمون جهاز استماع صوتي أو كاميرا حرارية؟ الشركة الجادة تجيب بوضوح وتشرح لك الطريقة قبل البدء.' },
  { title: 'تقرير مكتوب بعد الكشف', body: 'تقرير يوضح موقع التسرب وسببه المحتمل — تحتاجه إذا أردت مطالبة شركة تأمين أو مقارنة عرض إصلاح لاحق مع فني آخر.' },
  { title: 'سعر الكشف منفصل عن سعر الإصلاح', body: 'اطلب رقماً واضحاً لتكلفة الكشف وحده قبل الموافقة على أي شيء — بعض العروض تُغرقك في "كشف مجاني" ثم ترفع سعر الإصلاح لتعويضه.' },
  { title: 'ضمان على الخدمة', body: 'شركة واثقة من دقة جهازها تعطيك ضماناً — إن لم تُحدَّد نقطة التسرب الصحيحة، لا تدفع كامل المبلغ.' },
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
  { route: pickGuides(['water-tanks'])[0], reason: 'إذا كان التسرب من الخزان نفسه لا من الشبكة', icon: Drop },
  { route: pickGuides(['water-meter'])[0], reason: 'إذا كان دليلك الأول ارتفاع مفاجئ في فاتورة المياه', icon: Gauge },
  { route: pickGuides(['water-heaters'])[0], reason: 'إذا كان التسرب قريباً من موقع السخان', icon: Fire },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم تكلفة كشف تسربات المياه في السعودية؟',
    answer: 'تتراوح تكلفة الكشف عادة بين 150 و800 ريال، والسعر الشائع لزيارة منزلية عادية في المدن الكبرى نحو 300-400 ريال. يعتمد الرقم الفعلي على نوع التسرب، مساحة الموقع، والوقت اللازم لتحديد المصدر — اطلب دائماً سعر الكشف منفصلاً عن سعر الإصلاح قبل الموافقة.',
  },
  {
    question: 'كم يستغرق فحص كشف التسربات؟',
    answer: 'الفحص الشامل باستخدام الأجهزة الإلكترونية (صوتي أو حراري) يستغرق عادة من ساعة إلى ساعتين لتغطية شبكة المياه في منزل عادي، وقد يطول إذا كان المصدر غير واضح أو المساحة كبيرة.',
  },
  {
    question: 'هل كشف التسربات يتطلب تكسير الجدران؟',
    answer: 'لا، إذا استخدمت شركة تعتمد الأجهزة الحديثة (صوتية أو حرارية أو غاز تتبع). هذه التقنيات تحدد موقع التسرب بدقة قبل أي تدخل، فيقتصر الكسر لاحقاً — إن احتيج أصلاً — على نقطة الإصلاح فقط، لا على البحث العشوائي.',
  },
  {
    question: 'ما الفرق بين جهاز الاستماع الصوتي والكاميرا الحرارية؟',
    answer: 'الاستماع الصوتي يلتقط صوت اندفاع الماء من الثقب، وهو أدق للتسربات تحت الضغط (خطوط المياه الرئيسية). الكاميرا الحرارية ترصد فرق الحرارة والرطوبة على السطح، وتُستخدم أكثر لتسربات الأسقف والحوائط البطيئة. الشركات الجيدة تجمع بين الطريقتين حسب نوع المشكلة.',
  },
  {
    question: 'كيف أعرف أن التسرب من الخزان وليس من الشبكة؟',
    answer: 'أغلق محبس التغذية الرئيسي من الشارع أو من العداد، وراقب: إذا استمر مستوى الماء بالنزول من الخزان رغم إغلاق التغذية، فالمشكلة في الخزان أو خط التوزيع بعده، لا في شبكة المدينة. راجع دليل خزانات المياه أدناه للتفاصيل.',
  },
  {
    question: 'هل يستحق الأمر استدعاء شركة كشف أم أنتظر وأراقب الوضع؟',
    answer: 'لا تنتظر. تسرب صغير مستمر يرفع فاتورتك تدريجياً ويضعف الأساسات أو يُنتج عفناً صحياً خطيراً مع الوقت. إذا لاحظت أي علامة من علامات التسرب المخفي في هذه الصفحة، احجز كشفاً في نفس الأسبوع — تكلفة الكشف المبكر أقل بكثير من إصلاح ضرر متراكم لاحقاً.',
  },
  {
    question: 'هل تحتاج شركة الكشف رخصة أو اعتماد معين؟',
    answer: 'اطلب دائماً شركة تصدر تقريراً موثقاً باسمها وتفاصيل الفحص — هذا التقرير هو ما تحتاجه إن قدّمت مطالبة تأمين أو راجعت فنياً آخر للإصلاح. لا يوجد ترخيص موحّد للقطاع في كل مدينة، لذا التقرير الموثق والضمان هما مقياسك العملي على الجدية.',
  },
];

export default function LeakDetectionGuidePage() {
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

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-leak-detection" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل سباكة — خدمات</span>
              <h1>كشف تسربات المياه: الطريقة والتكلفة وكيف تختار شركة موثوقة</h1>
              <p className="guide-v2-lead">
                تسرب صغير مستمر أخطر مما يبدو — يرفع فاتورتك تدريجياً، ويضعف الأساسات، وقد يُنتج
                عفناً صحياً قبل أن تلاحظه بعينك. هذا الدليل يشرح كيف تعمل أجهزة الكشف الحديثة بدون
                تكسير، كم تدفع فعلياً، ومتى تثق بشركة ومتى لا.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Drop size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  كشف التسربات الحديث <strong>لا يحتاج تكسيراً</strong> — يعتمد على أجهزة استماع
                  صوتي أو تصوير حراري تحدد الموقع بدقة سنتيمترات. التكلفة تتراوح عادة بين{' '}
                  <strong>150 و800 ريال</strong> حسب حجم المشكلة، والفحص الكامل يأخذ من ساعة إلى
                  ساعتين. اطلب دائماً تقريراً موثقاً وسعراً منفصلاً للكشف عن الإصلاح قبل أي التزام.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="how-it-works">
                <h2>كيف تعمل أجهزة الكشف بدون تكسير؟</h2>
                <p>
                  أكثر خطأ يكلّف الناس مالاً إضافياً هو اللجوء مباشرة لتكسير البلاط أو الجدار
                  "للبحث" عن التسرب. الشركات التي تعتمد أجهزة إلكترونية حديثة تحدد الموقع أولاً،
                  ثم يقتصر أي كسر لاحق — إن احتيج فعلاً — على نقطة واحدة صغيرة بدل موقع عشوائي.
                </p>
                <div className="guide-v2-steps">
                  {DETECTION_METHODS.map((method) => (
                    <div className="guide-v2-step" key={method.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <div>
                        <p className="guide-v2-step-title">{method.title}</p>
                        <p className="guide-v2-step-body">{method.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p>
                  الفحص الشامل لشبكة منزل عادي يستغرق عادة من ساعة إلى ساعتين. الشركات الجادة تجمع
                  بين أكثر من طريقة حسب نوع التسرب — الاستماع الصوتي أدق لخطوط المياه المضغوطة،
                  بينما التصوير الحراري أنسب لتسربات الأسقف والحوائط البطيئة.
                </p>
              </section>

              <section id="warning-signs">
                <h2>علامات تدل على تسرب مخفي</h2>
                <p>
                  أغلب التسربات الخطيرة لا تظهر كبركة ماء واضحة — تبدأ صامتة خلف الجدار أو تحت
                  البلاط. إذا لاحظت أكثر من علامة من التالية معاً، لا تنتظر:
                </p>
                <ul>
                  {WARNING_SIGNS.map((sign) => (
                    <li key={sign}>{sign}</li>
                  ))}
                </ul>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    رائحة العفن مع ضعف ضغط المياه معاً غالباً يعنيان أن التسرب مستمر منذ فترة —
                    هذا التوليف تحديداً لا يجب تأجيله لأكثر من أيام قليلة.
                  </span>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-leak-detection" />

              <section id="cost">
                <h2>كم تكلف خدمة كشف التسربات؟</h2>
                <p>
                  لا يوجد رقم ثابت يناسب الجميع — التكلفة تتغير حسب حجم المشكلة، مساحة الموقع،
                  ومدى وضوح مصدر التسرب. النطاق الواقعي في السوق السعودي:
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head">
                      <span className="guide-v2-compare-title">زيارة منزلية عادية</span>
                      <span className="guide-v2-compare-badge">الأشيع</span>
                    </div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النطاق السعري</span><span className="guide-v2-compare-row-value">300 – 400 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">يشمل</span><span className="guide-v2-compare-row-value">كشف + تقرير مبدئي</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">حالة معقدة / موقع كبير</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النطاق السعري</span><span className="guide-v2-compare-row-value">حتى 800 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">السبب</span><span className="guide-v2-compare-row-value">وقت فحص أطول أو أكثر من جهاز</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">عروض اقتصادية</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النطاق السعري</span><span className="guide-v2-compare-row-value">150 – 200 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">تنبيه</span><span className="guide-v2-compare-row-value">تحقق من نوع الجهاز المستخدم فعلاً</span></div>
                    </div>
                  </div>
                </div>
                <p>
                  القاعدة العملية: اطلب سعر الكشف كرقم منفصل قبل أي حديث عن الإصلاح. بعض العروض
                  تُسوَّق كـ"كشف مجاني" ثم تعوّض ذلك برفع سعر الإصلاح نفسه — قارن العرض الكامل، لا
                  رقم الكشف وحده.
                </p>
              </section>

              <section id="choosing-company">
                <h2>كيف تختار شركة موثوقة؟</h2>
                <p>
                  الفرق بين شركة جادة وأخرى تتخمن هو في التفاصيل الأربعة التالية — اسأل عنها
                  صراحة قبل الموافقة على أي زيارة:
                </p>
                <div className="guide-v2-compare-list">
                  {CHOOSE_CRITERIA.map((c) => (
                    <div className="guide-v2-compare-card" key={c.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{c.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{c.body}</p>
                    </div>
                  ))}
                </div>
                <blockquote className="guide-v2-pullquote">
                  <p>شركة تشرح لك طريقة الكشف قبل البدء أوثق من شركة تعدك فقط بـ"نجد المشكلة".</p>
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
                    <a href="https://homerun.com.sa/costs-prices/كشف-تسربات-المياه_16350" target="_blank" rel="noreferrer">هوم رن — تكاليف وأسعار كشف تسربات المياه</a>
                    {' '}— نطاق أسعار الخدمة في السوق السعودي.
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
            <AdBlogSidebar slotId="sidebar-plumbing-leak-detection" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
