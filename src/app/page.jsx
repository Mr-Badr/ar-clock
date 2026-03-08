/* Main page */
import LiveClock from '@/components/clocks/LiveClock';
import Link from 'next/link';
import { Clock, Calendar, Compass, ArrowLeftRight, Bell } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">

      <main className="pt-24 pb-20">
        {/* --- Hero Section --- */}
        <section className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            ساعة عربية — <span className="text-accent italic">وقتك</span> في مكان واحد
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-12">
            المنصة العربية الأولى لمواقيت الصلاة الدقيقة، فرق التوقيت العالمي، وتتبع المناسبات بلمسة تصميم عصرية.
          </p>

          <div className="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-[var(--accent-glow-soft)]">
            <LiveClock timezone={null} />
          </div>
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
                    تعتبر منصتنا المرجع الأدق للمستخدم العربي الذي يبحث عن <strong>أوقات الصلاة</strong> و<strong>الساعة الآن</strong> في مختلف دول العالم. نحن نستخدم خوارزميات فلكية متطورة لحساب مواقيت الصلاة بناءً على الإحداثيات الجغرافية الدقيقة لكل مدينة.
                 </p>
                 <p>
                    سواء كنت تبحث عن <strong>فرق التوقيت بين الرياض ولندن</strong>، أو ترغب في معرفة <strong>كم متبقي على رمضان</strong>، فإن أدواتنا التفاعلية توفر لك الإجابة بلمح البصر وبواجهة مستخدم تدعم القراءة من اليمين إلى اليسار (RTL) بشكل مثالي.
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