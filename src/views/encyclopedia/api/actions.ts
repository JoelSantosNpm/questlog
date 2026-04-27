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

/* --- PERSONAJES (CAST) --- */

export async function createCharacterTemplate(data: Prisma.CharacterTemplateCreateInput) {
  try {
    const character = await prisma.characterTemplate.create({ data })
    revalidatePath('/encyclopedia')
    return { success: true, data: character }
  } catch (error) {
    console.error('❌ Error creating character template:', error)
    return { success: false, error: 'Failed to create character template' }
  }
}

export async function updateCharacterTemplate(id: string, data: Prisma.CharacterTemplateUpdateInput) {
  try {
    const character = await prisma.characterTemplate.update({ where: { id }, data })
    revalidatePath('/encyclopedia')
    return { success: true, data: character }
  } catch (error) {
    console.error('❌ Error updating character template:', error)
    return { success: false, error: 'Failed to update character template' }
  }
}

export async function deleteCharacterTemplate(id: string) {
  try {
    await prisma.characterTemplate.delete({ where: { id } })
    revalidatePath('/encyclopedia')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting character template:', error)
    return { success: false, error: 'Failed to delete character template' }
  }
}

/* --- ÍTEMS (MUSEUM) --- */

export async function createItemTemplate(data: Prisma.ItemTemplateCreateInput) {
  try {
    const item = await prisma.itemTemplate.create({ data })
    revalidatePath('/encyclopedia')
    return { success: true, data: item }
  } catch (error) {
    console.error('❌ Error creating item template:', error)
    return { success: false, error: 'Failed to create item template' }
  }
}

export async function updateItemTemplate(id: string, data: Prisma.ItemTemplateUpdateInput) {
  try {
    const item = await prisma.itemTemplate.update({ where: { id }, data })
    revalidatePath('/encyclopedia')
    return { success: true, data: item }
  } catch (error) {
    console.error('❌ Error updating item template:', error)
    return { success: false, error: 'Failed to update item template' }
  }
}

export async function deleteItemTemplate(id: string) {
  try {
    await prisma.itemTemplate.delete({ where: { id } })
    revalidatePath('/encyclopedia')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting item template:', error)
    return { success: false, error: 'Failed to delete item template' }
  }
}
