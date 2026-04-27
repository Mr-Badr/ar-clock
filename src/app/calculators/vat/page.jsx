import Link from 'next/link';

import VatCalculator from '@/components/calculators/VatCalculator.client';
import VatRatesTable from '@/components/calculators/VatRatesTable.client';
import {
  CalculatorChecklist,
  CalculatorFaqSection,
  CalculatorFooterCta,
  CalculatorHero,
  CalculatorInfoGrid,
  CalculatorIntentCloud,
  CalculatorQuickAnswerGrid,
  CalculatorResourceLinks,
  CalculatorSection,
  CalculatorSectionNav,
  CalculatorStoryBand,
  RelatedCalculators,
} from '@/components/calculators/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getGuidesBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'vat');
const CONTENT = getFinancePageContent('vat');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);
const RELATED_GUIDES = getGuidesBySlugs(TOOL_GUIDE_GROUPS.vat);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function VatPage() {
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
    mainEntity: CONTENT.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: CONTENT.howTo.name,
    description: CONTENT.howTo.description,
    step: CONTENT.howTo.steps.map((item) => ({
      '@type': 'HowToStep',
      name: item.name,
      text: item.text,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <CalculatorHero
        badge={CONTENT.hero.badge}
        title={PAGE.heroTitle}
        description={CONTENT.hero.description}
        accent={PAGE.accent}
        highlights={CONTENT.hero.highlights}
      >
        <VatCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="vat-overview"
        eyebrow="خريطة الصفحة"
        title="صفحة ضريبة متقدمة تخدم الفاتورة والتسعير والالتزام الشهري"
        description="هذه الخريطة تساعدك على الوصول مباشرة إلى الحاسبة أو مقارنة الدول أو الإجابات السريعة أو قائمة التحقق قبل استخدام الرقم في التسعير أو المراجعة المحاسبية."
      >
        <CalculatorSectionNav items={CONTENT.sectionNavItems} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-intents"
        eyebrow="تغطية بحثية"
        title="الكلمات المفتاحية والنية العملية التي تغطيها الصفحة"
        description="الصفحة لا تستهدف كلمة VAT calculator فقط، بل تغطي أيضاً أسئلة مثل: كم ضريبة 1000 ريال؟ كيف أستخرج الضريبة من فاتورة؟ وما الفرق بين شامل وغير شامل؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorIntentCloud items={SEARCH_COVERAGE.intentChips} />
          <CalculatorStoryBand
            title="لماذا تحتاج هذه الصفحة أكثر من آلة حاسبة عادية؟"
            description="لأن المستخدم الضريبي ليس نوعاً واحداً: هناك من يسعّر منتجاً، ومن يراجع فاتورة، ومن يغلق فترة شهرية. لهذا صممت الصفحة لتخدم أكثر من مهمة حقيقية داخل نفس التجربة."
            items={[
              { label: 'تسعير', value: 'أضف الضريبة على سعر أساسي بسرعة واعرف الإجمالي النهائي.' },
              { label: 'مراجعة فاتورة', value: 'استخرج الأساس والضريبة من مبلغ شامل دون خطأ شائع.' },
              { label: 'إغلاق فترة', value: 'احسب صافي ضريبة الشهر بين المخرجات والمدخلات في نفس الصفحة.' },
            ]}
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-rates"
        eyebrow="مقارنة سريعة"
        title="مقارنة النسب العامة الشائعة بين الدول"
        description="الجدول التالي مفيد عند تجهيز عرض سعر أو مقارنة أسواق متعددة. تذكر دائماً أن بعض القطاعات تخضع لنسب أو إعفاءات مختلفة."
      >
        <VatRatesTable />
      </CalculatorSection>

      <CalculatorSection
        id="vat-answers"
        eyebrow="إجابات مباشرة"
        title="إذا كتبت في Google: كم ضريبة 1000 ريال عند 15%؟"
        description="إجابات مكتوبة بلغة واضحة على الأسئلة التي يدخل بها المستخدم مباشرة إلى محركات البحث."
      >
        <CalculatorQuickAnswerGrid items={CONTENT.quickAnswers} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-learning"
        eyebrow="فهم الأساس"
        title="كيف تقرأ الضريبة بشكل صحيح؟"
        description="هذه الصفحة تساعدك على التفريق بين ثلاثة أسئلة مختلفة: إضافة الضريبة على سعر، استخراجها من إجمالي، أو معرفة صافي المستحق في نهاية الفترة."
        subtle
      >
        <CalculatorInfoGrid
          items={[
            {
              title: 'إضافة الضريبة',
              description: 'متى تستخدمها؟',
              content: 'إذا كان لديك سعر قبل الضريبة وتريد معرفة قيمة الضريبة والإجمالي النهائي للفاتورة. هذا هو السيناريو الأشهر في التسعير والعروض.',
            },
            {
              title: 'استخراج الضريبة',
              description: 'متى تستخدمه؟',
              content: 'إذا وصلتك فاتورة شاملة الضريبة وتريد معرفة الجزء الأصلي من السعر بدقة دون أن تقع في خطأ ضرب الإجمالي مباشرة في النسبة.',
            },
            {
              title: 'ضريبة الشهر',
              description: 'للمنشآت الصغيرة والمتاجر',
              content: 'الفكرة الأساسية هي طرح ضريبة المدخلات من ضريبة المخرجات. الحاسبة هنا تختصر الخطوة الأولى قبل الانتقال إلى القيد المحاسبي والإقرار الرسمي.',
            },
          ]}
        />
      </CalculatorSection>

      <CalculatorSection
        id="vat-details"
        eyebrow="مرجع عملي"
        title="نقاط يجب الانتباه لها قبل الاعتماد على الرقم"
      >
        <div className="calc-article-grid">
          <article className="calc-article-block">
            <h3>1. المعدل العام لا يغطي كل الحالات</h3>
            <p>
              بعض القطاعات قد تكون معفاة أو صفرية أو خاضعة لمعاملة مختلفة. لذلك نحن نستخدم المعدل
              القياسي العام لتسريع الفهم، لا لإلغاء الحاجة إلى مراجعة الفاتورة أو اللائحة الخاصة
              بقطاعك.
            </p>
          </article>
          <article className="calc-article-block">
            <h3>2. التسجيل والإقرار مساران مختلفان عن الحساب الفردي</h3>
            <p>
              حتى لو كنت تعرف كيف تضيف الضريبة أو تستخرجها، يبقى التسجيل والإقرار والمتطلبات
              الشكلية مسؤولية منفصلة. في السعودية مثلاً يظل حد التسجيل الإلزامي المذكور رسمياً
              نقطة مرجعية مهمة عند تقييم وضع المنشأة.
            </p>
          </article>
        </div>

        <div className="calc-table-wrap">
          <Table className="economy-table">
            <TableHeader>
              <TableRow>
                <TableHead>الحالة</TableHead>
                <TableHead>المعادلة السريعة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>إضافة الضريبة</TableCell>
                <TableCell>المبلغ × (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>استخراج الضريبة</TableCell>
                <TableCell>المبلغ الشامل ÷ (1 + نسبة الضريبة)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>صافي ضريبة الشهر</TableCell>
                <TableCell>ضريبة المخرجات - ضريبة المدخلات</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-playbook"
        eyebrow="دليل تحقق"
        title="قبل أن تعتمد الرقم في التسعير أو المراجعة"
        description="الحساب الصحيح يبدأ بالسؤال الصحيح: هل الرقم شامل أم غير شامل؟ وهل النسبة التي تستخدمها هي النسبة العامة فعلاً على حالتك؟"
        subtle
      >
        <div className="calc-grid-2">
          <CalculatorChecklist
            title="قائمة التحقق الضريبية"
            description="قائمة سريعة مفيدة قبل اعتماد أي نتيجة من الصفحة."
            items={[
              'حدد أولاً هل المبلغ الذي لديك شامل الضريبة أم قبل الضريبة.',
              'تحقق من النسبة العامة المعمول بها في الدولة أو القطاع المستهدف.',
              'لا تستخدم المعدل العام إذا كانت حالتك تتعلق بإعفاء أو نسبة مختلفة أو معالجة خاصة.',
              'في صافي ضريبة الشهر، تأكد أن المدخلات قابلة للخصم فعلاً قبل طرحها من المخرجات.',
              'اعتمد على الجهة الرسمية أو المستشار المحاسبي عند الإقرار أو التسجيل أو الحالات غير القياسية.',
            ]}
          />
          <CalculatorChecklist
            title="متى تكون هذه الصفحة كافية؟"
            description="عند التسعير السريع والفهم الأولي والمراجعة الأولية."
            content="إذا كنت تريد فهم الفاتورة أو حساب رقم سريع أو تجهيز عرض سعر، فالصفحة ممتازة. أما إذا كنت تتعامل مع تسجيل ضريبي أو إقرار رسمي أو استثناءات قطاعية، فانتقل بعد ذلك إلى المرجع الرسمي أو المختص."
          />
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="vat-official-links"
        eyebrow="مصادر مرجعية"
        title="مراجع رسمية مفيدة"
        description="إذا كنت تحتاج رقمًا نهائياً للاعتماد الإداري أو المحاسبي، راجع الجهة المختصة في دولتك."
      >
        <Card className="calc-surface-card">
          <CardHeader>
            <CardTitle className="calc-card-title">روابط مرجعية</CardTitle>
          </CardHeader>
          <CardContent className="calc-cta-actions">
            <Button asChild className="btn btn-primary--flat calc-button">
              <a href="https://zatca.gov.sa/" target="_blank" rel="noreferrer">هيئة الزكاة والضريبة والجمارك</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://tax.gov.ae/" target="_blank" rel="noreferrer">الهيئة الاتحادية للضرائب - الإمارات</a>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <a href="https://www.nbr.gov.bh/" target="_blank" rel="noreferrer">الجهاز الوطني للإيرادات - البحرين</a>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorSection
        id="vat-guides"
        eyebrow="أدلة مرتبطة"
        title="افهم الفاتورة قبل أن تعتمد الرقم"
        description="هذه الصفحات التعليمية تشرح الفرق بين السعر الشامل وغير الشامل، ومعنى ضريبة المدخلات والمخرجات، ثم تعيدك إلى الحاسبة لتطبيق الفكرة فوراً."
        subtle
      >
        <CalculatorResourceLinks items={RELATED_GUIDES} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-faq"
        eyebrow="الأسئلة الشائعة"
        title="أسئلة متكررة حول الضريبة والفواتير"
      >
        <CalculatorFaqSection items={CONTENT.faqItems} />
      </CalculatorSection>

      <CalculatorSection
        id="vat-related"
        eyebrow="روابط داخلية"
        title="حاسبات مرتبطة بالتسعير والربحية"
      >
        <RelatedCalculators currentSlug="vat" />
      </CalculatorSection>

      <CalculatorSection
        id="vat-next"
        eyebrow="التالي"
        title="أكمل حساباتك"
      >
        <Card className="calc-surface-card">
          <CardContent className="calc-cta-actions pt-6">
            <Button asChild className="btn btn-primary--flat calc-button">
              <Link href="/calculators/percentage">احسب النسبة المئوية للضريبة أو الخصم</Link>
            </Button>
            <Button asChild variant="outline" className="btn btn-surface calc-button">
              <Link href="/calculators/monthly-installment">انتقل إلى حاسبة القسط الشهري</Link>
            </Button>
          </CardContent>
        </Card>
      </CalculatorSection>

      <CalculatorFooterCta />
    </main>
  );
}
