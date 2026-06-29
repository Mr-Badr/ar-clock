import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

/**
 * Author registry — each entry becomes a Person schema entity
 * sameAs: add real social/profile URLs when available
 * photo: place author photos in /public/images/authors/<id>.jpg
 */
export const AUTHORS = {
  badr: {
    id: 'badr',
    name: 'بدر الدين الهرشالي',
    nameEn: 'Badr Eddine El Harchali',
    role: 'مؤسس ميقاتنا',
    roleEn: 'Founder, Miqatona',
    credentials: 'متخصص في تطوير أدوات الويب العربية وتقنيات المعلومات',
    bio: 'أسس ميقاتنا عام 2024 بهدف تقديم مرجع عربي موثوق للوقت ومواقيت الصلاة والتقويمات والحسابات اليومية لجمهور الوطن العربي. يُشرف على المحتوى والأدوات والمنهجية الحسابية ويُراجع مصادر البيانات الرسمية لضمان دقة ما يُنشر على الموقع. خلفيته في تطوير البرمجيات وأنظمة المعلومات تُمكّنه من بناء أدوات تقنية دقيقة ومراجعة الحسابات مقارنةً بالمراجع الأكاديمية والرسمية في كل تخصص.',
    photo: '/images/authors/badr.jpg',
    covers: ['finance', 'time', 'prayer', 'date', 'holidays', 'health', 'calculators'],
    url: `${SITE_URL}/author/badr`,
    sameAs: [
      // Add your real social profile URLs here:
      // 'https://www.linkedin.com/in/your-profile',
      // 'https://x.com/your-handle',
    ],
    email: 'contact@miqatona.com',
    publishedAt: '2024-01-01',
  },
};

export const DEFAULT_AUTHOR_ID = 'badr';

export function getAuthor(id) {
  return AUTHORS[id] || AUTHORS[DEFAULT_AUTHOR_ID];
}

export function getDefaultAuthor() {
  return AUTHORS[DEFAULT_AUTHOR_ID];
}

/**
 * Build a schema.org Person object for JSON-LD
 */
export function buildPersonSchema(authorId) {
  const author = getAuthor(authorId);
  return {
    '@type': 'Person',
    '@id': author.url,
    name: author.name,
    alternateName: author.nameEn,
    jobTitle: author.role,
    description: author.credentials,
    url: author.url,
    email: author.email,
    image: author.photo
      ? { '@type': 'ImageObject', url: `${SITE_URL}${author.photo}` }
      : undefined,
    ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
    knowsAbout: author.covers,
    worksFor: {
      '@type': 'Organization',
      name: 'ميقاتنا',
      url: SITE_URL,
    },
  };
}
