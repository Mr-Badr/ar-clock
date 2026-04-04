import { Suspense } from 'react';
import Link from 'next/link';
import { Globe2 } from 'lucide-react';

import { getCountriesAction } from '@/app/actions/location';
import SearchCity from '@/components/SearchCityWrapper.client';
import TimeNowHero from '@/components/time-now/TimeNowHero';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  getPopularTimeNowCityLinks,
  getPopularTimeNowCountryLinks,
} from '@/lib/seo/popular-links';
import { getSiteUrl } from '@/lib/site-config';

import TimeNowClient from './TimeNowClient';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'الوقت الآن في العالم والمدن',
  description:
    'اعرف الوقت الحالي بدقة لحظية في مدينتك وفي مئات المدن حول العالم، مع صفحات داخلية للتاريخ والمنطقة الزمنية والروابط ذات الصلة.',
  keywords: [
    'الوقت الآن',
    'الساعة الآن',
    'الوقت في العالم',
    'توقيت المدن',
    'المنطقة الزمنية',
    'الوقت الآن في المدن العربية',
    'الوقت الآن في العالم',
    'كم الساعة الآن في مدينتي',
    'التاريخ اليوم في المدن',
    'current time',
  ],
  url: `${SITE_URL}/time-now`,
});

export default async function TimeNowPage() {
  const [allCountries, popularCityLinks, popularCountryLinks] = await Promise.all([
    getCountriesAction(),
    getPopularTimeNowCityLinks(),
    getPopularTimeNowCountryLinks(),
  ]);

  const arabTags = ['SA', 'EG', 'AE', 'KW', 'QA', 'BH', 'OM', 'IQ', 'JO', 'LB', 'SY', 'PS', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'SO', 'MR', 'DJ'];
  const arabCountries = allCountries.filter((country) => arabTags.includes(country.country_code));
  const worldCountries = allCountries.filter((country) => !arabTags.includes(country.country_code));

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <main className="content-col pt-24 pb-20">
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <Globe2 size={13} aria-hidden />
            الوقت الان في العالم
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 2rem)', fontWeight: '900', lineHeight: 1.1, margin: '0 auto 0.75rem', maxWidth: '800px' }}>
            الساعة الان في <span className="text-accent">مدينتك</span> — كل ما يتعلق بالوقت في مكان واحد
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 auto', maxWidth: '520px', lineHeight: 1.6 }}>
            اعرف توقيتك بدقة لحظة بلحظة، واستكشف كل ما تحتاجه لفهم الوقت حولك وفي العالم في تجربة بسيطة وسريعة.
          </p>
        </header>

        <section aria-label="البحث عن مدينة" style={{ marginBottom: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <SearchCity mode="time-now" preloadedCountries={allCountries} />
        </section>

        <section aria-label="توقيتك المحلي" style={{ marginBottom: '4rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Suspense fallback={<div style={{ height: '320px', borderRadius: '1rem', background: 'var(--bg-surface-2)', opacity: 0.5, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />}>
              <TimeNowHero cityNameAr="توقيتك المحلي" />
            </Suspense>
          </div>
        </section>



        <Suspense
          fallback={
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.45rem' }}>
              {Array.from({ length: 21 }).map((_, index) => (
                <div key={index} style={{ height: '52px', borderRadius: '0.875rem', background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', opacity: 0.6 }} />
              ))}
            </div>
          }
        >
          <TimeNowClient arabCountries={arabCountries} worldCountries={worldCountries} />
        </Suspense>

        
        <section
          aria-labelledby="popular-time-now-pages-heading"
          style={{ marginBottom: '3rem' }}
        >
          <div
            style={{
              maxWidth: '1080px',
              margin: '0 auto',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-default)',
            }}
          >
            <h2
              id="popular-time-now-pages-heading"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              صفحات الوقت الآن الأكثر بحثاً
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1.25rem',
                maxWidth: '72ch',
              }}
            >
              هذه الروابط مبنية لتجيب مباشرة عن عمليات البحث من نوع "الوقت الآن في
              [مدينة]" و"الساعة الآن في [مدينة]"، مع صفحات داخلية تعرض الوقت الحالي،
              التاريخ اليوم، والمنطقة الزمنية في HTML يمكن لمحركات البحث قراءته فوراً.
            </p>

            <nav aria-label="روابط المدن الأكثر بحثاً">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {popularCityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'block',
                      padding: '1rem',
                      borderRadius: '1rem',
                      textDecoration: 'none',
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <strong
                      style={{
                        display: 'block',
                        color: 'var(--text-primary)',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {item.label}
                    </strong>
                    <span style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </section>

        <section
          aria-labelledby="popular-country-time-heading"
          style={{ marginBottom: '3rem' }}
        >
          <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
            <h2
              id="popular-country-time-heading"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}
            >
              الوقت الآن في الدول والمدن العربية
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '1rem',
                maxWidth: '70ch',
              }}
            >
              إذا كان المستخدم يبحث عن الوقت الآن في دولة كاملة ثم ينتقل إلى مدينة
              بعينها، فهذه الصفحات تمنح مساراً واضحاً بين الدولة والعاصمة والمدن
              الكبرى، وهذا يساعد على الزحف والفهم الموضوعي لصفحات التوقيت في الموقع.
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem',
              }}
            >
              {popularCountryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.7rem 1rem',
                    borderRadius: '999px',
                    textDecoration: 'none',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-default)',
                    fontWeight: '600',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
        
      </main>
    </div>
  );
}
