'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

/**
 * Sube un archivo al bucket questlog-assets desde el servidor usando service_role.
 *
 * Usar service_role evita el problema de owner_id: Supabase lo deja en NULL
 * (DEFAULT) en lugar de intentar parsear el Clerk ID como UUID.
 *
 * La autorización se delega a Clerk — requireUserId() garantiza que solo
 * usuarios autenticados pueden llamar a esta action.
 *
 * Estructura de rutas:
 *   {clerkId}/{storagePath}/{timestamp}-{filename}
 *
 * Ejemplos de storagePath:
 *   'assets'              → subida genérica
 *   'campaigns/abc123'    → imagen de campaña (activa RLS de membresía en SELECT/DELETE)
 *   'characters'          → imagen de personaje
 */
export async function uploadAsset(formData: FormData): Promise<{ publicUrl: string }> {
  const { userId } = await auth()
  if (!userId) throw new Error('No autenticado')

  const file = formData.get('file')
  const storagePath = formData.get('storagePath')

  if (!(file instanceof File)) throw new Error('Archivo inválido')
  if (typeof storagePath !== 'string' || !storagePath) throw new Error('storagePath requerido')

  const supabase = createClient()

  const fileExt = file.name.split('.').pop()
  const cleanFileName = file.name
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
  const filePath = `${userId}/${storagePath}/${Date.now()}-${cleanFileName}.${fileExt}`

  const bytes = await file.arrayBuffer()
  const { error } = await supabase.storage.from('questlog-assets').upload(filePath, bytes, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from('questlog-assets').getPublicUrl(filePath)

  return { publicUrl }
}
