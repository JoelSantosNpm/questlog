'use client'

import { useActiveSection, useCurrentItems, useSelectedItem } from '../model/encyclopediaStore'
import { ListView } from './ListView'
import { DetailView } from './DetailView'

export function EncyclopediaContainer() {
  const activeSection = useActiveSection()
  const currentItems = useCurrentItems()
  const selectedItem = useSelectedItem()

  return (
    <>
      <div className='w-[20vw] shrink-0'>
        <ListView items={currentItems} />
      </div>
      <DetailView item={selectedItem} activeSection={activeSection} />
    </>
  )
}
