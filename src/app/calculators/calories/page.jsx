import CaloriesCalculator from '@/components/calculators/CaloriesCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'calories');
const CONTENT = getFinancePageContent('calories');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function CaloriesPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)    ? CONTENT.faqItems   : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
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
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question', name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيف تستخدم حاسبة السعرات الحرارية',
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
        <CaloriesCalculator />
      </CalculatorHero>

      <CalculatorSection id="cal-explained" showAdBefore eyebrow="كيف يعمل؟" title="معدل الأيض والطاقة اليومية">
        <div className="calc-editorial">
          <p>
            الحاسبة تستخدم <strong>معادلة ميفلين-سانت جيور (Mifflin-St Jeor)</strong> — الأدق للبالغين وفق الأبحاث الحديثة.
            الخطوة الأولى: حساب <strong>معدل الأيض الأساسي (BMR)</strong> — الطاقة التي يحتاجها جسمك في حالة الراحة التامة.
            ثم يُضرب في <strong>معامل النشاط</strong> للحصول على <strong>TDEE</strong> (الإنفاق الكلي للطاقة يومياً).
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>مستوى النشاط</th><th>المعامل</th><th>مثال</th></tr>
            </thead>
            <tbody>
              {[
                ['مستقر (لا رياضة)',          '× 1.2',   'موظف مكتبي، لا يمشي كثيراً'],
                ['نشاط خفيف (1–3 أيام/أسبوع)', '× 1.375', 'رياضة خفيفة أو مشي 3 مرات أسبوعياً'],
                ['نشاط متوسط (3–5 أيام)',       '× 1.55',  'رياضة معتدلة منتظمة'],
                ['نشاط عالٍ (6–7 أيام)',        '× 1.725', 'رياضة شاقة يومياً'],
                ['نشاط شديد جداً',               '× 1.9',   'عمل بدني + تدريب مكثف'],
              ].map(([level, factor, ex]) => (
                <tr key={level}>
                  <td><strong>{level}</strong></td>
                  <td>{factor}</td>
                  <td className="calc-hint">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>قاعدة الـ 500 سعر — مفتاح التحكم في الوزن</h3>
          <p>
            كل نقص 500 سعرة حرارية يومياً يؤدي نظرياً إلى خسارة ≈ 0.5 كغ في الأسبوع (لأن 1 كغ دهون = 7,700 kcal تقريباً).
            فائض 500 kcal يومياً يعني زيادة 0.5 كغ/أسبوع. لا تنقص عن 1,200 kcal للنساء أو 1,500 للرجال بدون إشراف طبي.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="cal-sources" eyebrow="المصادر" title="المراجع العلمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="calories" />
    </main>
  );
}
