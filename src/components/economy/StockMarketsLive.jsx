'use client';

import Link from 'next/link';

import { Bank, ClockCounterClockwise, GlobeHemisphereWest } from '@phosphor-icons/react';

import { buildStockMarketsPageModel } from '@/lib/economy/engine';

import { useEconomyLiveModel } from './useEconomyLiveModel';
import {
  EconomyBanner,
  EconomyFaq,
  EconomyGuide,
  EconomyHero,
  EconomySectionHeader,
  EconomySourceTable,
  EconomyTable,
  EconomyToolCards,
} from './common';

function ExchangeCard({ card }) {
  return (
    <article className="market-card">
      <div className="market-card__top">
        <div className="market-card__title-wrap">
          <h3 className="market-card__title">{card.flag} {card.nameAr}</h3>
          <p className="market-card__subtitle">{card.shortNameAr}</p>
        </div>
        <span className="market-card__status" data-tone={card.statusTone}>
          {card.statusLabel}
        </span>
      </div>

      <dl className="market-card__metrics">
        <div className="market-card__metric">
          <dt>الوقت في السوق</dt>
          <dd>{card.marketTimeLabel}</dd>
        </div>
        <div className="market-card__metric">
          <dt>يفتح بتوقيتك</dt>
          <dd>{card.openLabel}</dd>
        </div>
        <div className="market-card__metric">
          <dt>يغلق بتوقيتك</dt>
          <dd>{card.closeLabel}</dd>
        </div>
      </dl>

      <div className="market-card__highlight">
        <div className="market-card__highlight-title">{card.countdownPrefix}</div>
        <div className="market-card__highlight-value">{card.countdownLabel}</div>
      </div>

      {card.phaseLabel ? <p className="market-card__footnote">المرحلة: {card.phaseLabel}</p> : null}
      {card.note ? <p className="market-card__footnote">{card.note}</p> : null}
      {card.trustNote ? <p className="market-card__footnote">{card.trustNote}</p> : null}
      {card.sourceLabel ? (
        <p className="market-card__footnote">
          مصدر الحالة:{' '}
          {card.sourceUrl ? (
            <a href={card.sourceUrl} target="_blank" rel="noreferrer">
              {card.sourceLabel}
            </a>
          ) : (
            card.sourceLabel
          )}
          {card.syncLabel ? ` · ${card.syncLabel}` : ''}
        </p>
      ) : null}
    </article>
  );
}

export default function StockMarketsLive({ initialViewer, initialNowIso }) {
  const model = useEconomyLiveModel(buildStockMarketsPageModel, initialViewer, initialNowIso);

  if (!model) {
    return (
      <div className="economy-stack">
        <EconomyHero
          eyebrow={(
            <>
              <Bank size={16} weight="duotone" />
              البورصات العالمية الآن
            </>
          )}
          title="البورصات العالمية بتوقيتك المحلي"
          lead="نحمّل المنطقة الزمنية الحالية أولاً، ثم نعرض أوقات الفتح والإغلاق والجلسات الموسعة مباشرةً."
          metaPills={[{ label: 'جارٍ تحديد توقيتك الحالي' }]}
        />
      </div>
    );
  }

  const cards = model.cards;
  const majorBoards = model.majorBoards;
  const sourceRows = model.sourceRows || [];
  const trustPoints = model.trustPoints || [];
  const trustSummary = model.trustSummary;

  return (
    <div className="economy-stack">
      <EconomyHero
        eyebrow={(
          <>
            <Bank size={16} weight="duotone" />
            البورصات العالمية الآن
          </>
        )}
        title={`البورصات العالمية بتوقيت ${model.viewer.label}`}
        lead="هذه الصفحة تعطي المستخدم العربي ما يحتاجه فعلاً: هل السوق مفتوح الآن، ومتى يفتح ويغلق بتوقيتي، وما الفرق بين الجلسة الرسمية والجلسات الموسعة. كل ذلك يعتمد على الساعات الاعتيادية الرسمية وتحويل المنطقة الزمنية الحقيقي من دون أي خدمة مدفوعة."
        metaPills={[
          { label: `${model.viewer.sublabel}` },
          { label: `الآن: ${model.nowLabel}` },
          { label: model.todayLabel },
          { label: 'المصدر: الساعات الاعتيادية الرسمية' },
        ]}
        note={model.viewer.notice}
      />

      <EconomyBanner
        kicker="جواب فوري"
        title="هل السوق مفتوح الآن؟"
        detail={`السوق الأمريكي: ${majorBoards.find((item) => item.id === 'us')?.statusLabel || '--'}، تداول السعودي: ${majorBoards.find((item) => item.id === 'sa')?.statusLabel || '--'}، بورصة لندن: ${majorBoards.find((item) => item.id === 'uk')?.statusLabel || '--'}.`}
        tone="warning"
      />

      <EconomyBanner
        kicker="ثقة البيانات"
        title="طبقة مجانية واضحة وحدودها معلنة"
        detail={trustSummary}
        tone="info"
      >
        <div className="economy-guide-grid">
          {trustPoints.map((point) => (
            <article key={point.title} className="economy-copy-card">
              <h3 className="economy-copy-card__title">{point.title}</h3>
              <p className="economy-copy-card__body">{point.body}</p>
            </article>
          ))}
        </div>
      </EconomyBanner>

      <section className="economy-section">
        <EconomySectionHeader
          title="أهم الأسواق الآن"
          lead="كل بطاقة تعرض حالة السوق الحالية والعد التنازلي وفق الجلسة الاعتيادية المعروفة، ثم تربط ذلك مباشرةً بتوقيتك المحلي حتى لا تضطر إلى حفظ جداول نيويورك أو لندن أو الرياض منفصلة."
        />
        <div className="economy-grid">
          {cards.map((card) => (
            <ExchangeCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      {sourceRows.length > 0 ? (
        <section className="economy-section">
          <EconomySectionHeader
            title="من أين تأتي البيانات؟"
            lead="هذه اللوحة تبيّن مصدر الحالة المباشرة، والمرجع الرسمي لساعات التداول، وآخر مزامنة مرئية حتى يعرف المستخدم ما الذي يراه بالضبط."
          />
          <EconomySourceTable rows={sourceRows} />
        </section>
      ) : null}

      <section className="economy-grid">
        <article className="market-card">
          <div className="market-card__top">
            <div className="market-card__title-wrap">
              <h2 className="market-card__title">🇺🇸 السوق الأمريكي من مدينتك</h2>
              <p className="market-card__subtitle">متى تجلس فعلياً أمام الشاشة؟</p>
            </div>
            <GlobeHemisphereWest size={18} weight="duotone" />
          </div>

          <dl className="market-card__metrics">
            <div className="market-card__metric">
              <dt>جرس الافتتاح</dt>
              <dd>{model.usFocus.openLabel}</dd>
            </div>
            <div className="market-card__metric">
              <dt>الساعة الأولى</dt>
              <dd>{model.usFocus.firstHourLabel}</dd>
            </div>
            <div className="market-card__metric">
              <dt>ذروة التداخل مع لندن</dt>
              <dd>{model.usFocus.overlapLabel}</dd>
            </div>
            <div className="market-card__metric">
              <dt>جرس الإغلاق</dt>
              <dd>{model.usFocus.closeLabel}</dd>
            </div>
          </dl>
        </article>

        <article className="market-card">
          <div className="market-card__top">
            <div className="market-card__title-wrap">
              <h2 className="market-card__title">جلسات ما قبل وما بعد السوق</h2>
              <p className="market-card__subtitle">Pre-market / After-hours</p>
            </div>
            <ClockCounterClockwise size={18} weight="duotone" />
          </div>

          <dl className="market-card__metrics">
            <div className="market-card__metric">
              <dt>ما قبل السوق</dt>
              <dd>{model.extendedHours.premarketLabel}</dd>
            </div>
            <div className="market-card__metric">
              <dt>ما بعد الإغلاق</dt>
              <dd>{model.extendedHours.afterhoursLabel}</dd>
            </div>
          </dl>

          <p className="market-card__footnote">{model.extendedHours.note}</p>
        </article>
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أيام المتابعة خلال الأسبوع"
          lead="هذا الجدول البسيط يوضح الأيام التي تُتابع فيها هذه الصفحة خلال الأسبوع الحالي بتوقيتك، بينما تستمر البطاقات في حساب أوقات الفتح والإغلاق تلقائياً لكل سوق."
        />
        <EconomyTable
          columns={['اليوم', 'التاريخ']}
          rows={model.weeklySnapshot.map((item) => ({
            key: item.label,
            cells: [item.label, item.dateLabel],
          }))}
        />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="دليل مختصر للمستثمر العربي"
          lead="الهدف هنا ليس شرح البورصات نظرياً فقط، بل تقديم شرح عربي واضح يربط الافتتاح والإغلاق والجلسات الموسعة بساعة المستخدم المحلية ومصدر البيانات."
        />
        <EconomyGuide sections={model.guideSections} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أسئلة شائعة"
          lead="الإجابات التالية تتحدث بلغة المستخدم العربي نفسه، وتُشتق من المحرك الزمني الظاهر في البطاقات أعلاه."
        />
        <EconomyFaq items={model.faqItems} />
      </section>

      <section className="economy-section">
        <EconomySectionHeader
          title="أدوات مرتبطة"
          lead="للمستخدم الذي يريد أكثر من جواب نعم أو لا، أضفنا أدوات مرتبطة تساعده على قراءة السوق في شكل بصري وأسبوعي."
        />
        <EconomyToolCards cards={model.relatedTools} />
      </section>

      <section className="economy-banner" data-tone="default">
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
