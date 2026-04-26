'use client'

import { useBestiary, useCharacterTemplates, useMuseumItems } from '../api/encyclopedia-hooks'
import { useActiveSection, useSearchQuery, useSelectedItemId } from '../model/encyclopediaStore'
import type { EncyclopediaItem } from '../model/types'

/**
 * Devuelve los items de la sección activa filtrados por la búsqueda actual.
 * Combina el estado UI de Zustand con los datos cacheados por TanStack Query.
 */
export function useCurrentItems(): EncyclopediaItem[] {
  const activeSection = useActiveSection()
  const searchQuery = useSearchQuery()

  const bestiary = useBestiary()
  const cast = useCharacterTemplates()
  const museum = useMuseumItems()

  let items: EncyclopediaItem[] = []
  if (activeSection === 'bestiary') items = bestiary.data ?? []
  else if (activeSection === 'cast') items = cast.data ?? []
  else if (activeSection === 'museum') items = museum.data ?? []

  if (!searchQuery.trim()) return items

  const lowerQuery = searchQuery.toLowerCase()
  return items.filter((item) => item.name.toLowerCase().includes(lowerQuery))
}

/**
 * Devuelve el item seleccionado actualmente, o el primero de la lista si no hay selección.
 */
export function useSelectedItem(): EncyclopediaItem | undefined {
  const selectedItemId = useSelectedItemId()
  const items = useCurrentItems()

  return items.find((i) => i.id === selectedItemId) ?? items[0]
}
