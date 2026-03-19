import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // En desarrollo, esto nos avisará inmediatamente si olvidamos el .env
  console.warn('⚠️ Advertencia: Las variables de entorno de Supabase no están configuradas.')
}

// Cliente estándar para peticiones públicas
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

/**
 * Crea un cliente de Supabase autenticado dinámicamente con el token de Clerk.
 * Se utiliza para operaciones de Storage protegidas por RLS.
 */
export const getSupabaseClient = (supabaseToken: string) => {
  return createClient(supabaseUrl || '', supabaseAnonKey || '', {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`,
      },
    },
  })
}
