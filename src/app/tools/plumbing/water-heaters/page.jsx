import Link from 'next/link';
import { Drop, Fire, Gauge } from '@phosphor-icons/react/ssr';

import WaterHeaterTypeChecker from '@/components/tools-v2/WaterHeaterTypeChecker.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'water-heaters');

const TOC_ITEMS = [
  ['types', 'أنواع سخانات المياه'],
  ['instant-vs-central', 'فوري أم مركزي؟ الفرق الحقيقي'],
  ['sizing', 'أي سعة تناسب منزلك؟'],
  ['prices', 'الأسعار الشائعة'],
  ['faq', 'الأسئلة الشائعة'],
];

const HEATER_TYPES = [
  {
    name: 'فوري (Instant)',
    badge: 'للشقق والمساحات الصغيرة',
    recommended: true,
    rows: [
      ['الحجم', 'صغير — لا يحتاج مساحة تخزين'],
      ['وقت الانتظار', 'ماء ساخن فوري بلا تسخين مسبق'],
      ['يحتاج', 'تأسيساً كهربائياً أقوى كلما زادت قدرته'],
    ],
  },
  {
    name: 'مركزي (Central / تخزين)',
    rows: [
      ['الحجم', 'يشغل مساحة — خزان تخزين 10 إلى 150+ لتر'],
      ['وقت الانتظار', 'يحتاج تشغيلاً مسبقاً قبل الاستخدام'],
      ['يحتاج', 'أنسب للاستخدام المتزامن في أكثر من نقطة'],
    ],
  },
  {
    name: 'غاز',
    rows: [
      ['الحجم', 'مشابه للفوري الكهربائي'],
      ['وقت الانتظار', 'تسخين سريع دون استهلاك كهرباء عالٍ'],
      ['يحتاج', 'تهوية جيدة وخط غاز آمن مركَّب بشكل صحيح'],
    ],
  },
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
  { route: pickGuides(['water-tanks'])[0], reason: 'لتحسب سعة خزان المياه بنفس منطق حجم أسرتك', icon: Drop },
  { route: pickGuides(['leak-detection'])[0], reason: 'إذا لاحظت رطوبة أو تسرباً قرب موقع السخان', icon: Drop },
  { route: pickGuides(['water-meter'])[0], reason: 'لمتابعة أثر السخان الجديد على فاتورتك', icon: Gauge },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'سخان فوري أم مركزي — أيهما أفضل؟',
    answer: 'لا يوجد "أفضل" مطلق. السخان الفوري أنسب للشقق والاستخدام الفردي أو الثنائي لأنه لا يحتاج مساحة تخزين ويعطي ماءً ساخناً مباشرة. السخان المركزي أنسب للعائلات الأكبر أو عند الحاجة لماء ساخن في أكثر من حمام بنفس الوقت، لأنه يخزن كمية جاهزة مسبقاً.',
  },
  {
    question: 'كم سعة سخان المياه المناسبة لعائلتي؟',
    answer: 'كقاعدة شائعة: فرد واحد 10-30 لتر، شخصان 50-80 لتر، 3-4 أفراد 100-120 لتر، وعائلة من 5 أفراد فأكثر تحتاج 150 لتراً أو أكثر (أو أكثر من سخان موزّع). استخدم الأداة أعلى الصفحة لتقدير مبدئي حسب حجم أسرتك.',
  },
  {
    question: 'كم سعر سخان المياه في السعودية؟',
    answer: 'السخانات الفورية الاقتصادية تبدأ من نحو 180 ريال، والنطاق العام في السوق يمتد من 200 ريال للفئات الاقتصادية إلى أكثر من 1500 ريال للسخانات بتقنيات حديثة وسعات أكبر. الماركات المعروفة (أريستون، الخزف، ليما) تقع عادة في النطاق المتوسط إلى الأعلى.',
  },
  {
    question: 'هل السخان الفوري يستهلك كهرباء أكثر من المركزي؟',
    answer: 'السخان الفوري يستهلك تياراً عالياً لحظياً وقت التشغيل فقط (لا يعمل باستمرار)، بينما المركزي يستهلك طاقة للحفاظ على حرارة الماء المخزَّن طوال الوقت حتى بدون استخدام. أيهما أوفر يعتمد على نمط استخدامك — استخدام متقطع قصير يفضّل الفوري، استخدام متكرر طوال اليوم قد يجعل المركزي أوفر عملياً.',
  },
  {
    question: 'هل اختيار سعة سخان أصغر من حاجتي يرفع فاتورة الكهرباء؟',
    answer: 'نعم بشكل غير مباشر — سخان أصغر من حاجتك يعني تسخيناً متكرراً لتعويض النقص أو انتظاراً أطول يزيد استهلاك الماء والطاقة معاً. اختيار السعة الصحيحة من البداية يوفر عليك كلا الأمرين.',
  },
  {
    question: 'هل يحتاج سخان الغاز صيانة أكثر من الكهربائي؟',
    answer: 'نعم عملياً — يحتاج فحصاً دورياً لخط الغاز والتهوية للتأكد من السلامة، بخلاف السخان الكهربائي الذي يقتصر عادة على فحص المقاومة والصمام الحراري. إذا اخترت الغاز، لا تؤجل الفحص الدوري السنوي.',
  },
];

export default function WaterHeatersGuidePage() {
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

      <ToolTopAdSlot slotId="top-water-heaters" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل سباكة — دليل شراء</span>
              <h1>سخان فوري أم مركزي أم غاز؟</h1>
              <p className="guide-v2-lead">
                كل نوع يناسب موقفاً مختلفاً — لا يوجد خيار واحد "أفضل" للجميع. هذا الدليل يقارن
                الأنواع الثلاثة بصراحة ويساعدك تختار السعة الصحيحة قبل الشراء، لا بعده.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Fire size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>سخان فوري</strong> يناسب الشقق والاستخدام الفردي أو الثنائي — لا يحتاج
                  مساحة تخزين ويعطي ماءً ساخناً مباشرة. <strong>سخان مركزي</strong> يناسب العائلات
                  الأكبر أو استخدام أكثر من حمام بنفس الوقت. السعة المناسبة تبدأ من 10-30 لتر
                  لفرد واحد وتصل إلى 150 لتراً فأكثر لعائلة من 5 أفراد.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع سخانات المياه</h2>
                <p>
                  ثلاثة أنواع رئيسية متوفرة في السوق، وكل واحد يحل مشكلة مختلفة أكثر مما "يتفوق"
                  على الآخر بشكل مطلق:
                </p>
                <div className="guide-v2-compare-list">
                  {HEATER_TYPES.map((type) => (
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
              </section>

              <section id="instant-vs-central">
                <h2>فوري أم مركزي؟ الفرق الحقيقي</h2>
                <p>
                  السخان الفوري يسخّن الماء لحظة مروره داخل الجهاز — لا يوجد خزان، لا وقت
                  انتظار، لكن كل نقطة استخدام (حمام، مطبخ) قد تحتاج جهازها الخاص أو جهازاً
                  مركزياً بقدرة عالية. السخان المركزي يسخّن ويخزّن كمية من الماء مسبقاً في خزان
                  (10-150+ لتراً)، فتحتاج تشغيله قبل الاستخدام بوقت كافٍ، لكنه يغذي أكثر من نقطة
                  بنفس الوقت بسهولة.
                </p>
                <blockquote className="guide-v2-pullquote">
                  <p>السؤال الصحيح ليس "أيهما أفضل؟" بل "كم نقطة استخدام أحتاج تغذيتها بنفس الوقت؟"</p>
                </blockquote>
              </section>

              <ToolInArticleAd slotId="mid-water-heaters" />

              <section id="sizing">
                <h2>أي سعة تناسب منزلك؟</h2>
                <p>
                  سعة أصغر من حاجتك تعني نفاد الماء الساخن بسرعة أو تسخيناً متكرراً يرفع
                  الفاتورة. سعة أكبر من حاجتك تعني طاقة مهدورة في تسخين ماء لا تستخدمه. استخدم
                  الأداة التالية لتقدير مبدئي:
                </p>
                <WaterHeaterTypeChecker />
              </section>

              <section id="prices">
                <h2>الأسعار الشائعة</h2>
                <p>نطاق واسع حسب النوع والسعة والماركة — هذا ملخص واقعي للسوق السعودي:</p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">فوري اقتصادي</span><span className="guide-v2-compare-row-value">من نحو 180 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">النطاق العام للسوق</span><span className="guide-v2-compare-row-value">200 – 1500+ ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">ماركات معروفة</span><span className="guide-v2-compare-row-value">أريستون، الخزف، ليما</span></div>
                    </div>
                  </div>
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
                    <a href="https://zamilco.com/blog/سخان-فوري-أم-سخان-مركزي/" target="_blank" rel="noreferrer">مدونة الزامل — سخان فوري أم سخان مركزي</a>
                    {' '}— مقارنة الأنواع من مصنّع سعودي معروف.
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
            <AdBlogSidebar slotId="sidebar-plumbing-water-heaters" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
