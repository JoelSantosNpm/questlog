import { auth } from '@clerk/nextjs/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function ColosseumPage() {
  await auth.protect()
  const t = await getTranslations('Colosseum')
  const cards = [t('cards.practice'), t('cards.duel'), t('cards.tournament')]

  return (
    <div className='space-y-6 text-foreground max-w-7xl mx-auto'>
      <div className='flex flex-wrap items-center justify-between gap-4 border-b border-iron pb-4'>
        <h1 className='text-3xl font-bold text-torch'>{t('heading')}</h1>
        <Link
          href='/dashboard'
          className='rounded-md border border-stone-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-stone-800 hover:text-white'
        >
          {t('backLink')}
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Placeholder cards */}
        {cards.map((name) => (
          <div
            key={name}
            className='dungeon-panel p-6 rounded-lg min-h-50 flex flex-col items-center justify-center border border-iron hover:border-torch transition-colors bg-stone/30'
          >
            <span className='text-iron text-4xl mb-2'>⚔️</span>
            <h3 className='text-lg font-semibold text-foreground'>{name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
