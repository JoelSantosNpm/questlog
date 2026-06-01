'use client'

import type { Campaign } from '@/shared/api/campaign'
import { useAuth } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('Campaigns.portal')

  const showPublic = useShowCampaignPublic()
  const showPrivate = useShowCampaignPrivate()
  const showOwned = useShowCampaignOwned()
  const showMember = useShowCampaignMember()

  const visibility = deriveVisibility(showPublic, showPrivate)
  const ownership = deriveOwnership(showOwned, showMember)

  const { data: dbCampaigns = [] } = useCampaignList(visibility, ownership)

  const campaigns: Campaign[] = [
    ...dbCampaigns.map((c) => ({ id: c.id, name: c.name, variant: 'existing' as const })),
    ...(userId ? [{ id: 'new-campaign', name: t('newCampaignName'), variant: 'new' as const }] : []),
  ]

  return (
    <div className='flex flex-1 w-full flex-col items-center overflow-hidden'>
      {/* Cabecera: 3 columnas en lg+, columna centrada en móvil */}
      <div className='flex flex-col lg:flex-row lg:items-center w-full px-4 lg:px-8 mt-8 mb-2 gap-3'>
        {/* Spacer espejo — solo ocupa espacio en lg+ para centrar el título */}
        <div className='hidden lg:flex lg:flex-1' />

        <h1
          className='text-center text-2xl sm:text-3xl md:text-4xl text-amber-200/80 drop-shadow-[0_2px_12px_rgba(217,119,6,0.4)] tracking-wide'
          style={{ fontFamily: 'var(--font-medieval)' }}
        >
          {t('heading')}
        </h1>

        {/* Filtro: centrado en móvil, alineado a la derecha en lg+ */}
        <div className='flex lg:flex-1 justify-center lg:justify-end'>
          <CampaignFilterBar />
        </div>
      </div>

      <PortalCarousel campaigns={campaigns} />
    </div>
  )
}
