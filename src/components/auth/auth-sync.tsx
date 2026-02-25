import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function AuthSync() {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const user = await currentUser()
    if (!user) return null

    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      console.error('❌ User has no email address, skipping sync:', userId)
      return null
    }

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        image: user.imageUrl,
      },
      create: {
        clerkId: userId,
        email,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        image: user.imageUrl,
      },
    })
  } catch (error) {
    console.error('❌ Error syncing user to Database:', error)
  }

  return null
}
