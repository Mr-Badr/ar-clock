// Footer.jsx
import Link from "next/link";
import { Clock } from "lucide-react";

import { SITE_BRAND, SITE_CONTACT_EMAIL } from "@/lib/site-config";
import "./footer.css";

const PRODUCT_LINKS = [
  { href: '/fahras', label: 'استكشف الصفحات' },
  { href: '/blog', label: 'المدونة' },
  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
  { href: '/time-now', label: 'الوقت الان' },
  { href: '/time-difference', label: 'فرق التوقيت' },
  { href: '/calculators', label: 'الحاسبات' },
  { href: '/holidays', label: 'المناسبات' },
  { href: '/date', label: 'التاريخ والتحويل' },
];

const CALCULATOR_LINKS = [
  { href: '/calculators/personal-finance', label: 'حاسبات التخطيط المالي الشخصي' },
  { href: '/calculators/sleep', label: 'حاسبات النوم الذكي' },
  { href: '/calculators/age/calculator', label: 'كم عمري الآن؟ حاسبة العمر' },
  { href: '/calculators/monthly-installment', label: 'حاسبة القسط الشهري والقرض' },
  { href: '/calculators/vat', label: 'حاسبة الضريبة 15% والسعر شامل الضريبة' },
  { href: '/calculators/percentage', label: 'حاسبة النسبة المئوية والخصم' },
  { href: '/calculators/building', label: 'حاسبات البناء والتشطيب' },
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

const START_LINKS = [
  {
    href: '/fahras',
    title: 'أريد الوصول بسرعة',
    description: 'صفحة واحدة تجمع أهم الأدوات والمسارات.',
  },
  {
    href: '/calculators',
    title: 'أريد حساب نتيجة',
    description: 'اختر القسط أو الضريبة أو العمر أو النوم من السؤال نفسه.',
  },
  {
    href: '/blog',
    title: 'أريد فهماً قبل القرار',
    description: 'مقالات عملية تشرح متى تستخدم الأداة وماذا تعني النتيجة.',
  },
];

const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-start">
          <div className="footer-start-copy">
            <p className="footer-start-kicker">ما الذي تريد معرفته الآن؟</p>
            <h2 className="footer-start-title">اعرف الوقت، حوّل التاريخ، احسب النتيجة، أو افتح الصفحة المناسبة من مسار واضح.</h2>
          </div>
          <div className="footer-start-links" aria-label="مسارات بداية سريعة">
            {START_LINKS.map(({ href, title, description }) => (
              <Link key={href} href={href} className="footer-start-link">
                <span>{title}</span>
                <small>{description}</small>
              </Link>
            ))}
          </div>
        </div>

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
