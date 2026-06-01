import { MysticBackground } from '@/shared/ui'
import { CampaignCreationProvider } from '@/views/campaigns'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'

export default async function CreateCampaignPage() {
  const [messages, t] = await Promise.all([
    getMessages() as Promise<{ Campaigns: unknown }>,
    getTranslations('Campaigns.creation'),
  ])
  return (
    <div className='py-5 bg-zinc-950 text-zinc-300 flex flex-col items-center justify-center font-serif antialiased relative overflow-hidden'>
      {/* Fondo místico estilo "Portal de Piedra" */}
      <MysticBackground />

      <div className='relative z-10 w-full animate-in fade-in zoom-in duration-1000'>
        <div className='text-center space-y-4'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-light tracking-widest text-zinc-100 uppercase font-serif drop-shadow-md pb-2'>
            {t('heading')}
          </h1>
          <p className='text-zinc-500 max-w-lg mx-auto italic tracking-wide'>{t('subtitle')}</p>
        </div>

        <div className='relative'>
          {/* Bordes rústicos simulados para el formulario */}
          <div className='absolute -inset-y-10 left-1/2 -translate-x-1/2 w-full max-w-4xl border-y border-zinc-800/50 pointer-events-none' />
          <div className='absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-900/10 to-zinc-950/0 pointer-events-none' />

          <NextIntlClientProvider messages={{ Campaigns: messages.Campaigns }}>
            <CampaignCreationProvider />
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
  )
}
