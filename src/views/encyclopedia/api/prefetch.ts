import type { QueryClient } from '@tanstack/react-query'
import { getBestiaryItems, getCharacterTemplates, getMuseumItems } from './encyclopedia-queries'
import { ENCYCLOPEDIA_KEYS } from './query-keys'

/**
 * Precarga en paralelo los datos de las tres secciones de la enciclopedia
 * (bestiario, reparto, museo) en el QueryClient del servidor.
 */
export async function prefetchEncyclopediaData(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.bestiary(),
      queryFn: getBestiaryItems,
    }),
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.cast(),
      queryFn: getCharacterTemplates,
    }),
    queryClient.prefetchQuery({
      queryKey: ENCYCLOPEDIA_KEYS.museum(),
      queryFn: getMuseumItems,
    }),
  ])
}
