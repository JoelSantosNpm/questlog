import { PortalCarousel } from '@/components/portal'
import { getUserCampaigns } from '@/data/campaign-queries'
import { Campaign as PortalCampaign } from '@/types/ui/portal'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export const revalidate = 0 // Forzar regeneración dinámica en cada request

export default async function PortalsPage() {
  await auth.protect()

  const dbCampaigns = await getUserCampaigns()

  const allCampaigns: PortalCampaign[] = [
    ...dbCampaigns,
    {
      id: 'new-campaign',
      name: 'Nueva Campaña',
      variant: 'new',
    },
  ]

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <div className='absolute left-4 top-4 sm:left-6 sm:top-6 z-50'>
        <Link
          href='/dashboard'
          className='rounded-md border border-stone-700 bg-stone-900/80 px-4 py-2 text-sm text-neutral-300 backdrop-blur-md transition-colors hover:bg-stone-800 hover:text-white'
        >
          &larr; Volver al Panel
        </Link>
      </div>
      <PortalCarousel campaigns={allCampaigns} />
    </div>
  )
}
