'use server'

import { prisma } from '@/shared/lib/prisma'
import { Prisma } from '@prisma/client'
import { CampaignFilter } from '../model/campaign-types'

export async function getCampaigns(filter: CampaignFilter = 'all', clerkId?: string) {
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
}

/**
 * Obtiene una campaña por ID.
 */
export async function getCampaignById(id: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    })
    return campaign
  } catch (error) {
    console.error(`❌ Error fetching campaign ${id} from Prisma:`, error)
    return null
  }
}
