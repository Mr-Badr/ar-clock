/**
 * app/api/pdf-calendar/route.js
 */

import { NextResponse } from 'next/server';
import { getSiteUrl } from '@/lib/site-config';

// ─── Light palette ────────────────────────────────────────────────────────────
const BL = {
  pageBg:        '#FFFFFF',
  primary:       '#1D4ED8',
  primarySoft:   'rgba(29,78,216,0.07)',
  primaryBorder: 'rgba(29,78,216,0.22)',
  text:          '#0E1220',
  textSub:       '#3D4668',
  textMuted:     '#536080',
  rowAll:        '#FFFFFF',
  rowFriday:     'rgba(4,102,69,0.06)',    // bg only, no border
  fridayText:    '#046645',
  fridayTime:    '#046645',
  theadBg:       '#1E3A8A',
  theadText:     '#FFFFFF',
  theadAccent:   '#BFDBFE',
  borderRow:     '#E8EEF8',               // subtle row separator only
  footerText:    '#7A88A8',
  logoBg:        'rgba(29,78,216,0.06)',
  logoBorder:    'rgba(29,78,216,0.20)',
};

// ─── Dark palette ─────────────────────────────────────────────────────────────
const BD = {
  pageBg:        '#0D1117',
  primary:       '#8CAEFF',
  primarySoft:   'rgba(140,174,255,0.12)',
  primaryBorder: 'rgba(140,174,255,0.25)',
  text:          '#F0F4FF',
  textSub:       '#A8B2CB',
  textMuted:     '#90AACC',
  rowAll:        '#161D2E',
  rowFriday:     'rgba(6,214,160,0.10)',   // bg only, no border
  fridayText:    '#06D6A0',
  fridayTime:    '#06D6A0',
  theadBg:       '#060B14',
  theadText:     '#E2E8F7',
  theadAccent:   '#8CAEFF',
  borderRow:     '#222C45',
  footerText:    '#6B7FA0',
  logoBg:        'rgba(140,174,255,0.10)',
  logoBorder:    'rgba(140,174,255,0.25)',
};

// ─── Branding ─────────────────────────────────────────────────────────────────
const SITE_NAME = 'MiqaTime';
const SITE_URL  = getSiteUrl();

// ─── Prayer config ────────────────────────────────────────────────────────────
const PRAYER_KEYS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_AR   = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr:  'العصر', maghrib: 'المغرب', isha:  'العشاء',
};

// ─── Puppeteer launch ─────────────────────────────────────────────────────────
async function launchBrowser() {
  const preferServerlessChromium =
    process.env.PDF_BROWSER_MODE === 'serverless' ||
    process.env.VERCEL === '1' ||
    process.env.AWS_REGION;

  if (preferServerlessChromium) {
    try {
      const [{ default: chromium }, puppeteerCoreModule] = await Promise.all([
        import('@sparticuz/chromium'),
        import('puppeteer-core'),
      ]);
      const puppeteerCore = puppeteerCoreModule.default || puppeteerCoreModule;
      return puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } catch (error) {
      console.warn('[pdf-calendar] Falling back to bundled puppeteer:', error);
    }
  }

  const puppeteerModule = await import('puppeteer');
  const puppeteer = puppeteerModule.default || puppeteerModule;
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

// ─── HTML template ────────────────────────────────────────────────────────────
function generateHtml({ schedule, cityNameAr, gregorianLabel, hijriLabel, theme }) {
  const B      = theme === 'dark' ? BD : BL;
  const isDark = theme === 'dark';

  // ── Row builder ─────────────────────────────────────────────────────────────
  const rows = schedule.map((row) => {
    const isFri   = row.isFriday;
    const bg      = isFri ? B.rowFriday : B.rowAll;
    const col     = isFri ? B.fridayText : B.text;
    const timeCol = isFri ? B.fridayTime : B.primary;
    const fw      = isFri ? '700' : '500';

    // Hijri month pill
    const pill = row.isNewHijriMonth
      ? `<span style="
            display:inline-flex;align-items:center;margin-inline-start:2px;
            font-size:5.5px;font-weight:700;
            color:${isFri ? B.fridayText : B.primary};
            background:${isFri ? (isDark ? 'rgba(6,214,160,0.12)' : 'rgba(4,102,69,0.06)') : B.primarySoft};
            border:0.5px solid ${isFri ? (isDark ? 'rgba(6,214,160,0.30)' : 'rgba(4,102,69,0.25)') : B.primaryBorder};
            border-radius:999px;padding:0 4px;line-height:16px;
            white-space:nowrap;vertical-align:middle;">
            ${row.hijriMonthName}
          </span>`
      : '';

    // Friday: background colour ONLY — no box-shadow border
    return `
      <tr style="background:${bg};border-bottom:0.5px solid ${B.borderRow};height:29px;max-height:29px;overflow:hidden;">
        <td class="cell cell-day"   style="color:${col};font-weight:${fw};">${row.dayName}</td>
        <td class="cell cell-hijri" style="color:${col};">
          <span style="font-weight:600;">${row.hijriDay}</span>${pill}
        </td>
        <td class="cell cell-greg"  style="color:${B.textSub};">${row.dayNumber}</td>
        ${PRAYER_KEYS.map((k) => `
        <td class="cell cell-time" dir="ltr" style="color:${timeCol};font-weight:${isFri ? 700 : 500};">
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
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

    /* ── A4 portrait canvas, locked ────────────────────────────────────── */
    @page{size:A4 portrait;margin:0;}
    html{width:794px;height:1122px;overflow:hidden;
      -webkit-print-color-adjust:exact !important;
      print-color-adjust:exact !important;color-adjust:exact !important;}
    body{
      width:794px;height:1122px;overflow:hidden;
      font-family:'Noto Kufi Arabic',system-ui,sans-serif;
      color:${B.text};background:${B.pageBg};direction:rtl;
      display:flex;flex-direction:column;padding:38px 57px;
    }

    /* ── Header — NO border-bottom ────────────────────────────────────── */
    .pdf-header{
      flex-shrink:0;height:70px;
      display:flex;align-items:flex-end;justify-content:space-between;
      gap:16px;
      padding-bottom:10px;
      margin-bottom:8px;
      /* ✦ border-bottom intentionally removed — clean look */
    }
    .pdf-header-left{display:flex;flex-direction:column;gap:3px;}
    .pdf-title{font-size:16px;font-weight:800;color:${B.text};line-height:1.25;white-space:nowrap;}
    .pdf-title-accent{color:${B.primary};}
    .pdf-subtitle{font-size:8px;color:${B.textSub};white-space:nowrap;}
    .pdf-badges{display:flex;gap:5px;align-items:center;margin-top:3px;}
    .badge{
      display:inline-flex;align-items:center;
      font-size:6.5px;font-weight:700;border-radius:999px;
      padding:2px 7px;white-space:nowrap;line-height:1.4;
    }
    .badge-primary{color:${B.primary};background:${B.primarySoft};border:.5px solid ${B.primaryBorder};}
    .badge-neutral{
      color:${B.textSub};
      background:${isDark ? 'rgba(255,255,255,0.05)' : '#F0F4FA'};
      border:.5px solid ${isDark ? 'rgba(255,255,255,0.10)' : '#C8D4E8'};
    }

    /* ── Logo block — VERTICAL: placeholder on top, name below ─────────
       Container is right-aligned in the header.
       Logo box is a fixed square with placeholder/image inside.
       Brand name sits below, centred.
    ────────────────────────────────────────────────────────────────────── */
    .pdf-header-right{display:flex;align-items:flex-end;flex-shrink:0;}
    .pdf-logo-wrap{
      display:flex;flex-direction:column;align-items:center;gap:5px;
      background:${B.logoBg};border:1px solid ${B.logoBorder};
      border-radius:10px;padding:8px 14px 7px;
    }
    /*
     * ── LOGO PLACEHOLDER ───────────────────────────────────────────────
     * Replace .pdf-logo-img below with your actual logo <img> element:
     *
     *   <img src="data:image/svg+xml;base64,YOUR_BASE64_HERE"
     *        class="pdf-logo-img" width="32" height="32" alt="" />
     *
     * Or embed your SVG inline inside .pdf-logo-wrap before .pdf-logo-text.
     * The container (.pdf-logo-wrap) is already positioned correctly —
     * just swap the placeholder span with your <img> or inline <svg>.
     * ────────────────────────────────────────────────────────────────── */
    .pdf-logo-img{
      width:32px;height:32px;
      display:block;flex-shrink:0;
      background:${B.primarySoft};
      border:1.5px dashed ${B.primaryBorder};
      border-radius:6px;
    }
    .pdf-logo-text{
      font-size:10px;font-weight:800;
      color:${B.primary};white-space:nowrap;
      letter-spacing:0.02em;
    }

    /* ── Table wrapper ──────────────────────────────────────────────────── */
    .pdf-table-wrap{flex:1;overflow:hidden;display:flex;flex-direction:column;}

    /* ── Table ──────────────────────────────────────────────────────────── */
    .pdf-table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed;}
    .col-day   {width:22%;}
    .col-hijri {width:11%;}
    .col-greg  {width:8%;}
    .col-prayer{width:calc(59% / 6);}

    /* ── Thead — NO cell borders ─────────────────────────────────────────
       border removed from th — clean header with no internal grid lines
    ────────────────────────────────────────────────────────────────────── */
    .pdf-table thead{background:${B.theadBg};}
    .pdf-table thead tr{height:24px;}
    .pdf-table thead th{
      text-align:center;vertical-align:middle;
      font-size:7px;font-weight:700;color:${B.theadText};
      /* ✦ border removed — no vertical grid lines in thead */
      padding:0 2px;white-space:nowrap;overflow:hidden;
    }
    .th-day{text-align:right;padding-right:8px;}

    /* ── Tbody rows (29px) ───────────────────────────────────────────────
       Only a subtle bottom border between rows — no side borders
    ────────────────────────────────────────────────────────────────────── */
    .pdf-table tbody tr{
      height:29px;max-height:29px;
      border-bottom:.5px solid ${B.borderRow};
      page-break-inside:avoid;break-inside:avoid;
    }
    .pdf-table tbody tr:last-child{border-bottom:none;}

    /* ── Cells ──────────────────────────────────────────────────────────── */
    .cell{text-align:center;vertical-align:middle;font-size:7.5px;padding:0 2px;height:29px;max-height:29px;overflow:hidden;color:${B.text};}
    .cell-day{text-align:right;padding-right:8px;font-size:7.5px;font-weight:600;white-space:nowrap;}
    .cell-hijri{font-size:7px;text-align:center;white-space:nowrap;overflow:hidden;}
    .cell-greg{font-size:7px;color:${B.textSub};font-weight:600;direction:ltr;}
    .cell-time{
      font-family:'IBM Plex Mono','Courier New',monospace;
      font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;
      font-size:7.5px;font-weight:500;direction:ltr;letter-spacing:0;
    }

    /* ── Footer — NO border-top ──────────────────────────────────────────
       ✦ border-top intentionally removed — no line above footer
    ────────────────────────────────────────────────────────────────────── */
    .pdf-footer{
      flex-shrink:0;height:20px;
      display:flex;align-items:center;justify-content:space-between;
      gap:12px;padding-top:4px;margin-top:6px;
      /* border-top intentionally removed */
    }
    .pdf-footer-text{font-size:5.5px;color:${B.footerText};white-space:nowrap;}
    .pdf-footer-url{font-size:7px;color:${B.primary};font-weight:700;white-space:nowrap;}
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
      </div>
    </div>

    <div class="pdf-header-right">
      <!--
        LOGO BLOCK — vertical layout: image on top, "MiqaTime" below
        ─────────────────────────────────────────────────────────────
        To add your real logo, replace the <span class="pdf-logo-img">
        element below with your <img> element, e.g.:

          <img src="data:image/svg+xml;base64,YOUR_BASE64"
               class="pdf-logo-img" alt="" />

        The .pdf-logo-wrap container handles spacing and alignment.
        ─────────────────────────────────────────────────────────────
      -->
      <div class="pdf-logo-wrap">
        <span class="pdf-logo-img"></span>
        <span class="pdf-logo-text">${SITE_NAME}</span>
      </div>
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

      <!-- ✦ thead: text labels ONLY — no emoji icons -->
      <thead>
        <tr>
          <th class="th-day">اليوم</th>
          <th>الهجري</th>
          <th>الميلادي</th>
          ${PRAYER_KEYS.map((k) => `<th>${PRAYER_AR[k]}</th>`).join('')}
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

    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    const html = generateHtml({ schedule, cityNameAr, gregorianLabel, hijriLabel, countryCode, theme: safeTheme });

    browser = await launchBrowser();
    const page = await browser.newPage();

    // A4 portrait: 210mm × 297mm at 96dpi = 794 × 1122px
    await page.setViewport({ width: 794, height: 1122, deviceScaleFactor: 2 });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMediaType('print');

    const pdfBuffer = await page.pdf({
      width:            '210mm',
      height:           '297mm',
      printBackground:   true,
      preferCSSPageSize: false,
    });

    await browser.close();
    browser = null;

    const safeCity  = (cityNameAr    || 'city').replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '');
    const safeMonth = (gregorianLabel || 'calendar').replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const filename  = `taqwim-salat-${safeCity}-${safeMonth}-${safeTheme}.pdf`;

    return new Response(pdfBuffer, {
      status: 200,
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
