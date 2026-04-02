// Footer.jsx
import Link from "next/link";
import { Clock } from "lucide-react";
import { SectionDivider } from "@/components/shared/primitives";
import { Globe } from "@/components/ui/globe";

const PRODUCT_LINKS = [
  { href: '/time-now', label: 'الوقت الآن' },
  { href: '/mwaqit-al-salat', label: 'مواقيت الصلاة' },
  { href: '/time-difference', label: 'فرق التوقيت' },
  { href: '/holidays', label: 'المناسبات' },
  { href: '/date', label: 'التاريخ والتحويل' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'من نحن' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/contact', label: 'اتصل بنا' },
];

const Footer = () => {
  return (
        <footer
  style={{
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-subtle)',
    borderTop: '1px solid var(--border-subtle)',
  }}
>
  <SectionDivider />

  {/* ── Top accent glow line ── */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70%',
    maxWidth: '700px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, var(--accent-alt) 50%, transparent 100%)',
    opacity: 0.35,
    pointerEvents: 'none',
  }} />

  {/* ── Main content ── */}
  <div style={{
    maxWidth: '1320px',
    margin: '0 auto',
    padding: 'var(--space-16) var(--space-6) 0',
    position: 'relative',
    zIndex: 1,
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-10)',
    }}
      className="footer-inner"
    >

      {/* ── Brand block ── */}
      <div style={{ textAlign: 'right' }}>
        {/* Logo row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2-5)',
          marginBottom: 'var(--space-4)',
        }}>
          
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-accent)',
            flexShrink: 0,
          }}>
            <Clock size={20} color="white" />
          </div>
          <span style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
          }}>
            ميقات
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          lineHeight: 'var(--leading-relaxed)',
          maxWidth: '300px',
          marginRight: 0,
          marginLeft: 'auto',
        }}>
          أدوات عربية دقيقة لحساب المواقيت والتقويمات والمناسبات الإسلامية.
        </p>

        {/* Badge pill */}
        <div style={{
          marginTop: 'var(--space-5)',
          display: 'flex',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-1-5)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--accent-alt)',
            backgroundColor: 'var(--accent-soft)',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-1-5) var(--space-3)',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '9999px',
              backgroundColor: 'var(--success)',
              flexShrink: 0,
            }} />
            متاح مجاناً
          </span>
        </div>
      </div>

      {/* ── Links block ── */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-14)',
        justifyContent: 'flex-end',
      }}>

        {/* Column 1 */}
        <div style={{ textAlign: 'right' }}>
          <h3 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            روابط مهمة
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {COMPANY_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2 */}
        <div style={{ textAlign: 'right' }}>
          <h3 style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            الصفحات الرئيسية
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {PRODUCT_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  </div>


  {/* ── Globe — always perfectly centered, top half only ── */}
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


  {/* ── Responsive styles ── */}
  <style>{`
  .footer-inner {
    flex-direction: column;
    align-items: stretch;
  }
  @media (min-width: 768px) {
    .footer-inner {
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
    }
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
