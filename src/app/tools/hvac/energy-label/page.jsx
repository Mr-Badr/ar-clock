import Link from 'next/link';
import { Star } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AcEnergyLabelCalculator from '@/components/tools-v2/AcEnergyLabelCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'energy-label');

const TOC_ITEMS = [
  ['what', 'ما هي بطاقة كفاءة الطاقة؟'],
  ['countries', 'النظام في كل دولة خليجية'],
  ['read', 'كيف تقرأ البطاقة عملياً'],
  ['calculator', 'قارن التكلفة حسب النجوم'],
  ['faq', 'الأسئلة الشائعة'],
];

// Real, sourced status per country — see "مصادر" section. Kept factual and conservative:
// GSO 2530/2016 is the shared regional technical basis, but each country enforces it through its
// own national body and (for Saudi/UAE specifically) its own star-label branding.
const COUNTRY_SYSTEMS = [
  { code: 'sa', country: 'السعودية', body: 'ساسو (SASO)', note: 'نظام نجوم من 1 إلى 6، إلزامي، عبر منصة sls.saso.gov.sa' },
  { code: 'ae', country: 'الإمارات', body: 'إسما (ESMA)', note: 'نظام نجوم مماثل (معيار UAE.S 5010)، إلزامي لكل مكيف مباع محلياً' },
  { code: 'om', country: 'عُمان', body: 'الهيئة العُمانية للمواصفات', note: 'ملصق كفاءة إلزامي منذ 2019 حسب معيار الخليج GSO 2530' },
  { code: 'bh', country: 'البحرين', body: 'هيئة البحرين للمواصفات', note: 'ملصق كفاءة طاقة (EER) معتمد ضمن نفس المعيار الخليجي' },
  { code: 'qa', country: 'قطر', body: 'الهيئة العامة للمواصفات', note: 'خاضعة لمعيار مجلس التعاون GSO الموحد للأجهزة الكهربائية' },
  { code: 'kw', country: 'الكويت', body: 'الهيئة العامة للصناعة', note: 'خاضعة لمعيار مجلس التعاون GSO الموحد للأجهزة الكهربائية' },
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
  { route: pickGuides(['inverter-savings'])[0], reason: 'النجوم عامل، والانفرتر عامل آخر — احسب الاثنين معاً' },
  { route: pickGuides(['ac-types'])[0], reason: 'قبل أن تقارن النجوم، اعرف أي نوع مكيف تحتاج أصلاً' },
  { route: pickGuides(['replace-or-repair'])[0], reason: 'عند شراء بديل لمكيف قديم، ابحث عن أعلى عدد نجوم يناسب ميزانيتك' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما هي بطاقة كفاءة الطاقة للمكيفات؟',
    answer: 'ملصق رسمي إلزامي على كل مكيف يُباع في السعودية والإمارات وباقي دول الخليج، يوضح كفاءة الجهاز في تحويل الكهرباء إلى تبريد. يظهر بشكل تصنيف نجوم (كلما زادت زادت الكفاءة)، مع الاستهلاك السنوي المتوقع بالكيلوواط/ساعة ونسبة كفاءة الطاقة EER.',
  },
  {
    question: 'هل بطاقة كفاءة الطاقة نفسها في كل دول الخليج؟',
    answer: 'الأساس الفني واحد (معيار مجلس التعاون الخليجي GSO 2530)، لكن كل دولة تطبّقه عبر جهتها الرسمية الخاصة: "ساسو" في السعودية و"إسما" في الإمارات، وكلاهما يستخدمان نظام نجوم من 1 إلى 6. عُمان والبحرين وقطر والكويت تخضع لنفس المعيار الخليجي الموحد عبر هيئاتها الوطنية، وإن اختلف شكل الملصق قليلاً بين دولة وأخرى.',
  },
  {
    question: 'كل نجمة كم توفر فعلياً؟',
    answer: 'حسب المركز السعودي لكفاءة الطاقة، كل نجمة إضافية تعني توفيراً في الطاقة الكهربائية، وقد تصل بطاقة الـ6 نجوم إلى توفير نحو 30٪ من الاستهلاك مقارنة بجهاز منخفض الكفاءة (نجمة واحدة). النسبة الدقيقة لكل نجمة تختلف بين الأجهزة، لذا الأداة أعلاه تقدّم تقديراً تقريبياً لا رقماً مضموناً لكل موديل.',
  },
  {
    question: 'هل يستحق دفع سعر أعلى مقابل نجوم أكثر؟',
    answer: 'في أغلب حالات الاستخدام اليومي بالخليج (تشغيل طويل معظم أيام السنة بسبب الحر)، نعم — فرق السعر الأولي بين جهاز 4 نجوم و6 نجوم يُسترد عادة خلال سنوات قليلة من التوفير الشهري في الفاتورة، ثم يستمر التوفير طوال عمر الجهاز.',
  },
  {
    question: 'ما الفرق بين النجوم ونسبة EER؟',
    answer: 'فكّر فيها مثل استهلاك سيارة للوقود: EER رقم فني (كمية التبريد ÷ كمية الكهرباء المستهلَكة) — كلما زاد كان أفضل، تماماً مثل "كم كيلومتر تقطعه السيارة بلتر واحد". النجوم هي نفس الفكرة لكن مبسّطة لفئات سهلة الفهم (1 إلى 6) بدل رقم عشري، لتسهيل المقارنة السريعة عند الشراء دون الحاجة لفهم الحساب الفني.',
  },
  {
    question: 'أين أجد بطاقة كفاءة الطاقة لجهاز معيّن؟',
    answer: 'تكون ملصقة على الجهاز نفسه أو معبأة في صندوقه، وتحمل اسم العلامة التجارية ورقم الطراز. في السعودية يمكنك أيضاً التحقق من ترخيص المنتج مباشرة عبر منصة "بطاقة كفاءة الطاقة السعودية" (sls.saso.gov.sa)، وفي الإمارات عبر منظومة "إسما" الرسمية.',
  },
];

export default function EnergyLabelPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التكييف', item: `${SITE_URL}/tools/hvac` },
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

      <ToolTopAdSlot slotId="top-energy-label" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — كفاءة الطاقة في الخليج</span>
              <h1>بطاقة كفاءة الطاقة للمكيفات: كيف تقرأ النجوم وتوفر فعلياً</h1>
              <p className="guide-v2-lead">
                كل مكيف يُباع في السعودية أو الإمارات أو أي دولة خليجية يحمل بطاقة نجوم رسمية — لكن
                قلة يعرفون كيف يترجمون هذه النجوم لفرق حقيقي في الفاتورة. هذا الدليل يشرحها بلغة بسيطة،
                ثم يعطيك أداة تقارن التكلفة الشهرية حسب عدد النجوم وعملة بلدك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Star size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  بطاقة كفاءة الطاقة نظام رسمي إلزامي في كل دول الخليج (ساسو بالسعودية، إسما بالإمارات،
                  وهيئات مماثلة في باقي الدول)، مبني على معيار خليجي مشترك. كل نجمة إضافية تعني كفاءة
                  أعلى، وقد تصل بطاقة الـ6 نجوم لتوفير نحو <strong>30٪</strong> من الاستهلاك مقارنة
                  بجهاز نجمة واحدة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هي بطاقة كفاءة الطاقة؟</h2>
                <p>
                  تخيّلها مثل ملصق استهلاك الوقود على سيارة جديدة: رقم رسمي موحّد يتيح لك مقارنة
                  جهازين قبل الشراء دون الحاجة لفهم أي تفاصيل هندسية. الهدف بسيط — تعرف مسبقاً أي
                  مكيف سيرفع فاتورتك أكثر، وأيهما يوفّر عليك على المدى الطويل.
                </p>
                <p>
                  في السعودية تصدرها الهيئة السعودية للمواصفات والمقاييس والجودة (ساسو) بإشراف
                  المركز السعودي لكفاءة الطاقة (SEEC). في باقي دول الخليج تصدرها الجهة الوطنية
                  المقابلة، لكن الفكرة والمعيار الفني خلفها واحد في كل الدول الست.
                </p>
              </section>

              <section id="countries">
                <h2>النظام في كل دولة خليجية</h2>
                <p>
                  الأساس الفني مشترك بين كل دول مجلس التعاون الخليجي (معيار GSO 2530)، لكن كل دولة
                  تطبّقه عبر جهتها الرسمية الخاصة:
                </p>
                <div className="guide-v2-type-grid">
                  {COUNTRY_SYSTEMS.map((c) => (
                    <div className="guide-v2-type-card" key={c.code}>
                      <div className="guide-v2-type-card-head">
                        <CountryFlag code={c.code} label={c.country} square className="guide-v2-type-card-flag" />
                        <p className="guide-v2-type-card-title">{c.country}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li><strong>الجهة:</strong> {c.body}</li>
                        <li>{c.note}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-energy-label" />

              <section id="read">
                <h2>كيف تقرأ البطاقة عملياً</h2>
                <p>البطاقة تعرض أربع معلومات رئيسية يجب الانتباه لها قبل الشراء:</p>
                <ul>
                  <li><strong>تصنيف النجوم:</strong> من 1 إلى 6 — كلما زاد العدد زادت الكفاءة وقل الاستهلاك.</li>
                  <li><strong>الاستهلاك السنوي المتوقع (كيلوواط/ساعة):</strong> رقم تقديري رسمي يتيح لك مقارنة جهازين مباشرة قبل الشراء.</li>
                  <li><strong>نسبة كفاءة الطاقة EER:</strong> مثل "كيلومتر لكل لتر بنزين" لكن للتبريد — كلما زاد الرقم كان الجهاز أفضل.</li>
                  <li><strong>اسم العلامة التجارية ورقم الطراز:</strong> للتحقق من الترخيص عبر المنصة الرسمية عند الحاجة.</li>
                </ul>
              </section>

              <section id="calculator">
                <h2>قارن التكلفة حسب النجوم</h2>
                <p>أدخل تكلفة تشغيل مكيفك الحالي تقريباً، اختر دولتك وعدد نجوم الجهاز الذي تفكر بشرائه:</p>
                <AcEnergyLabelCalculator />
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
                    <a href="https://www.seec.gov.sa/ar/" target="_blank" rel="noreferrer">المركز السعودي لكفاءة الطاقة (SEEC)</a>
                  </li>
                  <li>
                    <a href="https://www.saso.gov.sa/ar/sectors/certificates/efficiency_card/Pages/default.aspx" target="_blank" rel="noreferrer">الهيئة السعودية للمواصفات والمقاييس والجودة — بطاقة كفاءة الطاقة</a>
                  </li>
                  <li>
                    <a href="https://sls.saso.gov.sa/" target="_blank" rel="noreferrer">منصة بطاقة كفاءة الطاقة السعودية</a>
                  </li>
                  <li>
                    <a href="https://www.ul.com/news/united-arab-emirates-enforcement-new-energy-efficiency-standards-air-conditioners" target="_blank" rel="noreferrer">UL Solutions — معايير كفاءة الطاقة الإماراتية (ESMA) للمكيفات</a>
                  </li>
                  <li>
                    <a href="https://www.gso.org.sa/eer/" target="_blank" rel="noreferrer">الهيئة الخليجية للتقييس (GSO) — ملصقات كفاءة الطاقة</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في التكييف</p>
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
            <AdBlogSidebar slotId="sidebar-energy-label" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
