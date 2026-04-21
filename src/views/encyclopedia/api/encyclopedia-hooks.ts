'use client'

import { useQuery } from '@tanstack/react-query'
import {
  getBestiaryItems,
  getCharacterTemplates,
  getMuseumItems,
} from './encyclopedia-queries'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

export function useBestiary() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.bestiary(),
    queryFn: () => getBestiaryItems(),
  })
}

export function useCharacterTemplates() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.cast(),
    queryFn: () => getCharacterTemplates(),
  })
}

export function useMuseumItems() {
  return useQuery({
    queryKey: ENCYCLOPEDIA_KEYS.museum(),
    queryFn: () => getMuseumItems(),
  })
}
