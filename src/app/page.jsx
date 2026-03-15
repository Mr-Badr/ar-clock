/* Main page */
import LiveClock from '@/components/clocks/LiveClock';
import Link from 'next/link';
import { Clock, Calendar, Compass, ArrowLeftRight, Bell } from 'lucide-react';
import TimeNowPage from './time-now/page';

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://waqt.com';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ساعة عربية',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
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

      <main className="pt-24 pb-20">
        {/* --- Hero Section --- */}
        <section className="container mx-auto px-4 text-center mb-16">
          <TimeNowPage />
        </section>

        {/* --- Services Grid --- */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">خدماتنا المتميزة</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} className="group p-8 rounded-3xl bg-[var(--bg-surface-2)] border border-[var(--border-default)] hover:border-[var(--accent)] transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                  <s.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent tracking-tight">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* --- SEO Content Section --- */}
        <section className="container mx-auto px-4 py-16 border-t border-[var(--border-subtle)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">لماذا تختار منصة "ساعة عربية"؟</h2>
            <div className="prose prose-invert max-w-none text-muted leading-loose space-y-4">
              <p>
                تعتبر منصتنا المرجع الأدق للمستخدم العربي الذي يبحث عن <strong>أوقات الصلاة</strong> و<strong>الساعة الان</strong> في مختلف دول العالم. نحن نستخدم خوارزميات فلكية متطورة لحساب مواقيت الصلاة بناءً على الإحداثيات الجغرافية الدقيقة لكل مدينة.
              </p>
              <p>
                سواء كنت تبحث عن <strong>فرق التوقيت بين الرياض ولندن</strong>، أو ترغب في معرفة <strong>كم متبقي على رمضان</strong>، فإن أدواتنا التفاعلية توفر لك الإجابة بلمح البصر وبواجهة مستخدم تدعم القراءة من اليمين إلى اليسار (RTL) بشكل مثالي.
              </p>
              <p>
                تسعى "ساعة عربية" لتكون الوجهة الأولى لكل من يتساءل عن <strong>توقيت مصر الان</strong> أو <strong>مواقيت الصلاة في المغرب</strong> أو <strong>الساعة في السعودية</strong>. نظامنا يدعم تتبع الوقت لآلاف المدن وتوفير معلومات المنطقة الزمنية (Timezone) بدقة متناهية.
              </p>
            </div>

            {/* --- Hidden SEO Keyword Semantic Section --- */}
            <div className="sr-only" aria-hidden="true">
              <h3>الكلمات الأكثر بحثاً ومقالات التوقيت</h3>
              <ul>
                <li>توقيت القاهرة الان، مواقيت الصلاة في الرياض، أذان الفجر مكة المكرمة</li>
                <li>الوقت الحالي في دبي، ساعة المغرب الان، توقيت الجزائر العاصمة</li>
                <li>مواعيد الصلاة في الكويت، وقت الشروق في عمان، أذان المغرب دبي</li>
                <li>التحويل بين التاريخ الهجري والميلادي، موعد دخول رمضان 2025</li>
                <li>فرق التوقيت بين الدول، توقيت غرينتش الان، المناطق الزمنية العالمية</li>
                <li>صلاة الفجر، صلاة الظهر، صلاة العصر، صلاة المغرب، صلاة العشاء</li>
              </ul>
              <p>
                نغطي جميع المدن العربية: جدة، الدمام، الإسكندرية، الدار البيضاء، طنجة، وهران، قسنطينة، تونس، صفاقس، بنغازي، طرابلس، الخرطوم، ام درمان، بغداد، الموصل، البصرة، عمان، الزرقاء، اربد، دمشق، حلب، بيروت، طرابلس لبنان، غزة، القدس، رام الله، صنعاء، عدن، الكويت، المنامة، الدوحة، مسقط، مقديشو، جيبوتي، نواكشوط، موروني.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-[var(--border-subtle)] text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="text-accent" size={24} />
          <span className="text-xl font-bold">ساعة عربية</span>
        </div>
        <p className="text-muted text-sm">© 2025 جميع الحقوق محفوظة. صُمم بدقة للمستخدم العربي.</p>
      </footer>
    </div>
  );
}