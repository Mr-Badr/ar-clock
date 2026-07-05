import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import BuildingCostCalculator from '@/components/calculators/building/BuildingCostCalculator.client';
import AdMultiplex from '@/components/ads/AdMultiplex';
import {
  CalculatorDecisionTable,
  CalculatorHero,
  CalculatorSection,
  CalculatorFaqSection,
  CalculatorResourceLinks,
  CalculatorToolLauncher,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';
import { getCountryBySlug, getBuildingCountrySlugs, formatCurrency } from '@/lib/calculators/building/country-data';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const FINISH_LABELS = {
  skeleton: 'عظم / هيكل',
  economy: 'اقتصادي',
  standard: 'قياسي',
  luxury: 'فاخر',
  super_lux: 'فاخر جداً',
};
const BUILDING_MATERIAL_LINKS = [
  {
    href: '/calculators/building/cement',
    title: 'احسب أكياس الأسمنت للخرسانة والمونة',
    description: 'افتحها عندما تريد ضبط كمية الأسمنت والرمل والحصى قبل مقارنة السعر المحلي.',
    ctaLabel: 'جرّب حاسبة الأسمنت',
    label: 'خرسانة ومونة',
    iconLabel: 'أسمنت',
  },
  {
    href: '/calculators/building/rebar',
    title: 'احسب وزن الحديد وعدد الأسياخ',
    description: 'مفيدة عند مراجعة عروض الحديد أو تقدير الكميات التقريبية للأسقف والأعمدة.',
    ctaLabel: 'جرّب حاسبة الحديد',
    label: 'تسليح ووزن',
    iconLabel: 'حديد',
  },
  {
    href: '/calculators/building/tiles',
    title: 'احسب كراتين البلاط مع الهدر',
    description: 'استخدمها عندما تعرف مساحة الغرف وتريد كمية شراء أقرب للواقع.',
    ctaLabel: 'جرّب حاسبة البلاط',
    label: 'تشطيب وهدر',
    iconLabel: 'بلاط',
  },
];
const COUNTRY_SOURCE_LINKS = [
  {
    href: '/calculators/building',
    title: 'العودة إلى حاسبة تكلفة البناء العامة',
    description: 'قارن تقدير الدولة مع صفحة المحور إذا أردت فهم الفرق بين تكلفة المشروع والمواد.',
    ctaLabel: 'افتح المحور',
  },
  {
    href: '/calculators/vat',
    title: 'حاسبة ضريبة القيمة المضافة',
    description: 'استخدمها إذا كان عرض المقاول أو المورد يذكر الضريبة منفصلة عن السعر.',
    ctaLabel: 'احسب الضريبة',
  },
  {
    href: '/blog/how-many-cement-bags-do-i-need',
    title: 'كم كيس أسمنت أحتاج؟',
    description: 'شرح عربي مبسط لفهم كمية الأسمنت قبل شراء الخرسانة أو المونة.',
    ctaLabel: 'اقرأ الشرح',
  },
  {
    href: '/blog/how-to-estimate-rebar-weight',
    title: 'كيف تقدّر وزن الحديد؟',
    description: 'دليل عملي لقراءة وزن الحديد وعدد الأسياخ قبل مقارنة عرض المورد.',
    ctaLabel: 'اقرأ الشرح',
  },
];
const COUNTRY_FINANCE_LINKS = {
  sa: {
    href: '/calculators/mortgage-saudi',
    title: 'حاسبة التمويل العقاري السعودية',
    description: 'إذا كنت ستموّل البناء بدل الدفع نقداً، احسب القسط الشهري والحد الأقصى للتمويل قبل التعاقد مع المقاول.',
    ctaLabel: 'احسب التمويل العقاري',
  },
  ae: {
    href: '/calculators/mortgage-uae',
    title: 'حاسبة التمويل العقاري الإمارات',
    description: 'قبل اعتماد ميزانية البناء، احسب القسط الشهري وسقف التمويل المتاح لك حسب راتبك.',
    ctaLabel: 'احسب التمويل العقاري',
  },
  qa: {
    href: '/calculators/mortgage-qatar',
    title: 'حاسبة التمويل العقاري قطر',
    description: 'قارن تمويل البناء بالتقسيط قبل أن تحدد ميزانية نهائية مع المقاول.',
    ctaLabel: 'احسب التمويل العقاري',
  },
  kw: {
    href: '/calculators/mortgage-kuwait',
    title: 'حاسبة التمويل السكني الكويت',
    description: 'استخدمها لمعرفة القسط الشهري وسقف التمويل قبل التعاقد على البناء.',
    ctaLabel: 'احسب التمويل السكني',
  },
  bh: {
    href: '/calculators/mortgage-bahrain',
    title: 'حاسبة التمويل العقاري البحرين',
    description: 'احسب القسط الشهري وسقف التمويل المتاح لك قبل اعتماد ميزانية البناء.',
    ctaLabel: 'احسب التمويل العقاري',
  },
  om: {
    href: '/calculators/personal-loan-oman',
    title: 'حاسبة القرض الشخصي عمان',
    description: 'إذا كنت ستموّل جزءاً من البناء بقرض شخصي، احسب القسط الشهري وسقف القرض أولاً.',
    ctaLabel: 'احسب القرض الشخصي',
  },
  eg: {
    href: '/calculators/personal-loan-egypt',
    title: 'حاسبة القرض الشخصي مصر',
    description: 'قبل تمويل البناء أو التشطيب بقرض، احسب القسط الشهري وفق قواعد البنك المركزي المصري.',
    ctaLabel: 'احسب القرض الشخصي',
  },
  jo: {
    href: '/calculators/monthly-installment',
    title: 'حاسبة القسط الشهري',
    description: 'إذا كنت ستقسّط تكلفة البناء أو المواد، احسب القسط الشهري والمدة قبل الالتزام.',
    ctaLabel: 'احسب القسط الشهري',
  },
};

const COUNTRY_SCOPE_ROWS = [
  {
    key: 'land',
    cells: ['سعر الأرض', 'عادة غير مشمول', 'أضفه وحده إذا كنت تقارن شراء أرض وبناء بيت في قرار واحد.'],
  },
  {
    key: 'permits',
    cells: ['التراخيص والرسوم', 'قد تكون منفصلة', 'راجع البلدية أو المكتب الهندسي ولا تعتمد على تقدير الحاسبة فقط.'],
  },
  {
    key: 'site',
    cells: ['الحفر والردم والسور والخزان', 'تختلف حسب الأرض', 'اسأل عنها صراحة لأنها قد تغيّر الميزانية حتى لو كان سعر المتر جذاباً.'],
  },
  {
    key: 'finish',
    cells: ['الأبواب والنوافذ والمطابخ والتكييف', 'تتغير مع التشطيب', 'قارن الجودة والماركات لا الاسم العام: اقتصادي أو فاخر.'],
  },
];

function getCountryRegionRows(country) {
  const regions = country.regions && typeof country.regions === 'object' ? Object.entries(country.regions) : [];

  return regions.slice(0, 3).map(([key, region]) => ({
    key,
    cells: [
      region.name,
      region.m === 1 ? 'مرجع أساسي' : `${Math.round(region.m * 100)}% من السعر المرجعي`,
      region.m > 1
        ? 'اقرأها كمنطقة أعلى تكلفة نسبياً بسبب الطلب أو النقل أو نمط التنفيذ.'
        : 'قد تكون أقل تكلفة نسبياً، لكن المواصفات المحلية تظل أهم من النسبة وحدها.',
    ],
  }));
}

function getCostRows(country) {
  const costPerM2 = country.cost_per_m2 && typeof country.cost_per_m2 === 'object' ? country.cost_per_m2 : {};

  return Object.entries(FINISH_LABELS)
    .filter(([key]) => Number.isFinite(costPerM2[key]))
    .map(([key, label]) => ({
      key,
      cells: [
        label,
        formatCurrency(costPerM2[key], country.symbol),
        key === 'skeleton'
          ? 'يفيدك لفهم الهيكل، لكنه لا يكفي لقرار السكن.'
          : 'استخدمه كنقطة مقارنة أولية ثم راجع المواصفات مع المقاول.',
      ],
    }));
}

export async function generateStaticParams() {
  const countrySlugs = getBuildingCountrySlugs();
  return Array.isArray(countrySlugs) ? countrySlugs : [];
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  
  if (!country) return notFound();
  const countryRegions = country.regions && typeof country.regions === 'object' ? country.regions : {};
  const firstRegion = Object.values(countryRegions)[0];

  const title = `حاسبة تكلفة البناء في ${country.nameShort} | سعر المتر والمواد`;
  const description = `احسب تكلفة بناء بيت في ${country.name} حسب المساحة والمدينة والتشطيب، وافهم سعر المتر وما يشمله العرض قبل مقارنة المقاولين والمواد.`;

  return buildCanonicalMetadata({
    title,
    description,
    keywords: getBuildingKeywords(country.countryKey),
    url: `${SITE_URL}/calculators/building/${country.slug}`,
  });
}

export default async function CountryBuildingPage({ params }) {
  const { country: countrySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  
  if (!country) return notFound();

  const title = `حاسبة تكلفة البناء في ${country.nameShort}`;
  const regionRows = getCountryRegionRows(country);
  const costRows = getCostRows(country);
  const financeLink = COUNTRY_FINANCE_LINKS[country.countryKey];
  const countrySourceLinks = financeLink
    ? [...COUNTRY_SOURCE_LINKS.slice(0, 2), financeLink, ...COUNTRY_SOURCE_LINKS.slice(2)]
    : COUNTRY_SOURCE_LINKS;

  const faqItems = [
    {
      question: `كيف يتم حساب تكلفة المتر المربع في ${country.nameShort}؟`,
      answer: `تبدأ الحاسبة من متوسطات تقديرية للمواد والعمالة، ثم تعدّل النتيجة بحسب المدينة ومستوى التشطيب ونوع المبنى. قد يختلف السعر الفعلي بوضوح بسبب موقع الأرض، تعقيد التصميم، النقل، وطريقة التعاقد مع المقاول. لذلك اقرأ الرقم كنطاق مبدئي يساعدك على المقارنة، لا كسعر نهائي ثابت.`,
    },
    {
      question: `هل الأسعار تشمل ضريبة القيمة المضافة في ${country.nameShort}؟`,
      answer: `قد تتضمن بعض عروض السوق الضرائب أو الرسوم داخل السعر، وقد تظهر منفصلة في عروض أخرى. لهذا لا تعتمد على الرقم الضريبي من هذه الصفحة وحده عند توقيع عقد أو اعتماد ميزانية نهائية. استخدم حاسبة الضريبة أو راجع عرض المقاول والجهة الرسمية في بلدك إذا كانت الضريبة أو الرسوم جزءاً مهماً من القرار.`,
    },
    {
      question: `ما الفرق بين العظم والتشطيب؟`,
      answer: `العظم هو الهيكل: القواعد، الأعمدة، الأسقف، الجدران، والخرسانة الأساسية. التشطيب هو ما يجعل المبنى قابلاً للسكن: الكهرباء، السباكة، اللياسة أو المحارة، البلاط، الدهانات، الأبواب، النوافذ، والواجهات. في كثير من المشاريع يكون التشطيب هو الجزء الذي يوسّع الميزانية أكثر من المتوقع، لذلك جرّب أكثر من مستوى تشطيب قبل اعتماد الرقم.`,
    },
    {
      question: `هل يكفي سعر المتر لبناء ميزانية في ${country.nameShort}؟`,
      answer: `سعر المتر بداية جيدة، لكنه لا يكفي وحده. قد يكون سعر المتر لعظم فقط، أو تشطيب متوسط، أو تسليم مفتاح، وقد يستثني السور أو الخزان أو المصعد أو الرسوم. لذلك اسأل دائماً: ما البنود المشمولة؟ ما المستثنى؟ وهل السعر محسوب على مسطح البناء أم مساحة الأرض؟`,
    },
    {
      question: `متى أستخدم حاسبات الأسمنت والحديد والبلاط بعد هذه الصفحة؟`,
      answer: `استخدمها عندما يصبح سؤالك عن بند شراء محدد. إذا كنت ما زلت تختبر هل المشروع ممكن مالياً، فحاسبة تكلفة البناء تكفي كبداية. أما إذا بدأت مقارنة عروض المواد أو لديك مخطط أو مساحة غرف واضحة، فانتقل إلى حاسبة الأسمنت أو الحديد أو البلاط للحصول على كمية أوضح.`,
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `كيف تقدّر تكلفة بناء بيت في ${country.nameShort}`,
    inLanguage: 'ar',
    description: `خطوات عملية لاستخدام حاسبة تكلفة البناء في ${country.nameShort} قبل طلب عرض مقاول.`,
    step: [
      { '@type': 'HowToStep', name: 'اختر الدولة والمدينة', text: `ابدأ من ${country.nameShort} ثم اختر المدينة الأقرب لمشروعك داخل الحاسبة.` },
      { '@type': 'HowToStep', name: 'أدخل مساحة البناء', text: 'استخدم مسطح البناء الفعلي وعدد الطوابق بدلاً من مساحة الأرض فقط.' },
      { '@type': 'HowToStep', name: 'غيّر مستوى التشطيب', text: 'جرّب العظم والاقتصادي والقياسي والفاخر لتفهم أثر التشطيب على الميزانية.' },
      { '@type': 'HowToStep', name: 'راجع ما يشمله العرض', text: 'قارن النتيجة مع عرض المقاول بعد سؤال واضح عن البنود المستثناة والضريبة والرسوم.' },
    ],
  };
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: `${SITE_URL}/calculators/building/${country.slug}`,
    inLanguage: 'ar',
    description: `حاسبة عربية لتقدير تكلفة البناء وسعر المتر في ${country.nameShort}.`,
  };

  return (
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge={`بناء / ${country.symbol}`}
        title={title}
        description={`احسب تكلفة بناء بيت في ${country.name} حسب المساحة وعدد الطوابق والمدينة ومستوى التشطيب. النتيجة تساعدك على فهم سعر المتر ونطاق الميزانية قبل أن تطلب عرض مقاول أو تشتري مواد كبيرة.`}
        highlights={[
          `تقديرات أقرب لسوق ${country.nameShort} مع مدن ومعاملات محلية.`,
          'قراءة واضحة للعظم والتشطيب وسعر المتر.',
          'مسار مباشر لحساب الأسمنت والحديد والبلاط عند الحاجة.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <BuildingCostCalculator preSelectedCountrySlug={country.slug} />
        </Suspense>
      </CalculatorHero>

      <CalculatorSection
        id="building-cost-ranges"
        eyebrow="سعر المتر"
        title={`نطاقات سعر المتر في ${country.nameShort} حسب التشطيب`}
        description="هذه القيم مأخوذة من بيانات الحاسبة نفسها، وتُعرض لك حتى تفهم ماذا يحدث عندما تغيّر مستوى التشطيب."
      >
        <CalculatorDecisionTable
          columns={['المستوى', `تقدير المتر في ${country.currency}`, 'كيف تقرأه؟']}
          rows={costRows}
        />
      </CalculatorSection>

      {regionRows.length ? (
        <CalculatorSection
          id="building-regions"
          eyebrow="حسب المدينة"
          title={`لماذا تختلف تكلفة البناء بين مدن ${country.nameShort}؟`}
          description="الجدول يوضح الاتجاه النسبي داخل الحاسبة. لا تستخدمه بديلاً عن عرض محلي، لكنه يساعدك على فهم لماذا لا يكفي رقم دولة واحد."
          subtle
        >
          <CalculatorDecisionTable
            columns={['المدينة / المنطقة', 'الاتجاه التقريبي', 'ماذا يعني لك؟']}
            rows={regionRows}
          />
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="building-scope"
        eyebrow="ما يشمله السعر"
        title="لا تقارن عرضين قبل معرفة البنود المستثناة"
        description="أكثر خلافات البناء تبدأ من كلمة عامة مثل: السعر شامل. هذا الجدول يساعدك على طلب توضيح مكتوب."
      >
        <CalculatorDecisionTable
          columns={['البند', 'هل يدخل غالباً في سعر المتر؟', 'ما القرار العملي؟']}
          rows={COUNTRY_SCOPE_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="building-materials"
        eyebrow="حاسبات المواد"
        title="احسب الكميات بدقة هندسية"
        description="بعد تقدير تكلفة المشروع في بلدك، ابدأ بالأداة التي تضبط البند الأقرب لقرارك الحالي."
      >
        <CalculatorToolLauncher
          items={BUILDING_MATERIAL_LINKS}
          ariaLabel={`اختيار حاسبة مواد البناء في ${country.nameShort}`}
          badge="3 مواد بعد تقدير المشروع"
          featuredLabel="ابدأ عندما تكون الصبة واضحة"
          theme="amber"
          note={`استخدم هذه الأدوات بعد تقدير تكلفة البناء في ${country.nameShort}، لأن كمية الأسمنت أو الحديد أو البلاط تصبح مفيدة فقط عندما يكون البند والمقاسات أقرب للواقع.`}
        />
      </CalculatorSection>

      <CalculatorSection
        id="building-country-sources"
        eyebrow="روابط تساعدك"
        title="أدوات وشروحات تكمل تقدير البناء"
        description="استخدم هذه الروابط لفهم البنود أو الضريبة أو المواد قبل أن تعتمد ميزانية نهائية."
      >
        <CalculatorResourceLinks items={countrySourceLinks} buttonLabel="افتح الرابط" />
      </CalculatorSection>

      <CalculatorSection
        id="building-faq"
        eyebrow="قبل اعتماد التكلفة"
        title={`أسئلة قبل اعتماد تكلفة البناء في ${country.nameShort}`}
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <AdMultiplex slotId={`end-building-country-${country.slug}`} className="container mx-auto px-4" />

    </main>
  );
}
