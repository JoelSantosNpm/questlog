import { createClient } from '@/shared/lib/supabase/server'
import { BestiaryItem, CastItem, MuseumItem } from '../model/encyclopedia'

/**
 * Obtiene los monstruos disponibles para el usuario.
 */
export async function getBestiaryItems(): Promise<BestiaryItem[]> {
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
export async function getCharacterTemplates(): Promise<CastItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('CharacterTemplate')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching character templates:', error)
    return []
  }

  return data.map((item) => ({ ...item, section: 'cast' as const }))
}

/**
 * Obtiene los ítems del museo.
 */
export async function getMuseumItems(): Promise<MuseumItem[]> {
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
