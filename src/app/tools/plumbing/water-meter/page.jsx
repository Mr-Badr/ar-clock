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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'water-meter');

const TOC_ITEMS = [
  ['reading', 'كيف تقرأ عداد المياه؟'],
  ['high-bill', 'لماذا ارتفعت فاتورتك فجأة؟'],
  ['complaint', 'خطوات تقديم اعتراض رسمي'],
  ['faq', 'الأسئلة الشائعة'],
];

const HIGH_BILL_CAUSES = [
  { title: 'تسرب مخفي في الجدران أو تحت الأرضية', body: 'أكثر سبب فعلي وراء ارتفاع غير مبرر — لا يظهر للعين، ويحتاج جهاز كشف متخصص لتحديد موقعه.' },
  { title: 'تسرب من الخزان العلوي أو الأرضي', body: 'خزان غير محكم أو صمام عوامة معطّل يسمح بتسرب مستمر بلا أي أثر ظاهر خارج الخزان.' },
  { title: 'صنبور مغلق بشكل غير محكم', body: 'تنقيط بسيط ومستمر يبدو غير مهم يومياً، لكنه يتراكم على مدى الشهر إلى فرق حقيقي في الفاتورة.' },
  { title: 'إفراط في ري الحديقة', body: 'نظام ري تلقائي بلا ضبط دقيق للتوقيت أو الكمية يستهلك أكثر مما تتوقع دون أن تلاحظ.' },
];

const COMPLAINT_STEPS = [
  { title: 'راجع الفاتورة بدقة', body: 'قارن الاستهلاك الحالي بالأشهر السابقة — فرق كبير ومفاجئ هو أول دليل يستحق المتابعة.' },
  { title: 'افحص المصدر المحتمل بنفسك أولاً', body: 'أغلق كل الصنابير وراقب عداد المياه لمدة ساعة دون استخدام — إذا استمر الرقم بالتغير، هناك تسرب فعلي في مكان ما.' },
  { title: 'احجز كشف تسربات إن أكّد الفحص وجود مشكلة', body: 'شركة كشف تسربات تعطيك تقريراً موثقاً يحدد موقع التسرب وسببه — هذا التقرير أساسي للخطوة التالية.' },
  { title: 'قدّم طلب اعتراض رسمي على الفاتورة', body: 'تواصل مع الجهة المسؤولة عن المياه في منطقتك وأرفق التقرير الفني كدليل — أغلب الجهات تعيد تقييم الفاتورة عند وجود دليل تسرب موثق.' },
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
  { route: pickGuides(['leak-detection'])[0], reason: 'إذا أكّد فحصك الأولي وجود تسرب فعلي', icon: Drop },
  { route: pickGuides(['water-tanks'])[0], reason: 'إذا كان الاشتباه في الخزان لا في الشبكة', icon: Drop },
  { route: pickGuides(['water-heaters'])[0], reason: 'إذا كان الاشتباه قريباً من موقع السخان', icon: Fire },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف أقرأ عداد المياه بشكل صحيح؟',
    answer: 'أغلب عدادات المياه المنزلية تعرض القراءة على شكل أرقام متتالية (شبيهة بعداد المسافة في السيارة) بوحدة المتر المكعب (م³). الأرقام السوداء الكبيرة تمثل وحدات المتر المكعب الكاملة، بينما الأرقام أو المؤشر الأحمر أو الأصغر يمثل أجزاء المتر المكعب (لترات). لحساب استهلاكك، اطرح القراءة السابقة من القراءة الحالية.',
  },
  {
    question: 'لماذا ارتفعت فاتورة المياه فجأة دون تغيير في استخدامي؟',
    answer: 'السبب الأشيع هو تسرب مخفي — في الجدران، تحت الأرضية، أو من الخزان نفسه. أسباب أخرى شائعة: صنبور مغلق بشكل غير محكم، أو إفراط في ري الحديقة دون ملاحظة. افحص الأسباب الأربعة في هذه الصفحة قبل افتراض أن الفاتورة خاطئة.',
  },
  {
    question: 'كيف أتأكد أن هناك تسرباً فعلياً قبل الاتصال بأي شركة؟',
    answer: 'أغلق جميع الصنابير والأجهزة المستخدمة للمياه في المنزل تماماً، ثم راقب رقم عداد المياه لمدة ساعة تقريباً دون أي استخدام. إذا استمر الرقم بالتغير رغم عدم الاستخدام، فهذا تأكيد شبه قاطع على وجود تسرب في مكان ما بالشبكة أو الخزان.',
  },
  {
    question: 'كيف أقدّم اعتراضاً رسمياً على فاتورة مياه مرتفعة؟',
    answer: 'تواصل مع الجهة المسؤولة عن خدمات المياه في منطقتك وقدّم طلب اعتراض، مرفقاً به تقريراً فنياً معتمداً من شركة كشف تسربات يوضح موقع التسرب وسببه إن وُجد. وجود تقرير موثق يرفع فرص إعادة تقييم الفاتورة بشكل ملحوظ مقارنة باعتراض بلا دليل.',
  },
  {
    question: 'هل يمكن أن يكون العداد نفسه معطلاً ويعطي قراءة خاطئة؟',
    answer: 'ممكن لكنه نادر نسبياً مقارنة بالتسرب الفعلي. إذا استبعدت كل أسباب التسرب المحتملة (الخزان، الصنابير، الري) وبقيت الفاتورة مرتفعة بلا تفسير، اذكر هذا الاحتمال صراحة عند تقديم اعتراضك للجهة المسؤولة لطلب فحص دقة العداد نفسه.',
  },
];

export default function WaterMeterGuidePage() {
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

      <ToolTopAdSlot slotId="top-water-meter" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل سباكة — خدمات</span>
              <h1>عداد المياه: كيف تقرأه وتحل مشاكل الفاتورة المرتفعة</h1>
              <p className="guide-v2-lead">
                فاتورة مياه مرتفعة فجأة تكون في الغالب رسالة، لا خطأً في الفاتورة نفسها. هذا
                الدليل يشرح كيف تقرأ العداد، أشيع أسباب الارتفاع المفاجئ، وخطوات تقديم اعتراض
                رسمي مدعوم بدليل.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Gauge size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أغلق كل الصنابير وراقب العداد لمدة ساعة — إذا استمر الرقم بالتغير رغم عدم
                  الاستخدام، لديك <strong>تسرب فعلي</strong> غالباً من الخزان أو داخل الجدران.
                  احجز كشف تسربات للحصول على تقرير موثق، ثم قدّم اعتراضاً رسمياً على الفاتورة
                  مرفقاً به.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="reading">
                <h2>كيف تقرأ عداد المياه؟</h2>
                <p>
                  أغلب عدادات المياه المنزلية تعرض القراءة بنفس منطق عداد مسافة السيارة — أرقام
                  متتالية بوحدة المتر المكعب (م³). الأرقام الكبيرة أو السوداء تمثل وحدات المتر
                  المكعب الكاملة، بينما الأرقام الأصغر أو ذات اللون المختلف (غالباً أحمر) تمثل
                  أجزاء المتر المكعب — أي اللترات.
                </p>
                <div className="guide-v2-steps">
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">دوّن القراءة الحالية</p>
                      <p className="guide-v2-step-body">اكتب الرقم الظاهر بالكامل بنفس ترتيبه، بما في ذلك خانات اللترات.</p>
                    </div>
                  </div>
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">قارنها بالقراءة السابقة</p>
                      <p className="guide-v2-step-body">استخدم قراءة الفاتورة الماضية أو دوّن رقماً بنفسك في بداية كل شهر.</p>
                    </div>
                  </div>
                  <div className="guide-v2-step">
                    <span className="guide-v2-step-num" aria-hidden="true" />
                    <div>
                      <p className="guide-v2-step-title">اطرح لتحصل على الاستهلاك الفعلي</p>
                      <p className="guide-v2-step-body">الفرق بين القراءتين هو استهلاكك الحقيقي خلال تلك الفترة — قارنه بمتوسطك المعتاد لأي شهر عادي.</p>
                    </div>
                  </div>
                </div>
              </section>

              <ToolInArticleAd slotId="mid-water-meter" />

              <section id="high-bill">
                <h2>لماذا ارتفعت فاتورتك فجأة؟</h2>
                <p>
                  إذا لم يتغير نمط استخدامك للمياه لكن الفاتورة قفزت بشكل واضح، أحد هذه الأسباب
                  الأربعة هو المسؤول عادة:
                </p>
                <div className="guide-v2-compare-list">
                  {HIGH_BILL_CAUSES.map((c) => (
                    <div className="guide-v2-compare-card" key={c.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{c.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{c.body}</p>
                    </div>
                  ))}
                </div>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    اختبار سريع وموثوق: أغلق كل الصنابير والأجهزة تماماً وراقب العداد لمدة ساعة
                    بلا أي استخدام. تغيّر الرقم رغم ذلك يعني تسرباً فعلياً في مكان ما.
                  </span>
                </div>
              </section>

              <section id="complaint">
                <h2>خطوات تقديم اعتراض رسمي</h2>
                <p>
                  اعتراض بلا دليل نادراً ما يُقبل. اتبع هذا الترتيب لزيادة فرصتك الفعلية في
                  إعادة تقييم الفاتورة:
                </p>
                <div className="guide-v2-steps">
                  {COMPLAINT_STEPS.map((step) => (
                    <div className="guide-v2-step" key={step.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <div>
                        <p className="guide-v2-step-title">{step.title}</p>
                        <p className="guide-v2-step-body">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <blockquote className="guide-v2-pullquote">
                  <p>اعتراض مرفق بتقرير كشف تسربات موثق أقوى بكثير من اعتراض بلا دليل.</p>
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
                    <a href="https://arabian-home.com/حل-مشكلة-ارتفاع-فاتورة-المياه-بالرياض/" target="_blank" rel="noreferrer">Arabian Home — حل مشكلة ارتفاع فاتورة المياه</a>
                    {' '}— أسباب ارتفاع الفاتورة وخطوات المعالجة الشائعة في السوق السعودي.
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
            <AdBlogSidebar slotId="sidebar-plumbing-water-meter" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
