'use server'

import { prismaAdmin, withRLS } from '@/shared/lib/prisma'
import { CampaignFilter } from '../model/campaign-types'

/**
 * ES: Obtiene campañas según filtro.
 * Sin sesión → solo públicas (prismaAdmin, sin RLS).
 * Con sesión → RLS filtra automáticamente públicas + campañas del usuario.
 *
 * EN: Fetches campaigns by filter.
 * Unauthenticated → public only (prismaAdmin, no RLS).
 * Authenticated → RLS automatically returns public + user's campaigns.
 */
export async function getCampaigns(filter: CampaignFilter = 'all', clerkId?: string) {
  try {
    if (!clerkId) {
      return await prismaAdmin.campaign.findMany({
        where: { isPublic: true },
        include: { gameMaster: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }

    return await withRLS(clerkId, (db) =>
      db.campaign.findMany({
        where:
          filter === 'owned'
            ? { gameMaster: { clerkId } } // RLS permite + Prisma restringe a propias
            : filter === 'public'
              ? { isPublic: true } // Solo públicas (RLS igualmente las permite)
              : undefined, // 'all': RLS gestiona público + miembro
        include: { gameMaster: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      })
    )
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
