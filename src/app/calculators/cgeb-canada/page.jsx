import { cacheLife, cacheTag } from 'next/cache';

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
import { formatGregorianAr } from '@/lib/holidays-engine';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cgeb-canada');
const CONTENT = getFinancePageContent('cgeb-canada');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

// CRA rule: payment falls on the 5th of Jan/Apr/Jul/Oct; if that day is a weekend, it moves
// to the preceding business day. Computed dynamically so the schedule stays correct every year.
const PAYMENT_MONTHS = [
  { month: 0, label: 'يناير' },
  { month: 3, label: 'أبريل' },
  { month: 6, label: 'يوليو' },
  { month: 9, label: 'أكتوبر' },
];

function shiftToPrecedingBusinessDay(date) {
  const day = date.getUTCDay();
  if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
  else if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

function buildCgebSchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    for (const { month, label } of PAYMENT_MONTHS) {
      const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 5)));
      rows.push({
        year,
        quarterLabel: label,
        date,
        isPast: date.getTime() < todayStartMs,
      });
    }
  }

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  const next = rows.find((row) => !row.isPast);
  const daysRemaining = next ? Math.max(0, Math.ceil((next.date.getTime() - todayStartMs) / 86_400_000)) : null;
  const upcoming = rows.filter((row) => !row.isPast).slice(0, 4);

  return { next, daysRemaining, upcoming };
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-cgeb-canada');
  cacheLife('hours');

  const nowMs = Date.now();
  return buildCgebSchedule(nowMs);
}

export default async function CgebCanadaPage() {
  const { next, daysRemaining, upcoming } = await buildPageModel();
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

      {/* Next-payment answer + quarterly schedule table — computed dynamically, correct every year */}
      <CalculatorSection
        id="pay-schedule"
        eyebrow="الموعد القادم"
        title="متى تُصرف دفعة دعم المقاضي والأساسيات القادمة"
        description="الجدول يُحسب تلقائياً من تاريخ اليوم، مع تطبيق قاعدة تقديم الصرف إذا صادف اليوم الخامس عطلة نهاية أسبوع."
      >
        {next ? (
          <p className="text-lg leading-relaxed mb-4">
            الدفعة القادمة (
            <strong>{next.quarterLabel} {next.year}</strong>
            ) تُصرف بتاريخ{' '}
            <span className="font-bold text-green-700 dark:text-green-400">{formatGregorianAr(next.date)}</span>
            {daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${daysRemaining} يوماً`}.
          </p>
        ) : null}

        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الربع</TableHead>
                <TableHead className="text-right">السنة</TableHead>
                <TableHead className="text-right">تاريخ الصرف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((row) => (
                <TableRow key={`${row.year}-${row.quarterLabel}`}>
                  <TableCell className="font-medium">{row.quarterLabel}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatGregorianAr(row.date)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          هذا الجدول محسوب اعتماداً على القاعدة المعتمدة من وكالة الإيرادات الكندية (CRA): الدفعة في
          اليوم الخامس من يناير وأبريل ويوليو وأكتوبر، وتُقدَّم ليوم العمل السابق إذا صادفت عطلة نهاية
          أسبوع. في حالات نادرة قد تُعلن CRA تعديلاً استثنائياً بسبب عطلة رسمية فيدرالية — تحقق من
          موقع CRA الرسمي قرب الموعد للتأكيد.
        </p>
      </CalculatorSection>

      {/* Explainer: what changed, amounts, eligibility */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن دعم المقاضي والأساسيات"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={4}>
          <article className="calc-editorial-card calc-editorial-card--lead" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">01</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">ما الذي تغير في يوليو 2026؟</h3>
              <p className="calc-card-description">إعادة تسمية إعانة GST/HST</p>
              <div className="calc-card-copy">
                غيّرت الحكومة الكندية اسم إعانة ضريبة السلع والخدمات (GST/HST Credit) إلى دعم المقاضي
                والأساسيات (Canada Groceries and Essentials Benefit) اعتباراً من يوليو 2026، مع زيادة
                25% على المبلغ مثبّتة حتى 2031. الآلية نفسها — تقديم إقرار ضريبي، صرف ربعي — لم تتغير.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">02</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">كم المبلغ بعد الزيادة؟</h3>
              <p className="calc-card-description">تقديري، يعتمد على دخلك الأسري</p>
              <div className="calc-card-copy">
                بعد زيادة 25%، يبلغ المبلغ السنوي التقريبي نحو 666 دولاراً للفرد الأعزب، ونحو 873
                دولاراً للزوجين، إضافة إلى نحو 230 دولاراً لكل طفل دون 19 عاماً. الرقم الدقيق مرتبط
                بدخلك الأسري المُصرَّح في إقرارك — راجع CRA My Account لمعرفة مبلغك.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">03</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">هل تحتاج للتقديم؟</h3>
              <p className="calc-card-description">لا، فقط إقرار ضريبي سنوي</p>
              <div className="calc-card-copy">
                لا يوجد طلب منفصل لدعم المقاضي والأساسيات. يكفي أن تقدّم إقرارك الضريبي كل سنة حتى بلا
                دخل، وتحسب CRA أهليتك ومبلغك تلقائياً بناءً على دخل أسرتك وعدد أفرادها.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">04</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">لماذا يتحرك موعد الصرف كل سنة؟</h3>
              <p className="calc-card-description">قاعدة نهاية الأسبوع</p>
              <div className="calc-card-copy">
                الأصل أن الدفعة تصلك يوم 5 من الشهر، لكن إذا وافق هذا اليوم سبتاً أو أحداً، تُصرف الدفعة
                في آخر يوم عمل قبله. لهذا يظهر التاريخ الفعلي مختلفاً بضعة أيام من سنة لأخرى — الجدول
                أعلاه يطبق هذه القاعدة تلقائياً.
              </div>
            </div>
          </article>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن دعم المقاضي والأساسيات في كندا"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="cgeb-canada" />
      </CalculatorSection>
    </main>
  );
}
