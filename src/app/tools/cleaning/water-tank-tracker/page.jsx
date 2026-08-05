import Link from 'next/link';
import { CalendarCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WaterTankTracker from '@/components/tools-v2/WaterTankTracker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cleaning-water-tank-tracker');

const TOC_ITEMS = [
  ['why', 'لماذا تنظيف الخزان الدوري مهم'],
  ['schedule', 'الجدول حسب نوع الخزان وحجم الأسرة'],
  ['tracker', 'احسب موعدك القادم'],
  ['signs', 'علامات تحتاج تنظيفاً فورياً'],
  ['faq', 'الأسئلة الشائعة'],
];

const SCHEDULE_ROWS = [
  ['خزان بلاستيك أو فايبرجلاس — أسرة متوسطة', 'كل 6 أشهر (قبل الصيف وقبل الشتاء)'],
  ['خزان معدني (ستانلس أو مجلفن)', 'كل 5 أشهر ونصف تقريباً — أسرع قليلاً لخطر الصدأ والترسبات'],
  ['أسرة كبيرة (7 أفراد فأكثر)', 'كل 5 أشهر ونصف تقريباً — استهلاك أعلى يسرّع تراكم الترسبات'],
];

const SIGNS = [
  { title: 'تغيّر لون الماء أو طعمه', body: 'لون مصفرّ خفيف أو طعم معدني غير معتاد غالباً علامة على ترسبات أو صدأ داخل الخزان تحتاج تنظيفاً فورياً، لا انتظار الموعد الدوري.' },
  { title: 'رائحة غير معتادة من ماء الصنبور', body: 'رائحة عفن أو رائحة كلور قوية بشكل مفاجئ قد تشير لتراكم طحالب أو ترسبات عضوية داخل الخزان.' },
  { title: 'ضعف ملحوظ في ضغط المياه', body: 'ترسبات وأوساخ متراكمة في قاع الخزان قد تسد فوهة الخروج جزئياً وتقلل الضغط الواصل للمنزل.' },
  { title: 'أكثر من 6 أشهر منذ آخر فحص', body: 'حتى بدون علامات ظاهرة، الفترة الزمنية وحدها كافية لتبرير فحص وتنظيف — استخدم الأداة أدناه لمعرفة موعدك بدقة.' },
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
  { route: pickGuides(['cleaning-cost-calculator'])[0], reason: 'احسب تكلفة تنظيف الخزان ضمن باقة تنظيف شاملة' },
  { route: pickGuides(['cleaning-deep-clean-checker'])[0], reason: 'تنظيف دوري آخر يستحق المتابعة: منزلك بالكامل' },
  { route: pickGuides(['cleaning-quote-generator'])[0], reason: 'حوّل الموعد إلى عرض سعر جاهز لشركة التنظيف' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم مرة يجب تنظيف خزان المياه في السنة؟',
    answer: 'القاعدة المتفق عليها عموماً هي مرتين سنوياً كحد أدنى، مرة قبل الصيف ومرة قبل الشتاء — تزامناً مع فترات ارتفاع الاستهلاك وتغيّر درجة حرارة المياه. الفترة الفعلية قد تقصر قليلاً حسب نوع خزانك وعدد أفراد أسرتك — استخدم الأداة أعلاه لحساب موعدك بدقة.',
  },
  {
    question: 'متى ينظف خزان المياه المعدني مقارنة بالبلاستيكي؟',
    answer: 'الخزانات المعدنية (ستانلس أو مجلفن) تحتاج فحصاً وتنظيفاً أقرب قليلاً من البلاستيك أو الفايبرجلاس، بسبب احتمال الصدأ وتراكم الترسبات المعدنية على الجدران الداخلية مع الوقت. اختر نوع خزانك في الأداة أعلاه ليُعدَّل موعدك تبعاً لذلك.',
  },
  {
    question: 'هل عدد أفراد الأسرة يؤثر على جدول تنظيف الخزان؟',
    answer: 'نعم بشكل غير مباشر — الأسرة الكبيرة تستهلك ماء أكثر، ما يعني دوران أسرع للمياه داخل الخزان وتراكماً أسرع نسبياً للرواسب في القاع. الفرق ليس كبيراً لكنه حقيقي، ومُدرج في حساب الأداة أعلاه.',
  },
  {
    question: 'هل يمكنني تنظيف خزان المياه بنفسي؟',
    answer: 'التفريغ والفرك السطحي للخزانات الصغيرة يمكن لبعض الأشخاص القيام به بأدوات بسيطة وحذر، لكن التعقيم الكامل وفحص الشقوق والصمامات يحتاج غالباً فنياً متخصصاً بمعدات تفريغ وتعقيم مناسبة — خصوصاً للخزانات الكبيرة على الأسطح.',
  },
  {
    question: 'هل تختلف مدة الجدول بين دول الخليج؟',
    answer: 'المبدأ نفسه ينطبق في كل دول الخليج (مرتين سنوياً كحد أدنى)، لكن المناطق شديدة الحرارة أو الغبار قد تحتاج فحصاً أقرب قليلاً بسبب ارتفاع درجة حرارة الماء المخزّن وتأثيرها على نمو الطحالب. اختر بيئتك الفعلية بدل الاعتماد على اسم الدولة وحده.',
  },
];

export default function WaterTankTrackerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التنظيف', item: `${SITE_URL}/tools/cleaning` },
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

      <ToolTopAdSlot slotId="top-water-tank-tracker" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تنظيف — صيانة</span>
              <h1>تنظيف خزان المياه: كل كم يُنظَّف ومتى موعدك القادم</h1>
              <p className="guide-v2-lead">
                خزان مياه لا يُنظَّف دورياً يعني ترسبات وطحالب صامتة تتراكم في الماء الذي تشربه
                يومياً. هذه الصفحة تحسب موعدك القادم بالضبط حسب نوع خزانك وعدد أفراد أسرتك، وتتيح
                لك تحميل تذكير حقيقي لتقويمك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarCheck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الحد الأدنى المتفق عليه: تنظيف كل 6 أشهر (قبل الصيف وقبل الشتاء). خزانات معدنية أو
                  أسرة كبيرة قد تحتاج فترة أقصر قليلاً. أدخل تاريخ آخر تنظيف أدناه لموعدك الدقيق.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا تنظيف الخزان الدوري مهم</h2>
                <p>
                  الخزان المكشوف أو نصف المغلق يجمع غباراً وحشرات وأحياناً طحالب مع الوقت والضوء
                  والحرارة، خصوصاً في مناخ الخليج الحار. حتى الخزانات المغلقة جيداً تتراكم فيها
                  رواسب طبيعية من الماء نفسه في القاع مع الوقت. تنظيف دوري بسيط يمنع هذا التراكم
                  من الوصول لمرحلة تؤثر فعلياً على رائحة أو طعم أو جودة الماء الذي تستخدمه أسرتك
                  يومياً للشرب والطهي.
                </p>
              </section>

              <section id="schedule">
                <h2>الجدول حسب نوع الخزان وحجم الأسرة</h2>
                <div className="guide-v2-compare-list">
                  {SCHEDULE_ROWS.map(([env, freq]) => (
                    <div className="guide-v2-compare-card" key={env}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{env}</span></div>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--amber-text)' }}>{freq}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-water-tank-tracker" />

              <section id="tracker">
                <h2>احسب موعدك القادم</h2>
                <p>أدخل تاريخ آخر تنظيف ونوع خزانك وعدد أفراد أسرتك، واحصل على الموعد القادم مع خيار تحميل تذكير لتقويمك:</p>
                <WaterTankTracker />
              </section>

              <section id="signs">
                <h2>علامات تحتاج تنظيفاً فورياً</h2>
                <div className="guide-v2-steps">
                  {SIGNS.map((s) => (
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
                    <a href="https://www.who.int/water_sanitation_health/hygiene/emergencies/fs2_18.pdf" target="_blank" rel="noreferrer">منظمة الصحة العالمية — إرشادات تنظيف وتعقيم خزانات المياه المنزلية</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في التنظيف</p>
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
            <AdBlogSidebar slotId="sidebar-water-tank-tracker" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
