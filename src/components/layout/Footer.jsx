// Footer.jsx
import Link from "next/link";
import { Clock } from "lucide-react";

import { SITE_BRAND, SITE_CONTACT_EMAIL } from "@/lib/site-config";
import "./footer.css";

const PRODUCT_LINKS = [
  { href: '/fahras', label: 'استكشف الصفحات' },
  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
  { href: '/time-now', label: 'الوقت الان' },
  { href: '/time-difference', label: 'فرق التوقيت' },
  { href: '/tools', label: 'الحاسبات' },
  { href: '/holidays', label: 'المناسبات' },
  { href: '/countdown', label: 'عداد تنازلي' },
  { href: '/date', label: 'التاريخ والتحويل' },
];

const CALCULATOR_LINKS = [
  { href: '/tools/personal-finance', label: 'حاسبات التخطيط المالي الشخصي' },
  { href: '/tools/sleep', label: 'حاسبات النوم الذكي' },
  { href: '/tools/health/age-calculator', label: 'كم عمري الآن؟ حاسبة العمر' },
  { href: '/tools/gulf-finance/end-of-service-benefits', label: 'حاسبة مكافأة نهاية الخدمة السعودية' },
  { href: '/tools/gulf-finance/article-77-compensation', label: 'حاسبة تعويض المادة 77' },
  { href: '/tools/gulf-finance/traffic-fine-discount', label: 'حاسبة خصم المخالفات المرورية' },
  { href: '/tools/construction/build-cost', label: 'حاسبات البناء والتشطيب' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'من نحن' },
  { href: '/editorial-policy', label: 'السياسة التحريرية' },
  { href: '/terms', label: 'شروط الاستخدام' },
  { href: '/disclaimer', label: 'إخلاء المسؤولية' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/contact', label: 'اتصل بنا' },
];

const COPYRIGHT_YEAR = 2026;

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-container" data-nosnippet>
        <div className="footer-main">
          <div className="footer-brand">
            <Link href="/" className="footer-brand-logo" aria-label={`${SITE_BRAND} - الصفحة الرئيسية`}>
              <div className="footer-brand-icon">
                <Clock size={20} aria-hidden="true" />
              </div>
              <span className="footer-brand-name">{SITE_BRAND}</span>
            </Link>

            <p className="footer-brand-desc">
              ابدأ من السؤال الأقرب لك: متى الموعد؟ كم النتيجة؟ ما التاريخ؟ ثم انتقل إلى الصفحة التي تعطيك جواباً عملياً وواضحاً.
            </p>

            <p className="footer-brand-contact">
              للتواصل: <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr">{SITE_CONTACT_EMAIL}</a>
            </p>
          </div>

          <nav className="footer-links-grid" aria-label="مسارات التذييل">
            <div className="footer-col">
              <h3 className="footer-col-heading">مسارات مهمة</h3>
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
              <h3 className="footer-col-heading">أشهر الحاسبات</h3>
              <ul className="footer-col-list">
                {CALCULATOR_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer-col-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {COPYRIGHT_YEAR} {SITE_BRAND}. أدوات ومحتوى عربي لخدمة القرار اليومي.</p>
          <div className="footer-bottom-links" aria-label="مسارات الثقة">
            <Link href="/editorial-policy">كيف نكتب المحتوى</Link>
            <Link href="/privacy">الخصوصية</Link>
            <Link href="/contact">التواصل</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
