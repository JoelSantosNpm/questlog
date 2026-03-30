import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'
import { MonsterTemplate, CharacterTemplate, ItemTemplate } from '@prisma/client'

// Extendemos los modelos de Prisma con el discriminador 'type' para la UI
export type BestiaryItem = MonsterTemplate & { type: 'bestiary' }
export type DramatisPersonaeItem = CharacterTemplate & { type: 'dramatis-personae' }
export type MuseumItem = ItemTemplate & { type: 'museum' }

export type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
