import { Zap, Globe2, Shield, Users, BookOpen, Star } from 'lucide-react'

/**
 * softBg: design-system -soft CSS var for transparent card backgrounds.
 * Using pre-defined vars instead of `${color}18` (which is invalid CSS —
 * you cannot append hex alpha to a CSS custom property name).
 *
 * @type {{ icon, title, body, color, softBg }[]}
 */
export const WHY_FEATURES = [
  {
    icon: Zap,
    title: 'دقة فلكية متناهية',
    body: 'تُحسب مواقيت الصلاة وفق معادلات فلكية دقيقة تراعي الارتفاع عن سطح البحر، الانكسار الضوئي، وتوقيت التحولات الفصلية.',
    color: 'var(--warning)',
    softBg: 'var(--warning-soft)',
  },
  {
    icon: Globe2,
    title: 'تغطية عالمية',
    body: 'يدعم الموقع أكثر من 3 ملايين مدينة وبلدة، شاملاً كل دولة عربية وإسلامية والمدن العالمية الكبرى.',
    color: 'var(--info)',
    softBg: 'var(--info-soft)',
  },
  {
    icon: Shield,
    title: 'بيانات موثوقة',
    body: 'مصادر التوقيت من قواعد بيانات IANA الزمنية وUTC الموثوقة دولياً، محدَّثة بشكل دوري مستمر.',
    color: 'var(--success)',
    softBg: 'var(--success-soft)',
  },
  {
    icon: Users,
    title: 'صُمِّم للعربي',
    body: 'واجهة عربية أصيلة بالكامل بدعم RTL، خط عربي احترافي، ومحتوى لغوي طبيعي — ليس ترجمةً آلية.',
    color: 'var(--accent-alt)',
    softBg: 'var(--accent-alt-soft)',
  },
  {
    icon: BookOpen,
    title: 'المذاهب الأربعة',
    body: 'الحنفي، المالكي، الشافعي، الحنبلي — اختر مذهبك لضبط أوقات الفجر والعشاء بدقة فقهية صحيحة.',
    color: 'var(--danger)',
    softBg: 'var(--danger-soft)',
  },
  {
    icon: Star,
    title: 'مجاني تماماً',
    body: 'جميع الأدوات مجانية وبلا تسجيل ولا إعلانات مزعجة: مواقيت الصلاة، فرق التوقيت، المناسبات، وساعة العالم.',
    color: 'var(--warning)',
    softBg: 'var(--warning-soft)',
  },
]
