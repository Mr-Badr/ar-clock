import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';
import { GasPump } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import CountryFlag from '@/components/shared/CountryFlag';
import FuelPriceChange from '@/components/tools-v2/FuelPriceChange';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { FUEL_PRICE_CODE_TO_HREF, FUEL_PRICE_COUNTRY_CODES } from '@/lib/calculators/fuel-prices-registry';
import { getFuelPricesLive } from '@/lib/calculators/fuel-prices-live';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'compare');
const CONTENT = getFinancePageContent('compare');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const COUNTRY_ORDER = FUEL_PRICE_COUNTRY_CODES;

const TOC_ITEMS = [
  ['comparison', 'مقارنة الأسعار'],
  ['explainer', 'لماذا تختلف الأسعار'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-fuel-prices-compare');
  cacheLife('hours');

  // Same live-or-fallback data as each country's own page (getFuelPricesLive is itself cached
  // and shared across every page that calls it for the same country — see fuel-prices-live.js).
  const countries = await Promise.all(COUNTRY_ORDER.map((cc) => getFuelPricesLive(cc)));

  // Deliberately NOT computing a "cheapest"/"most expensive" superlative here (removed
  // 2026-08-25, owner-flagged): each country's price is in its own currency (KWD, SAR, AED, ...)
  // — comparing the raw numbers without a real exchange-rate conversion is not a valid claim (1
  // KWD is worth far more than 1 SAR). No free, reliable FX source was wired in for this, so the
  // honest choice is to show the real per-country data and let the reader compare, not publish a
  // wrong "X is cheapest" claim.
  return { countries };
}

export default async function FuelPricesComparePage() {
  const { countries } = await buildPageModel();
  const liveCount = countries.filter((c) => c.isLive).length;
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];

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

      <ToolTopAdSlot slotId="top-fuel-prices-compare" />

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
                  الأسعار أدناه لـ<strong>13 دولة عربية</strong>، كل دولة بعملتها الخاصة —{' '}
                  <strong>{liveCount} منها محدثة مباشرة الآن</strong>. الأسعار غير قابلة للمقارنة
                  الرقمية المباشرة بين الدول لاختلاف العملات؛ راجع بطاقة كل دولة أدناه لتفاصيلها.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="comparison">
                <h2>مقارنة الأسعار</h2>
                <p>سعر كل نوع بنزين وديزل في 13 دولة عربية — كل دولة في بطاقتها الخاصة، بالأنواع المتوفرة فيها فقط.</p>
                <div className="fuel-country-grid">
                  {countries.map((country) => (
                    <div className="fuel-country-card" key={country.countryCode}>
                      <div className="fuel-country-card-head">
                        <span className="fuel-country-card-title">
                          <CountryFlag code={country.countryCode} /> {country.countryName}
                          {country.isLive ? <span className="calc-esb-live-dot" aria-hidden="true" /> : null}
                        </span>
                      </div>

                      <div className="fuel-country-grades">
                        {country.grades.map((grade) => (
                          <div className="fuel-country-grade-row" key={grade.grade}>
                            <span className="fuel-country-grade-label">{grade.label}</span>
                            <span className="fuel-country-grade-value">
                              <strong style={{ color: 'var(--green-text)' }}>{grade.price} {country.currency}</strong>
                              <FuelPriceChange value={grade.changeFromLastMonth} currency={country.currency} />
                            </span>
                          </div>
                        ))}
                      </div>

                      <Link href={FUEL_PRICE_CODE_TO_HREF[country.countryCode]} className="fuel-country-card-link">
                        التفاصيل الكاملة والمصدر ←
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-fuel-prices-compare" />

              <section id="explainer">
                <h2>لماذا تختلف الأسعار</h2>
                <div className="tool-v2-plain-block">
                  <h3>لماذا تختلف أسعار البنزين بين الدول العربية؟</h3>
                  <p>{getFinancePageContent('compare').faqItems[1].answer}</p>
                </div>
                <div className="tool-v2-plain-block">
                  <h3>هل تتغير الأسعار في نفس الوقت؟</h3>
                  <p>{getFinancePageContent('compare').faqItems[2].answer}</p>
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
            <AdBlogSidebar slotId="sidebar-fuel-prices-compare" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
