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
import ForexSessionsLive from '@/components/economy/ForexSessionsLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const PAGE_SCOPE = 'forex-sessions';
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.forexSessions);
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage(PAGE_SCOPE, FAQ_ITEMS.forexSessions);

export const metadata = buildEconomyToolPageMetadata(PAGE_SCOPE, FAQ_ITEMS.forexSessions);

async function ForexSessionsServerSections() {
  const { serverModel } = await getEconomyPageServerState(PAGE_SCOPE);

  return (
    <>
      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تقرأ الجلسات من مدينتك فعلياً؟"
          lead="هذه الفقرة مبنية من نموذج الصفحة نفسه، لذلك تتغير صيغتها مع اليوم والمنطقة الزمنية وتبقى مفهومة لمحركات البحث والزائر معاً."
        />
        <EconomyGuide sections={serverModel.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="حدود الصفحة ومنهجها"
          lead="هذه النقاط تشرح ما الذي نعتمده هنا، وما الذي قد يختلف بين الوسطاء والأدوات، حتى تبقى الصفحة مفيدة ومهنية في الوقت نفسه."
        />
        <EconomyGuide sections={serverModel.trustSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع التي بُنيت عليها طبقة الجلسات"
          lead="ربط المصادر المرجعية مباشرة داخل HTML يساعد على فهم أعمق للصفحة ويقوي الإشارة إلى أنها صفحة أدوات مبنية على منهج واضح."
        />
        <EconomySourceLinks links={serverModel.sourceLinks} />
      </section>
    </>
  );
}

export default async function ForexSessionsPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot(PAGE_SCOPE);
  const schemas = buildEconomyToolPageSchemas({ scope: PAGE_SCOPE, faqItems: FAQ_ITEMS.forexSessions });

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={schemas} />
      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope={PAGE_SCOPE}
            initialSnapshot={liveSnapshot}
            title="نبض جلسات الفوركس الآن"
            lead="تعرض هذه الطبقة قبل اللوحة التفاعلية أسعاراً مرجعية وحالة السوق المرجعية حتى تبدأ الصفحة بإشارة حيّة واضحة، لا بعنوان فقط."
          />
        </Suspense>

        <Suspense fallback={null}>
          <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="كيف يكتب الناس هذا السؤال في البحث؟"
            lead="هذه الصيغ تجمع بين الجلسات والتوقيت المحلي والسيولة والتداخل، حتى لا تبقى الصفحة محصورة في عبارة واحدة فقط مثل جلسات الفوركس."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <ForexSessionsServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="اقرأ قبل الاعتماد على الجلسات"
          lead="هذه الأدلة تشرح معنى الجلسات والتداخل والسيولة وساعة السوق، ثم تعيد الزائر إلى الأداة الحية وهو يفهم ما يراه بشكل أفضل."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
