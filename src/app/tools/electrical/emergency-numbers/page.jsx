import Link from 'next/link';
import { Gauge, Lightning, Phone, SquaresFour } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'emergency-numbers');
const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = CURRENT_YEAR + 1;

const TOC_ITEMS = [
  ['numbers', 'أرقام طوارئ الكهرباء حسب الدولة'],
  ['how-to-report', 'كيف تبلّغ عن انقطاع الكهرباء؟'],
  ['before-calling', 'قبل الاتصال — تحقق من هذا أولاً'],
  ['faq', 'الأسئلة الشائعة'],
];

// Sourced from each utility's own official contact/support page — see مصادر section below.
// Verify against the current official app/website before relying on a number in an actual
// emergency; utilities occasionally change service numbers.
const COUNTRIES = [
  {
    flag: '🇸🇦',
    name: 'السعودية',
    company: 'الشركة السعودية للكهرباء (SEC)',
    number: '933',
    note: 'خط طوارئ وخدمة العملاء الموحّد، متاح عبر التطبيق الرسمي "الكهرباء" أيضاً.',
  },
  {
    flag: '🇦🇪',
    name: 'الإمارات (دبي)',
    company: 'هيئة كهرباء ومياه دبي (DEWA)',
    number: '991',
    note: 'للإبلاغ عن أعطال فنية أو انقطاع كهرباء، متاح أيضاً عبر تطبيق DEWA وخدمة Smart Response.',
  },
  {
    flag: '🇶🇦',
    name: 'قطر',
    company: 'كهرماء (Kahramaa)',
    number: '991',
    note: 'خط طوارئ يعمل 24 ساعة طوال أيام الأسبوع، مع دعم إضافي عبر واتساب.',
  },
  {
    flag: '🇰🇼',
    name: 'الكويت',
    company: 'وزارة الكهرباء والماء',
    number: '152',
    note: 'خط طوارئ الكهرباء والماء الموحّد، يعمل على مدار الساعة في جميع المحافظات.',
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
  { route: pickGuides(['generators'])[0], reason: 'انقطاعات متكررة في منطقتك؟ فكّر في مولد احتياطي', icon: Lightning },
  { route: pickGuides(['breaker-panel'])[0], reason: 'تأكد أولاً أن العطل ليس من قاطع منزلك قبل الاتصال', icon: SquaresFour },
  { route: pickGuides(['meter'])[0], reason: 'المشكلة في الفاتورة لا في الانقطاع؟ ابدأ من هنا', icon: Gauge },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: `ما رقم طوارئ الكهرباء في السعودية ${CURRENT_YEAR}؟`,
    answer: 'الرقم الموحّد للشركة السعودية للكهرباء هو 933، متاح للإبلاغ عن الأعطال والانقطاعات وخدمة العملاء. يمكن أيضاً الإبلاغ عن انقطاع الكهرباء عبر تطبيق "الكهرباء" الرسمي أو من خلال المنصة الوطنية الموحّدة.',
  },
  {
    question: `ما رقم طوارئ الكهرباء ${NEXT_YEAR} في الإمارات؟`,
    answer: 'في دبي، رقم طوارئ هيئة كهرباء ومياه دبي (DEWA) هو 991، متاح للإبلاغ عن الأعطال الفنية وانقطاع الكهرباء أو الماء. تتيح DEWA أيضاً خدمة Smart Response للتشخيص الذاتي والإبلاغ عبر التطبيق مباشرة دون الحاجة للاتصال الهاتفي.',
  },
  {
    question: 'كيف تبلّغ عن انقطاع الكهرباء بدون اتصال هاتفي؟',
    answer: 'أغلب شركات الكهرباء الخليجية توفر تطبيقاً رسمياً يتيح الإبلاغ عن انقطاع أو عطل مباشرة دون اتصال هاتفي، مع تتبّع حالة البلاغ لحظياً. بعض الشركات (مثل كهرماء في قطر) توفر أيضاً دعماً عبر واتساب كقناة بديلة.',
  },
  {
    question: 'متى يجب استدعاء كهربائي طوارئ بدل الاتصال بشركة الكهرباء؟',
    answer: 'اتصل بشركة الكهرباء إذا كان الانقطاع يشمل الحي كاملاً أو المنطقة المجاورة — هذا يعني عطلاً في الشبكة نفسها. أما إذا كان الانقطاع محصوراً في منزلك فقط بينما الجيران لديهم كهرباء طبيعية، فالمشكلة غالباً في لوحة الكهرباء أو التمديدات الداخلية، وتحتاج كهربائياً طوارئ لا شركة الكهرباء.',
  },
  {
    question: 'هل رقم طوارئ الكهرباء نفسه في كل مدن الدولة الواحدة؟',
    answer: 'غالباً نعم للدولة الواحدة إذا كانت شركة كهرباء واحدة تخدم كل المناطق (كما في السعودية وقطر والكويت)، لكن بعض الدول تُقسَّم فيها الخدمة بين أكثر من هيئة إقليمية (كما في الإمارات، حيث لدبي DEWA رقمها الخاص). تحقق دائماً من الجهة التي تخدم منطقتك تحديداً.',
  },
];

export default function EmergencyNumbersPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الكهرباء', item: `${SITE_URL}/tools/electrical` },
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

      <ToolTopAdSlot slotId="top-emergency-numbers" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل كهرباء — مرجع</span>
              <h1>أرقام طوارئ الكهرباء في السعودية والإمارات والكويت وقطر</h1>
              <p className="guide-v2-lead">
                عند انقطاع الكهرباء المفاجئ، الوقت مهم — هذه أرقام الطوارئ الرسمية لشركات
                الكهرباء في أربع دول خليجية، مجمّعة في مكان واحد، مع خطوات الإبلاغ عن العطل.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Phone size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  السعودية <strong>933</strong>، الإمارات (دبي) <strong>991</strong>، قطر{' '}
                  <strong>991</strong>، الكويت <strong>152</strong>. تحقّق دائماً من الرقم عبر
                  التطبيق الرسمي لشركة الكهرباء في منطقتك قبل الاعتماد الكامل عليه، فبعض الهيئات
                  تُحدّث أرقامها من وقت لآخر.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="numbers">
                <h2>أرقام طوارئ الكهرباء حسب الدولة</h2>
                <div className="guide-v2-compare-list">
                  {COUNTRIES.map((c) => (
                    <div className="guide-v2-compare-card" key={c.name}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{c.flag} {c.name}</span>
                        <span className="guide-v2-compare-badge">{c.number}</span>
                      </div>
                      <div className="guide-v2-compare-rows">
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">الجهة</span>
                          <span className="guide-v2-compare-row-value">{c.company}</span>
                        </div>
                      </div>
                      <p style={{ margin: 'var(--space-3) 0 0', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{c.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-emergency-numbers" />

              <section id="how-to-report">
                <h2>كيف تبلّغ عن انقطاع الكهرباء؟</h2>
                <p>
                  الاتصال الهاتفي ليس الطريقة الوحيدة، وغالباً ليس الأسرع. أغلب شركات الكهرباء
                  الخليجية توفر بدائل رقمية:
                </p>
                <ul>
                  <li>التطبيق الرسمي للشركة — يتيح الإبلاغ المباشر وتتبّع حالة البلاغ لحظياً</li>
                  <li>الموقع الإلكتروني الرسمي — نموذج إبلاغ عن انقطاع أو عطل فني</li>
                  <li>واتساب (متاح لدى بعض الشركات مثل كهرماء في قطر)</li>
                  <li>الاتصال المباشر برقم الطوارئ — الأنسب للحالات العاجلة أو عند تعذّر الوصول للإنترنت</li>
                </ul>
              </section>

              <section id="before-calling">
                <h2>قبل الاتصال — تحقق من هذا أولاً</h2>
                <p>
                  توفير هذه المعلومات يسرّع معالجة بلاغك، وأحياناً يوفّر عليك الاتصال أصلاً:
                </p>
                <ul>
                  <li>هل الانقطاع يشمل الحي أو الجيران أيضاً، أم منزلك فقط؟ — إن كان منزلك فقط، راجع دليل لوحة الكهرباء والقواطع أولاً قبل افتراض عطل في الشبكة</li>
                  <li>رقم الحساب أو رقم العداد — يسرّع تحديد موقعك ومتابعة البلاغ</li>
                  <li>هل هناك إشعار مسبق بأعمال صيانة مجدولة في منطقتك؟ — أغلب الشركات تنشر جدول الصيانة على تطبيقها الرسمي</li>
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
                    <a href="https://www.se.com.sa/Contact-Us/" target="_blank" rel="noreferrer">الشركة السعودية للكهرباء — اتصل بنا</a>
                    {' '}— صفحة التواصل الرسمية.
                  </li>
                  <li>
                    <a href="https://www.dewa.gov.ae/en/about-us/support-and-points-of-interest/support" target="_blank" rel="noreferrer">DEWA — الدعم الرسمي</a>
                    {' '}— رقم 991 وخدمة Smart Response.
                  </li>
                  <li>
                    <a href="https://www.km.qa/CustomerService/Pages/ServiceDetails.aspx?ItemID=28" target="_blank" rel="noreferrer">كهرماء (Kahramaa) — خدمة العملاء</a>
                    {' '}— رقم الطوارئ 991 وقنوات الدعم.
                  </li>
                  <li>
                    <a href="https://e.gov.kw/sites/kgoarabic/Pages/Visitors/TourismInKuwait/EssintialServicesEmergencies.aspx" target="_blank" rel="noreferrer">البوابة الإلكترونية الرسمية لدولة الكويت — أرقام الطوارئ</a>
                    {' '}— رقم طوارئ الكهرباء والماء 152.
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في الكهرباء</p>
                <div className="guide-v2-related-grid">
                  {RELATED_GUIDES.map(({ route, reason, icon: Icon }) => (
                    <Link key={route.slug} href={route.href} className="guide-v2-related-tile">
                      <span className="guide-v2-related-tile-icon" aria-hidden="true"><Icon size={16} weight="bold" /></span>
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
            <AdBlogSidebar slotId="sidebar-electrical-emergency-numbers" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
