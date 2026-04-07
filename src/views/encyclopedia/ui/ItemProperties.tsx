import { cn } from '@/shared/utils/styles'
import { ALL_STATS, signed } from '../config/stats'
import { MuseumItem } from '../model/types'
import { StatBox } from './StatBox'

interface ItemPropertiesProps {
  item: MuseumItem
}

const RARITY_COLORS: Record<string, string> = {
  JUNK: 'text-neutral-500',
  COMMON: 'text-neutral-300',
  UNCOMMON: 'text-green-400',
  RARE: 'text-blue-400',
  EPIC: 'text-purple-400',
  LEGENDARY: 'text-amber-400',
  ARTIFACT: 'text-red-400',
}

const RARITY_LABELS: Record<string, string> = {
  JUNK: 'Basura',
  COMMON: 'Común',
  UNCOMMON: 'Infrecuente',
  RARE: 'Rara',
  EPIC: 'Épica',
  LEGENDARY: 'Legendaria',
  ARTIFACT: 'Artefacto',
}

export const ItemProperties = ({ item }: ItemPropertiesProps) => {
  const activeModifiers = ALL_STATS.filter(({ key }) => (item[key] as number) !== 0)

  return (
    <div className='space-y-4'>
      <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>Propiedades</h3>
      <div className='grid grid-cols-2 gap-3'>
        <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-3'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>Categoría</span>
          <p className='mt-1 font-medium text-neutral-200'>{item.category}</p>
        </div>
        <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-3'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>Rareza</span>
          <p className={cn('mt-1 font-medium', RARITY_COLORS[item.rarity] ?? 'text-neutral-200')}>
            {RARITY_LABELS[item.rarity] ?? item.rarity}
          </p>
        </div>
        <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-3'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>Valor</span>
          <p className='mt-1 font-mono text-amber-500'>{item.value} po</p>
        </div>
        <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-3'>
          <span className='text-[10px] font-bold uppercase text-neutral-500'>Peso</span>
          <p className='mt-1 font-mono text-neutral-200'>{item.weight} lb</p>
        </div>
      </div>

      {activeModifiers.length > 0 && (
        <>
          <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
            Modificadores
          </h3>
          <div className='flex flex-wrap justify-center gap-1'>
            {activeModifiers.map(({ key, label, title }) => {
              const val = item[key] as number
              return <StatBox key={key} size='sm' label={label} title={title} value={signed(val)} />
            })}
          </div>
        </>
      )}
    </div>
  )
}
