import { createClient } from '@/shared/lib/supabase/server'
import { Campaign as PortalCampaign } from '@/shared/lib/portal'

/**
 * Obtiene las campañas del usuario actual.
 * La seguridad se delega al RLS de Supabase.
 */
export async function getUserCampaigns(): Promise<PortalCampaign[]> {
  const supabase = createClient()

  const { data: campaigns, error } = await supabase
    .from('Campaign')
    .select('id, name')
    .order('createdAt', { ascending: false })

  if (error) {
    console.error(
      '❌ Error fetching campaigns from Supabase:',
      error.message,
      error.details,
      error.hint,
      error.code
    )
    return []
  }

  return campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    variant: 'existing',
  }))
}

/**
 * Obtiene una campaña por ID.
 * El RLS de Supabase garantiza que el usuario tenga acceso.
 */
export async function getCampaignById(id: string) {
  const supabase = createClient()

  const { data: campaign, error } = await supabase
    .from('Campaign')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`❌ Error fetching campaign ${id}:`, error)
    return null
  }

  return campaign
}
