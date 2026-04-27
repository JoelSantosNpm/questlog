export type CampaignFormValues = {
  name: string
  location?: string
  isPublic?: boolean
}
export type CampaignFilter = 'all' | 'public' | 'owned'
