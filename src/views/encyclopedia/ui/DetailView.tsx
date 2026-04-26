'use client'

import { AnimatePresence, m } from 'framer-motion'
import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { useSelectedItem } from '../lib/use-encyclopedia-items'
import { useActiveSection, type EncyclopediaSection } from '../model/encyclopediaStore'
import { BestiaryItem, CastItem, EncyclopediaItem, MuseumItem } from '../model/types'
import { CombatStats } from './CombatStats'
import { EncyclopediaImage } from './EncyclopediaImage'
import { ItemHeader } from './ItemHeader'
import { ItemProperties } from './ItemProperties'

const SECTION_CONTENT: Record<EncyclopediaSection, (item: EncyclopediaItem) => ReactNode> = {
  bestiary: (item) => <CombatStats item={item as BestiaryItem} />,
  cast: (item) => <CombatStats item={item as CastItem} />,
  museum: (item) => <ItemProperties item={item as MuseumItem} />,
}

const IMAGE_OVERLAY = { bottomFromTop: '72%', height: '55%' }

export const DetailView = () => {
  const activeSection = useActiveSection()
  const item = useSelectedItem()
  const [imageMissing, setImageMissing] = useState(false)

  return (
    <main className='relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent'>
      <AnimatePresence mode='wait'>
        {item ? (
          <m.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col lg:flex-row'
          >
            <div className='relative h-[50vw] min-h-64 shrink-0 overflow-hidden lg:min-w-[60%] lg:h-auto lg:flex-1'>
              <Image
                src='/bg_biblioteca.png'
                alt='imagen del interior de una biblioteca con un pedestal en el centro'
                fill
                sizes='(max-width: 1024px) 100vw, 60vw'
                className='object-cover object-top'
                priority
              />
              <div className='absolute inset-0 bg-black/60' />
              <EncyclopediaImage
                key={item.id}
                item={item}
                section={activeSection}
                noBackground
                overlay={IMAGE_OVERLAY}
                onMissingChange={setImageMissing}
              />
            </div>

            <div className='w-full border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md lg:max-w-lg lg:border-t-0 lg:border-l lg:p-6'>
              <ItemHeader item={item} activeSection={activeSection} imageMissing={imageMissing} />
              <div className='space-y-8'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                    Descripción
                  </h3>
                  <p className='mt-3 leading-relaxed text-neutral-300'>
                    {item.description ?? 'Sin descripción.'}
                  </p>
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
}
