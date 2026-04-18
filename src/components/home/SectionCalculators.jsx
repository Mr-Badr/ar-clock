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
    description: 'ابدأ من صندوق الطوارئ والديون والادخار وصافي الثروة داخل مسار واحد قوي.',
    icon: BriefcaseBusiness,
  },
  {
    href: '/calculators/finance',
    title: 'حاسبات المال والعمل',
    description: 'ابدأ من مسار يجمع القرض والضريبة والنسبة ومكافأة نهاية الخدمة في بوابة واحدة.',
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
      glow={
        <div
          className="pointer-events-none absolute end-0 top-0 h-[420px] w-[420px] translate-x-1/3 -translate-y-1/4 rounded-full blur-3xl opacity-[0.08]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="space-y-5">
          <SectionBadge>
            <Calculator size={11} />
            الحاسبات الأكثر بحثاً
          </SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.15rem]"
            style={{ color: 'var(--text-primary)' }}
          >
            مسارات حاسبات واضحة: التخطيط المالي، العمر، المال والعمل، البناء، والعمليات اليومية
          </h2>

          <p
            className="text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            كثير من الزوار لا يبحثون عن اسم موقع، بل يكتبون مباشرة{' '}
            <strong style={{ color: 'var(--text-primary)' }}>حاسبة العمر</strong> أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>متى أنام لأستيقظ الساعة 6</strong> أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>كم قسط قرض 100 ألف</strong> أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>حساب الضريبة 15%</strong>.
            لهذا لم نكتفِ ببطاقات أدوات فقط، بل بدأنا نبني مسارات أعلى تجمع الأدوات
            المتقاربة في نية البحث حتى يصل المستخدم إلى الصفحة المناسبة أسرع.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا قسم الحاسبات">
            <FeatureItem icon={CakeSlice}>
              أدوات موجّهة لعبارات بحث عربية واضحة مثل{' '}
              <strong style={{ color: 'var(--text-primary)' }}>احسب عمرك</strong> و{' '}
              <strong style={{ color: 'var(--text-primary)' }}>كم عمري</strong>.
            </FeatureItem>
            <FeatureItem icon={MoonStar}>
              مسار نوم ذكي يلتقط عبارات عالية التكرار مثل{' '}
              <strong style={{ color: 'var(--text-primary)' }}>إذا نمت الآن متى أستيقظ</strong> و{' '}
              <strong style={{ color: 'var(--text-primary)' }}>كم ساعة نوم أحتاج</strong>.
            </FeatureItem>
            <FeatureItem icon={BriefcaseBusiness}>
              صفحات أعمق من مجرد نموذج: حاسبة مع شرح وأمثلة وأسئلة شائعة ونية بحث واضحة.
            </FeatureItem>
            <FeatureItem icon={ReceiptText}>
              روابط داخلية مباشرة إلى أكثر الأدوات استخداماً حتى يسهل على Google اكتشافها
              وترتيبها.
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/calculators">افتح قسم الحاسبات</CtaLink>
            <Link
              href="/calculators/personal-finance"
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-alt)' }}
            >
              ابدأ بالتخطيط المالي الشخصي
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:border-[var(--border-default)] hover:shadow-[var(--shadow-lg)]"
                style={{
                  background: 'var(--bg-surface-1)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border"
                  style={{
                    background: 'var(--accent-soft)',
                    borderColor: 'var(--border-accent)',
                    color: 'var(--accent-alt)',
                  }}
                >
                  <Icon size={19} aria-hidden="true" />
                </div>

                <h3
                  className="mb-2 text-base font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tool.title}
                </h3>
                <p
                  className="mb-4 text-sm leading-6"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {tool.description}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'var(--accent-alt)' }}
                >
                  افتح الأداة
                  <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
