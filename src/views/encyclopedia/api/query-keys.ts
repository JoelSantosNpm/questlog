export const ENCYCLOPEDIA_KEYS = {
  all: ['encyclopedia'] as const,
  bestiary: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    [...ENCYCLOPEDIA_KEYS.all, 'bestiary', visibility, ownership, clerkId] as const,
  cast: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    [...ENCYCLOPEDIA_KEYS.all, 'cast', visibility, ownership, clerkId] as const,
  museum: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    [...ENCYCLOPEDIA_KEYS.all, 'museum', visibility, ownership, clerkId] as const,
}
