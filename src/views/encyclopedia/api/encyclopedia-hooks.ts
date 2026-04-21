'use client'

import { useQuery } from '@tanstack/react-query'
import {
  fetchBestiaryItems,
  fetchCharacterTemplates,
  fetchMuseumItems,
} from './encyclopedia-client-queries'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

export function useBestiary() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.bestiary(),
    queryFn: fetchBestiaryItems,
  })
}

export function useCharacterTemplates() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.cast(),
    queryFn: fetchCharacterTemplates,
  })
}

export function useMuseumItems() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.museum(),
    queryFn: fetchMuseumItems,
  })
}
