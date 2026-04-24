'use client'

import type { Campaign } from '@/shared/api/campaign'
import { useAuth } from '@clerk/nextjs'
import { useCampaignList as useUserCampaigns } from '../api/campaign-hooks'
import { PortalCarousel } from './portal/ui/portal-carousel'

export function CampaignPortal() {
  const { userId } = useAuth()
  const { data: dbCampaigns = [] } = useUserCampaigns()

  const campaigns: Campaign[] = [
    ...dbCampaigns.map((c) => ({ id: c.id, name: c.name, variant: 'existing' as const })),
    ...(userId ? [{ id: 'new-campaign', name: 'Nueva Campaña', variant: 'new' as const }] : []),
  ]

  return <PortalCarousel campaigns={campaigns} />
}
