/* holidays/[slug]/page.jsx */

import { ALL_EVENTS, getNextEventDate, getTimeRemaining } from '@/lib/holidays-engine';
import Header from '@/components/layout/header';
import CountdownTicker from '@/components/clocks/countdown-ticker';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

/* --------------------------
   Static Params
--------------------------- */
export async function generateStaticParams() {
  return ALL_EVENTS.map((holiday) => ({
    slug: holiday.slug,
  }));
}

/* --------------------------
   SEO Metadata
--------------------------- */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const holiday = ALL_EVENTS.find((h) => h.slug === slug);

  if (!holiday) {
    return {
      title: "404 - الصفحة غير موجودة",
      robots: { index: false, follow: false },
    };
  }

  const url = `${SITE_URL}/holidays/${slug}`;
  return {
    title: holiday.seoTitle || holiday.title,
    description: holiday.description,
    alternates: { canonical: url },
  };
}

/* --------------------------
   Page Component
--------------------------- */
export default async function HolidayCountdown({ params }) {
  const { slug } = await params;
  const holiday = ALL_EVENTS.find((h) => h.slug === slug);

  if (!holiday) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <Header />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link href="/">الرئيسية</Link>
          <span>/</span>
          <Link href="/holidays">المناسبات</Link>
          <span>/</span>
          <span>{holiday.name}</span>
        </nav>

        <Suspense fallback={<div className="h-64 animate-pulse bg-[var(--bg-surface-2)] rounded-2xl" />}>
          <DynamicCountdown holiday={holiday} slug={slug} />
        </Suspense>
      </main>
    </div>
  );
}

// ─── Dynamic Sub-component ───
// This handles time-dependent calculations and Schemas
async function DynamicCountdown({ holiday, slug }) {
  await headers();
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
    <>
      <Script
        id={`event-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CountdownTicker
        holiday={holiday}
        targetDate={targetDate.toISOString()}
        initialTimeRemaining={initialTimeRemaining}
        isEmbedInitial={false}
      />
    </>
  );
}