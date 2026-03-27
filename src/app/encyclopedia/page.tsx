'use client'

import React from 'react'
import { Skull, Users, Landmark } from 'lucide-react'
import { useEncyclopediaStore } from '@/components/encyclopedia/encyclopediaStore'
import { SideTabs } from '@/components/encyclopedia/SideTabs'
import { ListView } from '@/components/encyclopedia/ListView'
import { DetailView } from '@/components/encyclopedia/DetailView'
import { EncyclopediaItem, SectionConfig } from '@/components/encyclopedia/types'

const MOCK_DATA: Record<string, EncyclopediaItem[]> = {
  bestiary: [
    {
      type: 'bestiary',
      id: '1',
      name: 'Dragón Negro',
      description: 'Un dragón cruel que habita en pantanos fétidos.',
      stats: 'Fuerza 23, CA 19',
      image: '/portal.png',
    },
    {
      type: 'bestiary',
      id: '2',
      name: 'Beholder',
      description: 'Un horror flotante con múltiples ojos mágicos.',
      stats: 'Fuerza 10, CA 18',
      image: '',
    },
  ],
  'dramatis-personae': [
    {
      type: 'dramatis-personae',
      id: '3',
      name: 'Elara Moonwhisper',
      role: 'Archimaga de la Torre de Marfil',
      description: 'Una elfa sabia con siglos de conocimiento.',
      image: '   ',
    },
  ],
  museum: [
    {
      type: 'museum',
      id: '4',
      name: 'Cáliz de Almas',
      origin: 'Antiguo Imperio de Nerath',
      description: 'Un artefacto oscuro que consume la esencia vital.',
      image: '/ruta-inexistente.png',
    },
  ],
}

const SECTIONS: SectionConfig[] = [
  { id: 'bestiary', label: 'Bestiario', icon: Skull },
  { id: 'dramatis-personae', label: 'Personajes', icon: Users },
  { id: 'museum', label: 'Museo', icon: Landmark },
]

export default function EncyclopediaPage() {
  const { activeSection, selectedItemId } = useEncyclopediaStore()

  const currentItems = MOCK_DATA[activeSection] || []
  const selectedItem =
    currentItems.find((item) => item.id === selectedItemId) || currentItems[0]

  return (
    <div className='flex h-[calc(100vh-64px)] w-full overflow-hidden bg-neutral-950 font-sans'>
      {/* 1. Side Tabs (Rotated 90º) */}
      <SideTabs sections={SECTIONS} />

      {/* 2. List View (Filtered) */}
      <ListView items={currentItems} />

      {/* 3. Detail View */}
      <DetailView item={selectedItem} activeSection={activeSection} />
    </div>
  )
}
