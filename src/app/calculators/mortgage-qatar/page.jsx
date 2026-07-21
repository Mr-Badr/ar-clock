import QatarMortgageCalculator from '@/components/calculators/QatarMortgageCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInArticleDivider,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'mortgage-qatar');
const CONTENT  = getFinancePageContent('mortgage-qatar');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function MortgageQatarPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)       ? CONTENT.faqItems       : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps)   ? CONTENT.howTo.steps    : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, keywords: PAGE.keywords, faqItems,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'كيف تستخدم حاسبة التمويل العقاري قطر',
    description: PAGE.description,
    step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        highlights={CONTENT.hero.highlights}
      >
        <QatarMortgageCalculator />
      </CalculatorHero>

      {/* LTV & QCB rules explainer */}
      <CalculatorSection
        id="m-qa-ltv"
        eyebrow="لوائح QCB 2023"
        title="نسب LTV وشروط التمويل العقاري في قطر"
      >
        <div className="calc-editorial">
          <p>
            في يوليو 2023 أصدر <strong>بنك قطر المركزي (QCB)</strong> تعليمات جديدة تنظّم نسب التمويل إلى قيمة العقار
            (LTV) للمواطنين القطريين والمقيمين وغير المقيمين، مع تفريق واضح بين العقارات السكنية والاستثمارية والمشاريع
            تحت الإنشاء.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>نوع المقترض</th>
                <th>سكني ≤ 6M ر.ق</th>
                <th>سكني &gt; 6M ر.ق</th>
                <th>استثماري ≤ 10M</th>
                <th>تحت الإنشاء</th>
                <th>DBR</th>
              </tr>
            </thead>
            <tbody>
              {[
                [<><CountryFlag code="qa" /> قطري</>, '80% / 30 سنة', '75% / 30 سنة', '75% / 25 سنة', '60% / 20 سنة', '75%', 'qatari'],
                ['👤 مقيم وافد',   '75% / 25 سنة', '70% / 25 سنة', '70% / 25 سنة', '50% / 15 سنة', '50%', 'resident'],
                ['🌍 غير مقيم',    '60% / 20 سنة', '60% / 20 سنة', '60% / 20 سنة', '50% / 15 سنة', '50%', 'non-resident'],
              ].map(([t, r1, r2, r3, uc, dbr, key]) => (
                <tr key={key}>
                  <td><strong>{t}</strong></td>
                  <td>{r1}</td>
                  <td>{r2}</td>
                  <td>{r3}</td>
                  <td>{uc}</td>
                  <td><strong>{dbr}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>الفرق بين التمويل التقليدي والإسلامي في قطر</h3>
          <p>
            معظم بنوك قطر تقدم كلا المسارين: <strong>التمويل التقليدي</strong> (فائدة متناقصة على أساس PMT)
            عبر QNB وبنك الدوحة وCBQ، و<strong>المرابحة الإسلامية</strong> (هامش ربح ثابت) عبر QIB ومصرف الريان وبنك بروة.
            في المرابحة، ينص العقد على مبلغ إجمالي ثابت بدلاً من معدل فائدة — مما يجعل حساب القسط بضرب
            أصل التمويل × (1 + نسبة الربح × عدد السنوات) ÷ عدد الأشهر.
          </p>
        </div>
      </CalculatorSection>

      {/* GCC comparison */}
      <CalculatorSection
        id="m-qa-gcc"
        eyebrow="مقارنة خليجية"
        title="التمويل العقاري في دول الخليج — مقارنة سريعة"
      >
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدولة</th>
                <th>أقصى LTV (مواطن)</th>
                <th>أقصى مدة</th>
                <th>DBR</th>
                <th>قانون الرهن</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['qa', 'قطر',    '80%',  '30 سنة', '75% قطري · 50% وافد', 'نعم (QCB 2023)'],
                ['sa', 'السعودية', '90%', '30 سنة', '33% (45% بدعم)',       'نعم (ساما)'],
                ['ae', 'الإمارات', '80%', '25 سنة', '50%',                  'نعم (CBUAE)'],
                ['kw', 'الكويت',  'لا ينطبق', '15 سنة', '40%',              'لا (قروض راتبية)'],
                ['bh', 'البحرين', 'يحدده البنك', '25 سنة', '50%',           'نعم (CBB)'],
              ].map(([code, c, ltv, term, dbr, law]) => (
                <tr key={code}>
                  <td><strong><CountryFlag code={code} /> {c}</strong></td>
                  <td>{ltv}</td>
                  <td>{term}</td>
                  <td>{dbr}</td>
                  <td>{law}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="m-qa-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="mortgage-qatar" />
    </main>
  );
}
