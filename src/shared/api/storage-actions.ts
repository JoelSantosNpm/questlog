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
export type StorageActionError = 'unauthenticated' | 'uploadFailed'

export async function uploadAsset(
  formData: FormData
): Promise<{ publicUrl: string } | { error: StorageActionError }> {
  const { userId } = await auth()
  if (!userId) return { error: 'unauthenticated' }

  const file = formData.get('file')
  const storagePath = formData.get('storagePath')

  if (!(file instanceof File)) return { error: 'uploadFailed' }
  if (typeof storagePath !== 'string' || !storagePath) return { error: 'uploadFailed' }

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

  if (error) {
    console.error('[storage] uploadAsset failed', error)
    return { error: 'uploadFailed' }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('questlog-assets').getPublicUrl(filePath)

  return { publicUrl }
}

export async function deleteAssetSafe(url: string): Promise<void> {
  const result = await deleteAsset(url)
  if ('error' in result) {
    const retry = await deleteAsset(url)
    if ('error' in retry) {
      console.error('[storage] deleteAsset permanentFailure', { url, error: retry.error })
    }
  }
}

export async function deleteAsset(
  publicUrl: string
): Promise<{ success: true } | { error: StorageActionError }> {
  const { userId } = await auth()
  if (!userId) return { error: 'unauthenticated' }

  const bucket = 'questlog-assets'
  const marker = `/object/public/${bucket}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return { success: true }

  const filePath = publicUrl.slice(idx + marker.length)
  const supabase = createClient()
  await supabase.storage.from(bucket).remove([filePath])
  return { success: true }
}
