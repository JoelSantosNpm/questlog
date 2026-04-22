import type { Campaign } from '@/shared/api/campaign'
import type { QueryClient } from '@tanstack/react-query'
import { CampaignFilter, getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

/**
 * Precarga la lista de campañas del usuario en el QueryClient del servidor.
 * Devuelve los datos ya cacheados para que la page no tenga que volver a leerlos.
 */
export async function prefetchCampaignList(
  queryClient: QueryClient,
  userId?: string,
  filter: CampaignFilter = 'all'
): Promise<Campaign[]> {
  await queryClient.prefetchQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), filter, userId],
    queryFn: () => getCampaigns(filter, userId),
  })

  return queryClient.getQueryData<Campaign[]>([...CAMPAIGN_KEYS.list(), filter, userId]) ?? []
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
    queryKey: [...CAMPAIGN_KEYS.detail(id)],
    queryFn: () => getCampaignById(id),
  })

  return queryClient.getQueryData<Campaign>([...CAMPAIGN_KEYS.detail(id)]) ?? null
}
