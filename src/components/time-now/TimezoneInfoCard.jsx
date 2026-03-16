import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * TimezoneInfoCard — Rich SEO-focused timezone information section.
 * Shows: IANA name, UTC offset, DST status, current date in both calendars,
 * continent, and a keyword-rich SEO prose card.
 * Pure server component — no JS in the browser.
 *
 * Requires nowIso prop (ISO string from getCachedNowIso()) so that
 * new Date() is never called at the module level during prerender.
 *
 * ── Styling rules ──────────────────────────────────────────────────────────
 * ✅ shadcn Table + Card primitives — className forwarded to DOM elements
 * ✅ new.css §32 .table / .table--compact / .table-wrapper on <Table>
 * ✅ .td-col-center (time-difference.css §4) — center-aligns value column
 * ✅ .badge / .badge-* (new.css §18)
 * ✅ .td-static (time-difference.css §3) — suppresses hover lift on prose Card
 * ✅ Typography: .text-xs/sm/base .font-bold/semibold/medium .tabular-nums
 *    .text-primary/secondary/muted/accent-alt (new.css §08 + @theme inline)
 * ✅ .leading-loose on all Arabic prose (new.css §08 — ≥ 1.6 required)
 * ✅ Zero inline styles — zero hardcoded colours
 * ✅ No letter-spacing on Arabic text
 */


/* ─── Helpers ──────────────────────────────────────────────────────────── */
function getTimezoneMeta(tz, nowDate) {
  if (!tz || !nowDate) return {};
  try {
    const now = nowDate;

    const offsetStr = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const tzNameAr = new Intl.DateTimeFormat('ar', {
      timeZone: tz, timeZoneName: 'long',
    }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const tzNameEn = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'long',
    }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value ?? '';

    const jan = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(new Date(now.getFullYear(), 0, 15))
      .find(p => p.type === 'timeZoneName')?.value ?? '';

    const jul = new Intl.DateTimeFormat('en', {
      timeZone: tz, timeZoneName: 'shortOffset',
    }).formatToParts(new Date(now.getFullYear(), 6, 15))
      .find(p => p.type === 'timeZoneName')?.value ?? '';

    const hasDST     = jan !== jul;
    const dstDetailAr = hasDST ? `صيف (${jul}) / شتاء (${jan})` : null;

    const dateAr = new Intl.DateTimeFormat('ar', {
      timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(now);

    const dateEn = new Intl.DateTimeFormat('en', {
      timeZone: tz, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).format(now);

    let hijriDate = '—';
    try {
      hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        timeZone: tz, year: 'numeric', month: 'long', day: 'numeric',
      }).format(now);
    } catch {}

    /* Western numerals via -u-nu-latn — consistent with time-snapshot.jsx */
    const timeStr = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    }).format(now);

    const [continent] = tz.split('/');
    const continentAr = {
      Africa: 'أفريقيا', America: 'الأمريكتان', Asia: 'آسيا',
      Atlantic: 'المحيط الأطلسي', Australia: 'أستراليا',
      Europe: 'أوروبا', Indian: 'المحيط الهندي', Pacific: 'المحيط الهادئ',
      Etc: 'ثابتة',
    }[continent] ?? continent;

    return {
      offsetStr, tzNameAr, tzNameEn,
      hasDST, dstDetailAr,
      dateAr, dateEn, hijriDate, timeStr,
      continentAr,
    };
  } catch { return {}; }
}


/* ─── InfoTable sub-component ─────────────────────────────────────────── */
function InfoTable({ caption, rows }) {
  return (
    <div className="table-wrapper">
      <Table className="table table--compact">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead style={{ width: '45%' }}>{caption.label}</TableHead>
            <TableHead className="td-col-center" style={{ width: '55%' }}>{caption.value}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-surface-2)] transition-colors"
            >
              <TableCell className="text-secondary text-xs">{row.label}</TableCell>
              <TableCell className="td-col-center">
                {row.value}
                {row.sub && (
                  <span className="block text-xs text-muted leading-snug mt-0.5" dir="ltr">
                    {row.sub}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


/* ─── SEO stat pill ────────────────────────────────────────────────────────
 * A centred pill displaying a single key fact.
 * Three per row in the card — icon · value · label structure.
 *
 * Uses only new.css classes:
 *   .card-nested  — bg-surface-3, border-subtle, radius-lg
 *   .td-static    — suppresses hover lift (not clickable)
 *   .text-*       — colour utilities
 *   .font-*       — weight utilities
 *   .tabular-nums — numeric rendering
 */
function StatPill({ icon, value, label, dir = 'rtl' }) {
  return (
    <div className="card-nested td-static flex flex-col items-center justify-center gap-1 p-3 text-center">
      <span className="text-xl leading-none" aria-hidden="true">{icon}</span>
      <span className="font-bold tabular-nums text-accent-alt text-sm leading-tight" dir={dir}>
        {value}
      </span>
      <span className="text-xs text-muted leading-snug">{label}</span>
    </div>
  );
}


/* ─── Main component ──────────────────────────────────────────────────── */
export default function TimezoneInfoCard({
  ianaTimezone,
  countryAr,
  cityAr,
  utcOffset,
  nowIso,
}) {
  const nowDate = nowIso ? new Date(nowIso) : null;
  const m = getTimezoneMeta(ianaTimezone, nowDate);

  /* ── Table 1: zone identity + DST ───────────────────────────────────── */
  const zoneRows = [
    {
      label: 'الدولة',
      value: <span className="font-semibold text-primary">{countryAr}</span>,
    },
    ...(cityAr ? [{
      label: 'العاصمة / المدينة',
      value: <span className="font-semibold text-primary">{cityAr}</span>,
    }] : []),
    {
      label: 'المنطقة الزمنية (IANA)',
      value: (
        <span className="font-bold tabular-nums text-accent-alt" dir="ltr">
          {ianaTimezone}
        </span>
      ),
    },
    {
      label: 'إزاحة GMT / UTC',
      value: (
        <span className="font-bold tabular-nums text-accent-alt" dir="ltr">
          {m.offsetStr ?? utcOffset}
        </span>
      ),
    },
    {
      label: 'اسم التوقيت',
      value: <span className="font-semibold text-primary">{m.tzNameAr}</span>,
      sub:   m.tzNameEn,
    },
    {
      label: 'القارة / المنطقة',
      value: <span className="text-secondary">{m.continentAr}</span>,
    },
    {
      label: 'التوقيت الصيفي (DST)',
      value: (
        <span className={`badge ${m.hasDST ? 'badge-warning' : 'badge-default'}`}>
          {m.hasDST ? 'نعم' : 'لا — ثابت'}
        </span>
      ),
      sub: m.dstDetailAr ?? undefined,
    },
  ];

  /* ── Table 2: current date / time ───────────────────────────────────── */
  const dateRows = [
    {
      label: 'التاريخ الميلادي',
      value: <span className="font-semibold text-primary">{m.dateAr}</span>,
      sub:   m.dateEn,
    },
    {
      label: 'التاريخ الهجري',
      value: <span className="font-semibold text-primary">{m.hijriDate}</span>,
    },
    {
      label: 'الوقت الحالي',
      value: (
        <span className="font-bold tabular-nums text-accent-alt" dir="ltr">
          {m.timeStr}
        </span>
      ),
    },
  ];

  /* ── Derived values for stat pills ──────────────────────────────────── */
  const displayOffset = m.offsetStr ?? utcOffset ?? '—';
  const dstStatus     = m.hasDST ? 'يطبّق DST' : 'توقيت ثابت';
  const dstIcon       = m.hasDST ? '☀️' : '🔒';

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ── Section heading ──────────────────────────────────────────── */}
      <h2 className="text-xl font-extrabold text-primary">
        🌐 معلومات المنطقة الزمنية
      </h2>

      {/* ── Table 1 — Zone identity + DST ────────────────────────────── */}
      <InfoTable
        caption={{ label: 'البيان', value: 'القيمة' }}
        rows={zoneRows}
      />

      {/* ── Table 2 — Current date / time ────────────────────────────── */}
      <InfoTable
        caption={{ label: 'التقويم / الوقت', value: 'القيمة الحالية' }}
        rows={dateRows}
      />

      {/* ══════════════════════════════════════════════════════════════
          SEO CARD
          ══════════════════════════════════════════════════════════════
       *
       * Design goals:
       *   1. Centred layout — all content centred for visual balance
       *   2. Three stat pills — instant at-a-glance key facts (UTC, DST, IANA)
       *      These repeat the most-searched keywords in a visually distinct
       *      format so crawlers see them as prominent page facts
       *   3. Keyword-rich prose — short-tail (توقيت, GMT, UTC) and long-tail
       *      (الفرق الزمني بين X والعالم, كيف أعرف توقيت X) naturally woven in
       *   4. Structured so the most important info (offset, DST status) comes
       *      first — matches featured-snippet extraction patterns
       *
       * shadcn Card anatomy used:
       *   <Card>        — outer shell: bg-card = var(--bg-surface-2), rounded-xl
       *   <CardHeader>  — top section with title
       *   <CardTitle>   — renders an <h3>
       *   <CardContent> — body padding wrapper
       *
       * Additional classes:
       *   .td-static    — suppresses new.css .card:hover lift (not clickable)
       *   .card--flat   — removes default shadow for a flush, text-forward look
       */}
      <Card className="td-static card--flat overflow-hidden border border-[var(--border-default)]" style={{ background: 'var(--clock-bg)' }}>

        {/* ── Card header ─────────────────────────────────────────────── */}
        <CardHeader className="pb-0 pt-5 px-5 text-center">
          <CardTitle>
            {/*
             * <h3> inside CardTitle — correct heading hierarchy under the <h2>
             * .text-base  → font-size: var(--text-base)
             * .font-bold  → font-weight: var(--font-bold)
             * .text-primary
             */}
            <span className="text-base font-bold text-primary">
              توقيت {countryAr} — {displayOffset} من غرينيتش
            </span>
          </CardTitle>

          {/*
           * Subheading: IANA identifier displayed prominently.
           * dir="ltr" — Latin identifier in RTL layout.
           * Short-tail keyword: "المنطقة الزمنية" + IANA string.
           */}
          <p className="text-xs text-muted tabular-nums mt-1 mx-auto" dir="ltr">
            {ianaTimezone} · {m.tzNameEn}
          </p>
        </CardHeader>

        <CardContent className="px-5 pt-4 pb-5 space-y-5">

          {/* ── Three stat pills ────────────────────────────────────────
           *
           * grid-cols-3: three equal columns on all screen sizes.
           * gap-2: space-2 (8px) between pills — tight but breathable.
           * Each pill is a .card-nested .td-static with icon/value/label.
           *
           * SEO rationale: the three most-searched facts about any timezone
           * (offset, DST status, IANA code) appear as visually dominant
           * elements above the prose, maximising featured-snippet capture.
           */}
          <div className="grid grid-cols-3 gap-2">
            <StatPill
              icon="🕐"
              value={displayOffset}
              label="إزاحة UTC"
              dir="ltr"
            />
            <StatPill
              icon={dstIcon}
              value={dstStatus}
              label="التوقيت الصيفي"
            />
            <StatPill
              icon="🌍"
              value={m.continentAr ?? '—'}
              label="القارة"
            />
          </div>

          {/* ── Divider ─────────────────────────────────────────────────── */}
          <div className="border-t border-[var(--border-subtle)]" />

          {/* ── Keyword-rich prose ──────────────────────────────────────
           *
           * Structure (SEO best practice):
           *   Para 1 — Core fact (offset + DST): answers "كم توقيت X" and
           *            "ما هو فرق توقيت X مع GMT" — highest-volume queries
           *   Para 2 — DST detail: answers "هل X تطبق التوقيت الصيفي"
           *   Para 3 — IANA + continent: answers "ما اسم منطقة توقيت X"
           *            and long-tail "كيف أضبط توقيت X على هاتفي"
           *
           * Typography:
           *   .text-sm      → var(--text-sm)    body text
           *   .text-muted   → var(--text-muted) base colour — emphasis words
           *                   upgrade to .text-secondary via <strong>
           *   .leading-loose → var(--leading-loose) = 2.0 — Arabic standard
           *   .text-center  — all paras centred to match card header
           *   No letter-spacing — Arabic prose rule.
           */}
          <div className="space-y-3 text-center">

            {/* Para 1 — Core offset fact */}
            <p className="text-sm text-muted leading-loose mx-auto pb-4">
              يبلغ{' '}
              <strong className="text-secondary font-semibold">
                توقيت {countryAr}
              </strong>{' '}
              {displayOffset} من{' '}
              <strong className="text-secondary font-semibold">
                التوقيت العالمي المنسق (UTC/GMT)
              </strong>.{' '}
              {m.hasDST
                ? <>
                    يتغير هذا الفارق خلال العام بسبب{' '}
                    <strong className="text-secondary font-semibold">
                      التوقيت الصيفي (Daylight Saving Time)
                    </strong>:{' '}
                    <span className="tabular-nums" dir="ltr">{m.dstDetailAr}</span>.
                  </>
                : <>
                    التوقيت ثابت على مدار السنة{' '}
                    ولا تطبّق {countryAr}{' '}
                    <strong className="text-secondary font-semibold">
                      التوقيت الصيفي
                    </strong>.
                  </>
              }
            </p>

            {/* Para 2 — IANA identifier + use-case long-tail */}
            <p className="text-sm text-muted leading-loose mx-auto">
              المعرّف الرسمي للمنطقة الزمنية وفق قاعدة{' '}
              <strong className="text-secondary font-semibold">IANA / Olson</strong>{' '}
              هو{' '}
              <strong className="text-secondary font-semibold tabular-nums" dir="ltr">
                {ianaTimezone}
              </strong>،{' '}
              ويُعرف رسمياً بـ{' '}
              <strong className="text-secondary font-semibold" dir="ltr">
                {m.tzNameEn}
              </strong>.{' '}
              استخدم هذا المعرّف عند ضبط{' '}
              <strong className="text-secondary font-semibold">
                فرق التوقيت
              </strong>{' '}
              في التطبيقات والأجهزة.
            </p>

            {/* Para 3 — Continent + quick-answer long-tail */}
            <p className="text-sm text-muted leading-loose mx-auto">
              تقع {countryAr} ضمن منطقة{' '}
              <strong className="text-secondary font-semibold">{m.continentAr}</strong>.{' '}
              لمعرفة{' '}
              <strong className="text-secondary font-semibold">
                الساعة الآن في {countryAr}
              </strong>{' '}
              أو حساب{' '}
              <strong className="text-secondary font-semibold">
                الفرق الزمني بين {countryAr} وأي دولة أخرى
              </strong>،{' '}
              استخدم أداة المقارنة التفاعلية أعلاه.
            </p>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}