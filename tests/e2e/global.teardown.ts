import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import pg from 'pg'

export default async function globalTeardown() {
  const connectionString = process.env.DATABASE_URL_REMOTE || process.env.DATABASE_URL
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })
  try {
    await prisma.campaign.deleteMany({
      where: { name: { startsWith: '[E2E]' } },
    })
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}
