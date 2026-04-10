'use client'

import { m, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { EncyclopediaItem } from '../model/types'
import { ListView } from './ListView'

interface MobileListDrawerProps {
  items: EncyclopediaItem[]
  open: boolean
  onOpen: () => void
  onClose: () => void
}

export const MobileListDrawer = ({ items, open, onOpen, onClose }: MobileListDrawerProps) => (
  <div className='md:hidden'>
    <button
      onClick={onOpen}
      className='fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-neutral-950 shadow-lg'
      aria-label='Abrir lista'
    >
      <Menu className='h-5 w-5' />
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
            onClick={onClose}
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
              onClick={onClose}
              className='absolute right-3 top-3 z-10 rounded-full p-1 text-neutral-400 hover:text-neutral-100'
              aria-label='Cerrar lista'
            >
              <X className='h-5 w-5' />
            </button>
            <ListView items={items} onSelect={onClose} />
          </m.div>
        </>
      )}
    </AnimatePresence>
  </div>
)
