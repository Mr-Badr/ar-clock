import { Calculator, Landmark, Percent, ReceiptText } from 'lucide-react';

import {
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorHubGrid,
  CalculatorInfoGrid,
  CalculatorSection,
} from '@/components/calculators/common';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'قسم الحاسبات',
  description:
    'قسم الحاسبات في ميقاتنا يجمع حاسبات العمر، مكافأة نهاية الخدمة، القسط الشهري، ضريبة القيمة المضافة، والنسبة المئوية في صفحات عربية سريعة وواضحة.',
  keywords: CALCULATOR_ROUTES.flatMap((item) => item.keywords),
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
        title="حاسبات عربية سريعة بصفحات كاملة وليست مجرد نماذج صغيرة"
        description="بَنينا هذا القسم ليغطي أكثر الحالات العملية التي تتكرر عند المستخدم العربي: العمر والتواريخ الشخصية، مستحقات العمل، تمويل القروض، ضريبة القيمة المضافة، ومسائل النسبة المئوية اليومية. كل صفحة تجمع الحاسبة مع الشرح والأمثلة والأسئلة الشائعة."
        accent="#2563EB"
        highlights={[
          'خمس وجهات رئيسية بدل أداة واحدة مزدحمة.',
          'نتائج مباشرة مع شروحات عربية واضحة.',
          'ربط داخلي بين الحاسبات لتسهيل التخطيط المالي.',
        ]}
      >
        <CalculatorHubGrid />
      </CalculatorHero>

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
              title: 'مكافأة نهاية الخدمة',
              description: 'حساب الاستحقاق الكامل أو الجزئي مع مقارنة أثر الانتظار بضعة أشهر.',
              content: 'مفيد للموظف الذي يفكر في الاستقالة أو يراجع تسوية نهاية العقد ويريد رقماً سريعاً قبل التوجه للمصدر الرسمي أو المستشار.',
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
            <div className="calc-metric-card__value">5</div>
            <div className="calc-metric-card__note">صفحات أساسية</div>
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
