import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { connection } from 'next/server';

// We attempt to load the custom font from the deployment URL if possible, or fallback
export async function GET(req: NextRequest) {
  await connection();

  try {
    const { searchParams } = new URL(req.url);

    // ?g=19 March 2026&h=١٤ رمضان ١٤٤٧
    const gregorian = searchParams.get('g') || 'التاريخ الميلادي';
    const hijri = searchParams.get('h') || 'التاريخ الهجري';
    const title = searchParams.get('t') || 'التاريخ اليوم — هجري وميلادي';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #1e293b, #0f172a)',
            fontFamily: 'sans-serif',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: '32px', fontWeight: 'bold', marginLeft: '12px', color: '#38bdf8' }}>
              مواقيت
            </span>
          </div>

          <h1
            style={{
              fontSize: '64px',
              fontWeight: 900,
              background: 'linear-gradient(to right, #38bdf8, #818cf8)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              maxWidth: '800px',
              marginTop: '40px',
              padding: '30px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '8px' }}>التاريخ الهجري</span>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f8fafc' }}>{hijri}</span>
            </div>
            <div style={{ width: '2px', height: '60px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '8px' }}>التاريخ الميلادي</span>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f8fafc' }}>{gregorian}</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
