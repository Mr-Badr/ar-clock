import Link from 'next/link';
import { CalendarCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import ZatcaEligibilityChecker from '@/components/tools-v2/ZatcaEligibilityChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { ZATCA_WAVES } from '@/lib/tools/zatca-waves';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zatca-eligibility');

const TOC_ITEMS = [
  ['what', 'ما هي مرحلة الربط والتكامل'],
  ['checker', 'تحقق من موجتك الآن'],
  ['waves', 'الموجات المعلنة حتى الآن'],
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
  { route: pickGuides(['zatca-qr-explainer'])[0], reason: 'بعد الربط، تحقق أن فواتيرك تصدر كود QR صحيحاً' },
  { route: pickGuides(['store-profit-margin'])[0], reason: 'راجع هامش ربحك بعد أي تكلفة امتثال إضافية' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق بين المرحلة الأولى والمرحلة الثانية من الفوترة الإلكترونية؟',
    answer: 'المرحلة الأولى (منذ ديسمبر 2021) تطلب فقط إصدار فواتير إلكترونية منسّقة بدل الورقية أو PDF العادي. المرحلة الثانية (الربط والتكامل) أعمق: تربط نظام الفوترة لديك تقنياً مع منصة "فاتورة" الحكومية لإرسال الفواتير للتحقق منها في الوقت الفعلي أو شبه الفعلي.',
  },
  {
    question: 'إيراداتي أقل من 187,500 ريال — هل أنا بأمان تماماً؟',
    answer: 'أنت غير مشمول بأي موجة معلَنة حالياً، لكن زاتكا خفّضت العتبة مع كل موجة جديدة (كانت 750 ألف، ثم 375 ألف، والآن 187,500 ريال) — من المرجح أن تشمل موجات مستقبلية منشآت أصغر. راجع هذه الصفحة كل بضعة أشهر إن كانت إيراداتك قريبة من هذا الرقم.',
  },
  {
    question: 'فاتني موعد موجتي — ماذا أفعل الآن؟',
    answer: 'تواصل مع محاسبك المعتمد أو مزوّد حلول الفوترة الإلكترونية فوراً لبدء الربط بأسرع وقت ممكن. التأخر عن الموعد قد يعرّض منشأتك لغرامات — راجع الإشعار الرسمي الذي أرسلته زاتكا لمنشأتك لمعرفة التفاصيل الدقيقة لحالتك.',
  },
  {
    question: 'هل هذه الأداة رسمية من زاتكا؟',
    answer: 'لا — هذه أداة استرشادية مستقلة مبنية على الإعلانات الرسمية العامة لزاتكا حول عتبات الإيرادات والمواعيد. الإشعار الرسمي الموجَّه لمنشأتك تحديداً من قبل زاتكا هو المرجع النهائي دائماً.',
  },
];

export default function ZatcaEligibilityPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التجارة الإلكترونية', item: `${SITE_URL}/tools/ecommerce` },
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

      <ToolTopAdSlot slotId="top-zatca-eligibility" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">تجارة إلكترونية — محقق</span>
              <h1>هل منشأتك مشمولة بمرحلة الربط والتكامل من زاتكا؟</h1>
              <p className="guide-v2-lead">
                زاتكا تطلق موجات متتابعة، كل موجة تخفّض عتبة الإيرادات وتشمل منشآت أصغر. تحقق فوراً
                من موجتك وموعدك النهائي بإدخال رقم واحد فقط.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CalendarCheck size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  الموجة الحالية (25): إيرادات تجاوزت <strong>187,500 ريال</strong> خلال 2022 أو 2023
                  أو 2024 أو 2025 → الموعد النهائي للربط <strong>1 فبراير 2027</strong>.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هي مرحلة الربط والتكامل</h2>
                <p>
                  بعد أن ألزمت زاتكا كل المنشآت بإصدار فواتير إلكترونية منسّقة (المرحلة الأولى)،
                  تنتقل الآن تدريجياً لمرحلة أعمق: <strong>ربط نظام الفوترة لدى كل منشأة تقنياً مع
                  منصة "فاتورة"</strong> الحكومية، بحيث تُرسَل الفواتير (أو تُختم إلكترونياً) عبر
                  المنصة مباشرة. التطبيق يتم على موجات متتابعة حسب حجم الإيرادات — الأكبر أولاً، ثم
                  تتوسع تدريجياً لتشمل منشآت أصغر.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-zatca-eligibility" />

              <section id="checker">
                <h2>تحقق من موجتك الآن</h2>
                <ZatcaEligibilityChecker />
              </section>

              <section id="waves">
                <h2>الموجات المعلنة حتى الآن</h2>
                <div className="guide-v2-type-grid">
                  {ZATCA_WAVES.map((w) => (
                    <div className="guide-v2-type-card" key={w.wave}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: w.status === 'current' ? 'var(--amber-subtle)' : 'var(--blue-subtle)', color: w.status === 'current' ? 'var(--amber-text)' : 'var(--blue-text)' }} aria-hidden="true">
                          {w.wave}
                        </span>
                        <p className="guide-v2-type-card-title">
                          الموجة {w.wave} {w.status === 'current' ? <span className="badge badge-warning" style={{ marginInlineStart: 'var(--space-2)' }}>الحالية</span> : <span className="badge" style={{ marginInlineStart: 'var(--space-2)' }}>موعدها مضى</span>}
                        </p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>عتبة الإيرادات: أكثر من {w.thresholdSar.toLocaleString('en-US')} ريال</li>
                        <li>الأعوام المعتبرة: {w.years.join('، ')}</li>
                        <li>الموعد النهائي: {w.deadlineLabel}</li>
                      </ul>
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

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://zatca.gov.sa/" target="_blank" rel="noreferrer">الهيئة العامة للزكاة والضريبة والجمارك (زاتكا) — الموقع الرسمي</a>
                  </li>
                  <li>
                    <a href="https://www.qoyod.com/blog/e-invoicing/%D8%A7%D9%84%D8%AA%D8%B3%D8%AC%D9%8A%D9%84-%D9%81%D9%8A-%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9-%D8%A7%D9%84%D9%81%D8%A7%D8%AA%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86" target="_blank" rel="noreferrer">قيود — دليل التسجيل في منظومة الفاتورة الإلكترونية</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في التجارة الإلكترونية</p>
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
            <AdBlogSidebar slotId="sidebar-zatca-eligibility" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
