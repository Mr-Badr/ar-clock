import { z } from 'zod';

const emptyToUndefined = (schema) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }, schema);

const siteEnvShape = {
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: emptyToUndefined(z.string().url().optional()),
  NEXT_PUBLIC_BASE_URL: emptyToUndefined(z.string().url().optional()),
  VERCEL_PROJECT_PRODUCTION_URL: emptyToUndefined(z.string().min(1).optional()),
  VERCEL_URL: emptyToUndefined(z.string().min(1).optional()),
};

const siteSchema = z.object(siteEnvShape);

const metadataSchema = z.object({
  GOOGLE_SITE_VERIFICATION: emptyToUndefined(z.string().min(6).optional()),
});

const runtimeSchema = z
  .object({
    ...siteEnvShape,
    GOOGLE_SITE_VERIFICATION: emptyToUndefined(z.string().min(6).optional()),
    REVALIDATE_SECRET: emptyToUndefined(z.string().min(12).optional()),
    SUPABASE_URL: emptyToUndefined(z.string().url().optional()),
    SUPABASE_ANON_KEY: emptyToUndefined(z.string().min(20).optional()),
    SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(z.string().min(20).optional()),
    NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(z.string().url().optional()),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: emptyToUndefined(z.string().min(20).optional()),
    DATABASE_URL: emptyToUndefined(z.string().min(1).optional()),
    ENABLE_LIVE_GEO_DB: z.enum(['true', 'false']).optional(),
    LIVE_GEO_PROVIDER: emptyToUndefined(z.enum(['supabase', 'postgres']).optional()),
  })
  .superRefine((value, ctx) => {
    const liveGeoUsesPostgres =
      value.ENABLE_LIVE_GEO_DB === 'true' &&
      value.LIVE_GEO_PROVIDER === 'postgres';

    if (value.NODE_ENV === 'production' && !value.REVALIDATE_SECRET) {
      ctx.addIssue({
        code: 'custom',
        message: 'REVALIDATE_SECRET is required in production',
        path: ['REVALIDATE_SECRET'],
      });
    }

    if (value.NODE_ENV === 'production' && liveGeoUsesPostgres && !value.DATABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        message: 'DATABASE_URL is required when LIVE_GEO_PROVIDER=postgres',
        path: ['DATABASE_URL'],
      });
    }

    if (value.NODE_ENV === 'production' && !liveGeoUsesPostgres && !value.SUPABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        message: 'SUPABASE_URL is required in production',
        path: ['SUPABASE_URL'],
      });
    }

    if (value.NODE_ENV === 'production' && !liveGeoUsesPostgres && !value.SUPABASE_ANON_KEY) {
      ctx.addIssue({
        code: 'custom',
        message: 'SUPABASE_ANON_KEY is required in production',
        path: ['SUPABASE_ANON_KEY'],
      });
    }
  });

function formatIssues(issues) {
  return issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
}

function parseEnv(schema, label) {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`[env] Invalid ${label} environment configuration: ${formatIssues(parsed.error.issues)}`);
  }
  return parsed.data;
}

let _siteEnv = null;
let _metadataEnv = null;
let _runtimeEnv = null;

export function getSiteEnv() {
  if (_siteEnv) return _siteEnv;
  _siteEnv = parseEnv(siteSchema, 'site');
  return _siteEnv;
}

export function getMetadataEnv() {
  if (_metadataEnv) return _metadataEnv;
  _metadataEnv = parseEnv(metadataSchema, 'metadata');
  return _metadataEnv;
}

export function getEnv() {
  if (_runtimeEnv) return _runtimeEnv;
  _runtimeEnv = parseEnv(runtimeSchema, 'runtime');
  return _runtimeEnv;
}
