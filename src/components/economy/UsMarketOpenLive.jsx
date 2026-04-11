'use client';

import { Bank, ClockCountdown } from '@phosphor-icons/react';

import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import { buildUsMarketOpenPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySourceLinks,
  EconomyTable,
  EconomyToolCards,
} from './common';

export default function UsMarketOpenLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildUsMarketOpenPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <Bank size={16} weight="duotone" />
              متى يفتح السوق الأمريكي؟
            </>
          )}
          title="نحمّل توقيت السوق الأمريكي من مدينتك"
          lead="بعد تحديد منطقتك الزمنية نعرض وقت الافتتاح الرسمي، وأول ساعة تداول، والجلسات الموسعة مباشرةً بتوقيتك المحلي."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <Bank size={16} weight="duotone" />
            متى يفتح السوق الأمريكي؟
          </>
        )}
        title={model.heroTitle}
        lead={model.heroLead}
        metaPills={[
          { label: model.viewer.sublabel },
          { label: `الافتتاح الرسمي: ${model.usFocus.openLabel}` },
          { label: `أول ساعة: ${model.usFocus.firstHourLabel}` },
          { label: `الآن: ${model.nowLabel}` },
        ]}
        note={model.viewer.notice}
      />

      <AdTopBanner slotId="top-economy-us-market-open" />

      <EconomyBanner
        kicker="الجواب السريع"
        title={model.usCard?.statusLabel || 'السوق الأمريكي اليوم'}
        detail={model.countdownSummary}
        tone={model.usCard?.isOpen ? 'success' : model.usCard?.statusLabel === 'على وشك الفتح' ? 'warning' : 'info'}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="توقيت السوق الأمريكي في الدول العربية"
          lead="هذه هي الزاوية التي ينقصها معظم المحتوى العربي الحالي: جدول واضح للسعودية والإمارات ومصر والمغرب مع أول ساعة تداول، لا مجرد نقل توقيت نيويورك كما هو."
        />
        <EconomyTable
          columns={['الدولة', 'الافتتاح الرسمي', 'أول ساعة تداول', 'الإغلاق', 'الحالة الآن']}
          rows={model.countryOpenRows}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="ما قبل السوق وما بعد الإغلاق"
          lead="الصفحات العربية تتحدث عادة عن وقت الافتتاح فقط، بينما يبحث كثير من المستخدمين يومياً عن الجلسات الموسعة خصوصاً مع الأسهم الأمريكية والأخبار المفاجئة."
        />
        <EconomyTable
          columns={['الدولة', 'ما قبل السوق', 'ما بعد الإغلاق', 'ملاحظة عملية']}
          rows={model.countryExtendedRows}
        />
      </section>

      <AdInArticle slotId="mid-economy-us-market-open" />

      <section className="economy-section">
        <EconomySectionHeader
          title="لماذا هذه الصفحة أقرب لنية البحث؟"
          lead="المستخدم هنا لا يريد مقدمة استثمارية طويلة، بل يريد جواباً مباشراً ثم شرحاً قصيراً يحل الأسئلة اليومية المرتبطة بموعد الافتتاح."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="هذه الإجابات تلخص أكثر أسئلة السوق الأمريكي تكراراً في البحث العربي بصياغة مباشرة وسهلة المسح."
        />
        <EconomyFaq items={FAQ_ITEMS.usMarketOpen} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع الرسمية"
          lead="نعرض هذه الروابط لأن وقت السوق الأمريكي سؤال يرتبط مباشرة بمصادر البورصة نفسها، لا بمقال وسيط واحد."
        />
        <EconomySourceLinks links={model.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="بعد معرفة وقت الافتتاح، يمكن استخدام الأدوات التالية لمتابعة حالة السوق الأشمل أو أفضل ساعات النشاط."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">قاعدة يومية سريعة</h2>
            <p className="market-card__subtitle">أقصر جواب يحتاجه المستخدم العربي</p>
          </div>
          <ClockCountdown size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">
          إذا كنت تتابع وول ستريت يومياً، فاحفظ وقت الافتتاح الرسمي وأول ساعة فقط، ثم عد إلى هذه الصفحة كلما تغير التوقيت الصيفي أو سافرت إلى مدينة عربية مختلفة.
        </p>
      </section>
    </div>
  );
}
