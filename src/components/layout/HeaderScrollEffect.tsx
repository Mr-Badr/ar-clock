"use client";

import { useEffect } from "react";

export default function HeaderScrollEffect() {
  useEffect(() => {
    const header = document.getElementById("main-header");
    if (!header) return;

    const onScroll = () =>
      header.classList.toggle("scrolled", window.scrollY > 8);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null; // purely behavioral, no markup
}