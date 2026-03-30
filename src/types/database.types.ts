export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerkId: string
          email: string
          name: string | null
          image: string | null
          plan: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          clerkId: string
          email: string
          name?: string | null
          image?: string | null
          plan?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          clerkId?: string
          email?: string
          name?: string | null
          image?: string | null
          plan?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          description: string | null
          imageUrl: string | null
          system: string
          location: string | null
          nextSession: string | null
          isPrivate: boolean
          parentCampaignId: string | null
          gameMasterId: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          imageUrl?: string | null
          system?: string
          location?: string | null
          nextSession?: string | null
          isPrivate?: boolean
          parentCampaignId?: string | null
          gameMasterId: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          imageUrl?: string | null
          system?: string
          location?: string | null
          nextSession?: string | null
          isPrivate?: boolean
          parentCampaignId?: string | null
          gameMasterId?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      monster_templates: {
        Row: {
          id: string
          name: string
          type: string
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
          abilities: Json | null
          authorId: string | null
          isPublished: boolean
          price: number
          version: number
          createdAt: string
          updatedAt: string
        }
        // ... Insert y Update seguirían el mismo patrón camelCase
      }
    }
  }
}
