export type CampaignFormValues = {
  name: string
  location?: string
  isPublic?: boolean
}

export type CampaignVisibility = 'public' | 'private' | 'all'

export type CampaignOwnership = 'owned' | 'member' | 'both'
