// Footer.jsx
// Third pass, 2026-08-20 — owner shared exact light/dark reference screenshots of withone.ai's
// footer and said "rebuild... to be like this in both themes." That reference has no big CTA
// headline/stat band — just a compact brand blurb, real link columns, and a copyright bar, all
// floating on one continuous footer.jpg panel that stays legible by flipping between a light
// airy scrim + dark text (light mode) and a dark moody scrim + white text (dark mode). See
// footer.css's file header for the exact color pairs. The earlier big "سؤال واحد" CTA band is
// gone — the shimmering <ToolsNavButton> in the header now carries that "blow-minded CTA to
// /tools" job instead, so the footer doesn't need to repeat it.
import Image from "next/image";
import Link from "next/link";

import { SITE_BRAND, SITE_CONTACT_EMAIL } from "@/lib/site-config";
import "./footer.css";

const LINK_GROUPS = [
  {
    heading: 'الأدوات والصفحات',
    links: [
      { href: '/tools', label: 'الأدوات والحاسبات' },
      { href: '/time-now', label: 'الوقت الان' },
      { href: '/time-difference', label: 'فرق التوقيت' },
      { href: '/date', label: 'التاريخ والتحويل' },
      { href: '/holidays', label: 'المناسبات' },
      { href: '/countdown', label: 'عداد تنازلي' },
    ],
  },
  {
    heading: 'الشركة',
    links: [
      { href: '/about', label: 'من نحن' },
      { href: '/editorial-policy', label: 'السياسة التحريرية' },
      { href: '/contact', label: 'اتصل بنا' },
    ],
  },
  {
    heading: 'قانوني',
    links: [
      { href: '/terms', label: 'شروط الاستخدام' },
      { href: '/privacy', label: 'سياسة الخصوصية' },
      { href: '/disclaimer', label: 'إخلاء المسؤولية' },
    ],
  },
];

const COPYRIGHT_YEAR = 2026;

const Footer = () => {
  return (
    <footer className="footer-root">
      <Image
        src="/img/footer.jpg"
        alt=""
        fill
        sizes="100vw"
        className="footer-bg-img"
        aria-hidden="true"
      />
      <div className="footer-bg-scrim" aria-hidden="true" />

      <div className="footer-container" data-nosnippet>
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-brand-logo" aria-label={`${SITE_BRAND} - الصفحة الرئيسية`}>
              <img
                src="/img/logo.svg"
                alt=""
                className="footer-brand-icon"
                width={36}
                height={36}
                aria-hidden="true"
              />
              <span className="footer-brand-name">{SITE_BRAND}</span>
            </Link>

            <p className="footer-brand-desc">
              أدوات وحاسبات عربية، ومواعيد المناسبات — بلا تسجيل، وبتجربة بسيطة وسريعة.
            </p>

          <p className="footer-brand-cta">
            <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr">{SITE_CONTACT_EMAIL}</a>
          </p>
          </div>

          <nav className="footer-links-grid" aria-label="مسارات التذييل">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading} className="footer-col">
                <h3 className="footer-col-heading">{group.heading}</h3>
                <ul className="footer-col-list">
                  {group.links.map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="footer-col-link">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {COPYRIGHT_YEAR} {SITE_BRAND}. أدوات ومحتوى عربي لخدمة القرار اليومي.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
