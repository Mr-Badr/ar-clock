import Link from 'next/link';
import {
  ArrowLeft,
  BedDouble,
  BookOpenText,
  Building2,
  ChartColumnIncreasing,
  Landmark,
  PiggyBank,
} from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { ALL_GUIDES } from '@/lib/guides/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function uniqStrings(values) {
  return Array.from(new Set(values.map((value) => String(value || '').trim()).filter(Boolean)));
}

const GUIDE_GROUP_META = [
  {
    href: '/calculators/finance',
    title: 'المال والعمل',
    description: 'أدلة تدعم القروض والضريبة ونهاية الخدمة والنسب المئوية بقرارات أوضح قبل استخدام الحاسبة.',
    accent: '#2563EB',
    Icon: Landmark,
  },
  {
    href: '/calculators/personal-finance',
    title: 'التخطيط المالي الشخصي',
    description: 'شرح عملي للادخار والديون وصندوق الطوارئ وصافي الثروة حتى تبقى الأدوات مرتبطة بخطة واضحة.',
    accent: '#0F766E',
    Icon: PiggyBank,
  },
  {
    href: '/calculators/sleep',
    title: 'النوم الذكي',
    description: 'أدلة قصيرة ومباشرة تشرح دورات النوم والقيلولة ودين النوم واحتياج النوم حسب العمر.',
    accent: '#7C3AED',
    Icon: BedDouble,
  },
  {
    href: '/calculators/building',
    title: 'البناء والتشييد',
    description: 'صفحات توضيحية لمن يريد فهم تقديرات الأسمنت وحديد التسليح والبلاط قبل الحساب النهائي.',
    accent: '#B45309',
    Icon: Building2,
  },
  {
    href: '/economie/market-hours',
    title: 'الاقتصاد الحي',
    description: 'أدلة long-tail حول افتتاح الأسواق والذهب والفوركس وأفضل وقت للتداول للمستخدم العربي.',
    accent: '#1D4ED8',
    Icon: ChartColumnIncreasing,
  },
];

const GROUP_META_BY_HREF = new Map(GUIDE_GROUP_META.map((group) => [group.href, group]));

function buildGuideGroups() {
  const buckets = new Map();

  for (const guide of ALL_GUIDES) {
    const meta = GROUP_META_BY_HREF.get(guide.hubHref) || {
      href: guide.hubHref || '/guides',
      title: guide.hubTitle || 'أدلة متنوعة',
      description: 'أدلة مساندة للأدوات والمسارات الرئيسية داخل الموقع.',
      accent: '#475569',
      Icon: BookOpenText,
    };

    if (!buckets.has(meta.href)) {
      buckets.set(meta.href, {
        ...meta,
        guides: [],
      });
    }

    buckets.get(meta.href).guides.push(guide);
  }

  const orderedGroups = [
    ...GUIDE_GROUP_META.map((group) => buckets.get(group.href)).filter(Boolean),
    ...Array.from(buckets.values()).filter(
      (group) => !GUIDE_GROUP_META.some((item) => item.href === group.href),
    ),
  ];

  return orderedGroups.map((group) => ({
    ...group,
    guides: [...group.guides].sort(
      (a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'ar'),
    ),
  }));
}

const GUIDE_GROUPS = buildGuideGroups();
const GUIDE_KEYWORDS = uniqStrings([
  'أدلة ميقاتنا',
  'شروحات عربية عملية',
  'أدلة الحاسبات العربية',
  'أدلة الاقتصاد الحي',
  ...ALL_GUIDES.flatMap((guide) => [guide.title, ...(guide.keywords || []), ...(guide.intentKeywords || [])]),
]).slice(0, 60);

export const metadata = buildCanonicalMetadata({
  title: 'أدلة عربية عملية تربط الأدوات بالقرار الصحيح',
  description:
    `مجموعة أدلة عربية عملية داخل ${SITE_BRAND} تشرح الحاسبات والاقتصاد والنوم والتخطيط المالي بلغة مباشرة، مع ربط واضح بين المقالات والأدوات والمسارات اليومية.`,
  keywords: GUIDE_KEYWORDS,
  url: `${SITE_URL}/guides`,
});

export default function GuidesPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الأدلة العملية',
    url: `${SITE_URL}/guides`,
    inLanguage: 'ar',
    description: `فهرس منظم للأدلة العربية العملية داخل ${SITE_BRAND} يربط المقالات بالأدوات والمسارات الرئيسية.`,
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدلة', item: `${SITE_URL}/guides` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أدلة الموقع',
    itemListElement: ALL_GUIDES.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `${SITE_URL}${guide.href}`,
    })),
  };

  return (
    <main className="bg-base text-primary">
      <JsonLd data={[collectionSchema, breadcrumbSchema, itemListSchema]} />

      <section className="border-b border-border/60 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_34%),radial-gradient(circle_at_top_left,rgba(15,118,110,0.10),transparent_28%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold text-secondary">
              <BookOpenText size={14} />
              قسم الأدلة العملية
            </div>
            <h1 className="text-balance text-3xl font-black tracking-tight text-primary sm:text-4xl">
              أدلة تشرح السؤال قبل أن ترسلك إلى الأداة
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-secondary sm:text-lg">
              هذه الصفحة تجمع المقالات الشارحة التي تدعم الحاسبات والوقت والاقتصاد داخل
              الموقع. الفكرة ليست نشر مقالات منفصلة فقط، بل بناء طبقة تفسيرية تربط نية
              البحث بالأداة الصحيحة والمسار التالي داخل {SITE_BRAND}.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">إجمالي الأدلة</div>
              <div className="mt-2 text-3xl font-black text-primary">{ALL_GUIDES.length}</div>
              <div className="mt-2 text-sm text-secondary">صفحة تربط long-tail بالأدوات والمسارات اليومية</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">المسارات الرئيسية</div>
              <div className="mt-2 text-3xl font-black text-primary">{GUIDE_GROUPS.length}</div>
              <div className="mt-2 text-sm text-secondary">مجموعات واضحة: مال، نوم، بناء، اقتصاد، وتخطيط مالي</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">الهدف التحريري</div>
              <div className="mt-2 text-xl font-black text-primary">شرح ثم أداة</div>
              <div className="mt-2 text-sm text-secondary">كل دليل ينتهي بخطوة عملية واضحة بدل مقالة معزولة</div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm">
              <div className="text-xs font-semibold text-secondary">الاكتشاف الداخلي</div>
              <div className="mt-2 text-xl font-black text-primary">روابط مترابطة</div>
              <div className="mt-2 text-sm text-secondary">ربط بين الأدلة، الحاسبات، والصفحات العليا لدعم الزائر والزحف معاً</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
          <span className="font-semibold text-primary">ابدأ من المسار:</span>
          <Link href="/calculators" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الحاسبات
          </Link>
          <Link href="/economie" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الاقتصاد
          </Link>
          <Link href="/fahras" className="rounded-full border border-border/70 px-3 py-1 transition hover:border-border hover:bg-surface">
            الفهرس الشامل
          </Link>
        </div>

        <div className="mt-8 space-y-10">
          {GUIDE_GROUPS.map((group) => {
            const Icon = group.Icon || BookOpenText;

            return (
              <section
                key={group.href}
                className="rounded-[28px] border border-border/70 bg-surface/70 p-6 shadow-sm"
                id={group.href.replace(/\//g, '-').replace(/^-+/, '')}
              >
                <div className="flex flex-col gap-4 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div
                      className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl border"
                      style={{
                        color: group.accent,
                        borderColor: `${group.accent}33`,
                        backgroundColor: `${group.accent}14`,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-primary">
                      {group.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-secondary">
                      {group.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary">
                    <span className="rounded-full border border-border/70 px-3 py-1">
                      {group.guides.length} دليل
                    </span>
                    <Link
                      href={group.href}
                      className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 font-semibold text-primary transition hover:border-border hover:bg-background"
                    >
                      افتح المسار
                      <ArrowLeft size={14} />
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {group.guides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="group rounded-3xl border border-border/70 bg-background/90 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            color: group.accent,
                            backgroundColor: `${group.accent}12`,
                          }}
                        >
                          {guide.badge || group.title}
                        </div>
                        <ArrowLeft
                          size={16}
                          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-bold leading-8 text-primary">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-secondary">
                        {guide.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </main>
  );
}
