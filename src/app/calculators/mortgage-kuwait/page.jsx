import KuwaitMortgageCalculator from '@/components/calculators/KuwaitMortgageCalculator.client';
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
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'mortgage-kuwait');
const CONTENT  = getFinancePageContent('mortgage-kuwait');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function MortgageKuwaitPage() {
  const faqItems   = Array.isArray(CONTENT.faqItems)      ? CONTENT.faqItems      : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps)  ? CONTENT.howTo.steps   : [];

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
    name: 'كيف تستخدم حاسبة التمويل السكني الكويت',
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
        <KuwaitMortgageCalculator />
      </CalculatorHero>

      {/* KCB vs commercial bank explainer */}
      <CalculatorSection
        id="m-kw-kcb"
        eyebrow="المسارات التمويلية"
        title="بنك الائتمان الكويتي (KCB) مقابل البنوك التجارية"
      >
        <div className="calc-editorial">
          <p>
            تتميز الكويت بنظام تمويل سكني ثنائي المسار: <strong>بنك الائتمان الكويتي (KCB)</strong> للمواطنين
            بفائدة صفرية وقيمة تصل إلى 70,000 د.ك لمدة 25 سنة، غير أنه تقليدياً ما يواجه قوائم انتظار
            طويلة. أما <strong>البنوك التجارية</strong> فتمنح قروضاً سكنية بضمان الراتب وفق لوائح
            <strong>بنك الكويت المركزي (CBK)</strong> بحد DBR 40%.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>البند</th>
                <th>بنك الائتمان الكويتي (KCB)</th>
                <th>البنوك التجارية</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['الأهلية',        'مواطنون كويتيون فقط', 'مواطنون + وافدون (بعض البنوك)'],
                ['معدل الفائدة',   '0% (مدعوم حكومياً)', '5.5–8%+ (متناقص أو مرابحة)'],
                ['الحد الأقصى',   '70,000 د.ك',           '70,000 د.ك (CBK)'],
                ['أقصى مدة',      '25 سنة',               '15 سنة'],
                ['DBR',            'لا ينطبق',             '40% من الراتب'],
                ['وقت الحصول',    'قائمة انتظار (1-5 سنوات)', 'أسابيع (مع استيفاء الشروط)'],
              ].map(([b, k, c]) => (
                <tr key={b}>
                  <td><strong>{b}</strong></td>
                  <td>{k}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>لماذا لا يوجد قانون رهن عقاري في الكويت؟</h3>
          <p>
            على عكس دول الخليج الأخرى، لا يزال <strong>قانون الرهن العقاري الكويتي</strong> قيد التشريع
            (مشروع قانون مُقدَّم منذ 2018). في غياب هذا القانون، تعتمد البنوك على <strong>الضمان الشخصي
            والراتب</strong> بدلاً من رهن العقار ذاته، مما يحدّ من حجم التمويل المتاح.
          </p>
          <p>
            هذا يعني أن ما يُسمى "التمويل العقاري الكويتي" في البنوك التجارية هو في جوهره <strong>قرض
            شخصي بضمان الراتب لأغراض سكنية</strong>، لا رهناً قانونياً على العقار كما هو الحال في السعودية
            أو قطر أو الإمارات.
          </p>
        </div>
      </CalculatorSection>

      {/* DBR examples table */}
      <CalculatorSection
        id="m-kw-dbr"
        eyebrow="حد DBR"
        title="كيف يحسب البنك المبلغ الذي تستحقه؟"
      >
        <div className="calc-editorial">
          <p>
            يُلزم بنك الكويت المركزي جميع البنوك بأن لا تتجاوز مجموع الأقساط الشهرية للعميل <strong>40%
            من راتبه</strong>. مثال: راتب 1,500 د.ك → أقصى قسط شهري 600 د.ك.
          </p>
        </div>
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الراتب الشهري</th>
                <th>أقصى قسط (40%)</th>
                <th>أقصى تمويل تقريبي (15 سنة · 6%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['800 د.ك',  '320 د.ك',  '~37,000 د.ك'],
                ['1,200 د.ك','480 د.ك',  '~56,000 د.ك'],
                ['1,800 د.ك','720 د.ك',  '~70,000 د.ك (سقف CBK)'],
                ['2,500 د.ك','1,000 د.ك','~70,000 د.ك (سقف CBK)'],
              ].map(([sal, dbr, loan]) => (
                <tr key={sal}>
                  <td><strong>{sal}</strong></td>
                  <td>{dbr}</td>
                  <td>{loan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="m-kw-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="mortgage-kuwait" />
    </main>
  );
}
