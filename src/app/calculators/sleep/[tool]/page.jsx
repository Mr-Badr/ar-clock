import Link from 'next/link';
import { notFound } from 'next/navigation';

import BedtimeCalculator from '@/components/calculators/sleep/BedtimeCalculator.client';
import NapCalculator from '@/components/calculators/sleep/NapCalculator.client';
import SleepDebtCalculator from '@/components/calculators/sleep/SleepDebtCalculator.client';
import SleepDurationCalculator from '@/components/calculators/sleep/SleepDurationCalculator.client';
import SleepNeedsByAgeCalculator from '@/components/calculators/sleep/SleepNeedsByAgeCalculator.client';
import WakeTimeCalculator from '@/components/calculators/sleep/WakeTimeCalculator.client';
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
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import {
  SLEEP_MODES,
  SLEEP_TOOLS,
  getRelatedSleepTools,
  getSleepGuideBySlug,
  getSleepToolBySlug,
} from '@/lib/sleep/content';

const SITE_URL = getSiteUrl();

const CALCULATOR_COMPONENTS = {
  bedtime: BedtimeCalculator,
  'wake-time': WakeTimeCalculator,
  'sleep-duration': SleepDurationCalculator,
  'nap-calculator': NapCalculator,
  'sleep-debt': SleepDebtCalculator,
  'sleep-needs-by-age': SleepNeedsByAgeCalculator,
};

export function generateStaticParams() {
  return SLEEP_TOOLS.map((tool) => ({ tool: tool.slug }));
}

export async function generateMetadata({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getSleepToolBySlug(toolSlug);
  if (!tool) return {};

  return buildCanonicalMetadata({
    title: tool.heroTitle,
    description: tool.description,
    keywords: tool.keywords,
    url: `${SITE_URL}${tool.href}`,
  });
}

export default async function SleepToolPage({ params }) {
  const { tool: toolSlug } = await params;
  const tool = getSleepToolBySlug(toolSlug);
  const CalculatorComponent = CALCULATOR_COMPONENTS[toolSlug];
  if (!tool || !CalculatorComponent) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الحاسبات', item: `${SITE_URL}/calculators` },
      { '@type': 'ListItem', position: 3, name: 'حاسبات النوم الذكي', item: `${SITE_URL}/calculators/sleep` },
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

  const relatedTools = getRelatedSleepTools(tool.slug);
  const relatedGuides = tool.guideSlugs.map((slug) => getSleepGuideBySlug(slug)).filter(Boolean);
  const modeCards = SLEEP_MODES.filter((mode) => mode.href === tool.href || (tool.relatedToolSlugs || []).some((slug) => mode.href.endsWith(slug)));

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
          'جواب سريع أولاً، ثم أداة، ثم تفسير مختصر لا يترك الزائر أمام رقم بلا معنى.',
          'كل صفحة هنا مرتبطة بسؤال عربي مباشر وصيغة بحث فعلية يمكن أن تأخذ impressions واضحة.',
          'هناك ملاحظة علمية صادقة داخل كل أداة حتى لا تتحول النتيجة إلى ادعاء دقة زائفة.',
        ]}
      >
        <CalculatorComponent />
      </CalculatorHero>

      <CalculatorSection
        id="sleep-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة أداة + تفسير + خطوة تالية"
        description="هذا البناء يجعل الصفحة أقوى في الفهرسة والنقر من صفحة فورم صامتة تعطي وقتاً فقط."
      >
        <CalculatorSectionNav items={tool.navItems} />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-intents"
        eyebrow="نية البحث"
        title="الأسئلة والعبارات التي جاءت هذه الصفحة لالتقاطها"
        description="كل أداة هنا كتبت حول سؤال حقيقي قد يكتبه المستخدم العربي في Google، لا حول اسم تقني جامد."
        subtle
      >
        <CalculatorIntentCloud items={tool.intentKeywords} />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-answers"
        eyebrow="إجابات سريعة"
        title="ماذا يريد الزائر أن يقرأ قبل أن يستخدم الحاسبة؟"
        description="هذا الجزء يحسّن فهم الصفحة ويقوي نيتها ويعطي الزائر قيمة فورية قبل التفاعل."
      >
        <CalculatorQuickAnswerGrid items={tool.quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="sleep-content"
        eyebrow="شرح عملي"
        title="كيف تجعل النتيجة مفيدة فعلاً؟"
        description="الرقم أو الوقت وحده لا يكفي. القيمة الحقيقية هنا هي كيف تفسره وتحوّله إلى خطوة عملية في يومك."
        subtle
      >
        <CalculatorInfoGrid items={tool.infoItems} />
      </CalculatorSection>

      {modeCards.length ? (
        <CalculatorSection
          id="sleep-modes"
          eyebrow="Sleep Modes"
          title="أنماط استخدام مرتبطة بهذه الأداة"
          description="هذه الصفحة ليست معزولة، بل جزء من نظام نوم يمكن استخدامه حسب السياق اليومي."
        >
          <div className="calc-related-grid">
            {modeCards.map((mode) => (
              <Card key={mode.slug} className="calc-surface-card calc-related-card card-hover">
                <CardHeader>
                  <CardTitle className="calc-card-title">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent className="calc-card-copy">
                  <p>{mode.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CalculatorSection>
      ) : null}

      <CalculatorSection
        id="sleep-next"
        eyebrow="جرّب أيضاً"
        title="لا تتوقف عند أداة واحدة"
        description="الهدف من النظام أن يأخذك من سؤال إلى سؤال مرتبط به منطقياً: من الوقت إلى الجودة، ومن القيلولة إلى دين النوم، ومن العمر إلى التخطيط اليومي."
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
        id="sleep-faq"
        eyebrow="FAQ"
        title="الأسئلة الشائعة"
        description="أسئلة قصيرة تلتقط نيات بحث داعمة وتزيد قيمة الصفحة تعليمياً."
      >
        <CalculatorFaqSection items={tool.faqItems} />
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
