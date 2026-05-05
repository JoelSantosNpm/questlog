'use client'

import { ToggleButton } from '@/shared/ui'
import { useAuth } from '@clerk/nextjs'
import { AnimatePresence, m } from 'framer-motion'
import { useEffect } from 'react'
import {
  useEncyclopediaStore,
  useShowMine,
  useShowPrivate,
  useShowPublic,
  useShowShared,
  useToggleMine,
  useTogglePrivate,
  useTogglePublic,
  useToggleShared,
} from '../model/encyclopediaStore'

export function EncyclopediaFilterBar() {
  const { userId } = useAuth()
  const isLoggedIn = !!userId

  // Resetear filtros privados si el usuario cierra sesión (o nunca estuvo logueado)
  const resetPrivate = useEncyclopediaStore((s) => s.resetPrivateFilters)
  useEffect(() => {
    if (!isLoggedIn) resetPrivate()
  }, [isLoggedIn, resetPrivate])

  const showPublic = useShowPublic()
  const showPrivate = useShowPrivate()
  const showMine = useShowMine()
  const showShared = useShowShared()
  const togglePublic = useTogglePublic()
  const togglePrivate = useTogglePrivate()
  const toggleMine = useToggleMine()
  const toggleShared = useToggleShared()

  return (
    <div className='flex flex-col gap-2 border-b border-neutral-800/50 px-4 py-3'>
      {/* Dimensión 1: Visibilidad */}
      <div className='flex gap-2'>
        <ToggleButton label='Público' isActive={showPublic} onToggle={togglePublic} />
        {isLoggedIn && (
          <ToggleButton label='Privado' isActive={showPrivate} onToggle={togglePrivate} />
        )}
      </div>

      {/* Dimensión 2: Propiedad — aparece solo cuando Privado está activo */}
      <AnimatePresence initial={false}>
        {showPrivate && (
          <m.div
            key='ownership-filters'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className='flex gap-2 overflow-hidden'
          >
            <ToggleButton
              label='Míos'
              isActive={showMine}
              onToggle={toggleMine}
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
            <ToggleButton
              label='Compartidos'
              isActive={showShared}
              onToggle={toggleShared}
              activeClassName='border-violet-500/40 bg-violet-500/15 text-violet-400'
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
