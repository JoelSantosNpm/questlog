import { auth } from '@clerk/nextjs/server'

/**
 * Retorna el userId de Clerk de la sesión activa.
 * Lanza un error si no hay sesión — uso exclusivo en Server Actions y Route Handlers.
 */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}
