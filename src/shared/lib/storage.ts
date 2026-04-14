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

function getDefaultImage(section: 'bestiary' | 'cast' | 'museum'): string {
  switch (section) {
    case 'bestiary':
      return STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT
    case 'museum':
      return STORAGE_PATHS.SYSTEM.ITEM_DEFAULT
    case 'cast':
      return STORAGE_PATHS.SYSTEM.NPC_DEFAULT
  }
}

export function getEntityImage(
  imageUrl: string | null,
  section: 'bestiary' | 'cast' | 'museum'
): string {
  return getEntityFallbacks(section, imageUrl)[0]
}

/** Devuelve la lista ordenada de URLs a intentar, garantizando siempre al menos el default. */
export function getEntityFallbacks(
  section: 'bestiary' | 'cast' | 'museum',
  ...urls: (string | null | undefined)[]
): string[] {
  const valid = urls.filter((u): u is string => Boolean(u?.trim()))
  return [...valid, getDefaultImage(section)]
}

export function getPortraitImage(
  portraitImageUrl: string | null,
  section: 'bestiary' | 'cast',
  imageUrl?: string | null
): string {
  if (portraitImageUrl && portraitImageUrl.trim() !== '') return portraitImageUrl
  if (imageUrl && imageUrl.trim() !== '') return imageUrl

  switch (section) {
    case 'bestiary':
      return STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT
    case 'cast':
      return STORAGE_PATHS.SYSTEM.NPC_PORTRAIT_DEFAULT
    default:
      return STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT
  }
}
