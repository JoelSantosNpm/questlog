'use client'

import { ToggleButton } from '@/shared/ui'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, m } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  useCampaignFilterStore,
  useShowCampaignMember,
  useShowCampaignOwned,
  useShowCampaignPrivate,
  useShowCampaignPublic,
  useToggleCampaignMember,
  useToggleCampaignOwned,
  useToggleCampaignPrivate,
  useToggleCampaignPublic,
} from '../model/campaignFilterStore'

export function CampaignFilterBar() {
  const { userId, isLoaded } = useAuth()
  const isLoggedIn = !!userId
  const t = useTranslations('Campaigns.filterBar')

  // Se usa getState() para evitar stale closures tras hot-reload.
  // Esperamos a que Clerk confirme el estado antes de resetear filtros,
  // para no borrar los filtros privados durante la hidratación inicial.
  useEffect(() => {
    if (!isLoaded) return
    if (!isLoggedIn) useCampaignFilterStore.getState().resetPrivateFilters()
  }, [isLoaded, isLoggedIn])

  const showPublic = useShowCampaignPublic()
  const showPrivate = useShowCampaignPrivate()
  const showOwned = useShowCampaignOwned()
  const showMember = useShowCampaignMember()
  const togglePublic = useToggleCampaignPublic()
  const togglePrivate = useToggleCampaignPrivate()
  const toggleOwned = useToggleCampaignOwned()
  const toggleMember = useToggleCampaignMember()

  return (
    <div className='flex flex-col gap-2 px-4 py-3'>
      {/* Dimensión 1: Visibilidad */}
      <div className='flex gap-2'>
        <ToggleButton
          label={t('visibility.public')}
          isActive={showPublic}
          onToggle={togglePublic}
          className='flex-1'
        />
        {isLoggedIn && (
          <ToggleButton
            label={t('visibility.private')}
            isActive={showPrivate}
            onToggle={togglePrivate}
            className='flex-1'
          />
        )}
      </div>

      {/* Dimensión 2: Propiedad — aparece solo cuando Privadas está activo */}
      <AnimatePresence initial={false}>
        {isLoggedIn && showPrivate && (
          <m.div
            key='campaign-ownership-filters'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className='flex gap-2 overflow-hidden'
          >
            <ToggleButton
              label={t('ownership.mine')}
              isActive={showOwned}
              onToggle={toggleOwned}
              className='flex-1'
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
            <ToggleButton
              label={t('ownership.membership')}
              isActive={showMember}
              onToggle={toggleMember}
              className='flex-1'
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
