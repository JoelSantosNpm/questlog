'use client'

import React from 'react'
import { Skull, Users, Landmark } from 'lucide-react'
import { useEncyclopediaStore } from '@/components/encyclopedia/encyclopediaStore'
import { SideTabs } from '@/components/encyclopedia/SideTabs'
import { ListView } from '@/components/encyclopedia/ListView'
import { DetailView } from '@/components/encyclopedia/DetailView'
import { EncyclopediaItem, SectionConfig } from '@/components/encyclopedia/types'
import { Rarity } from '@prisma/client'
import { MonsterTemplate, CharacterTemplate, ItemTemplate } from '@prisma/client'

// Datos de prueba que cumplen con el esquema de Prisma
const MOCK_DATA: Record<string, EncyclopediaItem[]> = {
  bestiary: [
    {
      id: '1',
      name: 'Dragón Negro',
      description: 'Un dragón cruel que habita en pantanos fétidos.',
      challenge: 14,
      maxHp: 195,
      ac: 19,
      speed: 40,
      strength: 23,
      dexterity: 14,
      constitution: 21,
      intelligence: 14,
      wisdom: 13,
      charisma: 17,
      imageUrl: '',
      abilities: {},
      authorId: null,
      isPublished: true,
      price: 0,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      initiativeBonus: 2,
      perception: 21,
      type: 'Dragon', // Este es el campo 'type' del modelo MonsterTemplate de Prisma
    } as MonsterTemplate, // Usamos as any brevemente para el mock por los campos complejos como Json o Enums
    {
      id: '2',
      name: 'Beholder',
      description: 'Un horror flotante con múltiples ojos mágicos.',
      challenge: 13,
      maxHp: 180,
      ac: 18,
      speed: 20,
      strength: 10,
      dexterity: 14,
      constitution: 18,
      intelligence: 17,
      wisdom: 15,
      charisma: 17,
      imageUrl: '',
      abilities: {},
      authorId: null,
      isPublished: true,
      price: 0,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      initiativeBonus: 2,
      perception: 22,
      type: 'Aberration',
    } as MonsterTemplate,
  ],
  character: [
    {
      type: 'Elf',
      id: '3',
      name: 'Elara Moonwhisper',
      description: 'Una elfa sabia con siglos de conocimiento.',
      strength: 8,
      dexterity: 16,
      constitution: 12,
      intelligence: 20,
      wisdom: 18,
      charisma: 14,
      ac: 15,
      speed: 30,
      imageUrl: '   ',
      authorId: null,
      isPublished: true,
      version: 1,
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      initiativeBonus: 3,
      perception: 18,
    } as CharacterTemplate,
  ],
  museum: [
    {
      id: '4',
      name: 'Cáliz de Almas',
      description: 'Un artefacto oscuro que consume la esencia vital.',
      category: 'Artefacto',
      value: 5000,
      rarity: Rarity.ARTIFACT,
      imageUrl: '/ruta-inexistente.png',
      isPublic: true,
      creatorId: null,
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
      ac: 0,
      speed: 0,
      initiativeBonus: 0,
      perception: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ItemTemplate,
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
  const selectedItem = currentItems.find((item) => item.id === selectedItemId) || currentItems[0]

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
