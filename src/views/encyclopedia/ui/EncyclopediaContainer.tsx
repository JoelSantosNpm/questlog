'use client'

import { useState } from 'react'
import { useActiveSection, useCurrentItems, useSelectedItem } from '../model/encyclopediaStore'
import { ListView } from './ListView'
import { DetailView } from './DetailView'
import { MobileListDrawer } from './MobileListDrawer'

export function EncyclopediaContainer() {
  const activeSection = useActiveSection()
  const currentItems = useCurrentItems()
  const selectedItem = useSelectedItem()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      {/* Sidebar: visible en md+ */}
      <div className='hidden md:flex md:w-[20vw] md:shrink-0'>
        <ListView items={currentItems} />
      </div>

      {/* Drawer: visible en < md */}
      <MobileListDrawer
        items={currentItems}
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      />

      <DetailView item={selectedItem} activeSection={activeSection} />
    </>
  )
}
