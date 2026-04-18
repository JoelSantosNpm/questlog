import type { Campaign } from '@/shared/api/campaign'
import type { QueryClient } from '@tanstack/react-query'
import { getCampaignById, getUserCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

/**
 * Precarga la lista de campañas del usuario en el QueryClient del servidor.
 * Devuelve los datos ya cacheados para que la page no tenga que volver a leerlos.
 */
export async function prefetchCampaignList(queryClient: QueryClient): Promise<Campaign[]> {
  await queryClient.prefetchQuery({
    queryKey: CAMPAIGN_KEYS.list(),
    queryFn: getUserCampaigns,
  })

  return queryClient.getQueryData<Campaign[]>(CAMPAIGN_KEYS.list()) ?? []
}

/**
 * Precarga el detalle de una campaña concreta en el QueryClient del servidor.
 * Devuelve el dato cacheado o null si no se encontró.
 */
export async function prefetchCampaignDetail(
  queryClient: QueryClient,
  id: string
): Promise<Campaign | null> {
  await queryClient.prefetchQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => getCampaignById(id),
  })

  return queryClient.getQueryData<Campaign>(CAMPAIGN_KEYS.detail(id)) ?? null
}
