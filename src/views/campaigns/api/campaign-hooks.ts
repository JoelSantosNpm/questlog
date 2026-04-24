'use client'

import { useQuery } from '@tanstack/react-query'
import { CampaignFilter } from '../model/campaign-types'
import { getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

import { useAuth } from '@clerk/nextjs'

export function useCampaignList(filter: CampaignFilter = 'all') {
  const { userId } = useAuth()
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), filter, userId],
    queryFn: () => (userId ? getCampaigns(filter, userId) : getCampaigns(filter)),
    staleTime: 1000 * 60 * 30,
  })
}

export function useCampaign(id: string) {
  const { userId } = useAuth()
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.detail(id), userId],
    queryFn: () => (userId ? getCampaignById(id, userId) : getCampaignById(id)),
    staleTime: 1000 * 60 * 30,
  })
}
