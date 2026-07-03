import DubaiCompanySetupCalculator from '@/components/calculators/DubaiCompanySetupCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'dubai-company-setup-cost');
const CONTENT = getFinancePageContent('dubai-company-setup-cost');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function DubaiCompanySetupCostPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)   ? CONTENT.faqItems   : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

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
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    keywords: PAGE.keywords,
    faqItems,
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
    name: 'كيف تستخدم حاسبة تكلفة تأسيس شركة في دبي',
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
        <DubaiCompanySetupCalculator />
      </CalculatorHero>

      {/* Mainland vs Free Zone comparison */}
      <CalculatorSection
        id="dubai-setup-compare"
        showAdBefore
        eyebrow="المقارنة"
        title="براً مقابل المنطقة الحرة — أيهما يناسبك؟"
      >
        <div className="calc-editorial">
          <p>
            أكبر قرار عند تأسيس شركة في دبي هو اختيار الجهة: <strong>الترخيص البري (DED)</strong>
            الذي يمنحك حرية التعامل مع أي عميل في الإمارات، أو <strong>المنطقة الحرة</strong>
            التي تتيح ملكية أجنبية 100% وإجراءات أسرع وتكلفة أقل في الغالب.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>المعيار</th>
                <th>براً (Mainland)</th>
                <th>منطقة حرة (Free Zone)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['التكلفة الأولية',         '15,000 – 50,000+ د.إ',    '7,500 – 25,000 د.إ'],
                ['ملكية أجنبية',            '100% (منذ 2021)',          '100%'],
                ['التداول داخل الإمارات',   '✅ مباشر',               '❌ عبر وكيل محلي أو وكيل توزيع'],
                ['متطلبات المكتب',         'عقد إيجار رسمي عادةً',    'فليكسي ديسك يكفي في أغلب المناطق'],
                ['سرعة التأسيس',           '3 – 7 أيام عمل',          '1 – 3 أيام عمل'],
                ['التأشيرات المتاحة',       'غير محدود (حسب المساحة)', 'محددة بكوتة المنطقة الحرة'],
                ['الضريبة على الأرباح',     '9% على الربح > 375K د.إ', 'معفى في أغلب المناطق الحرة'],
              ].map(([criterion, mainland, freezone]) => (
                <tr key={criterion}>
                  <td><strong>{criterion}</strong></td>
                  <td>{mainland}</td>
                  <td>{freezone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>أشهر المناطق الحرة في دبي</h3>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>المنطقة الحرة</th>
                <th>الأنسب لـ</th>
                <th>نطاق الرخصة (د.إ/سنة)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['DMCC (مركز تجارة السلع)',     'تجارة، ذهب، مواد خام',         '18,000 – 50,000'],
                ['DIFC (مركز دبي المالي)',       'مالية، تأمين، قانون',           '25,000 – 100,000+'],
                ['Dubai Internet City',          'تقنية، برمجيات، ابتكار',       '15,000 – 40,000'],
                ['Jebel Ali (JAFZA)',            'لوجستيات، صناعة، تصدير',       '20,000 – 60,000'],
                ['SPC Free Zone (شارجة)',        'عموماً — الأرخص في المنطقة',   '5,750 – 15,000'],
              ].map(([zone, suits, range]) => (
                <tr key={zone}>
                  <td><strong>{zone}</strong></td>
                  <td>{suits}</td>
                  <td>{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="dubai-setup-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="dubai-company-setup-cost" />
    </main>
  );
}
