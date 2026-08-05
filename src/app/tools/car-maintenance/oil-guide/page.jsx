import Link from 'next/link';
import { Drop } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import OilViscosityChooser from '@/components/tools-v2/OilViscosityChooser.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'oil-guide');

const TOC_ITEMS = [
  ['viscosity', 'ما درجة اللزوجة المناسبة لسيارتك'],
  ['numbers', 'معنى الأرقام مثل 5W-30'],
  ['capacity', 'سعة الزيت التقريبية حسب عدد الأسطوانات'],
  ['types', 'الفرق بين الزيت الصناعي والمعدني'],
  ['faq', 'الأسئلة الشائعة'],
];

const VISCOSITY_NUMBERS = [
  { part: '5W', label: 'الرقم قبل W (Winter)', desc: 'كلما قلّ الرقم، تدفّق الزيت بسهولة أكبر في البرودة عند بدء تشغيل المحرك — يحمي المحرك في الصباح الباردة.' },
  { part: '30', label: 'الرقم بعد W', desc: 'يمثل سماكة الزيت وهو ساخن أثناء عمل المحرك — كلما زاد الرقم، بقي الزيت أكثر سماكة وحماية تحت الحرارة الشديدة (مهم جداً في صيف الخليج).' },
];

const CAPACITY_BY_CYLINDERS = [
  { cyl: '3 أسطوانات', range: '2.5 – 3.5 لتر', note: 'سيارات صغيرة اقتصادية (هاتشباك مدمج)' },
  { cyl: '4 أسطوانات', range: '3.5 – 4.5 لتر', note: 'الأكثر شيوعاً — سيدان متوسطة ومعظم الكروس أوفر' },
  { cyl: '6 أسطوانات', range: '4.5 – 6 لتر', note: 'سيدان فاخرة وسيارات دفع رباعي متوسطة' },
  { cyl: '8 أسطوانات', range: '5.5 – 8 لتر', note: 'شاحنات كبيرة ودفع رباعي ثقيل وسيارات فاخرة كبيرة' },
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
  { route: pickGuides(['car-maintenance-schedule'])[0], reason: 'متى تغيّر الزيت ضمن الجدول الكامل' },
  { route: pickGuides(['maintenance-tracker'])[0], reason: 'احسب موعد تغيير زيتك القادم بدقة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما هو أفضل زيت للسيارة في الصيف؟',
    answer: 'في حرارة الصيف الشديدة (خصوصاً في الخليج)، يُفضَّل زيت بدرجة لزوجة ساخنة أعلى قليلاً (الرقم الثاني في التسمية مثل 40 بدل 30) للحفاظ على طبقة حماية كافية داخل المحرك تحت الحرارة العالية — استخدم الأداة أعلاه لاقتراح مبني على مناخك وعمر سيارتك تحديداً.',
  },
  {
    question: 'كم لتر زيت يحتاج محركي بالضبط؟',
    answer: 'الرقم الدقيق مطبوع دائماً في دليل مالك سيارتك، ويختلف قليلاً حتى بين موديلات بنفس عدد الأسطوانات. الجدول أعلاه مرجع عام تقريبي حسب عدد الأسطوانات — استخدمه للتقدير قبل الشراء، لا كرقم نهائي عند التنفيذ الفعلي.',
  },
  {
    question: 'متى يجب تغيير زيت السيارة؟',
    answer: 'كل 10,000 كم أو 6 أشهر تقريباً للزيت الصناعي الحديث، أيهما أسبق — وقد يكون الفاصل أقصر (5,000 كم) للزيت المعدني أو ظروف القيادة الشاقة (حر شديد، ازدحام مستمر، رحلات قصيرة متكررة).',
  },
  {
    question: 'ما الفرق بين الزيت الصناعي والمعدني؟',
    answer: 'الزيت الصناعي (Synthetic) مصنّع كيميائياً بجزيئات موحدة الحجم، يتحمل الحرارة العالية بشكل أفضل ويدوم فترة أطول بين التغييرات — لكنه أغلى ثمناً. الزيت المعدني (Mineral) مكرّر مباشرة من النفط الخام، أرخص لكنه يحتاج تغييراً أكثر تكراراً. معظم السيارات الحديثة توصي بالصناعي أو شبه الصناعي.',
  },
  {
    question: 'ماذا يحدث إن استخدمت زيتاً أقل من السعة المطلوبة؟',
    answer: 'نقص الزيت يقلل التزييت والتبريد داخل المحرك، ما يزيد الاحتكاك والحرارة ويسرّع تآكل الأجزاء الداخلية — وفي الحالات الشديدة قد يسبب تلفاً دائماً للمحرك. تحقق دائماً بعبّارة القياس (Dipstick) بعد أي تغيير، لا بالحساب التقريبي وحده.',
  },
];

export default function OilGuidePage() {
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

      <ToolTopAdSlot slotId="top-oil-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — مرجع</span>
              <h1>أفضل زيت لسيارتك: اختر درجة اللزوجة المناسبة لمناخك</h1>
              <p className="guide-v2-lead">
                "أفضل زيت" ليس ماركة واحدة — بل الدرجة الصحيحة لمناخك وعمر محركك. أداة محايدة لا
                تنتمي لأي شركة زيوت، مع شرح كامل للأرقام والسعة وموعد التغيير.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Drop size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الجدول أدناه <strong>تقريبي حسب عدد الأسطوانات</strong>، وليس بديلاً عن الرقم
                  الدقيق المطبوع في دليل مالك سيارتك — استخدمه للتقدير فقط، ثم تحقق بعبّارة القياس.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="viscosity">
                <h2>ما درجة اللزوجة المناسبة لسيارتك</h2>
                <p>
                  أفضل زيت لسيارتك ليس ماركة واحدة "الأفضل مطلقاً" — بل الدرجة الصحيحة لمناخك وعمر
                  محركك. أدوات اختيار الزيت الكبرى عالمياً (Castrol، Shell، Pennzoil) تسأل عن سيارتك
                  لتقترح درجة، لكنها مرتبطة ببيع منتجاتها — الأداة أدناه محايدة تماماً ولا تنتمي لأي
                  ماركة:
                </p>
                <OilViscosityChooser />
              </section>

              <ToolInArticleAd slotId="mid2-oil-guide" />

              <section id="numbers">
                <h2>معنى الأرقام مثل 5W-30</h2>
                <p>الرقم المكتوب على أي عبوة زيت، مثل <strong>5W-30</strong>، يحمل معنى دقيقاً وليس اسم منتج فقط:</p>
                <div className="guide-v2-type-grid">
                  {VISCOSITY_NUMBERS.map((n) => (
                    <div className="guide-v2-type-card" key={n.part}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--red-subtle)', color: 'var(--red-text)' }} aria-hidden="true">
                          {n.part}
                        </span>
                        <p className="guide-v2-type-card-title">{n.label}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{n.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="capacity">
                <h2>سعة الزيت التقريبية حسب عدد الأسطوانات</h2>
                <div className="guide-v2-type-grid">
                  {CAPACITY_BY_CYLINDERS.map((c) => (
                    <div className="guide-v2-type-card" key={c.cyl}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--red-subtle)', color: 'var(--red-text)' }} aria-hidden="true">
                          <Drop size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{c.cyl} — {c.range}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{c.note}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-oil-guide" />

              <section id="types">
                <h2>الفرق بين الزيت الصناعي والمعدني</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card is-recommended">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">صناعي (Synthetic)</span><span className="guide-v2-compare-badge">التوصية الأشيع اليوم</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>يتحمل الحرارة العالية بثبات أكبر، فترة تغيير أطول (حتى 10,000 كم)، أداء أفضل في المناخ الحار — لكنه أغلى.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">معدني (Mineral)</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>أرخص ثمناً، لكن يحتاج تغييراً أكثر تكراراً (5,000 كم تقريباً) ويتأثر أكثر بالحرارة الشديدة.</p>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">شبه صناعي (Semi-Synthetic)</span></div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-2)' }}>خليط من الاثنين — توازن جيد بين السعر والأداء، خيار وسط شائع لمن لا يريد أعلى تكلفة.</p>
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
                    <a href="https://syarah.com/carsguide/amount-oil-car-engine/" target="_blank" rel="noreferrer">سيارة — كمية الزيت في محرك السيارة لمختلف الأنواع</a>
                  </li>
                  <li>
                    <a href="https://www.kia.com/aljabr/ar/discover-kia/ask/how-often-should-i-change-the-oil-in-a-car.html" target="_blank" rel="noreferrer">Kia السعودية — كم مرة يجب تغيير الزيت</a>
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
            <AdBlogSidebar slotId="sidebar-oil-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
