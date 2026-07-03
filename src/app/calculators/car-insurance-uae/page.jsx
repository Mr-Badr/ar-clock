import UaeCarInsuranceCalculator from '@/components/calculators/UaeCarInsuranceCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'car-insurance-uae');
const CONTENT = getFinancePageContent('car-insurance-uae');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function CarInsuranceUaePage() {
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
    name: 'كيف تستخدم حاسبة تأمين السيارة في الإمارات',
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
        <UaeCarInsuranceCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="ci-uae-factors"
        showAdBefore
        eyebrow="كيف يُحسب؟"
        title="العوامل التي تحدد سعر تأمين سيارتك في الإمارات"
      >
        <div className="calc-editorial">
          <p>
            هيئة التأمين الإماراتية تُنظّم القطاع لكنها لا تُحدّد سعراً ثابتاً — كل شركة تحتسب قسطها وفق نموذج اكتواري
            خاص. مع ذلك، جميع الشركات تعتمد على نفس المتغيرات الجوهرية. فهمها يُمكّنك من المقارنة بذكاء وخفض قسطك الفعلي.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>العامل</th><th>التأثير</th><th>تفصيل</th></tr>
            </thead>
            <tbody>
              {[
                ['عمر السائق',    'الأعلى أثراً',       '18–21 سنة: 2–2.5× المتوسط · 31–45: الأرخص'],
                ['الإمارة',       'دبي الأغلى',          'دبي + 20% · أبوظبي + 10% · الشارقة + 5%'],
                ['نوع التغطية',   'ضد الغير أرخص كثيراً', 'ضد الغير إلزامي قانوناً · شامل اختياري'],
                ['قيمة السيارة',  'أساس الشامل',         'كلما ارتفعت القيمة ارتفع قسط الشامل'],
                ['عمر السيارة',   'كلما أقدم انخفض',     'سيارات 7+ سنوات تُؤمَّن بنسبة أقل من قيمتها'],
                ['سجل الحوادث',  'خصم يصل 30%',         'كل سنة نظيفة = No-Claim Bonus'],
              ].map(([factor, impact, detail]) => (
                <tr key={factor}>
                  <td><strong>{factor}</strong></td>
                  <td>{impact}</td>
                  <td className="calc-hint">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>5 طرق لخفض قسط التأمين في الإمارات</h3>
          <ul>
            <li><strong>حافظ على سجلك النظيف:</strong> سنتان بدون مطالبات = خصم 10%، وخمس سنوات = 30%.</li>
            <li><strong>رفع نسبة التحمّل (Excess):</strong> ارتفاع مبلغ التحمّل يُخفّض القسط — لكن تأكد من قدرتك على دفعه عند الحادث.</li>
            <li><strong>قارن على أقل ثلاث شركات:</strong> الفارق قد يتجاوز 35% للمواصفات ذاتها — استخدم بوابات المقارنة الرسمية.</li>
            <li><strong>تجنب تسجيل مطالبات صغيرة:</strong> مطالبة بـ 500 د.إ قد تُكلّفك خسارة خصم الـ 20% للعام القادم.</li>
            <li><strong>سيارات قديمة: اكتفِ بضد الغير:</strong> إذا تجاوزت قيمة سيارتك قسط الشامل × 5 سنوات، الشامل غير مُجدٍ اقتصادياً.</li>
          </ul>
        </div>

        <div className="calc-info-table-wrap" style={{ marginTop: 'var(--spacing-4)' }}>
          <table className="calc-info-table">
            <thead>
              <tr><th>التغطية</th><th>ضد الغير</th><th>شامل</th></tr>
            </thead>
            <tbody>
              {[
                ['السعر التقريبي',   '650 – 2,500 د.إ/سنة',  '1,800 – 8,000+ د.إ/سنة'],
                ['تلف سيارتك',       '❌ لا يغطي',            '✅ يغطي'],
                ['تلف الطرف الثالث', '✅ يغطي',               '✅ يغطي'],
                ['سرقة السيارة',     '❌ لا يغطي',            '✅ يغطي (عادةً)'],
                ['إلزامي قانوناً',   '✅ نعم (الحد الأدنى)', 'اختياري'],
                ['الكوارث الطبيعية', '❌ لا يغطي',            '✅ يغطي عادةً'],
              ].map(([aspect, tp, comp]) => (
                <tr key={aspect}>
                  <td><strong>{aspect}</strong></td>
                  <td>{tp}</td>
                  <td>{comp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="ci-uae-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="car-insurance-uae" />
    </main>
  );
}
