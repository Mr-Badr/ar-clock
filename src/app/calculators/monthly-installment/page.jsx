import MonthlyInstallmentCalculator from '@/components/calculators/MonthlyInstallmentCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorPolicyNotice,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { FINANCE_INFORMATIONAL_NOTICE } from '@/lib/calculators/policy-notices';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'monthly-installment');
const CONTENT = getFinancePageContent('monthly-installment');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function MonthlyInstallmentPage() {
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
    name: CONTENT.howTo?.name || 'كيفية استخدام حاسبة القسط الشهري',
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
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
        <MonthlyInstallmentCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="loan-policy-notice"
        eyebrow="قبل المقارنة"
        title="هذه حاسبة مجانية وليست عرض تمويل"
        description="اقرأ هذا التنبيه قبل أن تقارن القسط أو الفائدة، لأنه يوضح حدود الصفحة وما لا نفعله ببياناتك أو قرارك."
      >
        <CalculatorPolicyNotice {...FINANCE_INFORMATIONAL_NOTICE} />
      </CalculatorSection>

      <CalculatorSection
        id="loan-tabs"
        eyebrow="افهم النتيجة"
        title="القرض ليس قسطاً شهرياً فقط"
        description="هذه التبويبات تلخص الجوانب التي قد تغفلها عند مقارنة العروض."
      >
        <Tabs defaultValue="components" className="calc-app">
          <TabsList className="tabs calc-tabs-list">
            <TabsTrigger value="components" className="tab calc-tabs-trigger">مكونات القرض</TabsTrigger>
            <TabsTrigger value="rates" className="tab calc-tabs-trigger">أنواع الفائدة</TabsTrigger>
            <TabsTrigger value="tips" className="tab calc-tabs-trigger">نصائح ذكية</TabsTrigger>
            <TabsTrigger value="cases" className="tab calc-tabs-trigger">حالات دراسية</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'الأصل',
                  description: 'المبلغ الذي تموله فعلياً بعد الدفعة المقدمة.',
                  content: 'هذا هو الجزء الذي يُسدد لصالح الجهة الممولة. كلما قل الأصل انخفضت الفوائد على المدى الطويل.',
                },
                {
                  title: 'الفوائد والرسوم',
                  description: 'التكلفة الإضافية فوق أصل القرض.',
                  content: 'الفائدة ترتبط بالمدة والنوع، أما الرسوم الإدارية والتأمين فقد تبدو صغيرة لكنها تؤثر في المقارنة النهائية بين العروض.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="rates" className="calc-tabs-panel">
            <div className="calc-table-wrap">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الجانب</TableHead>
                    <TableHead>ثابتة</TableHead>
                    <TableHead>متناقصة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>طريقة الحساب</TableCell>
                    <TableCell>تقريب مبسط على أصل القرض</TableCell>
                    <TableCell>على الرصيد المتبقي</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>أثر السداد المبكر</TableCell>
                    <TableCell>قد يختلف حسب العقد</TableCell>
                    <TableCell>أوضح وأسهل للقياس</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ما الذي تركز عليه؟</TableCell>
                    <TableCell>القسط الثابت وشروط التسوية</TableCell>
                    <TableCell>إجمالي الفوائد والزمن المتبقي</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="calc-tabs-panel">
            <CalculatorInfoGrid
              items={[
                {
                  title: 'لا تقترض عند الحد الأقصى دائماً',
                  content: 'حتى لو كانت الجهة الممولة تسمح بالنسبة، اترك هامشاً للمصاريف الطارئة والتغيرات في الدخل أو الالتزامات الأسرية.',
                },
                {
                  title: 'قارن إجمالي السداد',
                  content: 'بعض العروض تبدو مريحة شهرياً لكنها أغلى بكثير على المدى الطويل. استخدم تبويب المقارنة داخل الصفحة لتفادي هذا الخطأ.',
                },
                {
                  title: 'اقرأ شرط السداد المبكر',
                  content: 'إذا كنت تتوقع سداداً إضافياً مستقبلاً فهذه النقطة مهمة جداً، لأنها قد تغيّر أفضلية العرض بالكامل.',
                },
              ]}
            />
          </TabsContent>

          <TabsContent value="cases" className="calc-tabs-panel">
            <div className="calc-grid-2">
              <article className="calc-article-block">
                <h3>قرض سيارة</h3>
                <p>
                  سيارة بسعر 80,000 مع دفعة مقدمة 20,000 لمدة 5 سنوات تعطيك نموذجاً ممتازاً
                  لرؤية الفرق بين القسط المنخفض والرسوم الإضافية والتأمين.
                </p>
              </article>
              <article className="calc-article-block">
                <h3>تمويل عقاري</h3>
                <p>
                  في العقار غالباً يكون أثر المدة أكبر من أثر الفائدة الاسمية فقط. لهذا تساعدك
                  الرسوم البيانية في الصفحة على رؤية الرصيد المتبقي عبر السنوات.
                </p>
              </article>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorSection>

      <CalculatorSection
        id="loan-content"
        eyebrow="محتوى تعليمي"
        title="كيف تستخدم هذه الحاسبة بذكاء؟"
        description="الغرض من الصفحة ليس إعطاء رقم شهري فقط، بل مساعدتك على اتخاذ قرار تمويلي أهدأ وأوضح."
        subtle
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. ابدأ من القدرة الشهرية لا من المبلغ</h3>
            <p>
              كثير من الناس يسألون: كم يمكنني أن آخذ؟ لكن السؤال الأدق هو: كم أستطيع أن
              ألتزم به شهرياً دون ضغط زائد؟ لهذا أضفنا تبويب القدرة على الاقتراض مع نسبة الدين
              إلى الدخل.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. راقب المدة جيداً</h3>
            <p>
              إطالة المدة قد تخفض القسط الشهري، لكنها غالباً ترفع الفوائد الكلية بشكل ملحوظ.
              لذلك من الأفضل النظر إلى القسط والإجمالي معاً وليس إلى أحدهما فقط.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>3. قارن العروض على نفس الأساس</h3>
            <p>
              عند المقارنة ثبت العملة ومبلغ القرض والدفعة المقدمة والمدة قدر الإمكان، ثم غيّر
              الفائدة والرسوم فقط. بهذه الطريقة تعرف في السعودية أو الإمارات أو مصر أو المغرب أي
              عرض أرخص فعلاً بدل أن تنخدع بعرض يغيّر عدة عناصر دفعة واحدة.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>4. ضع السداد المبكر في الحسبان</h3>
            <ul>
              <li>إذا كنت تتوقع دخلًا إضافياً، اختبر سيناريوهات سداد مبكر مختلفة.</li>
              <li>راقب عدد الأشهر التي تختصرها، وليس التوفير المالي فقط.</li>
              <li>ارجع دائماً إلى شروط الجهة الممولة قبل اتخاذ القرار النهائي.</li>
            </ul>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="loan-faq"
        eyebrow="قبل اختيار التمويل"
        title="أسئلة متكررة قبل اختيار التمويل"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="loan-related"
        eyebrow="بعد القسط"
        title="أكمل التخطيط بحاسبات مرتبطة"
        description="افتح حاسبة واحدة فقط إذا كانت تكمل نفس القرار: ضريبة الفاتورة، نسبة الخصم، أو مستحقات العمل. الهدف أن تخرج بخطوة أوضح لا بفهرس جديد."
      >
        <RelatedCalculators currentSlug="monthly-installment" />
      </CalculatorSection>
    </main>
  );
}
