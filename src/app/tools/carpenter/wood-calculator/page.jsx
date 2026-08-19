import Link from 'next/link';
import { Ruler } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodCalculator from '@/components/tools-v2/WoodCalculator.client';
import { FormulaCard } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-calculator');

const TOC_ITEMS = [
  ['how', 'كيف تُحسب كمية الخشب فعلياً؟'],
  ['calculator', 'احسب كميتك وتكلفتك'],
  ['tips', 'نصائح قبل الشراء'],
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
  { route: pickGuides(['wood-types'])[0], reason: 'لم تحدد النوع بعد؟ قارن الأنواع وصلابتها الفعلية أولاً' },
  { route: pickGuides(['kitchen-cabinets-cost'])[0], reason: 'مشروعك مطبخ كامل؟ استخدم الحاسبة المخصصة له' },
  { route: pickGuides(['wood-joints'])[0], reason: 'بعد حساب الكمية، اعرف أفضل طريقة لوصل قطعك' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف احسب كمية الخشب التي أحتاجها؟',
    answer: 'اضرب طول اللوح × عرضه × سماكته (بالمتر لكل الأبعاد) لتحصل على حجم اللوح الواحد بالمتر المكعب، ثم اضربه في عدد الألواح. الأداة أعلاه تقوم بهذا الحساب تلقائياً من أبعاد بسيطة تدخلها بالمتر والسنتيمتر.',
  },
  {
    question: 'لماذا نستخدم المتر المكعب وليس القدم المكعب؟',
    answer: 'المتر المكعب هو الوحدة المستخدمة فعلياً في أسواق الخشب بالمنطقة العربية، بينما القدم المكعب (Board Foot) وحدة أمريكية شائعة في المصادر الإنجليزية فقط. الأداة تعطيك القيمة المكافئة بالقدم المكعب أيضاً كمرجع إن احتجت مقارنة مصدر أجنبي.',
  },
  {
    question: 'هل يشمل الحساب هدراً إضافياً للقطع والتشطيب؟',
    answer: 'لا، الرقم الناتج هو الحجم الصافي المطلوب حسب أبعادك بالضبط. من الناحية العملية، يُنصح بإضافة هامش هدر 10-15% إضافية عند الشراء الفعلي لتغطية أخطاء القطع والتشطيب — خصوصاً في المشاريع التي تحتاج قصات دقيقة كثيرة.',
  },
  {
    question: 'هل السعر الذي أدخله يجب أن يكون بالريال تحديداً؟',
    answer: 'لا، أدخل السعر بأي عملة تتعامل بها فعلياً — الحاسبة تعرض النتيجة بنفس الوحدة التي أدخلتها، لأنها مجرد ضرب رياضي بسيط لا يعتمد على عملة محددة.',
  },
];

export default function WoodCalculatorPage() {
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

      <ToolTopAdSlot slotId="top-wood-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — احسب</span>
              <h1>احسب كمية وتكلفة الخشب لمشروعك بالمتر المكعب</h1>
              <p className="guide-v2-lead">
                لا تشتري خشباً بالتخمين. أدخل أبعاد اللوح وعدد الألواح واحصل على الكمية الدقيقة
                بالمتر المكعب، مع محول وحدات سريع للقدم المكعب والانش إن احتجتهما.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Ruler size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الطول × العرض × السماكة (بالمتر) × عدد الألواح = الحجم الإجمالي بالمتر المكعب.
                  أضف <strong>10-15% هامش هدر</strong> فوق الرقم الناتج عند الشراء الفعلي، ولا تعتمد
                  على "عدد الألواح" وحده كمقياس — السماكة والعرض يختلفان بين مصدر وآخر.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="how">
                <h2>كيف تُحسب كمية الخشب فعلياً؟</h2>
                <p>
                  المتر المكعب هو الوحدة العادلة لقياس كمية الخشب مهما اختلفت أبعاد الألواح — فهو
                  يقيس الحجم الفعلي بدل الاعتماد على "عدد الألواح" وحده، الذي يضلّلك إن اختلفت
                  السماكة أو العرض بين مصدر وآخر. المعادلة بسيطة: الطول × العرض × السماكة (كلها
                  بالمتر) يعطيك حجم اللوح الواحد، واضربه بعدد الألواح للحجم الإجمالي.
                </p>
                <FormulaCard label="حجم الخشب الإجمالي (م³):" note="أضف 10-15% هامش هدر فوق هذا الرقم عند الشراء الفعلي.">
                  <span>الطول × العرض × السماكة × عدد الألواح</span>
                </FormulaCard>
              </section>

              <ToolInArticleAd slotId="mid-wood-calculator" />

              <section id="calculator">
                <h2>احسب كميتك وتكلفتك</h2>
                <p>أدخل أبعاد اللوح الواحد (بالمتر للطول، وبالسنتيمتر للعرض والسماكة) وعدد الألواح:</p>
                <WoodCalculator />
              </section>

              <section id="tips">
                <h2>نصائح قبل الشراء</h2>
                <ul>
                  <li>أضف هامش هدر 10-15% فوق الكمية المحسوبة لتغطية أخطاء القطع، خصوصاً في المشاريع بقصات دقيقة كثيرة.</li>
                  <li>اطلب عروض أسعار من أكثر من مصدر لنفس النوع والكمية بالضبط — الأسعار تتفاوت كثيراً بين تاجر وآخر لنفس الجودة.</li>
                  <li>تحقق من رطوبة الخشب قبل الشراء (يُفضَّل أقل من 12-14%) — خشب رطب يتقلص ويتشقق لاحقاً مهما كانت جودته الأصلية جيدة.</li>
                </ul>
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
            <AdBlogSidebar slotId="sidebar-wood-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
