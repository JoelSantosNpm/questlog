'use client'

import { useEffect } from 'react'
import { sileo } from 'sileo'
import { useCurrentItems } from '../lib/use-encyclopedia-items'
import { useActiveSection, useIsCreatingNew } from '../model/encyclopediaStore'
import { DetailView } from './DetailView'
import { ListView } from './ListView'
import { MobileListDrawer } from './MobileListDrawer'
import { MonsterCreationView } from './MonsterCreationView'

export function EncyclopediaContainer() {
  const currentItems = useCurrentItems()
  const isCreatingNew = useIsCreatingNew()
  const activeSection = useActiveSection()

  useEffect(() => {
    sileo.info({
      position: 'top-center',
      title: 'Consejo',
      description: '← Desliza para ver el siguiente o anterior →',
      styles: {
        title: 'text-gray-300/90!',
        description: 'text-gray-500/90! center',
      },
    })
  }, [])

  return (
    <>
      {/* Sidebar: visible en md+ */}
      <div className='hidden lg:flex lg:w-[20vw] lg:shrink-0 lg:h-full'>
        <ListView items={currentItems} />
      </div>

      {/* Drawer: visible en < md */}
      <MobileListDrawer items={currentItems} />

      {isCreatingNew && activeSection === 'bestiary' ? <MonsterCreationView /> : <DetailView />}
    </>
  )
}
