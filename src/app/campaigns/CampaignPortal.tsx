'use client'

import type { Campaign } from '@/shared/api/campaign'
import { PortalCarousel, useUserCampaigns } from '@/views/campaigns'
import { useAuth } from '@clerk/nextjs'

export function CampaignPortal() {
  const { userId } = useAuth()
  const { data: dbCampaigns = [] } = useUserCampaigns()

  const campaigns: Campaign[] = [
    ...dbCampaigns.map((c) => ({ id: c.id, name: c.name, variant: 'existing' as const })),
    ...(userId ? [{ id: 'new-campaign', name: 'Nueva Campaña', variant: 'new' as const }] : []),
  ]

  return <PortalCarousel campaigns={campaigns} />
}
