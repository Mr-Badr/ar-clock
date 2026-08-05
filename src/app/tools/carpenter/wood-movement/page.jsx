import Link from 'next/link';
import { ArrowsOutLineHorizontal } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import WoodMovementCalculator from '@/components/tools-v2/WoodMovementCalculator.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-movement');

const TOC_ITEMS = [
  ['why', 'لماذا يتمدد الخشب وينكمش أصلاً؟'],
  ['calculator', 'احسب فجوة التمدد اللازمة'],
  ['prevent', 'كيف تمنع المشكلة قبل حدوثها'],
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
  { route: pickGuides(['wood-types'])[0], reason: 'أنواع مختلفة تتحرك بمقادير مختلفة تماماً — قارنها هنا' },
  { route: pickGuides(['wood-joints'])[0], reason: 'بعض الوصلات تتحمل حركة الخشب أفضل من غيرها' },
  { route: pickGuides(['wood-calculator'])[0], reason: 'احسب كمية الخشب اللازمة لمشروعك بعد ضبط الفجوات' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'لماذا يتمدد الخشب في الشتاء أو ينكمش في الصيف؟',
    answer: 'الخشب مادة "تتنفس" الرطوبة من الهواء المحيط باستمرار — يمتصها فيتمدد عندما يرتفع الرطوبة الجوية، ويطلقها فينكمش عندما يجف الجو. هذا طبيعي في كل قطعة خشب حقيقية، وليس عيباً في التصنيع.',
  },
  {
    question: 'كيف اتخلص من مشكلة تمدد الخشب نهائياً؟',
    answer: 'لا يمكن إيقاف الحركة تماماً — الحل الصحيح هو التخطيط لها مسبقاً: اترك فجوة تمدد كافية عند التركيب (استخدم الأداة أعلاه لحساب مقدارها)، واختر تصميم "الألواح العائمة" الذي يسمح للخشب بالحركة دون أن يتشقق أو يدفع الإطار المحيط به.',
  },
  {
    question: 'ما سبب تقوس الخشب مع الوقت؟',
    answer: 'يحدث غالباً حين يجف أحد وجهي اللوح أسرع من الآخر (مثلاً وجه معرّض للشمس مباشرة ووجه آخر ملاصق لجدار رطب) — فينكمش الوجه الأسرع جفافاً أكثر من الآخر ويسحب اللوح نحوه. التخزين والتجفيف المتوازن قبل التصنيع يقلل هذه المشكلة كثيراً.',
  },
  {
    question: 'هل كل أنواع الخشب تتحرك بنفس المقدار؟',
    answer: 'لا إطلاقاً — الفرق بين الأنواع كبير حقيقياً. البلوط والزان من الأكثر حركة، بينما الساج والصنوبر أكثر ثباتاً نسبياً. اختر النوع في الأداة أعلاه لترى الفرق الفعلي بالأرقام لعرض لوحك نفسه.',
  },
];

export default function WoodMovementPage() {
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

      <ToolTopAdSlot slotId="top-wood-movement" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — احسب</span>
              <h1>لماذا يتمدد الخشب وينكمش؟ احسب فجوة التمدد اللازمة</h1>
              <p className="guide-v2-lead">
                كل قطعة خشب حقيقية تتحرك مع تغيّر الرطوبة الموسمية — هذا فيزياء بحتة تصح في أي بلد
                ومناخ. المشكلة ليست الحركة نفسها، بل عدم ترك مساحة كافية لها. احسب المقدار الدقيق
                لمشروعك أدناه.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><ArrowsOutLineHorizontal size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  اترك فجوة تمدد لا تقل عن <strong>نصف مقدار الحركة المتوقعة</strong> على كل جانب عند
                  تثبيت لوح خشبي عريض داخل إطار أو خزانة. المقدار يختلف حقيقياً حسب نوع الخشب وعرض
                  اللوح وشدة التقلب الموسمي في منطقتك — استخدم الأداة أدناه لرقمك الفعلي، لا تقدير عام.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا يتمدد الخشب وينكمش أصلاً؟</h2>
                <p>
                  الخشب مادة مسامية تمتص وتطلق رطوبة الهواء المحيط باستمرار حتى تتوازن مع بيئته —
                  هذه الحركة تحدث بشكل أوضح <strong>عرضاً على اتجاه الألياف</strong> وليس بطول اللوح
                  تقريباً. لهذا السبب لوح خشب واسع (كسطح طاولة) يتحرك بشكل ملحوظ مع الفصول، بينما
                  طوله يبقى شبه ثابت تماماً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-wood-movement" />

              <section id="calculator">
                <h2>احسب فجوة التمدد اللازمة</h2>
                <p>اختر نوع الخشب وعرض لوحك وشدة التقلب الموسمي في منطقتك:</p>
                <WoodMovementCalculator />
              </section>

              <section id="prevent">
                <h2>كيف تمنع المشكلة قبل حدوثها</h2>
                <ul>
                  <li><strong>فجوة تمدد كافية:</strong> اترك المساحة التي حسبتها أعلاه عند تركيب أي لوح عريض داخل إطار ثابت.</li>
                  <li><strong>التأقلم قبل التصنيع:</strong> اترك الخشب في بيئة التركيب النهائية بضعة أيام قبل قصه وتصنيعه، ليتوازن مع رطوبة المكان أولاً.</li>
                  <li><strong>تصميم "الألواح العائمة":</strong> ثبّت اللوح من منتصفه فقط واتركه حراً من الجوانب ليتحرك دون أن يدفع الإطار أو يتشقق.</li>
                  <li><strong>طلاء متوازن على الوجهين:</strong> دهان أو ورنيش على وجه واحد فقط يجعل الوجهين يمتصان وينفثان الرطوبة بمعدلين مختلفين، ما يزيد احتمال التقوس.</li>
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

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/chapter_04_fpl_gtr282.pdf" target="_blank" rel="noreferrer">USDA Forest Products Laboratory — Moisture Relations and Physical Properties of Wood</a>
                  </li>
                  <li>
                    <a href="https://woodbin.com/ref/wood-shrinkage-table/" target="_blank" rel="noreferrer">WoodBin — Wood Shrinkage Table</a>
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
            <AdBlogSidebar slotId="sidebar-wood-movement" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
