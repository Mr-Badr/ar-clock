/**
 * app/api/pdf-calendar/route.js — v7
 *
 * ── WHAT CHANGED FROM v6 ─────────────────────────────────────────────────────
 *   ✦ Accepts `theme` in request body ('light' | 'dark') — default: 'light'
 *   ✦ Dark colour palette (BD) built from the same design-system tokens as
 *     the web component (base.css dark theme variables)
 *   ✦ No today-row highlighting in either theme (today is irrelevant on paper)
 *   ✦ Friday rows still highlighted (always semantically meaningful)
 *   ✦ Font pre-loading improved — waits for document.fonts.ready after
 *     networkidle0 to eliminate Arabic/mono glyph substitution artifacts
 *   ✦ Dark theme sets page background to dark so no white bleed on edges
 *   ✦ Footer shows theme indicator in dark mode
 *
 * ── SINGLE-PAGE GUARANTEE ────────────────────────────────────────────────────
 *   Puppeteer viewport = A4 landscape in px (1122 × 794 at 96dpi).
 *   body is locked: width:1122px; height:794px; overflow:hidden.
 *   Row height: floor((794-56-72-24-10-28) / 31) = 19px
 *
 * ── FONTS ─────────────────────────────────────────────────────────────────────
 *   Noto Kufi Arabic  — Arabic text
 *   IBM Plex Mono     — prayer time digits, tabular alignment
 */

import { NextResponse } from 'next/server';

// ─── Light theme (paper/white) ────────────────────────────────────────────────
const BL = {
  pageBg:        '#FFFFFF',

  primary:       '#1D4ED8',
  primaryDark:   '#1E3A8A',
  primaryGrad:   'linear-gradient(135deg,#1D4ED8 0%,#4338CA 100%)',
  primarySoft:   'rgba(29,78,216,0.07)',
  primaryBorder: 'rgba(29,78,216,0.22)',

  text:          '#0E1220',
  textSub:       '#3D4668',
  textMuted:     '#536080',

  rowOdd:        '#FFFFFF',
  rowEven:       '#F4F7FC',
  rowFriday:     'rgba(4,102,69,0.06)',

  fridayBorder:  '#046645',
  fridayText:    '#046645',
  fridayTime:    '#046645',

  theadBg:       '#1E3A8A',
  theadText:     '#FFFFFF',
  theadAccent:   '#BFDBFE',

  borderRow:     '#E0E8F4',
  borderSection: '#C8D4E8',

  footerText:    '#7A88A8',
  logoBg:        'rgba(29,78,216,0.07)',
};

// ─── Dark theme (deep navy) ───────────────────────────────────────────────────
const BD = {
  pageBg:        '#0D1117',

  primary:       '#8CAEFF',   // --accent-alt in dark mode
  primaryDark:   '#B0C8FF',
  primaryGrad:   'linear-gradient(135deg,#3B5ED8 0%,#4338CA 100%)',
  primarySoft:   'rgba(140,174,255,0.12)',
  primaryBorder: 'rgba(140,174,255,0.25)',

  text:          '#F0F4FF',   // --text-primary dark
  textSub:       '#A8B2CB',   // --text-secondary dark
  textMuted:     '#90AACC',   // --text-muted dark

  rowOdd:        '#161D2E',   // --bg-surface-1 dark
  rowEven:       '#1E2640',   // --bg-surface-2 dark
  rowFriday:     'rgba(6,214,160,0.10)',

  fridayBorder:  '#06D6A0',   // --success dark
  fridayText:    '#06D6A0',
  fridayTime:    '#06D6A0',

  theadBg:       '#060B14',   // deeper than bg-base for contrast
  theadText:     '#E2E8F7',
  theadAccent:   '#8CAEFF',

  borderRow:     '#222C45',   // --border-default dark
  borderSection: '#2E3A60',

  footerText:    '#6B7FA0',
  logoBg:        'rgba(140,174,255,0.10)',
};

// ─── App branding ─────────────────────────────────────────────────────────────
const SITE_NAME = 'MiqaTime.com';
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

// ─── Prayer config ────────────────────────────────────────────────────────────
const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_AR   = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr:  'العصر', maghrib: 'المغرب', isha:  'العشاء',
};
const PRAYER_ICON = {
  fajr: '🌙', sunrise: '🌅', dhuhr: '☀️',
  asr:  '🌤', maghrib: '🌇',  isha:  '⭐',
};

// ─── Puppeteer launch ─────────────────────────────────────────────────────────
// ── SERVERLESS (Vercel / Netlify / Lambda) — uncomment to swap: ────────────────
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
// ── STANDARD (local / Docker / self-hosted Node.js): ─────────────────────────
import puppeteer from 'puppeteer';
async function launchBrowser() {
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

// ─── HTML template ────────────────────────────────────────────────────────────
/**
 * Generates a fully self-contained HTML page sized EXACTLY to A4 landscape.
 * Canvas: 1122 × 794px (96dpi). Everything is px-based for deterministic layout.
 *
 * Row height maths:
 *   content h = 794 - 56 (padT+padB)   = 738px
 *   header    = 72px
 *   footer    = 24px
 *   gap       = 10px
 *   thead     = 28px
 *   tbody     = 738 - 72 - 24 - 10 - 28 = 604px
 *   per row   = floor(604 / 31) = 19px
 *
 * NOTE: today-row highlighting intentionally omitted.
 *   A printed sheet has no "current day" — Friday rows remain coloured
 *   because Jumu'ah is always meaningful regardless of date.
 */
function generateHtml({ schedule, cityNameAr, gregorianLabel, hijriLabel, theme }) {
  const B   = theme === 'dark' ? BD : BL;
  const isDark = theme === 'dark';

  // ── Row builder ─────────────────────────────────────────────────────────────
  const rows = schedule.map((row, idx) => {
    const isEven = idx % 2 === 0;
    const isFri  = row.isFriday;

    const bg      = isFri ? B.rowFriday : isEven ? B.rowOdd : B.rowEven;
    const col     = isFri ? B.fridayText : B.text;
    const timeCol = isFri ? B.fridayTime : B.primary;
    const fw      = isFri ? '700' : '500';

    // New hijri month pill
    const pill = row.isNewHijriMonth
      ? `<span style="
            display:inline-flex;align-items:center;
            margin-inline-start:2px;
            font-size:5.5px;font-weight:700;
            color:${isFri ? B.fridayText : B.primary};
            background:${isFri ? (isDark ? 'rgba(6,214,160,0.12)' : 'rgba(4,102,69,0.06)') : B.primarySoft};
            border:0.5px solid ${isFri ? (isDark ? 'rgba(6,214,160,0.30)' : 'rgba(4,102,69,0.25)') : B.primaryBorder};
            border-radius:999px;padding:0 4px;line-height:16px;
            white-space:nowrap;vertical-align:middle;">
            ${row.hijriMonthName}
          </span>`
      : '';

    return `
      <tr style="
          background:${bg};
          border-bottom:0.5px solid ${B.borderRow};
          height:19px; max-height:19px; overflow:hidden;
          ${isFri ? `box-shadow:inset -3px 0 0 ${B.fridayBorder};` : ''}
      ">
        <td class="cell cell-day" style="color:${col};font-weight:${fw};">
          ${row.dayName}
        </td>
        <td class="cell cell-hijri" style="color:${col};">
          <span style="font-weight:600;">${row.hijriDay}</span>${pill}
        </td>
        <td class="cell cell-greg" style="color:${B.textSub};">
          ${row.dayNumber}
        </td>
        ${PRAYER_KEYS.map((k) => `
          <td class="cell cell-time" dir="ltr"
              style="color:${timeCol};font-weight:${isFri ? 700 : 500};">
            ${row[k]}
          </td>`).join('')}
      </tr>`;
  }).join('');

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
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Page canvas: locked to A4 landscape at 96dpi ──────────────────── */
    @page { size: A4 landscape; margin: 0; }

    html {
      width: 1122px; height: 794px;
      overflow: hidden;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      width: 1122px; height: 794px;
      overflow: hidden;
      font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      color: ${B.text};
      background: ${B.pageBg};
      direction: rtl;
      display: flex;
      flex-direction: column;
      padding: 28px 38px;
    }

    /* ── Header (72px total) ────────────────────────────────────────────── */
    .pdf-header {
      flex-shrink: 0;
      height: 72px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 2px solid ${B.primary};
    }
    .pdf-header-left  { display: flex; flex-direction: column; gap: 3px; }

    .pdf-title {
      font-size: 17px;
      font-weight: 800;
      color: ${B.text};
      line-height: 1.25;
      white-space: nowrap;
    }
    .pdf-title-accent { color: ${B.primary}; }

    .pdf-subtitle {
      font-size: 8.5px;
      color: ${B.textSub};
      white-space: nowrap;
    }

    .pdf-badges {
      display: flex;
      gap: 5px;
      align-items: center;
      margin-top: 4px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      font-size: 7px;
      font-weight: 700;
      border-radius: 999px;
      padding: 2px 8px;
      white-space: nowrap;
      line-height: 1.4;
    }
    .badge-primary {
      color: ${B.primary};
      background: ${B.primarySoft};
      border: 0.5px solid ${B.primaryBorder};
    }
    .badge-neutral {
      color: ${B.textSub};
      background: ${isDark ? 'rgba(255,255,255,0.05)' : '#F0F4FA'};
      border: 0.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : '#C8D4E8'};
    }

    .pdf-header-right {
      display: flex;
      align-items: flex-end;
      flex-shrink: 0;
    }
    .pdf-logo {
      font-size: 13px;
      font-weight: 800;
      color: ${B.primary};
      background: ${B.logoBg};
      border: 1px solid ${B.primaryBorder};
      border-radius: 8px;
      padding: 4px 12px;
      white-space: nowrap;
    }

    /* ── Table wrapper (flex:1 fills space between header and footer) ─── */
    .pdf-table-wrap {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ── Table (height:100% → fills wrapper) ────────────────────────────── */
    .pdf-table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    /* Column widths tuned for 1046px usable width */
    .col-day    { width: 13%; }   /* ~136px — اليوم  */
    .col-hijri  { width: 10%; }   /* ~105px — الهجري */
    .col-greg   { width:  5%; }   /*  ~52px — م      */
    .col-prayer { width: calc(72% / 6); } /* ~125px × 6 */

    /* ── Thead (28px row) ───────────────────────────────────────────────── */
    .pdf-table thead { background: ${B.theadBg}; }
    .pdf-table thead tr { height: 28px; }

    .pdf-table thead th {
      text-align: center;
      vertical-align: middle;
      font-size: 7.5px;
      font-weight: 700;
      color: ${B.theadText};
      border: 0.5px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'};
      padding: 0 2px;
      white-space: nowrap;
      overflow: hidden;
    }
    .th-day { text-align: right; padding-right: 8px; }
    .th-prayer { color: ${B.theadAccent}; }

    .th-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      line-height: 1.2;
    }
    .th-icon  { font-size: 9px; }
    .th-label { font-size: 6.5px; font-weight: 700; color: ${B.theadText}; }

    /* ── Tbody rows (19px each) ─────────────────────────────────────────── */
    .pdf-table tbody tr {
      height: 19px;
      max-height: 19px;
      border-bottom: 0.5px solid ${B.borderRow};
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .pdf-table tbody tr:last-child { border-bottom: none; }

    /* ── Cells ──────────────────────────────────────────────────────────── */
    .cell {
      text-align: center;
      vertical-align: middle;
      font-size: 8px;
      padding: 0 2px;
      height: 19px;
      max-height: 19px;
      overflow: hidden;
      color: ${B.text};
    }
    .cell-day {
      text-align: right;
      padding-right: 8px;
      font-size: 8px;
      font-weight: 600;
      white-space: nowrap;
    }
    .cell-hijri {
      font-size: 7.5px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
    }
    .cell-greg {
      font-size: 7.5px;
      color: ${B.textSub};
      font-weight: 600;
      direction: ltr;
    }
    .cell-time {
      font-family: 'IBM Plex Mono', 'Courier New', monospace;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum" 1;
      font-size: 8px;
      font-weight: 500;
      direction: ltr;
      letter-spacing: 0;
    }

    /* ── Footer (24px) ──────────────────────────────────────────────────── */
    .pdf-footer {
      flex-shrink: 0;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 6px;
      margin-top: 4px;
      border-top: 0.5px solid ${B.borderSection};
    }
    .pdf-footer-text { font-size: 5.5px; color: ${B.footerText}; white-space: nowrap; }
    .pdf-footer-url  { font-size: 7px;   color: ${B.primary};    font-weight: 700; white-space: nowrap; }
  </style>
</head>

<body>

  <!-- ═══ HEADER ════════════════════════════════════════════════════════ -->
  <header class="pdf-header">
    <div class="pdf-header-left">
      <h1 class="pdf-title">
        تقويم مواقيت الصلاة
        <span class="pdf-title-accent"> — ${cityNameAr}</span>
      </h1>
      <p class="pdf-subtitle">
        جدول أوقات الصلاة الشهري · الفجر · الشروق · الظهر · العصر · المغرب · العشاء
      </p>
      <div class="pdf-badges">
        <span class="badge badge-primary">📅 ${gregorianLabel}</span>
        ${hijriLabel ? `<span class="badge badge-neutral">🌙 ${hijriLabel}</span>` : ''}
        <span class="badge badge-neutral">${isDark ? '🌑 وضع ليلي' : '☀️ وضع نهاري'}</span>
      </div>
    </div>
    <div class="pdf-header-right">
      <div class="pdf-logo">${SITE_NAME}</div>
    </div>
  </header>

  <!-- ═══ TABLE ═════════════════════════════════════════════════════════ -->
  <div class="pdf-table-wrap">
    <table class="pdf-table"
      aria-label="جدول مواقيت الصلاة الشهري — ${cityNameAr} — ${gregorianLabel}">

      <colgroup>
        <col class="col-day" />
        <col class="col-hijri" />
        <col class="col-greg" />
        ${PRAYER_KEYS.map(() => `<col class="col-prayer" />`).join('\n        ')}
      </colgroup>

      <thead>
        <tr>
          <th class="th-day">اليوم</th>
          <th>الهجري</th>
          <th>الميلادي</th>
          ${PRAYER_KEYS.map((k) => `
          <th class="th-prayer">
            <div class="th-inner">
              <span class="th-icon">${PRAYER_ICON[k]}</span>
              <span class="th-label">${PRAYER_AR[k]}</span>
            </div>
          </th>`).join('')}
        </tr>
      </thead>

      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>

  <!-- ═══ FOOTER ════════════════════════════════════════════════════════ -->
  <footer class="pdf-footer">
    <span class="pdf-footer-text">
      جدول مواقيت الصلاة الشهري لـ ${cityNameAr} — حسابات فلكية دقيقة وفق المعايير المعتمدة دولياً ومحلياً
    </span>
    <span class="pdf-footer-url">${SITE_URL}</span>
  </footer>

</body>
</html>`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  let browser;
  try {
    const body = await request.json();
    const { schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode, theme = 'light' } = body;

    if (!Array.isArray(schedule) || !schedule.length) {
      return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 400 });
    }

    // Validate theme
    const safeTheme = theme === 'dark' ? 'dark' : 'light';

    const html = generateHtml({
      schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode,
      theme: safeTheme,
    });

    browser = await launchBrowser();
    const page = await browser.newPage();

    // A4 landscape in pixels at 96dpi
    // 297mm × (96/25.4) ≈ 1122px  |  210mm × (96/25.4) ≈ 794px
    await page.setViewport({ width: 1122, height: 794, deviceScaleFactor: 2 });

    // networkidle0 waits for fonts to load; then fonts.ready ensures shaping is done
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Extra safety: wait for Arabic shaping + IBM Plex Mono
    await page.evaluate(() => document.fonts.ready);

    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      width:            '297mm',
      height:           '210mm',
      printBackground:   true,   // required for row background colours
      preferCSSPageSize: false,  // explicit dimensions above take precedence
    });

    await browser.close();
    browser = null;

    // Safe ASCII filename
    const safeCity  = (cityNameAr    || 'city').replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const safeMonth = (gregorianLabel || 'calendar').replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const filename  = `taqwim-salat-${safeCity}-${safeMonth}-${safeTheme}.pdf`;

    return new Response(pdfBuffer, {
      status:  200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control':       'no-store',
      },
    });

  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('[pdf-calendar]', err);
    return NextResponse.json(
      { error: 'فشل إنشاء ملف تقويم الصلاة. يرجى المحاولة مرة أخرى.' },
      { status: 500 },
    );
  }
}