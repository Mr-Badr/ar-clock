import Link from 'next/link';

import SalaryCalculator from '@/components/calculators/SalaryCalculator.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorSection,
  RelatedCalculators,
  CalculatorSources,
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'salary');
const CONTENT = getFinancePageContent('salary');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function SalaryPage() {
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
    <main className="calc-product-page calc-salary-page bg-base text-primary" dir="rtl" lang="ar">
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
        <SalaryCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="salary-methods"
        eyebrow="كيف يُحسب"
        title="طريقة الحساب وأثر عدد أيام العمل"
        description="الفرق بين 30 يوماً و22 يوماً ليس بسيطاً — فهو يغيّر الراتب اليومي بمقدار 36% تقريباً. اختر الطريقة الصحيحة حسب حالتك."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: '30 يوم — للأغراض الرسمية',
              description: 'متى تستخدمها؟',
              content: 'يعتمد نظام العمل في السعودية والإمارات الأجر اليومي بقسمة الراتب على 30 لحساب بدل الإجازة والاستقطاع والساعات الإضافية ومكافأة نهاية الخدمة. استخدم هذا الخيار لكل ما يخصك من مستحقات رسمية.',
            },
            {
              title: '22 يوم — للمقارنة الفعلية',
              description: 'متى تستخدمها؟',
              content: 'إذا أردت مقارنة راتبك مع عرض عمل آخر بالساعة أو اليوم، أو لتسعير مشروع، فقسمة الراتب على 22 يعطيك الأجر الفعلي ليوم عمل كامل بدون احتساب أيام العطل.',
            },
            {
              title: 'الأجر الساعي — للعمل الحر',
              description: 'تسعير مستقل؟',
              content: 'الأجر الساعي يساعدك على تسعير عروض الخدمات والنزالة (freelance) بشكل واقعي. ابدأ بالراتب الشهري المستهدف وقسّمه على أيام العمل وساعاته لتعرف الحد الأدنى الذي لا تقل عنه في عروضك.',
            },
            {
              title: 'الراتب الثالث عشر والمكافآت',
              description: 'الدخل السنوي الحقيقي',
              content: 'كثير من العقود تتضمن مكافأة نهاية السنة أو راتباً إضافياً. أضف عدد هذه الشهور في الحقل المخصص لترى دخلك السنوي الفعلي بما فيه هذه المستحقات وليس فقط ضرب الشهري في 12.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="salary-insurance"
        eyebrow="صافي الراتب"
        title="التأمينات الاجتماعية وأثرها على صافي الراتب"
        description="قبل حساب ما تستلمه فعلياً، افهم ما يُستقطع من راتبك الإجمالي في كل دولة. الأرقام أدناه للموظف — لا تشمل حصة صاحب العمل."
      >
        <div className="calc-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الدولة</TableHead>
                <TableHead>الموظف السعودي / المواطن</TableHead>
                <TableHead>الموظف الوافد / الأجنبي</TableHead>
                <TableHead>ملاحظة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>السعودية</TableCell>
                <TableCell>10% (9% معاشات + 1% ساند)</TableCell>
                <TableCell>0% معاشات — 2% ساند اختياري</TableCell>
                <TableCell>السعودي براتب 10,000 ر يستلم 9,000 صافياً</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الإمارات</TableCell>
                <TableCell>5% تأمينات اجتماعية</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>للمواطنين فقط — الوافدون بدون استقطاع</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>الكويت</TableCell>
                <TableCell>8% تأمينات اجتماعية</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>للكويتيين — حصة الموظف 8%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>قطر</TableCell>
                <TableCell>5% تأمينات اجتماعية</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>للقطريين فقط</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>البحرين</TableCell>
                <TableCell>7% تأمينات اجتماعية</TableCell>
                <TableCell>1% تأمين ضد التعطل</TableCell>
                <TableCell>حصة العامل من إجمالي الراتب</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>مصر</TableCell>
                <TableCell>11% تأمين اجتماعي (شامل معاش وتأمين)</TableCell>
                <TableCell>يختلف حسب الجنسية والنظام</TableCell>
                <TableCell>يحتسب على الأجر المتغير والثابت معاً</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="calc-hint" style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
          الأرقام توضيحية مبنية على الأنظمة العامة — تحقق من جهة التأمين في دولتك للأرقام الدقيقة الحالية.
        </p>
      </CalculatorSection>

      <CalculatorSection
        id="salary-offer"
        eyebrow="تقييم العرض الوظيفي"
        title="كيف تقيّم عرض عمل بالأرقام لا بالشعور؟"
        description="الراتب الشهري وحده لا يكفي للمقارنة — احتسب كل مكوّنات الدخل السنوي الفعلي قبل القرار."
        subtle
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>الخطوة 1 — احسب الدخل السنوي الإجمالي</h3>
            <p>
              (الراتب الشهري × 12) + (المكافآت السنوية) + (قيمة الإجازة السنوية) + (البدلات الثابتة كالسكن والمواصلات).
              كثير من الشركات تُغري براتب شهري مرتفع مع حزمة سنوية أقل من منافس براتب أقل شهرياً.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>الخطوة 2 — افهم الراتب الأساسي مقابل الإجمالي</h3>
            <p>
              الراتب الأساسي هو ما يُحتسب عليه نهاية الخدمة والإجازات والتأمينات. إذا كان الأساسي
              منخفضاً مع بدلات مرتفعة، فمكافأة نهاية خدمتك ستكون منخفضة حتى بعد سنوات طويلة.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>الخطوة 3 — قارن التطور الوظيفي</h3>
            <p>
              مقارنة الراتب الحالي وحده لا تعكس القيمة الكاملة. اسأل: كم الزيادة السنوية المتوقعة؟ هل
              هناك برامج تدريب؟ ما متوسط الراتب في السوق بعد 3 سنوات لنفس المسمى؟ الفارق في الراتب
              الآن قد يعكسه عرض أفضل بعد عام.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>الخطوة 4 — استقطاعات لا تُرى في عرض العمل</h3>
            <p>
              التأمينات الاجتماعية، ضريبة الدخل (في الدول المطبّقة)، وتكلفة التنقل والسكن إذا انتقلت
              لمدينة مختلفة — كلها تؤثر على الدخل الصافي الحقيقي وتُخرجه عن رقم العقد المكتوب.
            </p>
          </article>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="salary-official"
        eyebrow="مصادر رسمية"
        title="تحقق من الراتب والتأمينات بمصادر موثوقة"
        subtle
      >
        <div className="calc-cta-card">
          <div className="calc-cta-card__copy">
            <p className="calc-card-description">
              لمراجعة معدلات التأمينات الاجتماعية والاستحقاقات الرسمية أو احتساب الراتب الصافي بعد الاستقطاعات، ارجع إلى الجهة الرسمية في دولتك.
            </p>
          </div>
          <div className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://www.gosi.gov.sa/" target="_blank" rel="noreferrer">
                التأمينات الاجتماعية — السعودية (GOSI)
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.gpssa.gov.ae/" target="_blank" rel="noreferrer">
                هيئة التقاعد والتأمين الاجتماعي — الإمارات
              </a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/end-of-service-benefits">احسب مكافأة نهاية الخدمة</Link>
            </Button>
          </div>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="salary-faq"
        eyebrow="أسئلة شائعة"
        title="إجابات على أبرز أسئلة الراتب والتحويل"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="salary-related" subtle>
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="salary" />
      </CalculatorSection>
    </main>
  );
}
