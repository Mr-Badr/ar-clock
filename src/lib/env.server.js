import { z } from 'zod'

const emptyToUndefined = (schema) =>
  z.preprocess((value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    return trimmed === '' ? undefined : trimmed
  }, schema)

const optionalString = emptyToUndefined(z.string().optional())
const optionalBoolean = emptyToUndefined(z.enum(['true', 'false']).optional())

/* -------------------------------------------------------------------------- */
/* SITE ENV                                                                   */
/* -------------------------------------------------------------------------- */

const siteSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_SITE_URL: emptyToUndefined(z.string().url().optional()),
  NEXT_PUBLIC_BASE_URL: emptyToUndefined(z.string().url().optional()),
})

/* -------------------------------------------------------------------------- */
/* METADATA                                                                   */
/* -------------------------------------------------------------------------- */

const metadataSchema = z.object({
  GOOGLE_SITE_VERIFICATION: optionalString,
})

/* -------------------------------------------------------------------------- */
/* RUNTIME (POSTGRES ONLY)                                                   */
/* -------------------------------------------------------------------------- */

const runtimeSchema = z
  .object({
    ...siteSchema.shape,

    /* security */
    REVALIDATE_SECRET: optionalString,

    /* database (ONLY POSTGRES) */
    DATABASE_URL: optionalString,

    /* geo system (NO SUPABASE ANYMORE) */
    ENABLE_LIVE_GEO_DB: optionalBoolean,

    /* keep only postgres */
    LIVE_GEO_PROVIDER: z.literal('postgres').default('postgres'),

    /* optional infrastructure */
    IP_API_BASE_URL: emptyToUndefined(z.string().url().optional()),

    /* pdf */
    ENABLE_PDF_CALENDAR: optionalBoolean,
    PDF_BROWSER_MODE: emptyToUndefined(z.enum(['bundled', 'serverless']).optional()),

    /* analytics */
    ENABLE_ANALYTICS: optionalBoolean,
    GA_MEASUREMENT_ID: optionalString,
    GTM_ID: optionalString,
    ENABLE_CONSENT_BANNER: optionalBoolean,

    /* ads */
    ADSENSE_CLIENT_ID: optionalString,

    /* PWA */
    ENABLE_SW: optionalBoolean,
  })
  .superRefine((value, ctx) => {
    const isProd = value.NODE_ENV === 'production'

    if (isProd && !value.REVALIDATE_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['REVALIDATE_SECRET'],
        message: 'REVALIDATE_SECRET is required in production',
      })
    }

    if (value.ENABLE_LIVE_GEO_DB === 'true' && !value.DATABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL required when LIVE GEO is enabled',
      })
    }

    if (isProd && !value.DATABASE_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL required in production',
      })
    }
  })

/* -------------------------------------------------------------------------- */
/* INTERNAL HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function formatIssues(issues) {
  return issues.map((i) => `- ${i.path.join('.')}: ${i.message}`).join('\n')
}

function parseEnv(schema, label) {
  const parsed = schema.safeParse(process.env)

  if (!parsed.success) {
    throw new Error(
      `❌ Invalid ${label} environment:\n${formatIssues(parsed.error.issues)}`
    )
  }

  return parsed.data
}

/* -------------------------------------------------------------------------- */
/* CACHING                                                                    */
/* -------------------------------------------------------------------------- */

let siteEnv
let metadataEnv
let runtimeEnv

export function getSiteEnv() {
  if (siteEnv) return siteEnv
  siteEnv = parseEnv(siteSchema, 'site')
  return siteEnv
}

export function getMetadataEnv() {
  if (metadataEnv) return metadataEnv
  metadataEnv = parseEnv(metadataSchema, 'metadata')
  return metadataEnv
}

export function getEnv() {
  if (runtimeEnv) return runtimeEnv
  runtimeEnv = parseEnv(runtimeSchema, 'runtime')
  return runtimeEnv
}
