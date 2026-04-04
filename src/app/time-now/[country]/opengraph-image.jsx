import { ImageResponse } from 'next/og';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity } from '@/lib/db/queries/cities';

export const alt = 'ميقات - الوقت الآن';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { country } = await params;

  const countryObj = await getCountryBySlug(country).catch(() => null);
  const capital = countryObj ? await getCapitalCity(countryObj.country_code).catch(() => null) : null;

  const countryNameAr = countryObj?.name_ar || countryObj?.name_en || decodeURIComponent(country);
  const capitalNameAr = capital?.name_ar || capital?.name_en || countryNameAr;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f766e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top right, rgba(45, 212, 191, 0.22), transparent 40%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.18), transparent 45%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            textAlign: 'center',
            padding: '48px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              fontWeight: 600,
              color: '#cbd5e1',
            }}
          >
            ميقات | الوقت الآن
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '76px',
              fontWeight: 900,
              lineHeight: 1.1,
            }}
          >
            الوقت الان في {countryNameAr}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '42px',
              fontWeight: 700,
              color: '#99f6e4',
            }}
          >
            العاصمة: {capitalNameAr}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
