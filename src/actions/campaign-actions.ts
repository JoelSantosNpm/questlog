'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs'

export async function createCampaign(formData: FormData) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string

  if (!name) {
    throw new Error('Name is required')
  }

  await prisma.campaign.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })

  revalidatePath('/')
}
