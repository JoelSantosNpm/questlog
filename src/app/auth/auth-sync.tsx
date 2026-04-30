import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/shared/lib/prisma'

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

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

    // Buscamos si el usuario ya existe por email o clerkId
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: email,
        name: fullName,
        image: user.imageUrl,
        updatedAt: new Date(),
      },
      create: {
        clerkId: userId,
        email: email,
        name: fullName,
        image: user.imageUrl,
      },
    })
  } catch (error) {
    console.error('❌ Error syncing user to Supabase via Prisma:', error)
  }

  return null
}
