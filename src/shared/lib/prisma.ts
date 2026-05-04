import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '@prisma/client'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL_REMOTE || process.env.DATABASE_URL

const prismaClientSingleton = () => {
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Ejecuta `fn` dentro de una transacción donde `app.current_user_id` está
 * establecido con `set_config(..., true)` (equivalente a SET LOCAL).
 * Esto garantiza que las políticas RLS de Supabase reciben el userId correcto
 * antes de cualquier query, usando siempre la misma conexión.
 *
 * @example
 * const result = await withRLS(userId, (db) =>
 *   db.monsterTemplate.create({ data })
 * )
 */
export async function withRLS<T>(
  userId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`
    return fn(tx)
  })
}
