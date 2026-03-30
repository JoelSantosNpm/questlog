'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/database.types'

type Campaign = Database['public']['Tables']['campaigns']['Row']

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

    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .single()

    if (userError || !userData) {
      return { success: false, message: 'No se pudo identificar al usuario' }
    }

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
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
    console.error('Error al crear campaña:', error)
    return { success: false, message: 'Ocurrió un error al crear la campaña' }
  }
}

export async function updateCampaign(data: UpdateCampaignDTO): Promise<ActionResponse<Campaign>> {
  try {
    if (!data.id) return { success: false, message: 'El ID es requerido' }

    const supabase = await createClient()

    const { data: updated, error } = await supabase
      .from('campaigns')
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
    const supabase = await createClient()
    const { error } = await supabase.from('campaigns').delete().eq('id', campaignId)

    if (error) throw error

    revalidatePath('/colosseum')
    revalidatePath('/')

    return { success: true, message: 'Campaña eliminada' }
  } catch (error) {
    console.error('Error al eliminar campaña:', error)
    return { success: false, message: 'Ocurrió un error al eliminar la campaña' }
  }
}
