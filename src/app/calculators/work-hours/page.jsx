import WorkHoursCalculator from '@/components/calculators/WorkHoursCalculator.client';
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
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'work-hours');
const CONTENT  = getFinancePageContent('work-hours');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function WorkHoursPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)     ? CONTENT.faqItems     : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات',  item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: PAGE.title,   item: `${SITE_URL}${PAGE.href}` },
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
    name: 'كيف تستخدم حاسبة ساعات العمل الأسبوعية',
    description: PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
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
        <WorkHoursCalculator />
      </CalculatorHero>

      {/* Overtime rules by country */}
      <CalculatorSection
        id="wh-overtime-rules"
        showAdBefore
        eyebrow="قوانين العمل"
        title="ساعات العمل الإضافي في دول المنطقة"
      >
        <div className="calc-editorial">
          <p>
            يختلف حد ساعات العمل الأسبوعية الذي يبدأ بعده احتساب <strong>الأجر الإضافي</strong>
            من دولة إلى أخرى. جميع الدول تضمن تعويضاً لا يقل عن ١٢٥–١٥٠٪ للساعة الإضافية،
            ويرتفع في أيام الراحة والعطل الرسمية إلى ١٥٠–٢٠٠٪.
          </p>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البلد</th>
                <th>الحد الأسبوعي</th>
                <th>عطلة الأسبوع</th>
                <th>نسبة الإضافي</th>
                <th>الإضافي بالإجازة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['السعودية 🇸🇦', '40 ساعة',  'ج–س',   '150%', '200%'],
                ['الإمارات 🇦🇪',  '48 ساعة',  'ج–س',   '125%', '150%+'],
                ['الكويت 🇰🇼',    '48 ساعة',  'ج–س',   '125%', '150%'],
                ['قطر 🇶🇦',       '48 ساعة',  'ج–س',   '125%', '150%'],
                ['البحرين 🇧🇭',   '48 ساعة',  'ج–س',   '125%', '150%'],
                ['مصر 🇪🇬',       '48 ساعة',  'ج–أ',   '135%', '200%'],
                ['المغرب 🇲🇦',    '44 ساعة',  'أ',    '125%', '150%'],
                ['الأردن 🇯🇴',    '48 ساعة',  'ج–أ',   '125%', '150%'],
              ].map(([c, h, w, ot, hol]) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td><strong>{h}</strong></td>
                  <td>{w}</td>
                  <td>{ot}</td>
                  <td>{hol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-4)' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            ج = الجمعة · س = السبت · أ = الأحد. نسب الأجر الإضافي تمثل الحد الأدنى القانوني —
            يمكن للعقد أو الاتفاقية الجماعية تحديد نسبة أعلى.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="wh-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="work-hours" />
    </main>
  );
}
