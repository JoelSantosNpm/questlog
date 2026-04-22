'use server'

import { prisma } from '@/shared/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import type { Campaign } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export type ActionResponse<T = void> = {
  success: boolean
  message: string
  data?: T
}

export interface CreateCampaignDTO {
  name: string
  description?: string
  imageUrl?: string
  system?: string
  location?: string
  isPrivate?: boolean
  nextSession?: string
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {
  id: string
}

export async function createCampaign(data: CreateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    if (!data.name?.trim()) {
      return { success: false, message: 'El nombre de la campaña es obligatorio' }
    }

    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return { success: false, message: 'No se pudo identificar la sesión de Clerk' }
    }

    // Asumimos que el userId de Clerk es el gameMasterId en Prisma
    const campaign = await prisma.campaign.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system || 'D&D 5e',
        location: data.location,
        isPrivate: data.isPrivate ?? true,
        nextSession: data.nextSession,
        gameMasterId: clerkId,
        updatedAt: new Date().toISOString(),
      },
    })

    revalidatePath('/campaigns')
    revalidatePath('/colosseum')
    revalidatePath('/')

    return {
      success: true,
      message: `${campaign.name} ha sido creada correctamente`,
      data: campaign,
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : JSON.stringify(error)
    console.error('❌ Error al crear campaña:', msg)

    return { success: false, message: `Error: ${msg}` }
  }
}

export async function updateCampaign(data: UpdateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    if (!data.id) return { success: false, message: 'El ID es requerido' }

    const updated = await prisma.campaign.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system,
        location: data.location,
        isPrivate: data.isPrivate,
        nextSession: data.nextSession,
        updatedAt: new Date().toISOString(),
      },
    })

    revalidatePath('/colosseum')
    revalidatePath(`/campaigns/${data.id}`)

    return {
      success: true,
      message: `Campaña actualizada con éxito`,
      data: updated,
    }
  } catch (error) {
    console.error('Error al actualizar campaña:', error)

    return { success: false, message: 'Ocurrió un error al actualizar la campaña' }
  }
}

export async function deleteCampaign(campaignId: string): Promise<ActionResponse<void>> {
  try {
    await prisma.campaign.delete({ where: { id: campaignId } })

    revalidatePath('/colosseum')
    revalidatePath('/')

    return { success: true, message: 'Campaña eliminada' }
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    return { success: false, message: 'Ocurrió un error al eliminar la campaña' }
  }
}
