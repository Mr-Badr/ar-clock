import Link from 'next/link';
import { Gauge, Lightning, Phone, Warning } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'breaker-panel');

const TOC_ITEMS = [
  ['breaker-types', 'أنواع القواطع الكهربائية'],
  ['panel-age', 'متى تحتاج تغيير لوحة الكهرباء؟'],
  ['cable-basics', 'أساسيات اختيار الكابل'],
  ['warning-signs', 'علامات تحتاج انتباهاً فورياً'],
  ['faq', 'الأسئلة الشائعة'],
];

const BREAKER_TYPES = [
  {
    title: 'MCB — قاطع الدائرة المصغر',
    badge: 'الأشيع',
    rows: [
      ['وظيفته', 'يحمي من التيار الزائد (Overcurrent) والحمل الزائد على الدائرة'],
      ['يحميك من', 'حريق ناتج عن سخونة الأسلاك بسبب حمل زائد'],
      ['لا يحميك من', 'صعقة كهربائية عند لمس جهاز به تسرب تيار'],
    ],
  },
  {
    title: 'RCBO — قاطع مدمج',
    rows: [
      ['وظيفته', 'يجمع حماية MCB (تيار زائد) مع حماية RCD (تسرب أرضي) في قاطع واحد'],
      ['يحميك من', 'الصعقة الكهربائية عند تسرب التيار — يُعرف أيضاً بقاطع "أمان الحياة"'],
      ['الأنسب لـ', 'الحمامات والمطابخ ودوائر خارج المنزل — أي مكان فيه رطوبة'],
    ],
  },
  {
    title: 'AFDD — كاشف قوس الخلل',
    rows: [
      ['وظيفته', 'يكتشف الأقواس الكهربائية الناتجة عن أسلاك تالفة أو وصلات رخوة'],
      ['يحميك من', 'حرائق الأسلاك التي لا يلتقطها القاطع العادي لأنها لا ترفع التيار بما يكفي'],
      ['الأنسب لـ', 'المنازل الحديثة والتركيبات التي تعتمد أجهزة إلكترونية كثيرة'],
    ],
  },
];

const CABLE_TIPS = [
  { title: 'مقطع الكابل يتبع الحمل لا المسافة فقط', body: 'كابل رفيع على دائرة تغذي مكيفاً أو فرناً كهربائياً يسخن ويصبح خطر حريق، حتى لو كانت المسافة قصيرة. اترك اختيار المقطع لفني معتمد يحسبه حسب الحمل الفعلي، لا حسب "الحجم المعتاد".' },
  { title: 'النحاس أفضل توصيلاً من الألمنيوم', body: 'كابلات النحاس هي المعيار في التمديدات المنزلية الحديثة لمقاومتها المنخفضة للتيار وأمانها الأعلى على المدى الطويل مقارنة بالألمنيوم.' },
  { title: 'العزل الخارجي يجب أن يناسب البيئة', body: 'كابل مخصص للتمديد الداخلي لا يصلح للخارج أو الأماكن الرطبة — العزل الخارجي (المقاوم للأشعة فوق البنفسجية والرطوبة) مطلوب لأي كابل يمر خارج المبنى.' },
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
  { route: pickGuides(['generators'])[0], reason: 'وصل مولدك بلوحة تحويل آمنة، لا مباشرة على اللوحة الرئيسية', icon: Lightning },
  { route: pickGuides(['meter'])[0], reason: 'إذا كان القلق الأصلي فاتورة كهرباء مرتفعة لا عطل قاطع', icon: Gauge },
  { route: pickGuides(['emergency-numbers'])[0], reason: 'عطل من شبكة الشركة نفسها لا من لوحتك؟ اتصل بالرقم الصحيح', icon: Phone },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين قاطع MCB وقاطع RCBO؟',
    answer: 'قاطع MCB يحميك من التيار الزائد فقط (حمل أكبر من طاقة الدائرة) — وهو ما يمنع سخونة الأسلاك وحريقها. قاطع RCBO يجمع هذه الحماية مع حماية إضافية من تسرب التيار الأرضي، وهي التي تمنع الصعقة الكهربائية عند لمس جهاز به عطل. RCBO أشمل وأنسب للحمامات والمطابخ والدوائر الخارجية.',
  },
  {
    question: 'متى تحتاج تغيير لوحة الكهرباء المنزلية؟',
    answer: 'القاعدة الشائعة لدى الفنيين: مراجعة اللوحة كل 20 عاماً تقريباً، حتى لو كانت تعمل ظاهرياً بلا مشاكل — العزل الداخلي للأسلاك والقواطع يتدهور مع الوقت بغض النظر عن الاستخدام الظاهري. علامات تستدعي فحصاً فورياً بدل الانتظار: قواطع تفصل بشكل متكرر، صوت طقطقة من اللوحة، أو رائحة احتراق خفيفة.',
  },
  {
    question: 'كم قاطع يحتاجها المنزل العادي؟',
    answer: 'لا يوجد رقم ثابت — يعتمد على عدد الدوائر المنفصلة في المنزل (إضاءة، مقابس، مكيفات، مطبخ، حمامات كل منها غالباً دائرة أو أكثر). العدد يحدده فني الكهرباء عند التصميم بناءً على توزيع الأحمال، لا بقاعدة عامة تنطبق على كل منزل.',
  },
  {
    question: 'لماذا يسخن القاطع الكهربائي عند اللمس؟',
    answer: 'سخونة القاطع غالباً إشارة إلى حمل زائد على تلك الدائرة (أجهزة كثيرة تسحب تياراً أعلى مما صُمم له القاطع)، أو اتصال كهربائي رخو داخل اللوحة. سخونة ملحوظة مع رائحة أو تغير لون تستدعي فصل الدائرة فوراً واستدعاء فني، لا الانتظار.',
  },
  {
    question: 'ما نوع الكابل المناسب لتمديدات المنزل؟',
    answer: 'مقطع الكابل يتحدد حسب الحمل الفعلي للدائرة، والمعيار الشائع في التمديدات الحديثة هو كابل نحاسي بعزل مناسب لبيئة التركيب (داخلي أو خارجي). اترك اختيار المقطع الدقيق لفني كهرباء يحسبه حسب حمل كل دائرة على حدة، فمقطع أصغر من اللازم خطر حريق حقيقي.',
  },
  {
    question: 'هل صوت طقطقة من لوحة الكهرباء خطير؟',
    answer: 'نعم، غالباً. صوت الطقطقة يشير عادة إلى وصلة رخوة أو قوس كهربائي بدأ يتكوّن داخل اللوحة — وهو بالضبط ما تكتشفه قواطع AFDD الحديثة. لا تتجاهل هذا الصوت؛ افصل التيار عن اللوحة إن أمكن واستدعِ فنياً بأقرب وقت.',
  },
];

export default function BreakerPanelGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الكهرباء', item: `${SITE_URL}/tools/electrical` },
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

      <ToolTopAdSlot slotId="top-breaker-panel" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل كهرباء — دليل فني</span>
              <h1>لوحة توزيع الكهرباء والقواطع: الأنواع ومتى تحتاج تغييرها</h1>
              <p className="guide-v2-lead">
                القاطع الذي يفصل باستمرار ليس دائماً "قاطعاً معطوباً" — أحياناً هو يعمل بالضبط
                كما يجب. هذا الدليل يشرح الفرق بين أنواع القواطع، متى تكون لوحتك بحاجة فعلية
                للتغيير، وأساسيات اختيار الكابل المناسب.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Warning size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  قاطع <strong>MCB</strong> يحميك من التيار الزائد فقط، وقاطع <strong>RCBO</strong>{' '}
                  يضيف حماية من الصعقة الكهربائية عند تسرب التيار — وهو المطلوب في الحمامات والمطابخ.
                  القاعدة العملية لتغيير اللوحة كاملة: <strong>كل 20 عاماً تقريباً</strong>، حتى لو
                  بدت تعمل بلا مشاكل ظاهرة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="breaker-types">
                <h2>أنواع القواطع الكهربائية</h2>
                <p>
                  معظم لوحات التوزيع المنزلية الحديثة تستوعب أكثر من نوع قاطع، وكل نوع مصمم
                  لخطر مختلف — معرفة الفرق تساعدك على فهم ما تحتاجه فعلاً في كل دائرة:
                </p>
                <div className="guide-v2-compare-list">
                  {BREAKER_TYPES.map((b) => (
                    <div className={`guide-v2-compare-card${b.badge ? ' is-recommended' : ''}`} key={b.title}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{b.title}</span>
                        {b.badge ? <span className="guide-v2-compare-badge">{b.badge}</span> : null}
                      </div>
                      <div className="guide-v2-compare-rows">
                        {b.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p>
                  قاطع RCBO يؤدي عملياً وظيفتين في جهاز واحد: حماية RCD من تسرب التيار الأرضي،
                  وحماية MCB من التيار الزائد. لهذا يُنصح به تحديداً في الدوائر القريبة من الماء —
                  الحمامات، المطابخ، وأي مقبس خارجي.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-breaker-panel" />

              <section id="panel-age">
                <h2>متى تحتاج تغيير لوحة الكهرباء؟</h2>
                <p>
                  عمر اللوحة أكثر من 20 عاماً هو المعيار العملي الأشيع بين الفنيين، حتى لو كانت
                  تعمل دون شكوى ظاهرة — العزل الداخلي للأسلاك والقواطع يتدهور تدريجياً بفعل الزمن
                  والحرارة، بغض النظر عن مدى "هدوء" أداء اللوحة ظاهرياً.
                </p>
                <div className="guide-v2-note">
                  <Warning size={18} weight="fill" aria-hidden="true" />
                  <span>
                    إذا كنت غير متأكد من عمر لوحتك أو حالتها، لا تخمّن — فني كهرباء مرخّص يستطيع
                    فحصها خلال دقائق وإخبارك بدقة إن كانت تحتاج تغييراً أو تحديثاً جزئياً فقط.
                  </span>
                </div>
              </section>

              <section id="cable-basics">
                <h2>أساسيات اختيار الكابل</h2>
                <p>
                  الكابل الخطأ في المكان الخطأ هو أحد أكثر أسباب حرائق التمديدات المنزلية شيوعاً،
                  وغالباً بسبب اختيار مقطع أصغر مما يحتاجه الحمل الفعلي:
                </p>
                <div className="guide-v2-compare-list">
                  {CABLE_TIPS.map((t) => (
                    <div className="guide-v2-compare-card" key={t.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{t.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{t.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="warning-signs">
                <h2>علامات تحتاج انتباهاً فورياً</h2>
                <ul>
                  <li>قاطع يفصل بشكل متكرر عند تشغيل نفس الجهاز أو مجموعة أجهزة معينة</li>
                  <li>صوت طقطقة أو أزيز من داخل اللوحة</li>
                  <li>رائحة احتراق خفيفة بالقرب من اللوحة أو المقابس</li>
                  <li>سخونة ملحوظة عند لمس القاطع أو اللوحة نفسها</li>
                  <li>ومضات إضاءة متكررة دون سبب واضح عند تشغيل أجهزة كبيرة</li>
                </ul>
                <blockquote className="guide-v2-pullquote">
                  <p>قاطع يفصل باستمرار لا يعني "قاطعاً سيئاً" — غالباً يعني أنه يعمل تماماً كما يجب.</p>
                </blockquote>
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
                    <a href="https://www.cncele.com/ar/blog/home-circuit-breaker-types/" target="_blank" rel="noreferrer">CNC Electric — أنواع قواطع الدائرة الكهربائية المنزلية</a>
                    {' '}— شرح فني لأنواع MCB وRCBO وAFDD.
                  </li>
                  <li>
                    <a href="https://makkahexperts.com/blog/home-electrical-panels-types-guide/" target="_blank" rel="noreferrer">شركة خبراء مكة — لوحات الكهرباء المنزلية: الأنواع والأسعار</a>
                    {' '}— دليل الأنواع وتوقيت التحديث.
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في الكهرباء</p>
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
            <AdBlogSidebar slotId="sidebar-electrical-breaker-panel" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
