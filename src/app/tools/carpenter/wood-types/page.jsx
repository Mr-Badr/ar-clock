import Link from 'next/link';
import { TreeStructure, Leaf, StackSimple, GridFour, House } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodHardnessComparison from '@/components/tools-v2/WoodHardnessComparison.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-types');

const TOC_ITEMS = [
  ['types', 'أنواع الخشب الشائعة'],
  ['hardness', 'الصلابة الفعلية: مقياس Janka'],
  ['natural-vs-manufactured', 'الخشب الطبيعي مقابل المصنّع'],
  ['choose', 'كيف تختار النوع المناسب'],
  ['faq', 'الأسئلة الشائعة'],
];

const TYPES = [
  {
    icon: TreeStructure,
    title: 'الزان',
    facts: ['من أكثر الأنواع استخداماً بالأثاث اليومي', 'صلب ومتجانس التركيب، يسهل تشكيله وصبغه', 'يتحمل الاستخدام المكثف جيداً'],
  },
  {
    icon: TreeStructure,
    title: 'البلوط (السنديان)',
    facts: ['من أصلب الأخشاب الطبيعية الشائعة', 'مقاوم للرطوبة أفضل من أغلب الأنواع', 'أعلى سعراً، يستخدم بالقطع الفاخرة'],
  },
  {
    icon: Leaf,
    title: 'الصنوبر',
    facts: ['أخف وزناً وأقل صلابة نسبياً', 'رخيص وسهل التشغيل والدهان', 'شائع بالأثاث الاقتصادي والديكورات'],
  },
  {
    icon: Leaf,
    title: 'الجوز',
    facts: ['لون غامق جذاب دون الحاجة لصبغة كثيفة', 'صلابة متوسطة، سهل التشكيل والنحت', 'يستخدم كثيراً بقطع الأثاث المميزة'],
  },
  {
    icon: GridFour,
    title: 'MDF (خشب مضغوط)',
    facts: ['سطح أملس مثالي للدهان اللاكيه', 'أرخص من الخشب الطبيعي بفارق كبير', 'أضعف أمام الرطوبة المباشرة والطويلة'],
  },
  {
    icon: StackSimple,
    title: 'الخشب المعاكس (الكونتر)',
    facts: ['طبقات خشب متعامدة تمنحه ثباتاً أعلى من MDF', 'أخف وزناً من الخشب الطبيعي المصمت', 'يستخدم كثيراً بظهور الخزائن وقواعد الأثاث'],
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
  { route: pickGuides(['wood-calculator'])[0], reason: 'اخترت النوع؟ احسب الكمية والتكلفة الفعلية لمشروعك' },
  { route: pickGuides(['wood-joints'])[0], reason: 'أي نوع تختار، طريقة الوصل تفرق في متانة القطعة النهائية' },
  { route: pickGuides(['kitchen-cabinets-cost'])[0], reason: 'تفكر بمطبخ خشبي؟ قارن تكلفة كل خامة قبل القرار' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين MDF والخشب الطبيعي؟',
    answer: 'الخشب الطبيعي مقطوع مباشرة من جذع الشجرة فيحتفظ بقوته وتحمّله للرطوبة نسبياً، بينما MDF ألياف خشب مضغوطة بمادة رابطة — أرخص وسطحه أملس ومثالي للدهان، لكنه أضعف أمام الرطوبة المباشرة والوزن الثقيل المستمر.',
  },
  {
    question: 'أيهما أفضل الزان أم الموسكي؟',
    answer: 'الزان خشب طبيعي حقيقي معروف عالمياً بصلابته وثباته، بينما "الموسكي" اسم تجاري شائع بالأسواق العربية لأخشاب استوائية مستوردة أرخص نسبياً وتتفاوت جودتها بين مصدر وآخر. للأثاث طويل العمر الزان عادة الخيار الأكثر ثباتاً في الجودة.',
  },
  {
    question: 'ما هو أقوى نوع خشب للأثاث؟',
    answer: 'من الأنواع الشائعة في هذا الدليل، الهيكوري والقيقب الصلب والزان من الأعلى صلابة فعلياً حسب مقياس Janka العلمي — استخدم الأداة أعلاه للمقارنة المباشرة بدل الاعتماد على انطباع عام.',
  },
  {
    question: 'ما هو أرخص نوع خشب مناسب للأثاث؟',
    answer: 'الصنوبر هو الأرخص بين الأخشاب الطبيعية الحقيقية، وMDF أرخص منه إجمالاً لكنه خشب مصنّع لا طبيعي. للميزانية المحدودة مع رغبة في مظهر طبيعي، الصنوبر خيار معقول للقطع غير المعرضة لاستخدام شاق.',
  },
  {
    question: 'هل الخشب المعاكس (الكونتر) أفضل من MDF؟',
    answer: 'لكل منهما استخدامه: الكونتر أثبت هيكلياً (طبقات متعامدة تقاوم الالتواء) وأنسب للأجزاء الحاملة للوزن، وMDF سطحه أنعم وأفضل لدهان لامع أملس. كثير من الأثاث الجيد يجمع الاثنين معاً حسب وظيفة كل جزء.',
  },
];

export default function WoodTypesPage() {
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

      <ToolTopAdSlot slotId="top-wood-types" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — دليل شراء</span>
              <h1>أنواع الخشب: دليل شامل ومقياس الصلابة التفاعلي</h1>
              <p className="guide-v2-lead">
                "أفضل نوع خشب" سؤال بلا جواب واحد — يعتمد على ما تصنعه فعلياً. هذا الدليل يشرح
                أشهر الأنواع المتوفرة في الأسواق العربية، ثم يعطيك أداة تقارن صلابتها الحقيقية
                برقم علمي موثّق، لا برأي عام أو كلام بائع.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><House size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>أثاث يومي:</strong> الزان أو الجوز. <strong>أرضيات وأسطح كثيرة الاحتكاك:</strong>{' '}
                  البلوط أو القيقب الصلب. <strong>ميزانية محدودة:</strong> الصنوبر (طبيعي) أو MDF (مصنّع).
                  <strong> أجزاء خفية حاملة للوزن:</strong> الخشب المعاكس (الكونتر).
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع الخشب الشائعة</h2>
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

              <ToolInArticleAd slotId="mid-wood-types" />

              <section id="hardness">
                <h2>الصلابة الفعلية: مقياس Janka</h2>
                <p>
                  الانطباع الشائع عن "خشب صلب" غالباً غير دقيق. مقياس Janka رقم علمي موحّد يقيس
                  القوة الفعلية اللازمة لغرز كرة معدنية صغيرة في الخشب حتى نصف قطرها — كلما زاد
                  الرقم، زادت مقاومة الخشب للخدش والانبعاج فعلياً. اختر نوعين وقارنهما مباشرة:
                </p>
                <WoodHardnessComparison />
              </section>

              <section id="natural-vs-manufactured">
                <h2>الخشب الطبيعي مقابل المصنّع</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head">
                      <span className="guide-v2-compare-title">خشب طبيعي (زان، بلوط، صنوبر...)</span>
                      <span className="guide-v2-compare-badge">أطول عمراً</span>
                    </div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">المتانة</span><span className="guide-v2-compare-row-value">أعلى، ويمكن صنفرته وإعادة دهانه لعقود</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">مقاومة الرطوبة</span><span className="guide-v2-compare-row-value">أفضل عموماً (تختلف حسب النوع)</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">السعر</span><span className="guide-v2-compare-row-value">أعلى بفارق واضح</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">خشب مصنّع (MDF، كونتر)</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">المتانة</span><span className="guide-v2-compare-row-value">جيدة للاستخدام الخفيف إلى المتوسط</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">مقاومة الرطوبة</span><span className="guide-v2-compare-row-value">ضعيفة (خاصة MDF) دون طلاء واقٍ جيد</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">السعر</span><span className="guide-v2-compare-row-value">أوفر بفارق كبير</span></div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="choose">
                <h2>كيف تختار النوع المناسب لمشروعك؟</h2>
                <p>
                  بدل السؤال العام "ما أفضل خشب؟"، اسأل نفسك: أين ستوضع القطعة، وكم ستتحمل من
                  استخدام يومي؟ قطعة ديكور ثابتة لا تحتاج نفس صلابة كرسي يُستخدم يومياً، وسطح
                  مطبخ معرّض للرطوبة يحتاج خامة مختلفة تماماً عن رف مكتبة داخلي جاف.
                </p>
                <p>
                  إن كنت بدأت تحدد الكمية فعلياً، انتقل مباشرة لحاسبة كمية وتكلفة الخشب أدناه —
                  تعمل بأي نوع اخترته من هذا الدليل.
                </p>
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
                    <a href="https://www.wood-database.com/european-beech/" target="_blank" rel="noreferrer">The Wood Database — European Beech</a>
                    {' '}وصفحات الأنواع الأخرى على نفس الموقع — قيم الصلابة العلمية (Janka).
                  </li>
                  <li>
                    <a href="https://en.wikipedia.org/wiki/Janka_hardness_test" target="_blank" rel="noreferrer">Wikipedia — Janka Hardness Test</a>
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
            <AdBlogSidebar slotId="sidebar-wood-types" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
