import { createClient } from '@/lib/supabase/server'
import { EncyclopediaItem } from '@/components/encyclopedia/types'

/**
 * Obtiene los monstruos disponibles para el usuario.
 */
export async function getBestiaryItems(): Promise<EncyclopediaItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('MonsterTemplate')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching bestiary:', error)
    return []
  }

  return data.map((item) => ({ ...item, section: 'bestiary' as const }))
}

/**
 * Obtiene las plantillas de personajes.
 */
export async function getCharacterTemplates(): Promise<EncyclopediaItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('CharacterTemplate')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching character templates:', error)
    return []
  }

  return data.map((item) => ({ ...item, section: 'dramatis-personae' as const }))
}

/**
 * Obtiene los ítems del museo.
 */
export async function getMuseumItems(): Promise<EncyclopediaItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ItemTemplate')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching items:', error)
    return []
  }

  return data.map((item) => ({ ...item, section: 'museum' as const }))
}
