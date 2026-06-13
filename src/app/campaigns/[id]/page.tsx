import { getQueryClient } from '@/shared/api/query-client'
import { prefetchCampaignDetail } from '@/views/campaigns'
import { auth } from '@clerk/nextjs/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Questlog | Campaña',
  description: 'Gestiona los personajes, monstruos e inventario de tu campaña.',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPage({ params }: PageProps) {
  const [{ userId }, { id }, t, tCommon] = await Promise.all([
    auth(),
    params,
    getTranslations('Campaigns.detail'),
    getTranslations('Common.buttons'),
  ])
  const queryClient = getQueryClient()

  const campaign = await prefetchCampaignDetail(queryClient, id, userId ?? undefined)

  if (!campaign) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='min-h-[calc(100vh-8rem)] p-6 text-foreground text-center md:text-left'>
        <div className='mx-auto max-w-5xl space-y-12'>
          <div className='flex flex-wrap items-center justify-between gap-6 border-b border-stone-800 pb-6'>
            <div>
              <h1 className='title-medieval text-4xl font-bold'>
                {t('heading', { name: campaign.name })}
              </h1>
              <p className='mt-2 text-neutral-400'>
                {t('idLabel')} <span className='font-mono text-sm text-neutral-500'>{id}</span>
              </p>
            </div>
            <Link
              href='/campaigns'
              className='rounded-md border border-stone-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-stone-800 hover:text-white'
            >
              {t('backLink')}
            </Link>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-emerald-400/90'>
                {t('sections.characters.heading')}
              </h3>
              <p className='mt-3 text-sm text-neutral-500'>
                {t('sections.characters.description')}
              </p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  type='button'
                  disabled
                  className='rounded bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-500/50 cursor-not-allowed border border-emerald-900/40'
                >
                  {tCommon('create')}
                </button>
              </div>
            </div>

            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-red-500/90'>
                {t('sections.monsters.heading')}
              </h3>
              <p className='mt-3 text-sm text-neutral-500'>{t('sections.monsters.description')}</p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  type='button'
                  disabled
                  className='rounded bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-500/50 cursor-not-allowed border border-red-900/40'
                >
                  {tCommon('create')}
                </button>
              </div>
            </div>

            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-blue-400/90'>
                {t('sections.inventory.heading')}
              </h3>
              <p className='mt-3 text-sm text-neutral-500'>{t('sections.inventory.description')}</p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  type='button'
                  disabled
                  className='rounded bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-500/50 cursor-not-allowed border border-blue-900/40'
                >
                  {tCommon('create')}
                </button>
              </div>
            </div>
          </div>

          <div className='mt-12 rounded bg-stone-900/30 p-8 border border-stone-800 border-dashed flex flex-col items-center justify-center space-y-4 text-stone-500'>
            <span className='text-4xl'>⚒️</span>
            <p className='text-lg'>{t('comingSoon.main')}</p>
            <p className='text-sm text-stone-600'>{t('comingSoon.detail')}</p>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
