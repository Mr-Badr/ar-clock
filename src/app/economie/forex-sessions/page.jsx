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
          lead="هذا الجزء يشرح الجلسات بحسب يومك ومنطقتك الزمنية حتى تعرف متى تبدأ الحركة فعلاً بالنسبة لك، لا بحسب جدول عام فقط."
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
          lead="هذه المراجع توضح الأساس الذي نعتمد عليه في قراءة الجلسات والتوقيتات حتى تكون الصورة أوضح عند المتابعة."
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
            lead="تعرض هذه الطبقة لقطة مرجعية سريعة حتى تبدأ الصفحة بإشارة حيّة واضحة قبل الدخول إلى اللوحة التفاعلية."
          />
        </Suspense>

        <Suspense fallback={null}>
          <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="أسئلة تغطيها الصفحة خلال اليوم"
            lead="إذا كان سؤالك عن الجلسات أو التوقيت المحلي أو التداخل بين لندن ونيويورك، فهذه هي نقاط البداية الأسرع."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <Suspense fallback={null}>
          <ForexSessionsServerSections />
        </Suspense>

        <EconomyReadingShelf
          title="اقرأ قبل الاعتماد على الجلسات"
          lead="هذه الأدلة تشرح معنى الجلسات والتداخل والسيولة وساعة السوق بلغة أوضح، ثم تترك لك الرجوع إلى الأداة عندما تحتاجها."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
