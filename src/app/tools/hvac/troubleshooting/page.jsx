import Link from 'next/link';
import { Drop, MagnifyingGlass, SpeakerHigh, Thermometer, Warning, Wind } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AcTroubleshootingPicker from '@/components/tools-v2/AcTroubleshootingPicker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'troubleshooting');

const TOC_ITEMS = [
  ['overview', 'أشهر 5 مشاكل بنظرة سريعة'],
  ['picker', 'شخّص مشكلتك'],
  ['gas', 'متى تشك أن السبب غاز التبريد؟'],
  ['call', 'متى تتصل بفني فوراً؟'],
  ['faq', 'الأسئلة الشائعة'],
];

const OVERVIEW = [
  { icon: Thermometer, title: 'لا يبرد كفاية', facts: ['السبب الأشيع: فلتر متسخ', 'حل سريع بنفسك غالباً'] },
  { icon: Drop, title: 'يسرب ماء', facts: ['السبب الأشيع: انسداد خرطوم الصرف', 'أسهل مشكلة تحلها بنفسك'] },
  { icon: MagnifyingGlass, title: 'رائحة كريهة', facts: ['غالباً رطوبة وعفن بالفلتر', 'نادراً: تسرب غاز — انتبه للرائحة الكيميائية'] },
  { icon: SpeakerHigh, title: 'صوت عالٍ', facts: ['غالباً تركيب غير ثابت', 'إن كان معدنياً حاداً: أوقف التشغيل'] },
  { icon: Wind, title: 'يطفئ نفسه فجأة', facts: ['غالباً مشكلة كهربائية', 'يحتاج فحصاً فنياً غالباً'] },
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
  { route: pickGuides(['maintenance-schedule'])[0], reason: 'كثير من الأعطال البسيطة سببها فلتر متسخ — امنعها بجدول صيانة منتظم' },
  { route: pickGuides(['replace-or-repair'])[0], reason: 'الأعطال تتكرر رغم الإصلاح؟ اعرف هل حان وقت الاستبدال' },
  { route: pickGuides(['ac-types'])[0], reason: 'قد تكون المشكلة أن النوع نفسه غير مناسب لمساحتك أصلاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف اعرف ان المكيف يحتاج غاز؟',
    answer: 'أوضح علامة هي أن المكيف يعمل ويصدر هواء بارداً لكن التبريد ضعيف جداً ولا يصل للحرارة المطلوبة رغم مرور وقت طويل، مع احتمال تكوّن صقيع أو ثلج على الأنابيب النحاسية للوحدة الداخلية. هذه الحالة تحتاج فنياً مختصاً لفحص الضغط وتحديد إن كان هناك تسريب فعلي قبل إعادة التعبئة.',
  },
  {
    question: 'المكيف يسرب ماء، هل هذا خطير؟',
    answer: 'ليس خطيراً في الغالب، لكنه يستحق حلاً سريعاً قبل أن يتلف السقف أو الجدار. السبب الأشيع بفارق كبير هو انسداد بسيط في خرطوم الصرف يمكنك تنظيفه بنفسك — راجع الأداة أعلاه للتفاصيل.',
  },
  {
    question: 'لماذا يصدر مكيفي صوتاً عالياً عند التشغيل؟',
    answer: 'غالباً بسبب تركيب غير ثابت للوحدة الخارجية أو اهتزاز في قاعدتها — تحقق من إحكام تثبيتها أولاً. إن كان الصوت معدنياً حاداً أو صادراً من داخل الوحدة نفسها، فقد يكون خللاً في المروحة أو الكمبروسر ويحتاج فحصاً فنياً.',
  },
  {
    question: 'المكيف لا يبرد رغم أنه يعمل، ما السبب؟',
    answer: 'ابدأ دائماً بالفلتر — فلتر متسخ يعيق تدفق الهواء وهو السبب الأشيع بفارق كبير. إن كان الفلتر نظيفاً وجربت تنظيف الوحدة الخارجية أيضاً ولم يتحسن التبريد، فالسبب غالباً نقص غاز التبريد أو ضعف بالكمبروسر، وكلاهما يحتاج فنياً.',
  },
  {
    question: 'ما سبب الرائحة الكريهة القادمة من المكيف؟',
    answer: 'في أغلب الحالات رطوبة وعفن متراكم داخل الفلتر أو المبخّر بعد فترة تشغيل طويلة دون تنظيف — حلها تنظيف الوحدة الداخلية جيداً. الاستثناء النادر لكن الخطير هو رائحة كيميائية أقرب لرائحة السمك، وهي علامة محتملة على تسرب غاز تبريد تستدعي إيقاف الجهاز والاتصال بفني فوراً.',
  },
  {
    question: 'هل هذه الأسباب نفسها تنطبق في كل دول الخليج؟',
    answer: 'نعم — أسباب هذه الأعطال هندسية بحتة (فلتر، صرف، غاز، كهرباء) ولا تختلف بين السعودية والإمارات والكويت وقطر والبحرين وعُمان. ما يختلف فقط هو تكرار الحاجة للصيانة: المناطق شديدة الغبار أو الحرارة الطويلة تحتاج فحصاً أكثر تكراراً من غيرها.',
  },
];

export default function TroubleshootingPage() {
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

      <ToolTopAdSlot slotId="top-troubleshooting" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — تشخيص سريع</span>
              <h1>لماذا لا يبرد مكيفك؟ تشخيص سريع لأشهر أعطال المكيف</h1>
              <p className="guide-v2-lead">
                قبل أن تتصل بفني، اختر العرَض الذي تلاحظه بالضبط واحصل على السبب الأرجح — وهل يمكنك
                حله بنفسك في دقائق أم يحتاج فعلاً فنياً مختصاً. يصلح هذا الدليل لأي مكيف سبليت أو
                شباك أو مركزي، في أي دولة خليجية.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Wind size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أغلب مشاكل المكيف اليومية (لا يبرد، رائحة، صوت خفيف) سببها <strong>فلتر متسخ أو
                  اتساخ الوحدة الخارجية</strong> ويمكنك حلها بنفسك خلال دقائق. العلامات التي تستدعي
                  فنياً فوراً: رائحة كيميائية غريبة، صوت معدني حاد، أو انطفاء متكرر مفاجئ.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="overview">
                <h2>أشهر 5 مشاكل بنظرة سريعة</h2>
                <div className="guide-v2-type-grid">
                  {OVERVIEW.map((o) => (
                    <div className="guide-v2-type-card" key={o.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <o.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{o.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {o.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="picker">
                <h2>شخّص مشكلتك</h2>
                <p>لا يبرد؟ يسرب ماء؟ رائحة؟ صوت؟ يطفئ نفسه؟ اختر ما يحدث فعلاً:</p>
                <AcTroubleshootingPicker />
              </section>

              <ToolInArticleAd slotId="mid-troubleshooting" />

              <section id="gas">
                <h2>متى تشك أن السبب غاز التبريد؟</h2>
                <p>
                  نقص غاز التبريد (الفريون) له علامتان مميزتان تفرّقانه عن سبب "الفلتر المتسخ" الأشيع:
                  الجهاز يعمل ويصدر هواء لكن التبريد ضعيف جداً رغم مرور وقت طويل، وقد تلاحظ تكوّن صقيع
                  أو طبقة ثلج على الأنابيب النحاسية بالوحدة الداخلية أو الخارجية. هذه الحالة لا يمكن
                  حلها بالتنظيف المنزلي — نقص الغاز يعني وجود تسرب في مكان ما بالدائرة يحتاج فنياً
                  لتحديده وإصلاحه قبل إعادة التعبئة، وليس مجرد "إضافة غاز" فقط.
                </p>
              </section>

              <section id="call">
                <h2>متى تتصل بفني فوراً بدل المحاولة بنفسك؟</h2>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    أوقف تشغيل المكيف واتصل بفني فوراً إن لاحظت: رائحة كيميائية غريبة (أقرب للسمك، وليست
                    رائحة عفن عادية)، صوتاً معدنياً حاداً ومتزايداً، أو انطفاء الجهاز فجأة بشكل متكرر —
                    هذه علامات قد تشير لمشكلة كهربائية أو تسرب غاز، والاستمرار بالتشغيل قد يزيد الضرر
                    أو يشكّل خطراً فعلياً.
                  </span>
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
                    <a href="https://www.tcl.com/sa/ar/blogs/tips/ac-leaking-water-causes-and-fix" target="_blank" rel="noreferrer">TCL — أسباب تسريب ماء المكيف وطرق إصلاحه</a>
                  </li>
                  <li>
                    <a href="https://fix-serve.com/reasons-behind-bad-smells-coming-from-the-air-conditioner" target="_blank" rel="noreferrer">خدمة إصلاح — أسباب الرائحة الكريهة من المكيف</a>
                  </li>
                  <li>
                    <a href="https://www.goldi-eg.com/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/%D9%84%D9%85%D8%A7%D8%B0%D8%A7-%D8%A7%D9%84%D8%AA%D9%83%D9%8A%D9%8A%D9%81-%D9%84%D8%A7-%D9%8A%D8%A8%D8%B1%D8%AF-7-%D8%A3%D8%B3%D8%A8%D8%A7%D8%A8-%D8%B4%D8%A7%D8%A6%D8%B9%D8%A9-%D9%88%D8%AD%D9%84%D9%88%D9%84-%D8%A8%D8%B3%D9%8A%D8%B7%D8%A9" target="_blank" rel="noreferrer">صيانة جولدي — لماذا التكييف لا يبرد؟ 7 أسباب شائعة</a>
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
            <AdBlogSidebar slotId="sidebar-troubleshooting" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
