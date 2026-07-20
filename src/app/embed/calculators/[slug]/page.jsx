/**
 * app/embed/calculators/[slug]/page.jsx
 *
 * Chrome-free calculator widgets meant to be <iframe>-embedded on other sites
 * (same pattern as /embed/prayer-times). Only a small, deliberately curated
 * allowlist is embeddable — this is NOT every calculator on the site, see
 * `EMBEDDABLE_CALCULATORS` below. Chrome (nav/footer/ads) is hidden globally
 * via the `embed-mode` class (see ClientRuntimeMounts.client.jsx + globals.css).
 * This route is intentionally noindex: it's a widget fragment, not a content
 * page competing with the canonical calculator page.
 *
 * `params` is read inside the Suspense-wrapped child (`CalculatorEmbedContent`),
 * never in the page component directly — reading it at the top level blocks
 * the whole route outside Suspense under cacheComponents (see the site-wide
 * PPR "postponed empty page" lesson, same reasoning as /embed/prayer-times).
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
// The real calculator pages get this via `src/app/calculators/layout.jsx` —
// this embed route lives outside that route tree entirely, so without this
// direct import every calculator renders completely unstyled (broken grids,
// overflowing RTL text) inside the iframe.
import '@/app/calculators/calculators.css';
import AgeCalculator from '@/components/calculators/age/AgeCalculator.client';
import BMICalculator from '@/components/calculators/BMICalculator.client';
import PercentageCalculator from '@/components/calculators/PercentageCalculator.client';
import EndOfServiceCalculator from '@/components/calculators/EndOfServiceCalculator.client';
import MonthlyInstallmentCalculator from '@/components/calculators/MonthlyInstallmentCalculator.client';
import { getSiteUrl } from '@/lib/site-config';

export const metadata = {
  robots: { index: false, follow: false },
};

// Deliberately small, curated v1 set — the highest-traffic, most shareable
// calculators — not every calculator on the site. Add more here as this
// proves out; each entry needs its own `EmbedCodeSnippet` block wired into
// the real calculator page to be discoverable (see calculator page.jsx files).
const EMBEDDABLE_CALCULATORS = {
  age: { Component: AgeCalculator, props: { compact: true }, title: 'حاسبة العمر', fullPageHref: '/calculators/age' },
  bmi: { Component: BMICalculator, title: 'حاسبة مؤشر كتلة الجسم', fullPageHref: '/calculators/bmi' },
  percentage: { Component: PercentageCalculator, title: 'حاسبة النسبة المئوية', fullPageHref: '/calculators/percentage' },
  'end-of-service-benefits': {
    Component: EndOfServiceCalculator,
    title: 'حاسبة مكافأة نهاية الخدمة',
    fullPageHref: '/calculators/end-of-service-benefits',
  },
  'monthly-installment': {
    Component: MonthlyInstallmentCalculator,
    title: 'حاسبة القسط الشهري',
    fullPageHref: '/calculators/monthly-installment',
  },
};

export function generateStaticParams() {
  return Object.keys(EMBEDDABLE_CALCULATORS).map((slug) => ({ slug }));
}

async function CalculatorEmbedContent({ params }) {
  const { slug } = await params;
  const entry = EMBEDDABLE_CALCULATORS[slug];
  if (!entry) notFound();

  const { Component, props, title, fullPageHref } = entry;
  const fullPageUrl = `${getSiteUrl()}${fullPageHref}`;

  return (
    // A real <main> (not a <div>) matters here: calculators.css scopes ~340
    // layout/spacing rules to `main:not(.calc-hub-page) ...` — without a real
    // <main> ancestor those rules never match, and the calculator renders
    // with broken flex/grid sizing (confirmed via screenshot: labels and
    // result rows overflowing at 375px width).
    <main className="embed-calculator-widget" dir="rtl" lang="ar">
      <Component {...(props || {})} />
      <a
        className="embed-calculator-widget__attribution"
        href={fullPageUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title} من ميقاتنا
      </a>
    </main>
  );
}

function CalculatorEmbedFallback() {
  return (
    <main className="embed-calculator-widget" aria-hidden="true">
      <div className="embed-calculator-widget__skeleton" />
    </main>
  );
}

export default function CalculatorEmbedPage({ params }) {
  return (
    <Suspense fallback={<CalculatorEmbedFallback />}>
      <CalculatorEmbedContent params={params} />
    </Suspense>
  );
}
