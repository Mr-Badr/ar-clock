import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'saudi-pay-dates');
const CONTENT = getFinancePageContent('saudi-pay-dates');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SAUDI_PAY_SCHEDULE = [
  {
    type: 'الراتب الحكومي',
    emoji: '🏛️',
    day: 'يوم 27',
    rule: 'ميلادي — إذا صادف جمعة أو إجازة صُرف قبله',
    authority: 'وزارة المالية',
    slug: 'salary-day-saudi',
    label: 'عد تنازلي لراتب السعودية',
    note: 'يشمل موظفي الحكومة والجيش والأمن',
  },
  {
    type: 'حساب المواطن',
    emoji: '👨‍👩‍👧',
    day: 'يوم 10',
    rule: 'ميلادي — دفعات ربع سنوية (3 أشهر دفعة)',
    authority: 'برنامج حساب المواطن',
    slug: 'citizen-account-saudi',
    label: 'عد تنازلي لحساب المواطن',
    note: 'يختلف بحسب فئة الأسرة ودخلها',
  },
  {
    type: 'راتب التقاعد',
    emoji: '👴',
    day: 'يوم 1',
    rule: 'ميلادي — أول الشهر',
    authority: 'هيئة التقاعد',
    slug: 'pension-day-saudi',
    label: 'عد تنازلي لراتب التقاعد',
    note: 'للمتقاعدين المدنيين والعسكريين',
  },
  {
    type: 'حافز (الباحثون عن عمل)',
    emoji: '💼',
    day: 'يوم 5',
    rule: 'ميلادي — شرط تفعيل البحث الشهري',
    authority: 'وزارة الموارد البشرية',
    slug: 'hafez-saudi',
    label: 'عد تنازلي لحافز',
    note: 'يشترط التسجيل النشط في برنامج حافز',
  },
  {
    type: 'الضمان الاجتماعي المطوّر',
    emoji: '🤝',
    day: 'يوم 1',
    rule: 'ميلادي — أول الشهر',
    authority: 'وزارة الموارد البشرية',
    slug: 'social-security-saudi',
    label: 'عد تنازلي للضمان الاجتماعي',
    note: 'للأسر والأفراد المستوفين لشروط الأهلية',
  },
  {
    type: 'دعم السكن',
    emoji: '🏠',
    day: 'يوم 24',
    rule: 'ميلادي',
    authority: 'برنامج سكني',
    slug: 'housing-support-saudi',
    label: 'عد تنازلي لدعم السكن',
    note: 'دعم الإيجار والتمويل العقاري المدعوم',
  },
  {
    type: 'برنامج الدعم الإضافي (رمل)',
    emoji: '🔶',
    day: 'يوم 1',
    rule: 'ميلادي',
    authority: 'وزارة المالية',
    slug: 'sand-payment-saudi',
    label: 'عد تنازلي لدعم رمل',
    note: 'دعم تكيّف الأسعار للأسر المستحقة',
  },
];

const PAY_EXPLAINER = [
  {
    title: 'لماذا مواعيد الصرف مختلفة لكل برنامج؟',
    description: 'كل جهة تختار يومها بحسب دورتها المالية',
    content:
      'الراتب الحكومي يرتبط باليوم 27 لأن الوزارة تحتاج وقتاً لمعالجة كشوف الرواتب. حساب المواطن يُصرف في اليوم 10 لأن دوراته ربع سنوية. حافز يُصرف في اليوم 5 لأنه مرتبط بجداول وزارة الموارد البشرية. معرفة منطق كل موعد يساعدك في التخطيط المسبق دون الحاجة إلى انتظار الإعلان كل مرة.',
  },
  {
    title: 'متى يتأخر الراتب أو يتقدم؟',
    description: 'الإجازات الرسمية والمناسبات الوطنية',
    content:
      'في المناسبات الوطنية الكبرى (اليوم الوطني، العيدان، غيرها) تُصدر الجهات المعنية قرارات بتقديم الصرف يوماً أو يومين. لا تُعلَن هذه القرارات مسبقاً في الغالب — تابع الحساب الرسمي لكل برنامج على تويتر أو الموقع الإلكتروني في الأيام التي تسبق الموعد.',
  },
  {
    title: 'الفرق بين موعد الإيداع وموعد الاستلام',
    description: 'إيداع البنك ≠ ظهور في الرصيد',
    content:
      'يُودَع الراتب رسمياً في اليوم المحدد، لكن ظهوره في رصيد الحساب قد يستغرق بضع ساعات بحسب بنكك. إذا لم يظهر الراتب بحلول نهاية يوم الصرف، تواصل مع البنك أولاً قبل مراجعة الجهة الحكومية.',
  },
  {
    title: 'كيف تستخدم هذه الصفحة بشكل عملي',
    description: 'خطة متابعة بسيطة للمستفيدين المتعددين',
    content:
      'إذا كنت تستفيد من أكثر من برنامج (مثلاً راتب حكومي + حساب المواطن + دعم سكن)، احفظ هذه الصفحة كمرجع شهري. اضغط على رابط العداد الخاص بكل موعد لترى الأيام المتبقية بدقة. ورتّب مصروفك مسبقاً بحسب ترتيب المواعيد من أول الشهر إلى آخره.',
  },
];

export default function SaudiPayDatesPage() {
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
    <main className="calc-product-page calc-saudi-pay-dates-page bg-base text-primary" dir="rtl" lang="ar">
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

      {/* Pay schedule table */}
      <CalculatorSection
        id="pay-schedule"
        eyebrow="جدول المواعيد"
        title="جميع مواعيد الرواتب والدعم في السعودية"
        description="قاعدة كل صرف والموعد المعتاد — اضغط على العداد لرؤية الأيام المتبقية."
      >
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">موعد الصرف</TableHead>
                <TableHead className="text-right">الجهة</TableHead>
                <TableHead className="text-right">ملاحظة</TableHead>
                <TableHead className="text-right">العداد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SAUDI_PAY_SCHEDULE.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell className="font-medium">
                    <span className="me-1">{row.emoji}</span>
                    {row.type}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-700 dark:text-green-400">{row.day}</span>
                    <span className="text-sm text-muted-foreground me-1"> — </span>
                    <span className="text-sm text-muted-foreground">{row.rule}</span>
                  </TableCell>
                  <TableCell className="text-sm">{row.authority}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.note}</TableCell>
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
          المواعيد أعلاه هي الأنماط الشهرية المعتمدة. في حالات استثنائية (إجازات رسمية، مناسبات وطنية) قد تُصدر الجهات المختصة قرارات بتقديم الصرف. راجع الإعلان الرسمي لكل برنامج للتأكيد.
        </p>
      </CalculatorSection>

      {/* Explainer cards */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن مواعيد الصرف السعودية"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={PAY_EXPLAINER.length}>
          {PAY_EXPLAINER.map((item, index) => (
            <article key={item.title} className={`calc-editorial-card${index === 0 ? ' calc-editorial-card--lead' : ''}`} role="listitem">
              <div className="calc-editorial-card__meta">
                <span className="calc-editorial-card__index">{`0${index + 1}`.slice(-2)}</span>
                {item.description ? <p className="calc-card-description">{item.description}</p> : null}
              </div>
              <div className="calc-editorial-card__copy">
                <h3 className="calc-card-title">{item.title}</h3>
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
        title="أسئلة عن مواعيد الرواتب والدعم السعودية"
        showAdBefore
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <RelatedCalculators currentSlug="saudi-pay-dates" />
      </CalculatorSection>
    </main>
  );
}
