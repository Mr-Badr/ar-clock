// home/v2/sections/TimeOrbitSection.jsx
// Server Component — bespoke design #3. Restored 2026-08-23 to Magic UI's Globe (cobe/WebGL)
// after a brief detour through a CSS-only orbit: the globe repeatedly failed THIS session's own
// headless Puppeteer verification (flat black sphere, zero canvas, one WebGL-init crash), so it
// was swapped out — but the owner's real browser said plainly "the globe was better," and that's
// the actual environment that matters, not a sandboxed headless check. Back to the globe, with
// the exact same real city markers and the same perf-conscious lazy mount (GlobeLazyMount —
// IntersectionObserver-gated dynamic import, confirmed via direct timing test to matter: the
// globe's WebGL init was measurably delaying the hero's own NumberTicker start when unconditional).
//
// Copy rebuilt 2026-08-23 (owner: remove the city-name pill list, replace the single lead
// paragraph with two paragraphs on date tools/pages plus one on time-difference, and give both
// CTAs distinct colors instead of one InteractiveLink + one plain underlined link). CITIES stays
// — it still feeds the globe's own markers, just no longer rendered as a text list. The "الوقت
// الآن" CTA was dropped in favor of a "/date" button: the new copy is 2/3 about date tools, and
// the globe itself already carries the live "your time, anywhere" idea visually.
import GlobeLazyMount from './GlobeLazyMount.client';
import InteractiveLink from '../InteractiveLink';
import ScrollReveal from '@/components/motion/ScrollReveal.client';
import './time-orbit.css';

const CITIES = [
  { name: 'الرياض', lat: 24.7136, lng: 46.6753 },
  { name: 'دبي', lat: 25.2048, lng: 55.2708 },
  { name: 'الدوحة', lat: 25.2854, lng: 51.531 },
  { name: 'الكويت', lat: 29.3759, lng: 47.9774 },
  { name: 'القاهرة', lat: 30.0444, lng: 31.2357 },
  { name: 'لندن', lat: 51.5072, lng: -0.1276 },
];

// No `onRender` key here on purpose: this object crosses the Server → Client Component boundary
// as a prop (Globe is 'use client'), and React/Next.js rejects functions in that direction
// ("Event handlers cannot be passed to Client Component props") — confirmed via a real dev-server
// 500, not assumed. Harmless to omit: globe.tsx's own onRender always wins over whatever the
// config spread provides, since it's assigned after the spread in that component's own object
// literal — and that same onRender auto-rotates the globe every frame (phi += 0.005), so it's
// always in motion even without a drag interaction.
// Lighting values (dark/diffuse/baseColor/mapBrightness/glowColor) are globe.tsx's OWN proven
// default config, not invented.
const GLOBE_CONFIG = {
  width: 600,
  height: 600,
  devicePixelRatio: 2,
  phi: 0.6,
  theta: 0.28,
  dark: 0,
  diffuse: 0.4,
  // 16000 (the component's own default) is tuned for an 800px canvas; at this section's ~380px
  // display size that many samples cost real init time for no visible detail gain — 6000 is
  // still crisp here and meaningfully lighter on the main thread.
  mapSamples: 6000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0.13, 0.4, 0.8],
  glowColor: [1, 1, 1],
  markers: CITIES.map((c) => ({ location: [c.lat, c.lng], size: 0.08 })),
};

export default function TimeOrbitSection() {
  return (
    <section className="to-section" aria-labelledby="to-title">
      <ScrollReveal className="to-inner" itemSelector=":scope > *">
        <GlobeLazyMount config={GLOBE_CONFIG} className="to-globe-stage" />

        <div className="to-copy">
          <p className="to-kicker">أينما كنت</p>
          <h2 id="to-title" className="to-title">
            وقتك، فرق التوقيت، والتاريخ الهجري — من مكان واحد
          </h2>

          <p className="to-lead">
            نعرض عندك التقويم الهجري والميلادي جنبًا إلى جنب، مع محوّل فوري يحوّل أي تاريخ بينهما
            في ثانية واحدة — بلا حسابات يدوية ولا تقريب.
          </p>
          <p className="to-lead">
            ولكل يوم من أيام السنة صفحته الخاصة عندنا، فيها التاريخ الهجري المقابل والمناسبات
            المرتبطة به، بحيث تلقى إجابتك عن أي تاريخ تريده في ثوانٍ.
          </p>
          <p className="to-lead">
            أما فرق التوقيت بين المدن فمحسوب من التوقيت الرسمي الحقيقي لكل مدينة — لا تخمين ولا
            حساب يدوي. قارن بين أي مدينتين عربيتين أو عالميتين واعرف الفرق بالساعة والدقيقة في
            لحظة.
          </p>

          <div className="to-links">
            <InteractiveLink href="/date" accent="var(--green-text)">التاريخ والتحويل</InteractiveLink>
            <InteractiveLink href="/time-difference" accent="var(--accent-alt)">فرق التوقيت</InteractiveLink>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
