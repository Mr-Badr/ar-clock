/* Main page */
import Link from 'next/link';
import { Clock, Calendar, Compass, ArrowLeftRight, Bell } from 'lucide-react';
import TimeNowPage from './time-now/page';
import { Globe } from "@/components/ui/globe"
import HomeSections from '@/components/home'
import SectionDivider from '@/components/home/shared/SectionDivider'

const SERVICES = [
  {
    title: 'مواقيت الصلاة',
    desc: 'احصل على مواقيت الصلاة الدقيقة لأكثر من 200,000 مدينة حول العالم مع منبه أذان ذكي.',
    href: '/mwaqit-al-salat/morocco/rabat',
    icon: Bell,
    color: 'var(--accent)',
  },
  {
    title: 'فرق التوقيت',
    desc: 'قارن الوقت بين أي مدينتين وتحقق من ساعات العمل المشتركة وساعات التداخل بدقة.',
    href: '/time-difference',
    icon: ArrowLeftRight,
    color: '#38b2ac',
  },
  {
    title: 'عداد المناسبات',
    desc: 'تابع العد التنازلي لأهم المناسبات الإسلامية، الوطنية، والأكاديمية القادمة.',
    href: '/holidays',
    icon: Calendar,
    color: '#9f7aea',
  },
];

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ساعة عربية',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ساعة عربية',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/waqt',
      'https://facebook.com/waqt'
    ]
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <main className="">
        {/* --- Hero Section --- */}
        <section className="container mx-auto px-4 text-center mb-16">
          <TimeNowPage />
        </section>

        {/* --- Home Sections --- */}
        <HomeSections className="container-col"/>

      </main>


      <footer className="relative overflow-hidden">
 <SectionDivider />
        {/* content */}
        <div className="max-w-7xl mx-auto px-6 pt-16 flex justify-between items-start mix-h-[100rem]">

          {/* RIGHT */}
          <div className="text-right max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-accent" size={26} />
              <span className="text-2xl font-bold"> ميقات</span>
            </div>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              أدوات عربية دقيقة لحساب المواقيت والتقويمات والمناسبات الإسلامية.
            </p>
          </div>

          {/* LEFT LINKS */}
          <div className="flex gap-16 text-sm">

            <div>
              <h3 className="font-semibold mb-3">روابط مفيدة</h3>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><Link href="/mwaqit-al-salat" className="hover:text-accent">مواقيت الصلاة</Link></li>
                <li><Link href="/qibla" className="hover:text-accent">اتجاه القبلة</Link></li>
                <li><Link href="/calendar" className="hover:text-accent">التقويم الإسلامي</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">الموقع</h3>
              <ul className="space-y-2 text-[var(--text-muted)]">
                <li><Link href="/" className="hover:text-accent">الرئيسية</Link></li>
                <li><Link href="/tools" className="hover:text-accent">الأدوات</Link></li>
                <li><Link href="/about" className="hover:text-accent">من نحن</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* GLOBE - يظهر فقط النصف العلوي */}
        <div className="relative w-full h-[400px] overflow-hidden z-50">
          <Globe className="w-[750px] h-[750px]" />
        </div>

      </footer>


    </div>
  );
}