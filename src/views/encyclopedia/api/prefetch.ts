import type { QueryClient } from '@tanstack/react-query'
import { getBestiaryItems, getCharacterTemplates, getMuseumItems } from './encyclopedia-queries'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

export async function prefetchEncyclopediaData(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.bestiary('public', 'both'),
      queryFn: () => getBestiaryItems('public', 'both'),
    }),
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.cast('public', 'both'),
      queryFn: () => getCharacterTemplates('public', 'both'),
    }),
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.museum('public', 'both'),
      queryFn: () => getMuseumItems('public', 'both'),
    }),
  ])
}
