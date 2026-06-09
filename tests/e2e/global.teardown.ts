import { PrismaClient } from '@prisma/client'

export default async function globalTeardown() {
  const prisma = new PrismaClient()
  try {
    await prisma.campaign.deleteMany({
      where: { name: { startsWith: '[E2E]' } },
    })
  } finally {
    await prisma.$disconnect()
  }
}
