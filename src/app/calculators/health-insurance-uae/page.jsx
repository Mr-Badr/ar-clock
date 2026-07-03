import UaeHealthInsuranceCalculator from '@/components/calculators/UaeHealthInsuranceCalculator.client';
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
const PAGE    = CALCULATOR_ROUTES.find((item) => item.slug === 'health-insurance-uae');
const CONTENT = getFinancePageContent('health-insurance-uae');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default async function HealthInsuranceUaePage() {
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
    name: 'كيف تستخدم حاسبة التأمين الصحي الإمارات',
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
        <UaeHealthInsuranceCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="hi-uae-explained"
        showAdBefore
        eyebrow="التأمين الصحي في الإمارات"
        title="ما تحتاج معرفته قبل الاختيار"
      >
        <div className="calc-editorial">
          <p>
            التأمين الصحي <strong>إلزامي لجميع المقيمين في الإمارات</strong> — صاحب العمل ملزم قانونياً بتوفيره. غير أن
            المعالين (الزوجة والأطفال) مسؤولية الكفيل إذا لم يُدرجهم صاحب العمل. فهم مستويات التغطية يُوفّر عليك دفع
            تكاليف طبية غير مُتوقعة من جيبك.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>مستوى التغطية</th><th>ما يشمله</th><th>سعر تقديري/فرد/سنة</th></tr>
            </thead>
            <tbody>
              {[
                ['أساسي (Basic)',   'الطوارئ + العيادات الحكومية + الحالات الحرجة',              '650 – 1,400 د.إ'],
                ['متوسط (Enhanced)','مستشفيات خاصة مختارة + أدوية + فحوصات + رعاية مزمنة',     '1,600 – 4,000 د.إ'],
                ['مميز (Premium)',  'أفضل المستشفيات الخاصة + أسنان + نظر + غرفة خاصة + إخلاء طبي', '4,200 – 12,000+ د.إ'],
              ].map(([level, covers, price]) => (
                <tr key={level}>
                  <td><strong>{level}</strong></td>
                  <td>{covers}</td>
                  <td className="calc-hint">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>كيف يؤثر العمر على قسط التأمين الصحي؟</h3>
          <p>
            العمر هو أكبر عامل في تحديد قسط التأمين الصحي — أكثر من الجنس أو الإمارة. الأشخاص فوق 55 سنة
            يدفعون ما بين 2.5 و3.5 أضعاف من هم في الفئة 18–35. بعض الشركات تشترط فحصاً طبياً لمن تجاوز 50 سنة
            قبل إصدار الوثيقة.
          </p>
        </div>

        <div className="calc-info-table-wrap">
          <table className="calc-info-table">
            <thead>
              <tr><th>الفئة العمرية</th><th>معامل التسعير النسبي</th><th>ملاحظة</th></tr>
            </thead>
            <tbody>
              {[
                ['18 – 35 سنة', '× 1.0 (الأساس)',  'أقل خطورة صحية'],
                ['36 – 45 سنة', '× 1.4',            'بداية ارتفاع الخطر'],
                ['46 – 55 سنة', '× 1.9',            'أمراض مزمنة أكثر شيوعاً'],
                ['56 – 60 سنة', '× 2.6',            'فحص طبي مطلوب لدى كثير من الشركات'],
                ['60+ سنة',     '× 3.5',            'أعلى خطورة — بعض الشركات ترفض التغطية'],
              ].map(([age, factor, note]) => (
                <tr key={age}>
                  <td><strong>{age}</strong></td>
                  <td>{factor}</td>
                  <td className="calc-hint">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calc-editorial" style={{ marginTop: 'var(--spacing-6)' }}>
          <h3>نصائح لاختيار تأمين صحي مناسب في الإمارات</h3>
          <ul>
            <li><strong>تحقق من شبكة المستشفيات:</strong> الشبكة الأهم من مستوى التغطية — تأكد أن مستشفى قريبًا منك مدرج فيها.</li>
            <li><strong>اقرأ حدود التغطية السنوية:</strong> وثائق أساسية كثيرة تضع سقفاً منخفضاً (250,000–500,000 د.إ).</li>
            <li><strong>انتبه لبند الأمراض السابقة:</strong> معظم وثائق الأساسي تستثني الأمراض المزمنة المعروفة بالكامل.</li>
            <li><strong>العائلة تؤثر على السعر:</strong> أعمار المعالين (خاصة الآباء) ترفع القسط بشكل ملحوظ.</li>
            <li><strong>استفسر عن الاشتراك المشترك (Co-pay):</strong> وثائق ذات Co-pay أقل سعراً لكن ستدفع نسبة من كل زيارة.</li>
          </ul>
        </div>
      </CalculatorSection>

      <CalculatorInArticleDivider />
      <CalculatorFaqSection items={faqItems} />

      {CONTENT.sources?.length > 0 && (
        <CalculatorSection id="hi-uae-sources" eyebrow="المصادر" title="المراجع الرسمية">
          <CalculatorSources sources={CONTENT.sources} />
        </CalculatorSection>
      )}

      <RelatedCalculators currentSlug="health-insurance-uae" />
    </main>
  );
}
