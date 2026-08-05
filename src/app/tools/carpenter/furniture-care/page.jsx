import Link from 'next/link';
import { Broom, Drop, Sparkle, SunDim, Wrench } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodCareTracker from '@/components/tools-v2/WoodCareTracker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'furniture-care');

const TOC_ITEMS = [
  ['overview', 'العناية بنظرة سريعة'],
  ['tracker', 'احسب موعد العناية القادمة'],
  ['humidity', 'الرطوبة: أكبر عدو للخشب'],
  ['sun', 'الحماية من الشمس'],
  ['faq', 'الأسئلة الشائعة'],
];

const OVERVIEW = [
  { icon: Broom, title: 'مسح الغبار', facts: ['يومياً بقماش ناعم وجاف', 'الغبار المتراكم يخدش السطح مع الوقت'] },
  { icon: Sparkle, title: 'التلميع الدوري', facts: ['مرتين إلى ثلاث مرات سنوياً', 'دائماً باتجاه ألياف الخشب لا عكسها'] },
  { icon: Drop, title: 'ضبط الرطوبة', facts: ['حافظ على رطوبة الغرفة 40-60٪', 'الجفاف الشديد يشقق، والرطوبة الزائدة تُنفخ'] },
  { icon: SunDim, title: 'الحماية من الشمس', facts: ['ابعد القطعة عن أشعة الشمس المباشرة', 'الشمس تُبهت اللون وتُجفف السطح بسرعة'] },
  { icon: Wrench, title: 'فحص الأجزاء المتحركة', facts: ['المفصلات والبراغي والأرجل مرة سنوياً على الأقل', 'يمنع تفاقم مشكلة بسيطة لعطل أكبر'] },
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
  { route: pickGuides(['wood-problems'])[0], reason: 'إهملت العناية وظهرت مشكلة فعلية؟ شخّصها هنا' },
  { route: pickGuides(['wood-movement'])[0], reason: 'الرطوبة لا تؤثر على اللون فقط — افهم تأثيرها على أبعاد القطعة' },
  { route: pickGuides(['wood-types'])[0], reason: 'بعض الأنواع تحتاج عناية أكثر من غيرها — قارنها هنا' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم مرة يجب تلميع الأثاث الخشبي؟',
    answer: 'مرتين إلى ثلاث مرات سنوياً كافية للاستخدام المنزلي العادي. مسح الغبار اليومي البسيط أهم فعلياً من التلميع نفسه — الغبار المتراكم هو ما يخدش السطح تدريجياً مع الاحتكاك اليومي.',
  },
  {
    question: 'ما نسبة الرطوبة المثالية لحماية الأثاث الخشبي؟',
    answer: 'بين 40٪ و60٪ داخل المنزل. أقل من ذلك يجفف الخشب ويشققه، وأعلى منه يجعله يمتص رطوبة زائدة فيتمدد أو يتعفن مع الوقت — استخدم جهاز ترطيب أو تنشيف حسب الحاجة في مناخك.',
  },
  {
    question: 'هل الشمع أفضل من ملمع الخشب السائل؟',
    answer: 'الشمع يعطي طبقة حماية أكثف وأطول أمداً لكنه يحتاج جهداً أكبر في التطبيق، بينما الملمع السائل أسرع وأسهل للاستخدام المتكرر. كثير من الناس يستخدمون الملمع السائل شهرياً والشمع مرتين سنوياً كطبقة حماية أعمق.',
  },
  {
    question: 'هل يجب تلميع كل أنواع الأثاث الخشبي بنفس الطريقة؟',
    answer: 'المبدأ العام واحد (تنظيف، ثم تلميع باتجاه الألياف)، لكن القطع المطلية بورنيش لامع تحتاج منتجات مختلفة عن الخشب الخام أو الزيتي — تحقق من نوع التشطيب قبل استخدام أي منتج تنظيف قوي.',
  },
];

export default function FurnitureCarePage() {
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

      <ToolTopAdSlot slotId="top-furniture-care" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — صيانة</span>
              <h1>جدول صيانة الأثاث الخشبي: متى تلمّع وتعتني بقطعك</h1>
              <p className="guide-v2-lead">
                أثاث خشبي جيد يمكن أن يدوم لعقود — أو يفقد لونه ومتانته خلال سنوات قليلة فقط، والفرق
                عادة عناية بسيطة لا يعرف كثيرون توقيتها الصحيح. هذا الدليل يشرحها بوضوح، ثم يحسب
                موعدك القادم تحديداً.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Sparkle size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  امسح الغبار يومياً، لمّع كل 2-4 أشهر حسب بيئتك، وحافظ على رطوبة الغرفة بين
                  <strong> 40-60٪</strong>. أكبر سببين لتلف الأثاث الخشبي المبكر هما{' '}
                  <strong>الشمس المباشرة</strong> و<strong>تذبذب الرطوبة الشديد</strong>، وكلاهما
                  يمكن تفاديه بخطوات بسيطة لا تكلفة لها تقريباً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="overview">
                <h2>العناية بنظرة سريعة</h2>
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

              <ToolInArticleAd slotId="mid-furniture-care" />

              <section id="tracker">
                <h2>احسب موعد العناية القادمة</h2>
                <p>أدخل تاريخ آخر تلميع فعلي، واختر بيئتك للحصول على موعدك القادم وتذكير قابل للتحميل:</p>
                <WoodCareTracker />
              </section>

              <section id="humidity">
                <h2>الرطوبة: أكبر عدو للخشب</h2>
                <p>
                  الخشب "يتنفس" الرطوبة من الهواء المحيط باستمرار. رطوبة منخفضة جداً (أقل من 30٪)
                  تجفف الخشب فيتشقق، ورطوبة عالية جداً (أكثر من 70٪) تجعله يمتص ماءً زائداً فيتمدد
                  أو يبدأ العفن بالتكوّن. النطاق الآمن لمعظم الأثاث المنزلي بين <strong>40٪ و60٪</strong>{' '}
                  — استخدم جهاز قياس رطوبة رخيصاً إن كنت تسكن بمناخ شديد التقلب موسمياً.
                </p>
              </section>

              <section id="sun">
                <h2>الحماية من الشمس</h2>
                <p>
                  التعرض الطويل لأشعة الشمس المباشرة يُبهت لون الخشب تدريجياً ويجفف طبقة التشطيب
                  الواقية أسرع من المعتاد، حتى لو كانت القطعة داخل المنزل خلف زجاج نافذة. ضع الأثاث
                  الثمين بعيداً عن مسار الشمس المباشر، أو استخدم ستائر تحجب الأشعة القوية في أوقات
                  الذروة.
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
                    <a href="https://www.sayidaty.net/%D9%84%D8%A7%D9%8A%D9%81-%D8%B3%D8%AA%D8%A7%D9%8A%D9%84/%D9%85%D9%86%D8%B2%D9%84-%D9%88%D8%AF%D9%8A%D9%83%D9%88%D8%B1/1817845-%D9%83%D9%8A%D9%81-%D8%AA%D8%AD%D8%A7%D9%81%D8%B8%D9%8A%D9%86-%D8%B9%D9%84%D9%89-%D9%85%D9%81%D8%B1%D9%88%D8%B4%D8%A7%D8%AA-%D9%85%D9%86%D8%B2%D9%84%D9%83%D8%9F" target="_blank" rel="noreferrer">مجلة سيدتي — كيف تحافظين على مفروشات منزلك وكأنها جديدة؟</a>
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
            <AdBlogSidebar slotId="sidebar-furniture-care" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
