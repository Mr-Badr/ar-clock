import Link from 'next/link';
import { ArrowsOutSimple, PaintBrush, ScribbleLoop, SpeakerHigh, Wrench } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodProblemPicker from '@/components/tools-v2/WoodProblemPicker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-problems');

const TOC_ITEMS = [
  ['overview', 'أشهر 5 مشاكل بنظرة سريعة'],
  ['picker', 'شخّص مشكلتك'],
  ['when-carpenter', 'متى تحتاج نجاراً فعلاً؟'],
  ['faq', 'الأسئلة الشائعة'],
];

const OVERVIEW = [
  { icon: ScribbleLoop, title: 'خدوش سطحية', facts: ['الأشيع بفارق كبير', 'يُصلَح بقلم أو شمع ترميم خلال دقائق'] },
  { icon: SpeakerHigh, title: 'صرير ومفصلات مرتخية', facts: ['غالباً برغي ارتخى أو تزييت جفّ', 'شدّ وتزييت بسيط يكفي عادة'] },
  { icon: ArrowsOutSimple, title: 'أرجل غير مستقرة', facts: ['وصلة ضعفت أو أرضية غير مستوية', 'غراء جديد أو لبّادة تحل المشكلة'] },
  { icon: PaintBrush, title: 'بهتان اللون', facts: ['غالباً بسبب الشمس المباشرة', 'زيت ليمون يعيد اللمعان الخفيف'] },
  { icon: Wrench, title: 'تشقق السطح', facts: ['علامة جفاف شديد أو نقص فجوة تمدد', 'شمع ملء الفجوات للحالات البسيطة'] },
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
  { route: pickGuides(['furniture-care'])[0], reason: 'امنع تكرار المشكلة بجدول عناية دوري بسيط' },
  { route: pickGuides(['wood-movement'])[0], reason: 'التشقق المتكرر غالباً سببه فجوة تمدد غير كافية — احسبها هنا' },
  { route: pickGuides(['wood-types'])[0], reason: 'بعض الأنواع تقاوم هذه المشاكل أفضل من غيرها' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف ازيل خدوش الأثاث الخشبي؟',
    answer: 'للخدوش السطحية الخفيفة، مرّر قلم أو عصا شمع ترميم بلون قريب من خشبك مباشرة فوق الخدش — يملأ الخط ويُخفيه خلال دقائق. للخدوش الأعمق التي تخترق طبقة التشطيب، قد تحتاج صنفرة خفيفة موضعية ثم طبقة صبغة جديدة على المنطقة نفسها فقط.',
  },
  {
    question: 'لماذا تصدر الكراسي الخشبية صريراً؟',
    answer: 'غالباً بسبب ارتخاء برغي التثبيت في الوصلات مع الاستخدام المتكرر، أو جفاف مادة التزييت الأصلية في المفصلات. جرّب شدّ البراغي الظاهرة أولاً — يحل المشكلة في أغلب الحالات دون فك أي جزء.',
  },
  {
    question: 'هل يمكنني إصلاح أرجل الكرسي المهتزة بنفسي؟',
    answer: 'نعم غالباً — إن كان السبب ضعف الوصلة، فكّ الرجل بحذر وأعد لصقها بغراء خشب جيد واتركها تجف كاملاً (24 ساعة على الأقل) قبل الاستخدام. إن كانت كل الأرجل ثابتة والمشكلة أرضية غير مستوية، لبّادات مطاطية رقيقة تحت الأرجل تحل المشكلة فوراً.',
  },
  {
    question: 'متى يكون التشقق خطيراً ويحتاج نجاراً؟',
    answer: 'تشقق سطحي بسيط وواحد ليس مقلقاً ويمكن حشوه بشمع مخصص. لكن تشققاً كبيراً أو متكرراً في نفس القطعة علامة على مشكلة رطوبة أو فجوة تمدد غير كافية من الأساس — يستحق مراجعة نجار لتقييم الهيكل قبل أن يزداد سوءاً.',
  },
];

export default function WoodProblemsPage() {
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

      <ToolTopAdSlot slotId="top-wood-problems" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — تشخيص سريع</span>
              <h1>مشاكل الأثاث الخشبي الشائعة: تشخيص سريع وحلول منزلية</h1>
              <p className="guide-v2-lead">
                قبل التفكير بنجار أو شراء قطعة جديدة، أغلب مشاكل الأثاث الخشبي اليومية لها حل بسيط
                تجربه بنفسك خلال دقائق. اختر ما تلاحظه بالضبط واحصل على السبب والحل مباشرة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Wrench size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أغلب المشاكل اليومية (خدوش، صرير، أرجل مهتزة) <strong>تُحل منزلياً</strong> بأدوات
                  بسيطة (قلم ترميم، مفك، غراء خشب) دون حاجة لفني. العلامة التي تستدعي نجاراً فعلاً:
                  تشقق كبير متكرر، أو ضعف هيكلي حقيقي في القطعة نفسها.
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

              <ToolInArticleAd slotId="mid-wood-problems" />

              <section id="picker">
                <h2>شخّص مشكلتك</h2>
                <p>اختر ما يحدث فعلياً مع قطعتك:</p>
                <WoodProblemPicker />
              </section>

              <section id="when-carpenter">
                <h2>متى تحتاج نجاراً فعلاً؟</h2>
                <p>
                  أغلب ما سبق يمكنك حله بنفسك خلال دقائق. لكن استدعِ نجاراً أو فنياً متخصصاً إن كانت
                  المشكلة <strong>تشققاً كبيراً يتكرر بعد الإصلاح</strong>، أو <strong>ضعفاً هيكلياً
                  حقيقياً</strong> (اهتزاز واضح رغم شدّ كل البراغي وإعادة اللصق)، أو إن كانت القطعة
                  ذات قيمة عالية تستحق ترميماً احترافياً بدل حل مؤقت.
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
                    <a href="https://www.sayidaty.net/%D9%84%D8%A7%D9%8A%D9%81-%D8%B3%D8%AA%D8%A7%D9%8A%D9%84/%D9%85%D9%86%D8%B2%D9%84-%D9%88%D8%AF%D9%8A%D9%83%D9%88%D8%B1/1812178-%D8%A5%D8%B5%D9%84%D8%A7%D8%AD-%D8%A7%D9%84%D8%A3%D8%AB%D8%A7%D8%AB-%D8%A7%D9%84%D8%AE%D8%B4%D8%A8%D9%8A" target="_blank" rel="noreferrer">مجلة سيدتي — مشكلات الأثاث الخشبي الشائعة وطرق إصلاحها</a>
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
            <AdBlogSidebar slotId="sidebar-wood-problems" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
