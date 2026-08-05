import Link from 'next/link';
import { LampPendant, PaintBrush, Rows, SquaresFour } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodFinishPalette from '@/components/tools-v2/WoodFinishPalette';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-decor');

const TOC_ITEMS = [
  ['elements', 'عناصر الديكور الخشبي الشائعة'],
  ['colors', 'ألوان دهانات الخشب العصرية'],
  ['styles', 'ثلاثة أساليب تنسيق مختلفة'],
  ['faq', 'الأسئلة الشائعة'],
];

const ELEMENTS = [
  { icon: SquaresFour, title: 'جدران خشبية', facts: ['ألواح عمودية أو أفقية على جدار كامل أو جزء منه', 'تعطي دفئاً بصرياً فورياً لغرف المعيشة وخلف السرير'] },
  { icon: Rows, title: 'رفوف عائمة', facts: ['بلا حوامل ظاهرة، تبدو معلّقة بالهواء', 'مثالية لعرض الكتب والقطع الديكورية دون تكدّس بصري'] },
  { icon: LampPendant, title: 'أسقف معلقة خشبية', facts: ['خطوط مستقيمة بسيطة هي الاتجاه الحالي', 'تُدمج غالباً مع إضاءة LED مخفية لإحساس أدفأ'] },
  { icon: PaintBrush, title: 'طاولات وقطع ديكور', facts: ['طاولة قهوة أو جانبية بخشب خام تكسر برودة الديكور المودرن', 'قطعة واحدة بارزة أفضل من عدة قطع صغيرة متفرقة'] },
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
  { route: pickGuides(['wood-types'])[0], reason: 'كل لون تشطيب يظهر بشكل مختلف حسب نوع الخشب نفسه' },
  { route: pickGuides(['furniture-care'])[0], reason: 'قطعة ديكور جديدة؟ اعرف كيف تحافظ على مظهرها' },
  { route: pickGuides(['carpentry-basics'])[0], reason: 'تريد صنع قطعة الديكور بنفسك؟ ابدأ من هنا' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما أكثر لون دهان خشب رائجاً حالياً؟',
    answer: 'الرمادي المغسول (Washed Grey) هو الاتجاه الأبرز حالياً في الديكور العصري — يعطي مظهراً هادئاً ومحايداً يناسب أغلب الألوان المحيطة. العسلي الدافئ يبقى الخيار الكلاسيكي الآمن الذي لا يخرج من الموضة أبداً.',
  },
  {
    question: 'هل الجدار الخشبي مناسب لكل الغرف؟',
    answer: 'يعمل بشكل ممتاز في غرف المعيشة وخلف السرير وأركان القراءة. تجنّبه في الحمامات والمطابخ المعرّضة لرطوبة مباشرة إلا بمعالجة خاصة ضد الرطوبة — راجع دليل تمدد الخشب لفهم كيف تتصرف الألواح الخشبية مع تغيّر الرطوبة قبل التركيب.',
  },
  {
    question: 'ما الفرق بين الديكور الخشبي المودرن والريستيك؟',
    answer: 'المودرن يعتمد خطوطاً مستقيمة نظيفة وألواناً محايدة (رمادي، أبيض مغسول) وتشطيباً أملس. الريستيك يحتفظ بملمس الخشب الخام وعقده الطبيعية وألوانه الدافئة الغامقة، ويميل لمظهر أقل "مثالية" ومتعمّد التقشف.',
  },
];

export default function WoodDecorPage() {
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

      <ToolTopAdSlot slotId="top-wood-decor" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — ديكور</span>
              <h1>ديكورات خشبية عصرية: أفكار جدران ورفوف وألوان حديثة</h1>
              <p className="guide-v2-lead">
                الخشب أسهل مادة تضيف دفئاً فورياً لأي ديكور — لكن الفرق بين نتيجة أنيقة وأخرى
                عشوائية غالباً هو اختيار العنصر واللون المناسبين. هذا الدليل يشرحهما بوضوح.
              </p>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="elements">
                <h2>عناصر الديكور الخشبي الشائعة</h2>
                <div className="guide-v2-type-grid">
                  {ELEMENTS.map((e) => (
                    <div className="guide-v2-type-card" key={e.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <e.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{e.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {e.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-wood-decor" />

              <section id="colors">
                <h2>ألوان دهانات الخشب العصرية</h2>
                <p>اختيار اللون يغيّر شخصية القطعة بالكامل أكثر من نوع الخشب نفسه أحياناً:</p>
                <WoodFinishPalette />
              </section>

              <section id="styles">
                <h2>ثلاثة أساليب تنسيق مختلفة</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">مودرن</span><span className="guide-v2-compare-badge">الأكثر رواجاً حالياً</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>خطوط مستقيمة، ألوان محايدة (رمادي، أبيض مغسول)، تشطيب أملس، إضاءة LED مخفية.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">ريستيك</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>ملمس خشب خام ظاهر بعقده الطبيعية، ألوان دافئة غامقة، مظهر متعمّد البساطة.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">كلاسيك</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عسلي دافئ أو بني غامق، تفاصيل منحوتة أو مشغولة، مظهر فخم تقليدي لا يخرج من الموضة.</p>
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
            <AdBlogSidebar slotId="sidebar-wood-decor" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
