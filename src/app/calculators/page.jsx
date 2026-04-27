import Link from 'next/link';
import { Calculator, Landmark, Percent, ReceiptText } from 'lucide-react';

import {
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorHubGrid,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorResourceLinks,
  CalculatorSection,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const TOP_SEARCH_INTENTS = [
  'كم عمري الآن بالسنوات والأيام والثواني',
  'كم قسط قرض 100 ألف على 5 سنوات',
  'كم ضريبة 1000 ريال عند 15%',
  'كم يساوي 20% من 500',
  'كم مكافأة نهاية الخدمة بعد 5 سنوات',
  'إذا نمت الآن متى أستيقظ',
  'كم أحتاج صندوق طوارئ',
  'متى أخلص من ديوني',
  'كم أوفر شهرياً لهدف معين',
  'كم تكلفة بناء بيت في السعودية',
  'كم كيس أسمنت أحتاج',
  'كم وزن حديد التسليح',
];
const DAILY_WORKFLOWS = [
  {
    href: '/calculators/finance',
    title: 'ابدأ من المال والعمل',
    description: 'إذا كان السؤال عن القرض أو الضريبة أو النسبة أو نهاية الخدمة، فهذه البوابة تختصر الطريق إلى الأداة الصحيحة بسرعة.',
  },
  {
    href: '/calculators/age',
    title: 'ابدأ من العمر والتواريخ',
    description: 'مناسب لمن يبحث عن حاسبة العمر، فرق العمر، عيد الميلاد القادم، أو التحويل بين العمر الهجري والميلادي.',
  },
  {
    href: '/calculators/sleep',
    title: 'ابدأ من النوم الذكي',
    description: 'يمسك مسار النوم بالكامل: متى تنام، متى تستيقظ، القيلولة، دين النوم، واحتياج النوم حسب العمر.',
  },
  {
    href: '/calculators/personal-finance',
    title: 'ابدأ من التخطيط المالي الشخصي',
    description: 'بوابة للادخار والديون وصندوق الطوارئ وصافي الثروة لمن يريد العودة إلى أدواته المالية باستمرار.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: 'كم عمري؟ كم القسط؟ كم الضريبة؟ | أشهر الحاسبات العربية',
  description:
    'ابدأ من أكثر الحاسبات التي يبحث عنها المستخدم العربي يومياً: كم عمري الآن، كم قسط قرض 100 ألف، كم ضريبة 1000 ريال عند 15%، وكم مكافأة نهاية الخدمة، مع نتائج فورية وشرح عربي واضح.',
  keywords: [
    ...CALCULATOR_HUBS.flatMap((item) => item.keywords),
    ...CALCULATOR_ROUTES.flatMap((item) => item.keywords),
  ],
  url: `${SITE_URL}/calculators`,
});

export default function CalculatorsPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الحاسبات',
    url: `${SITE_URL}/calculators`,
    inLanguage: 'ar',
    description: 'مجموعة حاسبات عربية عملية تشمل العمر ونهاية الخدمة والقروض والضريبة والنسب المئوية.',
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CALCULATOR_ROUTES.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <CalculatorHero
        badge="قسم الحاسبات"
        title="كم عمري؟ كم القسط؟ كم الضريبة؟ ابدأ من أشهر الحاسبات العربية"
        description="يغطي هذا القسم أهم الأدوات العملية التي يبحث عنها المستخدم العربي يومياً: حاسبة العمر، مستحقات نهاية الخدمة، القسط الشهري، ضريبة القيمة المضافة، النسبة المئوية، وتكلفة البناء. كل صفحة تبدأ من سؤال حقيقي يبحث به الناس، لا من اسم أداة عام فقط."
        accent="#2563EB"
        highlights={[
          'أدوات مبنية على نيات بحث عربية واضحة وليست عناوين عامة فقط.',
          'نتائج مباشرة مع شروحات عربية واضحة وأمثلة قابلة للفهم بسرعة.',
          'ربط داخلي بين الحاسبات والمسارات العليا والأدلة الداعمة لتسهيل الاكتشاف والفهرسة والاستمرار داخل الموقع.',
        ]}
      >
        <CalculatorHubGrid />
      </CalculatorHero>

      <CalculatorSection
        id="calculator-clusters"
        eyebrow="المسارات العليا"
        title="ابدأ من القسم المناسب قبل الدخول إلى الأداة"
        description="لم نعد نتعامل مع الحاسبات كصفحات معزولة فقط. هناك الآن مسارات عليا تجمع الأدوات المتقاربة في نية البحث حتى يصبح الاكتشاف أوضح للمستخدم ومحركات البحث."
        subtle
      >
        <div className="calc-related-grid">
          {CALCULATOR_HUBS.map((hub) => (
            <div key={hub.slug} className="calc-surface-card calc-related-card card-hover">
              <div className="p-6">
                <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-bold" style={{ background: hub.accentSoft, borderColor: 'var(--border-accent)', color: hub.accent }}>
                  {hub.badge}
                </div>
                <h3 className="calc-card-title">{hub.title}</h3>
                <p className="calc-card-description mt-2">{hub.description}</p>
                <Link href={hub.href} className="btn btn-primary--flat calc-button calc-inline-button mt-4">
                  افتح المسار
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="calculator-search-intents"
        eyebrow="عبارات البحث"
        title="أسئلة يكتبها الناس فعلاً قبل أن يصلوا إلى أي حاسبة"
        description="هذا القسم موجود كجزء مرئي من الصفحة نفسها حتى تفهم محركات البحث والزائر معاً ما الذي يغطيه القسم، وليس فقط من خلال الكلمات المفتاحية داخل metadata."
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud title="أقوى نيات البحث اليومية" items={TOP_SEARCH_INTENTS} />
          <CalculatorResourceLinks
            items={DAILY_WORKFLOWS}
            buttonLabel="ابدأ من هذا المسار"
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="calculator-benefits"
        eyebrow="لماذا هذا القسم؟"
        title="حاسبات عملية مبنية على سيناريوهات يستخدمها الناس فعلاً"
        description="كل صفحة صُممت حول نية بحث واضحة: من يريد حساب العمر يحتاج نتيجة دقيقة وقابلة للمشاركة، ومن يريد حساب نهاية الخدمة يحتاج أيضاً فهم المادة القانونية، ومن يبحث عن القسط الشهري يحتاج جدول سداد، ومن يحسب الضريبة يحتاج فرق الشامل وغير الشامل."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'التخطيط المالي الشخصي',
              description: 'عنقود جديد يجمع صندوق الطوارئ والديون والادخار وصافي الثروة.',
              content: 'هذا المسار يخاطب نيات بحث واسعة وعالية القيمة مثل: كم أحتاج صندوق طوارئ؟ متى أخلص من ديوني؟ كم أوفر شهرياً؟ وما صافي ثروتي الآن؟',
            },
            {
              title: 'حاسبات العمر',
              description: 'قسم كامل للعمر بالهجري والميلادي وفرق العمر وعدّاد عيد الميلاد.',
              content: 'مفيد للباحث عن حاسبة عمر شاملة، أو من يريد مقارنة عمر شخصين، أو فقط معرفة كم بقي على عيد ميلاده القادم بشكل واضح وقابل للمشاركة.',
            },
            {
              title: 'القسط الشهري',
              description: 'القسط، إجمالي الفوائد، والسداد المبكر في شاشة واحدة.',
              content: 'المستخدم لا يحتاج رقماً شهرياً فقط، بل يحتاج أن يرى التكلفة الكلية والفرق بين الفائدة الثابتة والمتناقصة وأثر المدة على العبء الشهري.',
            },
            {
              title: 'ضريبة القيمة المضافة',
              description: 'إضافة الضريبة أو استخراجها وصافي ضريبة الشهر.',
              content: 'مناسب لأصحاب المتاجر الصغيرة، موظفي المبيعات، والمستخدمين الذين يريدون فهم الفاتورة بسرعة دون فتح جداول خارجية.',
            },
            {
              title: 'النسبة المئوية الشاملة',
              description: 'أربع حاسبات في صفحة واحدة مع أمثلة جاهزة.',
              content: 'هذه الصفحة تخدم الخصومات والعلامات والزيادات والتغيرات السعرية، مع أدوات إضافية مثل الخصومات المتتالية وتقسيم المبالغ.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="calculator-categories"
        eyebrow="نظرة سريعة"
        title="ماذا ستجد داخل هذا القسم؟"
        description="كل بطاقة تقودك إلى صفحة مستقلة ذات هوية واضحة ومحتوى مهيأ لمحركات البحث."
      >
        <div className="calc-grid-4">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><Landmark size={16} /></div>
            <div className="calc-metric-card__value">9+</div>
            <div className="calc-metric-card__note">صفحات أساسية عالية النية</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><Calculator size={16} /></div>
            <div className="calc-metric-card__value">10+</div>
            <div className="calc-metric-card__note">أدوات مساعدة داخلية</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><ReceiptText size={16} /></div>
            <div className="calc-metric-card__value">عربي</div>
            <div className="calc-metric-card__note">واجهة ومحتوى مخصصان للمستخدم العربي</div>
          </div>
          <div className="calc-metric-card">
            <div className="calc-metric-card__label"><Percent size={16} /></div>
            <div className="calc-metric-card__value">4×1</div>
            <div className="calc-metric-card__note">ميزة صفحة النسبة المئوية</div>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
