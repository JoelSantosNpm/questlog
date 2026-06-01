import { getQueryClient } from '@/shared/api/query-client'
import { CampaignPortal, prefetchCampaignList } from '@/views/campaigns'
import { auth } from '@clerk/nextjs/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const revalidate = 0 // Forzar regeneración dinámica en cada request

export default async function PortalsPage() {
  const { userId } = await auth()
  const queryClient = getQueryClient()
  const messages = (await getMessages()) as { Campaigns: unknown }

  await prefetchCampaignList(queryClient, userId ?? undefined)

  return (
    <div className='relative flex flex-1 w-full overflow-hidden'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NextIntlClientProvider messages={{ Campaigns: messages.Campaigns }}>
          <CampaignPortal />
        </NextIntlClientProvider>
      </HydrationBoundary>
    </div>
  )
}
