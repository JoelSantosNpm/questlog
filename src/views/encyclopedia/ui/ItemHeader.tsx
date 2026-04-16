'use client'

import { getPortraitFallbacks } from '@/views/encyclopedia/lib/image-fallbacks'
import { Info, OctagonAlert } from 'lucide-react'
import { useState } from 'react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { BestiaryItem, CastItem, EncyclopediaItem } from '../model/types'
import { PortraitFrame } from './PortraitFrame'

const SECTION_LABELS: Record<EncyclopediaSection, string> = {
  bestiary: 'Bestiario',
  cast: 'Elenco',
  museum: 'Museo',
}

interface ItemHeaderProps {
  item: EncyclopediaItem
  activeSection: EncyclopediaSection
  /** Indica que la imagen principal del ítem no pudo cargarse (pasado desde DetailView) */
  imageMissing?: boolean
}

export const ItemHeader = ({ item, activeSection, imageMissing = false }: ItemHeaderProps) => {
  const hasPortrait = activeSection === 'bestiary' || activeSection === 'cast'
  const portraitItem = hasPortrait ? (item as BestiaryItem | CastItem) : null

  const fallbacks = hasPortrait
    ? getPortraitFallbacks(
        activeSection as 'bestiary' | 'cast',
        portraitItem!.portraitImageUrl,
        portraitItem!.imageUrl
      )
    : []

  const [fallbackIndex, setFallbackIndex] = useState(0)
  const portraitSrc = fallbacks[fallbackIndex] ?? ''
  const missingImageUrl = fallbackIndex > 0 || fallbacks.length === 1

  const handlePortraitError = () => {
    setFallbackIndex((i) => (i + 1 < fallbacks.length ? i + 1 : i))
  }

  return (
    <header className='mb-4'>
      <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
        <Info className='h-3 w-3' />
        {SECTION_LABELS[activeSection]}
        {activeSection === 'museum' && imageMissing && (
          <div title='URL de avatar no disponible' className='cursor-help'>
            <OctagonAlert className='h-3 w-3 text-amber-500/70' />
          </div>
        )}
        {activeSection === 'bestiary' && (item as BestiaryItem).type && (
          <span>• {(item as BestiaryItem).type}</span>
        )}
        {'rarity' in item && activeSection === 'museum' && <span>• {item.rarity}</span>}
      </div>
      <div className='mt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4'>
        {hasPortrait && (
          <PortraitFrame
            src={portraitSrc}
            alt={item.name}
            variant={activeSection === 'cast' ? 'cast' : 'monster'}
            onError={handlePortraitError}
            showBadge={missingImageUrl}
          />
        )}
        <h2 className='font-medieval text-2xl sm:text-4xl text-neutral-100 min-w-0 break-words leading-tight'>
          {item.name}
        </h2>
      </div>
    </header>
  )
}
