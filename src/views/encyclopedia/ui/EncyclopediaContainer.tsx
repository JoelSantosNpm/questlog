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
      <ListView items={currentItems} />
      <DetailView item={selectedItem} activeSection={activeSection} />
    </>
  )
}
