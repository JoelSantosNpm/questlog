'use server'

import { withPublicRLS, withRLS } from '@/shared/lib/prisma'
import type { Prisma } from '@prisma/client'
import {
  BestiaryItem,
  CastItem,
  EncyclopediaOwnership,
  EncyclopediaVisibility,
  MuseumItem,
} from '../model/types'

// ES: Obtiene los ids de recursos a los que el usuario tiene acceso por AccessGrant.
// EN: Returns resource ids accessible to the user via AccessGrant.
async function getGrantedIds(
  db: Prisma.TransactionClient,
  granteeId: string,
  resourceType: 'MONSTER_TEMPLATE' | 'CHARACTER_TEMPLATE' | 'ITEM_TEMPLATE'
): Promise<string[]> {
  const grants = await db.accessGrant.findMany({
    where: { granteeId, resourceType },
    select: { resourceId: true },
  })
  return grants.map((g) => g.resourceId)
}

// ES: Bestiario. Soporta visibilidad (public/private/all) y propiedad (mine/shared/both).
export async function getBestiaryItems(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
): Promise<BestiaryItem[]> {
  try {
    if (visibility === 'public') {
      const data = await withPublicRLS((db) =>
        db.monsterTemplate.findMany({ orderBy: { name: 'asc' } })
      )
      return data.map((item) => ({ ...item, section: 'bestiary' as const }))
    }

    if (!clerkId) throw new Error('clerkId required for non-public visibility')

    const data = await withRLS(clerkId, async (db) => {
      const user = await db.user.findUniqueOrThrow({ where: { clerkId }, select: { id: true } })
      const userId = user.id

      const grantedIds =
        ownership !== 'mine' ? await getGrantedIds(db, userId, 'MONSTER_TEMPLATE') : []

      const privateWhere: Prisma.MonsterTemplateWhereInput =
        ownership === 'mine'
          ? { isPublic: false, authorId: userId }
          : ownership === 'shared'
            ? { isPublic: false, id: { in: grantedIds }, authorId: { not: userId } }
            : { isPublic: false, OR: [{ authorId: userId }, { id: { in: grantedIds } }] }

      const where: Prisma.MonsterTemplateWhereInput =
        visibility === 'all' ? { OR: [{ isPublic: true }, privateWhere] } : privateWhere

      return db.monsterTemplate.findMany({ where, orderBy: { name: 'asc' } })
    })

    return data.map((item) => ({ ...item, section: 'bestiary' as const }))
  } catch (error) {
    console.error('❌ Error fetching bestiary with Prisma:', error)
    return []
  }
}

// ES: Reparto de personajes.
export async function getCharacterTemplates(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
): Promise<CastItem[]> {
  try {
    if (visibility === 'public') {
      const data = await withPublicRLS((db) =>
        db.characterTemplate.findMany({ orderBy: { name: 'asc' } })
      )
      return data.map((item) => ({ ...item, section: 'cast' as const }))
    }

    if (!clerkId) throw new Error('clerkId required for non-public visibility')

    const data = await withRLS(clerkId, async (db) => {
      const user = await db.user.findUniqueOrThrow({ where: { clerkId }, select: { id: true } })
      const userId = user.id

      const grantedIds =
        ownership !== 'mine' ? await getGrantedIds(db, userId, 'CHARACTER_TEMPLATE') : []

      const privateWhere: Prisma.CharacterTemplateWhereInput =
        ownership === 'mine'
          ? { isPublic: false, authorId: userId }
          : ownership === 'shared'
            ? { isPublic: false, id: { in: grantedIds }, authorId: { not: userId } }
            : { isPublic: false, OR: [{ authorId: userId }, { id: { in: grantedIds } }] }

      const where: Prisma.CharacterTemplateWhereInput =
        visibility === 'all' ? { OR: [{ isPublic: true }, privateWhere] } : privateWhere

      return db.characterTemplate.findMany({ where, orderBy: { name: 'asc' } })
    })

    return data.map((item) => ({ ...item, section: 'cast' as const }))
  } catch (error) {
    console.error('❌ Error fetching character templates with Prisma:', error)
    return []
  }
}

// ES: Museo de objetos.
export async function getMuseumItems(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
): Promise<MuseumItem[]> {
  try {
    if (visibility === 'public') {
      const data = await withPublicRLS((db) =>
        db.itemTemplate.findMany({ orderBy: { name: 'asc' } })
      )
      return data.map((item) => ({ ...item, section: 'museum' as const }))
    }

    if (!clerkId) throw new Error('clerkId required for non-public visibility')

    const data = await withRLS(clerkId, async (db) => {
      const user = await db.user.findUniqueOrThrow({ where: { clerkId }, select: { id: true } })
      const userId = user.id

      const grantedIds =
        ownership !== 'mine' ? await getGrantedIds(db, userId, 'ITEM_TEMPLATE') : []

      const privateWhere: Prisma.ItemTemplateWhereInput =
        ownership === 'mine'
          ? { isPublic: false, creatorId: userId }
          : ownership === 'shared'
            ? { isPublic: false, id: { in: grantedIds }, creatorId: { not: userId } }
            : { isPublic: false, OR: [{ creatorId: userId }, { id: { in: grantedIds } }] }

      const where: Prisma.ItemTemplateWhereInput =
        visibility === 'all' ? { OR: [{ isPublic: true }, privateWhere] } : privateWhere

      return db.itemTemplate.findMany({ where, orderBy: { name: 'asc' } })
    })

    return data.map((item) => ({ ...item, section: 'museum' as const }))
  } catch (error) {
    console.error('❌ Error fetching museum items with Prisma:', error)
    return []
  }
}
