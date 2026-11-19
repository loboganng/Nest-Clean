import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { DomainEvents } from '@/core/events/domain-events'

config({ path: '.env', quiet: true })
config({ path: '.env.test', override: true, quiet: true })

if (!process.env.DATABASE_URL) {
  throw new Error('Please provide a DATABASE_URL environment variable.')
}

/**
 * Every e2e test file gets its own Postgres schema (a random UUID), so test
 * files never see each other's data and can run in parallel.
 */
const schemaId = randomUUID()

function generateUniqueDatabaseURL(schema: string) {
  const url = new URL(process.env.DATABASE_URL as string)
  url.searchParams.set('schema', schema)
  return url.toString()
}

const databaseURL = generateUniqueDatabaseURL(schemaId)

// Must be set before the AppModule is imported, because ConfigModule reads
// process.env when the module is evaluated.
process.env.DATABASE_URL = databaseURL

DomainEvents.clearHandlers()
DomainEvents.clearMarkedAggregates()

beforeAll(() => {
  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: databaseURL },
    stdio: 'ignore',
  })
})

afterAll(async () => {
  const prisma = new PrismaClient({ datasourceUrl: databaseURL })
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
})
