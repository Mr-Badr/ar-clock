import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  buildEconomyPageSearchCoverage,
  buildEconomyToolPageMetadata,
  buildEconomyToolPageSchemas,
} from '@/lib/economy/page-helpers';
import { getCachedEconomyPageSnapshot } from '@/lib/economy/page-snapshots.server';

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

export default async function UsMarketOpenPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
    serverModel,
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
            title="صيغ بحث تغطيها الصفحة فعلياً"
            lead="هذه العبارات مبنية من نية المستخدم العربي الشائعة حول افتتاح وول ستريت، وتظهر داخل HTML نفسه حتى تكون الإشارة أوضح للزائر ومحركات البحث."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="الجواب المباشر ثم السياق الصحيح"
            lead="هذا الجزء يلتقط سؤال الافتتاح الأمريكي كما يبحث عنه الناس فعلاً، ثم يضيف فرق التوقيت والساعة الأولى والجلسات الموسعة داخل HTML نفسه."
          />
          <EconomyGuide sections={serverModel.guideSections} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="المراجع الرسمية والمرجعية"
            lead="نربط مصادر السوق الأمريكي بوضوح حتى يعرف الزائر ومحرك البحث أن الصفحة لا تعتمد على صياغة عامة فقط، بل على منهج معروف ومراجع معلنة."
          />
          <EconomySourceLinks links={serverModel.sourceLinks} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="بعد معرفة الافتتاح، ما الخطوة الطبيعية التالية؟"
            lead="هذا الربط الداخلي يخفف الارتداد ويحوّل صفحة الافتتاح إلى بوابة استخدام يومي داخل قسم الاقتصاد كله."
          />
          <InsightCards cards={serverModel.relatedTools} />
        </section>

        <EconomyReadingShelf
          title="اقرأ قبل متابعة الافتتاح"
          lead="هذه الأدلة تشرح معنى الافتتاح الأمريكي والساعة البصرية حتى لا تبقى الصفحة مجرد عد تنازلي من دون سياق."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
