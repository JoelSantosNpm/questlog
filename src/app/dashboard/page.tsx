import { PortalCard } from '@/shared/ui/PortalCard'
import { auth } from '@clerk/nextjs/server'
import { getTranslations } from 'next-intl/server'

export default async function DashboardPage() {
  await auth.protect()
  const t = await getTranslations('Dashboard')

  return (
    <div className='mx-auto max-w-4xl p-6 py-12 space-y-12 text-foreground'>
      <div className='space-y-4 border-b border-stone-800 pb-8'>
        <h1 className='font-medieval text-4xl text-amber-500'>{t('heading')}</h1>
        <p className='text-neutral-400 text-lg'>
          {t('description')}
        </p>
      </div>

      <div className='flex gap-6 flex-wrap'>
        <PortalCard
          href='/campaigns'
          image='/Campañas.webp'
          alt={t('imageAlts.campaigns')}
          cta={t('viewCampaigns')}
        />
      </div>
    </div>
  )
}
