export const CAMPAIGN_KEYS = {
  all: ['campaigns'] as const,
  list: () => [...CAMPAIGN_KEYS.all, 'list'] as const,
  detail: (id: string) => [...CAMPAIGN_KEYS.all, 'detail', id] as const,
}
