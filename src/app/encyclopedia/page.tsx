import { getQueryClient } from '@/shared/api/query-client'
import { EncyclopediaContainer, prefetchEncyclopediaData, SideTabs } from '@/views/encyclopedia'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'

export default async function EncyclopediaPage() {
  const queryClient = getQueryClient()

  await prefetchEncyclopediaData(queryClient)

  return (
    <div className='relative flex w-full h-[calc(100vh-var(--header-h)-var(--footer-h))] font-sans overflow-hidden'>
      <div className='absolute inset-0 bg-black/60' />
      <div className='relative flex w-full h-full'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SideTabs />
          <EncyclopediaContainer />
        </HydrationBoundary>
      </div>
    </div>
  )
}
