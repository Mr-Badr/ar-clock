import { cacheLife, cacheTag } from 'next/cache';
import Link from 'next/link';

import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getHolidayCoreEventBySlug } from '@/lib/holidays/repository';
import { getNextEventDate, formatGregorianAr } from '@/lib/holidays-engine';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'gulf-pay-dates');
const CONTENT = getFinancePageContent('gulf-pay-dates');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const GULF_COUNTRIES = {
  sa: { name: 'السعودية', flag: '🇸🇦' },
  ae: { name: 'الإمارات', flag: '🇦🇪' },
  kw: { name: 'الكويت', flag: '🇰🇼' },
  qa: { name: 'قطر', flag: '🇶🇦' },
  bh: { name: 'البحرين', flag: '🇧🇭' },
  om: { name: 'عُمان', flag: '🇴🇲' },
};

const GULF_PAY_SLUGS_META = {
  'salary-day-saudi': { authority: 'وزارة المالية' },
  'salary-day-uae': { authority: 'نظام حماية الأجور' },
  'salary-day-kuwait': { authority: 'ديوان الخدمة المدنية' },
  'salary-day-qatar': { authority: 'وزارة المالية' },
  'salary-day-bahrain': { authority: 'جهاز الخدمة المدنية' },
  'salary-day-oman': { authority: 'وزارة العمل' },
  'pension-day-saudi': { authority: 'هيئة التقاعد' },
  'pension-day-uae': { authority: 'الهيئة العامة للمعاشات' },
  'pension-day-kuwait': { authority: 'الهيئة العامة للتأمينات الاجتماعية' },
  'pension-day-bahrain': { authority: 'هيئة التأمينات الاجتماعية' },
  'pension-day-oman': { authority: 'الهيئة العامة للتأمينات الاجتماعية' },
  'citizen-account-saudi': { authority: 'برنامج حساب المواطن' },
  'hafez-saudi': { authority: 'صندوق الموارد البشرية' },
  'housing-support-saudi': { authority: 'برنامج سكني' },
  'reef-support-saudi': { authority: 'وزارة البيئة والمياه والزراعة' },
  'sand-payment-saudi': { authority: 'التأمينات الاجتماعية GOSI' },
  'social-security-saudi': { authority: 'وزارة الموارد البشرية' },
  'housing-allowance-kuwait': { authority: 'وزارة الشؤون الاجتماعية' },
  'national-labor-support-kuwait': { authority: 'الهيئة العامة للقوى العاملة' },
  'social-assistance-kuwait': { authority: 'وزارة الشؤون الاجتماعية' },
  'cost-of-living-allowance-bahrain': { authority: 'الحكومة البحرينية' },
  'social-assistance-bahrain': { authority: 'وزارة التنمية الاجتماعية' },
  'job-security-oman': { authority: 'الحماية الاجتماعية' },
  'social-security-qatar': { authority: 'وزارة التنمية الاجتماعية' },
  'nafis-uae': { authority: 'برنامج نافس' },
};

function buildGulfPayRows(nowMs) {
  const rows = [];

  for (const [slug, meta] of Object.entries(GULF_PAY_SLUGS_META)) {
    const core = getHolidayCoreEventBySlug(slug);
    if (!core) continue;

    const country = GULF_COUNTRIES[core._countryCode] || null;
    const nextDate = getNextEventDate(core, {}, nowMs);
    const daysRemaining = Math.max(0, Math.ceil((nextDate.getTime() - nowMs) / 86_400_000));

    rows.push({
      slug,
      program: core.name,
      country: country?.name || '',
      flag: country?.flag || '',
      authority: meta.authority,
      nextDate,
      daysRemaining,
    });
  }

  rows.sort((left, right) => left.nextDate.getTime() - right.nextDate.getTime());
  return rows;
}

const PAY_EXPLAINER = [
  {
    title: 'لماذا تختلف مواعيد الصرف بين دول الخليج؟',
    description: 'كل دولة تختار يومها بحسب دورتها المالية',
    content:
      'الكويت وقطر تصرفان الراتب الحكومي في اليوم الأول من الشهر التالي، بينما تعتمد البحرين اليوم 22 والسعودية اليوم 27 والإمارات اليوم 25 وعُمان اليوم 28. هذا الفارق ناتج عن اختلاف دورة معالجة كشوف الرواتب في كل جهاز حكومي، وليس تأخيراً أو خللاً.',
  },
  {
    title: 'متى يتأخر الراتب أو يتقدم؟',
    description: 'قاعدة العطلة الأسبوعية والمناسبات الوطنية',
    content:
      'أغلب دول الخليج تُقدّم الصرف إلى آخر يوم عمل قبل العطلة إذا وافق الموعد إجازة نهاية أسبوع أو مناسبة رسمية. الكويت تحديداً تستثني الجمعة والسبت وتصرف الراتب يوم الخميس في هذه الحالة. راجع صفحة كل دولة للقاعدة الدقيقة.',
  },
  {
    title: 'الفرق بين موعد الإيداع وموعد الاستلام',
    description: 'إيداع الجهة الحكومية ≠ ظهور المبلغ في حسابك',
    content:
      'يُودَع الراتب أو الدعم رسمياً في التاريخ المحدد من الجهة المسؤولة، لكن ظهوره في رصيدك قد يستغرق ساعات قليلة بحسب البنك الذي تتعامل معه. إذا لم يظهر المبلغ بنهاية يوم الصرف، تواصل مع بنكك أولاً قبل مراجعة الجهة الحكومية.',
  },
  {
    title: 'كيف تستخدم هذا الجدول إذا كنت تتابع أكثر من برنامج',
    description: 'خطة متابعة بسيطة للمقيمين والعاملين في أكثر من دولة',
    content:
      'إذا كنت تتابع رواتب أو دعماً في أكثر من دولة خليجية — مثلاً عائلة موزعة بين السعودية والإمارات — احفظ هذه الصفحة كمرجع شهري. الجدول يرتب كل المواعيد تلقائياً من الأقرب إلى الأبعد، فلا تحتاج لمقارنتها يدوياً كل مرة.',
  },
];

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-gulf-pay-dates');
  cacheLife('hours');

  const nowMs = Date.now();
  return buildGulfPayRows(nowMs);
}

export default async function GulfPayDatesPage() {
  const rows = await buildPageModel();
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

      {/* Pay schedule table — sorted by soonest upcoming payment across all 6 Gulf countries */}
      <CalculatorSection
        id="pay-schedule"
        eyebrow="جدول المواعيد"
        title="كل مواعيد الرواتب والمعاشات والدعم في الخليج، مرتبة حسب الأقرب"
        description="الجدول مرتب تلقائياً من أقرب موعد صرف إلى أبعده اعتماداً على تاريخ اليوم."
      >
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">البرنامج</TableHead>
                <TableHead className="text-right">الدولة</TableHead>
                <TableHead className="text-right">الموعد القادم</TableHead>
                <TableHead className="text-right">كم باقي</TableHead>
                <TableHead className="text-right">الجهة</TableHead>
                <TableHead className="text-right">العداد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.slug}>
                  <TableCell className="font-medium">{row.program}</TableCell>
                  <TableCell>
                    <span className="me-1">{row.flag}</span>
                    {row.country}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatGregorianAr(row.nextDate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {row.daysRemaining === 0 ? 'اليوم' : `${row.daysRemaining} يوم`}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.authority}</TableCell>
                  <TableCell>
                    <Link
                      href={`/holidays/${row.slug}`}
                      className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
                    >
                      عد تنازلي ←
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          المواعيد أعلاه هي الأنماط الشهرية المعتمدة رسمياً لكل برنامج. في حالات استثنائية (إجازات رسمية،
          مناسبات وطنية) قد تُصدر الجهات المختصة في كل دولة قراراً بتقديم الصرف ليوم عمل سابق. راجع صفحة
          العداد الخاصة بكل موعد للتفاصيل الكاملة والاستثناءات.
        </p>
      </CalculatorSection>

      {/* Explainer cards */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن مواعيد الرواتب الخليجية"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={PAY_EXPLAINER.length}>
          {PAY_EXPLAINER.map((item, index) => (
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
        title="أسئلة عن مواعيد الرواتب والدعم في الخليج"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="gulf-pay-dates" />
      </CalculatorSection>
    </main>
  );
}
