'use client';

// HeroVideoPanel.jsx — Client Component
// Owns: video ref, panel placement state, ResizeObserver, clock panel.
// Receives static desktop copy as `children` from the server parent —
// those children stay server-rendered across the RSC boundary.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export default function HeroVideoPanel({
  ianaTimezone,
  cityNameAr,
  countryNameAr,
  children, // ← desktop CopyBlock, server-rendered
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
    const hero  = heroRef.current;
    const video = videoRef.current;
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
    <section ref={heroRef} className={styles.hero} dir="rtl">

      {/* Full-bleed video */}
      <div className={styles.videoLayer} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4"  type="video/mp4"  />
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

      {/* Desktop + Tablet copy — server-rendered children from parent */}
      <div className={styles.heroDesktopContent}>
        <div className="container">
          <div className={styles.shell}>
            {children}
            <div className={styles.stageSpacer} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}