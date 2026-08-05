import Link from 'next/link';
import { Tire } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import TirePressureConverter from '@/components/tools-v2/TirePressureConverter.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'tire-guide');

const TOC_ITEMS = [
  ['pressure', 'محول ضغط الإطارات'],
  ['size', 'كيف تقرأ مقاس الإطار'],
  ['tpms', 'ضوء TPMS مضاء؟ ماذا تفعل'],
  ['faq', 'الأسئلة الشائعة'],
];

const TPMS_STEPS = [
  { title: 'افحص الضغط وأنت بارد', body: 'استخدم المحول أعلاه لفحص الإطارات الأربعة وأنت بارد — إطار واحد منخفض بمقدار بسيط كافٍ لإشعال الضوء.' },
  { title: 'اضبط الضغط الصحيح', body: 'اضبط كل إطار للرقم المطبوع على ملصق باب السيارة، وافحص إطار الاحتياطي أيضاً إن كان له حساس.' },
  { title: 'قُد مسافة قصيرة', body: 'قُد 5-10 كم بسرعة معتدلة — يحتاج النظام وقتاً ليقرأ الضغط الجديد ويطفئ الضوء تلقائياً.' },
  { title: 'إن بقي الضوء مضاءً', body: 'ضوء ثابت رغم الضغط الصحيح، أو ضوء يومض بدل الثبات، يشير لعطل في الحساس نفسه أو بطاريته — يحتاج فحصاً بجهاز مخصص في الورشة.' },
];

const SIZE_PARTS = [
  { code: '205', label: 'عرض الإطار بالمليمتر', desc: 'المسافة بين جانبي الإطار — كلما زاد الرقم كان الإطار أعرض.' },
  { code: '55', label: 'نسبة الجانب (Aspect Ratio)', desc: 'ارتفاع جدار الإطار كنسبة مئوية من عرضه — 55 يعني الارتفاع = 55% من 205 مم.' },
  { code: 'R', label: 'نوع البنية', desc: 'Radial — البنية الشعاعية، المستخدمة في كل سيارات الركاب الحديثة تقريباً.' },
  { code: '16', label: 'قطر الجنط بالإنش', desc: 'قياس الحلقة المعدنية (الجنط) التي يُركَّب عليها الإطار.' },
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
  { route: pickGuides(['car-maintenance-schedule'])[0], reason: 'متى تفحص الإطارات ضمن الجدول الكامل' },
  { route: pickGuides(['maintenance-tracker'])[0], reason: 'احسب موعد فحص أو تبديل إطاراتك القادم' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف أحل مشكلة حساس الاطارات (TPMS)؟',
    answer: 'في أغلب الحالات، ضبط ضغط الإطارات الأربعة للرقم الصحيح والقيادة مسافة قصيرة كافٍ لإطفاء الضوء تلقائياً — راجع خطوات الحل الكاملة أدناه قبل التوجه لأي ورشة.',
  },
  {
    question: 'ما هو ضغط الإطارات الصحيح لسيارتي؟',
    answer: 'الرقم الدقيق مطبوع دائماً على ملصق داخل إطار الباب الأمامي (جهة السائق غالباً)، وليس على الإطار نفسه — الرقم على جانب الإطار هو الحد الأقصى الذي يتحمله، وليس الضغط الموصى به. معظم سيارات الركاب تتراوح بين 30 و35 PSI.',
  },
  {
    question: 'كيف أحول ضغط الإطارات من PSI إلى بار؟',
    answer: 'اقسم رقم الـPSI على 14.5 تقريباً للحصول على البار (مثال: 32 PSI ÷ 14.5 ≈ 2.2 بار) — أو استخدم المحول أعلاه لتحويل فوري ودقيق بين PSI والبار والكيلوباسكال.',
  },
  {
    question: 'ماذا يعني الرقم المكتوب على جانب الإطار مثل 205/55R16؟',
    answer: 'كل جزء من الرقم يعني شيئاً مختلفاً — 205 عرض الإطار بالمليمتر، 55 نسبة ارتفاع الجانب لعرضه، R يعني بنية شعاعية، و16 قطر الجنط بالإنش. راجع التفصيل الكامل في القسم أعلاه.',
  },
  {
    question: 'هل يجب فحص ضغط الإطارات وهي باردة أم بعد القيادة؟',
    answer: 'يجب دائماً فحص وضبط الضغط والإطار "بارد" — أي بعد وقوف السيارة لعدة ساعات أو قبل القيادة لأكثر من 3 كم. القيادة ترفع حرارة الإطار وبالتالي ضغطه، فتعطيك قراءة أعلى من الحقيقية.',
  },
];

export default function TireGuidePage() {
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

      <ToolTopAdSlot slotId="top-tire-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — محول</span>
              <h1>ضغط ومقاس إطارات السيارة: محول فوري وشرح مبسّط</h1>
              <p className="guide-v2-lead">
                حوّل ضغط الإطارات بين الوحدات الثلاث فوراً، وافهم كل رقم في مقاس إطارك قبل شرائه —
                بلا مصطلحات معقدة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Tire size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الرقم الصحيح لضغط إطاراتك على ملصق <strong>باب السيارة</strong>، لا على الإطار نفسه
                  — والإطار دائماً يُفحص وهو بارد لقراءة دقيقة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="pressure">
                <h2>محول ضغط الإطارات</h2>
                <p>أدخل الضغط بأي وحدة تعرفها، وستحصل على القيم الثلاث فوراً:</p>
                <TirePressureConverter />
              </section>

              <ToolInArticleAd slotId="mid-tire-guide" />

              <section id="size">
                <h2>كيف تقرأ مقاس الإطار</h2>
                <p>كل رقم مكتوب على جانب إطارك، مثل <strong>205/55R16</strong>، له معنى محدد:</p>
                <div className="guide-v2-type-grid">
                  {SIZE_PARTS.map((p) => (
                    <div className="guide-v2-type-card" key={p.code}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          {p.code}
                        </span>
                        <p className="guide-v2-type-card-title">{p.label}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{p.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="tpms">
                <h2>ضوء TPMS مضاء؟ ماذا تفعل</h2>
                <p>
                  ضوء على شكل علامة تعجب داخل إطار (⚠) يعني أن نظام مراقبة ضغط الإطارات (TPMS) رصد
                  انخفاضاً في أحد الإطارات — اتبع هذه الخطوات بالترتيب:
                </p>
                <div className="guide-v2-steps">
                  {TPMS_STEPS.map((s) => (
                    <div className="guide-v2-step" key={s.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <p className="guide-v2-step-title">{s.title}</p>
                      <p className="guide-v2-step-body">{s.body}</p>
                    </div>
                  ))}
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
            <AdBlogSidebar slotId="sidebar-tire-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
