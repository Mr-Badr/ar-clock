'use client';

import Link from 'next/link';
import { startTransition, useEffect, useRef, useState } from 'react';
import { Activity, ArrowLeft, Clock3, RefreshCcw, WifiOff } from 'lucide-react';

import { logger, serializeError } from '@/lib/logger';

import styles from './economy-live-pulse.module.css';

function Sparkline({ points, tone = 'default' }) {
  if (!Array.isArray(points) || points.length < 2) {
    return null;
  }

  const width = 160;
  const height = 48;
  const padding = 3;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - (((point - min) / range) * (height - padding * 2) + padding);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');

  return (
    <div className={styles.sparklineShell} data-tone={tone}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.sparkline} preserveAspectRatio="none" aria-hidden="true">
        <path d={path} className={styles.sparklinePath} />
      </svg>
    </div>
  );
}

function LiveCard({ card }) {
  return (
    <Link href={card.href} className={styles.card} data-tone={card.tone || 'default'}>
      <div className={styles.cardHead}>
        <div>
          <span className={styles.cardSymbol}>{card.symbol}</span>
          <h3 className={styles.cardTitle}>{card.title}</h3>
        </div>
        <span className={styles.cardExchange}>{card.exchange || 'Global'}</span>
      </div>

      <div className={styles.cardBody}>
        <strong className={styles.cardValue}>{card.value}</strong>
        <span className={styles.cardChange}>{card.changeLabel}</span>
        <p className={styles.cardDetail}>{card.detail}</p>
        {card.sparkline?.length ? (
          <div className={styles.chartBlock}>
            <Sparkline points={card.sparkline} tone={card.tone} />
            {card.rangeLabel ? <span className={styles.rangeLabel}>{card.rangeLabel}</span> : null}
          </div>
        ) : card.rangeLabel ? (
          <p className={styles.rangeLabel}>{card.rangeLabel}</p>
        ) : null}
      </div>

      <div className={styles.cardFoot}>
        <span className={styles.cardUpdate}>{card.updateLabel}</span>
        <span className={styles.cardCta}>
          افتح الصفحة
          <ArrowLeft size={14} />
        </span>
      </div>
    </Link>
  );
}

export default function EconomyLivePulse({
  scope = 'landing',
  title,
  lead,
  initialSnapshot,
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!scope) return undefined;

    let cancelled = false;
    let intervalId = null;
    let cleanupIdleCallback = null;
    let cleanupObserver = null;

    async function refreshSnapshot() {
      try {
        const response = await fetch(`/api/economie/live?scope=${encodeURIComponent(scope)}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          logger.warn('economy-live-pulse-refresh-failed', {
            scope,
            status: response.status,
            statusText: response.statusText,
          });
          return;
        }

        const payload = await response.json();
        if (cancelled || !payload || !Array.isArray(payload.cards)) {
          if (!cancelled) {
            logger.warn('economy-live-pulse-invalid-payload', {
              scope,
              payloadType: payload == null ? 'nullish' : typeof payload,
              cardCount: Array.isArray(payload?.cards) ? payload.cards.length : null,
            });
          }
          return;
        }

        startTransition(() => {
          setSnapshot(payload);
        });
      } catch (error) {
        logger.warn('economy-live-pulse-refresh-threw', {
          scope,
          error: serializeError(error),
        });
      }
    }

    function activateLiveSync() {
      if (cancelled) return;

      refreshSnapshot();

      if (intervalId == null) {
        intervalId = window.setInterval(() => {
          if (document.visibilityState !== 'visible') return;
          refreshSnapshot();
        }, 60_000);
      }
    }

    function scheduleActivation() {
      if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(() => {
          activateLiveSync();
        }, { timeout: 2500 });

        cleanupIdleCallback = () => window.cancelIdleCallback(idleId);
        return;
      }

      const timeoutId = window.setTimeout(() => {
        activateLiveSync();
      }, 900);

      cleanupIdleCallback = () => window.clearTimeout(timeoutId);
    }

    if (typeof IntersectionObserver === 'function' && panelRef.current) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          scheduleActivation();
        }
      }, { rootMargin: '160px 0px' });

      observer.observe(panelRef.current);
      cleanupObserver = () => observer.disconnect();
    } else {
      scheduleActivation();
    }

    return () => {
      cancelled = true;
      cleanupIdleCallback?.();
      cleanupObserver?.();

      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
    };
  }, [scope]);

  if (!snapshot?.cards?.length) {
    return null;
  }

  const isFallback = snapshot.mode === 'fallback';
  const isPreview = snapshot.mode === 'preview';
  const liveCardCount = snapshot.cards.filter((card) => card.value && card.value !== '—').length;

  return (
    <section ref={panelRef} className={styles.panel} aria-label={title}>
      <div className={styles.panelHead}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>
            <Activity size={15} />
            بيانات السوق الحية
          </span>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.lead}>{lead}</p>
        </div>

        <div className={styles.metaRail}>
          <span className={styles.metaPill}>
            {isFallback ? <WifiOff size={14} /> : <RefreshCcw size={14} />}
            {snapshot.providerLabel}
          </span>
          <span className={styles.metaPill}>
            <Clock3 size={14} />
            {snapshot.updateLabel}
          </span>
          <span className={styles.metaPill}>
            <Activity size={14} />
            {liveCardCount}/{snapshot.cards.length} إشارات مفعلة
          </span>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.cardGrid}>
          {snapshot.cards.map((card) => (
            <LiveCard key={card.id} card={card} />
          ))}
        </div>

        <aside className={styles.sidePanel}>
          <div className={styles.sideBlock}>
            <h3 className={styles.sideTitle}>حالة الأسواق المرجعية</h3>
            {snapshot.rows?.length ? (
              <div className={styles.statusList}>
                {snapshot.rows.map((row) => (
                  <article key={row.id} className={styles.statusItem} data-tone={row.tone || 'default'}>
                    <div>
                      <strong>{row.label}</strong>
                      <p>{row.detail}</p>
                    </div>
                    <span>{row.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.sideNote}>
                طبقة التوقيت والسيولة جاهزة الآن، وسيظهر معها وضع الأسواق المرجعية عندما تكون
                تغذية الأسعار الحية متاحة.
              </p>
            )}
          </div>

          <div className={styles.sideBlock}>
            <h3 className={styles.sideTitle}>لماذا هذا مهم؟</h3>
            <p className={styles.sideNote}>{snapshot.coverageNote}</p>
            <p className={styles.sideNote}>
              هذه اللوحة تعطي الصفحة نبضاً حقيقياً من أول تحميل: أسعار مرجعية، تغيّر لحظي،
              ومجال يومي سريع يساعد الزائر على القراءة قبل الغوص في الرسوم والشرح.
            </p>
          </div>

          <div className={styles.sideBlock}>
            <h3 className={styles.sideTitle}>{snapshot.noticeTitle || 'حالة تغطية البيانات'}</h3>
            <p className={styles.sideNote}>{snapshot.noticeText}</p>
            <p className={styles.sideNote}>
              {isPreview
                ? 'لن نستهلك أي مصدر خارجي إلا بعد دخول الزائر إلى الصفحة وظهور هذه اللوحة.'
                : snapshot.retryLabel}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
