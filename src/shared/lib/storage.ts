// lib/storage.ts

const BASE = () =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/system/defaults`

export const STORAGE_PATHS = {
  SYSTEM: {
    get MONSTER_DEFAULT() {
      // return `${BASE()}/monster-placeholder.png`
      return `${BASE()}/Lobo_Barovia_3D_test3.png`
    },
    get MONSTER_PORTRAIT_DEFAULT() {
      return `${BASE()}/Lobo_Barovia.png`
    },
    get ITEM_DEFAULT() {
      return `${BASE()}/item-placeholder.png`
    },
    get NPC_DEFAULT() {
      // return `${BASE()}/npc-placeholder.png`
      return `${BASE()}/personaje_3D_test2.png`
    },
    get NPC_PORTRAIT_DEFAULT() {
      return `${BASE()}/personaje_portrait_test1.png`
    },
  },

  // Función para construir rutas de usuario
  userContent: (userId: string, section: 'monsters' | 'npcs' | 'items', fileName: string) => {
    return `${userId}/${section}/${fileName}`
  },
}

export function getEntityImage(
  imageUrl: string | null,
  section: 'bestiary' | 'cast' | 'museum'
): string {
  if (imageUrl && imageUrl.trim() !== '') return imageUrl

  switch (section) {
    case 'bestiary':
      return STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT
    case 'museum':
      return STORAGE_PATHS.SYSTEM.ITEM_DEFAULT
    case 'cast':
      return STORAGE_PATHS.SYSTEM.NPC_DEFAULT
    default:
      return STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT
  }
}

export function getPortraitImage(
  portraitImageUrl: string | null,
  section: 'bestiary' | 'cast'
): string {
  if (portraitImageUrl && portraitImageUrl.trim() !== '') return portraitImageUrl

  switch (section) {
    case 'bestiary':
      return STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT
    case 'cast':
      return STORAGE_PATHS.SYSTEM.NPC_PORTRAIT_DEFAULT
    default:
      return STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT
  }
}
