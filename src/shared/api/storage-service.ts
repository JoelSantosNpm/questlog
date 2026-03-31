import { getSupabaseClient } from '@/shared/lib/supabase'

export const StorageService = {
  /**
   * Sube un archivo al bucket de Supabase con el token de Clerk.
   */
  async uploadFile(params: { file: File; userId: string; category: string; token: string }) {
    const { file, userId, category, token } = params
    const supabase = getSupabaseClient(token)

    const fileExt = file.name.split('.').pop()
    const cleanFileName = file.name
      .split('.')[0]
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()

    const filePath = `${userId}/${category}/${Date.now()}-${cleanFileName}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('questlog-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from('questlog-assets').getPublicUrl(filePath)

    return publicUrl
  },
}
