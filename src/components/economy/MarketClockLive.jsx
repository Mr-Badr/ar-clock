// components/economy/MarketClockLive.jsx
'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ClockCountdown, GlobeHemisphereEast } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildMarketClockPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import HourlyActivityChart from './HourlyActivityChart';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySpotlight,
  EconomyStatCards,
  EconomySourceLinks,
  EconomyTimeline,
  EconomyToolCards,
  HourDetailPanel,
} from './common';

export default function MarketClockLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(
    buildMarketClockPageModel,
    initialViewer,
    initialNowIso,
    (nextModel) => nextModel?.browserTitle,
  );
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    if (!model) return;
    setSelectedHour((current) => (
      current == null
        ? model.activityChart.points.find((point) => point.isCurrent)?.hour ?? model.activityChart.points[0]?.hour ?? 0
        : current
    ));
  }, [model]);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <ClockCountdown size={16} weight="duotone" />
              ساعة التداول العالمية
            </>
          )}
          title="نحمّل ساعة السوق حسب توقيتك"
          lead="بعد تحديد منطقتك الزمنية نعرض اليوم بالكامل كساعة تداول بصرية بدلاً من جدول تقليدي ثابت."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  const selectedPoint = model.activityChart.points.find((point) => point.hour === selectedHour) || model.activityChart.points[0];

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <ClockCountdown size={16} weight="duotone" />
            ساعة التداول العالمية
          </>
        )}
        title={model.heroTitle}
        lead={model.heroLead}
        metaPills={[
          { label: model.viewer.sublabel },
          { label: `الآن: ${model.nowLabel}` },
          { label: model.todayLabel },
        ]}
        note={model.viewer.notice}
      />

      <EconomyStatCards cards={model.signalCards} />
      <EconomySpotlight model={model.spotlight} />

      <AdTopBanner slotId="top-economy-market-clock" />

      <EconomyBanner
        kicker="قراءة فورية"
        title={model.hero.label}
        detail="إذا أردت رؤية السوق خلال يومك بالكامل في لقطة واحدة، فهذه الصفحة هي القراءة الأسرع: متى يبدأ النشاط، متى ترتفع السيولة، ومتى تتراجع."
        tone={model.hero.tone}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="الساعة البصرية"
          lead="الخط الزمني التالي يحوّل جلسات سيدني وطوكيو ولندن ونيويورك إلى يومك المحلي، مع إبراز تداخل لندن ونيويورك كأهم نافذة سيولة."
        />
        <EconomyTimeline
          timeline={model.timeline}
          selectedHour={selectedHour}
          onHourClick={setSelectedHour}
        />
        <HourDetailPanel point={selectedPoint} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="مؤشر النشاط لكل ساعة"
          lead="عندما يرتفع العمود فهذا يعني ببساطة أن المتداول العربي يدخل ساعات أنشط من يومه، ويقترب من تحركات أوضح وتنفيذ أسرع عادةً."
        />
        <HourlyActivityChart chart={model.activityChart} title="ساعة السيولة على مدار 24 ساعة" />
      </section>

      <AdInArticle slotId="mid-economy-market-clock" />

      <section className="economy-section">
        <EconomySectionHeader
          title="كيف تستخدم هذه الأداة؟"
          lead="هذه ليست صفحة للزينة. الغرض منها أن تمنحك قراراً سريعاً: هل تراقب الآن، أم تنتظر، أم تكتفي بمتابعة جلسة أهدأ؟"
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-grid">
        {model.dayComparisonRows.map((row) => (
          <article key={row.key} className="market-card">
            <div className="market-card__top">
              <div className="market-card__title-wrap">
                <h2 className="market-card__title">{row.dayLabel}</h2>
                <p className="market-card__subtitle">{row.peakLabel}</p>
              </div>
            </div>
            <p className="economy-banner__detail">{row.summary}</p>
            <p className="market-card__footnote">{row.note}</p>
          </article>
        ))}
      </section>

      <EconomyBanner
        kicker="ما الأفضل الآن؟"
        title={model.nowRecommendation.title}
        detail={model.nowRecommendation.body}
        tone={model.nowRecommendation.tone}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="هذه الأسئلة تشرح كيفية قراءة ساعة السوق ولماذا تختلف عن الجداول التقليدية الثابتة."
        />
        <EconomyFaq items={model.faqItems || FAQ_ITEMS.marketClock} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع"
          lead="نعتمد على نفس مراجع الجلسات العالمية المستخدمة في أداة الفوركس حتى تبقى القراءة البصرية متسقة مع الواقع العملي للسوق."
        />
        <EconomySourceLinks links={model.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أكمل القراءة"
          lead="ساعة السوق تعطي الصورة الواسعة، بينما الأدوات التالية تجيب عن الأسئلة العملية اليومية."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">لماذا ستعود لهذه الصفحة؟</h2>
            <p className="market-card__subtitle">لأنها تختصر اليوم كله في واجهة واحدة</p>
          </div>
          <GlobeHemisphereEast size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          بدلاً من حفظ أربع مناطق زمنية ومواعيد تتغير مع الصيف والشتاء، تفتح هذه الصفحة فتعرف فوراً أين يقف السوق داخل يومك المحلي.
        </p>
        <div className="economy-source-links">
          <Link href="/disclaimer" className="economy-meta-pill">
            إخلاء المسؤولية
          </Link>
        </div>
      </section>
    </div>
  );
}
