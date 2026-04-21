'use server'

import { prisma } from '@/shared/lib/prisma'
import { createClient } from '@/shared/lib/supabase/server'
import { BestiaryItem, CastItem, MuseumItem } from '../model/types'

/**
 * Obtiene los monstruos disponibles para el usuario.
 */
export async function getBestiaryItems(): Promise<BestiaryItem[]> {
  try {
    const data = await prisma.monsterTemplate.findMany({
      orderBy: { name: 'asc' },
    })

    return data.map((item) => ({ 
      ...item, 
      section: 'bestiary' as const,
    }))
  } catch (error) {
    console.error('❌ Error fetching bestiary with Prisma:', error)
    return []
  }
}

/**
 * Obtiene las plantillas de personajes.
 */
export async function getCharacterTemplates(): Promise<CastItem[]> {
  try {
    const data = await prisma.characterTemplate.findMany({
      orderBy: { name: 'asc' },
    })

    return data.map((item) => ({ 
      ...item, 
      section: 'cast' as const,
    }))
  } catch (error) {
    console.error('❌ Error fetching character templates with Prisma:', error)
    return []
  }
}

/**
 * Obtiene los ítems del museo.
 */
export async function getMuseumItems(): Promise<MuseumItem[]> {
  try {
    const data = await prisma.itemTemplate.findMany({
      orderBy: { name: 'asc' },
    })

    return data.map((item) => ({ 
      ...item, 
      section: 'museum' as const,
    }))
  } catch (error) {
    console.error('❌ Error fetching museum items with Prisma:', error)
    return []
  }
}
