import Link from 'next/link'
import { Compass } from 'lucide-react'
import { SectionBadge, SectionWrapper } from '@/components/shared/primitives'

const H2_ID = 'h2-footer-taxonomy'

const TAXONOMY_GROUPS = [
  {
    title: 'المتابعة اليومية',
    description: 'افتحها كل يوم لمعرفة الوقت والصلاة والتاريخ بسرعة.',
    links: [
      { href: '/time-now', label: 'الوقت الان' },
      { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
      { href: '/date', label: 'التاريخ والتحويل' },
      { href: '/time-difference', label: 'فرق التوقيت' },
    ],
  },
  {
    title: 'الحاسبات العملية',
    description: 'أدوات سريعة عندما يكون المطلوب رقماً واضحاً أو مقارنة مباشرة.',
    links: [
      { href: '/calculators', label: 'قسم الحاسبات' },
      { href: '/calculators/finance', label: 'المال والعمل' },
      { href: '/calculators/personal-finance', label: 'التخطيط المالي الشخصي' },
      { href: '/calculators/sleep', label: 'النوم الذكي' },
    ],
  },
  {
    title: 'المناسبات والمقالات',
    description: 'مسارات أقرب لأسئلة المواعيد القادمة والشروحات العملية.',
    links: [
      { href: '/holidays', label: 'المناسبات والعد التنازلي' },
      { href: '/blog', label: 'الأدلة والمقالات' },
      { href: '/fahras', label: 'استكشف الصفحات' },
      { href: '/date/calendar', label: 'التقويم السنوي' },
    ],
  },
  {
    title: 'صفحات الثقة والتنقل',
    description: 'ما يشرح من نحن وكيف نكتب وكيف تصل إلى بقية الموقع بسرعة.',
    links: [
      { href: '/fahras', label: 'استكشف الصفحات' },
      { href: '/about', label: 'عن ميقاتنا' },
      { href: '/editorial-policy', label: 'سياسة التحرير' },
      { href: '/contact', label: 'اتصل بنا' },
    ],
  },
]

export default function SectionCitiesGrid() {
  return (
    <SectionWrapper id="section-footer-taxonomy" headingId={H2_ID} subtle>
      <header className="section-head">
        <SectionBadge><Compass size={11} />مسارات ختامية واضحة</SectionBadge>

        <h2
          id={H2_ID}
          className="section-title"
        >
          أكمل رحلتك من{' '}
          <span className="text-accent">المسار الأقرب لما تريد فعله الآن</span>
        </h2>

        <p className="section-copy">
          هذا الجزء ليس دليلاً ضخماً لكل شيء، بل خريطة ختامية مختصرة تساعدك على
          الرجوع إلى الأقسام الأساسية أو صفحات الثقة بسرعة ومن دون تشتيت.
        </p>
      </header>

      <nav
        className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        aria-label="تصنيف صفحات ميقاتنا"
      >
        {TAXONOMY_GROUPS.map((group) => (
          <section
            key={group.title}
            style={{
              display: 'grid',
              gap: 'var(--space-3)',
              paddingBlockStart: 'var(--space-4)',
              borderBlockStart: '1px solid var(--border-subtle)',
            }}
          >
            <h3 className="section-card-title">{group.title}</h3>
            <p className="section-card-copy">{group.description}</p>
            <ul className="grid gap-2" role="list" aria-label={group.title}>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </SectionWrapper>
  )
}
