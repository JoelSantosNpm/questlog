'use client'

import { useTranslations } from 'next-intl'
import type { ComponentType } from 'react'
import { useEffect } from 'react'
import { sileo } from 'sileo'
import { useCurrentItems } from '../lib/use-encyclopedia-items'
import type { EncyclopediaSection } from '../model/encyclopedia-item'
import { useActiveSection, useIsCreatingNew } from '../model/encyclopediaStore'
import { CharacterCreationView } from './character-creation/CharacterCreationView'
import { DetailView } from './DetailView'
import { ItemCreationView } from './item-creation/ItemCreationView'
import { ListView } from './ListView'
import { MobileListDrawer } from './MobileListDrawer'
import { MonsterCreationView } from './monster-creation/MonsterCreationView'

const CREATION_VIEWS: Record<EncyclopediaSection, ComponentType> = {
  bestiary: MonsterCreationView,
  cast: CharacterCreationView,
  museum: ItemCreationView,
}

export function EncyclopediaContainer() {
  const currentItems = useCurrentItems()
  const isCreatingNew = useIsCreatingNew()
  const activeSection = useActiveSection()
  const t = useTranslations('Encyclopedia.swipeHint')

  useEffect(() => {
    sileo.info({
      position: 'top-center',
      title: t('title'),
      description: t('description'),
      styles: {
        title: 'text-gray-300/90!',
        description: 'text-gray-500/90! center',
      },
    })
  }, [t])

  const CreationView = CREATION_VIEWS[activeSection]

  return (
    <>
      {/* Sidebar: visible en md+ */}
      <div className='hidden lg:flex lg:w-[20vw] lg:shrink-0 lg:h-full'>
        <ListView items={currentItems} />
      </div>

      {/* Drawer: visible en < md */}
      <MobileListDrawer items={currentItems} />

      {isCreatingNew ? <CreationView /> : <DetailView />}
    </>
  )
}
