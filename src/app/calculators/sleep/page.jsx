import Link from 'next/link';

import {
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import {
  SLEEP_GUIDES,
  SLEEP_HUB,
  SLEEP_MODES,
  SLEEP_TOOLS,
} from '@/lib/sleep/content';

const SITE_URL = getSiteUrl();

const hubFaqItems = [
  {
    question: 'هل هذا القسم مجرد حاسبة وقت نوم عادية؟',
    answer: 'لا. الفكرة هنا هي نظام نوم عربي يربط وقت النوم والاستيقاظ بالقيلولة ودين النوم والاحتياج حسب العمر والمحتوى التعليمي الداعم.',
  },
  {
    question: 'هل تعتمد هذه الأدوات على حقيقة طبية صارمة لكل شخص؟',
    answer: 'لا. الأدوات صادقة وتستخدم تقديرات عملية مثل دورات النوم ووقت الغفو لمساعدتك على التخطيط، لا لتقديم قياس طبي فردي دقيق.',
  },
  {
    question: 'من أين أبدأ إذا كنت فقط أريد أن أعرف متى أنام؟',
    answer: 'ابدأ من أداة "متى أنام لأستيقظ في الوقت المناسب؟" وإذا كانت حاجتك فورية الآن فابدأ من "إذا نمت الآن، متى أستيقظ؟".',
  },
];

export const metadata = buildCanonicalMetadata({
  title: SLEEP_HUB.heroTitle,
  description: 'خطط نومك بطريقة أذكى: احسب وقت النوم والاستيقاظ، دورات النوم، القيلولة، ودين النوم بأدوات عربية سريعة وواضحة.',
  keywords: [
    ...SLEEP_HUB.keywords,
    ...SLEEP_TOOLS.flatMap((tool) => tool.keywords.slice(0, 4)),
  ],
  url: `${SITE_URL}${SLEEP_HUB.href}`,
});

export default function SleepHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات النوم الذكي',
    url: `${SITE_URL}${SLEEP_HUB.href}`,
    inLanguage: 'ar',
    description: SLEEP_HUB.description,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SLEEP_TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.href}`,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <CalculatorHero
        badge="النوم الذكي"
        title="حاسبات النوم الذكي"
        description="هذا ليس مجرد سؤال: متى أنام؟ بل نظام يساعدك على تنظيم نومك: وقت النوم، وقت الاستيقاظ، مدة النوم الفعلية، القيلولة، دين النوم، والاحتياج حسب العمر في مسار واحد واضح."
        accent="#4F46E5"
        highlights={SLEEP_HUB.highlights}
      >
        <div className="calc-app">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">ابدأ من هنا</div>
            <div className="calc-metric-card__value">أريد معرفة متى أنام | أريد معرفة متى أستيقظ | أريد تحسين نومي</div>
            <div className="calc-metric-card__note">الفكرة هنا أن تدخل من مشكلتك اليومية لا من اسم الحاسبة فقط، حتى تصل للأداة المناسبة أسرع.</div>
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="sleep-hub-map"
        eyebrow="خريطة القسم"
        title="ابدأ من المشكلة التي تحاول حلها"
        description="هذا القسم منظم كـ hub واضح: أدوات يومية، تشخيص ذاتي خفيف، وأدلة تعليمية تدفعك من السؤال إلى الأداة المناسبة."
      >
        <CalculatorSectionNav
          items={[
            { href: '#sleep-start', label: 'ابدأ من هنا', description: 'أستيقظ متعباً؟ أنام متأخراً؟ أريد قيلولة؟' },
            { href: '#sleep-tools', label: 'الأدوات الأساسية', description: 'الصفحات الست التي تبدأ بها المنظومة' },
            { href: '#sleep-modes', label: 'Sleep Modes', description: 'أنماط استخدام يومية واضحة' },
            { href: '#sleep-guides', label: 'الأدلة التعليمية', description: 'شبكة محتوى داعمة للفهرسة والرجوع' },
            { href: '#sleep-faq', label: 'FAQ', description: 'أسئلة شائعة قبل أن تبدأ' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-start"
        eyebrow="ابدأ من هنا"
        title="ما الذي تريد حله اليوم؟"
        description="هذه البطاقات ترجمة مباشرة لنية المستخدم، لا مجرد أسماء أدوات تقنية."
        subtle
      >
        <div className="calc-related-grid">
          {[
            {
              title: 'أستيقظ متعباً',
              description: 'ابدأ من مدة النوم الفعلية أو دين النوم إذا كنت تشعر أن المشكلة تتكرر طوال الأسبوع.',
              href: '/calculators/sleep/sleep-duration',
            },
            {
              title: 'أنام متأخراً وأريد وقتاً واضحاً',
              description: 'ابدأ من حاسبة وقت النوم ثم راجع النطاق المناسب لعُمرك.',
              href: '/calculators/sleep/bedtime',
            },
            {
              title: 'أريد قيلولة مفيدة',
              description: 'اختر نوع القيلولة ووقت بدايتها، وستعرف متى تستيقظ دون خمول زائد.',
              href: '/calculators/sleep/nap-calculator',
            },
            {
              title: 'أظن أن عندي نقص نوم',
              description: 'اجمع أسبوعك كله في شاشة واحدة لتعرف هل التعب سببه عجز متراكم فعلاً.',
              href: '/calculators/sleep/sleep-debt',
            },
          ].map((item) => (
            <Card key={item.href} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{item.title}</CardTitle>
                <CardDescription className="calc-card-description">{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button">
                  افتح الأداة
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sleep-tools"
        eyebrow="الأدوات الأساسية"
        title="المنظومة التي تطبق يومياً أو أسبوعياً"
        description="الأدوات هنا متنوعة عمداً: واحدة للتخطيط، وأخرى للحظة الحالية، وثالثة للفهم، ورابعة للتعب المتراكم."
      >
        <div className="calc-related-grid">
          {SLEEP_TOOLS.map((tool) => (
            <Card key={tool.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{tool.title}</CardTitle>
                <CardDescription className="calc-card-description">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={tool.href} className="btn btn-primary--flat calc-button calc-inline-button">
                  افتح الحاسبة
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sleep-modes"
        eyebrow="Sleep Modes"
        title="أنماط استخدام تجعل النظام غير ممل"
        description="بدل أداة جامدة، هناك سياقات استخدام يومية: دوام، دراسة، شفتات، قيلولة، سفر، واستيقاظ مبكر."
        subtle
      >
        <div className="calc-related-grid">
          {SLEEP_MODES.map((mode) => (
            <Card key={mode.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{mode.title}</CardTitle>
                <CardDescription className="calc-card-description">{mode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={mode.href} className="btn btn-secondary calc-button calc-inline-button">
                  افتح الوضع المناسب
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sleep-guides"
        eyebrow="الأدلة التعليمية"
        title="صفحات تلتقط أسئلة كثيرة وتغذي الأدوات"
        description="هذه الأدلة ليست مقالات للزينة. كل واحدة تلتقط سؤالاً تعليمياً ثم تدفع المستخدم إلى الأداة المناسبة داخل المنظومة."
      >
        <div className="calc-related-grid">
          {SLEEP_GUIDES.map((guide) => (
            <Card key={guide.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{guide.title}</CardTitle>
                <CardDescription className="calc-card-description">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={guide.href} className="btn btn-secondary calc-button calc-inline-button">
                  افتح الدليل
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sleep-faq"
        eyebrow="الأسئلة الشائعة"
        title="FAQ قصيرة قبل الدخول"
        description="إجابات سريعة تساعد الزائر على فهم القسم قبل أن يختار الأداة المناسبة."
      >
        <CalculatorFaqSection items={hubFaqItems} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
