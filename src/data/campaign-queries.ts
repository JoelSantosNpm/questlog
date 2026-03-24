import prisma from '@/lib/prisma'
import { Campaign as PortalCampaign } from '@/types/ui/portal'
import { auth } from '@clerk/nextjs/server'

export async function getUserCampaigns(): Promise<PortalCampaign[]> {
  const { userId } = await auth()

  if (!userId) return []

  const campaigns = await prisma.campaign.findMany({
    where: {
      gameMaster: {
        clerkId: userId,
      },
    },
    select: {
      id: true,
      name: true,
    },
  })

  return campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    variant: 'existing',
  }))
}

export async function getCampaignById(id: string) {
  const { userId } = await auth()

  if (!userId) return null

  return prisma.campaign.findFirst({
    where: {
      id,
      gameMaster: {
        clerkId: userId,
      },
    },
  })
}
