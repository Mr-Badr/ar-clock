import { notFound } from 'next/navigation';
import { GasPump } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import FuelPriceChange from '@/components/tools-v2/FuelPriceChange';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { FUEL_PRICE_SLUG_TO_CODE } from '@/lib/calculators/fuel-prices-registry';
import { getFuelPricesLive } from '@/lib/calculators/fuel-prices-live';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

// One dynamic route serves every fuel-price country page (saudi-fuel-prices, uae-fuel-prices,
// kuwait-fuel-prices, ...) — see fuel-prices-registry.js's header for why. The `[country]`
// segment captures the FULL slug ("kuwait-fuel-prices"), parsed below via
// FUEL_PRICE_SLUG_TO_CODE — this keeps every existing URL exactly as it was (no redirects
// needed), it's just one shared page file instead of 9 nearly-identical ones.
function resolveCountryCode(rawSlug) {
  const match = /^(.+)-fuel-prices$/.exec(rawSlug || '');
  if (!match) return null;
  return FUEL_PRICE_SLUG_TO_CODE[match[1]] || null;
}

export async function generateStaticParams() {
  return Object.entries(FUEL_PRICE_SLUG_TO_CODE).map(([slug]) => ({ country: `${slug}-fuel-prices` }));
}

export async function generateMetadata({ params }) {
  const { country: rawSlug } = await params;
  const countryCode = resolveCountryCode(rawSlug);
  if (!countryCode) return {};

  const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === rawSlug);
  const CONTENT = getFinancePageContent(rawSlug);
  if (!PAGE || !CONTENT) return {};
  const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

  return buildCanonicalMetadata({
    title: PAGE.heroTitle,
    description: PAGE.description,
    keywords: SEARCH_COVERAGE.metadataKeywords,
    url: `${SITE_URL}${PAGE.href}`,
  });
}

export default async function FuelPricesCountryPage({ params }) {
  const { country: rawSlug } = await params;
  const countryCode = resolveCountryCode(rawSlug);
  if (!countryCode) notFound();

  const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === rawSlug);
  const CONTENT = getFinancePageContent(rawSlug);
  if (!PAGE || !CONTENT) notFound();
  const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

  const DATA = await getFuelPricesLive(countryCode);
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];

  const TOC_ITEMS = [
    ['prices', 'الأسعار الحالية'],
    ['explainer', 'دليل الفهم'],
    ['faq', 'الأسئلة الشائعة'],
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'أسعار الوقود', item: `${SITE_URL}/tools/fuel-prices` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId={`top-${rawSlug}`} />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">{CONTENT.hero.badge}</span>
              <h1>{PAGE.heroTitle}</h1>
              <p className="guide-v2-lead">{PAGE.description}</p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><GasPump size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  {DATA.grades[0] ? (
                    <>
                      {DATA.grades[0].label} هذا الأسبوع <strong>{DATA.grades[0].price} {DATA.currency}</strong>
                      {DATA.grades.length > 1 ? (
                        <>، و{DATA.grades[DATA.grades.length - 1].label} <strong>{DATA.grades[DATA.grades.length - 1].price} {DATA.currency}</strong></>
                      ) : null} —{' '}
                    </>
                  ) : null}
                  راجع الجدول الكامل أدناه لكل الأنواع ومقارنتها بالقراءة السابقة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="prices">
                <h2>سعر البنزين في {DATA.countryName} اليوم</h2>
                <div className="fuel-price-header">
                  <span className={`calc-esb-country-badge calc-esb-country-badge--${countryCode}`}>{DATA.countryName}</span>
                  {DATA.isLive ? (
                    <>
                      <span className="calc-esb-live-dot" aria-hidden="true" />
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--green-text)' }}>مباشر</span>
                    </>
                  ) : null}
                </div>
                <p className="fuel-price-updated">
                  {DATA.isLive
                    ? `جُلبت مباشرة الآن (${new Date(DATA.fetchedAt).toLocaleDateString('ar', { day: 'numeric', month: 'long' })})`
                    : DATA.lastLiveAt
                      ? `آخر تحديث مباشر مؤكد: ${new Date(DATA.lastLiveAt).toLocaleDateString('ar', { day: 'numeric', month: 'long' })} (تعذّر تحديثها مباشرة الآن)`
                      : `آخر تحديث: ${DATA.effectiveMonth} (بيانات ثابتة — لم تتوفر بيانات مباشرة بعد)`}
                  {' · المصدر: '}
                  <a href={DATA.sourceUrl} target="_blank" rel="noopener noreferrer">{DATA.sourceLabel}</a>
                </p>
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead><tr><th>النوع</th><th>السعر لكل لتر</th><th>التغيّر عن القراءة السابقة</th></tr></thead>
                    <tbody>
                      {DATA.grades.map((grade) => (
                        <tr key={grade.grade}>
                          <td>{grade.label}</td>
                          <td><strong style={{ color: 'var(--green-text)' }}>{grade.price} {DATA.currency}</strong></td>
                          <td><FuelPriceChange value={grade.changeFromLastMonth} currency={DATA.currency} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: 'var(--space-3)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {DATA.mechanism}
                </p>
              </section>

              <ToolInArticleAd slotId={`mid-${rawSlug}`} />

              <section id="explainer">
                <h2>دليل الفهم</h2>
                <div className="tool-v2-plain-block">
                  <h3>{DATA.authority ? `من يحدد سعر البنزين في ${DATA.countryName}؟` : `كيف تُحدَّد أسعار البنزين في ${DATA.countryName}؟`}</h3>
                  <p>{DATA.mechanism}</p>
                </div>
                <div className="tool-v2-plain-block">
                  <h3>ما الفرق بين أنواع البنزين؟</h3>
                  <p>الرقم يشير إلى رقم الأوكتان — مقاومة الوقود للاشتعال المبكر داخل المحرك. كلما زاد الرقم زادت جودة الاحتراق للمحركات التي تتطلب أوكتان أعلى. راجع دليل سيارتك لمعرفة النوع الموصى به، فاستخدام أوكتان أقل من المطلوب قد يقلل كفاءة المحرك على المدى الطويل.</p>
                </div>
                <div className="tool-v2-plain-block">
                  <h3>كيف تستخدم هذه الصفحة بشكل عملي</h3>
                  <p>احفظ هذه الصفحة كمرجع دائم — الجدول أعلاه يُحدَّث تلقائياً من مصدر مباشر بلا حاجة لأي تدخل يدوي، ويوضح فوراً إن كان السعر ارتفع أو انخفض أو ثبت.</p>
                </div>
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {faqItems.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId={`sidebar-${rawSlug}`} className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
