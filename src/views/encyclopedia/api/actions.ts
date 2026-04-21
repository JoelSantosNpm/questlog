'use server'

import { prisma } from '@/shared/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

/**
 * Crea una nueva criatura en el bestiario.
 */
export async function createMonster(data: Prisma.MonsterTemplateCreateInput) {
  try {
    const monster = await prisma.monsterTemplate.create({
      data,
    })
    revalidatePath('/encyclopedia')
    return { success: true, data: monster }
  } catch (error) {
    console.error('❌ Error creating monster:', error)
    return { success: false, error: 'Failed to create monster' }
  }
}

/**
 * Actualiza una criatura existente.
 */
export async function updateMonster(id: string, data: Prisma.MonsterTemplateUpdateInput) {
  try {
    const monster = await prisma.monsterTemplate.update({
      where: { id },
      data,
    })
    revalidatePath('/encyclopedia')
    return { success: true, data: monster }
  } catch (error) {
    console.error('❌ Error updating monster:', error)
    return { success: false, error: 'Failed to update monster' }
  }
}

/**
 * Elimina una criatura del bestiario.
 */
export async function deleteMonster(id: string) {
  try {
    await prisma.monsterTemplate.delete({
      where: { id },
    })
    revalidatePath('/encyclopedia')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting monster:', error)
    return { success: false, error: 'Failed to delete monster' }
  }
}
