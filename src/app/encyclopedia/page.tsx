import React from 'react'
import { Skull, Users, Landmark } from 'lucide-react'
import { SideTabs } from '@/components/encyclopedia/SideTabs'
import { ListView } from '@/components/encyclopedia/ListView'
import { DetailView } from '@/components/encyclopedia/DetailView'
import { SectionConfig } from '@/components/encyclopedia/types'
import { getBestiaryItems, getCharacterTemplates, getMuseumItems } from '@/data/encyclopedia-queries'
import { EncyclopediaStoreInitializer } from '@/components/encyclopedia/EncyclopediaStoreInitializer'

const SECTIONS: SectionConfig[] = [
  { id: 'bestiary', label: 'Bestiario', icon: Skull },
  { id: 'dramatis-personae', label: 'Personajes', icon: Users },
  { id: 'museum', label: 'Museo', icon: Landmark },
]

export default async function EncyclopediaPage() {
  // Fetch data in parallel on the server
  const [bestiary, characters, museum] = await Promise.all([
    getBestiaryItems(),
    getCharacterTemplates(),
    getMuseumItems(),
  ])

  const allData = {
    bestiary,
    'dramatis-personae': characters,
    museum,
  }

  return (
    <div className='flex h-[calc(100vh-64px)] w-full overflow-hidden bg-neutral-950 font-sans'>
      {/* Initialize Zustand store with server data */}
      <EncyclopediaStoreInitializer data={allData} />

      <SideTabs sections={SECTIONS} />

      {/* The following components will now consume data from the store initialized above */}
      <EncyclopediaContainer />
    </div>
  )
}

/**
 * Client component to handle interactive state after server fetch
 */
'use client'
import { useEncyclopediaStore } from '@/components/encyclopedia/encyclopediaStore'

function EncyclopediaContainer() {
  const { activeSection, selectedItemId, itemsBySection } = useEncyclopediaStore()

  const currentItems = itemsBySection[activeSection] || []
  const selectedItem = currentItems.find((item) => item.id === selectedItemId) || currentItems[0]

  return (
    <>
      <ListView items={currentItems} />
      <DetailView item={selectedItem} activeSection={activeSection} />
    </>
  )
}
