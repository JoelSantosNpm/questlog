'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { Campaign } from '@prisma/client'

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
  nextSession?: Date
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {
  id: string
}

export async function createCampaign(data: CreateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: 'No estás autorizado' }
    }

    if (!data.name?.trim()) {
      return { success: false, message: 'El nombre de la campaña es obligatorio' }
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system || 'D&D 5e',
        location: data.location,
        isPrivate: data.isPrivate ?? true,
        nextSession: data.nextSession,
        gameMaster: {
          connect: { clerkId: userId },
        },
      },
    })

    revalidatePath('/colosseum') // Revalidación del dashboard
    revalidatePath('/') // Revalidación global por si acaso

    return {
      success: true,
      message: `${campaign.name} ha sido creada correctamente`,
      data: campaign,
    }
  } catch (error) {
    console.error('Error al crear campaña:', error)
    return { success: false, message: 'Ocurrió un error al crear la campaña' }
  }
}

export async function updateCampaign(data: UpdateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: 'No estás autorizado' }
    }

    if (!data.id) {
      return { success: false, message: 'El ID de la campaña es requerido' }
    }

    // Verificar si existe y si el usuario es el dueño (gameMaster) a través de Clerk
    const existing = await prisma.campaign.findUnique({
      where: { id: data.id },
      include: { gameMaster: true },
    })

    if (!existing) {
      return { success: false, message: 'Campaña no encontrada' }
    }

    if (existing.gameMaster.clerkId !== userId) {
      return { success: false, message: 'No tienes permiso para modificar esta campaña' }
    }

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
      },
    })

    revalidatePath('/colosseum')
    revalidatePath(`/campaigns/${data.id}`)

    return {
      success: true,
      message: `Campaña ${updated.name} actualizada con éxito`,
      data: updated,
    }
  } catch (error) {
    console.error('Error al actualizar campaña:', error)
    return { success: false, message: 'Ocurrió un error al actualizar la campaña' }
  }
}

export async function deleteCampaign(campaignId: string): Promise<ActionResponse<void>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return { success: false, message: 'No estás autorizado' }
    }

    // Verificar si existe y si el usuario autor es dueño usando clerkId
    const existing = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { gameMaster: true },
    })

    if (!existing) {
      return { success: false, message: 'Campaña no encontrada' }
    }

    if (existing.gameMaster.clerkId !== userId) {
      return { success: false, message: 'No tienes permiso para eliminar esta campaña' }
    }

    await prisma.campaign.delete({
      where: { id: campaignId },
    })

    revalidatePath('/colosseum')
    revalidatePath('/')

    return {
      success: true,
      message: 'Campaña eliminada correctamente',
    }
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    return { success: false, message: 'Ocurrió un error al eliminar la campaña' }
  }
}
