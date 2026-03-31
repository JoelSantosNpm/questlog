'use client'

import { useEncyclopediaStore } from './encyclopediaStore'
import { ListView } from './ListView'
import { DetailView } from './DetailView'

export function EncyclopediaContainer() {
  const { activeSection, selectedItemId, itemsBySection } = useEncyclopediaStore()

  const currentItems = itemsBySection[activeSection] || []
  const selectedItem = currentItems.find((item) => item.id === selectedItemId) ?? currentItems[0]

  return (
    <>
      <ListView items={currentItems} />
      <DetailView item={selectedItem} activeSection={activeSection} />
    </>
  )
}
