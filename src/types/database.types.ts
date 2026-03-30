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
          clerk_id: string
          email: string
          name: string | null
          image: string | null
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          name?: string | null
          image?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          name?: string | null
          image?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          system: string
          location: string | null
          next_session: string | null
          is_private: boolean
          parent_campaign_id: string | null
          game_master_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          system?: string
          location?: string | null
          next_session?: string | null
          is_private?: boolean
          parent_campaign_id?: string | null
          game_master_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          system?: string
          location?: string | null
          next_session?: string | null
          is_private?: boolean
          parent_campaign_id?: string | null
          game_master_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      monster_templates: {
        Row: {
          id: string
          name: string
          type: string
          image_url: string | null
          challenge: number
          max_hp: number
          strength: number
          dexterity: number
          constitution: number
          intelligence: number
          wisdom: number
          charisma: number
          ac: number
          speed: number
          initiative_bonus: number
          perception: number
          abilities: Json | null
          author_id: string | null
          is_published: boolean
          price: number
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          image_url?: string | null
          challenge?: number
          max_hp: number
          strength?: number
          dexterity?: number
          constitution?: number
          intelligence?: number
          wisdom?: number
          charisma?: number
          ac?: number
          speed?: number
          initiative_bonus?: number
          perception?: number
          abilities?: Json | null
          author_id?: string | null
          is_published?: boolean
          price?: number
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          image_url?: string | null
          challenge?: number
          max_hp?: number
          strength?: number
          dexterity?: number
          constitution?: number
          intelligence?: number
          wisdom?: number
          charisma?: number
          ac?: number
          speed?: number
          initiative_bonus?: number
          perception?: number
          abilities?: Json | null
          author_id?: string | null
          is_published?: boolean
          price?: number
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Se añadirían el resto de tablas siguiendo el mismo patrón...
    }
    Enums: {
      rarity: 'JUNK' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ARTIFACT'
      resource_type: 'MONSTER_TEMPLATE' | 'ITEM_TEMPLATE' | 'CHARACTER_TEMPLATE' | 'CAMPAIGN'
      access_type: 'VIEW' | 'EDIT'
    }
  }
}
