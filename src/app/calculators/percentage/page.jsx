import PercentageCalculator from '@/components/calculators/PercentageCalculator.client';
import {
  CalculatorChecklist,
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'percentage');
const CONTENT = getFinancePageContent('percentage');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.percentage);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function PercentagePage() {
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
    mainEntity: CONTENT.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: CONTENT.howTo.name,
    description: CONTENT.howTo.description,
    step: CONTENT.howTo.steps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        accent={PAGE.accent}
        highlights={CONTENT.hero.highlights}
      >
        <PercentageCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="percent-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة نسبة مئوية شاملة تحل أكثر من نوع واحد من المسائل"
        description="بدلاً من حاسبة ضيقة لوظيفة واحدة، هذه الصفحة تجمع الحاسبة الأساسية مع أقسام تعليمية وأمثلة واستخدامات يومية وجداول مرجعية وأدوات إضافية."
      >
        <CalculatorSectionNav items={CONTENT.sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-intents"
        eyebrow="تغطية بحثية"
        title="الكلمات والأسئلة التي تستهدفها الصفحة فعلياً"
        description="صفحة النسبة المئوية يجب أن تغطي عشرات الصيغ البحثية، لأن المستخدم قد يسألها بأكثر من طريقة: كم يساوي؟ كم نسبة؟ ما المبلغ بعد الزيادة؟ أو ما نسبة التغير؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={SEARCH_COVERAGE.intentChips} />
          <CalculatorStoryBand
            title="ميزة تنافسية واضحة: 4 حاسبات في تجربة واحدة"
            description="بدلاً من تحويل المستخدم بين أربع صفحات ضعيفة، صممنا هذه الصفحة كمركز واحد لمسائل النسبة المئوية الأكثر شيوعاً، مع أمثلة جاهزة وسجل نتائج وأدوات مكمّلة."
            items={[
              { label: 'نسبة من مبلغ', value: 'للخصومات والضريبة والإكراميات والتوزيع.' },
              { label: 'جزء من كل', value: 'للدراسة والإحصاء ونسب الإنجاز والنجاح.' },
              { label: 'زيادة أو خفض', value: 'للأسعار والرواتب والعروض والتضخم.' },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-examples"
        eyebrow="استخدامات يومية"
        title="أين نستخدم النسبة المئوية فعلياً؟"
        description="من الخصومات والرواتب إلى العلامات الدراسية والاستثمار، النسبة المئوية أداة يومية أكثر مما نظن."
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'التسوق والخصومات',
              content: 'خصم 30% على منتج، أو ضريبة على فاتورة، أو مقارنة بين سعرين قبل وبعد التخفيض. هذه الحالات يغطيها تبويبا النسبة من مبلغ والزيادة أو الخفض.',
            },
            {
              title: 'الدراسة والنتائج',
              content: 'إذا حصلت على 85 من 100 أو 42 من 50 وتريد معرفة النسبة، فتبويب "كم نسبة X من Y؟" يعطيك النتيجة فوراً.',
            },
            {
              title: 'الاستثمار والأسعار',
              content: 'حين يرتفع أصل من 100 إلى 120 أو ينخفض من 80 إلى 60، يوضح تبويب نسبة التغيير مقدار النمو أو الانكماش بوضوح.',
            },
            {
              title: 'الميزانية والتقسيم',
              content: 'يمكنك توزيع راتب أو ميزانية مشروع بنسبة 50/30/20 مثلاً باستخدام أداة تقسيم المبلغ بالنسب أسفل الحاسبة الرئيسية.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="percent-answers"
        eyebrow="إجابات مباشرة"
        title="إذا كتبت في Google: كم يساوي 20% من 500؟"
        description="هذا القسم مكتوب خصيصاً لصيغ البحث التي يدخلها المستخدم كما هي تقريباً إلى Google."
      >
        <CalculatorQuickAnswerGrid items={CONTENT.quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-content"
        eyebrow="فهم أعمق"
        title="أخطاء شائعة وحيل مفيدة"
        description="هذه المفاهيم الصغيرة هي التي تجعل النسبة المئوية مربكة أحياناً، رغم أن قواعدها الأساسية بسيطة جداً."
        subtle
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. زيادة 50% ثم خفض 50% لا تعيدك لنفس الرقم</h3>
            <p>
              لأن النسبة الثانية تطبق على أساس جديد. إذا ارتفع 100 إلى 150 ثم خفضت 50% من 150
              فستصل إلى 75، لا إلى 100.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. 10% أسهل مما يبدو</h3>
            <p>
              احسب 10% بتحريك الفاصلة منزلة واحدة، ثم ابنِ عليها: 5% نصفها، 1% جزء من عشرة،
              و15% = 10% + 5%. هذا يختصر كثيراً من الحسابات الذهنية اليومية.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>3. النسبة ليست دائماً مبلغاً</h3>
            <p>
              أحياناً تحتاج رقمًا نقديًا مثل 15% من 500، وأحياناً تحتاج نسبة فقط مثل 40 من 200.
              لهذا فصلنا كل حالة في تبويب مستقل بدل دمجها داخل نموذج واحد يربك المستخدم.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>4. لماذا أضفنا أدوات إضافية؟</h3>
            <ul>
              <li>الخصومات المتتالية تكشف الفرق بين الخصم الاسمي والخصم الفعلي.</li>
              <li>تقسيم المبلغ بالنسب مفيد للميزانيات والادخار وتوزيع الأرباح.</li>
              <li>التغيرات المتعددة توضح أثر الزيادات والانخفاضات المتتابعة على المدى الزمني.</li>
            </ul>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-playbook"
        eyebrow="خطة الحل"
        title="كيف تعرف أي تبويب تستخدمه في ثوانٍ؟"
        description="كثير من الالتباس في النسبة المئوية سببه اختيار المعادلة الخطأ. هذه القائمة تساعدك على تحديد نوع المسألة قبل أن تبدأ."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorChecklist
            title="اختر التبويب الصحيح"
            description="سؤال واحد من هذه الأسئلة يكفي لتحديد المسار الصحيح."
            items={[
              'إذا كنت تسأل: كم يساوي 15% من مبلغ؟ فابدأ بتبويب نسبة من مبلغ.',
              'إذا كنت تسأل: كم نسبة 42 من 60؟ فتبويب جزء من كل هو الصحيح.',
              'إذا كنت تريد السعر بعد خصم أو زيادة فاذهب إلى تبويب الزيادة أو الخفض.',
              'إذا كنت تقارن قيمة قديمة بأخرى جديدة فتبويب نسبة التغيير هو المطلوب.',
              'إذا كانت هناك أكثر من خصم أو أكثر من تغير فاستخدم الأدوات الإضافية أسفل الحاسبة.',
            ]}
          />
          <CalculatorChecklist
            title="متى تصبح الأداة الإضافية أهم من الحاسبة الرئيسية؟"
            description="عند الخصومات المتعددة أو تقسيم الميزانيات أو التغيرات المركبة."
            content="بعض المسائل اليومية لا يكفيها تبويب واحد، مثل خصم 20% ثم 10%، أو تقسيم مبلغ بين ثلاث نسب، أو سلسلة ارتفاع وانخفاض متتابعة. لذلك أضفنا أدوات مكمّلة في نفس الصفحة بدل تشتيت المستخدم."
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-table"
        eyebrow="مرجع سريع"
        title="جدول تحويلات مفيد للحساب الذهني"
      >
        <div className="calc-table-wrap">
          <Table className="economy-table">
            <TableHeader>
              <TableRow>
                <TableHead>النسبة</TableHead>
                <TableHead>الكسر</TableHead>
                <TableHead>العشري</TableHead>
                <TableHead>الاستخدام الشائع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>50%</TableCell>
                <TableCell>1/2</TableCell>
                <TableCell>0.50</TableCell>
                <TableCell>النصف</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>25%</TableCell>
                <TableCell>1/4</TableCell>
                <TableCell>0.25</TableCell>
                <TableCell>الربع</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>20%</TableCell>
                <TableCell>1/5</TableCell>
                <TableCell>0.20</TableCell>
                <TableCell>الخُمس</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>10%</TableCell>
                <TableCell>1/10</TableCell>
                <TableCell>0.10</TableCell>
                <TableCell>أسهل نسبة للحساب الذهني</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>5%</TableCell>
                <TableCell>1/20</TableCell>
                <TableCell>0.05</TableCell>
                <TableCell>نصف الـ10%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="percent-guides"
        eyebrow="أدلة مرتبطة"
        title="متى تحتاج شرحًا قبل الحاسبة؟"
        description="هذه الأدلة تساعد المستخدم الذي يريد فهم الخصومات ونسبة التغير والنقاط المئوية قبل الانتقال إلى التبويب الصحيح داخل الحاسبة."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة تتكرر في الخصومات والدرجات والتغيرات"
      >
        <CalculatorFaqSection items={CONTENT.faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-related"
        eyebrow="روابط داخلية"
        title="حاسبات مرتبطة بالنسب والتسعير"
      >
        <RelatedCalculators currentSlug="percentage" />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
