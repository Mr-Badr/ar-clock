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
    // Owner, 2026-08-27: "these names is bad, do better namings" — "الشركة" ("the company") is a
    // stiff, literal translation of a generic English footer label; this site isn't a company
    // portal, and none of these 3 links are corporate-identity content. "عن ميقاتنا" names it by
    // what it actually is (info about the site itself) and keeps the brand voice.
    heading: 'عن ميقاتنا',
    links: [
      { href: '/about', label: 'من نحن' },
      { href: '/editorial-policy', label: 'السياسة التحريرية' },
      { href: '/contact', label: 'اتصل بنا' },
    ],
  },
  {
    // "قانوني" ("legal") is the same problem — an awkward transliteration-flavored label that
    // Arabic footers don't actually use standalone. "السياسات" ("Policies") is the natural
    // Arabic term for exactly this group (terms/privacy/disclaimer).
    heading: 'السياسات',
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
        // Same `sizes="100vw"` full-bleed pattern as the hero, same fix (2026-08-27) — see
        // HeroV2.jsx's comment and next.config.js's deviceSizes/qualities for the root cause.
        quality={90}
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
                alt={SITE_BRAND}
                className="footer-brand-icon"
                width={72}
                height={72}
              />
            </Link>

            <h2 className="footer-brand-name">مـــيـــقــاتــنــا
</h2>

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
