import ZakatCalculator from '@/components/calculators/ZakatCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  RelatedCalculators,
  CalculatorSources,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat');
const CONTENT = getFinancePageContent('zakat');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function ZakatPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
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
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
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
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page calc-zakat-page bg-base text-primary" dir="rtl" lang="ar">
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
        <ZakatCalculator />
      </CalculatorHero>

      <CalculatorSection
        showAdBefore
        id="zakat-guide"
        eyebrow="أساسيات الزكاة"
        title="ما الذي تجب فيه الزكاة؟ دليل مختصر قبل الحساب"
        description="فهم الوعاء الزكوي الصحيح يجنّبك الوقوع في خطأ الإفراط أو التفريط — هذه الأربع قواعد تُغطي معظم الحالات."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'النقود والودائع المصرفية',
              description: 'كل ما في يدك أو في حسابك',
              content: 'تشمل النقود في المنزل والحسابات الجارية والتوفير والودائع لأجل، بما فيها الأرباح المتراكمة. المبلغ يُدخَل بالقيمة الكاملة دون خصم.',
            },
            {
              title: 'الذهب والفضة',
              description: 'المجوهرات والسبائك والعملة',
              content: 'الذهب المدّخر (سبائك أو عملة) تجب فيه الزكاة بلا خلاف. أما حلي الاستعمال الشخصي ففيه خلاف مشهور، والأحوط أن تُزكّيه. أدخل وزنه بالجرام وستُحوّله الحاسبة بسعر السوق.',
            },
            {
              title: 'الأسهم والاستثمارات',
              description: 'البورصة وصناديق الاستثمار',
              content: 'أسهم الشركات التجارية يُزكّى عليها بقيمتها السوقية × 2.5%. أسهم الشركات الصناعية البحتة فيها تفصيل — يُمكن زكاة الأرباح الموزعة فحسب. استفسر من هيئة الزكاة أو عالم متخصص.',
            },
            {
              title: 'البضاعة التجارية والديون',
              description: 'ما تبيع وما تدين',
              content: 'البضاعة المعدة للبيع (مخزون تجاري) تُزكّى بتكلفة الشراء. الديون المستحقة لك من آخرين تدخل في الوعاء. أما ديونك قصيرة الأجل فتُطرح من الوعاء وفق الرأي الراجح.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="zakat-nisab"
        eyebrow="النصاب والمعدل"
        title="نصاب الزكاة — نصاب الذهب مقابل نصاب الفضة"
        description="النصاب هو الحد الأدنى من المال الذي إذا بلغه وحال عليه الحول وجبت الزكاة. وللنصاب معياران: الذهب والفضة."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>معيار النصاب</TableHead>
                <TableHead>الوزن</TableHead>
                <TableHead>القيمة التقريبية (ريال)</TableHead>
                <TableHead>القيمة التقريبية (درهم)</TableHead>
                <TableHead>توصية العلماء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>نصاب الذهب</TableCell>
                <TableCell>85 جراماً</TableCell>
                <TableCell>19,000–24,000 ريال*</TableCell>
                <TableCell>20,000–26,000 درهم*</TableCell>
                <TableCell>أنسب لأصحاب الذهب والعملات الذهبية</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>نصاب الفضة</TableCell>
                <TableCell>595 جراماً</TableCell>
                <TableCell>1,000–1,500 ريال*</TableCell>
                <TableCell>1,100–1,600 درهم*</TableCell>
                <TableCell>أكثر العلماء المعاصرين ينصحون به لأنه أنفع للفقراء</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          * القيم تقريبية تتغير مع أسعار السوق. أدخل سعر الجرام الحالي في الحاسبة للحصول على النصاب الدقيق اليوم.
        </p>

        <div className="calc-article-grid" style={{ marginTop: '1.5rem' }}>
          <article className="calc-article-block">
            <h3>لماذا نصاب الفضة أقل من الذهب؟</h3>
            <p>
              تاريخياً كان الذهب والفضة متقاربَين في القيمة وكان نصاب الفضة أعلى عملياً. بسبب انخفاض سعر
              الفضة الحديث أصبح نصاب الفضة أقل بكثير — مما يجعله أشمل ويُحقق مقصد الزكاة في إيصال
              الخير لأكبر عدد من المحتاجين.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>أيهما أستخدم؟</h3>
            <p>
              إن كنت تمتلك ذهباً أو عملة ذهبية استخدم نصاب الذهب. لبقية الأموال (نقد، أسهم، بضاعة)
              الأشهر عند كثير من علماء المعاصرين هو نصاب الفضة لأنه أدفع للفقراء وأحوط ديناً.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="zakat-assets"
        eyebrow="أنواع الأصول الزكوية"
        title="جدول الأصول الخاضعة للزكاة ومعدلاتها"
        description="الزكاة ليست على كل الممتلكات — بل على الأصول النامية أو ذات الحكم. إليك الجدول المرجعي الشامل."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع الأصل</TableHead>
                <TableHead>هل تجب فيه الزكاة؟</TableHead>
                <TableHead>الوعاء الخاضع</TableHead>
                <TableHead>المعدل</TableHead>
                <TableHead>ملاحظة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>النقود (ريال، دولار، درهم…)</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>المبلغ الكامل</TableCell>
                <TableCell>2.5%</TableCell>
                <TableCell>بعد طرح الديون قصيرة الأجل</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الذهب والفضة</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>القيمة السوقية يوم الزكاة</TableCell>
                <TableCell>2.5%</TableCell>
                <TableCell>حلي الاستخدام: خلاف — الأحوط إخراجها</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>أسهم الشركات التجارية</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>القيمة السوقية الكاملة</TableCell>
                <TableCell>2.5%</TableCell>
                <TableCell>الرأي الأشهر للتبسيط</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>البضاعة التجارية (مخزون)</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>تكلفة الشراء أو القيمة السوقية</TableCell>
                <TableCell>2.5%</TableCell>
                <TableCell>في نهاية الحول بعد طرح الديون</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>المحاصيل الزراعية</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>الإنتاج لكل موسم</TableCell>
                <TableCell>10% (مروي بالمطر) / 5% (مروي اصطناعياً)</TableCell>
                <TableCell>لا يشترط الحول</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>العقارات</TableCell>
                <TableCell>لا (للسكن)</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>عقارات التجارة (للبيع) تُزكّى كبضاعة</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>السيارة والأثاث للاستخدام</TableCell>
                <TableCell>لا</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>ليست أصولاً نامية</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>صناديق الاستثمار</TableCell>
                <TableCell>نعم</TableCell>
                <TableCell>قيمة الوحدات يوم الزكاة</TableCell>
                <TableCell>2.5%</TableCell>
                <TableCell>بعض الصناديق تُصدر شهادة الزكاة</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="zakat-official"
        eyebrow="مصادر رسمية"
        title="الجهات الرسمية لأسئلة الزكاة والتحقق"
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              للتحقق من النصاب المعتمد حالياً أو الحصول على فتوى شرعية، تواصل مع الجهات الرسمية في دولتك.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://zatca.gov.sa/ar/Pages/default.aspx" target="_blank" rel="noreferrer">
                هيئة الزكاة والضريبة والجمارك (ZATCA)
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.alifta.gov.sa/" target="_blank" rel="noreferrer">
                اللجنة الدائمة للبحوث العلمية والإفتاء
              </a>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="zakat-faq"
        eyebrow="أسئلة شائعة"
        title="أكثر الأسئلة بحثاً حول الزكاة وكيفية حسابها"
        subtle
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="zakat-related">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="zakat" />
      </CalculatorSection>
    </main>
  );
}
