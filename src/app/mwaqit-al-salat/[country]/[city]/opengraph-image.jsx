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
import { getOgCityLabels } from '@/lib/geo-og-labels';

export const size = { width: 1200, height: 630 };
export const alt = 'مواقيت الصلاة';
export const contentType = 'image/png';
export const runtime = 'nodejs';
export const revalidate = 86400;

function renderFallbackImage(label = 'مواقيت الصلاة', sublabel = '') {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#181C2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <span style={{ color: '#4ECDC4', fontSize: 48, fontWeight: 900 }}>{label}</span>
        {sublabel ? <span style={{ color: '#A8AFCC', fontSize: 28, fontWeight: 600 }}>{sublabel}</span> : null}
      </div>
    ),
    { ...size },
  );
}

export default async function OgImage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const {
    cityLabel,
    countryLabel,
    fallbackCityLabel,
    fallbackCountryLabel,
  } = getOgCityLabels(countrySlug, citySlug);

  try {
    return new ImageResponse(
      <div
        style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(135deg, #0E1120 0%, #181C2A 60%, #1F2438 100%)',
          display: 'flex', flexDirection: 'column',
          padding: '60px 80px', fontFamily: 'sans-serif',
          direction: 'rtl',
        }}
      >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#4ECDC4', fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
              {cityLabel}
            </span>
            <span style={{ color: '#7880AA', fontSize: 28, marginTop: 8 }}>
              {countryLabel}
            </span>
          </div>
          <div style={{
            background: 'rgba(78,205,196,0.12)', border: '2px solid rgba(78,205,196,0.4)',
            borderRadius: 20, padding: '16px 32px',
            color: '#4ECDC4', fontSize: 26, fontWeight: 700,
          }}>
            مواقيت الصلاة اليوم
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap' }}>
          {['الفجر', 'الظهر', 'العصر', 'المغرب', 'العشاء'].map((name) => (
            <div
              key={name}
              style={{
                flex: '1 1 30%', background: 'rgba(31,36,56,0.8)',
                border: '1px solid #363D5C', borderRadius: 16,
                padding: '24px 28px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{ color: '#A8AFCC', fontSize: 22 }}>{name}</span>
              <span style={{ color: '#E8EAFF', fontSize: 26, fontWeight: 800 }}>محدثة يومياً</span>
            </div>
          ))}
        </div>

        <div style={{ color: '#454D70', fontSize: 20, marginTop: 32, textAlign: 'center' }}>
          {cityLabel} — {countryLabel}
        </div>
      </div>,
      { ...size },
    );
  } catch (error) {
    logError('prayer-city-og-image-failed', {
      routePath: `/mwaqit-al-salat/${countrySlug}/${citySlug}/opengraph-image`,
      countrySlug,
      citySlug,
      error: error instanceof Error ? { name: error.name, message: error.message } : { message: String(error) },
    });
    return renderFallbackImage(fallbackCityLabel, fallbackCountryLabel);
  }
}
