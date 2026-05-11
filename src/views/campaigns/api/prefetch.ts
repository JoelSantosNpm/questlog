import type { Campaign } from '@/shared/api/campaign'
import type { QueryClient } from '@tanstack/react-query'
import { getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

/**
 * Precarga la lista de campañas públicas en el QueryClient del servidor.
 * Para SSR sin auth siempre usamos visibility='public', ownership='both'.
 */
export async function prefetchCampaignList(
  queryClient: QueryClient,
  userId?: string
): Promise<Campaign[]> {
  const visibility = 'public' as const
  const ownership = 'both' as const
  await queryClient.prefetchQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), visibility, ownership, userId],
    queryFn: () => getCampaigns(visibility, ownership, userId),
  })

  return (
    queryClient.getQueryData<Campaign[]>([
      ...CAMPAIGN_KEYS.list(),
      visibility,
      ownership,
      userId,
    ]) ?? []
  )
}

/**
 * Precarga el detalle de una campaña concreta en el QueryClient del servidor.
 * Devuelve el dato cacheado o null si no se encontró.
 */
export async function prefetchCampaignDetail(
  queryClient: QueryClient,
  id: string,
  userId?: string
): Promise<Campaign | null> {
  await queryClient.prefetchQuery({
    queryKey: [...CAMPAIGN_KEYS.detail(id), userId],
    queryFn: () => getCampaignById(id, userId),
  })

  return queryClient.getQueryData<Campaign>([...CAMPAIGN_KEYS.detail(id), userId]) ?? null
}
