import Link from 'next/link';
import { CalendarCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AcMaintenanceTracker from '@/components/tools-v2/AcMaintenanceTracker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'maintenance-schedule');

const TOC_ITEMS = [
  ['why', 'لماذا الصيانة الدورية مهمة'],
  ['schedule', 'جدول التنظيف حسب بيئتك'],
  ['tracker', 'احسب موعدك القادم'],
  ['summer', 'تجهيز المكيف قبل الصيف'],
  ['faq', 'الأسئلة الشائعة'],
];

const SCHEDULE_ROWS = [
  ['بيئة عادية (منزل، تشغيل معتدل)', 'كل 3 أشهر'],
  ['بيئة مغبرة أو صحراوية', 'كل شهر، وأحياناً كل 10 أيام في الغبار الكثيف'],
  ['بيئة ساحلية رطبة', 'كل 45 يوماً تقريباً (لمنع العفن والروائح لا الغبار)'],
];

const SUMMER_STEPS = [
  { title: 'نظّف الفلتر والغطاء الأمامي', body: 'فك الفلتر واغسله بالماء، ودعه يجف تماماً قبل إعادة تركيبه — فلتر رطب يشجّع نمو العفن.' },
  { title: 'افحص درج تجميع الماء ومسار الصرف', body: 'تأكد أن خرطوم التصريف غير مسدود وأن ميله ما زال باتجاه الخارج، لمنع تسرب الماء لاحقاً.' },
  { title: 'نظّف الوحدة الخارجية', body: 'أزل الأتربة وأي أوراق أو أجسام متراكمة حول الوحدة الخارجية للسماح بتهوية جيدة وكفاءة تبريد أعلى.' },
  { title: 'افحص ضغط غاز التبريد إن أمكن', body: 'إن كان مكيفك قديماً أو لاحظت ضعفاً بالتبريد الموسم الماضي، اطلب فحص الضغط من فني قبل بداية الصيف لا بعده.' },
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
  { route: pickGuides(['troubleshooting'])[0], reason: 'إهملت الصيانة وبدأت مشكلة فعلية؟ شخّصها هنا' },
  { route: pickGuides(['replace-or-repair'])[0], reason: 'الصيانة المنتظمة تطيل عمر مكيفك — اعرف متى ينتهي فعلاً' },
  { route: pickGuides(['ac-types'])[0], reason: 'أنواع مختلفة من المكيفات تحتاج تفاصيل صيانة مختلفة قليلاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم مرة يجب تنظيف المكيف في السنة؟',
    answer: 'الحد الأدنى المتفق عليه هو مرتين سنوياً (قبل الصيف وبعده)، لكن للاستخدام اليومي المكثف في بيئة عادية يُنصح بتنظيف الفلتر كل 3 أشهر تقريباً. في البيئات المغبرة أو الصحراوية، الفترة تنزل لشهر واحد فقط — استخدم الأداة أعلاه لحساب موعدك بدقة حسب بيئتك.',
  },
  {
    question: 'متى يجب تغيير فلتر المكيف الهوائي؟',
    answer: 'الفلاتر القابلة للغسل تُنظَّف لا تُستبدل، بنفس الجدول أعلاه. الفلاتر الورقية غير القابلة للغسل (شائعة في بعض المكيفات المركزية) تُستبدل عادة كل 1-3 أشهر حسب نوعها ودرجة الاستخدام.',
  },
  {
    question: 'هل تنظيف المكيف بنفسك كافٍ أم أحتاج فنياً كل مرة؟',
    answer: 'تنظيف الفلتر والغطاء الخارجي عمل يمكن لأي شخص القيام به بنفسه بسهولة. لكن فحص ضغط غاز التبريد وتنظيف الملفات الداخلية بعمق يحتاج أدوات ومعرفة فنية — يكفي فني مختص مرة أو مرتين سنوياً لهذا الجزء، والباقي يمكنك متابعته بنفسك.',
  },
  {
    question: 'ما أفضل وقت لتجهيز المكيف قبل الصيف؟',
    answer: 'يُفضَّل إجراء الصيانة الشاملة خلال فصل الربيع، قبل أن ترتفع درجات الحرارة وتبدأ فترة التشغيل المكثف — تجنّباً لطابور انتظار طويل لدى فنيي الصيانة ولاكتشاف أي عطل قبل أن يتفاقم مع الاستخدام اليومي.',
  },
  {
    question: 'هل جدول الصيانة نفسه يصلح لكل دول الخليج؟',
    answer: 'نعم من ناحية المبدأ (كل مكيف يحتاج تنظيف فلتر دورياً)، لكن الفترة الفعلية تختلف حسب بيئتك لا حدودك الجغرافية: مدن داخلية مغبرة كالرياض تحتاج تنظيفاً أكثر تكراراً من مدن ساحلية كجدة أو أبوظبي أو الدوحة، التي تواجه رطوبة وملوحة بدل الغبار. اختر بيئتك في الأداة أعلاه لا اسم دولتك.',
  },
];

export default function MaintenanceSchedulePage() {
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

      <ToolTopAdSlot slotId="top-maintenance-schedule" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — صيانة</span>
              <h1>جدول صيانة المكيف: متى تنظف الفلتر وتجهز مكيفك للصيف</h1>
              <p className="guide-v2-lead">
                فلتر متسخ هو السبب الأشيع لضعف التبريد وارتفاع فاتورة الكهرباء معاً — ومعظم الناس
                يؤجلون تنظيفه لأنهم لا يتذكرون آخر مرة فعلوا ذلك. هذه الصفحة تحسب موعدك القادم بالضبط
                وتتيح لك تحميل تذكير حقيقي لتقويمك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarCheck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>بيئة عادية</strong>: نظّف الفلتر كل 3 أشهر. <strong>بيئة مغبرة أو صحراوية</strong>:
                  كل شهر تقريباً. <strong>بيئة ساحلية رطبة</strong>: كل 45 يوماً تقريباً لمنع العفن
                  والروائح. أدخل تاريخ آخر تنظيف أدناه للحصول على موعدك القادم بالضبط.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا الصيانة الدورية مهمة</h2>
                <p>
                  فلتر متسخ يعيق تدفق الهواء، فيضطر مكيفك للعمل بجهد أكبر للوصول لنفس درجة التبريد —
                  ما يعني استهلاك كهرباء أعلى، ضغطاً إضافياً على الكمبروسر يقصّر عمره الافتراضي، ورطوبة
                  متراكمة تتحول لعفن ورائحة كريهة مع الوقت. الصيانة الدورية البسيطة تمنع هذه المشاكل
                  الثلاث معاً بأقل مجهود ممكن.
                </p>
              </section>

              <section id="schedule">
                <h2>جدول التنظيف حسب بيئتك</h2>
                <div className="guide-v2-compare-list">
                  {SCHEDULE_ROWS.map(([env, freq]) => (
                    <div className="guide-v2-compare-card" key={env}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{env}</span></div>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--amber-text)' }}>{freq}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-maintenance-schedule" />

              <section id="tracker">
                <h2>احسب موعدك القادم</h2>
                <p>أدخل تاريخ آخر تنظيف ونوع بيئتك، واحصل على الموعد القادم مع خيار تحميل تذكير لتقويمك:</p>
                <AcMaintenanceTracker />
              </section>

              <section id="summer">
                <h2>تجهيز المكيف قبل الصيف</h2>
                <p>فحص شامل مرة واحدة قبل بداية موسم الحر يوفر عليك أعطالاً مفاجئة في أشد أيام الصيف حرارة:</p>
                <div className="guide-v2-steps">
                  {SUMMER_STEPS.map((s) => (
                    <div className="guide-v2-step" key={s.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <p className="guide-v2-step-title">{s.title}</p>
                      <p className="guide-v2-step-body">{s.body}</p>
                    </div>
                  ))}
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
                    <a href="https://www.voltiat.com/annual-ac-maintenance-in-saudi-arabia/" target="_blank" rel="noreferrer">فولتيات — الصيانة السنوية للمكيف في السعودية</a>
                  </li>
                  <li>
                    <a href="https://airvocool.com/blog/cleaning-air-conditioners-before-summer/" target="_blank" rel="noreferrer">ايرفو كول — تنظيف المكيفات قبل الصيف بالرياض</a>
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
            <AdBlogSidebar slotId="sidebar-maintenance-schedule" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
