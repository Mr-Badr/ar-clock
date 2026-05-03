import Link from 'next/link';

import {
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PERSONAL_FINANCE_GUIDES,
  PERSONAL_FINANCE_HUB,
  PERSONAL_FINANCE_TOOLS,
} from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

const hubFaqItems = [
  {
    question: 'ما الذي أبدأ به إذا كان عندي ديون ولا أملك ادخاراً؟',
    answer: 'ابدأ باحتياطي صغير للطوارئ ثم انتقل إلى حاسبة سداد الديون حتى لا تضطر للعودة إلى الاقتراض عند أول ظرف مفاجئ.',
  },
  {
    question: 'هل هذه الصفحات مجرد حاسبات أم معها شروحات أيضاً؟',
    answer: 'القسم مبني على نموذج حاسبة + شرح + روابط إرشادية، حتى لا تبقى النتيجة رقمية فقط من دون فهم أو خطوة تالية واضحة.',
  },
  {
    question: 'لماذا هذه الصفحة مهمة كـ hub؟',
    answer: 'لأن المستخدم لا يبحث دائماً باسم الحاسبة التقني، بل يبحث غالباً عن هدفه المالي: ديون، ادخار، أمان مالي، أو معرفة وضعه الحالي. والصفحة الجامعة توجهه من هذا الهدف إلى الأداة المناسبة.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PERSONAL_FINANCE_HUB.heroTitle,
  description: 'احسب صندوق الطوارئ، خطة سداد الديون، الادخار الشهري، وصافي ثروتك بأدوات عربية بسيطة وسريعة مع صفحات داعمة وروابط داخلية قوية.',
  keywords: [
    ...PERSONAL_FINANCE_HUB.keywords,
    ...PERSONAL_FINANCE_TOOLS.flatMap((tool) => tool.keywords.slice(0, 4)),
  ],
  url: `${SITE_URL}${PERSONAL_FINANCE_HUB.href}`,
});

export default function PersonalFinanceHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'حاسبات التخطيط المالي الشخصي',
    url: `${SITE_URL}${PERSONAL_FINANCE_HUB.href}`,
    inLanguage: 'ar',
    description: PERSONAL_FINANCE_HUB.description,
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PERSONAL_FINANCE_TOOLS.map((tool, index) => ({
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
        badge="تخطيط مالي شخصي"
        title="حاسبات التخطيط المالي الشخصي"
        description="ابدأ من هدفك المالي مباشرة: إذا كان عندك ديون فابدأ بخطة السداد، وإذا كنت تريد الأمان المالي فابدأ بصندوق الطوارئ، وإذا كنت تطارد هدفاً مالياً فابدأ بالادخار الشهري، وإذا كنت تريد صورة أوضح عن وضعك الحالي فابدأ بصافي الثروة."
        accent="#2563EB"
        highlights={PERSONAL_FINANCE_HUB.highlights}
      >
        <div className="calc-app">
          <div className="calc-metric-card">
            <div className="calc-metric-card__label">ابدأ من هنا</div>
            <div className="calc-metric-card__value">لدي ديون | أريد الادخار | أريد الأمان المالي | أريد معرفة وضعي المالي</div>
            <div className="calc-metric-card__note">هذا القسم منظم حول الأهداف، لا حول أسماء الأدوات فقط، حتى يصل المستخدم إلى الصفحة المناسبة أسرع.</div>
          </div>
        </div>
      </CalculatorHero>

      <CalculatorSection
        id="pf-hub-map"
        eyebrow="خريطة القسم"
        title="شريط ابدأ من هنا"
        description="هذه الخطوة تترجم نية الباحث إلى الأداة المناسبة بدل أن تتركه يحتار بين أسماء الحاسبات."
      >
        <CalculatorSectionNav
          items={[
            { href: '#pf-tools', label: 'الأدوات الأربع', description: 'الأكثر استخداماً في المرحلة الأولى' },
            { href: '#pf-guides', label: 'الأدلة الأساسية', description: 'صفحات داعمة تلتقط نيات البحث التعليمية' },
            { href: '#pf-longtail', label: 'أسئلة تفصيلية', description: 'صفحات أقرب للأسئلة الفعلية في Google' },
            { href: '#pf-faq', label: 'FAQ', description: 'أسئلة شائعة قبل فتح الأدوات' },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="pf-tools"
        eyebrow="الأكثر استخدامًا"
        title="الأدوات الأربع الأساسية"
        description="هذه ليست حاسبات هامشية. إنها عنقود صغير قوي يمكنه أن يجلب طلباً فعلياً ثم يمرر المستخدم من أداة إلى أخرى داخل نفس الرحلة."
        subtle
      >
        <div className="calc-related-grid">
          {PERSONAL_FINANCE_TOOLS.map((tool) => (
            <Card key={tool.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{tool.title}</CardTitle>
                <CardDescription className="calc-card-description">
                  {tool.description}
                </CardDescription>
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
        id="pf-guides"
        eyebrow="اقرأ أيضًا"
        title="صفحات داعمة ترفع قيمة القسم"
        description="هذه الصفحات ليست للزينة. هي تلتقط نيات تعليمية مثل: ما هو صندوق الطوارئ؟ أو كرة الثلج أم الانهيار؟ ثم تغذي الحاسبات بروابط داخلية منطقية."
      >
        <div className="calc-related-grid">
          {PERSONAL_FINANCE_GUIDES.slice(0, 4).map((guide) => (
            <Card key={guide.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{guide.title}</CardTitle>
                <CardDescription className="calc-card-description">
                  {guide.description}
                </CardDescription>
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
        id="pf-longtail"
        eyebrow="أسئلة تفصيلية"
        title="أسئلة أقرب لما يكتبه الباحث فعلاً"
        description="هذه الصفحات التفصيلية مهمة لالتقاط أسئلة مثل: كم شهرًا يجب أن يغطي صندوق الطوارئ؟ وكيف أسدد ديوني بسرعة؟ ثم تمرير الزائر إلى الحاسبة المناسبة."
        subtle
      >
        <div className="calc-related-grid">
          {PERSONAL_FINANCE_GUIDES.slice(4).map((guide) => (
            <Card key={guide.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{guide.title}</CardTitle>
                <CardDescription className="calc-card-description">
                  {guide.description}
                </CardDescription>
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
        id="pf-faq"
        eyebrow="الأسئلة الشائعة"
        title="FAQ مختصر قبل الدخول"
        description="إجابات سريعة تساعد الزائر على معرفة أين يبدأ داخل القسم."
      >
        <CalculatorFaqSection items={hubFaqItems} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
