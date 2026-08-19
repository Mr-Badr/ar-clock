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
    bio: 'أسس ميقاتنا عام 2024 بهدف تقديم مرجع عربي موثوق للوقت والتقويمات والحسابات اليومية لجمهور الوطن العربي. يُشرف على المحتوى والأدوات والمنهجية الحسابية ويُراجع مصادر البيانات الرسمية لضمان دقة ما يُنشر على الموقع. خلفيته في تطوير البرمجيات وأنظمة المعلومات تُمكّنه من بناء أدوات تقنية دقيقة ومراجعة الحسابات مقارنةً بالمراجع الأكاديمية والرسمية في كل تخصص.',
    // Separate, shorter description for <meta name="description"> — the full `bio` above stays
    // on-page (word count matters there); metaDescription exists only to satisfy the 90-175 char
    // SEO range (found too long at 354 chars during the 2026-08-19 site-wide SEO audit).
    metaDescription:
      'بدر الدين الهرشالي، مؤسس ميقاتنا، أشرف على تأسيس الموقع كمرجع عربي موثوق للوقت والتقويمات والحسابات اليومية، ويراجع مصادر البيانات الرسمية لضمان دقة المحتوى.',
    // Was pointing at /images/authors/badr.jpg — file doesn't exist (confirmed 404 on production,
    // 2026-08-18), so the Person schema was citing a broken image URL in structured data. Cleared
    // until a real photo is supplied; buildPersonSchema() below already omits `image` entirely when
    // this is falsy, and the /author/[id] page already renders an initials avatar regardless.
    photo: null,
    covers: ['finance', 'time', 'date', 'holidays', 'health', 'calculators'],
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
