import Link from 'next/link';
import {
  ArrowLeft,
  CakeSlice,
  Calculator,
  MoonStar,
  ReceiptText,
} from 'lucide-react';

import CtaLink from '@/components/shared/CtaLink';
import { FeatureItem, SectionBadge, SectionWrapper } from '@/components/shared/primitives';
import { getSiteUrl } from '@/lib/site-config';

const H2_ID = 'h2-calculators';
const SITE_URL = getSiteUrl();

const TOOLS = [
  {
    href: '/tools/sleep',
    title: 'حاسبات النوم الذكي',
    description: 'متى تنام ومتى تستيقظ وكم تحتاج من نوم فعلياً.',
  },
  {
    href: '/tools/personal-finance',
    title: 'التخطيط المالي الشخصي',
    description: 'صندوق الطوارئ، سداد الديون، الادخار، وصافي الثروة.',
  },
  {
    href: '/tools/gulf-finance',
    title: 'حاسبات المال والعمل',
    description: 'مكافأة نهاية الخدمة، تعويض المادة 77، وخصم المخالفات المرورية.',
  },
  {
    href: '/tools/health/age-calculator',
    title: 'حاسبة العمر',
    description: 'عمرك بالسنوات والأشهر والأيام مع موعد عيد ميلادك القادم.',
  },
  {
    href: '/tools/construction/build-cost',
    title: 'تكلفة البناء',
    description: 'قدّر تكلفة البناء والتشطيب في 14 دولة عربية من صفحة واحدة.',
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
            كل قسم داخل صفحة الأدوات مرتب حول السؤال نفسه: خذ الرقم، اقرأ معناه، ثم جرّب سيناريو آخر قبل الاعتماد عليه.
          </p>

          <ul className="feature-list" role="list" aria-label="مزايا قسم الحاسبات">
            <FeatureItem icon={CakeSlice}>
              أدوات مبنية على أسئلة عربية يومية مثل{' '}
              <strong>احسب عمرك</strong> و{' '}
              <strong>كم عمري</strong>.
            </FeatureItem>
            <FeatureItem icon={MoonStar}>
              مسار نوم ذكي يجيب عن أسئلة تتكرر فعلاً مثل{' '}
              <strong>إذا نمت الآن متى أستيقظ</strong>.
            </FeatureItem>
            <FeatureItem icon={ReceiptText}>
              كل نتيجة تأتي مع شرح قصير وأمثلة تساعدك على فهم الرقم قبل استخدامه في قرار.
            </FeatureItem>
          </ul>

          <div className="action-row">
            <CtaLink href="/tools">افتح قسم الحاسبات</CtaLink>
            <Link
              href="/tools/personal-finance"
              className="text-link"
            >
              ابدأ بالتخطيط المالي الشخصي
            </Link>
          </div>
        </div>

        <nav className="method-source-list" aria-label="أبرز أقسام الحاسبات">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="method-source-item group"
            >
              <div className="method-source-item__body">
                <h3 className="section-card-title">{tool.title}</h3>
                <p className="section-card-copy">{tool.description}</p>
              </div>
              <span className="method-source-item__action section-card-action">
                ابدأ
                <ArrowLeft size={15} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </SectionWrapper>
  );
}
