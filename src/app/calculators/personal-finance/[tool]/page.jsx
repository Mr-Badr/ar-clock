import Link from 'next/link';
import { notFound } from 'next/navigation';

import DebtPayoffCalculator from '@/components/calculators/personal-finance/DebtPayoffCalculator.client';
import EmergencyFundCalculator from '@/components/calculators/personal-finance/EmergencyFundCalculator.client';
import NetWorthCalculator from '@/components/calculators/personal-finance/NetWorthCalculator.client';
import SavingsGoalCalculator from '@/components/calculators/personal-finance/SavingsGoalCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorSection,
  CalculatorSectionNav,
} from '@/components/calculators/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PERSONAL_FINANCE_TOOLS,
  getPersonalFinanceGuideBySlug,
  getPersonalFinanceToolBySlug,
  getRelatedPersonalFinanceTools,
} from '@/lib/calculators/personal-finance-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

const CALCULATOR_COMPONENTS = {
  'emergency-fund': EmergencyFundCalculator,
  'debt-payoff': DebtPayoffCalculator,
  'savings-goal': SavingsGoalCalculator,
  'net-worth': NetWorthCalculator,
};

export function generateStaticParams() {
  return PERSONAL_FINANCE_TOOLS.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getPersonalFinanceToolBySlug(toolSlug);
  if (!tool) return {};

  return buildCanonicalMetadata({
    title: tool.heroTitle,
    description: tool.description,
    keywords: tool.keywords,
    url: `${SITE_URL}${tool.href}`,
  });
}

export default async function PersonalFinanceToolPage({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getPersonalFinanceToolBySlug(toolSlug);
  const CalculatorComponent = CALCULATOR_COMPONENTS[toolSlug];
  if (!tool || !CalculatorComponent) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'التخطيط المالي الشخصي', item: `${SITE_URL}/calculators/personal-finance` },
      { '@type': 'ListItem', position: 4, name: tool.title, item: `${SITE_URL}${tool.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: tool.href,
    name: tool.title,
    description: tool.description,
    about: tool.keywords.slice(0, 8),
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const relatedTools = getRelatedPersonalFinanceTools(tool.slug);
  const relatedGuides = tool.guideSlugs.map((slug) => getPersonalFinanceGuideBySlug(slug)).filter(Boolean);

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CalculatorHero
        badge={tool.badge}
        title={tool.heroTitle}
        description={tool.description}
        accent={tool.accent}
        highlights={[
          'صفحة تبني القرار ثم تعطي الرقم، لا مجرد فورم جامد.',
          'ترتبط بأدلة تعليمية وأسئلة شائعة وروابط داخلية منطقية.',
          'مكتوبة حول الصيغة التي يبحث بها المستخدم العربي فعلاً.',
        ]}
      >
        <CalculatorComponent />
      </CalculatorHero>

      <CalculatorSection
        id="pf-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة أداة + شرح + توجيه"
        description="هذا النموذج يساعد الصفحة على أن تكون أقوى من مجرد أداة معزولة، ويمنحها إشارات أوضح للفهرسة والنقر."
      >
        <CalculatorSectionNav items={tool.navItems} />
      </CalculatorSection>

      <CalculatorSection
        id="pf-intents"
        eyebrow="نية البحث"
        title="الأسئلة والكلمات التي تستهدفها الصفحة"
        description="الهدف هنا هو مطابقة سؤال المستخدم كما يكتبه، ثم تحويله إلى جواب سريع ومسار واضح."
        subtle
      >
        <CalculatorIntentCloud items={tool.intentKeywords} />
      </CalculatorSection>

      <CalculatorSection
        id="pf-answers"
        eyebrow="إجابات سريعة"
        title="ماذا ينتظر الزائر قبل أن يتفاعل مع الحاسبة؟"
        description="هذه الكتل تقوي فهم Google والإنسان للصفحة، وتزيد من قيمة الزيارة قبل حتى إدخال الأرقام."
      >
        <CalculatorQuickAnswerGrid items={tool.quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="pf-content"
        eyebrow="شرح عملي"
        title="ما الذي يجعل هذه الصفحة مفيدة فعلاً؟"
        description="النتيجة وحدها لا تكفي. لهذا أضفنا شرحاً سريعاً يربط الرقم بالقرار الحقيقي الذي يحاول المستخدم أخذه."
        subtle
      >
        <CalculatorInfoGrid items={tool.infoItems} />
      </CalculatorSection>

      <CalculatorSection
        id="pf-next"
        eyebrow="روابط داخلية"
        title="ماذا بعد هذه الصفحة؟"
        description="هذا الربط ليس شكلياً. هو جزء من الرحلة نفسها: من الطوارئ إلى الادخار، ومن الديون إلى الأولويات، ومن صافي الثروة إلى فهم الأصول والالتزامات."
      >
        <div className="calc-related-grid">
          {relatedTools.map((item) => (
            <Card key={item.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={item.href} className="btn btn-primary--flat calc-button calc-inline-button">
                  افتح الحاسبة
                </Link>
              </CardContent>
            </Card>
          ))}
          {relatedGuides.map((guide) => (
            <Card key={guide.slug} className="calc-surface-card calc-related-card card-hover">
              <CardHeader>
                <CardTitle className="calc-card-title">{guide.title}</CardTitle>
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
        eyebrow="FAQ"
        title="الأسئلة الشائعة"
        description="أسئلة قصيرة تلتقط نيات بحث داعمة وتقوي الصفحة تعليمياً."
      >
        <CalculatorFaqSection items={tool.faqItems} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
