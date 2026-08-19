import Link from 'next/link';
import { CalendarBlank, Drop, Leaf, Snowflake, Sun } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import GardenMaintenanceTracker from '@/components/tools-v2/GardenMaintenanceTracker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-maintenance-tracker');

const TOC_ITEMS = [
  ['why', 'لماذا تختلف مهام الصيانة من موسم لآخر'],
  ['tracker', 'قائمة مهام هذا الشهر'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: PAGE.keywords, url: `${SITE_URL}${PAGE.href}` });

function pickGuides(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_GUIDES = [
  { route: pickGuides(['landscaping-drip-irrigation'])[0], reason: 'اضبط الري حسب احتياج الموسم الحالي' },
  { route: pickGuides(['landscaping-plant-picker'])[0], reason: 'أضف نباتات جديدة تناسب الموسم القادم' },
  { route: pickGuides(['landscaping-quote-generator'])[0], reason: 'حوّل خطة الصيانة إلى عرض سعر لعميلك' },
].filter((item) => item.route);

// Same SEASON_TASKS used by GardenMaintenanceTracker.client.jsx (first task per season shown here).
const SEASON_OVERVIEW = [
  { label: 'الشتاء', icon: Snowflake, color: 'blue', fact: 'قلّل الري — الاحتياج المائي أقل مع انخفاض الحرارة' },
  { label: 'الربيع', icon: Leaf, color: 'green', fact: 'موسم التسميد وزراعة الشتلات الجديدة' },
  { label: 'الصيف', icon: Sun, color: 'amber', fact: 'زِد الري تدريجياً وراقب الإجهاد الحراري' },
  { label: 'الخريف', icon: Drop, color: 'blue', fact: 'قلّل الري تدريجياً وأزل الأوراق المتساقطة' },
];

const FAQ_ITEMS = [
  { question: 'ما أهم مهمة صيانة يغفل عنها أصحاب الحدائق؟', answer: 'فحص نظام الري بحثاً عن تسريبات أو انسداد نقّاطات قبل بداية موسم الحرارة، لا بعده. تسريب صغير غير ملحوظ في الشتاء يتحول لمشكلة كبيرة (فاتورة مياه مرتفعة أو نباتات ذابلة) عندما يرتفع الاستهلاك صيفاً.' },
  { question: 'هل العشب الصناعي يحتاج صيانة فعلاً؟', answer: 'نعم، لكن نوعاً مختلفاً تماماً عن العشب الطبيعي: لا يحتاج قصاً أو تسميداً أو ريّاً، لكنه يحتاج تمشيطاً دورياً لألياف العشب المضغوطة من الاستخدام، وغسلاً بسيطاً من الغبار المتراكم خصوصاً في مناطق الغبار الكثيف.' },
  { question: 'متى أبدأ التسميد لموسم النمو؟', answer: 'عادة يُفضَّل التسميد مع بداية فصل الربيع تزامناً مع بداية موسم النمو النشط لمعظم النباتات، بعد فترة سكون الشتاء — استخدم الأداة أعلاه واختر شهرك الحالي لمعرفة إن كان هذا هو التوقيت المناسب حالياً.' },
  { question: 'هل تختلف الصيانة بين المناطق الساحلية والداخلية في نفس الدولة؟', answer: 'نعم — المناطق الساحلية الرطبة تواجه تحديات مختلفة (رطوبة، ملوحة، فطريات محتملة) عن المناطق الداخلية الجافة (تبخر سريع، تربة جافة تحتاج ريّاً أكثر تكراراً). اختر منطقتك المناخية الفعلية في الأداة أعلاه لا اسم دولتك فقط.' },
];

export default function GardenMaintenanceTrackerPage() {
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
    { '@type': 'ListItem', position: 3, name: 'تنسيق الحدائق', item: `${SITE_URL}/tools/landscaping` },
    { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
  ] };
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: PAGE.heroTitle, description: PAGE.description, inLanguage: 'ar', mainEntityOfPage: `${SITE_URL}${PAGE.href}`, keywords: PAGE.keywords, isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'ميقاتنا', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 } } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-garden-maintenance" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل حدائق — صيانة</span>
              <h1>جدول صيانة الحديقة الشهري: قائمة مهام تفاعلية حسب موسمك</h1>
              <p className="guide-v2-lead">
                لا تعرف ما الذي تحتاج فعله لحديقتك هذا الشهر؟ اختر الشهر ونوع حديقتك ومنطقتك
                المناخية، واحصل على قائمة مهام حقيقية بدل مقالة عامة صالحة لكل شهر بلا تمييز.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarBlank size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الصيف يعني ريّاً أكثر وفحصاً للإجهاد الحراري، الشتاء يعني تقليماً وريّاً أقل،
                  والربيع موسم التسميد والزراعة الجديدة. اختر شهرك أدناه لقائمة مهام دقيقة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا تختلف مهام الصيانة من موسم لآخر</h2>
                <p>
                  النباتات تمر بدورة نمو طبيعية ترتبط بالموسم: نمو نشط في الربيع يحتاج تسميداً،
                  إجهاد حراري في الصيف يحتاج ريّاً أكثر ومراقبة، سكون نسبي في الشتاء يعني ريّاً
                  أقل وفرصة جيدة للتقليم. تطبيق نفس روتين الصيانة طوال السنة يعني إما إفراطاً في
                  الري شتاءً أو تقصيراً فيه صيفاً.
                </p>
                <div className="guide-v2-type-grid">
                  {SEASON_OVERVIEW.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div className="guide-v2-type-card" key={s.label}>
                        <div className="guide-v2-type-card-head">
                          <span
                            className="guide-v2-type-card-icon"
                            aria-hidden="true"
                            style={{ background: `var(--${s.color}-subtle)`, color: `var(--${s.color}-text)` }}
                          >
                            <Icon size={17} weight="bold" />
                          </span>
                          <p className="guide-v2-type-card-title">{s.label}</p>
                        </div>
                        <ul className="guide-v2-type-card-facts">
                          <li>{s.fact}</li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-garden-maintenance" />

              <section id="tracker">
                <h2>قائمة مهام هذا الشهر</h2>
                <p>اختر الشهر ونوع حديقتك ومنطقتك المناخية للحصول على قائمة مخصصة:</p>
                <GardenMaintenanceTracker />
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {FAQ_ITEMS.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في تنسيق الحدائق</p>
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
            <AdBlogSidebar slotId="sidebar-garden-maintenance" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
