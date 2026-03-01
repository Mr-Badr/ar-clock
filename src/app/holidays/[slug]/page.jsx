/* holidays/[slug]/page.jsx */ 
import { ALL_EVENTS, getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import Header from '@/components/layout/header';
import CountdownTicker from '@/components/clocks/countdown-ticker';
import Link from 'next/link';

export async function generateStaticParams() {
  // console.log('🔥 generateStaticParams called');
  // console.log('ALL_EVENTS length:', ALL_EVENTS.length);
  // console.log('ALL_EVENTS slugs:', ALL_EVENTS.map(e => e.slug));

  return ALL_EVENTS.map((holiday) => ({
    slug: holiday.slug,
  }));
}

export default async function HolidayCountdown({ params }) {

  const { slug } = await params;

  const holiday = ALL_EVENTS.find((h) => h.slug === slug);


  if (!holiday) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">المناسبة غير موجودة</h1>
          <Link href="/holidays" className="text-primary hover:underline">العودة لقائمة المناسبات</Link>
        </div>
      </div>
    );
  }

  const targetDate = getNextEventDate(holiday);
  const initialTimeRemaining = getTimeRemaining(targetDate);

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": holiday.seoTitle || holiday.title,
            "description": holiday.description,
            "startDate": targetDate.toISOString().split('T')[0],
            "location": { "@type": "Place", "name": "Global / Islamic World" },
            "image": "https://vclock.com/logo.png",
            "eventStatus": "https://schema.org/EventScheduled"
          })
        }}
      />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-8">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <span className="opacity-50">/</span>
          <Link href="/holidays" className="hover:text-primary">المناسبات</Link>
          <span className="opacity-50">/</span>
          <span className="text-foreground">{holiday.name}</span>
        </nav>

        <CountdownTicker
          holiday={holiday}
          targetDate={targetDate.toISOString()}
          initialTimeRemaining={initialTimeRemaining}
          isEmbedInitial={false}
        />
      </main>
    </div>
  );
}