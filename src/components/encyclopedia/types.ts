import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'
import { MonsterTemplate, CharacterTemplate, ItemTemplate } from '@prisma/client'

export type EncyclopediaItem = MonsterTemplate | CharacterTemplate | ItemTemplate

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
