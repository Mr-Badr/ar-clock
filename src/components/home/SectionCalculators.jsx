import Link from 'next/link';
import {
  ArrowLeft,
  BriefcaseBusiness,
  CakeSlice,
  Calculator,
  CreditCard,
  MoonStar,
  Percent,
  ReceiptText,
} from 'lucide-react';

import CtaLink from '@/components/shared/CtaLink';
import { FeatureItem, SectionBadge, SectionWrapper } from '@/components/shared/primitives';
import { getSiteUrl } from '@/lib/site-config';

const H2_ID = 'h2-calculators';
const SITE_URL = getSiteUrl();

const TOOLS = [
  {
    href: '/calculators/sleep',
    title: 'حاسبات النوم الذكي',
    description: 'ابدأ من متى تنام ومتى تستيقظ وكم تحتاج نوم داخل نظام يومي قابل للرجوع.',
    icon: MoonStar,
  },
  {
    href: '/calculators/personal-finance',
    title: 'حاسبات التخطيط المالي الشخصي',
    description: 'ابدأ من صندوق الطوارئ والديون والادخار وصافي الثروة بحسب القرار الذي تريد ترتيبه.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/calculators/finance',
    title: 'حاسبات المال والعمل',
    description: 'ابدأ من القرض أو الضريبة أو النسبة أو مكافأة نهاية الخدمة بحسب الرقم الذي تريد فهمه.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/calculators/age/calculator',
    title: 'كم عمري الآن؟',
    description: 'احسب عمرك بالسنوات والأشهر والأيام والثواني مع عيد الميلاد القادم من نفس الصفحة.',
    icon: CakeSlice,
  },
  {
    href: '/calculators/end-of-service-benefits',
    title: 'كم مكافأة نهاية الخدمة؟',
    description: 'احسب مكافأة نهاية الخدمة في السعودية بسرعة مع فهم أثر الاستقالة ونهاية العقد.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/calculators/monthly-installment',
    title: 'كم قسط قرض 100 ألف؟',
    description: 'اعرف القسط الشهري وإجمالي الفوائد وتأثير السداد المبكر على أي مبلغ تمويل.',
    icon: CreditCard,
  },
  {
    href: '/calculators/vat',
    title: 'كم ضريبة 1000 ريال عند 15%؟',
    description: 'أضف ضريبة القيمة المضافة أو استخرجها من المبلغ الشامل فوراً مع الفرق بين الشامل وغير الشامل.',
    icon: ReceiptText,
  },
  {
    href: '/calculators/percentage',
    title: 'كم يساوي 20% من 500؟',
    description: 'احسب الخصم والزيادة ونسبة التغيير ونسبة جزء من كل بأمثلة يومية واضحة.',
    icon: Percent,
  },
  {
    href: '/calculators/building',
    title: 'كم تكلفة بناء بيت؟',
    description: 'قدّر تكلفة البناء ومواد التشييد وسعر المتر في عدة دول عربية من صفحة واحدة.',
    icon: Calculator,
  },
];

export default function SectionCalculators() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أشهر الحاسبات العربية في ميقاتنا',
    itemListElement: TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.href}`,
    })),
  };

  return (
    <SectionWrapper
      id="section-calculators"
      headingId={H2_ID}
      subtle
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="media-split__content">
          <SectionBadge>
            <Calculator size={11} />
            الحاسبات الأكثر بحثاً
          </SectionBadge>

          <h2
            id={H2_ID}
            className="section-title"
          >
            حاسبات يومية واضحة تساعدك على الوصول إلى الإجابة بسرعة
          </h2>

          <p className="feature-copy">
            غالباً لا تبدأ من اسم الأداة، بل من سؤال مباشر مثل{' '}
            <strong>حاسبة العمر</strong> أو{' '}
            <strong>متى أنام لأستيقظ الساعة 6</strong> أو{' '}
            <strong>كم قسط قرض 100 ألف</strong> أو{' '}
            <strong>حساب الضريبة 15%</strong>.
            لذلك رتّبنا الحاسبات حول السؤال نفسه: خذ الرقم، اقرأ معناه، ثم جرّب سيناريو آخر قبل الاعتماد عليه.
          </p>

          <ul className="feature-list" role="list" aria-label="مزايا قسم الحاسبات">
            <FeatureItem icon={CakeSlice}>
              أدوات مبنية على أسئلة عربية يومية مثل{' '}
              <strong>احسب عمرك</strong> و{' '}
              <strong>كم عمري</strong>.
            </FeatureItem>
            <FeatureItem icon={MoonStar}>
              مسار نوم ذكي يجيب عن أسئلة تتكرر فعلاً مثل{' '}
              <strong>إذا نمت الآن متى أستيقظ</strong> و{' '}
              <strong>كم ساعة نوم أحتاج</strong>.
            </FeatureItem>
            <FeatureItem icon={BriefcaseBusiness}>
              كل نتيجة تأتي مع شرح قصير وأمثلة تساعدك على فهم الرقم قبل استخدامه في قرار.
            </FeatureItem>
            <FeatureItem icon={ReceiptText}>
              انتقال أسهل بين الحاسبات المتقاربة حتى لا تضيع بين صفحات كثيرة من دون داعٍ.
            </FeatureItem>
          </ul>

          <div className="action-row">
            <CtaLink href="/calculators">افتح قسم الحاسبات</CtaLink>
            <Link
              href="/calculators/personal-finance"
              className="text-link"
            >
              ابدأ بالتخطيط المالي الشخصي
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="section-card-link group"
              >
                <div className="section-icon-box mb-4">
                  <Icon size={19} aria-hidden="true" />
                </div>

                <h3 className="section-card-title mb-2">
                  {tool.title}
                </h3>
                <p className="section-card-copy mb-4">
                  {tool.description}
                </p>
                <span className="section-card-action">
                  ابدأ الحساب
                  <ArrowLeft size={15} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
