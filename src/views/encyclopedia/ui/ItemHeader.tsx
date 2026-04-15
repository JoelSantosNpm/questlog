'use client'

import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem, BestiaryItem, CastItem } from '../model/types'
import { PortraitFrame } from './PortraitFrame'
import { getPortraitFallbacks } from '@/views/encyclopedia/lib/image-fallbacks'

const SECTION_LABELS: Record<EncyclopediaSection, string> = {
  bestiary: 'Bestiario',
  cast: 'Elenco',
  museum: 'Museo',
}

interface ItemHeaderProps {
  item: EncyclopediaItem
  activeSection: EncyclopediaSection
}

export const ItemHeader = ({ item, activeSection }: ItemHeaderProps) => {
  const hasPortrait = activeSection === 'bestiary' || activeSection === 'cast'
  const portraitItem = hasPortrait ? (item as BestiaryItem | CastItem) : null

  const fallbacks = useMemo(
    () =>
      hasPortrait
        ? getPortraitFallbacks(
            activeSection as 'bestiary' | 'cast',
            portraitItem!.portraitImageUrl,
            portraitItem!.imageUrl
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasPortrait, activeSection, portraitItem?.portraitImageUrl, portraitItem?.imageUrl]
  )

  const [fallbackIndex, setFallbackIndex] = useState(0)
  const portraitSrc = fallbacks[fallbackIndex] ?? ''
  const missingImageUrl = fallbackIndex > 0

  const handlePortraitError = () => {
    setFallbackIndex((i) => (i + 1 < fallbacks.length ? i + 1 : i))
  }

  return (
    <header className='mb-4'>
      <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
        <Info className='h-3 w-3' />
        {SECTION_LABELS[activeSection]}
        {activeSection === 'bestiary' && (item as BestiaryItem).type && (
          <span>• {(item as BestiaryItem).type}</span>
        )}
        {'rarity' in item && activeSection === 'museum' && <span>• {item.rarity}</span>}
      </div>
      <div className='mt-2 flex items-center gap-4'>
        {hasPortrait && (
          <PortraitFrame
            src={portraitSrc}
            alt={item.name}
            variant={activeSection === 'cast' ? 'cast' : 'monster'}
            onError={handlePortraitError}
            showBadge={missingImageUrl}
          />
        )}
        <h2 className='font-medieval text-4xl text-neutral-100'>{item.name}</h2>
      </div>
    </header>
  )
}
