import Link from 'next/link';

import SickLeaveCalculator from '@/components/calculators/SickLeaveCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'sick-leave');
const CONTENT = getFinancePageContent('sick-leave');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function SickLeavePage() {
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
    <main className="calc-product-page calc-sick-leave-page bg-base text-primary" dir="rtl" lang="ar">
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
        <SickLeaveCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="sick-leave-tiers"
        eyebrow="المادة 117 من نظام العمل"
        title="شرائح أجر الإجازة المرضية في السعودية"
        description="نظام العمل السعودي يقسّم الإجازة المرضية إلى ثلاث شرائح متتالية بحسب عدد الأيام المتراكمة خلال السنة الواحدة."
        subtle
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشريحة</TableHead>
                <TableHead>عدد الأيام</TableHead>
                <TableHead>نسبة الأجر</TableHead>
                <TableHead>الأساس القانوني</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>الشريحة الأولى</TableCell>
                <TableCell>أول 30 يوماً</TableCell>
                <TableCell>100% من الراتب</TableCell>
                <TableCell>المادة 117، الفقرة الأولى</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الشريحة الثانية</TableCell>
                <TableCell>الـ60 يوماً التالية (31–90)</TableCell>
                <TableCell>75% من الراتب</TableCell>
                <TableCell>المادة 117، الفقرة الثانية</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الشريحة الثالثة</TableCell>
                <TableCell>الـ30 يوماً التالية (91–120)</TableCell>
                <TableCell>بلا أجر</TableCell>
                <TableCell>المادة 117، الفقرة الثالثة</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          الحد الأقصى الذي تغطيه المادة 117 هو 120 يوماً خلال السنة الواحدة. الأيام تُحتسب تراكمياً من بداية سنة الخدمة، لا من بداية كل مرض على حدة.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="sick-leave-conditions"
        eyebrow="شروط الاستحقاق"
        title="متى يستحق الموظف أجر الإجازة المرضية؟"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>تقرير طبي معتمد</h3>
            <p>
              يشترط نظام العمل تقديم تقرير طبي صادر من جهة صحية معتمدة (حكومية أو خاصة معترف بها) يثبت
              المرض وعدد أيام الإجازة الموصى بها. بدون تقرير طبي رسمي، لا يُلزم صاحب العمل بصرف أجر
              الإجازة المرضية.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>احتساب الأيام تراكمياً لا لكل مرض</h3>
            <p>
              الشرائح الثلاث (30 يوماً بأجر كامل، 60 يوماً بـ75%، 30 يوماً بلا أجر) تُحتسب تراكمياً على
              مدار السنة الواحدة من تاريخ بداية خدمة الموظف، وليس لكل إجازة مرضية منفصلة على حدة. إذا
              استخدم الموظف 20 يوماً في مرض سابق، يبدأ المرض التالي من اليوم الحادي والعشرين ضمن الشريحة
              نفسها.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>ماذا يحدث بعد 120 يوماً؟</h3>
            <p>
              إذا تجاوزت الإجازة المرضية 120 يوماً خلال السنة، تخرج الحالة عن نطاق المادة 117 وتخضع
              لأحكام أخرى، منها إمكانية إحالة الموظف لتقييم طبي من الجهات المختصة أو التأمينات
              الاجتماعية (GOSI) بحسب طبيعة الحالة.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>الفرق بين الإجازة المرضية والإجازة السنوية</h3>
            <p>
              الإجازة المرضية منفصلة تماماً عن رصيد الإجازة السنوية ولا تُخصم منه. يمكنك استخدام
              <Link href="/calculators/annual-leave"> حاسبة الإجازة السنوية</Link> لحساب رصيدك المنفصل
              إن أردت معرفة استحقاقك الكامل من الإجازات.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sick-leave-official"
        eyebrow="مصدر رسمي"
        title="تحقق من نص المادة 117 مباشرة"
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              للاطلاع على النص الكامل لنظام العمل السعودي أو تقديم شكوى عمالية، ارجع إلى وزارة الموارد
              البشرية والتنمية الاجتماعية.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://hrsd.gov.sa/ar/node/6" target="_blank" rel="noreferrer">
                وزارة الموارد البشرية — نظام العمل
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/annual-leave">احسب الإجازة السنوية</Link>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/end-of-service-benefits">احسب مكافأة نهاية الخدمة</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="sick-leave-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أكثر أسئلة الإجازة المرضية بحثاً"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="sick-leave-related" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="sick-leave" />
      </CalculatorSection>
    </main>
  );
}
