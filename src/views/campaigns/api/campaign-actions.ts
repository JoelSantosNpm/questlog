'use server'

import { prisma } from '@/shared/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import type { Campaign, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface ActionResponse<T = void> {
  success: boolean
  message: string
  data?: T
}

/**
 * DTO para creación de campañas.
 * Basado en el modelo de Prisma para asegurar coherencia total.
 */
export type CreateCampaignDTO = Pick<
  Campaign,
  'name' | 'description' | 'imageUrl' | 'system' | 'location' | 'isPublic'
> & {
  nextSession?: string // La fecha llega como string desde el cliente
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

    // Buscar el usuario por clerkId y conectar por id
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) {
      return { success: false, message: 'Usuario no sincronizado en la base de datos' }
    }
    const campaign = await prisma.campaign.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system || 'D&D 5e',
        location: data.location,
        isPublic: data.isPublic ?? false,
        nextSession: data.nextSession,
        gameMaster: { connect: { id: user.id } },
        updatedAt: new Date().toISOString(),
      } satisfies Prisma.CampaignCreateInput,
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
        isPublic: data.isPublic,
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
