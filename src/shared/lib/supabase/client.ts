import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/** Cliente SSR para uso en Client Components (usa anon key + cookies de sesión). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Crea un cliente de Supabase autenticado con el token JWT de Clerk.
 * Se utiliza para operaciones de Storage protegidas por RLS donde el
 * usuario debe estar identificado (ej: uploads desde el browser).
 */
export function getSupabaseClient(supabaseToken: string) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseToken}`,
        },
      },
    }
  )
}
