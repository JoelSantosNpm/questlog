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
  prismaAdmin: ReturnType<typeof prismaClientSingleton> | undefined
}

/**
 * ES: Cliente Prisma con rol `postgres` (superusuario). Bypasea RLS completamente.
 * Usar SOLO en operaciones de sistema sin contexto de usuario:
 *   - Clerk webhook (sincronización de usuarios)
 *   - AuthSync (creación inicial del registro User)

 */
export const prismaAdmin = globalForPrisma.prismaAdmin ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaAdmin = prismaAdmin

/**
 * ES: Ejecuta `fn` dentro de una transacción que:
 *   1. Cambia el rol a `authenticated` (SET LOCAL ROLE) → Postgres aplica RLS.
 *   2. Establece `app.current_user_id = userId` (set_config IS LOCAL) → las
 *      políticas RLS identifican al usuario actual via `current_user_id()`.
 * Usar en todas las Server Actions y queries de datos de usuario final.
 
 * @example
 * const result = await withRLS(clerkId, (db) =>
 *   db.monsterTemplate.create({ data })
 * )
 */
export async function withRLS<T>(
  userId: string,
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prismaAdmin.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL ROLE authenticated`
    await tx.$executeRaw`SELECT set_config('app.current_user_id', ${userId}, true)`
    return fn(tx)
  })
}

/**
 * @example
 * const items = await withPublicRLS((db) =>
 *   db.monsterTemplate.findMany({ orderBy: { name: 'asc' } })
 * )
 */
export async function withPublicRLS<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prismaAdmin.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL ROLE authenticated`
    return fn(tx)
  })
}
