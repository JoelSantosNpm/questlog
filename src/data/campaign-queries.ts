import { createClient } from '@/lib/supabase/server'
import { Campaign as PortalCampaign } from '@/types/ui/portal'

/**
 * Obtiene las campañas del usuario actual.
 * La seguridad se delega al RLS de Supabase.
 */
export async function getUserCampaigns(): Promise<PortalCampaign[]> {
  const supabase = await createClient()

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('id, name')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Error fetching campaigns from Supabase:', error)
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
  const supabase = await createClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`❌ Error fetching campaign ${id}:`, error)
    return null
  }

  return campaign
}
