/* holidays/[slug]/page.jsx */

import { ALL_EVENTS, getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import Header from '@/components/layout/header';
import CountdownTicker from '@/components/clocks/countdown-ticker';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';

const SITE_URL = "https://yourdomain.com";

/* --------------------------
   Static Params
--------------------------- */

export async function generateStaticParams() {
  return ALL_EVENTS.map((holiday) => ({
    slug: holiday.slug,
  }));
}

/* --------------------------
   SEO Metadata (Next 16 fix)
--------------------------- */

export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ MUST await in Next 16
  const holiday = ALL_EVENTS.find((h) => h.slug === slug);

  if (!holiday) {
    return {
      title: "404 - الصفحة غير موجودة",
      robots: {
        index: false,
        follow: false,
        nocache: true
      },
    };
  }

  const url = `${SITE_URL}/holidays/${slug}`;

  return {
    title: holiday.seoTitle || holiday.title,
    description: holiday.description,
    alternates: {
      canonical: url,
    },
  };
}

/* --------------------------
   Page Component
--------------------------- */

export default async function HolidayCountdown({ params }) {
  const { slug } = await params; // ✅ MUST await in Next 16

  const holiday = ALL_EVENTS.find((h) => h.slug === slug);

  if (!holiday) {
    notFound(); // ✅ Proper Next.js way
  }

  const targetDate = getNextEventDate(holiday);
  const initialTimeRemaining = getTimeRemaining(targetDate);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: holiday.seoTitle || holiday.title,
    description: holiday.description,
    startDate: targetDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: `${SITE_URL}/holidays/${slug}`
    },
    inLanguage: "ar",
    url: `${SITE_URL}/holidays/${slug}`,
  };

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">

      <Script
        id="event-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/holidays">المناسبات</Link>
          <span>/</span>
          <span>{holiday.name}</span>
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