export const ENCYCLOPEDIA_KEYS = {
  all: ['encyclopedia'] as const,
  bestiary: () => [...ENCYCLOPEDIA_KEYS.all, 'bestiary'] as const,
  cast: () => [...ENCYCLOPEDIA_KEYS.all, 'cast'] as const,
  museum: () => [...ENCYCLOPEDIA_KEYS.all, 'museum'] as const,
}
