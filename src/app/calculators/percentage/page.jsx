import PercentageCalculator from '@/components/calculators/PercentageCalculator.client';
import {
  CalculatorChecklist,
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'percentage');

const faqItems = [
  {
    question: 'كيف أحسب 15% من مبلغ بسرعة؟',
    answer: 'حوّل 15% إلى 0.15 ثم اضربه في المبلغ، أو احسب 10% ثم أضف نصفها تقريباً. الصفحة تنفذ الحالتين فوراً دون الحاجة إلى خطوات ذهنية.',
  },
  {
    question: 'هل 20% خصم ثم 10% خصم يساوي 30%؟',
    answer: 'لا. الخصم الثاني يطبق على السعر المخفض بالفعل، لذلك يكون الخصم الفعلي أقل من 30%. استخدم أداة الخصومات المتتالية لرؤية الفرق بدقة.',
  },
  {
    question: 'ما الفرق بين 20% من 100 و20% زيادة على 100؟',
    answer: '20% من 100 تساوي 20 فقط، أما 20% زيادة على 100 فتعني أن النتيجة النهائية تصبح 120.',
  },
  {
    question: 'هل يمكن أن تكون النسبة أكثر من 100%؟',
    answer: 'نعم. إذا كان الجزء أكبر من الأساس أو إذا كانت الزيادة كبيرة بما يكفي، فقد تظهر النسبة أعلى من 100% وهذا أمر طبيعي حسابياً.',
  },
  {
    question: 'ما الفرق بين النسبة المئوية ونقطة مئوية؟',
    answer: 'النسبة المئوية تعبر عن التغير النسبي، أما النقطة المئوية فتعني الفرق المباشر بين نسبتين مثل الانتقال من 10% إلى 12% = نقطتان مئويتان.',
  },
];

const sectionNavItems = [
  { href: '#calculator-hero', label: 'الحاسبة', description: 'أربع حاسبات في تبويبات منفصلة' },
  { href: '#percent-overview', label: 'خريطة الصفحة', description: 'كل ما ستجده داخل الصفحة' },
  { href: '#percent-intents', label: 'نية البحث', description: 'أسئلة وكلمات طويلة الذيل' },
  { href: '#percent-examples', label: 'الاستخدامات', description: 'مجالات الحياة اليومية التي تخدمها الصفحة' },
  { href: '#percent-answers', label: 'إجابات مباشرة', description: 'كم يساوي X%؟ وكم نسبة X من Y؟' },
  { href: '#percent-content', label: 'الفهم العميق', description: 'الأخطاء الشائعة والحيل الذهنية' },
  { href: '#percent-playbook', label: 'خطة الحل', description: 'كيف تختار نوع المسألة الصحيح' },
  { href: '#percent-table', label: 'الجدول المرجعي', description: 'كسور ونسب وعشري' },
  { href: '#percent-faq', label: 'FAQ', description: 'الأسئلة الشائعة' },
];

const quickAnswers = [
  {
    question: 'كم يساوي 20% من 500؟',
    description: 'أبسط نية بحث مرتبطة بالخصومات والضرائب.',
    answer: '20% من 500 تساوي 100. داخل الصفحة يمكنك تنفيذ النوع نفسه على أي مبلغ فوراً من أول تبويب، مع أمثلة سريعة قابلة للنقر وتكرار النتائج في السجل.',
  },
  {
    question: 'كم نسبة 40 من 200؟',
    description: 'مفيد للعلامات والإنجاز والإحصاءات.',
    answer: '40 من 200 تساوي 20%. تبويب "كم نسبة X من Y؟" يعرض النتيجة أيضاً بشكل مرئي عبر شريط تقدم ليسهّل قراءة النسبة بسرعة.',
  },
  {
    question: 'ما المبلغ بعد خصم 25% من 1000؟',
    description: 'من أشهر تطبيقات النسبة في التسوق.',
    answer: 'بعد خصم 25% من 1000 يصبح المبلغ 750. تبويب الزيادة أو الخفض في الصفحة يفصل بين قيمة الخصم والنتيجة النهائية بدل إعطاء رقم واحد فقط.',
  },
  {
    question: 'ما نسبة التغيير من 100 إلى 150؟',
    description: 'تطبيق شائع في الربح والنمو والأسعار.',
    answer: 'الانتقال من 100 إلى 150 يعني زيادة 50%. تبويب نسبة التغيير يوضح أيضاً الفرق المطلق واتجاه التغير حتى لا تختلط الزيادة بالقيمة النهائية.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
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
    about: PAGE.keywords.slice(0, 8),
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
    name: 'كيفية استخدام حاسبة النسبة المئوية',
    description: 'خطوات سريعة لاختيار نوع مسألة النسبة المئوية المناسب وحلها بدقة.',
    step: [
      { '@type': 'HowToStep', name: 'حدد نوع السؤال', text: 'هل تريد نسبة من مبلغ؟ أم معرفة نسبة جزء من كل؟ أم زيادة أو خفض؟ أم نسبة التغيير؟' },
      { '@type': 'HowToStep', name: 'افتح التبويب المناسب', text: 'كل تبويب في الصفحة مخصص لنوع مختلف من المسائل حتى لا تختلط المعادلات.' },
      { '@type': 'HowToStep', name: 'أدخل القيم أو اختر مثالاً جاهزاً', text: 'يمكنك بدء الحساب يدوياً أو استخدام الأمثلة القابلة للنقر.' },
      { '@type': 'HowToStep', name: 'راجع النتيجة والفرق والمقارنة', text: 'بعض التبويبات تعرض قيمة التغير أو الخصم إلى جانب النتيجة النهائية لمزيد من الوضوح.' },
    ],
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="4 حاسبات في صفحة واحدة"
        title={PAGE.heroTitle}
        description="أداة عربية شاملة لحل مسائل النسبة اليومية: كم يساوي X% من مبلغ، كم نسبة X من Y، ما المبلغ بعد زيادة أو خفض، وما نسبة التغيير من قيمة إلى أخرى، مع أدوات إضافية مثل الخصومات المتتالية وتقسيم المبالغ."
        accent={PAGE.accent}
        highlights={[
          'أربع حاسبات أساسية في واجهة واحدة.',
          'أمثلة جاهزة تضخ الأرقام مباشرة داخل التبويب المناسب.',
          'سجل بسيط لأهم النتائج التي تريد الرجوع لها.',
        ]}
      >
        <PercentageCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="percent-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة نسبة مئوية شاملة تحل أكثر من نوع واحد من المسائل"
        description="بدلاً من حاسبة ضيقة لوظيفة واحدة، هذه الصفحة تجمع الحاسبة الأساسية مع أقسام تعليمية وأمثلة واستخدامات يومية وجداول مرجعية وأدوات إضافية."
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="percent-intents"
        eyebrow="تغطية بحثية"
        title="الكلمات والأسئلة التي تستهدفها الصفحة فعلياً"
        description="صفحة النسبة المئوية يجب أن تغطي عشرات الصيغ البحثية، لأن المستخدم قد يسألها بأكثر من طريقة: كم يساوي؟ كم نسبة؟ ما المبلغ بعد الزيادة؟ أو ما نسبة التغير؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={PAGE.keywords.slice(0, 10)} />
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
        title="أسئلة طويلة الذيل في النسبة المئوية"
        description="هذا القسم مكتوب خصيصاً لصيغ البحث التي يدخلها المستخدم كما هي تقريباً إلى Google."
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
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
        id="percent-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة تتكرر في الخصومات والدرجات والتغيرات"
      >
        <CalculatorFaqSection items={faqItems} />
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
