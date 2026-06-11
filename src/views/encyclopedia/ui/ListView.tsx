'use client'

import { cn } from '@/shared/utils/styles'
import { Plus, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  useActiveSection,
  useIsCreatingNew,
  useSearchQuery,
  useSelectedItemId,
  useSetIsCreatingNew,
  useSetSearchQuery,
  useSetSelectedItemId,
} from '../model/encyclopediaStore'
import { EncyclopediaItem } from '../model/encyclopedia-item'
import { EncyclopediaFilterBar } from './EncyclopediaFilterBar'

interface ListViewProps {
  items: EncyclopediaItem[]
  onSelect?: () => void
}

export const ListView = ({ items, onSelect }: ListViewProps) => {
  const selectedItemId = useSelectedItemId()
  const setSelectedItemId = useSetSelectedItemId()
  const isCreatingNew = useIsCreatingNew()
  const searchQuery = useSearchQuery()
  const setSearchQuery = useSetSearchQuery()
  const activeSection = useActiveSection()
  const setIsCreatingNew = useSetIsCreatingNew()
  const t = useTranslations('Encyclopedia.listView')
  const tForm = useTranslations('Encyclopedia.monsterForm')

  return (
    <section className='flex h-full w-full flex-col border-r border-neutral-800/50 bg-neutral-950/40 backdrop-blur-sm'>
      <EncyclopediaFilterBar />
      <div className='p-4 border-b border-neutral-800/50'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500' />
          <input
            type='text'
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-md border border-neutral-800 bg-neutral-900/50 py-2 pl-10 pr-4 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50'
          />
        </div>
      </div>
      {activeSection === 'bestiary' && (
        <div className='px-2 pt-2 pb-1 border-b border-neutral-800/50'>
          <button
            type='button'
            onClick={() => {
              setIsCreatingNew(true)
              onSelect?.()
            }}
            className='flex w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed border-amber-800/40 px-4 py-2.5 text-sm font-medium text-amber-600/70 transition-all duration-200 hover:border-amber-600/50 hover:bg-amber-950/20 hover:text-amber-500'
          >
            <Plus className='size-4' />
            {tForm('createButton')}
          </button>
        </div>
      )}
      <div className='flex-1 overflow-y-auto p-2 scrollbar-encyclopedia'>
        <div className='space-y-1'>
          {items.map((item) => (
            <button
              type='button'
              key={item.id}
              onClick={() => {
                setSelectedItemId(item.id)
                setIsCreatingNew(false)
                onSelect?.()
              }}
              className={cn(
                'w-full rounded-lg px-4 py-3 text-left transition-all duration-200 cursor-pointer',
                !isCreatingNew &&
                  (selectedItemId === item.id || (!selectedItemId && item.id === items[0]?.id))
                  ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
              )}
            >
              <p className='text-sm font-semibold'>{item.name}</p>
              <p className='mt-0.5 truncate text-xs opacity-60'>{item.description}</p>
            </button>
          ))}
          {items.length === 0 && (
            <div className='p-8 text-center text-xs text-neutral-600 italic'>{t('emptyState')}</div>
          )}
        </div>
      </div>
    </section>
  )
}
