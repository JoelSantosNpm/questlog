'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserCampaigns, getCampaignById } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

export function useUserCampaigns() {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.list(),
    queryFn: getUserCampaigns,
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => getCampaignById(id),
    enabled: !!id,
  })
}
