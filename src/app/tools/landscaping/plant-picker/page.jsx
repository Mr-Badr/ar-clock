import Link from 'next/link';
import { Flower } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import PlantPickerChecker from '@/components/tools-v2/PlantPickerChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-plant-picker');

const TOC_ITEMS = [
  ['why', 'لماذا تفشل نباتات كثيرة في مناخ الخليج'],
  ['picker', 'اختر نباتاتك الآن'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: PAGE.keywords, url: `${SITE_URL}${PAGE.href}` });

function pickGuides(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_GUIDES = [
  { route: pickGuides(['landscaping-garden-cost'])[0], reason: 'خططت للنباتات؟ احسب تكلفة الحديقة كاملة' },
  { route: pickGuides(['landscaping-drip-irrigation'])[0], reason: 'اضبط ري نباتاتك الجديدة بدقة' },
  { route: pickGuides(['landscaping-maintenance-tracker'])[0], reason: 'جدول صيانة شهري يناسب نباتاتك' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  { question: 'ما أسهل النباتات نمواً في حرارة الخليج؟', answer: 'السدر والغاف من أكثر الأشجار تحملاً للجفاف والحرارة الشديدة معاً لأنها محلية أصلاً لبيئة الجزيرة العربية. من الشجيرات المزهرة، الجهنمية والتيكوما تتحملان الإهمال النسبي وقلة الري جيداً مقارنة بنباتات الزينة الأخرى.' },
  { question: 'هل يمكن زراعة نباتات تحتاج ظلاً في حديقة مكشوفة بالكامل؟', answer: 'يمكن ذلك إن وفّرت ظلاً صناعياً (شبك تظليل أو موقعها تحت شجرة كبيرة)، لكن الأسهل عملياً هو اختيار نباتات تتحمل الشمس الكاملة أصلاً لمنطقة الحديقة المكشوفة، وحفظ نباتات الظل الجزئي لمنطقة محمية طبيعياً كجانب المبنى.' },
  { question: 'هل الصبار مناسب لحديقة فيها أطفال أو حيوانات أليفة؟', answer: 'أنواع الصبار الشوكية قد تشكل خطراً للأطفال الصغار أو الحيوانات الأليفة اللعوبة — إن كان هذا الأمر مهماً، اختر أصنافاً أقل شوكاً أو ضعها في مناطق مرتفعة (أصص) بعيداً عن متناول الأطفال المباشر.' },
  { question: 'كم مرة أحتاج لسقي نباتات "لا تحتاج عناية"؟', answer: 'حتى النباتات منخفضة الاحتياج ليست معدومة الاحتياج تماماً — تحتاج ريّاً منتظماً (وإن كان قليلاً) خصوصاً في أول موسم بعد الزراعة حتى تتأصل جذورها جيداً في التربة. بعد التأصيل، تصبح أكثر استقلالية عن الري المتكرر.' },
];

export default function PlantPickerPage() {
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

      <ToolTopAdSlot slotId="top-plant-picker" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل حدائق — اختيار نباتات</span>
              <h1>اختيار نباتات لا تحتاج عناية كبيرة في مناخ الخليج</h1>
              <p className="guide-v2-lead">
                حدد مقدار الشمس ومستوى العناية والوظيفة المطلوبة من نباتاتك، واحصل على قائمة
                مرشّحة من نباتات خليجية موثّقة تتحمل الحرارة فعلياً — لا قائمة عامة تصلح لأي مكان.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Flower size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  للحد الأدنى من العناية مع شمس كاملة: السدر والغاف (للظل) أو الجهنمية والتيكوما
                  (للألوان)، والصبار للمساحات شبه المهملة تماماً. استخدم الأداة أدناه لتوصية أدق
                  حسب ظروف حديقتك تحديداً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا تفشل نباتات كثيرة في مناخ الخليج</h2>
                <p>
                  السبب الأشيع ليس نقص العناية بل اختيار نبات غير مناسب أصلاً من البداية — نباتات
                  مستوردة من مناخات معتدلة أو رطبة تعاني في الحرارة الجافة الشديدة مهما بذلت من
                  جهد ري. اختيار نبات محلي أو متأقلم فعلياً مع الحرارة يوفر عليك تكاليف استبدال
                  متكررة ووقت عناية ضائعاً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-plant-picker" />

              <section id="picker">
                <h2>اختر نباتاتك الآن</h2>
                <p>حدد ظروف حديقتك الفعلية للحصول على قائمة نباتات مرشّحة:</p>
                <PlantPickerChecker />
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
            <AdBlogSidebar slotId="sidebar-plant-picker" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
