import type { Campaign as PortalCampaign } from '@/shared/api/campaign'
import { getQueryClient } from '@/shared/api/query-client'
import { prefetchCampaignList } from '@/views/campaigns'
import { PortalCarousel } from '@/views/portal'
import { SignedIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export const revalidate = 0 // Forzar regeneración dinámica en cada request

export default async function PortalsPage() {
  const { userId } = await auth()
  const queryClient = getQueryClient()

  const dbCampaigns = await prefetchCampaignList(queryClient)

  const allCampaigns: PortalCampaign[] = [
    ...dbCampaigns,
    ...(userId ? [{ id: 'new-campaign', name: 'Nueva Campaña', variant: 'new' as const }] : []),
  ]

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <div className='absolute left-4 top-4 sm:left-6 sm:top-6 z-50'>
        <SignedIn>
          <Link
            href='/dashboard'
            className='rounded-md border border-stone-700 bg-stone-900/80 px-4 py-2 text-sm text-neutral-300 backdrop-blur-md transition-colors hover:bg-stone-800 hover:text-white'
          >
            &larr; Volver al Panel
          </Link>
        </SignedIn>
      </div>
      <PortalCarousel campaigns={allCampaigns} />
    </div>
  )
}
