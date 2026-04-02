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
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { calculatePrayerTimes, formatTime } from '@/lib/prayerEngine';

export const size = { width: 1200, height: 630 };
export const alt = 'مواقيت الصلاة';

const PRAYER_AR = { fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };

export default async function OgImage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  const cityData = country ? await getCityBySlug(country.country_code, citySlug) : null;

  // Fallback OG if city not found
  if (!cityData || !country) {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', background: '#181C2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#4ECDC4', fontSize: 48, fontWeight: 900 }}>مواقيت الصلاة</span>
      </div>,
      { ...size }
    );
  }

  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: new Date(),
    cacheKey: `${countrySlug}::${citySlug}`
  });

  const prayerRows = times
    ? Object.entries(times).map(([key, iso]) => ({
      name: PRAYER_AR[key],
      time: formatTime(iso, cityData.timezone, false),
    }))
    : [];

  const cityNameAr = cityData.name_ar || cityData.name_en;
  const countryNameAr = country.name_ar || country.name_en;

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#4ECDC4', fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
            {cityNameAr}
          </span>
          <span style={{ color: '#7880AA', fontSize: 28, marginTop: 8 }}>
            {countryNameAr}
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

      {/* Prayer grid */}
      <div style={{ display: 'flex', gap: 16, flex: 1, flexWrap: 'wrap' }}>
        {prayerRows.map(({ name, time }) => (
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
            <span style={{ color: '#E8EAFF', fontSize: 32, fontWeight: 800 }}>{time}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ color: '#454D70', fontSize: 20, marginTop: 32, textAlign: 'center' }}>
        {cityData.timezone} — حسابات فلكية دقيقة
      </div>
    </div>,
    { ...size }
  );
}
