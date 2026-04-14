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
      return `${BASE()}/unknown_item.png`
    },
    get NPC_DEFAULT() {
      // return `${BASE()}/npc-placeholder.png`
      return `${BASE()}/unknown_chr_3D.png`
    },
    get NPC_PORTRAIT_DEFAULT() {
      return `${BASE()}/unknown_chr.png`
    },
  },

  // Función para construir rutas de usuario
  userContent: (userId: string, section: 'monsters' | 'npcs' | 'items', fileName: string) => {
    return `${userId}/${section}/${fileName}`
  },
}

// ************  DEFAULT IMAGE  ************

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

/** Devuelve la lista ordenada de URLs a intentar, garantizando siempre al menos el default. */
export function getEntityFallbacks(
  section: 'bestiary' | 'cast' | 'museum',
  ...urls: (string | null | undefined)[]
): string[] {
  const valid = urls.filter((u): u is string => Boolean(u?.trim()))
  return [...valid, getDefaultImage(section)]
}

// ************  PORTRAIT IMAGE  ************

function getPortraitDefault(section: 'bestiary' | 'cast'): string {
  switch (section) {
    case 'bestiary':
      return STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT
    case 'cast':
      return STORAGE_PATHS.SYSTEM.NPC_PORTRAIT_DEFAULT
  }
}

/** Devuelve la lista ordenada de URLs de retrato a intentar, garantizando siempre el default. */
export function getPortraitFallbacks(
  section: 'bestiary' | 'cast',
  ...urls: (string | null | undefined)[]
): string[] {
  const valid = urls.filter((u): u is string => Boolean(u?.trim()))
  return [...valid, getPortraitDefault(section)]
}
