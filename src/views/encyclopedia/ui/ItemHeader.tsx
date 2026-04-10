import { Info } from 'lucide-react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem, BestiaryItem } from '../model/types'

const SECTION_LABELS: Record<EncyclopediaSection, string> = {
  bestiary: 'Bestiario',
  cast: 'Elenco',
  museum: 'Museo',
}

interface ItemHeaderProps {
  item: EncyclopediaItem
  activeSection: EncyclopediaSection
}

export const ItemHeader = ({ item, activeSection }: ItemHeaderProps) => (
  <header className='mb-4'>
    <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
      <Info className='h-3 w-3' />
      {SECTION_LABELS[activeSection]}
      {activeSection === 'bestiary' && (item as BestiaryItem).type && (
        <span>• {(item as BestiaryItem).type}</span>
      )}
      {'rarity' in item && activeSection === 'museum' && <span>• {item.rarity}</span>}
    </div>
    <h2 className='font-medieval mt-2 text-4xl text-neutral-100'>{item.name}</h2>
  </header>
)
