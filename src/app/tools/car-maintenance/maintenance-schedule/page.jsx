import Link from 'next/link';
import { ListChecks } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'car-maintenance-schedule');

const TOC_ITEMS = [
  ['milestones', 'ماذا تفحص عند كل محطة مسافة'],
  ['whichever', 'قاعدة "أيهما أقرب"'],
  ['faq', 'الأسئلة الشائعة'],
];

const MILESTONES = [
  {
    km: '5,000 – 10,000 كم',
    title: 'الفحص الدوري الأساسي',
    facts: ['زيت المحرك وفلتر الزيت', 'فحص ضغط الإطارات ومستوى سوائل الفرامل والتبريد', 'فحص بصري عام تحت السيارة'],
  },
  {
    km: '20,000 كم',
    title: 'إضافة فحص الفرامل',
    facts: ['فحص سماكة تيل الفرامل الأمامي والخلفي', 'فحص فلتر الهواء ونظافته', 'دوران الإطارات (Tire Rotation) لتآكل متساوٍ'],
  },
  {
    km: '40,000 كم',
    title: 'فحص أعمق للأنظمة',
    facts: ['فلتر المكيف (الكابينة)', 'شمعات الإشعال في محركات البنزين', 'فحص سيور المحرك (Belts) وعلامات التشقق'],
  },
  {
    km: '60,000 كم',
    title: 'صيانة كبرى',
    facts: ['تقييم عمر الإطارات واستبدالها غالباً', 'زيت ناقل الحركة (حسب توصية الوكالة)', 'فحص شامل للمساعدين ونظام التعليق'],
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
  { route: pickGuides(['maintenance-tracker'])[0], reason: 'احسب موعدك أنت تحديداً بدل الجدول العام' },
  { route: pickGuides(['oil-guide'])[0], reason: 'كم لتر زيت يحتاج محركك تقريباً' },
  { route: pickGuides(['tire-guide'])[0], reason: 'اضبط ضغط الإطارات بعد كل فحص دوري' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كل كم كيلومتر يجب فحص السيارة؟',
    answer: 'الفحص الأساسي (زيت وفلتر وضغط إطارات) كل 5,000 إلى 10,000 كم حسب نوع الزيت. لكن كل 20,000 و40,000 و60,000 كم تُضاف فحوصات أعمق (فرامل، مكيف، سيور، إطارات) — استخدم الجدول أعلاه كمرجع سريع، والمتتبع أدناه لموعدك أنت تحديداً.',
  },
  {
    question: 'هل يجب الالتزام بجدول الوكالة بالضبط؟',
    answer: 'الجدول أعلاه توافق عام بين توصيات متعددة، وهو مرجع مناسب لأي سيارة. لكن دليل مالك سيارتك تحديداً قد يحدد أرقاماً مختلفة قليلاً حسب نوع المحرك وسنة الصنع — إن كانت سيارتك لا تزال بضمان الوكالة، الأفضل اتباع جدولها الحرفي حتى لا يتأثر الضمان.',
  },
  {
    question: 'ماذا يحدث إن تأخرت عن موعد الصيانة؟',
    answer: 'تأخير بسيط (أسبوعين إلى شهر) عادة غير خطير لمعظم البنود. لكن تأخير تغيير الزيت لفترة طويلة يسرّع تآكل المحرك، وتأخير فحص الفرامل قد يكون خطراً فعلياً على السلامة — لا تؤجل بند الفرامل تحديداً.',
  },
  {
    question: 'هل السيارات الكهربائية والهجينة لها نفس الجدول؟',
    answer: 'لا — السيارات الكهربائية لا تحتاج تغيير زيت محرك أصلاً (لا يوجد محرك احتراق)، لكنها تحتاج فحصاً دورياً لنظام البطارية والفرامل (التي تتآكل أبطأ بسبب الفرملة التجديدية). هذا الجدول مخصص لسيارات البنزين/الديزل التقليدية.',
  },
];

export default function MaintenanceSchedulePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'صيانة السيارة', item: `${SITE_URL}/tools/car-maintenance` },
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

      <ToolTopAdSlot slotId="top-maintenance-schedule" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — جدول</span>
              <h1>جدول الصيانة الدورية للسيارة: ماذا تفحص كل 5 و10 و60 ألف كم</h1>
              <p className="guide-v2-lead">
                جدول عام يصح لأي سيارة بنزين أو ديزل تقليدية — مبني على توافق التوصيات بين مراكز
                الصيانة والوكالات، لا تخمين. لموعدك الشخصي الدقيق استخدم المتتبع في نهاية الصفحة.
              </p>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="milestones">
                <h2>ماذا تفحص عند كل محطة مسافة</h2>
                <div className="guide-v2-type-grid">
                  {MILESTONES.map((m) => (
                    <div className="guide-v2-type-card" key={m.km}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--blue-subtle)', color: 'var(--blue-text)' }} aria-hidden="true">
                          <ListChecks size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{m.km} — {m.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {m.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-maintenance-schedule" />

              <section id="whichever">
                <h2>قاعدة "أيهما أقرب"</h2>
                <p>
                  كل بند في الجدول أعلاه له في الواقع حدّان: مسافة مقطوعة (كم) وزمن مرّ (أشهر) —
                  والقاعدة المتبعة في كل مراكز الصيانة هي <strong>أيهما يصل أولاً</strong>. مثلاً زيت
                  المحرك: كل 10,000 كم <strong>أو</strong> كل 6 أشهر، أيهما أسبق. سائق يقطع مسافات
                  قليلة شهرياً قد يصل لموعد التغيير بسبب الزمن قبل أن تصل المسافة أصلاً — والعكس صحيح
                  لسائق يقطع مسافات طويلة يومياً. المتتبع أدناه يحسب الاثنين معاً ويعطيك التاريخ الأقرب.
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
                    <a href="https://www.kia.com/aljabr/ar/discover-kia/ask/how-often-should-i-change-the-oil-in-a-car.html" target="_blank" rel="noreferrer">Kia السعودية — كم مرة يجب تغيير الزيت</a>
                  </li>
                  <li>
                    <a href="https://autof7.com/%D8%AC%D8%AF%D9%88%D9%84-%D8%B5%D9%8A%D8%A7%D9%86%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%B1%D8%A9/" target="_blank" rel="noreferrer">أوتو إف7 — جدول صيانة السيارة</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في صيانة السيارة</p>
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
            <AdBlogSidebar slotId="sidebar-maintenance-schedule" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
