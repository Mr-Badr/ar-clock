import Link from 'next/link';
import { ArrowLeft, BadgePercent, BriefcaseBusiness, CreditCard, ReceiptText } from 'lucide-react';

import {
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CALCULATOR_HUBS,
  getCalculatorHubBySlug,
  getCalculatorRoutesByCluster,
} from '@/lib/calculators/data';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const FINANCE_HUB = getCalculatorHubBySlug('finance');
const FINANCE_ROUTES = getCalculatorRoutesByCluster('finance');
const FINANCE_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.financeHub);

const FINANCE_ICONS = {
  'end-of-service-benefits': BriefcaseBusiness,
  'monthly-installment': CreditCard,
  vat: ReceiptText,
  percentage: BadgePercent,
};
const FINANCE_RETURN_PATHS = [
  {
    href: '/calculators/monthly-installment',
    title: 'كم قسط قرض 100 ألف؟',
    description: 'مسار قرار تمويلي يومي يعرض القسط وإجمالي الفوائد والسداد المبكر بدلاً من رقم شهري معزول.',
  },
  {
    href: '/calculators/vat',
    title: 'كم ضريبة 1000 ريال عند 15%؟',
    description: 'مناسب للتاجر وصاحب الفاتورة ومن يريد إضافة الضريبة أو استخراجها بسرعة من نفس الصفحة.',
  },
  {
    href: '/calculators/percentage',
    title: 'كم يساوي 20% من 500؟',
    description: 'يخدم الخصومات والزيادات ونسبة التغيير والأسئلة العامة المرتبطة بالبروسنت.',
  },
  {
    href: '/calculators/end-of-service-benefits',
    title: 'كم مكافأة نهاية الخدمة بعد 5 سنوات؟',
    description: 'صفحة عالية النية للسوق السعودي تجمع الحاسبة مع الشرح والمقارنة بين الاستقالة ونهاية العقد.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'ما الذي ستجده داخل قسم حاسبات المال والعمل؟',
    answer: 'ستجد حاسبات القسط الشهري، وضريبة القيمة المضافة، والنسبة المئوية، ومكافأة نهاية الخدمة في بوابة واحدة مع روابط مباشرة إلى كل أداة.',
  },
  {
    question: 'هل هذا القسم موجه فقط للسعودية؟',
    answer: 'ليس كله. حاسبة نهاية الخدمة موجهة للسعودية تحديداً، بينما القسط والضريبة والنسبة المئوية تخدم مستخدمين في دول عربية متعددة مع أمثلة واضحة.',
  },
  {
    question: 'لماذا يحتاج هذا القسم إلى صفحة مستقلة؟',
    answer: 'لأن كثيراً من المستخدمين يبحثون عن حاسبات المال والعمل كفئة كاملة، وليس عن أداة واحدة فقط. وجود صفحة جامعة يسهّل الاكتشاف والفهرسة والانتقال بين الأدوات المرتبطة.',
  },
  {
    question: 'أي صفحة أبدأ بها إذا كنت أقارن قرضاً أو تمويلاً؟',
    answer: 'ابدأ من حاسبة القسط الشهري إذا كان سؤالك عن مبلغ التمويل والدفعة والفائدة، ثم انتقل إلى النسبة المئوية إذا أردت فهم نسب التغير أو الخصم أو الزيادة.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبات المال والعمل | القسط والضريبة ونهاية الخدمة والنسبة',
  description:
    'ابدأ من أقوى الحاسبات المالية التي يبحث عنها المستخدم العربي: كم قسط القرض؟ كم الضريبة 15%؟ كم مكافأة نهاية الخدمة؟ وكم تساوي النسبة المئوية؟',
  keywords: [
    ...FINANCE_HUB.keywords,
    ...FINANCE_ROUTES.flatMap((item) => item.keywords),
  ],
  url: `${SITE_URL}${FINANCE_HUB.href}`,
});

export default function FinanceCalculatorsHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات المال والعمل',
    url: `${SITE_URL}${FINANCE_HUB.href}`,
    inLanguage: 'ar',
    description: FINANCE_HUB.description,
    isPartOf: `${SITE_URL}/calculators`,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: FINANCE_ROUTES.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبات المال والعمل', item: `${SITE_URL}${FINANCE_HUB.href}` },
    ],
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <CalculatorHero
        badge="مال / عمل"
        title="كم القسط؟ كم الضريبة؟ كم مكافأة نهاية الخدمة؟ ابدأ من هنا"
        description="هذه الصفحة تجمع الحاسبات التي تمس القرارات اليومية الأكثر حساسية للمستخدم العربي: التمويل، الضريبة، النسب، ومستحقات نهاية الخدمة. بدل أن يفتح الزائر أدوات متفرقة، يبدأ من صفحة واحدة توضّح له أين يذهب بحسب سؤاله الفعلي."
        accent={FINANCE_HUB.accent}
        highlights={[
          'قسم مبني حول أسئلة مالية يبحث بها الناس فعلاً، لا حول أسماء أدوات جامدة فقط.',
          'كل صفحة فرعية تعطي نتيجة سريعة ثم توسّع الفهم بشرح وأمثلة وروابط مرتبطة.',
          'مفيد للموظف، وصاحب المتجر، والباحث عن قرض، وكل من يحتاج قراراً أسرع وأوضح.',
        ]}
      >
        <CalculatorIntentCloud
          title="أقوى نيات البحث داخل هذا القسم"
          items={[
            'كم قسط قرض 100 ألف',
            'كم ضريبة 1000 ريال عند 15%',
            'كم مكافأة نهاية الخدمة بعد 5 سنوات',
            'كم يساوي 20% من 500',
            'حاسبات مالية بالعربي',
            'حساب القرض والضريبة والنسبة',
          ]}
        />
      </CalculatorHero>

      <CalculatorSection
        id="finance-hub-map"
        eyebrow="خريطة القسم"
        title="ابدأ من السؤال الذي كتبه المستخدم في Google"
        description="كل بطاقة هنا مبنية على صيغة بحث عربية مباشرة. هذا يجعل الصفحة أوضح للمستخدم وأسهل على Google في فهم العلاقة بين القسم والأدوات الفرعية."
      >
        <CalculatorSectionNav
          items={[
            { href: '#finance-tools', label: 'الأدوات', description: 'القرض والضريبة والنسبة ونهاية الخدمة' },
            { href: '#finance-answers', label: 'إجابات سريعة', description: 'أسئلة يكررها المستخدمون قبل النقر' },
            { href: '#finance-cases', label: 'سيناريوهات عملية', description: 'كيف يخدم القسم مواقف الحياة والعمل' },
            { href: '#finance-faq', label: 'الأسئلة الشائعة', description: 'متى أستخدم كل أداة؟' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-tools"
        eyebrow="الأدوات الأساسية"
        title="أربع صفحات قوية بدل صفحة مالية عامة وضعيفة"
        description="بدلاً من صفحة فضفاضة تتكلم عن المال بشكل عام، يقودك هذا القسم إلى أدوات متخصصة لها نية بحث واضحة وقابلة للنمو في النتائج."
        subtle
      >
        <div className="calc-related-grid">
          {FINANCE_ROUTES.map((item) => {
            const Icon = FINANCE_ICONS[item.slug] || CreditCard;

            return (
              <Card key={item.slug} className="calc-surface-card calc-related-card card-hover">
                <CardHeader>
                  <div
                    className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border"
                    style={{
                      background: item.accentSoft,
                      borderColor: 'var(--border-accent)',
                      color: item.accent,
                    }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <CardTitle className="calc-card-title">{item.title}</CardTitle>
                  <CardDescription className="calc-card-description">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button">
                    افتح الصفحة
                    <ArrowLeft size={16} />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="finance-answers"
        eyebrow="إجابات سريعة"
        title="ما الذي ينتظره الزائر قبل أن يختار الأداة؟"
        description="هذه الأسئلة لا تستبدل الحاسبات نفسها، لكنها توضّح لزائر Google أنه وصل إلى المكان الصحيح من أول شاشة."
      >
        <CalculatorQuickAnswerGrid
          items={[
            {
              question: 'أريد معرفة قسط قرض بسرعة، أين أبدأ؟',
              description: 'عندما يكون القرار متعلقاً بتمويل أو سيارة أو منزل',
              answer: 'ابدأ من حاسبة القسط الشهري لأنها تعرض القسط، وإجمالي الفوائد، وأثر المدة، والدفعة المقدمة، والسداد المبكر في صفحة واحدة.',
            },
            {
              question: 'أريد فقط حساب الضريبة من فاتورة أو إضافة 15%، ماذا أفعل؟',
              description: 'أكثر أسئلة VAT شيوعاً في الخليج',
              answer: 'استخدم حاسبة الضريبة لأنها تعطيك إضافة الضريبة واستخراجها من السعر الشامل، مع توضيح الفرق بين شامل الضريبة وغير شاملها.',
            },
            {
              question: 'لدي خصم أو زيادة أو نسبة تغير، هل أذهب لحاسبة الضريبة أم النسبة؟',
              description: 'تمييز مهم بين صفحتين قريبتين',
              answer: 'إذا كان السؤال عاماً عن نسبة مئوية أو خصم أو تغير سعر، فحاسبة النسبة المئوية هي الأنسب. أما إذا كان السؤال عن VAT أو TVA تحديداً فابدأ بحاسبة الضريبة.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-cases"
        eyebrow="سيناريوهات استخدام"
        title="هذا القسم يخدم قرارات حقيقية، لا مجرد عمليات حساب"
        description="كل أداة هنا مرتبطة بموقف فعلي يمكن أن يدفع المستخدم إلى البحث ثم النقر ثم العودة مرة أخرى."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'موظف يراجع استقالته أو نهاية عقده',
              description: 'نية مالية حساسة وعالية القيمة',
              content: 'يحتاج إلى رقم تقريبي واضح لمكافأة نهاية الخدمة قبل أن يراجع القرار أو يتحدث مع جهة العمل. هذه النية من أقوى نيات البحث في سوق العمل السعودي.',
            },
            {
              title: 'مستخدم يقارن قرضاً شخصياً أو عقارياً',
              description: 'قبل القرار وليس بعده',
              content: 'لا يبحث فقط عن رقم القسط، بل عن أثر المدة والفائدة والدفعة المقدمة على ميزانيته الشهرية، لذلك صفحة القسط الشهري يجب أن تكون محطة قرار حقيقية.',
            },
            {
              title: 'تاجر أو مسوّق أو صاحب فاتورة',
              description: 'سؤال يومي ومتكرر',
              content: 'يحتاج إلى إضافة الضريبة أو استخراجها بسرعة، وغالباً يريد فرق السعر الشامل وغير الشامل دون الذهاب إلى ملف Excel أو آلة حاسبة يدوية.',
            },
            {
              title: 'مستخدم يريد خصماً أو زيادة أو نسبة نجاح',
              description: 'أداة يومية ذات استعمال واسع',
              content: 'صفحة النسبة المئوية مهمة لأنها لا تخدم التجارة فقط، بل تخدم التسعير، التعليم، التغيير بين رقمين، وتقسيم المبالغ والنسب العامة.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="finance-return-paths"
        eyebrow="رحلات متكررة"
        title="صفحات تجعل المستخدم يعود إلى الموقع بدل زيارة واحدة فقط"
        description="هذه الصفحات ليست مجرد أدوات متجاورة، بل أسئلة مالية يومية متكررة يمكن أن تبني عادة استخدام مستمرة إذا وصل الزائر إلى المسار الصحيح من البداية."
        subtle
      >
        <CalculatorResourceLinks items={FINANCE_RETURN_PATHS} buttonLabel="افتح السؤال مباشرة" />
      </CalculatorSection>

      <CalculatorSection
        id="finance-faq"
        eyebrow="الأسئلة الشائعة"
        title="FAQ سريع حول قسم المال والعمل"
        description="أسئلة تمهّد للزائر وتدفعه إلى الأداة المناسبة بدل أن يخرج من القسم بسرعة."
      >
        <CalculatorFaqSection items={FAQ_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="finance-guides"
        eyebrow="محتوى داعم"
        title="أدلة تقوّي القرار قبل استخدام الأداة"
        description="هذه الأدلة تلتقط أسئلة تعليمية شائعة حول القروض والضريبة والنسبة والمستحقات، ثم تربطها مباشرة بالأداة العملية داخل القسم."
        subtle
      >
        <CalculatorResourceLinks items={FINANCE_GUIDES} />
      </CalculatorSection>

      <CalculatorSection
        id="finance-more"
        eyebrow="مسارات داخلية"
        title="ماذا بعد هذا القسم؟"
        description="بعد الحاسبات المالية، يمكن للمستخدم الانتقال إلى باقي المسارات العليا داخل الحاسبات."
      >
        <div className="calc-related-grid">
          {CALCULATOR_HUBS.filter((hub) => hub.slug !== 'finance').map((hub) => (
            <Card key={hub.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{hub.title}</CardTitle>
                <CardDescription className="calc-card-description">
                  {hub.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={hub.href} className="btn btn-primary--flat calc-button calc-inline-button">
                  افتح القسم
                  <ArrowLeft size={16} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
