'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

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

export async function createCampaign(data: CreateCampaignDTO): Promise<ActionResponse> {
  try {
    if (!data.name?.trim()) {
      return { success: false, message: 'El nombre de la campaña es obligatorio' }
    }

    const supabase = createClient()
    const { userId: clerkId } = await auth()

    if (!clerkId) {
      return { success: false, message: 'No se pudo identificar la sesión de Clerk' }
    }

    // Obtenemos el ID interno del usuario en la tabla 'users' de Supabase
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('clerkId', clerkId)
      .single()

    if (userError || !userData) {
      console.error('❌ Error al encontrar usuario en Supabase:', userError)
      return {
        success: false,
        message:
          'Tu usuario aún no está sincronizado en la base de datos. Por favor, refresca la página.',
      }
    }

    const { data: campaign, error } = await supabase
      .from('Campaign')
      .insert({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system || 'D&D 5e',
        location: data.location,
        isPrivate: data.isPrivate ?? true,
        nextSession: data.nextSession,
        gameMasterId: userData.id,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

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

export async function updateCampaign(data: UpdateCampaignDTO): Promise<ActionResponse> {
  try {
    if (!data.id) return { success: false, message: 'El ID es requerido' }

    const supabase = createClient()

    const { data: updated, error } = await supabase
      .from('Campaign')
      .update({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        system: data.system,
        location: data.location,
        isPrivate: data.isPrivate,
        nextSession: data.nextSession,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', data.id)
      .select()
      .single()

    if (error) throw error

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
    const supabase = createClient()
    const { error } = await supabase.from('Campaign').delete().eq('id', campaignId)

    if (error) throw error

    revalidatePath('/colosseum')
    revalidatePath('/')

    return { success: true, message: 'Campaña eliminada' }
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    return { success: false, message: 'Ocurrió un error al eliminar la campaña' }
  }
}
