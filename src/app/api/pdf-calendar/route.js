/**
 * app/api/pdf-calendar/route.js
 *
 * Puppeteer PDF generation for تقويم مواقيت الصلاة
 *
 * ── INSTALLATION ──────────────────────────────────────────────────────────────
 *   Standard (local / Docker / self-hosted Node.js):
 *     npm install puppeteer
 *
 *   Vercel / Netlify / AWS Lambda (Chromium too large for standard serverless):
 *     npm install puppeteer-core @sparticuz/chromium
 *     Then swap the SERVERLESS block below (clearly marked).
 *
 * ── NUMERALS ──────────────────────────────────────────────────────────────────
 *   All numbers are English (Latin) digits.
 *   Month names are Arabic.
 *   This matches the app's standard: Arabic app, English numerals.
 *
 * ── FONTS ─────────────────────────────────────────────────────────────────────
 *   Noto Kufi Arabic — full Arabic glyph coverage, clean, modern
 *   IBM Plex Mono    — tabular monospace for prayer time digits
 *   Both loaded from Google Fonts. Puppeteer waits for networkidle0.
 *
 * ── BRAND CONSTANTS ───────────────────────────────────────────────────────────
 *   All colours are derived from new.css light-theme tokens.
 *   Light theme is used because PDF is always on white paper.
 *   Update BRAND.* if design system changes — one place, no hunting.
 *
 * ── FUTURE CUSTOMISATION SLOTS ───────────────────────────────────────────────
 *   Logo:    set LOGO_URL to an absolute URL
 *   Footer:  edit the FOOTER CUSTOM SLOT comment
 *   Multi-page: remove `page-break-inside: avoid` on .pdf-table
 */

import { NextResponse } from 'next/server';

// ─── Brand constants (from new.css light theme tokens) ────────────────────────
const BRAND = {
  // --accent (light)       = #1D4ED8
  primary:        '#1D4ED8',
  // --accent-active (light) = #1E3A8A
  primaryDark:    '#1E3A8A',
  // --accent-soft (light)   = rgba(29,78,216,0.08)
  primarySoft:    'rgba(29,78,216,0.08)',
  // --border-accent (light) = rgba(29,78,216,0.28)
  primaryBorder:  'rgba(29,78,216,0.28)',

  // --text-primary (light)   = #0E1220
  textPrimary:    '#0E1220',
  // --text-secondary (light) = #3D4668
  textSecondary:  '#3D4668',
  // --text-muted (light)     = #536080
  textMuted:      '#536080',

  // Row backgrounds
  rowOdd:    '#FFFFFF',
  // --bg-surface-1 (light) ≈ white; use a very light grey for even rows
  rowEven:   '#F5F7FA',
  // --success-soft (light) = rgba(4,102,69,0.08) → approximated
  rowFriday: '#F0FFF8',
  // --success (light)      = #046645
  fridayText: '#046645',

  // Table header background
  headerBg:   '#1E3A8A',
  // --border-subtle (light) = #B8CAE4
  borderLight: '#D1D9E6',
};

// ─── Branding ─────────────────────────────────────────────────────────────────
const SITE_NAME = 'waqt.app';
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://waqt.app';
const LOGO_URL  = null; // Set to absolute URL e.g. `${SITE_URL}/logo.png`

// ─── Puppeteer launch ─────────────────────────────────────────────────────────
// ── SERVERLESS SWAP (Vercel / Netlify / Lambda): uncomment this block ──────────
// import chromium  from '@sparticuz/chromium';
// import puppeteer from 'puppeteer-core';
// async function launchBrowser() {
//   return puppeteer.launch({
//     args:            chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath:  await chromium.executablePath(),
//     headless:        chromium.headless,
//   });
// }
// ─── STANDARD (local / Docker / self-hosted): ────────────────────────────────
import puppeteer from 'puppeteer';
async function launchBrowser() {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',  // prevents /dev/shm overflow in Docker
    ],
  });
}

// ─── Prayer labels ────────────────────────────────────────────────────────────
const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_AR   = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr:  'العصر', maghrib: 'المغرب', isha:  'العشاء',
};

// ─── HTML template ────────────────────────────────────────────────────────────
/**
 * Generates a fully self-contained HTML page for Puppeteer to render.
 * No React, no Tailwind, no external CSS files — just inline styles.
 *
 * NUMERAL GUARANTEE:
 * All numbers in the template are passed from the schedule object which was
 * produced using:
 *   - `date.getDate()`       → JS integer (English digit)
 *   - `getHijriParts(date)`  → nu-latn Intl (English digits)
 *   - `getTimeFmt(tz).format()` → 'en' locale (English digits)
 * No additional numeral conversion needed here.
 */
function generateHtml({ schedule, cityNameAr, gregorianLabel, hijriLabel }) {
  const rows = schedule.map((row, idx) => {
    const isEven   = idx % 2 === 0;
    const isFriday = row.isFriday;

    const bg      = isFriday ? BRAND.rowFriday : isEven ? BRAND.rowOdd : BRAND.rowEven;
    const textCol = isFriday ? BRAND.fridayText : BRAND.textPrimary;
    const timeCol = isFriday ? BRAND.fridayText : BRAND.primary;
    const fw      = isFriday ? '700' : '500';

    const hijriPillHtml = row.isNewHijriMonth
      ? `<span style="
            display:inline-block; font-size:5.5pt; font-weight:700;
            color:${isFriday ? BRAND.fridayText : BRAND.primary};
            background:${isFriday ? 'rgba(4,102,69,0.08)' : BRAND.primarySoft};
            border:0.5pt solid ${isFriday ? 'rgba(4,102,69,0.25)' : BRAND.primaryBorder};
            border-radius:999pt; padding:0.5pt 4pt;
            margin-top:1pt; white-space:nowrap; line-height:1.4;">
            ${row.hijriMonthName}
          </span>`
      : '';

    return `
      <tr style="background:${bg}; border-bottom:0.5pt solid ${BRAND.borderLight};">
        <td class="cell" style="color:${textCol}; font-weight:${fw}; font-size:7pt;">
          ${row.dayName}
        </td>
        <td class="cell">
          <span style="display:block; font-weight:600; color:${textCol};">
            ${row.hijriDay}
          </span>
          ${hijriPillHtml}
        </td>
        <td class="cell" style="color:${textCol}; font-weight:700;">
          ${row.dayNumber}
        </td>
        ${PRAYER_KEYS.map(k => `
          <td class="cell cell-time"
              style="color:${timeCol}; font-weight:${isFriday ? '700' : '600'};"
              dir="ltr">
            ${row[k]}
          </td>
        `).join('')}
      </tr>`;
  }).join('');

  const logoHtml = LOGO_URL
    ? `<img src="${LOGO_URL}" alt="${SITE_NAME}"
           style="height:26pt; width:auto; object-fit:contain;" />`
    : `<div style="font-size:13pt; font-weight:800; color:${BRAND.primary};">
         ${SITE_NAME}
       </div>`;

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>تقويم مواقيت الصلاة — ${cityNameAr} — ${gregorianLabel}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap"
        rel="stylesheet" />
  <style>
    @page {
      size: A4 landscape;
      margin: 0.9cm 1cm;
      /* ── RUNNING HEADER/FOOTER SLOT ──────────────────────────────────
         Uncomment for multi-page tables:
         @top-center    { content: "تقويم مواقيت الصلاة — ${SITE_NAME}";
                         font-family: 'Noto Kufi Arabic', sans-serif;
                         font-size: 7pt; color: #888; }
         @bottom-center { content: "صفحة " counter(page);
                         font-size: 6pt; color: #aaa; }
      ─────────────────────────────────────────────────────────────────── */
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      font-size: 8pt;
      color: ${BRAND.textPrimary};
      background: white;
      direction: rtl;
      /* Required so coloured rows actually print */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Document header ──────────────────────────────────────────────── */
    .pdf-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 10pt;
      padding-bottom: 6pt;
      margin-bottom: 5pt;
      border-bottom: 2pt solid ${BRAND.primary};
    }
    .pdf-header-right { display: flex; flex-direction: column; gap: 2px; }

    /* Title: Tier-2 keyword "تقويم مواقيت الصلاة" */
    .pdf-title {
      font-size: 11pt; font-weight: 800;
      color: ${BRAND.textPrimary}; line-height: 1.25;
    }
    .pdf-title-accent { color: ${BRAND.primary}; }

    /* Sub-title: Tier-3 "جدول أوقات الصلاة الشهري" */
    .pdf-subtitle { font-size: 7.5pt; color: ${BRAND.textSecondary}; margin-top: 2px; }

    /* Badge row */
    .pdf-badges { display: flex; gap: 5pt; margin-top: 3px; flex-wrap: wrap; align-items: center; }
    .badge {
      display: inline-flex; align-items: center;
      font-size: 6.5pt; font-weight: 600;
      border-radius: 999pt; padding: 1.5pt 6pt;
      white-space: nowrap; line-height: 1.4;
    }
    .badge-primary {
      color: ${BRAND.primary};
      background: ${BRAND.primarySoft};
      border: 0.5pt solid ${BRAND.primaryBorder};
    }
    .badge-neutral {
      color: ${BRAND.textSecondary};
      background: #F3F4F6;
      border: 0.5pt solid #D1D5DB;
    }

    /* ── Table ────────────────────────────────────────────────────────── */
    .pdf-table {
      width: 100%; border-collapse: collapse;
      table-layout: fixed;
      /* Single page — remove page-break-inside:avoid for multi-page */
      page-break-inside: avoid;
    }

    /* Column widths — tuned for A4 landscape ~277mm usable width */
    .col-day    { width: 13%; }
    .col-hijri  { width: 12%; }
    .col-greg   { width:  5%; }
    .col-prayer { width: calc(70% / 6); }

    thead tr { background: ${BRAND.headerBg}; }
    thead th {
      font-size: 7.5pt; font-weight: 700;
      color: white; text-align: center;
      padding: 4pt 2pt;
      border: 0.5pt solid rgba(255,255,255,0.15);
      white-space: nowrap;
    }
    thead th.th-prayer { color: #BFDBFE; } /* --raw-blue-300 */

    .cell {
      text-align: center; vertical-align: middle;
      font-size: 7.5pt; padding: 3pt 2pt;
      color: ${BRAND.textPrimary};
    }
    .cell-time {
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      font-variant-numeric: tabular-nums;
      font-size: 7.5pt;
      letter-spacing: 0.02em;
    }

    /* ── Footer ───────────────────────────────────────────────────────── */
    .pdf-footer {
      margin-top: 5pt; padding-top: 4pt;
      border-top: 0.5pt solid ${BRAND.borderLight};
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8pt;
    }
    .pdf-footer-text { font-size: 6pt; color: ${BRAND.textMuted}; }
    .pdf-footer-url  { font-size: 6pt; color: ${BRAND.primary}; font-weight: 600; }
    /* ── FOOTER CUSTOM SLOT ─────────────────────────────────────────────
       Add a QR code image, disclaimer, or social handle here:
       <span class="pdf-footer-custom">@waqt_app</span>
    ──────────────────────────────────────────────────────────────────── */
    .pdf-footer-custom { font-size: 6pt; color: #9CA3AF; }
  </style>
</head>
<body>

  <!-- ═══ HEADER ══════════════════════════════════════════════════════ -->
  <header class="pdf-header">
    <div class="pdf-header-right">
      <h1 class="pdf-title">
        تقويم مواقيت الصلاة
        <span class="pdf-title-accent"> — ${cityNameAr}</span>
      </h1>
      <p class="pdf-subtitle">
        جدول أوقات الصلاة الشهري · الفجر · الظهر · العصر · المغرب · العشاء
      </p>
      <div class="pdf-badges">
        <span class="badge badge-primary">📅 ${gregorianLabel}</span>
        ${hijriLabel
          ? `<span class="badge badge-neutral">🌙 ${hijriLabel}</span>`
          : ''}
        <span class="badge badge-neutral">هجري · ميلادي</span>
      </div>
    </div>
    <!-- LOGO SLOT ↓ replace with <img> when ready -->
    ${logoHtml}
  </header>

  <!-- ═══ TABLE ════════════════════════════════════════════════════════ -->
  <table class="pdf-table"
    aria-label="جدول مواقيت الصلاة الشهري — ${cityNameAr} — ${gregorianLabel}">
    <colgroup>
      <col class="col-day" />
      <col class="col-hijri" />
      <col class="col-greg" />
      ${PRAYER_KEYS.map(() => `<col class="col-prayer" />`).join('\n      ')}
    </colgroup>
    <thead>
      <tr>
        <th>اليوم</th>
        <th>الهجري</th>
        <th>الميلادي</th>
        ${PRAYER_KEYS.map(k => `<th class="th-prayer">${PRAYER_AR[k]}</th>`).join('\n        ')}
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- ═══ FOOTER ═══════════════════════════════════════════════════════ -->
  <footer class="pdf-footer">
    <span class="pdf-footer-text">
      جدول مواقيت الصلاة الشهري لـ ${cityNameAr} — حسابات فلكية دقيقة وفق المعايير المعتمدة دولياً ومحلياً
    </span>
    <span class="pdf-footer-url">${SITE_URL}</span>
    <!-- FOOTER CUSTOM SLOT ↓ -->
    <span class="pdf-footer-custom"></span>
  </footer>

</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  let browser;
  try {
    const body = await request.json();
    const { schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode } = body;

    if (!Array.isArray(schedule) || !schedule.length) {
      return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 400 });
    }

    const html = generateHtml({ schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode });

    browser = await launchBrowser();
    const page = await browser.newPage();

    // networkidle0 ensures Arabic + Mono fonts load before PDF generation
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      format:           'A4',
      landscape:         true,
      printBackground:   true,   // required for coloured rows
      preferCSSPageSize: true,   // honours @page { size: A4 landscape; margin }
    });

    await browser.close();
    browser = null;

    // Safe ASCII filename — Arabic chars break Content-Disposition in some clients
    const safeCity  = (cityNameAr || 'city').replace(/\s+/g, '-');
    const safeMonth = (gregorianLabel || 'calendar').replace(/\s+/g, '-');
    const filename  = `taqwim-salat-${safeCity}-${safeMonth}.pdf`;

    return new Response(pdfBuffer, {
      status:  200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control':       'no-store',
      },
    });

  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('[pdf-calendar]', err);
    return NextResponse.json(
      { error: 'فشل إنشاء ملف تقويم الصلاة. يرجى المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}