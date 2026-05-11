'use client'

import { useAuth } from '@clerk/nextjs'
import { useBestiary, useCharacterTemplates, useMuseumItems } from '../api/encyclopedia-hooks'
import {
  useActiveSection,
  useSearchQuery,
  useSelectedItemId,
  useShowMine,
  useShowPrivate,
  useShowPublic,
  useShowShared,
} from '../model/encyclopediaStore'
import type {
  EncyclopediaItem,
  EncyclopediaOwnership,
  EncyclopediaVisibility,
} from '../model/types'

function deriveVisibility(showPublic: boolean, showPrivate: boolean): EncyclopediaVisibility {
  if (showPublic && showPrivate) return 'all'
  if (showPublic) return 'public'
  return 'private'
}

function deriveOwnership(showMine: boolean, showShared: boolean): EncyclopediaOwnership {
  if (showMine && showShared) return 'both'
  if (showMine) return 'mine'
  return 'shared'
}

/**
 * Devuelve los items de la sección activa filtrados por la búsqueda actual.
 * Combina el estado UI de Zustand con los datos cacheados por TanStack Query.
 */
export function useCurrentItems(): EncyclopediaItem[] {
  const { userId } = useAuth()
  const clerkId = userId ?? undefined

  const activeSection = useActiveSection()
  const searchQuery = useSearchQuery()

  const showPublic = useShowPublic()
  const showPrivate = useShowPrivate()
  const showMine = useShowMine()
  const showShared = useShowShared()

  const visibility = !clerkId ? 'public' : deriveVisibility(showPublic, showPrivate)
  const ownership = deriveOwnership(showMine, showShared)

  const bestiary = useBestiary(visibility, ownership, clerkId)
  const cast = useCharacterTemplates(visibility, ownership, clerkId)
  const museum = useMuseumItems(visibility, ownership, clerkId)

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
