"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "@phosphor-icons/react";
import styles from "./ScrollToTopButton.module.css";

const SHOW_AFTER_PX = 560;

// Owner, 2026-08-27: "a line that increase based on position of the user inside the page, just
// like a border around the button" — a scroll-progress ring. Read/written as a CSS custom
// property (`--progress`, 0–100) on the button itself; the ring is pure CSS (conic-gradient +
// a radial-gradient mask cut to a thin ring, see ScrollToTopButton.module.css) driven by that
// one variable — no SVG, no stroke-dasharray/dashoffset animation. That's a deliberate choice,
// not an arbitrary one: this session already hit a real, confirmed case (the hero wordmark)
// where animating an SVG stroke was CPU-bound and read as janky, while plain CSS custom-property
// + conic-gradient updates are cheap paints, not per-frame geometry recomputation, and this is
// updated on genuine scroll events (rAF-throttled below), not a continuous decorative loop.
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const update = () => {
      tickingRef.current = false;
      const scrollY = window.scrollY;
      setIsVisible(scrollY > SHOW_AFTER_PX);

      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${isVisible ? styles.buttonVisible : ""}`}
      style={{ "--progress": progress } as React.CSSProperties}
      onClick={handleScrollToTop}
      aria-label="العودة إلى أعلى الصفحة"
    >
      <ArrowUp size={19} weight="bold" aria-hidden="true" />
    </button>
  );
}
