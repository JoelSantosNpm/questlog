'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Menu, Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CREATE_FAB_LABEL_KEYS } from '../lib/section-labels'
import { EncyclopediaItem } from '../model/encyclopedia-item'
import { useActiveSection, useSetIsCreatingNew } from '../model/encyclopediaStore'
import { ListView } from './ListView'

interface MobileListDrawerProps {
  items: EncyclopediaItem[]
}

export const MobileListDrawer = ({ items }: MobileListDrawerProps) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('Encyclopedia.mobileDrawer')
  const tRoot = useTranslations('Encyclopedia')
  const activeSection = useActiveSection()
  const setIsCreatingNew = useSetIsCreatingNew()

  return (
    <div className='lg:hidden'>
      <button
        type='button'
        onClick={() => setIsCreatingNew(true)}
        className='fixed bottom-36 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-amber-700/80 text-amber-100 shadow-lg transition-colors hover:bg-amber-600'
        aria-label={tRoot(CREATE_FAB_LABEL_KEYS[activeSection] as Parameters<typeof tRoot>[0])}
      >
        <Plus className='size-5' />
      </button>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='fixed bottom-20 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-amber-500 text-amber-950 shadow-lg'
        aria-label={t('openLabel')}
      >
        <Menu className='size-5' />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <m.div
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm'
              onClick={() => setOpen(false)}
            />

            <m.div
              key='drawer'
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className='fixed inset-y-0 left-0 z-50 w-[80vw] max-w-sm'
            >
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='absolute right-3 top-3 z-10 rounded-full p-1 text-neutral-400 hover:text-neutral-100'
                aria-label={t('closeLabel')}
              >
                <X className='size-5' />
              </button>
              <ListView items={items} onSelect={() => setOpen(false)} />
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
