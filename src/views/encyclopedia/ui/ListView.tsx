'use client'

import { Search } from 'lucide-react'
import { 
  useSelectedItemId, 
  useSetSelectedItemId, 
  useSearchQuery, 
  useSetSearchQuery 
} from '../model/encyclopediaStore'
import { cn } from '@/shared/utils/styles'
import { EncyclopediaItem } from '../model/types'

interface ListViewProps {
  items: EncyclopediaItem[]
  onSelect?: () => void
}

export const ListView = ({ items, onSelect }: ListViewProps) => {
  const selectedItemId = useSelectedItemId()
  const setSelectedItemId = useSetSelectedItemId()
  const searchQuery = useSearchQuery()
  const setSearchQuery = useSetSearchQuery()

  return (
    <section className='flex w-full flex-col border-r border-neutral-800/50 bg-neutral-950/40 backdrop-blur-sm'>
      <div className='p-4 border-b border-neutral-800/50'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500' />
          <input
            type='text'
            placeholder='Buscar...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-md border border-neutral-800 bg-neutral-900/50 py-2 pl-10 pr-4 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50'
          />
        </div>
      </div>
      <div className='flex-1 overflow-y-auto p-2'>
        <div className='space-y-1'>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItemId(item.id)
                onSelect?.()
              }}
              className={cn(
                'w-full rounded-lg px-4 py-3 text-left transition-all duration-200 cursor-pointer',
                selectedItemId === item.id || (!selectedItemId && item.id === items[0]?.id)
                  ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              )}
            >
              <p className='text-sm font-semibold'>{item.name}</p>
              <p className='mt-0.5 truncate text-xs opacity-60'>{item.description}</p>
            </button>
          ))}
          {items.length === 0 && (
            <div className='p-8 text-center text-xs text-neutral-600 italic'>
              No se han encontrado registros.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
