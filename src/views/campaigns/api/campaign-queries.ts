'use server'

import { prisma } from '@/shared/lib/prisma'
import { Prisma } from '@prisma/client'
import { CampaignFilter } from '../model/campaign-types'

export async function getCampaigns(filter: CampaignFilter = 'all', clerkId?: string) {
  try {
    // Condiciones base del OR
    const conditions: Prisma.CampaignWhereInput[] =
      filter === 'all' || filter === 'public' ? [{ isPublic: true }] : [{ isPublic: false }]

    // Si el usuario está logueado y no pedimos "solo públicas", añadimos sus accesos
    if (clerkId && (filter === 'all' || filter === 'owned')) {
      conditions.push({ gameMaster: { clerkId } })
    }

    return await prisma.campaign.findMany({
      where: {
        // Si el filtro es 'owned', solo las del user
        OR: filter === 'owned' ? [{ gameMaster: { clerkId } }] : conditions,
      },
      include: {
        gameMaster: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('❌ Error fetching campaigns de Prisma:', error)
    return []
  }
}

/**
 * Obtiene una campaña por ID.
 */
export async function getCampaignById(id: string, clerkId?: string) {
  try {
    const orConditions: Prisma.CampaignWhereInput[] = [{ isPublic: true }]
    if (clerkId) {
      orConditions.push({ gameMaster: { clerkId } })
    }
    return await prisma.campaign.findFirst({
      where: { id, OR: orConditions },
      include: {
        gameMaster: { select: { name: true } },
      },
    })
  } catch (error) {
    console.error(`❌ Error en getCampaignById (${id}):`, error)
    return null
  }
}
