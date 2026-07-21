'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Globe2, MapPinned } from 'lucide-react';
import { getSafeTimezone, isValidTimeZone } from '@/lib/country-utils';
import CountryFlag from '@/components/shared/CountryFlag';

import styles from './TimeNowClient.module.css';

/* ─── SHARED TICK ───────────────────────────────────────────────────
 * One single 1-second interval for the entire page.
 * Components subscribe by passing a callback; we call all of them.
 * This avoids 250 independent setIntervals.
 ─────────────────────────────────────────────────────────────────── */
const subscribers = new Set();
let tickerId = null;

function subscribeTick(fn) {
  subscribers.add(fn);
  if (!tickerId) tickerId = setInterval(() => subscribers.forEach(f => f()), 1000);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0 && tickerId) { clearInterval(tickerId); tickerId = null; }
  };
}

function getTimeStr(tz) {
  const resolved = getSafeTimezone(tz);
  if (!resolved) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: resolved,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  } catch { return null; }
}

/* ─── INTERSECTION-AWARE COUNTRY CARD ───────────────────────────────
 * Only computes & displays its time when it enters the viewport.
 * When off-screen: static DOM node, zero JS cost.
 ─────────────────────────────────────────────────────────────────── */
function CountryCard({ country_slug, country_code, name_ar, timezone }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(null);

  /* Observe viewport intersection */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true); // SSR fallback
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Only subscribe to the shared tick when in viewport */
  useEffect(() => {
    if (!visible || !timezone) return;
    const refresh = () => setTime(getTimeStr(timezone));
    refresh(); // immediate
    return subscribeTick(refresh);
  }, [visible, timezone]);

  return (
    <Link
      ref={ref}
      href={`/time-now/${country_slug}`}
      prefetch={false}
      className={styles.card}
      aria-label={`الوقت الان في ${name_ar}`}
    >
      <div className={styles.cardLeading}>
        <span aria-hidden className={styles.flag}>
          {country_code ? <CountryFlag code={country_code} /> : <Globe2 size={16} />}
        </span>
        <span className={styles.name}>{name_ar}</span>
      </div>

      <div>
        {visible && time ? (
          <span suppressHydrationWarning className={styles.time}>
            {time}
          </span>
        ) : (
          <span className={styles.timeFallback}>--:--</span>
        )}
      </div>
    </Link>
  );
}

const PAGE_SIZE = 24;
const EMPTY_COUNTRIES = [];

export default function TimeNowClient({ arabCountries, worldCountries }) {
  const [worldPage, setWorldPage] = useState(1);
  const safeArabCountries = Array.isArray(arabCountries) ? arabCountries : EMPTY_COUNTRIES;
  const safeWorldCountries = Array.isArray(worldCountries) ? worldCountries : EMPTY_COUNTRIES;

  const validArab = useMemo(
    () => safeArabCountries.filter(c => isValidTimeZone(c.timezone)),
    [safeArabCountries]
  );
  const validWorld = useMemo(
    () => safeWorldCountries.filter(c => isValidTimeZone(c.timezone)),
    [safeWorldCountries]
  );
  const visibleWorld = useMemo(
    () => validWorld.slice(0, worldPage * PAGE_SIZE),
    [validWorld, worldPage]
  );
  const hasMore = visibleWorld.length < validWorld.length;

  const loadMore = useCallback(() => setWorldPage(p => p + 1), []);

  if (validArab.length === 0 && validWorld.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3 className={styles.emptyTitle}>لا تتوفر قائمة الدول الآن</h3>
        <p className={styles.emptyCopy}>
          جرّب البحث عن مدينة مباشرة من أعلى الصفحة. إذا استمر هذا الوضع فالمشكلة
          من مصدر بيانات الدول، وليست من رابطك الحالي.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="قائمة الدول حسب المنطقة" className={styles.root}>
      {/* ── Arab Countries ── */}
      <div className={styles.group}>
        <div className={styles.groupHead}>
          <span className={styles.groupLabel}>
            <MapPinned size={13} aria-hidden />
            بداية أقرب للمستخدم العربي
          </span>
          <h3 className={styles.groupTitle}>الدول العربية</h3>
          <p className={styles.groupCopy}>
            رتبنا هذه المجموعة أولاً لأن أكثر الزيارات تبدأ منها ثم تنتقل إلى العاصمة
            أو المدينة الأقرب داخل الدولة نفسها.
          </p>
        </div>

        <div className={styles.grid}>
          {validArab.length > 0 ? (
            validArab.map((c) => (
              <CountryCard key={c.country_slug} {...c} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <h4 className={styles.emptyTitle}>لم تظهر دول عربية الآن</h4>
              <p className={styles.emptyCopy}>استخدم البحث أعلى الصفحة للوصول إلى المدينة مباشرة، أو تابع دول العالم في المجموعة التالية.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── World Countries (paginated) ── */}
      <div className={styles.group}>
        <div className={styles.groupHead}>
          <span className={styles.groupLabel}>
            <Globe2 size={13} aria-hidden />
            أرشيف أوسع
          </span>
          <h3 className={styles.groupTitle}>دول العالم</h3>
          <p className={styles.groupCopy}>
            عندما لا تجد الدولة في المجموعة الأولى، استخدم هذا الأرشيف الموسع مع
            تحميل تدريجي يحافظ على خفة الصفحة.
          </p>
        </div>

        <div className={styles.grid}>
          {visibleWorld.length > 0 ? (
            visibleWorld.map((c) => (
              <CountryCard key={c.country_slug} {...c} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <h4 className={styles.emptyTitle}>لا توجد دول إضافية للعرض</h4>
              <p className={styles.emptyCopy}>ما زال بإمكانك استخدام البحث المباشر للوصول إلى مدينة محددة إذا لم تظهر في القائمة.</p>
            </div>
          )}
        </div>

        {hasMore && (
          <div className={styles.loadMoreWrap}>
            <button
              type="button"
              onClick={loadMore}
              className={styles.loadMoreButton}
            >
              اعرض دولاً أخرى ({validWorld.length - visibleWorld.length} دولة متبقية)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
