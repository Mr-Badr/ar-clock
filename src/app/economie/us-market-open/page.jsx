import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildEconomyPageSearchCoverage,
  buildEconomyToolPageMetadata,
  buildEconomyToolPageSchemas,
} from '@/lib/economy/page-helpers';
import {
  getCachedEconomyPageSnapshot,
  getEconomyPageServerState,
} from '@/lib/economy/page-snapshots.server';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import {
  EconomyGuide,
  EconomyIntentCards,
  EconomyReadingShelf,
  EconomySectionHeader,
  EconomySourceLinks,
  InsightCards,
} from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import UsMarketOpenLive from '@/components/economy/UsMarketOpenLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'us-market-open';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.usMarketOpen);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.usMarketOpen);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.usMarketOpen);

async function UsMarketOpenServerSections() {
  const { serverModel } = await getEconomyPageServerState(PAGE_SCOPE);

  return (
    <>
      <section className="economy-section">
        <EconomySectionHeader
          title="الجواب المباشر ثم السياق الصحيح"
          lead="هذا الجزء يجيب أولاً عن موعد الافتتاح الأمريكي، ثم يضيف ما تحتاجه لفهم فرق التوقيت والساعة الأولى والجلسات الموسعة بشكل أوضح."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع الرسمية والمرجعية"
          lead="نعرض مصادر السوق الأمريكي بوضوح حتى تعرف من أين جاءت التوقيتات والمعلومات الأساسية في الصفحة."
        />
        <EconomySourceLinks links={serverModel.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="بعد معرفة الافتتاح، ما الخطوة الطبيعية التالية؟"
          lead="بعد معرفة موعد الافتتاح قد تحتاج إلى الذهب أو ساعة السوق أو أفضل وقت للتداول، لذلك وضعنا لك الخطوات التالية بشكل واضح."
        />
        <InsightCards cards={serverModel.relatedTools} />
      </section>
    </>
  );
}

export default async function UsMarketOpenPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.usMarketOpen });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />

      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض وول ستريت الآن"
            lead="سعران مرجعيان سريعان ووضع السوق المرجعي يساعدان الصفحة على الإجابة عن السؤال من أول شاشة، ثم يأتي العداد والشرح الأعمق بعد ذلك."
          />
        </Suspense>

        <Suspense fallback={null}>
          <UsMarketOpenLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="أسئلة تجيب عنها الصفحة مباشرة"
            lead="من موعد افتتاح وول ستريت إلى فرق التوقيت والساعة الأولى، ستجد هنا أبرز الأسئلة التي يحتاجها المتابع اليومي."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <UsMarketOpenServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="اقرأ قبل متابعة الافتتاح"
          lead="هذه الأدلة تشرح معنى الافتتاح الأمريكي والساعة البصرية حتى لا تبقى الصفحة مجرد عد تنازلي من دون سياق."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
