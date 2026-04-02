'use client'

import { m, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem, BestiaryItem, CastItem, MuseumItem } from '../model/types'
import { EncyclopediaImage } from './EncyclopediaImage'
import { ItemHeader } from './ItemHeader'
import { CombatStats } from './CombatStats'
import { ItemProperties } from './ItemProperties'

interface DetailViewProps {
  item?: EncyclopediaItem
  activeSection: EncyclopediaSection
}

const SECTION_CONTENT: Record<EncyclopediaSection, (item: EncyclopediaItem) => ReactNode> = {
  bestiary: (item) => <CombatStats item={item as BestiaryItem} />,
  cast: (item) => <CombatStats item={item as CastItem} />,
  museum: (item) => <ItemProperties item={item as MuseumItem} />,
}

export const DetailView = ({ item, activeSection }: DetailViewProps) => (
  <main className='relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent'>
    <AnimatePresence mode='wait'>
      {item ? (
        <m.div
          key={item.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className='flex h-full flex-col lg:flex-row'
        >
          <div className='flex flex-1 items-center justify-center p-8 lg:p-12'>
            <EncyclopediaImage key={item.id} item={item} section={activeSection} />
          </div>

          <div className='w-full max-w-lg border-l border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-md lg:p-12'>
            <ItemHeader item={item} activeSection={activeSection} />
            <div className='space-y-8'>
              <div>
                <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                  Descripción
                </h3>
                <p className='mt-3 leading-relaxed text-neutral-300'>Sin descripción.</p>
              </div>
              {SECTION_CONTENT[activeSection](item)}
            </div>
          </div>
        </m.div>
      ) : (
        <div className='flex h-full items-center justify-center text-neutral-500 font-medium'>
          Selecciona un elemento para ver sus detalles.
        </div>
      )}
    </AnimatePresence>
  </main>
)
