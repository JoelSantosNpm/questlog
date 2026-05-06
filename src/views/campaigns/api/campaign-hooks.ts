'use client'

import { useAuth } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { CampaignOwnership, CampaignVisibility } from '../model/campaign-types'
import { getCampaignById, getCampaigns } from './campaign-queries'
import { CAMPAIGN_KEYS } from './query-keys'

export function useCampaignList(
  visibility: CampaignVisibility = 'public',
  ownership: CampaignOwnership = 'both'
) {
  const { userId: rawUserId } = useAuth()
  const clerkId = rawUserId ?? undefined
  // Sin sesión siempre public, ignorar lo que diga el store
  const effectiveVisibility = !clerkId ? 'public' : visibility
  return useQuery({
    queryKey: [...CAMPAIGN_KEYS.list(), effectiveVisibility, ownership, clerkId],
    queryFn: () => getCampaigns(effectiveVisibility, ownership, clerkId),
    enabled: effectiveVisibility === 'public' || !!clerkId,
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
