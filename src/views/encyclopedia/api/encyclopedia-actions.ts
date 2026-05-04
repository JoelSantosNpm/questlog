'use server'

import { requireUserId } from '@/shared/lib/auth'
import { withRLS } from '@/shared/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

/* --- MONSTRUOS (BESTIARY) --- */

export async function createMonster(data: Prisma.MonsterTemplateCreateInput) {
  try {
    const userId = await requireUserId()
    const monster = await withRLS(userId, (db) => db.monsterTemplate.create({ data }))
    revalidatePath('/encyclopedia')
    return { success: true, data: monster }
  } catch (error) {
    console.error('❌ Error creating monster:', error)
    return { success: false, error: 'Failed to create monster' }
  }
}

export async function updateMonster(id: string, data: Prisma.MonsterTemplateUpdateInput) {
  try {
    const userId = await requireUserId()
    const monster = await withRLS(userId, (db) =>
      db.monsterTemplate.update({ where: { id }, data })
    )
    revalidatePath('/encyclopedia')
    return { success: true, data: monster }
  } catch (error) {
    console.error('❌ Error updating monster:', error)
    return { success: false, error: 'Failed to update monster' }
  }
}

export async function deleteMonster(id: string) {
  try {
    const userId = await requireUserId()
    await withRLS(userId, (db) => db.monsterTemplate.delete({ where: { id } }))
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
    const userId = await requireUserId()
    const character = await withRLS(userId, (db) => db.characterTemplate.create({ data }))
    revalidatePath('/encyclopedia')
    return { success: true, data: character }
  } catch (error) {
    console.error('❌ Error creating character template:', error)
    return { success: false, error: 'Failed to create character template' }
  }
}

export async function updateCharacterTemplate(
  id: string,
  data: Prisma.CharacterTemplateUpdateInput
) {
  try {
    const userId = await requireUserId()
    const character = await withRLS(userId, (db) =>
      db.characterTemplate.update({ where: { id }, data })
    )
    revalidatePath('/encyclopedia')
    return { success: true, data: character }
  } catch (error) {
    console.error('❌ Error updating character template:', error)
    return { success: false, error: 'Failed to update character template' }
  }
}

export async function deleteCharacterTemplate(id: string) {
  try {
    const userId = await requireUserId()
    await withRLS(userId, (db) => db.characterTemplate.delete({ where: { id } }))
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
    const userId = await requireUserId()
    const item = await withRLS(userId, (db) => db.itemTemplate.create({ data }))
    revalidatePath('/encyclopedia')
    return { success: true, data: item }
  } catch (error) {
    console.error('❌ Error creating item template:', error)
    return { success: false, error: 'Failed to create item template' }
  }
}

export async function updateItemTemplate(id: string, data: Prisma.ItemTemplateUpdateInput) {
  try {
    const userId = await requireUserId()
    const item = await withRLS(userId, (db) => db.itemTemplate.update({ where: { id }, data }))
    revalidatePath('/encyclopedia')
    return { success: true, data: item }
  } catch (error) {
    console.error('❌ Error updating item template:', error)
    return { success: false, error: 'Failed to update item template' }
  }
}

export async function deleteItemTemplate(id: string) {
  try {
    const userId = await requireUserId()
    await withRLS(userId, (db) => db.itemTemplate.delete({ where: { id } }))
    revalidatePath('/encyclopedia')
    return { success: true }
  } catch (error) {
    console.error('❌ Error deleting item template:', error)
    return { success: false, error: 'Failed to delete item template' }
  }
}
