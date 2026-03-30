import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

type Campaign = Database['public']['Tables']['campaigns']['Row']

/**
 * Servicio de Campañas (Supabase Native)
 * Encapsula toda la lógica de negocio para las mesas de juego.
 */
export const CampaignService = {
  /**
   * Crea una nueva campaña validando permisos y relaciones via RLS.
   */
  async create(data: {
    name: string
    description?: string
    system: string
    image_url?: string
    game_master_id: string
  }) {
    const supabase = await createClient()
    
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert({
        name: data.name,
        description: data.description,
        system: data.system,
        image_url: data.image_url,
        game_master_id: data.game_master_id,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return campaign
  },

  /**
   * Obtiene todas las campañas de un Game Master.
   * El RLS ya filtra que solo vea las suyas, pero mantenemos el GM_ID por seguridad.
   */
  async getAllByGM(gameMasterId: string) {
    const supabase = await createClient()

    // En Supabase, para obtener cuentas de relaciones, podemos usar select con count
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        characters (count),
        active_monsters (count)
      `)
      .eq('game_master_id', gameMasterId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}
