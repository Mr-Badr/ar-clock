import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1).optional(),
    VERCEL_URL: z.string().min(1).optional(),
    GOOGLE_SITE_VERIFICATION: z.string().min(6).optional(),
    REVALIDATE_SECRET: z.string().min(12).optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_ANON_KEY: z.string().min(20).optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  })
  .superRefine((value, ctx) => {
    const hasResolvableSiteUrl =
      value.NEXT_PUBLIC_SITE_URL ||
      value.NEXT_PUBLIC_BASE_URL ||
      value.VERCEL_PROJECT_PRODUCTION_URL ||
      value.VERCEL_URL;

    if (value.NODE_ENV === 'production' && !hasResolvableSiteUrl) {
      ctx.addIssue({
        code: 'custom',
        message: 'Set NEXT_PUBLIC_SITE_URL/NEXT_PUBLIC_BASE_URL or rely on Vercel system URL variables',
        path: ['NEXT_PUBLIC_SITE_URL'],
      });
    }

    if (value.NODE_ENV === 'production' && !value.REVALIDATE_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message: 'REVALIDATE_SECRET is required in production',
        path: ['REVALIDATE_SECRET'],
      });
    }

    if (value.NODE_ENV === 'production' && !value.SUPABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        message: 'SUPABASE_URL is required in production',
        path: ['SUPABASE_URL'],
      });
    }

    if (value.NODE_ENV === 'production' && !value.SUPABASE_ANON_KEY) {
      ctx.addIssue({
        code: 'custom',
        message: 'SUPABASE_ANON_KEY is required in production',
        path: ['SUPABASE_ANON_KEY'],
      });
    }
  });

let _cached = null;

export function getEnv() {
  if (_cached) return _cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`[env] Invalid environment configuration: ${details}`);
  }
  _cached = parsed.data;
  return _cached;
}
