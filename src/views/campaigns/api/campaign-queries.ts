'use server'

import { prismaAdmin, withRLS } from '@/shared/lib/prisma'
import { CampaignOwnership, CampaignVisibility } from '../model/campaign-types'

export async function getCampaigns(
  visibility: CampaignVisibility = 'public',
  ownership: CampaignOwnership = 'both',
  clerkId?: string
) {
  try {
    if (!clerkId || visibility === 'public') {
      return await prismaAdmin.campaign.findMany({
        where: { isPublic: true },
        include: { gameMaster: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }

    return await withRLS(clerkId, async (db) => {
      // Construimos el filtro de privadas según ownership
      const user = await db.user.findUniqueOrThrow({ where: { clerkId }, select: { id: true } })
      const userId = user.id

      const ownedWhere = { isPublic: false, gameMaster: { clerkId } }
      const memberWhere = {
        isPublic: false,
        gameMasterId: { not: userId },
        members: { some: { userId } },
      }

      const privateWhere =
        ownership === 'owned'
          ? ownedWhere
          : ownership === 'member'
            ? memberWhere
            : { OR: [ownedWhere, memberWhere] }

      const where = visibility === 'all' ? { OR: [{ isPublic: true }, privateWhere] } : privateWhere

      return db.campaign.findMany({
        where,
        include: { gameMaster: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      })
    })
  } catch (error) {
    console.error('❌ Error fetching campaigns de Prisma:', error)
    return []
  }
}

// ES: Obtiene una campaña por ID.
export async function getCampaignById(id: string, clerkId?: string) {
  try {
    if (!clerkId) {
      return await prismaAdmin.campaign.findFirst({
        where: { id, isPublic: true },
        include: { gameMaster: { select: { name: true } } },
      })
    }

    return await withRLS(clerkId, (db) =>
      db.campaign.findFirst({
        where: { id },
        include: { gameMaster: { select: { name: true } } },
      })
    )
  } catch (error) {
    console.error(`❌ Error en getCampaignById (${id}):`, error)
    return null
  }
}
