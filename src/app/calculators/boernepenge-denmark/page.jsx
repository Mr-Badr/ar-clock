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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'boernepenge-denmark');
const CONTENT = getFinancePageContent('boernepenge-denmark');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

// Udbetaling Danmark rule (borger.dk): børneydelse (under 15) is paid quarterly on the 20th of
// Jan/Apr/Jul/Oct; ungeydelse (15-17) is paid monthly on the 20th. Both shift to the preceding
// business day when the 20th falls on a weekend.
const QUARTER_MONTHS = [
  { month: 0, label: 'يناير' },
  { month: 3, label: 'أبريل' },
  { month: 6, label: 'يوليو' },
  { month: 9, label: 'أكتوبر' },
];

const AGE_RATES = [
  { label: '0-2 سنوات', amount: '5,370 كرونة', frequency: 'فصلياً' },
  { label: '3-6 سنوات', amount: '4,248 كرونة', frequency: 'فصلياً' },
  { label: '7-14 سنة', amount: '3,342 كرونة', frequency: 'فصلياً' },
  { label: '15-17 سنة', amount: '1,114 كرونة', frequency: 'شهرياً' },
];

function shiftToPrecedingBusinessDay(date) {
  const day = date.getUTCDay();
  if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
  else if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
  return date;
}

function buildQuarterlySchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    for (const { month, label } of QUARTER_MONTHS) {
      const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 20)));
      rows.push({ year, quarterLabel: label, date, isPast: date.getTime() < todayStartMs });
    }
  }

  rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  const next = rows.find((row) => !row.isPast);
  const daysRemaining = next ? Math.max(0, Math.ceil((next.date.getTime() - todayStartMs) / 86_400_000)) : null;
  const upcoming = rows.filter((row) => !row.isPast).slice(0, 4);

  return { next, daysRemaining, upcoming };
}

function nextMonthlyPayment(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  for (let offset = 0; offset < 3; offset += 1) {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + offset;
    const date = shiftToPrecedingBusinessDay(new Date(Date.UTC(year, month, 20)));
    if (date.getTime() >= todayStartMs) {
      const daysRemaining = Math.max(0, Math.ceil((date.getTime() - todayStartMs) / 86_400_000));
      return { date, daysRemaining };
    }
  }
  return null;
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-boernepenge-denmark');
  cacheLife('hours');

  const nowMs = Date.now();
  const { next, daysRemaining, upcoming } = buildQuarterlySchedule(nowMs);
  const monthly = nextMonthlyPayment(nowMs);
  return { next, daysRemaining, upcoming, monthly };
}

export default async function BoernepengeDenmarkPage() {
  const { next, daysRemaining, upcoming, monthly } = await buildPageModel();
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

      {/* Quarterly børneydelse (under 15) — computed dynamically, correct every year */}
      <CalculatorSection
        id="quarterly-schedule"
        eyebrow="دعم الأطفال (دون 15 عاماً)"
        title="متى تُصرف دفعة دعم الأطفال الفصلية القادمة"
        description="الجدول يُحسب تلقائياً من تاريخ اليوم، مع تطبيق قاعدة تقديم الصرف إذا صادف يوم 20 عطلة نهاية أسبوع."
      >
        {next ? (
          <p className="text-lg leading-relaxed mb-4">
            الدفعة الفصلية القادمة (
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
      </CalculatorSection>

      {/* Monthly ungeydelse (15-17) */}
      <CalculatorSection
        id="monthly-schedule"
        eyebrow="إعانة الشباب (15-17 عاماً)"
        title="متى تُصرف إعانة الشباب الشهرية القادمة"
        description="لمن هم بين 15 و17 عاماً، تُصرف الإعانة شهرياً في يوم 20، وليس فصلياً كدعم الأطفال."
        subtle
      >
        {monthly ? (
          <p className="text-lg leading-relaxed">
            الدفعة الشهرية القادمة تُصرف بتاريخ{' '}
            <span className="font-bold text-green-700 dark:text-green-400">{formatGregorianAr(monthly.date)}</span>
            {monthly.daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${monthly.daysRemaining} يوماً`}.
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          هذا الجدول محسوب اعتماداً على قاعدة Udbetaling Danmark الرسمية: يوم 20 من كل شهر، مع تقديم
          الصرف ليوم العمل السابق إذا صادف عطلة نهاية أسبوع أو رسمية.
        </p>
      </CalculatorSection>

      {/* Rate table by age */}
      <CalculatorSection
        id="rates"
        eyebrow="المبالغ حسب العمر"
        title="كم مبلغ دعم الأطفال حسب عمر طفلك"
      >
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الفئة العمرية</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">التكرار</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AGE_RATES.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          المبلغ معفى بالكامل من الضريبة، ويُخفض تدريجياً إذا تجاوز دخل أحد الوالدين 961,100 كرونة في
          السنة. عند الحضانة المشتركة، يُقسَّم المبلغ نصفين بين حسابي الوالدين البنكيين (NemKonto).
        </p>
      </CalculatorSection>

      {/* Explainer */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن دعم الأطفال في الدنمارك"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={4}>
          <article className="calc-editorial-card calc-editorial-card--lead" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">01</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">لماذا يختلف الصرف حسب العمر؟</h3>
              <p className="calc-card-description">فصلي حتى 14 عاماً، شهري من 15</p>
              <div className="calc-card-copy">
                يقسّم القانون الدنماركي الإعانة إلى مرحلتين: دعم الأطفال (Børneydelse) للفئة العمرية
                دون 15 عاماً يُصرف كل ثلاثة أشهر، وإعانة الشباب (Ungeydelse) لمن هم بين 15 و17 عاماً
                تُصرف شهرياً. الاسمان جزء من نفس النظام الرسمي المعروف باسم Børne- og ungeydelse.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">02</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">هل يحتاج تقديم طلب؟</h3>
              <p className="calc-card-description">تلقائي عند تسجيل المولود</p>
              <div className="calc-card-copy">
                لا يحتاج الوالدان عادة لتقديم طلب منفصل؛ يبدأ الصرف تلقائياً بعد تسجيل الطفل في
                السجل المدني الدنماركي (CPR)، بشرط استيفاء شرط الإقامة/التأمين المطلوب.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">03</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">من يستلم المبلغ؟</h3>
              <p className="calc-card-description">الوالد الذي يعيش مع الطفل</p>
              <div className="calc-card-copy">
                يذهب المبلغ عادة لحساب الوالد الذي يعيش الطفل معه. في حالة الحضانة المشتركة وسكن
                الوالدين معاً، يُقسَّم المبلغ نصفين بين حسابيهما البنكيين (NemKonto) تلقائياً.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">04</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">ماذا لو تجاوز الدخل الحد الأقصى؟</h3>
              <p className="calc-card-description">تخفيض تدريجي وليس إلغاء كامل</p>
              <div className="calc-card-copy">
                إذا تجاوز دخل أحد الوالدين السنوي 961,100 كرونة، يبدأ تخفيض المبلغ تدريجياً وفق نسبة
                محددة من الدولة، ولا يُلغى المبلغ بالكامل دفعة واحدة عند تجاوز الحد بقليل.
              </div>
            </div>
          </article>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن دعم الأطفال في الدنمارك"
        showAdBefore
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="boernepenge-denmark" />
      </CalculatorSection>
    </main>
  );
}
