'use client'

import { useQuery } from '@tanstack/react-query'
import { EncyclopediaOwnership, EncyclopediaVisibility } from '../model/types'
import { getBestiaryItems, getCharacterTemplates, getMuseumItems } from './encyclopedia-queries'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

export function useBestiary(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
) {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.bestiary(visibility, ownership, clerkId),
    queryFn: () => getBestiaryItems(visibility, ownership, clerkId),
    enabled: visibility === 'public' || !!clerkId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCharacterTemplates(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
) {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.cast(visibility, ownership, clerkId),
    queryFn: () => getCharacterTemplates(visibility, ownership, clerkId),
    enabled: visibility === 'public' || !!clerkId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useMuseumItems(
  visibility: EncyclopediaVisibility = 'public',
  ownership: EncyclopediaOwnership = 'both',
  clerkId?: string
) {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.museum(visibility, ownership, clerkId),
    queryFn: () => getMuseumItems(visibility, ownership, clerkId),
    enabled: visibility === 'public' || !!clerkId,
    staleTime: 1000 * 60 * 5,
  })
}
