import { SupabaseClient } from '@supabase/supabase-js'

export const StorageService = {
  /**
   * Sube un archivo al bucket questlog-assets.
   * El caller es responsable de construir filePath y el cliente autenticado.
   */
  async uploadFile(params: { supabase: SupabaseClient; filePath: string; file: File }) {
    const { supabase, filePath, file } = params

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
