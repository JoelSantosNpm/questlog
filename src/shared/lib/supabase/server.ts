import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para uso exclusivo en Server Components y Server Actions.
 * Usa la service role key para conectarse directamente a la DB sin pasar por RLS,
 * equivalente al comportamiento anterior de Prisma. La autorización se delega a
 * Clerk (middleware + auth()).
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
