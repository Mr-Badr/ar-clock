import Link from 'next/link';
import { Drop, Fire, Gauge } from '@phosphor-icons/react/ssr';

import WaterTankSizeChecker from '@/components/tools-v2/WaterTankSizeChecker.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'water-tanks');

const TOC_ITEMS = [
  ['types', 'أنواع خزانات المياه: أيهما يناسبك؟'],
  ['placement', 'خزان علوي أم أرضي؟'],
  ['sizing', 'ما السعة المناسبة لك؟'],
  ['prices', 'الأسعار الشائعة حسب السعة'],
  ['faq', 'الأسئلة الشائعة'],
];

const TANK_TYPES = [
  {
    name: 'بلاستيك (بولي إيثيلين)',
    badge: 'الأكثر شيوعاً',
    recommended: true,
    rows: [
      ['التكلفة', 'الأقل بين كل الأنواع'],
      ['الوزن', 'خفيف — سهل النقل والتركيب'],
      ['العمر المتوقع', '10-15 سنة تقريباً'],
      ['الأنسب لـ', 'الشقق والمنازل العادية'],
    ],
  },
  {
    name: 'فايبرجلاس',
    rows: [
      ['التكلفة', 'متوسطة إلى مرتفعة'],
      ['الوزن', 'متوسط'],
      ['العمر المتوقع', 'أطول من البلاستيك مع عزل حراري أفضل'],
      ['الأنسب لـ', 'السعات الكبيرة والمباني السكنية'],
    ],
  },
  {
    name: 'استانلس ستيل',
    rows: [
      ['التكلفة', 'الأعلى بين كل الأنواع'],
      ['الوزن', 'أثقل، يحتاج تركيباً أدق'],
      ['العمر المتوقع', 'الأطول — مقاومة عالية جداً للصدأ'],
      ['الأنسب لـ', 'من يريد أعلى نظافة صحية وعمراً طويلاً'],
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
  { route: pickGuides(['leak-detection'])[0], reason: 'إذا كنت تشك أن الخزان نفسه هو مصدر التسرب', icon: Drop },
  { route: pickGuides(['water-heaters'])[0], reason: 'لتختار سخاناً بالسعة المناسبة لنفس المنزل', icon: Fire },
  { route: pickGuides(['water-meter'])[0], reason: 'لتفهم أثر تسرب الخزان على فاتورتك', icon: Gauge },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم سعة الخزان المناسبة للعائلة؟',
    answer: 'كقاعدة تقريبية: 150 لتراً للفرد يومياً × 3 أيام احتياط. عائلة من 4 أفراد تحتاج نحو 2000 لتر، وعائلة من 6 أفراد نحو 3000 لتر. استخدم الأداة أعلى الصفحة لحساب رقم مبدئي حسب حجم أسرتك.',
  },
  {
    question: 'كم سعر خزان مياه 1000 لتر؟',
    answer: 'خزان بلاستيك أو فايبرجلاس 1000 لتر من ماركة معروفة (مثل الزامل) يبدأ من نحو 570-600 ريال في السعودية، ويرتفع السعر حسب المادة (فايبرجلاس أو استانلس أغلى من البلاستيك) والماركة والمواصفات الإضافية كالعزل الحراري.',
  },
  {
    question: 'خزان علوي أم أرضي — أيهما أفضل؟',
    answer: 'الخزان العلوي (على السطح) يعتمد على الجاذبية لتوزيع الماء دون الحاجة لمضخة تشغيل مستمر، وهو الأشيع في المنازل السعودية. الخزان الأرضي يحتاج مضخة رفع لكنه أنسب عند محدودية المساحة على السطح أو عند الرغبة في سعات كبيرة جداً. أغلب المنازل تستخدم الاثنين معاً: أرضي للتخزين الرئيسي وعلوي صغير للتوزيع اليومي.',
  },
  {
    question: 'ما الفرق بين خزان البلاستيك وخزان الفايبرجلاس؟',
    answer: 'البلاستيك (بولي إيثيلين) أخف وزناً وأقل تكلفة وسهل التركيب، وهو الخيار الأشيع للمنازل والشقق. الفايبرجلاس أكثر تحملاً للسعات الكبيرة ويعزل الحرارة بشكل أفضل، لكنه أغلى نسبياً — يُفضَّل للمباني السكنية والسعات فوق 3000-5000 لتر.',
  },
  {
    question: 'هل خزان الاستانلس ستيل يستحق الفرق في السعر؟',
    answer: 'إذا كانت أولويتك القصوى نظافة المياه الصحية وأطول عمر افتراضي ممكن، نعم. الاستانلس ستيل يقاوم الصدأ والتآكل بشكل يفوق البلاستيك والفايبرجلاس بوضوح، لكنه الخيار الأعلى تكلفة — يُختار عادة للمنشآت الطبية أو من يريد استثماراً طويل المدى لا يتغير كل عقد.',
  },
  {
    question: 'كل كم مدة يجب تنظيف خزان المياه؟',
    answer: 'التوصية العامة تنظيف الخزان وتعقيمه مرتين سنوياً على الأقل، وأكثر إذا لاحظت تغيراً في طعم أو رائحة الماء أو ترسبات مرئية عند الفتح.',
  },
  {
    question: 'كيف احسب سعة خزان الماء من أبعاده؟',
    answer: 'للخزان الأسطواني: اضرب π (≈3.14) × مربع نصف القطر × الارتفاع (كل الأبعاد بالسنتيمتر)، ثم اقسم الناتج على 1000 للحصول على اللترات. للخزان المستطيل: اضرب الطول × العرض × الارتفاع ÷ 1000. استخدم وضع "احسب سعة خزاني الحالي" في الأداة أعلى هذا القسم لإدخال الأبعاد مباشرة بدل الحساب اليدوي.',
  },
];

export default function WaterTanksGuidePage() {
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

      <ToolTopAdSlot slotId="top-water-tanks" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل سباكة — دليل شراء</span>
              <h1>أي خزان مياه يناسب منزلك؟</h1>
              <p className="guide-v2-lead">
                بلاستيك أم فايبرجلاس أم استانلس؟ علوي أم أرضي؟ وأي سعة تكفي عائلتك فعلاً بدون هدر
                مال على خزان أكبر من حاجتك — هذا الدليل يرتب لك القرار خطوة بخطوة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Drop size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  لمعظم المنازل، <strong>خزان بلاستيك (بولي إيثيلين) علوي</strong> هو الخيار
                  الأنسب — الأرخص والأخف والأسهل تركيباً. انتقل لفايبرجلاس أو استانلس فقط إذا
                  احتجت سعة كبيرة جداً أو أعلى مستوى نظافة صحية ممكن. السعة المناسبة تُحسب
                  تقريباً بـ <strong>150 لتراً للفرد يومياً × 3 أيام احتياط</strong>.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع خزانات المياه: أيهما يناسبك؟</h2>
                <p>
                  ثلاثة أنواع تغطي معظم السوق، وكل واحد له استخدام أوضح من الآخر — الفرق الحقيقي
                  بينها ليس "الأفضل" بشكل مطلق، بل أيهما يناسب ميزانيتك وسعتك المطلوبة.
                </p>
                <div className="guide-v2-compare-list">
                  {TANK_TYPES.map((type) => (
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

              <section id="placement">
                <h2>خزان علوي أم أرضي؟</h2>
                <p>
                  الخزان العلوي (فوق السطح) يعتمد على الجاذبية لتوزيع الماء لكل الوحدات دون مضخة
                  تعمل باستمرار — لهذا هو الأشيع في المنازل السعودية. الخزان الأرضي يحتاج مضخة
                  رفع، لكنه الخيار الأنسب عند الرغبة في سعة كبيرة جداً أو محدودية مساحة السطح.
                </p>
                <blockquote className="guide-v2-pullquote">
                  <p>أغلب المنازل تجمع بين الاثنين: أرضي للتخزين الرئيسي، وعلوي صغير للتوزيع اليومي.</p>
                </blockquote>
              </section>

              <ToolInArticleAd slotId="mid-water-tanks" />

              <section id="sizing">
                <h2>ما السعة المناسبة لك؟</h2>
                <p>
                  لا تشترِ الخزان الأكبر "احتياطاً" — سعة أكبر من حاجتك تعني ماءً راكداً لفترة
                  أطول داخل الخزان، وهذا يقلل جودته الصحية مع الوقت. استخدم الأداة التالية لمعرفة
                  السعة المناسبة لعائلتك قبل الشراء، أو لحساب سعة خزانك الحالي إذا كنت تعرف أبعاده:
                </p>
                <WaterTankSizeChecker />
              </section>

              <section id="prices">
                <h2>الأسعار الشائعة حسب السعة</h2>
                <p>
                  نطاقات تقريبية لخزان بلاستيك من ماركة معروفة في السوق السعودي — الأسعار
                  الفعلية تتغير حسب الماركة والمواصفات (عزل حراري، عدد الطبقات):
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">500 لتر</span><span className="guide-v2-compare-row-value">من نحو 300 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">1000 لتر</span><span className="guide-v2-compare-row-value">من نحو 570 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">2000 لتر</span><span className="guide-v2-compare-row-value">من نحو 1000 ريال</span></div>
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">5000 لتر</span><span className="guide-v2-compare-row-value">من نحو 2200 ريال</span></div>
                    </div>
                  </div>
                </div>
                <div className="guide-v2-note">
                  <Drop size={18} weight="fill" aria-hidden="true" />
                  <span>
                    هذه أسعار الخزان وحده دون تركيب أو خط تغذية — اطلب دائماً عرضاً شاملاً يوضح
                    التركيب منفصلاً عن سعر القطعة نفسها.
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
                    <a href="https://store.zamilco.com/" target="_blank" rel="noreferrer">الزامل للتجارة والصناعة — أسعار خزانات المياه</a>
                    {' '}— مرجع أسعار الماركات المعروفة في السوق السعودي.
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
            <AdBlogSidebar slotId="sidebar-plumbing-water-tanks" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
