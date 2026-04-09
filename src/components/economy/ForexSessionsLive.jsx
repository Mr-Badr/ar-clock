'use client';

import Link from 'next/link';

import { ChartLineUp, Sparkle } from '@phosphor-icons/react';

import { buildForexPageModel } from '@/lib/economy/engine';

import { FAQ_ITEMS } from './data/faqItems';
import HourlyActivityChart from './HourlyActivityChart';
import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySourceLinks,
  EconomyTable,
  EconomyTimeline,
  EconomyToolCards,
} from './common';

function ForexCard({ card }) {
  return (
    <article className="market-card">
      <div className="market-card__top">
        <div className="market-card__title-wrap">
          <h3 className="market-card__title">{card.flag} {card.nameAr}</h3>
          <p className="market-card__subtitle">{card.pairsLabel}</p>
        </div>
        <span className="market-card__status" data-tone={card.statusTone}>
          {card.statusLabel}
        </span>
      </div>

      <dl className="market-card__metrics">
        <div className="market-card__metric">
          <dt>تفتح</dt>
          <dd>{card.openLabel}</dd>
        </div>
        <div className="market-card__metric">
          <dt>تغلق</dt>
          <dd>{card.closeLabel}</dd>
        </div>
      </dl>

      <div className="market-card__highlight">
        <div className="market-card__highlight-title">{card.countdownPrefix}</div>
        <div className="market-card__highlight-value">{card.countdownLabel}</div>
      </div>
    </article>
  );
}

export default function ForexSessionsLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildForexPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <ChartLineUp size={16} weight="duotone" />
              جلسات الفوركس والذهب الآن
            </>
          )}
          title="جلسات الفوركس والذهب بتوقيتك المحلي"
          lead="نحمّل المنطقة الزمنية الحالية الآن ثم نحسب الجلسات الأربع والذهب مباشرةً على جهازك."
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
            <ChartLineUp size={16} weight="duotone" />
            جلسات الفوركس والذهب الآن
          </>
        )}
        title={`جلسات الفوركس والذهب بتوقيت ${model.viewer.label}`}
        lead="هذه الصفحة تعطي جواباً مباشراً: ما الجلسة النشطة الآن، ومتى تفتح أو تغلق الجلسات الأربع الرئيسية، ومتى تكون نافذة السيولة الأعلى للذهب والأزواج الرئيسية. كل ذلك محسوب من المنطقة الزمنية الحالية بدلاً من جدول ثابت خاص بدولة واحدة."
        metaPills={[
          { label: `${model.viewer.sublabel}` },
          { label: `الآن: ${model.nowLabel}` },
          { label: model.todayLabel },
        ]}
        note={model.viewer.notice}
      />

      <EconomyBanner
        kicker="الحالة الحالية"
        title={model.hero.label}
        detail={model.hero.detail}
        tone={model.hero.tone}
      />

      <section className="economy-section">
        <EconomySectionHeader
          title="بطاقات الجلسات الأربع"
          lead="كل بطاقة تحوّل توقيت المركز المالي إلى توقيتك الحالي، مع عداد يوضح هل الجلسة مفتوحة الآن أم أنها على وشك الفتح."
        />
        <div className="economy-grid">
          {model.cards.map((card) => (
            <ForexCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="الخط الزمني البصري"
          lead="يمثل هذا الشريط يومك الحالي بالكامل بتوقيتك المحلي، مع إبراز تداخل لندن ونيويورك كنافذة سيولة عليا."
        />
        <EconomyTimeline timeline={model.timeline} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="خريطة السيولة خلال يومك"
          lead="بدلاً من سؤال واحد عن ساعة الافتتاح، يُظهر هذا الرسم كيف ترتفع وتنخفض السيولة خلال يومك المحلي، ومتى تبلغ الذروة فعلياً."
        />
        <HourlyActivityChart chart={model.activityChart} />
      </section>

      <section className="economy-grid">
        <article className="market-card">
          <div className="market-card__top">
            <div className="market-card__title-wrap">
              <h2 className="market-card__title">🥇 تداول الذهب الآن</h2>
              <p className="market-card__subtitle">XAU/USD</p>
            </div>
            <span className="market-card__status" data-tone={model.gold.tone}>
              {model.gold.statusLabel}
            </span>
          </div>

          <div className="market-card__highlight">
            <div className="market-card__highlight-title">أفضل نافذة اليوم</div>
            <div className="market-card__highlight-value">{model.gold.bestWindowLabel}</div>
          </div>

          <p className="market-card__footnote">{model.gold.detail}</p>
          {model.gold.nextWindowLabel ? (
            <p className="market-card__footnote">إعادة الفتح التقريبية: {model.gold.nextWindowLabel}</p>
          ) : null}
        </article>

        <article className="market-card">
          <div className="market-card__top">
            <div className="market-card__title-wrap">
              <h2 className="market-card__title">⭐ النافذة الذهبية للتداول</h2>
              <p className="market-card__subtitle">أفضل وقت لمتابعة EUR/USD وXAU/USD</p>
            </div>
            <span className="market-card__status" data-tone={model.bestWindow.isActive ? 'success' : 'warning'}>
              {model.bestWindow.statusLabel}
            </span>
          </div>

          <div className="market-card__highlight">
            <div className="market-card__highlight-title">التوقيت المحلي</div>
            <div className="market-card__highlight-value">
              {model.bestWindow.startLabel} - {model.bestWindow.endLabel}
            </div>
          </div>

          <p className="market-card__footnote">
            هذه الفترة تمثل تداخل لندن ونيويورك، وغالباً ما تكون أوضح نافذة للمتداول العربي لأنها تجمع أعلى سيولة وأسرع استجابة للأخبار.
          </p>
        </article>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="مرجع الجلسات والذهب"
          lead="هذه القيم تشرح الإطار الذي تُبنى عليه الصفحة: أسبوع الفوركس المرجعي، نافذة الذهب، وتأثير التوقيت الصيفي على الجداول العربية."
        />
        <EconomyTable
          columns={['العنصر', 'القاعدة العملية', 'لماذا يهم؟']}
          rows={model.sessionReferenceRows.map((row) => ({
            key: row.key,
            cells: row.cells,
          }))}
        />
      </section>

      <EconomyBanner
        kicker="كيف نعرض الجلسات بمهنية؟"
        title="جلسات سيولة وليست بورصة مركزية واحدة"
        detail="الأدق مهنياً في الفوركس هو عرض السوق كجلسات عالمية متعارف عليها مع توضيح أن التنفيذ الفعلي قد يختلف دقائق قليلة بين الوسطاء وبعض منتجات الذهب."
        tone="info"
      >
        <div className="economy-guide-grid">
          {model.trustSections.map((section) => (
            <article key={section.title} className="economy-copy-card">
              <h3 className="economy-copy-card__title">{section.title}</h3>
              <p className="economy-copy-card__body">{section.body}</p>
            </article>
          ))}
        </div>
      </EconomyBanner>

      <section className="economy-section">
        <EconomySectionHeader
          title="أفضل نوافذ الأسبوع"
          lead="هذا الجدول يربط بين يوم الأسبوع المحلي وأفضل نافذة متابعة للسيولة، مع وقت قيادة لندن وأول ساعة من نيويورك."
        />
        <EconomyTable
          columns={['اليوم', 'تداخل لندن ونيويورك', 'قيادة لندن', 'أول ساعة نيويورك']}
          rows={model.tradingWeek.map((item) => ({
            key: item.key,
            cells: [item.dayLabel, item.overlapLabel, item.londonLeadLabel, item.usOpenLabel],
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="دليل الجلسات بتوقيتك"
          lead="المحتوى هنا مكتوب ليشرح ما يحدث للمستخدم العربي نفسه، لا ليكرر جدولاً عالمياً معزولاً عن منطقته الزمنية."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="هذه الأسئلة تلخص أكثر ما يبحث عنه المستخدم العربي حول جلسات الفوركس والذهب خلال اليوم."
        />
        <EconomyFaq items={FAQ_ITEMS.forexSessions} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="المراجع المستخدمة"
          lead="نُظهر هذه المراجع علناً لأن الثقة في أدوات الوقت والتداول تبدأ من وضوح المنهج لا من كثرة الادعاءات."
        />
        <EconomySourceLinks links={model.sourceLinks} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="إذا كنت تستخدم هذه الصفحة يومياً، فالأدوات التالية تكملها بشكل طبيعي: ساعة سوق بصرية وصفحة أفضل وقت للتداول من مدينتك."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="default">
        <div className="market-card__top">
          <div className="market-card__title-wrap">
            <h2 className="market-card__title">ملاحظة دقة</h2>
            <p className="market-card__subtitle">أوقات التداول الاعتيادية</p>
          </div>
          <Sparkle size={18} weight="duotone" />
        </div>
        <p className="economy-banner__detail">{model.disclaimer}</p>
        <div className="economy-source-links">
          <Link href="/disclaimer" className="economy-meta-pill">
            إخلاء المسؤولية
          </Link>
        </div>
      </section>
    </div>
  );
}
