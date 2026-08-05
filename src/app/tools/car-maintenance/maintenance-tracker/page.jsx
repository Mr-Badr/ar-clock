import Link from 'next/link';
import { CalendarCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import CarMaintenanceTracker from '@/components/tools-v2/CarMaintenanceTracker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'maintenance-tracker');

const TOC_ITEMS = [
  ['how', 'كيف يحسب المتتبع موعدك'],
  ['tracker', 'احسب موعد الصيانة القادمة'],
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
  { route: pickGuides(['car-maintenance-schedule'])[0], reason: 'الجدول العام الذي تبني عليه الأداة أرقامها' },
  { route: pickGuides(['oil-guide'])[0], reason: 'كم لتر زيت يحتاج محركك قبل موعدك القادم' },
  { route: pickGuides(['tire-guide'])[0], reason: 'اضبط ضغط الإطارات عند كل زيارة صيانة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف يحسب المتتبع موعد صيانتي القادمة؟',
    answer: 'يحسب مسارين معاً: الأول بالزمن (تاريخ آخر صيانة + الفترة الموصى بها)، والثاني بالمسافة (قراءة العداد وقتها + المسافة الموصى بها، مقسومة على معدل قيادتك الشهري لتقدير التاريخ). ثم يعرض لك الأقرب من الاثنين — نفس قاعدة "أيهما أقرب" التي تعتمدها الوكالات فعلياً.',
  },
  {
    question: 'هل التاريخ الذي يعطيه المتتبع دقيق 100%؟',
    answer: 'هو تقدير جيد وليس رقماً مضموناً — يعتمد على ثبات معدل قيادتك الشهري كما أدخلته. إن تغيرت عاداتك في القيادة (رحلة طويلة مفاجئة، تقليل الاستخدام) حدّث الأرقام وأعد الحساب.',
  },
  {
    question: 'ماذا يحدث عند تحميل التذكير كملف .ics؟',
    answer: 'يُنزَّل ملف تقويم قياسي يعمل مع أي تطبيق تقويم (تقويم آيفون، تقويم جوجل، Outlook) — افتحه مباشرة وسيُضاف كحدث في تاريخ موعدك القادم مع تذكير، دون الحاجة لإنشاء حساب أو تثبيت أي تطبيق إضافي.',
  },
  {
    question: 'هل يحفظ الموقع بيانات سيارتي؟',
    answer: 'لا — كل الحساب يتم داخل متصفحك فقط ولا يُرسَل لأي خادم أو يُحفَظ في أي مكان. إن أردت الاحتفاظ بالموعد، حمّل ملف .ics وأضفه لتقويمك الشخصي.',
  },
];

export default function MaintenanceTrackerPage() {
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

      <ToolTopAdSlot slotId="top-maintenance-tracker" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — متتبع</span>
              <h1>متتبع صيانة السيارة: احسب موعدك القادم وحمّله لتقويمك</h1>
              <p className="guide-v2-lead">
                لا مزيد من التخمين أو نسيان موعد تغيير الزيت — أدخل بيانات آخر صيانة مرة واحدة،
                واحصل على موعدك القادم الفعلي مع تذكير جاهز للتحميل في تقويم هاتفك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarCheck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الأداة تحسب موعدك بمسارين معاً (الزمن والمسافة) وتعرض الأقرب — <strong>نفس قاعدة
                  "أيهما أقرب"</strong> المعتمدة فعلياً في مراكز الصيانة، لا تخميناً عاماً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="how">
                <h2>كيف يحسب المتتبع موعدك</h2>
                <p>
                  اختر نوع الصيانة (زيت، إطارات، تبريد، فرامل) — لكل نوع فترة موصى بها بالزمن وأخرى
                  بالمسافة (أو أحدهما فقط حسب البند). أدخل تاريخ آخر مرة وقراءة العداد وقتها، ثم
                  معدل قيادتك الشهري التقريبي — والأداة تحسب التاريخين المحتملين وتختار الأقرب منهما
                  تلقائياً، تماماً كما تفعل الوكالات ومراكز الصيانة الحقيقية.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-maintenance-tracker" />

              <section id="tracker">
                <h2>احسب موعد الصيانة القادمة</h2>
                <CarMaintenanceTracker />
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
            <AdBlogSidebar slotId="sidebar-maintenance-tracker" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
