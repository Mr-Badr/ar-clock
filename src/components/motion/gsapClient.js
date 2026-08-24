// motion/gsapClient.js
// Single place that imports gsap + ScrollTrigger and registers the plugin once. Every motion
// component in src/components/motion and src/components/home/v2 imports gsap FROM HERE, never
// directly from "gsap" — keeps the registerPlugin call from running more than once and gives us
// one place to swap/extend plugins later.
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
