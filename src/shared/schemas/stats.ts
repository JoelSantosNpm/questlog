import { z } from 'zod'

/**
 * Esquema de Estadísticas Atómicas (D&D 5e Standard)
 * Este esquema será la base para MonsterTemplate, CharacterTemplate, etc.
 */
export const StatsSchema = z.object({
  strength: z.number().int().min(1).max(30).default(10),
  dexterity: z.number().int().min(1).max(30).default(10),
  constitution: z.number().int().min(1).max(30).default(10),
  intelligence: z.number().int().min(1).max(30).default(10),
  wisdom: z.number().int().min(1).max(30).default(10),
  charisma: z.number().int().min(1).max(30).default(10),
})

export const CombatStatsSchema = z.object({
  ac: z.number().int().min(0).max(40).default(10),
  speed: z.number().int().min(0).default(30),
  initiativeBonus: z.number().int().default(0),
  perception: z.number().int().default(10),
})

export type Stats = z.infer<typeof StatsSchema>
export type CombatStats = z.infer<typeof CombatStatsSchema>
