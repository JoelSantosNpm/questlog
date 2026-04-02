import { MuseumItem } from '../model/types'

interface ItemPropertiesProps {
  item: MuseumItem
}

export const ItemProperties = ({ item }: ItemPropertiesProps) => (
  <div className='space-y-4'>
    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>Propiedades</h3>
    <div className='grid grid-cols-2 gap-4'>
      <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-4'>
        <span className='text-[10px] font-bold uppercase text-neutral-500'>Categoría</span>
        <p className='mt-1 font-medium text-neutral-200'>{item.category}</p>
      </div>
      <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-4'>
        <span className='text-[10px] font-bold uppercase text-neutral-500'>Valor</span>
        <p className='mt-1 font-mono text-amber-500'>{item.value} po</p>
      </div>
    </div>
  </div>
)
