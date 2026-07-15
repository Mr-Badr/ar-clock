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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'soldes-france');
const CONTENT = getFinancePageContent('soldes-france');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const SALE_DURATION_DAYS = 28; // 4 weeks, per loi PACTE 2019 (Article L.310-3 du Code de commerce)

// Legal rule (arrêté du 27 mai 2019): winter sales start the 2nd Wednesday of January,
// unless that Wednesday falls after the 12th, in which case they start the 1st Wednesday.
function winterSalesStart(year) {
  const secondWed = nthWeekdayOfMonth(year, 0, 3, 2); // month 0 = January, weekday 3 = Wednesday, 2nd occurrence
  return secondWed.getUTCDate() > 12 ? nthWeekdayOfMonth(year, 0, 3, 1) : secondWed;
}

// Summer sales start the last Wednesday of June, unless that Wednesday falls after the 28th,
// in which case they start the second-to-last Wednesday.
function summerSalesStart(year) {
  const lastWed = lastWeekdayOfMonth(year, 5, 3); // month 5 = June
  if (lastWed.getUTCDate() > 28) {
    const d = new Date(lastWed);
    d.setUTCDate(d.getUTCDate() - 7);
    return d;
  }
  return lastWed;
}

function nthWeekdayOfMonth(year, monthIndex, weekday, n) {
  const d = new Date(Date.UTC(year, monthIndex, 1));
  let count = 0;
  while (true) {
    if (d.getUTCDay() === weekday) {
      count += 1;
      if (count === n) return d;
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

function lastWeekdayOfMonth(year, monthIndex, weekday) {
  const d = new Date(Date.UTC(year, monthIndex + 1, 0)); // last day of month
  while (d.getUTCDay() !== weekday) {
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return d;
}

function buildSoldesSchedule(nowMs) {
  const now = new Date(nowMs);
  const todayStartMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const rows = [];
  for (const year of [now.getUTCFullYear() - 1, now.getUTCFullYear(), now.getUTCFullYear() + 1]) {
    const winterStart = winterSalesStart(year);
    const winterEnd = new Date(winterStart);
    winterEnd.setUTCDate(winterEnd.getUTCDate() + SALE_DURATION_DAYS - 1);
    rows.push({ year, seasonLabel: 'الشتوية', start: winterStart, end: winterEnd });

    const summerStart = summerSalesStart(year);
    const summerEnd = new Date(summerStart);
    summerEnd.setUTCDate(summerEnd.getUTCDate() + SALE_DURATION_DAYS - 1);
    rows.push({ year, seasonLabel: 'الصيفية', start: summerStart, end: summerEnd });
  }

  rows.sort((a, b) => a.start.getTime() - b.start.getTime());

  const active = rows.find((row) => todayStartMs >= row.start.getTime() && todayStartMs <= row.end.getTime());
  const next = active || rows.find((row) => row.start.getTime() > todayStartMs);
  const daysRemaining = next && !active
    ? Math.max(0, Math.ceil((next.start.getTime() - todayStartMs) / 86_400_000))
    : null;
  const daysLeftInActive = active
    ? Math.max(0, Math.ceil((active.end.getTime() - todayStartMs) / 86_400_000))
    : null;
  const upcoming = rows.filter((row) => row.end.getTime() >= todayStartMs).slice(0, 4);

  return { active, next, daysRemaining, daysLeftInActive, upcoming };
}

async function buildPageModel() {
  'use cache';
  cacheTag('calculator-soldes-france');
  cacheLife('hours');

  const nowMs = Date.now();
  return buildSoldesSchedule(nowMs);
}

export default async function SoldesFrancePage() {
  const { active, next, daysRemaining, daysLeftInActive, upcoming } = await buildPageModel();
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

      {/* Next/active sale + schedule table — computed dynamically from the legal Wednesday rule */}
      <CalculatorSection
        id="soldes-schedule"
        eyebrow={active ? 'التخفيضات الآن' : 'الموعد القادم'}
        title={active ? 'التخفيضات جارية الآن في فرنسا' : 'متى تبدأ التخفيضات القادمة في فرنسا'}
        description="الجدول يُحسب تلقائياً من تاريخ اليوم حسب قاعدة Code de commerce، فيبقى دقيقاً كل سنة دون تحديث يدوي."
      >
        {active ? (
          <p className="text-lg leading-relaxed mb-4">
            التخفيضات{' '}
            <strong>{active.seasonLabel} {active.year}</strong>
            {' '}جارية الآن، وتنتهي بتاريخ{' '}
            <span className="font-bold text-green-700 dark:text-green-400">{formatGregorianAr(active.end)}</span>
            {daysLeftInActive === 0 ? ' — اليوم آخر يوم' : ` — يتبقى ${daysLeftInActive} يوماً على نهايتها`}.
          </p>
        ) : next ? (
          <p className="text-lg leading-relaxed mb-4">
            التخفيضات القادمة (
            <strong>{next.seasonLabel} {next.year}</strong>
            ) تبدأ بتاريخ{' '}
            <span className="font-bold text-green-700 dark:text-green-400">{formatGregorianAr(next.start)}</span>
            {daysRemaining === 0 ? ' — اليوم' : ` — يتبقى ${daysRemaining} يوماً`}.
          </p>
        ) : null}

        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الفترة</TableHead>
                <TableHead className="text-right">السنة</TableHead>
                <TableHead className="text-right">تاريخ البداية</TableHead>
                <TableHead className="text-right">تاريخ النهاية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.map((row) => (
                <TableRow key={`${row.year}-${row.seasonLabel}`}>
                  <TableCell className="font-medium">{row.seasonLabel}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatGregorianAr(row.start)}
                    </span>
                  </TableCell>
                  <TableCell>{formatGregorianAr(row.end)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          هذا الجدول محسوب اعتماداً على المادة L.310-3 من قانون التجارة الفرنسي وقرار 27 مايو 2019:
          التخفيضات الشتوية تبدأ ثاني أربعاء من يناير (أو الأول إذا وقع الثاني بعد يوم 12)، والصيفية
          تبدأ آخر أربعاء من يونيو (أو ما قبله إذا وقع بعد يوم 28)، وتستمر كل فترة 4 أسابيع بالضبط من
          الساعة 8 صباحاً. محافظات الحدود الشرقية وكورسيكا وما وراء البحار قد تملك تواريخ مختلفة قليلاً
          — راجع الجهة الرسمية المحلية للتأكيد.
        </p>
      </CalculatorSection>

      {/* Explainer: legal basis, duration, exceptions */}
      <CalculatorSection
        id="explainer"
        eyebrow="دليل الفهم"
        title="كل ما تحتاج معرفته عن soldes في فرنسا"
        subtle
      >
        <div className="calc-info-grid calc-info-grid--editorial" role="list" data-count={4}>
          <article className="calc-editorial-card calc-editorial-card--lead" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">01</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">لماذا التاريخ متحرك كل سنة؟</h3>
              <p className="calc-card-description">قاعدة الأربعاء وليست رقم يوم ثابت</p>
              <div className="calc-card-copy">
                لا يحدد القانون الفرنسي رقم يوم ثابت لبداية التخفيضات، بل يربطها بيوم أربعاء محدد في
                الشهر (الثاني في يناير، أو الأخير في يونيو)، مع استثناء إذا وقع هذا الأربعاء متأخراً
                جداً في الشهر. لهذا يتحرك التاريخ الفعلي بين سنة وأخرى بضعة أيام فقط.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">02</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">الفرق بين soldes والعروض العادية</h3>
              <p className="calc-card-description">القدرة على البيع بخسارة</p>
              <div className="calc-card-copy">
                طوال السنة، يُمنع التاجر الفرنسي قانوناً من البيع بأقل من سعر التكلفة. خلال فترة
                soldes الرسمية فقط (4 أسابيع مرتين سنوياً)، يُسمح له بذلك استثناءً — وهذا ما يميزها
                قانونياً عن أي "تخفيضات" أو "عروض" أخرى تُعلن خارج هذه الفترة.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">03</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">هل نفس الموعد في كل فرنسا؟</h3>
              <p className="calc-card-description">استثناءات إقليمية محدودة</p>
              <div className="calc-card-copy">
                محافظات الحدود الشرقية (مورت وموزيل، ميوز، موزيل، فوج) تبدأ التخفيضات الشتوية قبل
                أسبوع من باقي فرنسا. كورسيكا وأقاليم ما وراء البحار (الجواديلوب، مارتينيك، ريونيون
                وغيرها) تملك تواريخ خاصة يحددها المحافظ المحلي كل سنة.
              </div>
            </div>
          </article>
          <article className="calc-editorial-card" role="listitem">
            <div className="calc-editorial-card__meta">
              <span className="calc-editorial-card__index">04</span>
            </div>
            <div className="calc-editorial-card__copy">
              <h3 className="calc-card-title">شرط البضاعة المخفضة</h3>
              <p className="calc-card-description">شهر واحد على الأقل قبل البداية</p>
              <div className="calc-card-copy">
                يشترط القانون أن تكون البضاعة معروضة للبيع ومدفوعة الثمن لدى التاجر منذ شهر واحد على
                الأقل قبل بداية فترة soldes، لمنع إدخال بضاعة جديدة خصيصاً بأسعار وهمية مرتفعة ثم
                "تخفيضها".
              </div>
            </div>
          </article>
        </div>
      </CalculatorSection>

      {/* FAQ */}
      <CalculatorSection
        id="faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن مواعيد soldes في فرنسا"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      {/* Related */}
      <CalculatorSection id="related" eyebrow="حاسبات ذات صلة" title="أدوات مالية أخرى">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="soldes-france" />
      </CalculatorSection>
    </main>
  );
}
