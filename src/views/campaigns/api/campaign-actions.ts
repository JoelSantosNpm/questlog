'use server'

import { requireUserId } from '@/shared/lib/auth'
import { withRLS } from '@/shared/lib/prisma'
import type { Campaign, Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface ActionResponse<T = void> {
  success: boolean
  message: string
  data?: T
}

/**
 * DTO para creación de campañas.
 * Construido dinámicamente desde el modelo de Prisma para asegurar coherencia.
 */
export type CreateCampaignDTO = Partial<
  Pick<Campaign, 'description' | 'imageUrl' | 'system' | 'location' | 'isPublic'>
> & {
  name: string // El nombre es el único campo obligatorio
  nextSession?: string | null // Override: llega como string (ISO) desde el cliente
}

export interface UpdateCampaignDTO extends Partial<CreateCampaignDTO> {
  id: string
}

export async function createCampaign(data: CreateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    if (!data.name?.trim()) {
      return { success: false, message: 'El nombre de la campaña es obligatorio' }
    }

    const clerkId = await requireUserId()

    const campaign = await withRLS(clerkId, async (db) => {
      const user = await db.user.findUnique({ where: { clerkId } })
      if (!user) throw new Error('Usuario no sincronizado en la base de datos')

      return db.campaign.create({
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

    const clerkId = await requireUserId()

    const updated = await withRLS(clerkId, (db) =>
      db.campaign.update({
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
    )

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
    const clerkId = await requireUserId()

    await withRLS(clerkId, (db) => db.campaign.delete({ where: { id: campaignId } }))

    revalidatePath('/colosseum')
    revalidatePath('/')

    return { success: true, message: 'Campaña eliminada' }
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    return { success: false, message: 'Ocurrió un error al eliminar la campaña' }
  }
}
