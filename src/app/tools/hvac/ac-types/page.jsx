import Link from 'next/link';
import { Buildings, Fan, Gauge, Snowflake, Waves, Wind } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AcTypeChecker from '@/components/tools-v2/AcTypeChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'ac-types');
const CURRENT_YEAR = new Date().getFullYear();

const TOC_ITEMS = [
  ['types', 'أنواع المكيفات وأبرز الفروق'],
  ['checker', 'أي نوع يناسبك؟'],
  ['coastal', 'المناطق الساحلية والرطبة'],
  ['faq', 'الأسئلة الشائعة'],
];

const TYPES = [
  {
    icon: Wind,
    title: 'سبليت (Split)',
    facts: ['وحدتان: داخلية وخارجية موصولتان بأنابيب نحاس', 'أهدأ وأكفأ من الشباك للمساحة نفسها', 'الأشيع في الشقق والفلل بالخليج'],
  },
  {
    icon: Buildings,
    title: 'شباك (Window)',
    facts: ['وحدة واحدة متكاملة تُركّب بفتحة جدار أو نافذة', 'الأرخص شراءً وتركيباً', 'صوت تشغيل أعلى نسبياً من السبليت'],
  },
  {
    icon: Snowflake,
    title: 'مركزي (Central)',
    facts: ['تبريد موحّد للمنزل كله عبر شبكة دكت', 'بلا وحدات ظاهرة على الجدران', 'تكلفة تركيب أولية أعلى، يحتاج تصميماً مسبقاً'],
  },
  {
    icon: Gauge,
    title: 'دولابي (Cabinet/Floor)',
    facts: ['قدرة تبريد عالية لمساحات كبيرة أو شبه مفتوحة', 'يُركّب أرضياً بلا حاجة لدكت كامل', 'شائع في الصالات الكبيرة والمجالس'],
  },
  {
    icon: Fan,
    title: 'كاسيت (Cassette)',
    facts: ['يُركّب في السقف المعلق ويوزّع الهواء بالتساوي', 'خيار شائع في المحلات والمكاتب', 'يحتاج سقفاً معلقاً بارتفاع كافٍ'],
  },
  {
    icon: Waves,
    title: 'صحراوي (تبخيري)',
    facts: ['يعتمد تبخّر الماء لا غاز التبريد', 'استهلاك كهرباء أقل بكثير من المكيفات العادية', 'فعّال في الأجواء الجافة الحارة فقط، ضعيف بالرطوبة'],
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
  { route: pickGuides(['inverter-savings'])[0], reason: 'أي نوع تختار، انفرتر يوفر عليك كهرباء بغض النظر عن الشكل' },
  { route: pickGuides(['maintenance-schedule'])[0], reason: 'بعد اختيار النوع، اعرف جدول صيانته الصحيح' },
  { route: pickGuides(['troubleshooting'])[0], reason: 'مكيفك الحالي فيه مشكلة؟ شخّصها هنا أولاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين مكيف الشباك والاسبليت؟',
    answer: 'الشباك وحدة واحدة متكاملة تُركّب بفتحة جدار، وهو الأرخص شراءً وتركيباً لكنه أعلى صوتاً وأقل كفاءة. السبليت وحدتان منفصلتان (داخلية وخارجية)، أهدأ وأكفأ في استهلاك الكهرباء للمساحة نفسها، لكن سعره وتركيبه أعلى.',
  },
  {
    question: 'الفرق بين المكيف المركزي والاسبليت؟',
    answer: 'المركزي يبرّد المنزل كله بنظام موحد عبر شبكة دكت مخفية بلا وحدات ظاهرة، لكنه يحتاج تصميماً وتمديداً من مرحلة البناء وتكلفة تركيب أعلى بكثير. السبليت يعطيك تحكماً منفصلاً بكل غرفة ويمكن إضافته لاحقاً بسهولة لأي منزل جاهز.',
  },
  {
    question: `أي نوع مكيف يناسب المناطق الساحلية والرطبة في ${CURRENT_YEAR}؟`,
    answer: 'في المناطق الساحلية (كجدة والدمام وأبوظبي والدوحة والكويت)، الهواء المشبع بالملح يسرّع تآكل الوحدة الخارجية المعدنية. اختر مكيف سبليت أو شباك من ماركة تذكر صراحة معالجة مضادة للتآكل (Blue Fin أو طلاء حماية مماثل) للوحدة الخارجية، وتجنّب المكيف الصحراوي التبخيري تماماً في هذه المناطق لأن الرطوبة العالية تُفقده فعاليته.',
  },
  {
    question: 'ما الفرق بين المكيف الانفرتر والعادي؟',
    answer: 'باختصار: الانفرتر يضبط سرعة الضاغط باستمرار فيوفر 30-50% من الكهرباء ويعمل بهدوء أكبر، بينما العادي يعمل بتشغيل وإيقاف متكرر. التفاصيل الكاملة مع أداة تحسب توفيرك بعملتك في دليل الانفرتر مقابل العادي.',
  },
  {
    question: 'هل المكيف الصحراوي أوفر من مكيف الغاز العادي؟',
    answer: 'نعم من ناحية استهلاك الكهرباء — المكيف الصحراوي (التبخيري) يستهلك كهرباء أقل بكثير لأنه لا يحتوي ضاغطاً أو غاز تبريد. لكنه فعّال فقط في الأجواء الجافة الحارة؛ في الأجواء الرطبة يفقد قدرته على خفض الحرارة بشكل ملحوظ، لذا لا يُنصح به في المدن الساحلية.',
  },
  {
    question: 'كم يبلغ العمر الافتراضي لأي نوع مكيف؟',
    answer: 'يتراوح العمر الافتراضي لمعظم أنواع المكيفات بين 10 و15 عاماً مع صيانة دورية منتظمة. إن تجاوز مكيفك هذا العمر وبدأت الأعطال تتكرر، راجع دليل استبدال المكيف أم إصلاحه لمعرفة القرار الأنسب لحالتك.',
  },
];

export default function AcTypesGuidePage() {
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

      <ToolTopAdSlot slotId="top-ac-types" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — دليل شراء</span>
              <h1>أنواع المكيفات: الفرق بين السبليت والشباك والمركزي وأيها يناسبك</h1>
              <p className="guide-v2-lead">
                سبعة أنواع مكيفات شائعة في السوق العربي، كل واحد له مكان يناسبه أكثر من غيره. هذا
                الدليل يشرح الفروق الحقيقية بينها من ناحية التكلفة والتركيب والكفاءة، مع أداة تقترح
                لك النوع الأنسب لمساحتك مباشرة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Wind size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>غرفة واحدة</strong> → شباك أو سبليت صغير. <strong>شقة كاملة</strong> → سبليت
                  لكل غرفة. <strong>فيلا</strong> → مركزي إن سمحت الميزانية، وإلا عدة وحدات سبليت.
                  <strong> محل أو مكتب</strong> → كاسيت للأسقف المعلقة. وفي كل الحالات: الانفرتر يوفر
                  عليك 30-50% من الكهرباء مهما كان النوع الذي تختاره.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع المكيفات وأبرز الفروق</h2>
                <p>
                  قبل أي مقارنة تفصيلية، هذه نظرة سريعة على الأنواع السبعة الأكثر انتشاراً وما يميّز
                  كل واحد منها:
                </p>
                <div className="guide-v2-type-grid">
                  {TYPES.map((t) => (
                    <div className="guide-v2-type-card" key={t.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <t.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{t.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {t.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-ac-types" />

              <section id="checker">
                <h2>أي نوع يناسبك؟</h2>
                <p>
                  الجدول أعلاه يعطيك الصورة العامة، لكن القرار الفعلي يعتمد على مساحتك تحديداً.
                  اختر نوع المساحة أدناه واحصل على اقتراح مباشر:
                </p>
                <AcTypeChecker />
              </section>

              <section id="coastal">
                <h2>أي نوع يناسب المناطق الساحلية والرطبة؟</h2>
                <p>
                  في المدن الساحلية الخليجية (جدة، الدمام، أبوظبي، الدوحة، الكويت)، الهواء المشبع
                  بالملح والرطوبة يسرّع تآكل الوحدة الخارجية المعدنية أكثر بكثير من المناطق الجافة
                  الداخلية مثل الرياض. عند الشراء في هذه المناطق:
                </p>
                <ul>
                  <li>اختر سبليت أو شباك بمعالجة مضادة للتآكل للوحدة الخارجية (يُذكر غالباً كـ"Blue Fin" أو طلاء حماية مماثل).</li>
                  <li>تجنّب المكيف الصحراوي التبخيري تماماً — الرطوبة العالية تُفقده فعاليته في خفض الحرارة.</li>
                  <li>افحص الوحدة الخارجية بصرياً كل بضعة أشهر بحثاً عن بوادر صدأ مبكرة، خصوصاً إن كانت قريبة من البحر مباشرة.</li>
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
                    <a href="https://www.hitachiaircon.com/newsroom/en/news/split-ac-vs-window-ac" target="_blank" rel="noreferrer">Hitachi Cooling & Heating — Split AC vs Window AC</a>
                    {' '}— مقارنة فنية من مصنّع مكيفات.
                  </li>
                  <li>
                    <a href="https://www.energysage.com/heat-pumps/mini-splits-vs-window-acs/" target="_blank" rel="noreferrer">EnergySage — Mini Splits vs Window ACs</a>
                    {' '}— مقارنة الكفاءة والتكلفة الإجمالية.
                  </li>
                  <li>
                    <a href="https://www.trane.com/residential/en/resources/blog/whole-house-ac-vs-window-ac-units/" target="_blank" rel="noreferrer">Trane — Whole-House AC vs Window AC Units</a>
                    {' '}— شرح فروق التركيب والتغطية.
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
            <AdBlogSidebar slotId="sidebar-ac-types" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
