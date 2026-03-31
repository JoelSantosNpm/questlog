import type { MonsterTemplate, CharacterTemplate, ItemTemplate } from '@prisma/client'
import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'

// 'section' discriminador de UI — no colisiona con MonsterTemplate.type (tipo de criatura)
export type BestiaryItem = MonsterTemplate & { section: 'bestiary' }
export type DramatisPersonaeItem = CharacterTemplate & { section: 'dramatis-personae' }
export type MuseumItem = ItemTemplate & { section: 'museum' }

export type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
