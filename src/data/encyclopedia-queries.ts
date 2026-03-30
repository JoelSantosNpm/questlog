import { createClient } from '@/lib/supabase/server'
import { EncyclopediaItem } from '@/components/encyclopedia/types'

/**
 * Obtiene los monstruos disponibles para el usuario.
 */
export async function getBestiaryItems(): Promise<EncyclopediaItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('monster_templates')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching bestiary:', error)
    return []
  }

  return data.map(item => ({ ...item, type: 'bestiary' } as EncyclopediaItem))
}

/**
 * Obtiene las plantillas de personajes.
 */
export async function getCharacterTemplates(): Promise<EncyclopediaItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('character_templates')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching character templates:', error)
    return []
  }

  return data.map(item => ({ ...item, type: 'dramatis-personae' } as EncyclopediaItem))
}

/**
 * Obtiene los ítems del museo.
 */
export async function getMuseumItems(): Promise<EncyclopediaItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('item_templates')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('❌ Error fetching items:', error)
    return []
  }

  return data.map(item => ({ ...item, type: 'museum' } as EncyclopediaItem))
}
