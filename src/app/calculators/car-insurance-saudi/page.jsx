import SaudiCarInsuranceCalculator from '@/components/calculators/SaudiCarInsuranceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'car-insurance-saudi');
const CONTENT = getFinancePageContent('car-insurance-saudi');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function CarInsuranceSaudiPage() {
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
    name: 'كيف تستخدم حاسبة تأمين السيارة في السعودية',
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
        <SaudiCarInsuranceCalculator />
      </CalculatorHero>

      {/* How it works + factors table */}
      <CalculatorSection
        id="ci-sa-factors"
        showAdBefore
        eyebrow="كيف يُحسب؟"
        title="العوامل التي تحدد سعر تأمين سيارتك"
      >
        <div className="calc-editorial">
          <p>
            لا يوجد سعر ثابت لتأمين السيارات في السعودية — كل شركة تأمين تستخدم نموذجاً اكتوارياً خاصاً بها، لكن
            جميعها تعتمد على نفس المتغيرات الجوهرية. فهم هذه العوامل يمكّنك من مقارنة العروض بوعي وخفض قسطك.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>العامل</th>
                <th>تأثيره على السعر</th>
                <th>ملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['عمر السائق', 'الأعلى تأثيراً', '18–21 سنة: 2–3× المتوسط؛ 31–45 سنة: الأرخص'],
                ['نوع التغطية', 'ضد الغير أرخص بكثير', 'شامل يغطي تلف سيارتك؛ ضد الغير يغطي الطرف الثالث فقط'],
                ['قيمة السيارة', 'أساس حساب الشامل', 'كلما ارتفعت القيمة ارتفع القسط'],
                ['عمر السيارة', 'السيارات الأقدم أرخص', 'معدل التأمين ينخفض مع تقدم عمر السيارة'],
                ['المدينة', 'الرياض الأعلى', 'نسبة الحوادث بالرياض أعلى من باقي المدن'],
                ['سجل الحوادث', 'خصم يصل 30%', 'كل سنة بدون مطالبات = خصم إضافي (No-Claim Bonus)'],
              ].map(([factor, impact, note]) => (
                <tr key={factor}>
                  <td><strong>{factor}</strong></td>
                  <td>{impact}</td>
                  <td className="calc-hint">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lower your premium tips */}
        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>كيف تخفّض قسط تأمينك؟</h3>
          <ul>
            <li><strong>اختر ضد الغير</strong> إذا كانت سيارتك قديمة أو قيمتها منخفضة — التأمين الشامل قد يتجاوز قيمة السيارة نفسها.</li>
            <li><strong>احافظ على سجل نظيف:</strong> كل سنة بدون مطالبات تُضيف خصماً تراكمياً يصل إلى 30%.</li>
            <li><strong>قارن بين 3 شركات على الأقل:</strong> الفارق قد يبلغ 40% للمواصفات ذاتها.</li>
            <li><strong>رفع نسبة التحمّل:</strong> اختيار تحمّل أعلى (excess) يخفض القسط مقابل تحمّل جزء أصغر عند الحادث.</li>
            <li><strong>تجنب الإضافات غير الضرورية:</strong> تغطية الحوادث الشخصية، الزجاج، الملحقات — كل إضافة ترفع القسط.</li>
          </ul>
        </div>

        {/* TP vs Comprehensive compare */}
        <div className="calc-info-table-wrap" style={{ marginTop: 'var(--spacing-4)' }}>
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>التغطية</th>
                <th>تأمين ضد الغير</th>
                <th>تأمين شامل</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['السعر التقريبي', '500 – 2,000 ر.س/سنة', '1,500 – 5,000+ ر.س/سنة'],
                ['تلف سيارتك (حادث)', '❌ لا يغطي', '✅ يغطي'],
                ['تلف الطرف الثالث', '✅ يغطي', '✅ يغطي'],
                ['سرقة السيارة', '❌ لا يغطي', '✅ يغطي (عادةً)'],
                ['الكوارث الطبيعية', '❌ لا يغطي', '✅ يغطي (عادةً)'],
                ['الإلزامية قانوناً', '✅ نعم (الحد الأدنى)', 'اختياري'],
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
        <CalculatorSection id="ci-sa-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="car-insurance-saudi" />
    </main>
  );
}
