export const ENCYCLOPEDIA_KEYS = {
  all: ['encyclopedia'] as const,
  bestiaryBase: ['encyclopedia', 'bestiary'] as const,
  castBase: ['encyclopedia', 'cast'] as const,
  museumBase: ['encyclopedia', 'museum'] as const,
  bestiary: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    ['encyclopedia', 'bestiary', visibility, ownership, clerkId] as const,
  cast: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    ['encyclopedia', 'cast', visibility, ownership, clerkId] as const,
  museum: (visibility = 'public', ownership = 'both', clerkId?: string) =>
    ['encyclopedia', 'museum', visibility, ownership, clerkId] as const,
}
