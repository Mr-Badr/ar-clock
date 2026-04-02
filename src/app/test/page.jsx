/* app/test/page.jsx */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './TimeCinematicHero.module.css';
import HeroEmbeddedClock from './HeroEmbeddedClock';

const VIDEO_ROI = { x: 0.189, y: 0.513, w: 0.522, h: 0.379 };

function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

function projectVideoRectToStage({ stageWidth, stageHeight, videoWidth, videoHeight, roi }) {
  const scale = Math.max(stageWidth / videoWidth, stageHeight / videoHeight);
  const rw = videoWidth * scale, rh = videoHeight * scale;
  const ox = (stageWidth - rw) / 2, oy = (stageHeight - rh) / 2;
  return {
    left:   ox + roi.x * rw,
    top:    oy + roi.y * rh,
    width:  roi.w * rw,
    height: roi.h * rh,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Magic UI — Aurora Text (inlined)
   ───────────────────────────────────────────────────────────────────── */
function AuroraText({ children }) {
  return <span className={styles.auroraText}>{children}</span>;
}

/* ─────────────────────────────────────────────────────────────────────
   Magic UI — Shimmer Button (inlined)
   The outer <Link> is the spinning conic-gradient border ring.
   The inner <span> is the dark fill revealing only the border.
   ───────────────────────────────────────────────────────────────────── */
function ShimmerButton({ children, href }) {
  return (
    <Link href={href} className={styles.shimmerBtn}>
      <span className={styles.shimmerBtnInner}>{children}</span>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Shared copy block — rendered once inside hero (desktop) and once
   below hero (mobile). CSS toggles which is visible.
   ───────────────────────────────────────────────────────────────────── */
function CopyBlock({ extraClass = '' }) {
  return (
    <div className={`${styles.copy} ${extraClass}`}>

      <p className={styles.badge}>ساعتك العربية الذكية</p>

      <h1 className={styles.title}>
        <AuroraText>ميقات</AuroraText>
        <span className={styles.titleSub}>وقتك في كلّ مكان</span>
      </h1>

      <p className={styles.desc}>
        لحظة دقيقة، في أي مدينة، في أي بلد — الوقت المباشر،
        التاريخ الهجري والميلادي، فروق التوقيت وأوقات الصلاة.
        كلّ ما يحتاجه يومك، في تجربة عربية لا مثيل لها.
      </p>

      <ShimmerButton href="/time-now">
        <span>استكشف الوقت حول العالم</span>
        <ArrowLeft size={15} className={styles.btnArrow} aria-hidden="true" />
      </ShimmerButton>

    </div>
  );
}

function BottomMeta() {
  const items = [
    'الوقت الآن', 'فرق التوقيت', 'العد التنازلي',
    'التاريخ الهجري', 'التحويل بين المناطق', 'مواقيت الصلاة',
  ];
  return (
    <div className={styles.bottomMeta}>
      <span className={styles.bottomLabel}>كل أدوات الوقت في مكان واحد:</span>
      <div className={styles.bottomItems}>
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

export default function TimeCinematicHero({
  ianaTimezone,
  cityNameAr,
  countryNameAr,
  countryCode,
}) {
  const heroRef  = useRef(null);
  const videoRef = useRef(null);
  const rafRef   = useRef(0);
  const roRef    = useRef(null);
  const [panelBox, setPanelBox] = useState(null);

  const updatePanelPlacement = useCallback(() => {
    const hero  = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video || !video.videoWidth || !video.videoHeight) return;

    const { width: sw, height: sh } = hero.getBoundingClientRect();
    const p = projectVideoRectToStage({
      stageWidth: sw, stageHeight: sh,
      videoWidth: video.videoWidth, videoHeight: video.videoHeight,
      roi: VIDEO_ROI,
    });
    const si = sw <= 640 ? 8 : sw <= 980 ? 12 : 16;
    const left  = clamp(p.left,           si, sw - si);
    const right = clamp(p.left + p.width, si, sw - si);
    const top    = clamp(p.top,            si, sh - si);
    const bottom = clamp(p.top + p.height, si, sh - si);
    setPanelBox({ left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) });
  }, []);

  useEffect(() => {
    const hero = heroRef.current, video = videoRef.current;
    if (!hero || !video) return;
    const schedule = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePanelPlacement);
    };
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('loadeddata', schedule);
    roRef.current = new ResizeObserver(schedule);
    roRef.current.observe(hero);
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener('loadedmetadata', schedule);
      video.removeEventListener('loadeddata', schedule);
      roRef.current?.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [updatePanelPlacement]);

  const panelStyle = useMemo(() =>
    !panelBox ? undefined : ({
      '--panel-left':   `${panelBox.left}px`,
      '--panel-top':    `${panelBox.top}px`,
      '--panel-width':  `${panelBox.width}px`,
      '--panel-height': `${panelBox.height}px`,
    }),
  [panelBox]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — video + clock panel + desktop copy
          ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className={styles.hero} dir="rtl">

        {/* Full-bleed video */}
        <div className={styles.videoLayer} aria-hidden="true">
          <video
            ref={videoRef}
            className={styles.video}
            autoPlay loop muted playsInline preload="auto"
          >
            <source
              src="https://huly.io/videos/pages/home/hero/hero.webm?updated=20240607144404"
              type="video/webm"
            />
          </video>
        </div>

        {/* Clock panel — absolutely placed by JS */}
        <div
          className={`${styles.stagePanel} ${panelBox ? styles.stagePanelVisible : ''}`}
          style={panelStyle}
          aria-hidden={!panelBox}
        >
          <div className={styles.heroCardWrap}>
            <HeroEmbeddedClock
              ianaTimezone={ianaTimezone}
              cityNameAr={cityNameAr}
              countryNameAr={countryNameAr}
            />
          </div>
        </div>

        {/* Desktop + Tablet copy (hidden on mobile) */}
        <div className={styles.heroDesktopContent}>
          <div className="container">
            <div className={styles.shell}>
              <CopyBlock />
              <div className={styles.stageSpacer} aria-hidden="true" />
            </div>
            <BottomMeta />
          </div>
        </div>

        <div className={styles.bottomFade} aria-hidden="true" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          MOBILE SECTION — copy flows naturally below the hero.
          Hidden on desktop/tablet via CSS.
          ═══════════════════════════════════════════════════════ */}
      <section className={styles.heroMobileContent} dir="rtl">
        <div className="container">
          <CopyBlock extraClass={styles.copyMobileCenter} />
          <BottomMeta />
        </div>
      </section>
    </>
  );
}