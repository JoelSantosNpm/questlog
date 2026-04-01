// lib/storage.ts

const BASE = () =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/system/defaults`

export const STORAGE_PATHS = {
  SYSTEM: {
    get MONSTER_DEFAULT() {
      return `${BASE()}/monster-placeholder.png`
    },
    get ITEM_DEFAULT() {
      return `${BASE()}/item-placeholder.png`
    },
    get NPC_DEFAULT() {
      return `${BASE()}/npc-placeholder.png`
    },
  },

  // Función para construir rutas de usuario
  userContent: (userId: string, section: 'monsters' | 'npcs' | 'items', fileName: string) => {
    return `${userId}/${section}/${fileName}`
  },
}

export function getEntityImage(
  imageUrl: string | null,
  section: 'BESTIARY' | 'MUSEUM' | 'DRAMATIS_PERSONAE'
): string {
  if (imageUrl && imageUrl.trim() !== '') return imageUrl

  switch (section) {
    case 'BESTIARY':
      return STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT
    case 'MUSEUM':
      return STORAGE_PATHS.SYSTEM.ITEM_DEFAULT
    case 'DRAMATIS_PERSONAE':
      return STORAGE_PATHS.SYSTEM.NPC_DEFAULT
    default:
      return STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT
  }
}
