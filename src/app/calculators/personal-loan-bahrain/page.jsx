import BahrainPersonalLoanCalculator from '@/components/calculators/BahrainPersonalLoanCalculator.client';
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
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'personal-loan-bahrain');
const CONTENT  = getFinancePageContent('personal-loan-bahrain');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function PersonalLoanBahrainPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)     ? CONTENT.faqItems     : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps  : [];

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
    name: 'كيف تستخدم حاسبة القرض الشخصي البحرين',
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
        <BahrainPersonalLoanCalculator />
      </CalculatorHero>

      {/* CBB rules explainer */}
      <CalculatorSection
        id="pl-bh-cbb"
        eyebrow="لوائح بنك البحرين المركزي"
        title="شروط القرض الشخصي في البحرين"
      >
        <div className="calc-editorial">
          <p>
            يُنظّم <strong>بنك البحرين المركزي (CBB)</strong> القروض الشخصية لجميع البنوك العاملة في البحرين.
            الحد الأقصى لنسبة عبء الدين (DBR) هو <strong>50%</strong> للجميع — مواطنين ووافدين — وهو من أعلى
            معدلات الخليج (السعودية 33%، الكويت 40%).
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البند</th>
                <th>بحريني (مواطن)</th>
                <th>وافد مقيم</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['DBR الأقصى',           '50%',            '50%'],
                ['الحد الأقصى للقرض',   '100,000 د.ب',    '60,000 د.ب'],
                ['أقصى مدة',             '84 شهراً (7 سنوات)', '60 شهراً (5 سنوات)'],
                ['الحد الأدنى للراتب',   '300–500 د.ب',    '500–800 د.ب (حسب البنك)'],
                ['معدل الفائدة (APR)',   '7–12%',          '9–15%'],
                ['مميزات كبار الرواتب', 'شروط مرنة (+3,000 د.ب)', 'بنوك دولية'],
              ].map(([b, n, e]) => (
                <tr key={b}>
                  <td><strong>{b}</strong></td>
                  <td>{n}</td>
                  <td>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>أبرز بنوك القروض الشخصية في البحرين</h3>
          <p>
            <strong>بنك البحرين الوطني (NBB)</strong>: معدل تنافسي ~8.5% APR، يقبل شريحة واسعة من الرواتب.
            <strong> BBK (بنك البحرين والكويت)</strong>: عروض ترويجية تصل إلى 4.9% APR للعملاء المميزين.
            <strong> Standard Chartered</strong>: للوافدين بدخل مرتفع. <strong>بنك البحرين الإسلامي (BIB)</strong>:
            مرابحة بنسبة ربح 8–10%. <strong>أهلي يونايتد</strong>: خيار للوافدين برواتب معتدلة (~11.7% APR).
          </p>
        </div>
      </CalculatorSection>

      {/* GCC comparison */}
      <CalculatorSection
        id="pl-bh-gcc"
        eyebrow="مقارنة خليجية"
        title="شروط القرض الشخصي في دول الخليج"
      >
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدولة</th>
                <th>حد DBR (مواطن / وافد)</th>
                <th>أقصى مبلغ</th>
                <th>أقصى مدة (مواطن)</th>
                <th>الجهة التنظيمية</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['🇧🇭 البحرين',  '50% / 50%',            '100K د.ب / 60K وافد', '84 شهراً', 'CBB'],
                ['🇦🇪 الإمارات', '50% / 50%',            'مليون د.إ / 250K وافد', '48 شهراً', 'CBUAE'],
                ['🇶🇦 قطر',     '75% قطري / 50% وافد', '2M ر.ق / 400K وافد',  '120 شهراً', 'QCB'],
                ['🇰🇼 الكويت',  '40% / 30%',            '70K د.ك / 15K وافد', '60 شهراً', 'CBK'],
                ['🇸🇦 السعودية', '33% للجميع',           '1M ر.س / 500K وافد', '60 شهراً', 'ساما'],
              ].map(([c, dbr, max, term, reg]) => (
                <tr key={c}>
                  <td><strong>{c}</strong></td>
                  <td>{dbr}</td>
                  <td>{max}</td>
                  <td>{term}</td>
                  <td>{reg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="pl-bh-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="personal-loan-bahrain" />
    </main>
  );
}
