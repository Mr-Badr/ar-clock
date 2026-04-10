// Footer.jsx
import Link from "next/link";
import { Clock } from "lucide-react";
import { SectionDivider } from "@/components/shared/primitives";
import { Globe } from "@/components/ui/globe";
import { POPULAR_PAIRS } from "@/components/time-diff/data/popularPairs";
import { buildTimeDifferenceHref } from "@/lib/time-difference-links";
import {
  FEATURED_COUNTDOWN_LINKS,
  getPopularTimeNowCityLinks,
} from "@/lib/seo/popular-links";
import { SITE_BRAND, SITE_CONTACT_EMAIL } from "@/lib/site-config";

const PRODUCT_LINKS = [
  { href: '/time-now', label: 'الوقت الآن' },
  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
  { href: '/time-difference', label: 'فرق التوقيت' },
  { href: '/holidays', label: 'المناسبات' },
  { href: '/date', label: 'التاريخ والتحويل' },
];

const ECONOMY_LINKS = [
  { href: '/economie', label: 'الاقتصاد الحي' },
  { href: '/economie/us-market-open', label: 'متى يفتح السوق الأمريكي؟' },
  { href: '/economie/gold-market-hours', label: 'هل الذهب مفتوح الآن؟' },
  { href: '/economie/stock-markets', label: 'البورصات العالمية الآن' },
  { href: '/economie/forex-sessions', label: 'جلسات الفوركس الآن' },
  { href: '/economie/market-clock', label: 'ساعة التداول' },
  { href: '/economie/best-trading-time', label: 'أفضل وقت للتداول' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'من نحن' },
  { href: '/editorial-policy', label: 'السياسة التحريرية' },
  { href: '/terms', label: 'شروط الاستخدام' },
  { href: '/disclaimer', label: 'إخلاء المسؤولية' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/contact', label: 'اتصل بنا' },
];

const FOOTER_TIME_DIFFERENCE_LINKS = POPULAR_PAIRS.slice(0, 6).map((pair) => ({
  href: buildTimeDifferenceHref(pair.from.slug, pair.to.slug),
  label: `فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}`,
}));
const FOOTER_COUNTDOWN_LINKS = FEATURED_COUNTDOWN_LINKS.slice(0, 6);

const Footer = async () => {
  const footerTimeNowLinks = await getPopularTimeNowCityLinks(6);

  return (
    <footer className="footer-root">
      <SectionDivider />

      {/* ── Top accent glow line ── */}
      <div className="footer-glow-line" />

      {/* ── Main content ── */}
      <div className="footer-container">

        {/* ── Brand + Links row ── */}
        <div className="footer-main">

          {/* ── Brand block ── */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <div className="footer-brand-icon">
                <Clock size={20} color="white" />
              </div>
              <span className="footer-brand-name">{SITE_BRAND}</span>
            </div>

            <p className="footer-brand-desc">
              {SITE_BRAND} منصة عربية مستقلة، بُنيت على فكرة واحدة — المستخدم العربي يستحق أدوات صُنعت له، لا تُرجمت إليه. سريعة، دقيقة، وتستحق ثقتك.
            </p>

            <div className="footer-brand-badge-wrap">
              <span className="footer-brand-badge">
                <span className="footer-brand-dot" />
                متاح مجاناً
              </span>
            </div>

            <p className="footer-brand-contact">
              للتواصل: <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
            </p>
          </div>

          {/* ── Links grid — all 5 columns flat ── */}
          <nav className="footer-links-grid" aria-label="روابط التذييل">

            <div className="footer-col">
              <h3 className="footer-col-heading">روابط مهمة</h3>
              <ul className="footer-col-list">
                {COMPANY_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">الصفحات الرئيسية</h3>
              <ul className="footer-col-list">
                {PRODUCT_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">أدوات الاقتصاد</h3>
              <ul className="footer-col-list">
                {ECONOMY_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">الوقت الآن في المدن</h3>
              <ul className="footer-col-list">
                {footerTimeNowLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">أشهر فروق التوقيت</h3>
              <ul className="footer-col-list">
                {FOOTER_TIME_DIFFERENCE_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">أشهر العدادات</h3>
              <ul className="footer-col-list">
                {FOOTER_COUNTDOWN_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

          </nav>
        </div>
        {/* ── end footer-main ── */}

      </div>

      {/* ── Globe ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(260px, 32vw, 400px)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(500px, 60vw, 780px)',
            height: 'clamp(500px, 60vw, 780px)',
            flexShrink: 0,
          }}
        >
          <Globe style={{ width: '100%', height: '100%' }} />
        </div>
      </div>

      {/* ── Styles ── */}
      <style>{`

        /* ─────────────────────────────────────────
           ROOT
        ───────────────────────────────────────── */
        .footer-root {
          position: relative;
          overflow: hidden;
          background-color: var(--bg-subtle);
          border-top: 1px solid var(--border-subtle);
        }

        /* ─────────────────────────────────────────
           GLOW LINE
        ───────────────────────────────────────── */
        .footer-glow-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          max-width: 700px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--accent-alt) 50%, transparent 100%);
          opacity: 0.35;
          pointer-events: none;
        }

        /* ─────────────────────────────────────────
           CONTAINER
        ───────────────────────────────────────── */
        .footer-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: var(--space-16) var(--space-6) 0;
          position: relative;
          z-index: 1;
        }

        /* ─────────────────────────────────────────
           MAIN ROW  (brand + links)

          Mobile (<640px):  column, centered
          Tablet (640-1023): column, centered
          Desktop (1024px+): single row — brand on
                             the right (RTL start),
                             links fill the rest
        ───────────────────────────────────────── */
        .footer-main {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: var(--space-10);
        }

        @media (min-width: 1024px) {
          .footer-main {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: var(--space-14);
          }
        }

        /* ─────────────────────────────────────────
           BRAND BLOCK
        ───────────────────────────────────────── */
        .footer-brand {
          flex-shrink: 0;
          width: 100%;
          text-align: right;
        }

        @media (min-width: 1024px) {
          .footer-brand {
            width: auto;
            max-width: 280px;
          }
        }

        .footer-brand-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2-5);
          margin-bottom: var(--space-4);
       justify-content: flex-start;
        }

        .footer-brand-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-accent);
          flex-shrink: 0;
        }

        .footer-brand-name {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .footer-brand-desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: var(--leading-relaxed);
          max-width: 300px;
          margin: 0 0 0 auto;
        }

        @media (min-width: 1024px) {
          .footer-brand-desc {
            margin: 0;
          }
        }

        .footer-brand-badge-wrap {
          margin-top: var(--space-5);
          display: flex;
       justify-content: flex-start;
        }

        .footer-brand-contact {
          margin-top: var(--space-4);
          font-size: var(--text-sm);
          color: var(--text-muted);
          line-height: var(--leading-relaxed);
        }

        .footer-brand-contact a {
          color: var(--accent-alt);
          text-decoration: none;
        }

        .footer-brand-contact a:hover {
          text-decoration: underline;
        }

        .footer-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1-5);
          font-size: var(--text-xs);
          font-weight: var(--font-medium);
          color: var(--accent-alt);
          background-color: var(--accent-soft);
          border: 1px solid var(--border-accent);
          border-radius: var(--radius-full);
          padding: var(--space-1-5) var(--space-3);
        }

        .footer-brand-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: var(--success);
          flex-shrink: 0;
        }

        /* ─────────────────────────────────────────
           LINKS GRID

          All 5 columns live in ONE flat CSS Grid.
          No nested rows, no display:contents tricks.

          Mobile  (<640px):  2 columns
          Tablet (640-1023): 3 columns
          Desktop (1024px+): 6 columns, all in one line
        ───────────────────────────────────────── */
        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-8) var(--space-6);
          width: 100%;
        }

        @media (min-width: 640px) {
          .footer-links-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-links-grid {
            /* Each column is sized to its content —
               no stretching, no overflow.            */
            grid-template-columns: repeat(6, auto);
            gap: var(--space-10);
            width: auto;
            flex: 1;             /* fill remaining space in the main row */
            justify-content: flex-start; /* columns hug their content */
          }
        }

        /* ─────────────────────────────────────────
           INDIVIDUAL COLUMN
        ───────────────────────────────────────── */
        .footer-col {
          text-align: right;
        }

        .footer-col-heading {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .footer-col-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col-link {
          font-size: var(--text-sm);
          color: var(--text-muted);
          transition: color var(--transition-fast);
          display: block;
        }

        .footer-col-link:hover {
          color: var(--text-primary);
        }

        footer canvas,
        footer .globe-container,
        footer [class*="globe"] {
          width: 100% !important;
          height: 100% !important;
        }

      `}</style>
    </footer>
  );
};

export default Footer;
