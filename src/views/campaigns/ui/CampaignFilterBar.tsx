'use client'

import { ToggleButton } from '@/shared/ui'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, m } from 'framer-motion'
import { useEffect } from 'react'
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
  const { userId } = useAuth()
  const isLoggedIn = !!userId

  // Se usa getState() para evitar stale closures tras hot-reload
  useEffect(() => {
    if (!isLoggedIn) useCampaignFilterStore.getState().resetPrivateFilters()
  }, [isLoggedIn])

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
        <ToggleButton label='Públicas' isActive={showPublic} onToggle={togglePublic} />
        {isLoggedIn && (
          <ToggleButton label='Privadas' isActive={showPrivate} onToggle={togglePrivate} />
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
              label='Mías'
              isActive={showOwned}
              onToggle={toggleOwned}
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
            <ToggleButton
              label='Con membresía'
              isActive={showMember}
              onToggle={toggleMember}
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
