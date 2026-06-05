'use client'

import { AnimatePresence, domMax, LazyMotion, m } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { useCurrentItems, useSelectedItem } from '../lib/use-encyclopedia-items'
import {
  useActiveSection,
  useSetSelectedItemId,
  type EncyclopediaSection,
} from '../model/encyclopediaStore'
import { BestiaryItem, CastItem, EncyclopediaItem, MuseumItem } from '../model/encyclopedia-item'
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
  const currentItems = useCurrentItems()
  const setSelectedItemId = useSetSelectedItemId()
  const activeSection = useActiveSection()
  const item = useSelectedItem()
  const [imageMissing, setImageMissing] = useState(false)
  const t = useTranslations('Encyclopedia.detailView')
  const [direction, setDirection] = useState(0)

  const alternItem = (newDirection: number) => {
    if (!item) return
    const currentIndex = currentItems.findIndex((i) => i.id === item.id)
    if (currentIndex === -1) return
    const nextIndex = (currentIndex + newDirection + currentItems.length) % currentItems.length
    setDirection(newDirection)
    setSelectedItemId(currentItems[nextIndex].id)
  }

  return (
    <LazyMotion features={domMax} strict>
      <main className='relative flex-1 overflow-y-auto overflow-hidden scrollbar-encyclopedia bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent'>
        <AnimatePresence mode='wait'>
          {item ? (
            <m.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              custom={direction}
              drag='x'
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(e, info) => {
                const umbral = 30
                if (info.offset.x < -umbral) {
                  alternItem(1)
                } else if (info.offset.x > umbral) {
                  alternItem(-1)
                }
              }}
              className='flex flex-col lg:flex-row lg:h-full'
            >
              <div className='relative h-[50vw] min-h-64 shrink-0 overflow-hidden lg:min-w-[60%] lg:h-full lg:flex-1'>
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

              <div className='w-full border-t border-neutral-800/50 bg-neutral-900/30 p-4 backdrop-blur-md scrollbar-encyclopedia lg:max-w-lg lg:border-t-0 lg:border-l lg:p-6 lg:overflow-y-auto'>
                <ItemHeader item={item} activeSection={activeSection} imageMissing={imageMissing} />
                <div className='space-y-8'>
                  <div>
                    <h3 className='section-label'>{t('descriptionLabel')}</h3>
                    <p className='mt-3 leading-relaxed text-neutral-300'>
                      {item.description ?? t('noDescription')}
                    </p>
                  </div>
                  {SECTION_CONTENT[activeSection](item)}
                </div>
              </div>
            </m.div>
          ) : (
            <div className='flex h-full items-center justify-center text-neutral-500 font-medium'>
              {t('emptySelection')}
            </div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  )
}
