import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { PortalCarousel } from './components/portal/portal-carousel'

export default async function Home() {
  const user = await currentUser()

  if (user) {
    // Lazy Sync: Ensure user exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || 'no-email@example.com',
          name: user.fullName || user.username || 'Traveler',
          image: user.imageUrl,
        },
      })
    }
  }

  return (
    <div className='relative flex h-full w-full items-center justify-center overflow-hidden'>
      <PortalCarousel />
    </div>
  )
}
