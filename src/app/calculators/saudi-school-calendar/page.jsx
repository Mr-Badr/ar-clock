import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CountryFlag from '@/components/shared/CountryFlag';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'saudi-school-calendar');
const CONTENT = getFinancePageContent('saudi-school-calendar');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SCHOOL_CALENDAR_1448 = [
  {
    type: 'بداية العام الدراسي',
    emoji: '🎒',
    date: 'الأحد 23 أغسطس 2026',
    rule: 'عودة المعلمين والمعلمات قبلها بأسبوع (16 أغسطس 2026)',
    slug: 'school-start-saudi',
    label: 'عد تنازلي لبداية الدراسة',
    estimated: false,
  },
  {
    type: 'إجازة اليوم الوطني',
    emoji: '🇸🇦',
    date: '23–26 سبتمبر 2026',
    rule: 'الأربعاء إلى السبت — أربعة أيام',
    slug: 'saudi-national-day',
    label: 'عد تنازلي لليوم الوطني',
    estimated: false,
  },
  {
    type: 'إجازة الخريف',
    emoji: '🍂',
    date: '20–28 نوفمبر 2026',
    rule: 'الجمعة إلى السبت — تسعة أيام',
    slug: 'autumn-season',
    label: 'عد تنازلي لإجازة الخريف',
    estimated: false,
  },
  {
    type: 'إجازة منتصف العام',
    emoji: '📘',
    date: '8–16 يناير 2027',
    rule: 'الجمعة إلى السبت — تفصل بين الفصلين الأول والثاني',
    slug: 'winter-season',
    label: 'عد تنازلي لإجازة منتصف العام',
    estimated: false,
  },
  {
    type: 'إجازة يوم التأسيس',
    emoji: '🏛️',
    date: '19–22 فبراير 2027',
    rule: 'الخميس إلى الأحد — أربعة أيام',
    slug: 'saudi-founding-day',
    label: 'عد تنازلي ليوم التأسيس',
    estimated: false,
  },
  {
    type: 'إجازة عيد الفطر',
    emoji: '🌙',
    date: '26 فبراير – 13 مارس 2027 (تقديري)',
    rule: 'مرتبطة برؤية الهلال — قد تتغير بفارق يوم واحد',
    slug: 'eid-al-fitr',
    label: 'عد تنازلي لعيد الفطر',
    estimated: true,
  },
  {
    type: 'إجازة عيد الأضحى',
    emoji: '🕋',
    date: '7–22 مايو 2027 (تقديري)',
    rule: 'مرتبطة برؤية الهلال — قد تتغير بفارق يوم واحد',
    slug: 'eid-al-adha',
    label: 'عد تنازلي لعيد الأضحى',
    estimated: true,
  },
  {
    type: 'نهاية العام الدراسي',
    emoji: '☀️',
    date: 'الخميس 24 يونيو 2027',
    rule: 'بداية الإجازة الصيفية',
    slug: 'summer-vacation',
    label: 'عد تنازلي لنهاية العام',
    estimated: false,
  },
];

const CALENDAR_EXPLAINER = [
  {
    title: 'لماذا التقويم موزّع على فصلين؟',
    description: 'نظام الفصلين الدراسيين',
    content:
      'يعتمد التقويم الدراسي السعودي نظام الفصلين، بحيث تفصل إجازة منتصف العام بين الفصل الأول والثاني. هذا التوزيع يمنح فترات راحة منتظمة بدل التركيز على إجازة صيفية طويلة واحدة فقط.',
  },
  {
    title: 'لماذا تختلف إجازتا الفطر والأضحى كل سنة؟',
    description: 'التقويم الهجري يتقدم كل عام',
    content:
      'يعتمد عيدا الفطر والأضحى على التقويم الهجري القمري، الذي يتقدم نحو 10 إلى 11 يوماً كل سنة ميلادية. لهذا تختلف مواعيدهما في التقويم الدراسي من عام لآخر، والتاريخ المعروض هنا تقديري ريثما يصدر الإعلان الرسمي برؤية الهلال.',
  },
  {
    title: 'ماذا لو تغيّر التقويم رسمياً؟',
    description: 'تحديثات وزارة التعليم',
    content:
      'تعتمد وزارة التعليم التقويم الدراسي مسبقاً لعدة أعوام، لكنها قد تُصدر تعديلات طفيفة على إجازة بعينها. راجع موقع الوزارة الرسمي عند اقتراب أي إجازة للتأكد من عدم صدور تعديل.',
  },
  {
    title: 'كيف تخطط لإجازتك العائلية؟',
    description: 'استخدم الجدول والعداد معاً',
    content:
      'احفظ هذه الصفحة كمرجع لعائلتك طوال العام الدراسي. اضغط على رابط العداد الخاص بأي إجازة لمعرفة الأيام المتبقية بدقة، ورتّب حجوزات السفر أو الأنشطة العائلية قبل الزحام الذي يسبق كل إجازة مباشرة.',
  },
];

export default function SaudiSchoolCalendarPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

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
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
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
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="calc-product-page calc-saudi-school-calendar-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={PAGE.description}
        highlights={CONTENT.hero.highlights}
      />

      {/* School calendar table */}
      <CalculatorSection
        id="school-calendar"
        eyebrow="التقويم الكامل"
        title="كل مواعيد وإجازات العام الدراسي 1448"
        description="بداية الدراسة وكل إجازة رسمية — اضغط على العداد لرؤية الأيام المتبقية."
      >
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المناسبة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">ملاحظة</TableHead>
                <TableHead className="text-right">العداد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SCHOOL_CALENDAR_1448.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell className="font-medium">
                    <span className="me-1">
                      {row.emoji === '🇸🇦' ? <CountryFlag code="sa" /> : row.emoji}
                    </span>
                    {row.type}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-700 dark:text-green-400">{row.date}</span>
                    {row.estimated ? (
                      <span className="text-xs text-muted-foreground me-1"> (هلالي)</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.rule}</TableCell>
                  <TableCell>
                    <Link
                      href={`/holidays/${row.slug}`}
                      className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      {row.label} ←
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          مواعيد إجازتَي عيد الفطر وعيد الأضحى تقديرية ومرتبطة برؤية الهلال، وقد تتغير بفارق يوم واحد عن
          الإعلان الرسمي. باقي المواعيد معتمدة من وزارة التعليم ضمن خطة التقويم الدراسي للأعوام 1447–1450هـ.
        </p>
      </CalculatorSection>

      {/* Explainer cards */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن التقويم الدراسي 1448"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={CALENDAR_EXPLAINER.length}>
          {CALENDAR_EXPLAINER.map((item, index) => (
            <article key={item.title} className={`calc-editorial-card${index === 0 ? ' calc-editorial-card--lead' : ''}`} role="listitem">
              <div className="calc-editorial-card__meta">
                <span className="calc-editorial-card__index">{`0${index + 1}`.slice(-2)}</span>
              </div>
              <div className="calc-editorial-card__copy">
                <h3 className="calc-card-title">{item.title}</h3>
                {item.description ? <p className="calc-card-description">{item.description}</p> : null}
                <div className="calc-card-copy">{item.content}</div>
              </div>
            </article>
          ))}
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن التقويم الدراسي السعودي"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات تعليمية أخرى">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="saudi-school-calendar" />
      </CalculatorSection>
    </main>
  );
}
