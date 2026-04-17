import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  BellRing,
  Clock3,
  Coins,
  Globe2,
  TrendingUp,
} from 'lucide-react';

import CtaLink from '@/components/shared/CtaLink';
import { FeatureItem, SectionBadge, SectionWrapper } from '@/components/shared/primitives';
import { getSiteUrl } from '@/lib/site-config';

const H2_ID = 'h2-economy';
const SITE_URL = getSiteUrl();

const TOOLS = [
  {
    href: '/economie/us-market-open',
    title: 'متى يفتح السوق الأمريكي؟',
    description: 'اعرف موعد افتتاح السوق الأمريكي الآن من مدينتك وبتوقيتك المحلي.',
    icon: TrendingUp,
  },
  {
    href: '/economie/gold-market-hours',
    title: 'هل الذهب مفتوح الآن؟',
    description: 'تحقق من ساعات تداول الذهب وأوقات النشاط حول العالم.',
    icon: Coins,
  },
  {
    href: '/economie/forex-sessions',
    title: 'جلسات الفوركس الآن',
    description: 'تابع جلسات سيدني وطوكيو ولندن ونيويورك وما بينها من تداخل.',
    icon: Globe2,
  },
  {
    href: '/economie/stock-markets',
    title: 'البورصات العالمية الآن',
    description: 'شاهد البورصات المفتوحة والمغلقة حول العالم في صفحة واحدة.',
    icon: BarChart3,
  },
  {
    href: '/economie/market-clock',
    title: 'ساعة السوق',
    description: 'اعرف أين تتركز السيولة الآن وكيف ينتقل النشاط بين الأسواق.',
    icon: Clock3,
  },
  {
    href: '/economie/best-trading-time',
    title: 'أفضل وقت للتداول',
    description: 'تعرّف على الفترات الأكثر نشاطاً للتداول حسب الأداة والمدينة.',
    icon: BellRing,
  },
];

export default function SectionEconomy() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أدوات الاقتصاد الحي في ميقاتنا',
    itemListElement: TOOLS.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.title,
      url: `${SITE_URL}${tool.href}`,
    })),
  };

  return (
    <SectionWrapper
      id="section-economy"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute start-0 top-0 h-[420px] w-[420px] -translate-x-1/3 -translate-y-1/4 rounded-full blur-3xl opacity-[0.08]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
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
                  افتح الصفحة
                  <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-5">
          <SectionBadge>
            <TrendingUp size={11} />
            اقتصاد مباشر
          </SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.15rem]"
            style={{ color: 'var(--text-primary)' }}
          >
            هل الذهب أو السوق الأمريكي مفتوح الآن؟
          </h2>

          <p
            className="text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            هذا النوع من الصفحات يخدم نية بحث فورية وواضحة: المستخدم يريد جواباً سريعاً
            مثل <strong style={{ color: 'var(--text-primary)' }}>هل الذهب مفتوح الآن</strong>
            ، <strong style={{ color: 'var(--text-primary)' }}>متى يفتح السوق الأمريكي</strong>
            ، أو <strong style={{ color: 'var(--text-primary)' }}>جلسات الفوركس الآن</strong>.
            لذلك جمعنا الأدوات الاقتصادية في مركز واحد سهل الاكتشاف وسريع القراءة.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا قسم الاقتصاد">
            <FeatureItem icon={Clock3}>
              صفحات مبنية حول أسئلة وقتية مباشرة تزيد من فرصة الظهور والنقر في البحث.
            </FeatureItem>
            <FeatureItem icon={Coins}>
              تغطية لذهب وفوركس وبورصات وأسواق أمريكية بدل الاكتفاء بصفحة عامة مبهمة.
            </FeatureItem>
            <FeatureItem icon={BarChart3}>
              روابط مباشرة من الصفحة الرئيسية إلى الأدوات الأعلى نيةً لاكتشاف أسرع وفهرسة
              أفضل.
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/economie">افتح قسم الاقتصاد</CtaLink>
            <Link
              href="/economie/us-market-open"
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--accent-alt)' }}
            >
              ابدأ بالسوق الأمريكي
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
