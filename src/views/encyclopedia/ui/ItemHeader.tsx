'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem, BestiaryItem, CastItem } from '../model/types'
import { PortraitFrame } from './PortraitFrame'
import { getPortraitImage } from '@/shared/lib/storage'

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

  const [portraitSrc, setPortraitSrc] = useState(() =>
    hasPortrait ? getPortraitImage(portraitItem!.portraitImageUrl ?? null, activeSection) : ''
  )

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
            onError={() => setPortraitSrc(getPortraitImage(null, activeSection))}
          />
        )}
        <h2 className='font-medieval text-4xl text-neutral-100'>{item.name}</h2>
      </div>
    </header>
  )
}
