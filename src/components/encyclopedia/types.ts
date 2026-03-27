import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'

export interface BestiaryItem {
  type: 'bestiary'
  id: string
  name: string
  description: string
  image?: string
  stats: string
}

export interface DramatisPersonaeItem {
  type: 'dramatis-personae'
  id: string
  name: string
  description: string
  image?: string
  role: string
}

export interface MuseumItem {
  type: 'museum'
  id: string
  name: string
  description: string
  image?: string
  origin: string
}

export type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
