import Link from 'next/link';

import AnnualLeaveCalculator from '@/components/calculators/AnnualLeaveCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'annual-leave');
const CONTENT = getFinancePageContent('annual-leave');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function AnnualLeavePage() {
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
    <main className="calc-product-page calc-annual-leave-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        highlights={CONTENT.hero.highlights}
      >
        <AnnualLeaveCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="leave-comparison"
        eyebrow="مقارنة دولية"
        title="الإجازة السنوية في الدول العربية — جدول مقارنة شامل"
        description="الاستحقاق يختلف بين الدول ومراحل الخدمة. إليك ما تضمنه لك قوانين العمل في كل دولة — وما يتغير بعد سنوات الخدمة."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدولة</TableHead>
                <TableHead>السنوات الأولى</TableHead>
                <TableHead>بعد 5 سنوات</TableHead>
                <TableHead>بعد 10 سنوات</TableHead>
                <TableHead>معدل التراكم الشهري</TableHead>
                <TableHead>ملاحظة قانونية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>السعودية</TableCell>
                <TableCell>21 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>1.75 يوم/شهر (أو 2.5 بعد 5 سنوات)</TableCell>
                <TableCell>المادة 109 نظام العمل</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الإمارات</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>2.5 يوم/شهر</TableCell>
                <TableCell>قانون العمل الإماراتي المادة 29</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الكويت</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>2.5 يوم/شهر</TableCell>
                <TableCell>قانون العمل في القطاع الخاص رقم 6/2010</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>قطر</TableCell>
                <TableCell>21 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>1.75 (ثم 2.5) يوم/شهر</TableCell>
                <TableCell>قانون العمل القطري رقم 14/2004</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>البحرين</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>2.5 يوم/شهر</TableCell>
                <TableCell>قانون العمل البحريني رقم 36/2012</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>عُمان</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>2.5 يوم/شهر</TableCell>
                <TableCell>قانون العمل العُماني رقم 53/2023</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>مصر</TableCell>
                <TableCell>15 يوماً</TableCell>
                <TableCell>21 يوماً</TableCell>
                <TableCell>30 يوماً</TableCell>
                <TableCell>1.25 – 2.5 يوم/شهر حسب المرحلة</TableCell>
                <TableCell>قانون العمل المصري رقم 12/2003 المادة 47</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الأردن</TableCell>
                <TableCell>14 يوماً</TableCell>
                <TableCell>21 يوماً</TableCell>
                <TableCell>21 يوماً</TableCell>
                <TableCell>1.17 (ثم 1.75) يوم/شهر</TableCell>
                <TableCell>قانون العمل الأردني رقم 8/1996 المادة 61</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          الأيام مُعبّر عنها بأيام تقويمية وفق المعيار الشائع — بعض عقود العمل تعتمد أيام عمل فعلية. راجع عقدك دائماً.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="leave-accrual"
        eyebrow="كيف يتراكم رصيدك"
        title="آلية تراكم الإجازة وكيف تحسب ما تستحقه الآن"
        description="لست مضطراً لانتظار السنة الكاملة — الإجازة تتراكم كل شهر وتبدأ منذ أول يوم عمل."
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>معدل التراكم الشهري</h3>
            <p>
              قسّم عدد أيام إجازتك السنوية على 12 للحصول على معدل التراكم الشهري. السعودي في السنوات
              الأولى (21 يوماً): يتراكم 1.75 يوم كل شهر. بعد 5 سنوات (30 يوماً): 2.5 يوم/شهر.
              في الإمارات والكويت: 2.5 يوم/شهر دائماً.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>رصيد الإجازة بالتناسب</h3>
            <p>
              إذا عملت 7 أشهر من السنة تستحق: 7 × معدل التراكم الشهري. موظف سعودي في سنة أولى:
              7 × 1.75 = 12.25 يوماً. هذا الرصيد يُصرف نقداً عند انتهاء الخدمة إذا لم يُستخدم.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>القيمة المالية للإجازة</h3>
            <p>
              قيمة اليوم = الراتب الشهري ÷ 30. موظف براتب 8,000 ريال لديه 15 يوم إجازة متراكمة:
              القيمة = (8000 ÷ 30) × 15 = 4,000 ريال. هذا المبلغ مستحق سواء أخذت الإجازة فعلياً
              أو صُرف لك نقداً عند الخروج.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>ماذا لو انقضت السنة ولم آخذ إجازتي؟</h3>
            <p>
              في السعودية: تتراكم الإجازة غير المأخوذة حتى سنتين بحد أقصى ثم تسقط دون تعويض إذا لم
              يطالب بها الموظف. في الإمارات: يجوز الاتفاق على نقل الرصيد أو صرفه. الأفضل دوماً:
              أخذ الإجازة فعلياً لما لها من أثر إيجابي على الإنتاجية والصحة.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="leave-official"
        eyebrow="مصادر رسمية"
        title="تحقق من استحقاقك بمصادر موثوقة"
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              للاطلاع على نصوص قوانين الإجازات السنوية أو تقديم شكوى عمالية، ارجع إلى وزارة الموارد البشرية في دولتك.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://www.hrsd.gov.sa/" target="_blank" rel="noreferrer">
                وزارة الموارد البشرية — السعودية
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.mohre.gov.ae/" target="_blank" rel="noreferrer">
                وزارة الموارد البشرية — الإمارات
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/end-of-service-benefits">احسب مكافأة نهاية الخدمة</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="leave-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أكثر أسئلة الإجازات بحثاً"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="leave-related" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="annual-leave" />
      </CalculatorSection>
    </main>
  );
}
