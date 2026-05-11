import type { CharacterTemplate, ItemTemplate, MonsterTemplate } from '@prisma/client'
import { LucideIcon } from 'lucide-react'

export type EncyclopediaSection = 'bestiary' | 'cast' | 'museum'

// 'section' discriminador de UI — no colisiona con MonsterTemplate.type (tipo de criatura)
export type BestiaryItem = MonsterTemplate & { section: 'bestiary' }
export type CastItem = CharacterTemplate & { section: 'cast' }
export type MuseumItem = ItemTemplate & { section: 'museum' }

export type EncyclopediaItem = BestiaryItem | CastItem | MuseumItem

export type EncyclopediaVisibility = 'public' | 'private' | 'all'
export type EncyclopediaOwnership = 'mine' | 'shared' | 'both'

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
