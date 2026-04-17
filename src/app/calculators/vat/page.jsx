import Link from 'next/link';

import VatCalculator from '@/components/calculators/VatCalculator.client';
import VatRatesTable from '@/components/calculators/VatRatesTable.client';
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
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'vat');

const faqItems = [
  {
    question: 'ما الفرق بين السعر الشامل وغير الشامل؟',
    answer: 'السعر غير الشامل يعني أن الضريبة ستضاف فوقه، بينما السعر الشامل يتضمن الضريبة داخله ويحتاج استخراجاً لمعرفة الجزء الأصلي وقيمة الضريبة.',
  },
  {
    question: 'هل نسبة الضريبة واحدة لكل السلع؟',
    answer: 'لا دائماً. الصفحة تستخدم المعدل العام الشائع في كل دولة، لكن بعض السلع والخدمات قد تكون معفاة أو صفرية أو خاضعة لنسب مختلفة.',
  },
  {
    question: 'كيف أتعامل مع ضريبة الشهر؟',
    answer: 'اجمع ضريبة المخرجات على المبيعات ثم اطرح منها ضريبة المدخلات على المشتريات القابلة للخصم. الحاسبة تعرض الفرق مباشرة وتوضح إن كان صافي المبلغ مستحقاً أو قابلاً للاسترداد.',
  },
  {
    question: 'هل هذه الصفحة بديل عن الإقرار الضريبي؟',
    answer: 'لا، هي أداة تقديرية سريعة. الإقرار الضريبي الفعلي يعتمد على قيود محاسبية وفواتير صحيحة وحالات استثناء وتعليمات تنفيذية محلية.',
  },
  {
    question: 'ما حد التسجيل الإلزامي في السعودية؟',
    answer: 'المرجع الرسمي لدى هيئة الزكاة والضريبة والجمارك يذكر حد التسجيل الإلزامي عند 375,000 ريال للتوريدات الخاضعة خلال 12 شهراً في القاعدة العامة.',
  },
];

const sectionNavItems = [
  { href: '#calculator-hero', label: 'الحاسبة', description: 'إضافة الضريبة واستخراجها وصافي الشهر' },
  { href: '#vat-overview', label: 'خريطة الصفحة', description: 'اختصر الوصول إلى القسم المطلوب' },
  { href: '#vat-intents', label: 'نية البحث', description: 'الأسئلة والكلمات الطويلة المغطاة' },
  { href: '#vat-rates', label: 'الجدول التفاعلي', description: 'مقارنة النسب العامة بين الدول' },
  { href: '#vat-answers', label: 'إجابات مباشرة', description: 'مثل كم ضريبة 1000 ريال؟' },
  { href: '#vat-learning', label: 'فهم الأساس', description: 'متى تضيف ومتى تستخرج' },
  { href: '#vat-details', label: 'تفاصيل عملية', description: 'معادلات وملاحظات مهمة' },
  { href: '#vat-playbook', label: 'دليل التحقق', description: 'قبل اعتماد أي رقم محاسبياً' },
  { href: '#vat-faq', label: 'FAQ', description: 'الأسئلة الشائعة' },
];

const quickAnswers = [
  {
    question: 'كم ضريبة 1000 ريال عند 15%؟',
    description: 'من أكثر الأسئلة المباشرة شيوعاً.',
    answer: 'الضريبة في هذا المثال تساوي 150 ريالاً، والإجمالي 1150 ريالاً. لكن الصفحة لا تتوقف هنا؛ فهي تسمح لك أيضاً باستخراج الضريبة إذا كان 1150 هو الرقم الذي تملكه أصلاً.',
  },
  {
    question: 'كيف أحسب الضريبة من مبلغ شامل؟',
    description: 'الخطأ الشائع هو ضرب الإجمالي مباشرة في النسبة.',
    answer: 'إذا كان السعر شاملاً للضريبة فلا يكفي أن تضربه في 15% أو 5%. يجب أولاً استخراج الأساس بقسمة المبلغ على 1 + نسبة الضريبة، ثم يظهر لك الجزء الضريبي الصحيح تلقائياً داخل الصفحة.',
  },
  {
    question: 'ما الفرق بين شامل وغير شامل الضريبة؟',
    description: 'فهم هذا الفرق يزيل أغلب الالتباس.',
    answer: 'غير شامل يعني أن الضريبة ستضاف فوق السعر الأصلي، بينما شامل يعني أن الضريبة متضمنة داخل الرقم النهائي. الحاسبة تفصل بين الحالتين حتى لا تختلط المعادلتان على المستخدم.',
  },
  {
    question: 'كيف أحسب صافي ضريبة الشهر؟',
    description: 'مفيد للتجار والمنشآت الصغيرة.',
    answer: 'ابدأ بضريبة المخرجات على المبيعات ثم اطرح منها ضريبة المدخلات على المشتريات. إذا كان الناتج موجباً فهو مستحق، وإذا كان سالباً فهو رصيد قابل للاسترداد أو الترحيل بحسب الحالة والتنظيم المحلي.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function VatPage() {
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
    name: 'كيفية حساب ضريبة القيمة المضافة',
    description: 'خطوات سريعة لإضافة ضريبة القيمة المضافة أو استخراجها أو معرفة صافي ضريبة الشهر.',
    step: [
      { '@type': 'HowToStep', name: 'اختر الدولة أو النسبة', text: 'ابدأ بالمعدل العام الذي تنطبق عليه العملية الحسابية.' },
      { '@type': 'HowToStep', name: 'اختر نوع العملية', text: 'حدد إن كنت تريد إضافة الضريبة أو استخراجها أو احتساب صافي الفترة.' },
      { '@type': 'HowToStep', name: 'أدخل المبلغ بالشكل الصحيح', text: 'انتبه هل الرقم شامل الضريبة أم غير شامل حتى تستخدم المعادلة المناسبة.' },
      { '@type': 'HowToStep', name: 'راجع التفصيل وليس الرقم النهائي فقط', text: 'الصفحة تعرض الأساس والضريبة والإجمالي حتى تعرف كيف وصلت النتيجة.' },
    ],
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge="VAT / TVA"
        title={PAGE.heroTitle}
        description="أضف الضريبة أو استخرجها من الفاتورة بسرعة، واحسب صافي ضريبة الشهر للشركات الصغيرة، ثم قارن بين النسب العامة الشائعة في عدد من الدول العربية من نفس الصفحة."
        accent={PAGE.accent}
        highlights={[
          '3 أوضاع: إضافة، استخراج، وصافي ضريبة الشهر.',
          'أداتان إضافيتان: خصم ثم ضريبة، وهامش ربح ثم ضريبة.',
          'جدول مقارنة تفاعلي للنسب العامة في عدة دول عربية.',
        ]}
      >
        <VatCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="vat-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة ضريبة متقدمة تخدم الفاتورة والتسعير والالتزام الشهري"
        description="هذه الخريطة تساعدك على الوصول مباشرة إلى الحاسبة أو مقارنة الدول أو الإجابات السريعة أو قائمة التحقق قبل استخدام الرقم في التسعير أو المراجعة المحاسبية."
      >
        <CalculatorSectionNav items={sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-intents"
        eyebrow="تغطية بحثية"
        title="الكلمات المفتاحية والنية العملية التي تغطيها الصفحة"
        description="الصفحة لا تستهدف كلمة VAT calculator فقط، بل تغطي أيضاً أسئلة مثل: كم ضريبة 1000 ريال؟ كيف أستخرج الضريبة من فاتورة؟ وما الفرق بين شامل وغير شامل؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={PAGE.keywords.slice(0, 10)} />
          <CalculatorStoryBand
            title="لماذا تحتاج هذه الصفحة أكثر من آلة حاسبة عادية؟"
            description="لأن المستخدم الضريبي ليس نوعاً واحداً: هناك من يسعّر منتجاً، ومن يراجع فاتورة، ومن يغلق فترة شهرية. لهذا صممت الصفحة لتخدم أكثر من مهمة حقيقية داخل نفس التجربة."
            items={[
              { label: 'تسعير', value: 'أضف الضريبة على سعر أساسي بسرعة واعرف الإجمالي النهائي.' },
              { label: 'مراجعة فاتورة', value: 'استخرج الأساس والضريبة من مبلغ شامل دون خطأ شائع.' },
              { label: 'إغلاق فترة', value: 'احسب صافي ضريبة الشهر بين المخرجات والمدخلات في نفس الصفحة.' },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-rates"
        eyebrow="مقارنة سريعة"
        title="مقارنة النسب العامة الشائعة بين الدول"
        description="الجدول التالي مفيد عند تجهيز عرض سعر أو مقارنة أسواق متعددة. تذكر دائماً أن بعض القطاعات تخضع لنسب أو إعفاءات مختلفة."
      >
        <VatRatesTable />
      </CalculatorSection>

      <CalculatorSection
        id="vat-answers"
        eyebrow="إجابات مباشرة"
        title="أسئلة طويلة الذيل مرتبطة بالفواتير والضريبة 15%"
        description="إجابات مكتوبة بلغة واضحة على الأسئلة التي يدخل بها المستخدم مباشرة إلى محركات البحث."
      >
        <CalculatorQuickAnswerGrid items={quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-learning"
        eyebrow="فهم الأساس"
        title="كيف تقرأ الضريبة بشكل صحيح؟"
        description="هذه الصفحة تساعدك على التفريق بين ثلاثة أسئلة مختلفة: إضافة الضريبة على سعر، استخراجها من إجمالي، أو معرفة صافي المستحق في نهاية الفترة."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'إضافة الضريبة',
              description: 'متى تستخدمها؟',
              content: 'إذا كان لديك سعر قبل الضريبة وتريد معرفة قيمة الضريبة والإجمالي النهائي للفاتورة. هذا هو السيناريو الأشهر في التسعير والعروض.',
            },
            {
              title: 'استخراج الضريبة',
              description: 'متى تستخدمه؟',
              content: 'إذا وصلتك فاتورة شاملة الضريبة وتريد معرفة الجزء الأصلي من السعر بدقة دون أن تقع في خطأ ضرب الإجمالي مباشرة في النسبة.',
            },
            {
              title: 'ضريبة الشهر',
              description: 'للمنشآت الصغيرة والمتاجر',
              content: 'الفكرة الأساسية هي طرح ضريبة المدخلات من ضريبة المخرجات. الحاسبة هنا تختصر الخطوة الأولى قبل الانتقال إلى القيد المحاسبي والإقرار الرسمي.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="vat-details"
        eyebrow="مرجع عملي"
        title="نقاط يجب الانتباه لها قبل الاعتماد على الرقم"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. المعدل العام لا يغطي كل الحالات</h3>
            <p>
              بعض القطاعات قد تكون معفاة أو صفرية أو خاضعة لمعاملة مختلفة. لذلك نحن نستخدم المعدل
              القياسي العام لتسريع الفهم، لا لإلغاء الحاجة إلى مراجعة الفاتورة أو اللائحة الخاصة
              بقطاعك.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. التسجيل والإقرار مساران مختلفان عن الحساب الفردي</h3>
            <p>
              حتى لو كنت تعرف كيف تضيف الضريبة أو تستخرجها، يبقى التسجيل والإقرار والمتطلبات
              الشكلية مسؤولية منفصلة. في السعودية مثلاً يظل حد التسجيل الإلزامي المذكور رسمياً
              نقطة مرجعية مهمة عند تقييم وضع المنشأة.
            </p>
          </article>
        </div>

        <div className="calc-table-wrap">
          <Table className="economy-table">
            <TableHeader>
              <TableRow>
                <TableHead>الحالة</TableHead>
                <TableHead>المعادلة السريعة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>إضافة الضريبة</TableCell>
                <TableCell>المبلغ × (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استخراج الضريبة</TableCell>
                <TableCell>المبلغ الشامل ÷ (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>صافي ضريبة الشهر</TableCell>
                <TableCell>ضريبة المخرجات - ضريبة المدخلات</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-playbook"
        eyebrow="دليل تحقق"
        title="قبل أن تعتمد الرقم في التسعير أو المراجعة"
        description="الحساب الصحيح يبدأ بالسؤال الصحيح: هل الرقم شامل أم غير شامل؟ وهل النسبة التي تستخدمها هي النسبة العامة فعلاً على حالتك؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorChecklist
            title="قائمة التحقق الضريبية"
            description="قائمة سريعة مفيدة قبل اعتماد أي نتيجة من الصفحة."
            items={[
              'حدد أولاً هل المبلغ الذي لديك شامل الضريبة أم قبل الضريبة.',
              'تحقق من النسبة العامة المعمول بها في الدولة أو القطاع المستهدف.',
              'لا تستخدم المعدل العام إذا كانت حالتك تتعلق بإعفاء أو نسبة مختلفة أو معالجة خاصة.',
              'في صافي ضريبة الشهر، تأكد أن المدخلات قابلة للخصم فعلاً قبل طرحها من المخرجات.',
              'اعتمد على الجهة الرسمية أو المستشار المحاسبي عند الإقرار أو التسجيل أو الحالات غير القياسية.',
            ]}
          />
          <CalculatorChecklist
            title="متى تكون هذه الصفحة كافية؟"
            description="عند التسعير السريع والفهم الأولي والمراجعة الأولية."
            content="إذا كنت تريد فهم الفاتورة أو حساب رقم سريع أو تجهيز عرض سعر، فالصفحة ممتازة. أما إذا كنت تتعامل مع تسجيل ضريبي أو إقرار رسمي أو استثناءات قطاعية، فانتقل بعد ذلك إلى المرجع الرسمي أو المختص."
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-official-links"
        eyebrow="مصادر مرجعية"
        title="مراجع رسمية مفيدة"
        description="إذا كنت تحتاج رقمًا نهائياً للاعتماد الإداري أو المحاسبي، راجع الجهة المختصة في دولتك."
      >
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">روابط مرجعية</CardTitle>
          </CardHeader>
          <CardContent className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://zatca.gov.sa/" target="_blank" rel="noreferrer">هيئة الزكاة والضريبة والجمارك</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://tax.gov.ae/" target="_blank" rel="noreferrer">الهيئة الاتحادية للضرائب - الإمارات</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.nbr.gov.bh/" target="_blank" rel="noreferrer">الجهاز الوطني للإيرادات - البحرين</a>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorSection
        id="vat-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول الضريبة والفواتير"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-related"
        eyebrow="روابط داخلية"
        title="حاسبات مرتبطة بالتسعير والربحية"
      >
        <RelatedCalculators currentSlug="vat" />
      </CalculatorSection>

      <CalculatorSection
        id="vat-next"
        eyebrow="التالي"
        title="أكمل حساباتك"
      >
        <Card className="calc-surface-card">
          <CardContent className="calc-cta-actions pt-6">
            <Button asChild className="btn btn-primary--flat calc-button">
              <Link href="/calculators/percentage">احسب النسبة المئوية للضريبة أو الخصم</Link>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/monthly-installment">انتقل إلى حاسبة القسط الشهري</Link>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
