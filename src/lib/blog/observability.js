import { logger, serializeError } from '@/lib/logger';

export function buildBlogArticleFailureContext(input) {
  const slug = String(input?.slug || '').trim() || null;
  const routePath = slug ? `/blog/${slug}` : null;
  const section = String(input?.section || '').trim() || null;
  const degraded = Boolean(input?.degraded);
  const contentHealth = input?.contentHealth && typeof input.contentHealth === 'object'
    ? {
        degraded: Boolean(input.contentHealth.degraded),
        invalidSections: input.contentHealth.invalidSections || {},
        issueEntries: Array.isArray(input.contentHealth.issueEntries) ? input.contentHealth.issueEntries : [],
      }
    : null;
  const extraContext = input?.extraContext && typeof input.extraContext === 'object'
    ? input.extraContext
    : {};

  return {
    slug,
    routePath,
    section,
    degraded,
    contentHealth,
    error: serializeError(input?.error),
    ...extraContext,
  };
}

export function logBlogArticleFailure(message, input) {
  logger.warn(message, buildBlogArticleFailureContext(input));
}
