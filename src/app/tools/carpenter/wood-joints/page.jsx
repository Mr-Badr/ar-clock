import Link from 'next/link';
import { PuzzlePiece } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { JOINTS } from '@/components/tools-v2/WoodJointDiagram';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-joints');

const TOC_ITEMS = [
  ['joints', 'أشهر 6 وصلات نجارة'],
  ['choose', 'كيف تختار الوصلة المناسبة'],
  ['faq', 'الأسئلة الشائعة'],
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
  { route: pickGuides(['wood-types'])[0], reason: 'اختر النوع المناسب لصلابة تتحمل الوصلة التي قررتها' },
  { route: pickGuides(['wood-calculator'])[0], reason: 'بعد تحديد الوصلة، احسب كمية الخشب اللازمة بدقة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما هي أقوى وصلة خشب؟',
    answer: 'وصلة اللسان والنقر (Mortise & Tenon) هي الأقوى بين الوصلات الشائعة — تقاوم الشد والالتواء معاً وليس الضغط فقط، ولهذا استخدمها النجارون لآلاف السنين في هياكل الأثاث التي تتحمل وزناً وحركة مستمرة كأرجل الطاولات والكراسي.',
  },
  {
    question: 'ما الفرق بين الوصلة المجلخة ووصلة الفلحة؟',
    answer: 'المجلخة (Dado) تجويف كامل داخل سطح اللوح يستقر فيه لوح آخر عمودياً — شائعة برفوف الخزائن. الفلحة (Rabbet) درجة على حافة اللوح فقط — شائعة بالجزء الخلفي لخزائن الكتب وحواف الصناديق. المجلخة أقوى عموماً لأنها توزّع الوزن على تجويف كامل بدل حافة واحدة.',
  },
  {
    question: 'كيف اوصل قطع خشب بدون أدوات نجارة احترافية؟',
    answer: 'وصلة الحافة البسيطة (Butt Joint) مع غراء خشب جيد وبراغي هي الأسهل بلا أدوات متخصصة — مناسبة للمشاريع البسيطة وغير الحاملة لوزن كبير. لأي وصلة أقوى (مجلخة، فلحة، لسان ونقر) ستحتاج منشاراً دقيقاً على الأقل.',
  },
  {
    question: 'أي وصلة تناسب لصق ألواح عريضة لسطح طاولة؟',
    answer: 'الوصلة البسكويتية (Biscuit Joint) هي الخيار الشائع لهذا الغرض تحديداً — تمنع انزلاق الألواح عن بعضها أثناء اللصق دون أن تظهر من الخارج، وتحتاج أداة قص بسكويت مخصصة غير مكلفة.',
  },
];

export default function WoodJointsPage() {
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

      <ToolTopAdSlot slotId="top-wood-joints" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — دليل مصوّر</span>
              <h1>أنواع وصلات الخشب: دليل مصوّر لأشهر 6 وصلات نجارة</h1>
              <p className="guide-v2-lead">
                طريقة وصل قطعتي خشب ببعضهما تفرق في متانة القطعة النهائية أكثر من نوع الخشب نفسه
                أحياناً. هذا الدليل يشرح كل وصلة برسم توضيحي أصلي، بلا مصطلحات معقدة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><PuzzlePiece size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  للأثاث اليومي المتحرك (طاولات، كراسي): <strong>اللسان والنقر</strong>. للرفوف
                  الداخلية: <strong>المجلخة</strong>. للزوايا الظاهرة: <strong>الغرة</strong>. لأسطح
                  عريضة من ألواح ملصوقة: <strong>البسكويتية</strong>. للمشاريع البسيطة السريعة:
                  <strong> الحافة البسيطة</strong>.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="joints">
                <h2>أشهر 6 وصلات نجارة</h2>
                <div className="guide-v2-type-grid">
                  {JOINTS.map((j) => (
                    <div className="guide-v2-type-card" key={j.id}>
                      <j.Diagram />
                      <p className="guide-v2-type-card-title" style={{ marginTop: 'var(--space-3)' }}>{j.name}</p>
                      <ul className="guide-v2-type-card-facts">
                        <li><strong>القوة:</strong> {j.strength}</li>
                        <li><strong>الصعوبة:</strong> {j.difficulty}</li>
                        <li>{j.uses}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-wood-joints" />

              <section id="choose">
                <h2>كيف تختار الوصلة المناسبة</h2>
                <p>اسأل نفسك سؤالين قبل القرار: هل القطعة ستتحمل وزناً وحركة مستمرة، وهل تريد إخفاء حواف القطع تماماً؟</p>
                <div className="guide-v2-steps">
                  {JOINTS.map((j) => (
                    <div className="guide-v2-step" key={j.id}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <p className="guide-v2-step-title">{j.name}</p>
                      <p className="guide-v2-step-body">{j.note}</p>
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
                    <a href="https://www.core77.com/posts/43001/reference-the-ultimate-wood-joint-visual-reference-guide" target="_blank" rel="noreferrer">Core77 — The Ultimate Wood Joint Visual Reference Guide</a>
                  </li>
                </ul>
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
            <AdBlogSidebar slotId="sidebar-wood-joints" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
