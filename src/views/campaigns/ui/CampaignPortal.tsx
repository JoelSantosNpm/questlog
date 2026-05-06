'use client'

import type { Campaign } from '@/shared/api/campaign'
import { useAuth } from '@clerk/nextjs'
import { useCampaignList } from '../api/campaign-hooks'
import type { CampaignOwnership, CampaignVisibility } from '../model/campaign-types'
import {
  useShowCampaignMember,
  useShowCampaignOwned,
  useShowCampaignPrivate,
  useShowCampaignPublic,
} from '../model/campaignFilterStore'
import { CampaignFilterBar } from './CampaignFilterBar'
import { PortalCarousel } from './portal/ui/portal-carousel'

function deriveVisibility(showPublic: boolean, showPrivate: boolean): CampaignVisibility {
  if (showPublic && showPrivate) return 'all'
  if (showPublic) return 'public'
  return 'private'
}

function deriveOwnership(showOwned: boolean, showMember: boolean): CampaignOwnership {
  if (showOwned && showMember) return 'both'
  if (showOwned) return 'owned'
  return 'member'
}

export function CampaignPortal() {
  const { userId } = useAuth()

  const showPublic = useShowCampaignPublic()
  const showPrivate = useShowCampaignPrivate()
  const showOwned = useShowCampaignOwned()
  const showMember = useShowCampaignMember()

  const visibility = deriveVisibility(showPublic, showPrivate)
  const ownership = deriveOwnership(showOwned, showMember)

  const { data: dbCampaigns = [] } = useCampaignList(visibility, ownership)

  const campaigns: Campaign[] = [
    ...dbCampaigns.map((c) => ({ id: c.id, name: c.name, variant: 'existing' as const })),
    ...(userId ? [{ id: 'new-campaign', name: 'Nueva Campaña', variant: 'new' as const }] : []),
  ]

  return (
    <>
      <CampaignFilterBar />
      <PortalCarousel campaigns={campaigns} />
    </>
  )
}
