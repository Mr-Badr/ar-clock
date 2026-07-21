import BillSplitterCalculator from '@/components/calculators/BillSplitterCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInArticleDivider,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE     = CALCULATOR_ROUTES.find((item) => item.slug === 'bill-splitter');
const CONTENT  = getFinancePageContent('bill-splitter');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title:       PAGE.heroTitle,
  description: PAGE.description,
  keywords:    SEARCH_COVERAGE.metadataKeywords,
  url:         `${SITE_URL}${PAGE.href}`,
});

export default async function BillSplitterPage() {
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
    name: 'كيف تستخدم حاسبة تقسيم الفاتورة',
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
        <BillSplitterCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="bill-tipping"
        eyebrow="عرف البقشيش"
        title="البقشيش ورسوم الخدمة في دول المنطقة"
        description="قبل أن تضغط على زر المشاركة — تأكد أن البقشيش غير مُدمَج أصلاً في الفاتورة."
      >
        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr>
                <th>الدولة</th>
                <th>رسوم الخدمة</th>
                <th>البقشيش المتعارف عليه</th>
                <th>ملاحظة</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['sa', 'السعودية', '15% ضريبة + 5–10% خدمة',  '5–10%',  'تحقق من نهاية الفاتورة — الخدمة قد تكون مُضمَّنة'],
                ['ae', 'الإمارات',  '10% خدمة + 6% ضريبة',     '10–15%', 'في الفنادق والمطاعم الراقية البقشيش متوقع'],
                ['kw', 'الكويت',    'نادراً 5–10%',              '0–5%',   'البقشيش غير إلزامي — يُترك للمبادرة الشخصية'],
                ['qa', 'قطر',       '10% خدمة + 5% ضريبة',     '10%',    'الفنادق الدولية تُضيف البقشيش تلقائياً أحياناً'],
                ['eg', 'مصر',       '12% خدمة في الفنادق',      '10–15%', 'في المطاعم العادية 5–10 جنيه كافية'],
                ['ma', 'المغرب',    'لا رسوم ثابتة',             '10%',    'في المقاهي والمطاعم السياحية متعارف عليه'],
              ].map(([code, c, fee, tip_, note]) => (
                <tr key={code}>
                  <td><strong><CountryFlag code={code} /> {c}</strong></td>
                  <td>{fee}</td>
                  <td>{tip_}</td>
                  <td className="calc-hint">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>نصائح لتقسيم الحساب بشكل عادل</h3>
          <p>
            <strong>قبل الطلب:</strong> اتفق مع المجموعة على طريقة التقسيم — بالتساوي أم حسب ما طلبه كل شخص.
            اتفاق مسبق يمنع الإحراج عند وصول الفاتورة.
          </p>
          <p>
            <strong>رسوم الخدمة المُضمَّنة:</strong> ابحث عن عبارة "Service Charge" أو "رسوم خدمة" في أسفل الفاتورة.
            إذا وُجدت، لا تُضف بقشيشاً إضافياً — أنت تدفع مرتين.
          </p>
          <p>
            <strong>التقسيم غير المتساوي:</strong> إذا طلب أحدهم أغلى الأطباق، احسب الإجمالي أولاً بالحاسبة ثم وزّعه يدوياً
            حسب ما أكله كل شخص. المبلغ الموضّح في الحاسبة هو نقطة البداية.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      <RelatedCalculators currentSlug="bill-splitter" />
    </main>
  );
}
