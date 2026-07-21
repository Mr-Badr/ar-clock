import Link from 'next/link';
import { Suspense } from 'react';
import AdMultiplex from '@/components/ads/AdMultiplex';
import BuildingCostCalculator from '@/components/calculators/building/BuildingCostCalculator.client';
import CountryFlag from '@/components/shared/CountryFlag';
import {
  CalculatorDecisionTable,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  CalculatorFaqSection,
  CalculatorResourceLinks,
  CalculatorToolLauncher,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tool-guides';
import { getSiteUrl } from '@/lib/site-config';
import { getBuildingKeywords } from '@/lib/calculators/building/seo-keywords';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';
import SectionSkeleton from '@/components/shared/SectionSkeleton';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.building);
const BUILDING_MATERIAL_LINKS = [
  {
    href: '/calculators/building/cement',
    title: 'احسب أكياس الأسمنت قبل طلب الكمية',
    description: 'استخدمها للخرسانة والمونة عندما تريد معرفة الأسمنت والرمل والحصى والماء بدل الاكتفاء بتقدير عام.',
    ctaLabel: 'افتح حاسبة الأسمنت',
    label: 'خرسانة ومونة',
    iconLabel: 'أسمنت',
  },
  {
    href: '/calculators/building/rebar',
    title: 'حوّل الحديد من أطوال وأقطار إلى وزن',
    description: 'مفيدة عندما تريد تقدير وزن الحديد أو عدد الأسياخ قبل مقارنة عروض الموردين أو المقاولين.',
    ctaLabel: 'افتح حاسبة الحديد',
    label: 'تسليح ووزن',
    iconLabel: 'حديد',
  },
  {
    href: '/calculators/building/tiles',
    title: 'اعرف كراتين البلاط مع نسبة الهدر',
    description: 'ابدأ بها عندما تكون مساحة الغرف والمقاسات واضحة وتريد كمية أقرب للشراء الفعلي.',
    ctaLabel: 'افتح حاسبة البلاط',
    label: 'تشطيب وهدر',
    iconLabel: 'بلاط',
  },
  {
    href: '/calculators/building/paint',
    title: 'احسب لترات الدهان قبل الشراء',
    description: 'استخدمها عندما تريد معرفة كمية الدهان بالليتر وعدد العلب حسب أبعاد الجدران وعدد الطبقات.',
    ctaLabel: 'افتح حاسبة الدهان',
    label: 'دهان وتشطيب',
    iconLabel: 'دهان',
  },
];
const BUILDING_SOURCE_LINKS = [
  {
    href: 'https://www.cement.org/cement-concrete/cement-concrete-faq/',
    title: 'Portland Cement Association: أسئلة الأسمنت والخرسانة',
    description: 'مرجع فني لفهم علاقة الأسمنت بالخرسانة ولماذا لا تكفي أكياس الأسمنت وحدها لتسعير المشروع.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/rebar-properties/',
    title: 'CRSI: خصائص حديد التسليح',
    description: 'مرجع لفهم أقطار حديد التسليح وخصائصه قبل تحويل الأطوال والكميات إلى وزن تقريبي.',
    ctaLabel: 'افتح المصدر',
  },
  {
    href: '/blog/how-many-cement-bags-do-i-need',
    title: 'شرح عربي: كم كيس أسمنت أحتاج؟',
    description: 'دليل مبسط يساعدك على فصل كمية الخرسانة والمونة عن تكلفة مشروع البناء بالكامل.',
    ctaLabel: 'اقرأ الشرح',
  },
  {
    href: '/blog/how-to-estimate-rebar-weight',
    title: 'شرح عربي: كيف تقدّر وزن الحديد؟',
    description: 'طريقة عملية لفهم وزن الأسياخ، قطر الحديد، والهدر قبل مقارنة عرض المورد.',
    ctaLabel: 'اقرأ الشرح',
  },
];
const BUILDING_DECISION_ROWS = [
  {
    key: 'budget',
    cells: [
      'أريد ميزانية أولية للمشروع',
      'حاسبة تكلفة البناء',
      'ابدأ بالمساحة والدولة ومستوى التشطيب، ثم اقرأ الناتج كنطاق لا كسعر مقاول نهائي.',
    ],
  },
  {
    key: 'cement',
    cells: [
      'أريد كمية خرسانة أو مونة',
      'حاسبة الأسمنت',
      'استخدمها عندما تعرف نوع الخلطة أو المساحة، وأضف هامش هدر قبل الشراء.',
    ],
  },
  {
    key: 'rebar',
    cells: [
      'أريد وزن الحديد أو عدد الأسياخ',
      'حاسبة الحديد',
      'تحتاج القطر والطول والعدد. النتيجة تساعد في المقارنة، ولا تغني عن المخطط الإنشائي.',
    ],
  },
  {
    key: 'tiles',
    cells: [
      'أريد كراتين بلاط',
      'حاسبة البلاط',
      'أدخل مقاس البلاطة والمساحة، ثم أضف هدر القص والكسر حسب شكل المكان.',
    ],
  },
];
const BUILDING_METHOD_ITEMS = [
  {
    title: 'اقرأ التكلفة كنطاق لا كحكم نهائي',
    description: 'الأسعار في البناء تتحرك بسرعة حسب المدينة والموسم والتوفر.',
    content: (
      <p>
        الناتج الأوسط يخبرك بالتصور الأقرب، أما الحد الأدنى والأعلى فيحميانك من وهم الدقة. إذا كان عرض المقاول خارج النطاق بكثير، لا ترفضه فوراً؛ اطلب تفصيل البنود، ثم قارن السبب: هل يشمل الحفر؟ هل يشمل السور؟ هل التشطيب مختلف؟ هل السعر يتضمن الضريبة أو الرسوم؟
      </p>
    ),
  },
  {
    title: 'افصل العظم عن التشطيب',
    description: 'كثير من المشاريع لا تتعثر في الخرسانة، بل في التشطيبات المتأخرة.',
    content: (
      <p>
        الهيكل يعطيك شكل البيت، لكن التشطيب هو المكان الذي تظهر فيه الاختيارات الكثيرة: أرضيات، أبواب، نوافذ، دهانات، مطابخ، دورات مياه، إنارة، وتكييف. لذلك لا تجعل كل ميزانيتك تذهب إلى بداية المشروع ثم تكتشف أن المتبقي لا يكفي للسكن المريح.
      </p>
    ),
  },
  {
    title: 'اجعل كميات المواد خطوة ثانية',
    description: 'الكمية الدقيقة تحتاج مخططاً أو مقاسات أوضح من مجرد فكرة عامة.',
    content: (
      <p>
        الأسمنت والحديد والبلاط لا تُحسب بالطريقة نفسها. الأسمنت مرتبط بحجم الصبة أو المونة، الحديد مرتبط بالأقطار والأطوال والتفاصيل الإنشائية، والبلاط مرتبط بمقاس البلاطة والهدر والقص. لذلك خصص لكل بند حاسبته بدلاً من محاولة ضغط كل شيء في رقم واحد.
      </p>
    ),
  },
];
const FEATURED_BUILDING_COUNTRY_KEYS = ['sa', 'eg', 'ae', 'ma'];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبة تكلفة البناء | احسب تكلفة بناء بيت والمواد',
  description: 'احسب تكلفة بناء بيت حسب المساحة والدولة والتشطيب، وافهم متى تستخدم تقدير المشروع أو حاسبات الأسمنت والحديد والبلاط قبل طلب عرض سعر.',
  keywords: getBuildingKeywords('global'),
  url: `${SITE_URL}/calculators/building`,
});

export default function BuildingHubPage() {
  const safeCountries = Array.isArray(COUNTRY_LIST) ? COUNTRY_LIST : [];
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات البناء والتشييد',
    url: `${SITE_URL}/calculators/building`,
    inLanguage: 'ar',
    description: 'مجموعة حاسبات عربية لتكلفة البناء، الأسمنت، حديد التسليح، والبلاط.',
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'كم تكلفة بناء بيت؟', url: `${SITE_URL}/calculators/building` },
      { '@type': 'ListItem', position: 2, name: 'كم كيس أسمنت أحتاج؟', url: `${SITE_URL}/calculators/building/cement` },
      { '@type': 'ListItem', position: 3, name: 'كم وزن الحديد؟', url: `${SITE_URL}/calculators/building/rebar` },
      { '@type': 'ListItem', position: 4, name: 'كم كرتون بلاط أحتاج؟', url: `${SITE_URL}/calculators/building/tiles` },
    ],
  };
  const faqItems = [
    {
      question: 'كيف تحسب هذه الأداة تكلفة البناء؟',
      answer: 'تعتمد الحاسبة على مساحة الأرض وعدد الأدوار ونوع المبنى ومستوى التشطيب، ثم تطبق متوسط تكلفة المتر في الدولة التي تختارها. النتيجة ليست عرض مقاول نهائياً، لكنها تعطيك نطاقاً عملياً قبل أن تطلب تسعيراً محلياً. إذا كان لديك سعر متر أو سعر مادة من موردك، عدّل المدخلات داخل الحاسبة حتى تصبح النتيجة أقرب لسوقك.',
    },
    {
      question: 'هل نسبة المقاول (الربح) مشمولة في النتيجة؟',
      answer: 'النطاق المعروض يحاول تمثيل تكلفة تنفيذ واقعية تشمل المواد والعمالة وهامش التنفيذ العام، لا سعر المواد الخام وحدها. مع ذلك يختلف هامش المقاول حسب المدينة، حجم المشروع، طريقة التعاقد، ومستوى الإشراف. لذلك استخدم النتيجة كبداية تفاوض، ثم قارنها مع عرضين أو ثلاثة بنفس المواصفات.',
    },
    {
      question: 'هل يمكنني تغيير أسعار المواد (الأسمنت، الحديد)؟',
      answer: 'نعم. للحصول على دقة أعلى، استخدم حاسبة الأسمنت أو حاسبة الحديد أو حاسبة البلاط، ثم أدخل الأسعار المحلية التي حصلت عليها من المورد. هذا مهم خصوصاً في المدن التي تتغير فيها تكلفة النقل أو العمالة أو توفر المواد بسرعة.',
    },
    {
      question: 'ما الفرق بين تكلفة العظم وتكلفة تسليم المفتاح؟',
      answer: 'العظم يركّز على الهيكل الإنشائي والأعمال الأساسية قبل التشطيب، بينما تسليم المفتاح يحاول تغطية المشروع حتى يصبح قابلاً للاستخدام. لذلك يكون رقم تسليم المفتاح أعلى وأقرب لقرار السكن، لكنه يحتاج مواصفات مكتوبة حتى لا تختلف جودة التشطيب من عرض إلى آخر.',
    },
    {
      question: 'كم احتياطياً أترك فوق تقدير البناء؟',
      answer: 'لا توجد نسبة واحدة تصلح للجميع، لكن من الحكمة أن تترك احتياطياً واضحاً للمفاجآت، خصوصاً إذا كان المخطط غير نهائي أو الأسعار متقلبة أو المشروع في مدينة ذات نقل ويد عاملة أعلى. إذا كان كل ما لديك يساوي تكلفة الحاسبة تقريباً، فالقرار يحتاج تهدئة قبل البدء.',
    },
    {
      question: 'ما هو التشطيب الاقتصادي؟',
      answer: 'التشطيب الاقتصادي يعني استخدام مواد عملية وأساسية مثل سيراميك متوسط، دهانات قياسية، أبواب بسيطة، وتجهيزات صحية غير فاخرة. يناسب بيتاً استثمارياً أو مشروعاً تريد فيه ضبط الميزانية قبل الجماليات. إذا كان هدفك بيتاً للسكن الطويل، قارن الاقتصادي مع القياسي لأن فرق التكلفة قد يوفر عليك صيانة مبكرة لاحقاً.',
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
    name: 'كيف تقدّر تكلفة بناء بيت قبل طلب عرض سعر؟',
    inLanguage: 'ar',
    description: 'خطوات عملية لاستخدام حاسبة تكلفة البناء وفصل ميزانية المشروع عن كميات المواد.',
    step: [
      { '@type': 'HowToStep', name: 'حدد المساحة والدولة', text: 'أدخل مساحة الطابق وعدد الطوابق واختر الدولة أو المدينة الأقرب لسوقك.' },
      { '@type': 'HowToStep', name: 'اختر نوع المبنى والتشطيب', text: 'ميّز بين فيلا أو عمارة أو مبنى تجاري، ثم اختر مستوى التشطيب الأقرب لما تريد.' },
      { '@type': 'HowToStep', name: 'اقرأ النطاق لا الرقم الأوسط فقط', text: 'راجع الحد الأدنى والأعلى ومتوسط تكلفة المتر قبل مقارنة أي عرض مقاول.' },
      { '@type': 'HowToStep', name: 'انتقل إلى المواد عند الحاجة', text: 'استخدم حاسبات الأسمنت والحديد والبلاط عندما يصبح سؤالك عن كمية شراء محددة.' },
    ],
  };

  const featuredCountries = safeCountries.filter((country) => FEATURED_BUILDING_COUNTRY_KEYS.includes(country.countryKey));
  const secondaryCountries = safeCountries.filter((country) => !FEATURED_BUILDING_COUNTRY_KEYS.includes(country.countryKey));

  return (
    <main className="calc-product-page calc-building-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <CalculatorHero
        badge="هندسة / بناء"
        title="حاسبة تكلفة البناء: اعرف كم قد يكلف بيتك قبل طلب عرض"
        description="إذا كنت تسأل كم تكلفة بناء بيت، ابدأ من المساحة والدولة ومستوى التشطيب. هذه الحاسبة تعطيك نطاق تكلفة واضحاً، ثم تقودك إلى حساب الأسمنت والحديد والبلاط عندما تحتاج تفصيل المواد قبل الشراء أو التفاوض."
        highlights={[
          'تقدير تكلفة المتر والمشروع حسب الدولة والتشطيب.',
          'روابط مباشرة لحساب الأسمنت والحديد والبلاط عندما تحتاج كمية مادة محددة.',
          'شرح عربي واضح يعلّمك كيف تقرأ العرض ولا تعتمد على رقم واحد.',
        ]}
      >
        <Suspense fallback={<SectionSkeleton />}>
          <BuildingCostCalculator />
        </Suspense>

        {/* Quick-access strip for material calculators */}
        <div className="building-tools-strip">
          <p className="building-tools-strip__label">احسب المواد بالتفصيل:</p>
          <div className="building-tools-strip__links">
            {BUILDING_MATERIAL_LINKS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="building-tool-pill">
                <span className="building-tool-pill__icon" aria-hidden="true">{tool.iconLabel}</span>
                <span>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="tools-grid"
        eyebrow="حاسبات المواد"
        title="حاسبات تفصيلية للكميات"
        description="بعد معرفة التكلفة العامة، افتح أداة واحدة فقط بحسب البند الذي تريد ضبطه الان: الأسمنت، الحديد، أو البلاط."
      >
        <CalculatorToolLauncher
          items={BUILDING_MATERIAL_LINKS}
          ariaLabel="اختيار حاسبة مواد البناء المناسبة"
          badge="3 مواد مؤثرة"
          featuredLabel="ابدأ عندما تكون الصبة واضحة"
          theme="amber"
          note="لا تبدأ بكميات المواد إذا كان السؤال لا يزال عن تكلفة المشروع كله. استخدم الحاسبة العامة أولاً، ثم افتح الأسمنت أو الحديد أو البلاط عندما تكون المقاسات أو البند المطلوب واضحاً."
        />
      </CalculatorSection>

      <CalculatorSection
        id="building-decision-table"
        eyebrow="قبل التفاصيل"
        title="متى تستخدم كل حاسبة بناء؟"
        description="افصل بين ميزانية المشروع كله وبين كمية مادة محددة. هذا الترتيب يمنعك من الغرق في تفاصيل لا تغيّر القرار الحالي."
        subtle
      >
        <CalculatorDecisionTable
          columns={['سؤالك الان', 'الأداة المناسبة', 'ملاحظة مهمة']}
          rows={BUILDING_DECISION_ROWS}
        />
      </CalculatorSection>

      <CalculatorSection
        id="building-method"
        eyebrow="طريقة الحساب"
        title="كيف تقرأ رقم تكلفة البناء دون أن تنخدع بالدقة الزائفة؟"
        description="أقوى تقدير هو الذي يريك حدود الرقم. اقرأ النطاق، ثم اسأل: ماذا شمل؟ ماذا استثنى؟ وما الذي يحتاج مخططاً أو عرضاً محلياً؟"
      >
        <CalculatorInfoGrid items={BUILDING_METHOD_ITEMS} />
      </CalculatorSection>

      <CalculatorSection
        id="country-hub"
        eyebrow="حسب دولتك"
        title="اختر السوق الأقرب قبل مقارنة تكلفة البناء"
        description="السعر لا يتغير بالعملة فقط، بل يتغير بسبب العمالة والمواد والمدينة. ابدأ بأقرب سوق، ثم عدّل المدخلات داخل الحاسبة إذا كان لديك عرض محلي أدق."
        subtle
      >
        <div className="calc-country-selector">
          <div className="calc-country-selector__featured" aria-label="أسواق بناء رئيسية">
            {featuredCountries.map((country) => (
              <Link
                key={country.slug}
                href={`/calculators/building/${country.slug}`}
                className="calc-country-card"
              >
                <span className="calc-country-card__flag" aria-hidden="true"><CountryFlag code={country.countryKey} /></span>
                <span className="calc-country-card__copy">
                  <strong>{country.nameShort}</strong>
                  <span>{country.currency} · سعر متر وتكلفة مواد محلية</span>
                </span>
                <span className="calc-country-card__cta">افتح الحاسبة</span>
              </Link>
            ))}
          </div>

          <div className="calc-country-selector__compact" aria-label="كل الدول المدعومة في حاسبة البناء">
            <span className="calc-country-selector__label">كل الدول المدعومة</span>
            <div className="calc-country-chip-list">
              {secondaryCountries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/calculators/building/${country.slug}`}
                  className="calc-country-chip"
                >
                  <span aria-hidden="true"><CountryFlag code={country.countryKey} /></span>
                  <span>{country.nameShort}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="building-guides"
        eyebrow="قبل شراء المواد"
        title="اقرأ قبل شراء المواد أو طلب التسعير"
        description="هذه الشروحات تساعدك على فهم سؤال الأسمنت أو الحديد أو التكلفة قبل الانتقال إلى الأداة المناسبة."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} buttonLabel="اقرأ التفسير" />
      </CalculatorSection>

      <CalculatorSection
        id="building-sources"
        eyebrow="مصادر وفهم أعمق"
        title="مصادر تساعدك على فهم المواد قبل الشراء"
        description="استخدم المصادر لفهم المفاهيم، ثم اعتمد في السعر النهائي على عروض محلية مكتوبة لأن أسعار البناء تتغير حسب المدينة والمورد والموسم."
      >
        <CalculatorResourceLinks items={BUILDING_SOURCE_LINKS} buttonLabel="افتح المصدر" />
      </CalculatorSection>

      <CalculatorSection
        id="building-faq"
        eyebrow="قبل الاعتماد على التقدير"
        title="أسئلة قبل تحويل تقدير البناء إلى ميزانية"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <AdMultiplex slotId="end-building-hub" />

    </main>
  );
}
