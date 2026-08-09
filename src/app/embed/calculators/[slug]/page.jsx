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
// Old-design (calc-esb-*/calc-*) embeddable calculators need this shared stylesheet — it used
// to live at src/app/calculators/calculators.css and load automatically via that route tree's
// own layout.jsx, but that whole tree was retired 2026-08-05 (no /calculators path left at all),
// so the file moved to a neutral shared location and this embed route (which lives outside any
// calculator route tree) needs the direct import to avoid rendering completely unstyled inside
// the iframe (broken grids, overflowing RTL text).
import '@/app/styles/calculators.css';
// v2-redesigned calculators (end-of-service-benefits, uae-end-of-service, ...) use
// .tool-v2-* classes, not the old calc-* system above — without this import, their embedded
// widgets render completely unstyled inside the iframe (found while migrating UAE
// end-of-service, 2026-07-30: the Saudi one had silently regressed the same way when it was
// redesigned to v2 and this file was never updated).
import '@/app/tools/tools-v2.css';
import AgeCalculatorTool from '@/components/calculators/age/AgeCalculatorTool.client';
import BMICalculator from '@/components/calculators/BMICalculator.client';
import EndOfServiceCalculator from '@/components/calculators/EndOfServiceCalculator.client';
import UaeEndOfServiceCalculator from '@/components/calculators/UaeEndOfServiceCalculator.client';
import Article77CompensationCalculator from '@/components/calculators/Article77CompensationCalculator.client';
import TrafficFineDiscountCalculator from '@/components/calculators/TrafficFineDiscountCalculator.client';
import BuildCostCalculator from '@/components/calculators/BuildCostCalculator.client';
import RebarWeightCalculator from '@/components/calculators/RebarWeightCalculator.client';
import SqftSqmConverter from '@/components/calculators/SqftSqmConverter.client';
import CementCalculator from '@/components/calculators/CementCalculator.client';
import TilesCalculator from '@/components/calculators/TilesCalculator.client';
import PaintCalculator from '@/components/calculators/PaintCalculator.client';
import GypsumBoardCalculator from '@/components/calculators/GypsumBoardCalculator.client';
import { getSiteUrl } from '@/lib/site-config';

export const metadata = {
  robots: { index: false, follow: false },
};

// Deliberately small, curated v1 set — the highest-traffic, most shareable
// calculators — not every calculator on the site. Add more here as this
// proves out; each entry needs its own `EmbedCodeSnippet` block wired into
// the real calculator page to be discoverable (see calculator page.jsx files).
const EMBEDDABLE_CALCULATORS = {
  age: { Component: AgeCalculatorTool, props: { compact: true }, title: 'حاسبة العمر', fullPageHref: '/tools/health/age-calculator' },
  bmi: { Component: BMICalculator, title: 'حاسبة مؤشر كتلة الجسم', fullPageHref: '/tools/health/bmi' },
  'end-of-service-benefits': {
    Component: EndOfServiceCalculator,
    title: 'حاسبة مكافأة نهاية الخدمة',
    fullPageHref: '/tools/gulf-finance/end-of-service-benefits',
  },
  'uae-end-of-service': {
    Component: UaeEndOfServiceCalculator,
    title: 'حاسبة مكافأة نهاية الخدمة الإمارات',
    fullPageHref: '/tools/gulf-finance/uae-end-of-service',
  },
  'article-77-compensation': {
    Component: Article77CompensationCalculator,
    title: 'حاسبة تعويض المادة 77',
    fullPageHref: '/tools/gulf-finance/article-77-compensation',
  },
  'traffic-fine-discount': {
    Component: TrafficFineDiscountCalculator,
    title: 'حاسبة خصم المخالفات المرورية',
    fullPageHref: '/tools/gulf-finance/traffic-fine-discount',
  },
  'build-cost': {
    Component: BuildCostCalculator,
    title: 'حاسبة تكلفة البناء',
    fullPageHref: '/tools/construction/build-cost',
  },
  'rebar-weight': {
    Component: RebarWeightCalculator,
    title: 'حاسبة وزن حديد التسليح',
    fullPageHref: '/tools/construction/rebar-weight',
  },
  'sqft-sqm-converter': {
    Component: SqftSqmConverter,
    title: 'محول قدم مربع ومتر مربع',
    fullPageHref: '/tools/construction/sqft-sqm-converter',
  },
  cement: {
    Component: CementCalculator,
    title: 'حاسبة الأسمنت والخرسانة',
    fullPageHref: '/tools/construction/cement',
  },
  tiles: {
    Component: TilesCalculator,
    title: 'حاسبة البلاط والسيراميك',
    fullPageHref: '/tools/construction/tiles',
  },
  paint: {
    Component: PaintCalculator,
    title: 'حاسبة الدهان',
    fullPageHref: '/tools/construction/paint',
  },
  'gypsum-board': {
    Component: GypsumBoardCalculator,
    title: 'حاسبة كمية الجبس بورد',
    fullPageHref: '/tools/construction/gypsum-board',
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
