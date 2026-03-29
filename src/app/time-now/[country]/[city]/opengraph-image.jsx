import { ImageResponse } from 'next/og';
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';

export const runtime = 'edge';

// We specify standard OG dimensions
export const alt = 'ميقات - التوقيت المحلي';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { country, city } = params;

  // Ideally, use a robust fallback if DB lookup fails to prevent image 404s
  const countryObj = await getCountryBySlug(country).catch(() => null);
  const cityData = await getCityBySlug(countryObj?.country_code || '', city).catch(() => null);

  const cityNameAr = cityData?.name_ar || cityData?.name_en || decodeURIComponent(city);
  const countryNameAr = countryObj?.name_ar || countryObj?.name_en || decodeURIComponent(country);

  // We can't load local fonts easily without fs in Edge config without standard workarounds,
  // but Next's default sans-serif will fall back to a system Arabic UI font usually.
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #111827, #1f2937)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Subtle decorative background ring */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            top: '-10%',
            right: '-10%',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              color: '#9ca3af',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ميقات | دليل المواعيد والمناسبات
          </div>

          <h1
            style={{
              fontSize: '84px',
              fontWeight: 900,
              margin: '0',
              padding: '0',
              lineHeight: 1.1,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            الوقت الآن في
          </h1>
          <h2
            style={{
              fontSize: '100px',
              fontWeight: 900,
              margin: '0',
              padding: '0',
              color: '#6366f1',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {cityNameAr}
          </h2>

          <div
            style={{
              marginTop: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 32px',
              borderRadius: '999px',
              fontSize: '28px',
              color: '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {countryNameAr} — تحديث حي
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
