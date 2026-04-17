import Link from 'next/link';

import MonthlyInstallmentCalculator from '@/components/calculators/MonthlyInstallmentCalculator.client';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'monthly-installment');

const faqItems = [
  {
    question: 'ما الفرق بين الفائدة الثابتة والمتناقصة؟',
    answer: 'في النموذج المبسط هنا تمثل الفائدة الثابتة صورة مسطحة على أصل القرض، بينما المتناقصة تحسب على الرصيد المتبقي وتظهر أثر السداد المبكر بشكل أوضح.',
  },
  {
    question: 'هل يكفي النظر إلى القسط الشهري فقط؟',
    answer: 'لا. أحياناً يبدو القسط مريحاً لأن المدة طويلة، لكن إجمالي الفوائد يرتفع كثيراً. لهذا تعرض الصفحة القسط والتكلفة الكلية معاً.',
  },
  {
    question: 'كيف تؤثر الدفعة المقدمة؟',
    answer: 'كلما زادت الدفعة المقدمة انخفض أصل القرض، وبالتالي ينخفض القسط الشهري وإجمالي الفوائد. الحاسبة تخصمها مباشرة من مبلغ التمويل.',
  },
  {
    question: 'هل رسوم الإدارة والتأمين مهمة؟',
    answer: 'نعم، لأنها قد تغيّر ترتيب العروض حتى لو بدت الفائدة متقاربة. لذلك أضفنا الرسوم كمدخل مستقل لتقارن العروض بصورة أكثر واقعية.',
  },
  {
    question: 'هل السداد المبكر يوفّر دائماً؟',
    answer: 'في التمويل المتناقص يظهر التوفير بشكل واضح لأن الفائدة تقل مع انخفاض الرصيد. أما في التمويل الثابت فقد يختلف الأثر باختلاف عقد الجهة الممولة.',
  },
];

const sectionNavItems = [
  { href: '#calculator-hero', label: 'الحاسبة', description: 'إعداد القرض والرسوم ونوع الفائدة' },
  { href: '#loan-overview', label: 'خريطة الصفحة', description: 'تنقل سريع إلى أهم الأقسام' },
  { href: '#loan-intents', label: 'نية البحث', description: 'الأسئلة والكلمات المفتاحية المغطاة' },
  { href: '#loan-tabs', label: 'شرح القرض', description: 'المكونات والفوائد والنصائح' },
  { href: '#loan-answers', label: 'إجابات مباشرة', description: 'أسئلة مثل كم قسط 100 ألف؟' },
  { href: '#loan-content', label: 'شرح أعمق', description: 'كيف تستخدم الحاسبة للمقارنة فعلاً' },
  { href: '#loan-playbook', label: 'خطة قرار', description: 'كيف تختار عرضاً أقوى' },
  { href: '#loan-faq', label: 'FAQ', description: 'الأسئلة الشائعة' },
];

const quickAnswers = [
  {
    question: 'كم قسط قرض 100 ألف على 5 سنوات؟',
    description: 'من أشهر عمليات البحث طويلة الذيل.',
    answer: 'النتيجة تتغير بحسب الفائدة ونوعها والرسوم والدفعة المقدمة. لهذا لا نعرض رقماً ثابتاً مضللاً، بل نجعل الحاسبة نفسها تعطيك القسط وإجمالي الفوائد وجدول السداد على نفس المدخلات التي تختارها.',
  },
  {
    question: 'هل الفائدة المتناقصة أوفر من الثابتة؟',
    description: 'غالباً نعم في التكلفة الفعلية، لكن بشرط المقارنة الصحيحة.',
    answer: 'في كثير من السيناريوهات تكون الفائدة المتناقصة أوضح وأقرب للتكلفة الفعلية على الرصيد المتبقي، خصوصاً إذا كنت تفكر في سداد مبكر. لكن المقارنة يجب أن تشمل الرسوم والمدة لا النسبة المعلنة فقط.',
  },
  {
    question: 'كم يمكنني اقتراضه بناءً على راتبي؟',
    description: 'سؤال قرار لا سؤال فضول.',
    answer: 'تبويب القدرة على الاقتراض داخل الحاسبة يبدأ من القسط الشهري المريح ثم يحول الرقم إلى أصل تقريبي للقرض، مع قراءة نسبة الدين إلى الدخل حتى لا تنظر فقط إلى الحد الأقصى المتاح.',
  },
  {
    question: 'متى يفيد السداد المبكر؟',
    description: 'أهم نقطة بعد اختيار العرض.',
    answer: 'يفيد السداد المبكر عندما يختصر مدة القرض أو يخفّض الفوائد الكلية بشكل ملموس. في التمويل المتناقص يظهر الأثر مباشرة داخل الصفحة، بينما في الثابتة يجب قراءة شروط العقد بعناية أيضاً.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function MonthlyInstallmentPage() {
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
    name: 'كيفية حساب القسط الشهري للقرض',
    description: 'خطوات سريعة لمعرفة القسط الشهري وإجمالي الفوائد وتأثير السداد المبكر.',
    step: [
      { '@type': 'HowToStep', name: 'حدد مبلغ القرض', text: 'أدخل إجمالي التمويل ثم اطرح الدفعة المقدمة داخل الحاسبة.' },
      { '@type': 'HowToStep', name: 'اختر المدة ونوع الفائدة', text: 'المدة ونوع الفائدة هما أكبر عاملين في تكلفة القرض.' },
      { '@type': 'HowToStep', name: 'أضف الرسوم الأساسية', text: 'أدخل الرسوم الإدارية أو التأمين حتى تصبح المقارنة أقرب للواقع.' },
      { '@type': 'HowToStep', name: 'راجع القسط والإجمالي والسداد المبكر', text: 'لا تكتف بالقسط الشهري وحده؛ راقب إجمالي الفوائد وعدد الأشهر المختصرة عند السداد المبكر.' },
    ],
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="تمويل شخصي وعقاري"
        title={PAGE.heroTitle}
        description="احسب أقساط القروض الشخصية والعقارية وقروض السيارات بدقة أوضح، وقارن بين الفائدة الثابتة والمتناقصة، وشاهد جدول السداد وأثر السداد المبكر قبل اتخاذ القرار."
        accent={PAGE.accent}
        highlights={[
          'نتيجة شهرية مع إجمالي الفوائد والرسوم.',
          'جدول استهلاك ورسوم بيانية داخل الصفحة.',
          'تبويبات إضافية للسداد المبكر والقدرة على الاقتراض.',
        ]}
      >
        <MonthlyInstallmentCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="loan-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة تمويل كاملة وليست مجرد حاسبة قسط"
        description="استخدم هذه الخريطة للوصول بسرعة إلى الجزء الذي تحتاجه: الحساب، المقارنة، فهم الفائدة، الأسئلة المباشرة، أو خطوات اختيار العرض الأقوى."
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="loan-intents"
        eyebrow="تغطية بحثية"
        title="الكلمات والنيات التي تستهدفها الصفحة"
        description="الهدف ليس فقط الظهور لكلمة حاسبة القرض، بل تغطية الأسئلة العملية التي يبحث بها المستخدم قبل التقديم أو عند مقارنة عروض البنوك."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={PAGE.keywords.slice(0, 10)} />
          <CalculatorStoryBand
            title="ما الذي يجعل هذه الصفحة أقوى SEO وUX من الحاسبات البسيطة؟"
            description="بدلاً من نموذج واحد وصف صغير، تجمع الصفحة بين الحاسبة والجداول والرسوم والمقارنة والشرح، وهذا يزيد من عمق التغطية ونية المستخدم التي تخدمها الصفحة."
            items={[
              { label: 'نية قرار', value: 'القسط وحده لا يكفي، لذلك نغطي المقارنة والسداد المبكر والقدرة على الاقتراض.' },
              { label: 'نية تعليم', value: 'شرح الفرق بين الثابتة والمتناقصة موجود في الصفحة نفسها.' },
              { label: 'نية مقارنة', value: 'هناك جدول عروض ورسوم وجداول استهلاك بدل نتيجة رقمية معزولة.' },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="loan-tabs"
        eyebrow="افهم النتيجة"
        title="القرض ليس قسطاً شهرياً فقط"
        description="هذه التبويبات تلخص الجوانب التي يغفلها كثير من المستخدمين عند مقارنة العروض."
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
              <Table className="economy-table">
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
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">قرض سيارة</CardTitle>
                </CardHeader>
                <CardContent className="calc-card-copy">
                  سيارة بسعر 80,000 مع دفعة مقدمة 20,000 لمدة 5 سنوات تعطيك نموذجاً ممتازاً
                  لرؤية الفرق بين القسط المنخفض والرسوم الإضافية والتأمين.
                </CardContent>
              </Card>
              <Card className="calc-surface-card">
                <CardHeader>
                  <CardTitle className="calc-card-title">تمويل عقاري</CardTitle>
                </CardHeader>
                <CardContent className="calc-card-copy">
                  في العقار غالباً يكون أثر المدة أكبر من أثر الفائدة الاسمية فقط. لهذا تساعدك
                  الرسوم البيانية في الصفحة على رؤية الرصيد المتبقي عبر السنوات.
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorSection>

      <CalculatorSection
        id="loan-answers"
        eyebrow="إجابات مباشرة"
        title="أسئلة شائعة يبحث بها المستخدمون قبل أخذ التمويل"
        description="هذا القسم يخاطب نية البحث الطويلة مثل: كم قسط قرض 100 ألف؟ وهل الفائدة المتناقصة أوفر؟ ومتى يفيد السداد المبكر؟"
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
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
              عند المقارنة ثبت مبلغ القرض والدفعة المقدمة والمدة قدر الإمكان، ثم غيّر الفائدة
              والرسوم فقط. بهذه الطريقة تعرف أي عرض أرخص فعلاً بدل أن تنخدع بعرض يغيّر عدة
              عناصر دفعة واحدة.
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
        id="loan-playbook"
        eyebrow="خطة قرار"
        title="كيف تختار عرض التمويل الأقوى دون أن تنخدع بالقسط الأقل؟"
        description="هذا القسم مصمم للمستخدم الذي يقارن عرضين أو ثلاثة ويريد طريقة عملية للحسم."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorChecklist
            title="قائمة المقارنة الذكية"
            description="قبل اختيار أي عرض تمويلي، مر على هذه النقاط بالترتيب."
            items={[
              'ثبّت مبلغ القرض والدفعة المقدمة أولاً ثم ابدأ المقارنة.',
              'انظر إلى إجمالي السداد لا إلى القسط الشهري فقط.',
              'أدخل الرسوم والتأمين في الحاسبة حتى لا تقارن رقماً ناقصاً.',
              'اختبر سيناريو سداد مبكر إذا كنت تتوقع تحسن الدخل لاحقاً.',
              'راجع نسبة الدين إلى الدخل حتى لا يتحول القرض من أداة إلى ضغط شهري.',
            ]}
          />
          <CalculatorChecklist
            title="متى يكون العرض الأطول مفيداً؟"
            description="ليس دائماً الأسوأ."
            content="قد يكون العرض الأطول مناسباً إذا كانت الأولوية للسيولة الشهرية، لكن عليك أن تعرف مقدار ما تدفعه مقابل هذا الارتياح. لهذا تعرض الحاسبة القسط والإجمالي والرسم البياني معاً."
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="loan-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة قبل اختيار التمويل"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="loan-related"
        eyebrow="روابط داخلية"
        title="أكمل التخطيط بحاسبات مرتبطة"
      >
        <RelatedCalculators currentSlug="monthly-installment" />
      </CalculatorSection>

      <CalculatorSection
        id="loan-nav"
        eyebrow="التالي"
        title="بعد معرفة القسط، ماذا تحتاج أيضاً؟"
      >
        <Card className="calc-surface-card">
          <CardContent className="calc-cta-actions pt-6">
            <Button asChild className="btn btn-primary--flat calc-button">
              <Link href="/calculators/percentage">احسب نسبة الفائدة أو التغيير</Link>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/vat">راجع الضريبة على المشتريات</Link>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
