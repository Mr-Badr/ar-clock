/**
 * app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx
 *
 * Next.js 15+ dynamic OG image using ImageResponse.
 * Served at /mwaqit-al-salat/[country]/[city]/opengraph-image
 * Auto-linked by generateMetadata's openGraph.images field.
 *
 * Why this matters for SEO:
 * - WhatsApp, Telegram, Twitter previews show prayer times visually.
 * - Social sharing drive organic Arabic backlinks.
 * - Google Search Console surfaces OG images in rich results.
 */

import { ImageResponse } from 'next/og';
import { logError } from '@/lib/observability';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getOgCityLabels } from '@/lib/geo-og-labels';
import { getSafeOgArabicFonts } from '@/lib/og-fonts';
import { getMethodByCountry } from '@/lib/prayer-methods';
import { SITE_BRAND } from '@/lib/site-config';

export const size = { width: 1200, height: 630 };
export const alt = 'مواقيت الصلاة';
export const contentType = 'image/png';
export const runtime = 'nodejs';
export const revalidate = 86400;

function renderFallbackImage(label = 'مواقيت الصلاة', sublabel = '', fonts) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0E1120 0%, #181C2A 60%, #1F2438 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          padding: '48px',
          textAlign: 'center',
          fontFamily: 'Noto Sans Arabic, Noto Sans',
        }}
      >
        <span style={{ color: '#9CA3C9', fontSize: 28, fontWeight: 700 }}>{SITE_BRAND} | مواقيت الصلاة</span>
        <span style={{ color: '#F4F6FF', fontSize: 62, fontWeight: 900 }}>{label}</span>
        {sublabel ? <span style={{ color: '#A8AFCC', fontSize: 30, fontWeight: 600 }}>{sublabel}</span> : null}
      </div>
    ),
    { ...size, fonts },
  );
}

export default async function OgImage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const fonts = await getSafeOgArabicFonts({
    routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}/opengraph-image`,
    countrySlug,
    citySlug,
  });
  const {
    cityLabel,
    countryLabel,
    fallbackCityLabel,
    fallbackCountryLabel,
  } = getOgCityLabels(countrySlug, citySlug);
  const country = await getCountryBySlug(countrySlug).catch(() => null);
  const methodLabel = country?.country_code
    ? getMethodByCountry(country.country_code).label
    : 'الطريقة المعتمدة محلياً';

  try {
    return new ImageResponse(
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0E1120 0%, #181C2A 60%, #1F2438 100%)',
          display: 'flex', flexDirection: 'column',
          padding: '60px 80px', fontFamily: 'Noto Sans Arabic, Noto Sans',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '520px',
            height: '520px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(78,205,196,0.12) 0%, rgba(78,205,196,0) 72%)',
            top: '-18%',
            left: '-8%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '380px',
            height: '380px',
            borderRadius: '999px',
            background: 'radial-gradient(circle, rgba(115,120,255,0.14) 0%, rgba(115,120,255,0) 72%)',
            bottom: '-12%',
            right: '-4%',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 44 }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '66%' }}>
            <span style={{ color: '#A8AFCC', fontSize: 26, fontWeight: 700 }}>
              {SITE_BRAND} | مواقيت الصلاة اليوم
            </span>
            <span style={{ color: '#F4F6FF', fontSize: 74, fontWeight: 900, lineHeight: 1.08, marginTop: 18 }}>
              {cityLabel}
            </span>
            <span style={{ color: '#8E97BE', fontSize: 30, marginTop: 10 }}>
              {countryLabel}
            </span>
          </div>
          <div
            style={{
              background: 'rgba(78,205,196,0.12)',
              border: '2px solid rgba(78,205,196,0.35)',
              borderRadius: 20,
              padding: '14px 24px',
              color: '#62E0D4',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            الفجر والمغرب والصلاة القادمة
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 22 }}>
          {[
            'الجدول اليومي',
            'طريقة الحساب',
            'الجدول الشهري',
          ].map((name) => (
            <div
              key={name}
              style={{
                flex: 1,
                background: 'rgba(31,36,56,0.84)',
                border: '1px solid #363D5C',
                borderRadius: 16,
                padding: '22px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#E8EAFF', fontSize: 24, fontWeight: 800 }}>{name}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              color: '#C8CEE8',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            الطريقة: {methodLabel}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              color: '#C8CEE8',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            محدثة يومياً حسب المدينة
          </div>
        </div>
      </div>,
      { ...size, fonts },
    );
  } catch (error) {
    logError('prayer-city-og-image-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}/opengraph-image`,
      countrySlug,
      citySlug,
      error: error instanceof Error ? { name: error.name, message: error.message } : { message: String(error) },
    });
    return renderFallbackImage(fallbackCityLabel, fallbackCountryLabel, fonts);
  }
}
