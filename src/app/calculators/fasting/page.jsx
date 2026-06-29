import FastingWindowCalculator from '@/components/calculators/FastingWindowCalculatorLoader.client';
import {
  CalculatorFaqSection,
  CalculatorHero,
  CalculatorSection,
  CalculatorSources,
  RelatedCalculators,
} from '@/components/calculators/common';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'fasting');
const CONTENT = getFinancePageContent('fasting');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const PROTOCOL_TABLE = [
  { id: '16:8',  fast: '16',          eat: '8',   autophagy: '14–16 ساعة',  bestFor: 'الوزن والصحة العامة' },
  { id: '18:6',  fast: '18',          eat: '6',   autophagy: '16–18 ساعة',  bestFor: 'تعزيز الالتهام الذاتي' },
  { id: '20:4',  fast: '20',          eat: '4',   autophagy: '18+ ساعة',    bestFor: 'حرق الدهون العميق' },
  { id: 'OMAD',  fast: '23',          eat: '1',   autophagy: 'ذروة الالتهام', bestFor: 'التجديد الخلوي الكامل' },
  { id: '5:2',   fast: 'يومان/أسبوع', eat: 'مرن', autophagy: 'متذبذب',      bestFor: 'المرونة في الجدول' },
];

export default async function FastingPage() {
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
    <main className="calc-product-page bg-base text-primary" dir="rtl" lang="ar">
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
        <FastingWindowCalculator />
      </CalculatorHero>

      <CalculatorSection
        id="fasting-protocols"
        eyebrow="مقارنة البروتوكولات"
        title="أيّ بروتوكول صيام يناسبك؟"
        description="جدول مقارنة كامل للبروتوكولات الخمسة — من الأسهل إلى الأكثر تأثيراً."
      >
        <div className="calc-table-wrap">
          <table className="calc-table">
            <thead>
              <tr>
                <th>البروتوكول</th>
                <th>صيام</th>
                <th>أكل</th>
                <th>للالتهام الذاتي</th>
                <th>الأمثل لـ</th>
              </tr>
            </thead>
            <tbody>
              {PROTOCOL_TABLE.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.id}</strong></td>
                  <td>{p.fast} {p.fast.includes('يوم') ? '' : 'ساعة'}</td>
                  <td>{p.eat} {p.eat === 'مرن' ? '' : 'ساعة'}</td>
                  <td>{p.autophagy}</td>
                  <td>{p.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalculatorSection>

      <CalculatorSection
        showAdBefore
        id="fasting-ramadan"
        eyebrow="رمضان والصيام المتقطع"
        title="كيف يختلف صيام رمضان عن الصيام المتقطع الصحي؟"
      >
        <div className="calc-editorial-block">
          <p>
            رمضان هو صيام جاف (دون ماء أو طعام) من الفجر حتى المغرب — وفي الخليج يمتد في فصل الصيف من 15 إلى 18 ساعة يومياً. هذه المدة تتجاوز بروتوكول 16:8 الشائع وتقترب من 18:6، مما يعني أن المسلمين يمارسون أحد أشكال الصيام المتقطع الأكثر صحيةً تلقائياً طوال شهر كامل.
          </p>
          <p>
            الفارق الجوهري: في الصيام المتقطع الصحي تُسمح المشروبات الصفرية السعرات (ماء، قهوة سوداء، شاي بدون سكر)، وهذه تساعد على كبح الجوع وتحافظ على الالتهام الذاتي. رمضان هو صيام جاف لا يُسمح فيه بذلك — مما يجعله أكثر شدةً صحياً.
          </p>
          <p>
            <strong>أفضل استراتيجية:</strong> استخدم الأسابيع الثلاثة الأولى بعد رمضان للانتقال تدريجياً إلى 16:8. سيساعدك التكيّف من رمضان على تحمّل فترة الجوع بسهولة.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="fasting-autophagy"
        eyebrow="الالتهام الذاتي"
        title="ما هو الالتهام الذاتي ولماذا يهمك؟"
      >
        <div className="calc-editorial-block">
          <p>
            الالتهام الذاتي (Autophagy) اكتشاف حصل على جائزة نوبل 2016 — هو عملية تنظيف خلوي طبيعية تقوم فيها الخلايا بتفكيك البروتينات التالفة والمكونات المعطوبة وإعادة تدويرها. فكّر فيه كـ"إعادة تدوير النفايات الداخلية".
          </p>
          <p>
            يبدأ التفعيل بعد 12–14 ساعة من الصيام، ويصل ذروته بعد 24–48 ساعة. الأبحاث تربطه بتباطؤ الشيخوخة، تقليل مخاطر السرطان، وتحسين وظائف الدماغ. هذا ما يجعل الصيام المتقطع أكثر من مجرد تقليل للسعرات — إنه إعادة برمجة خلوية.
          </p>
        </div>
      </CalculatorSection>

      <CalculatorSection
        id="fasting-faq"
        eyebrow="أسئلة شائعة"
        title="أسئلة عن الصيام المتقطع والبروتوكولات"
      >
        <CalculatorFaqSection items={faqItems} />
      </CalculatorSection>

      <CalculatorSection id="fasting-related">
        <CalculatorSources sources={CONTENT.sources} />

        <RelatedCalculators currentSlug="fasting" />
      </CalculatorSection>
    </main>
  );
}
