'use client'

import { useQuery } from '@tanstack/react-query'
import { CampaignFilter, getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

import { useAuth } from '@clerk/nextjs'

export function useCampaignList(filter: CampaignFilter = 'all') {
  const { userId } = useAuth()
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), filter, userId],
    queryFn: () => (userId ? getCampaigns(filter, userId) : []),
    enabled: !!userId,
  })
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: CAMPAIGN_KEYS.detail(id),
    queryFn: () => getCampaignById(id),
    enabled: !!id,
  })
}
