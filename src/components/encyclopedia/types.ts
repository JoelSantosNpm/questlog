import { LucideIcon } from 'lucide-react'
import { EncyclopediaSection } from './encyclopediaStore'

// Tipos manuales basados en el schema de Prisma (sin dependencia de @prisma/client)
export interface BestiaryItem {
  type: 'bestiary'
  id: string
  name: string
  imageUrl: string | null
  challenge: number
  maxHp: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  ac: number
  speed: number
  initiativeBonus: number
  perception: number
  abilities: unknown | null
  authorId: string | null
  isPublished: boolean
  price: number
  version: number
  createdAt: string
  updatedAt: string
  // MonsterTemplate has a 'type' column in DB (monster type e.g. "Undead")
  // Renamed here to avoid conflict with the discriminator
  monsterType: string
}

export interface DramatisPersonaeItem {
  type: 'dramatis-personae'
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  ac: number
  speed: number
  initiativeBonus: number
  perception: number
  maxHp: number
  authorId: string | null
  isPublished: boolean
  price: number
  version: number
  createdAt: string
  updatedAt: string
}

export interface MuseumItem {
  type: 'museum'
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  category: string
  weight: number
  value: number
  rarity: 'JUNK' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ARTIFACT'
  isPublic: boolean
  creatorId: string | null
  createdAt: string
  updatedAt: string
}

export type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

export interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}
