import type { MonsterTemplate, CharacterTemplate, ItemTemplate } from '@prisma/client'
import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'

// MonsterTemplate has a 'type' column (e.g. "Undead") that conflicts with the discriminator.
// We Omit it and expose it as 'monsterType' instead.
export type BestiaryItem = Omit<MonsterTemplate, 'type'> & {
  type: 'bestiary'
  monsterType: string
}

export type DramatisPersonaeItem = CharacterTemplate & {
  type: 'dramatis-personae'
}

export type MuseumItem = ItemTemplate & {
  type: 'museum'
}

export type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
