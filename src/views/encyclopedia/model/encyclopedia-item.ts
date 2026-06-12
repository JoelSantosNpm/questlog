import type { CharacterTemplate, ItemTemplate, MonsterTemplate } from '@prisma/client'
import { LucideIcon } from 'lucide-react'

export type EncyclopediaSection = 'bestiary' | 'cast' | 'museum'

// 'section' discriminador de UI — no colisiona con MonsterTemplate.type (tipo de criatura)
// 'isOwner' habilita los botones de edición/borrado en DetailView
export type BestiaryItem = MonsterTemplate & { section: 'bestiary'; isOwner: boolean }
export type CastItem = CharacterTemplate & { section: 'cast'; isOwner: boolean }
export type MuseumItem = ItemTemplate & { section: 'museum'; isOwner: boolean }

export type EncyclopediaItem = BestiaryItem | CastItem | MuseumItem

export type EncyclopediaVisibility = 'public' | 'private' | 'all'
export type EncyclopediaOwnership = 'mine' | 'shared' | 'both'

export interface SectionConfig {
  id: EncyclopediaSection
  icon: LucideIcon
}
