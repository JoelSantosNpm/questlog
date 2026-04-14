'use client'

import { useCurrentItems } from '../model/encyclopediaStore'
import { ListView } from './ListView'
import { DetailView } from './DetailView'
import { MobileListDrawer } from './MobileListDrawer'

export function EncyclopediaContainer() {
  const currentItems = useCurrentItems()

  return (
    <>
      {/* Sidebar: visible en md+ */}
      <div className='hidden lg:flex lg:w-[20vw] lg:shrink-0'>
        <ListView items={currentItems} />
      </div>

      {/* Drawer: visible en < md */}
      <MobileListDrawer items={currentItems} />

      <DetailView />
    </>
  )
}
