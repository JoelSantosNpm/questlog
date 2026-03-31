// lib/storage.ts

const BUCKET_NAME = 'questlog-data'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export const STORAGE_PATHS = {
  // Rutas del sistema (estáticas)
  SYSTEM: {
    MONSTER_DEFAULT: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/system/defaults/monster.webp`,
    ITEM_DEFAULT: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/system/defaults/item.webp`,
    NPC_DEFAULT: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/system/defaults/npc.webp`,
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
