'use client'

import { useQuery } from '@tanstack/react-query'
import { CampaignFilter } from '../model/campaign-types'
import { getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

import { useAuth } from '@clerk/nextjs'

export function useCampaignList(filter: CampaignFilter = 'all') {
  const { userId: rawUserId } = useAuth()
  const userId = rawUserId ?? undefined
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), filter, userId],
    queryFn: () => getCampaigns(filter, userId),
    staleTime: 1000 * 60 * 30,
  })
}

export function useCampaign(id: string) {
  const { userId: rawUserId } = useAuth()
  const userId = rawUserId ?? undefined
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.detail(id), userId],
    queryFn: () => getCampaignById(id, userId),
    staleTime: 1000 * 60 * 30,
  })
}
