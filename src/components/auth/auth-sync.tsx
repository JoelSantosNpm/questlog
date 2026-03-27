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

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()

    // Intentamos encontrar al usuario por email para evitar colisiones de restricción única
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUserByEmail && existingUserByEmail.clerkId !== userId) {
      // Si el email ya existe pero con otro ID, actualizamos el registro para vincularlo al nuevo clerkId
      await prisma.user.update({
        where: { email },
        data: {
          clerkId: userId,
          name: fullName,
          image: user.imageUrl,
        },
      })
    } else {
      // Procedemos con el upsert normal basado en clerkId
      await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email,
          name: fullName,
          image: user.imageUrl,
        },
        create: {
          clerkId: userId,
          email,
          name: fullName,
          image: user.imageUrl,
        },
      })
    }
  } catch (error) {
    console.error('❌ Error syncing user to Database:', error)
  }

  return null
}
