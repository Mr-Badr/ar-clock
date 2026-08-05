import Link from 'next/link';
import { DoorOpen, ShieldCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import DoorTypeChecker from '@/components/tools-v2/DoorTypeChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'wood-doors');

const TOC_ITEMS = [
  ['types', 'أنواع أبواب الخشب وأسعارها المرجعية'],
  ['checker', 'أي نوع باب يناسبك؟'],
  ['sizes', 'المقاسات القياسية لكل غرفة'],
  ['faq', 'الأسئلة الشائعة'],
];

const TYPES = [
  { icon: DoorOpen, title: 'سويدي (صنوبر)', facts: ['الأوفر تكلفة بفارق كبير', 'نطاق مرجعي: 150-900 ريال', 'مناسب للغرف الداخلية العادية'] },
  { icon: DoorOpen, title: 'زان', facts: ['الأشيع في المنطقة العربية', 'نطاق مرجعي: 2,000-5,000 ريال', 'توازن جيد بين الجودة والسعر'] },
  { icon: DoorOpen, title: 'بلوط', facts: ['الأعلى صلابة ومقاومة للرطوبة', 'نطاق مرجعي: 3,000-7,000 ريال', 'خيار المدخل الرئيسي والقطع الفاخرة'] },
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
  { route: pickGuides(['wood-types'])[0], reason: 'قارن صلابة الأنواع الثلاثة بمقياس Janka العلمي' },
  { route: pickGuides(['wood-calculator'])[0], reason: 'تصنع الباب بنفسك؟ احسب كمية الخشب اللازمة' },
  { route: pickGuides(['wood-problems'])[0], reason: 'باب منتفخ أو لا يُغلق جيداً؟ شخّص المشكلة هنا' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم سعر متر الباب الخشب؟',
    answer: 'لا يُباع الباب عادة "بالمتر" بل كوحدة كاملة، وسعرها يعتمد بشدة على نوع الخشب: السويدي يتراوح بين 150 و900 ريال، الزان بين 2,000 و5,000 ريال، والبلوط بين 3,000 و7,000 ريال (أرقام مرجعية من السوق السعودي). اطلب دائماً عرض سعر حقيقي لمقاسك ونوعك المحددين.',
  },
  {
    question: 'ما الفرق بين الباب الخشب والباب المصفح (الصاج)؟',
    answer: 'الباب الخشبي الحقيقي أفضل عزلاً للصوت وأكثر دفئاً بصرياً، لكنه أعلى تكلفة ويحتاج عناية دورية. الباب المصفح (المعدني) أرخص وأقوى أمنياً للمداخل الرئيسية، لكنه أقل عزلاً للصوت وأبرد بصرياً — لهذا يُستخدم الخشب داخلياً والمصفح غالباً للمدخل الرئيسي فقط.',
  },
  {
    question: 'ما مقاس الباب القياسي في السعودية والخليج؟',
    answer: 'الارتفاع القياسي 210 سم تقريباً في كل الغرف. العرض يختلف حسب الغرفة: غرف النوم 90 سم، الحمامات 70-80 سم، المطبخ 80-90 سم، والمدخل الرئيسي 100 سم فأكثر (وأحياناً باب مزدوج).',
  },
  {
    question: 'هل يستحق الباب الخشبي الفاخر (بلوط) فرق السعر؟',
    answer: 'للمدخل الرئيسي أو قطعة تريدها تدوم عقوداً، نعم — البلوط أكثر صلابة ومقاومة للرطوبة والتشوه من الأنواع الأرخص. للغرف الداخلية العادية غير المعرّضة لاستخدام شاق، الزان يعطي توازناً أفضل بين الجودة والتكلفة عملياً.',
  },
];

export default function WoodDoorsPage() {
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

      <ToolTopAdSlot slotId="top-wood-doors" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — دليل شراء</span>
              <h1>أبواب الخشب: الأنواع، المقاسات، والنطاق السعري المرجعي</h1>
              <p className="guide-v2-lead">
                كل موقع يبيع الأبواب سيخبرك أن نوعه هو الأفضل. هذا الدليل محايد تماماً — لا نبيع
                أبواباً — ويشرح الفرق الحقيقي بين الأنواع الثلاثة الشائعة، بأرقام مرجعية حقيقية
                ومقاسات قياسية موثّقة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><ShieldCheck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>ميزانية محدودة:</strong> سويدي (صنوبر). <strong>توازن جودة وسعر:</strong>{' '}
                  زان — الخيار الأشيع فعلياً. <strong>مدخل رئيسي أو قطعة فاخرة:</strong> بلوط.
                  <strong> منطقة رطبة:</strong> معالجة PVC بدل خشب طبيعي خالص.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع أبواب الخشب وأسعارها المرجعية</h2>
                <div className="guide-v2-type-grid">
                  {TYPES.map((t) => (
                    <div className="guide-v2-type-card" key={t.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <t.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{t.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {t.facts.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginTop: 'var(--space-3)' }}>
                  الأرقام مرجعية من السوق السعودي الحالي، وتختلف حسب المدينة وجودة التصنيع — اطلب عرض سعر حقيقي دائماً قبل الشراء.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-wood-doors" />

              <section id="checker">
                <h2>أي نوع باب يناسبك؟</h2>
                <p>اختر ما هو الأهم بالنسبة لك واحصل على اقتراح مباشر:</p>
                <DoorTypeChecker />
              </section>

              <section id="sizes">
                <h2>المقاسات القياسية لكل غرفة</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">غرف النوم</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عرض 90 سم × ارتفاع 210 سم</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">الحمامات</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عرض 70-80 سم × ارتفاع 210 سم</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">المطبخ</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عرض 80-90 سم × ارتفاع 210 سم</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">المدخل الرئيسي</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>عرض 100 سم فأكثر × ارتفاع 210-215 سم</p>
                  </div>
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
                    <a href="https://namar.net/post/%D8%AA%D8%AD%D9%84%D9%8A%D9%84-%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A7%D8%A8%D9%88%D8%A7%D8%A8-%D8%A7%D9%84%D8%AE%D8%B4%D8%A8" target="_blank" rel="noreferrer">نمار للأبواب الداخلية — تحليل أسعار أبواب الخشب</a>
                  </li>
                  <li>
                    <a href="https://a-doors.com/%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1-%D8%A3%D8%A8%D9%88%D8%A7%D8%A8-%D8%AE%D8%B4%D8%A8-%D9%84%D9%84%D8%BA%D8%B1%D9%81/" target="_blank" rel="noreferrer">أسعار أبواب خشب للغرف في السعودية</a>
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
            <AdBlogSidebar slotId="sidebar-wood-doors" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
