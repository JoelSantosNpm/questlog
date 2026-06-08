import { getQueryClient } from '@/shared/api/query-client'
import { EncyclopediaContainer, prefetchEncyclopediaData, SideTabs } from '@/views/encyclopedia'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Questlog | Enciclopedia',
  description: 'Explora el bestiario, razas, clases y lore de tus campañas.',
}

export const dynamic = 'force-dynamic'

export default async function EncyclopediaPage() {
  const queryClient = getQueryClient()
  const messages = (await getMessages()) as { Encyclopedia: unknown; Common: unknown }

  await prefetchEncyclopediaData(queryClient)

  return (
    <div className='relative flex w-full h-[calc(100vh-var(--header-h)-var(--footer-h))] font-sans overflow-hidden'>
      <div className='absolute inset-0 bg-black/60' />
      <div className='relative flex w-full h-full'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NextIntlClientProvider
            messages={{ Encyclopedia: messages.Encyclopedia, Common: messages.Common }}
          >
            <SideTabs />
            <EncyclopediaContainer />
          </NextIntlClientProvider>
        </HydrationBoundary>
      </div>
    </div>
  )
}
