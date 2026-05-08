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
} from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import MarketClockLive from '@/components/economy/MarketClockLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'market-clock';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.marketClock);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.marketClock);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.marketClock);

async function MarketClockServerSections() {
  const { serverModel } = await getEconomyPageServerState(PAGE_SCOPE);

  return (
    <>
      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تقرأ الساعة كأداة قرار؟"
          lead="هذا الجزء يشرح كيف تقرأ ساعة السوق عملياً، وما الذي تعنيه اللحظة الحالية بالنسبة للسيولة والجلسات النشطة."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع التي تدعم قراءة الساعة"
          lead="هذه المراجع تساعدك على فهم الأساس الذي بُنيت عليه ساعة السوق والتوقيتات الظاهرة في الصفحة."
        />
        <EconomySourceLinks links={serverModel.sourceLinks} />
      </section>
    </>
  );
}

export default async function MarketClockPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.marketClock });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />
      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض السيولة الآن"
            lead="هذه الطبقة الحية تجعل ساعة السوق جزءاً من لوحة متابعة عملية: أسعار مرجعية، حالة أسواق أساسية، ثم قراءة بصرية أعمق لليوم."
          />
        </Suspense>

        <Suspense fallback={null}>
          <MarketClockLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="أسئلة تساعدك ساعة السوق على حسمها"
            lead="من فهم السيولة الحالية إلى تداخل لندن ونيويورك وخريطة النشاط اليومي، هذه هي أسرع نقاط البداية داخل الصفحة."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <MarketClockServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="كيف تفهم الساعة لا الرقم فقط؟"
          lead="هذه الأدلة تشرح معنى ساعة السوق والسيولة والجلسات بلغة أبسط، ثم تترك لك العودة إلى الأداة عندما تحتاجها."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
