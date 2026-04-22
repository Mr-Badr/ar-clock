import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

const envCandidates = [
  process.env.PRISMA_ENV_FILE,
  '.env',
  '.env.local',
  '.env.staging',
  '.env.production',
].filter((value): value is string => Boolean(value))

for (const candidate of envCandidates) {
  const path = resolve(process.cwd(), candidate)

  if (!existsSync(path)) continue

  loadEnv({
    path,
    override: false,
    quiet: true,
  })
}

const datasourceUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  ...(datasourceUrl
    ? {
        datasource: {
          url: datasourceUrl,
        },
      }
    : {}),
})
