import Link from 'next/link';
import { GraduationCap, Hammer, PaintBrush, Ruler, Screwdriver, Wrench } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'carpentry-basics');

const TOC_ITEMS = [
  ['tools', 'الأدوات الأساسية التي تحتاجها فعلياً'],
  ['first-project', 'مشروعك التدريبي الأول'],
  ['tips', 'نصائح تمنعك من أخطاء المبتدئين'],
  ['faq', 'الأسئلة الشائعة'],
];

const TOOLS = [
  { icon: Ruler, title: 'متر وزاوية قائمة', facts: ['للقياس الدقيق وضبط الزوايا 90 درجة', 'أهم أداة فعلياً — القطع الخاطئ يبدأ من قياس خاطئ'] },
  { icon: Wrench, title: 'منشار يدوي', facts: ['كافٍ تماماً للمشاريع البسيطة الأولى', 'ابدأ به قبل التفكير بمنشار كهربائي'] },
  { icon: Hammer, title: 'مطرقة ومسامير', facts: ['للتثبيت السريع في الوصلات البسيطة', 'اختر مطرقة متوسطة الوزن للتحكم الأفضل'] },
  { icon: Screwdriver, title: 'مفك براغي', facts: ['البراغي أقوى من المسامير في أغلب الوصلات', 'طقم رؤوس متعددة الأحجام يكفي كبداية'] },
  { icon: Wrench, title: 'ورق صنفرة', facts: ['درجات خشونة متعددة (خشن ثم ناعم تدريجياً)', 'يحدد نعومة السطح النهائي قبل الدهان'] },
  { icon: PaintBrush, title: 'غراء خشب', facts: ['أقوى من المسامير وحدها في وصلات كثيرة', 'اتركه يجف كاملاً (24 ساعة) قبل أي حمل وزن'] },
];

const FIRST_PROJECT_STEPS = [
  { title: 'اختر مشروعاً بسيطاً حقاً', body: 'رف حائط واحد أو صندوق تخزين بسيط — ليس طاولة أو كرسياً. الهدف تعلّم القياس والقطع والتجميع، لا إنتاج قطعة معقدة من أول محاولة.' },
  { title: 'اقطع كل القطع قبل التجميع', body: 'قِس مرتين واقطع مرة — خطأ شائع للمبتدئين هو القطع بالتتابع دون التحقق من كل قياس أولاً، فيتراكم خطأ صغير في كل قطعة.' },
  { title: 'جرّب التجميع بدون غراء أولاً', body: '"جرّب قبل أن تلصق" — ركّب القطع مؤقتاً للتأكد أن كل شيء يناسب مكانه بالضبط، قبل استخدام الغراء الذي لا رجعة فيه بعد الجفاف.' },
  { title: 'اصنف واصقل قبل الدهان', body: 'صنفرة جيدة تصنع فرقاً أكبر من نوع الدهان نفسه في المظهر النهائي — لا تتعجل هذه الخطوة.' },
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
  { route: pickGuides(['wood-types'])[0], reason: 'أي نوع خشب تختار لأول مشروع؟ الصنوبر الأسهل تشغيلاً' },
  { route: pickGuides(['wood-joints'])[0], reason: 'بعد إتقان الأساسيات، تعرّف على وصلات أقوى من الغراء والمسامير' },
  { route: pickGuides(['wood-calculator'])[0], reason: 'احسب كمية الخشب الدقيقة لمشروعك الأول قبل الشراء' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما أول أداة يجب أن يشتريها المبتدئ في النجارة؟',
    answer: 'المتر والزاوية القائمة قبل أي شيء آخر — القياس الدقيق هو أساس أي عمل نجارة ناجح، وأي أداة قطع مهما كانت جيدة لن تعوّض قياساً خاطئاً من البداية.',
  },
  {
    question: 'هل أحتاج أدوات كهربائية للبدء؟',
    answer: 'لا إطلاقاً. منشار يدوي ومطرقة ومفك ومتر كافية تماماً لأول 3-4 مشاريع بسيطة. الأدوات الكهربائية (منشار كهربائي، مثقاب) تسرّع العمل لاحقاً لكنها ليست ضرورية للتعلّم الأساسي.',
  },
  {
    question: 'ما أفضل نوع خشب يبدأ به المبتدئ؟',
    answer: 'الصنوبر — رخيص، لين نسبياً وسهل القطع والتشغيل يدوياً، ويسامح أخطاء المبتدئين أكثر من الأخشاب الصلبة كالبلوط التي تحتاج أدوات أقوى وخبرة أكبر.',
  },
  {
    question: 'كم يستغرق تعلّم أساسيات النجارة؟',
    answer: 'يمكنك إتقان القياس والقطع البسيط والتجميع الأساسي خلال أسابيع قليلة من الممارسة المتكررة على مشاريع صغيرة. الإتقان الحقيقي (وصلات معقدة، تشطيب احترافي) يحتاج شهوراً إلى سنوات من الممارسة المستمرة، مثل أي حرفة يدوية.',
  },
];

export default function CarpentryBasicsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'النجارة', item: `${SITE_URL}/tools/carpenter` },
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

      <ToolTopAdSlot slotId="top-carpentry-basics" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — للمبتدئين</span>
              <h1>تعلم النجارة للمبتدئين: الأدوات الأساسية ومشروعك الأول</h1>
              <p className="guide-v2-lead">
                لا تحتاج ورشة كاملة لتبدأ. هذا الدليل يحدد فعلياً ما تحتاجه من أدوات (لا كل ما
                يُباع في المتجر)، وخطوات مشروعك التدريبي الأول قبل الانتقال لأي شيء أعقد.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><GraduationCap size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  ستة أدوات فقط تكفي للبدء (متر وزاوية، منشار يدوي، مطرقة، مفك، ورق صنفرة، غراء
                  خشب) — <strong>لا تحتاج أدوات كهربائية</strong> لأول مشاريعك. ابدأ بقطعة بسيطة
                  حقاً (رف واحد لا طاولة)، وخشب صنوبر لأنه يسامح أخطاء المبتدئين.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="tools">
                <h2>الأدوات الأساسية التي تحتاجها فعلياً</h2>
                <div className="guide-v2-type-grid">
                  {TOOLS.map((t) => (
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

              <ToolInArticleAd slotId="mid-carpentry-basics" />

              <section id="first-project">
                <h2>مشروعك التدريبي الأول</h2>
                <p>اختر رفاً بسيطاً أو صندوق تخزين، ثم اتبع هذا الترتيب بالضبط:</p>
                <div className="guide-v2-steps">
                  {FIRST_PROJECT_STEPS.map((s) => (
                    <div className="guide-v2-step" key={s.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <p className="guide-v2-step-title">{s.title}</p>
                      <p className="guide-v2-step-body">{s.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="tips">
                <h2>نصائح تمنعك من أخطاء المبتدئين</h2>
                <ul>
                  <li>لا تبدأ بخشب صلب (بلوط، زان) — الصنوبر أسهل بكثير للتعلّم عليه.</li>
                  <li>لا تشترِ أدوات كهربائية قبل إتقان الأساسيات اليدوية — تسرّع العمل لكنها لا تعلّمك المهارة الفعلية.</li>
                  <li>لا تتجاهل السلامة: نظارة واقية عند القطع والصنفرة، حتى في المشاريع "البسيطة".</li>
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
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في النجارة</p>
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
            <AdBlogSidebar slotId="sidebar-carpentry-basics" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
