import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { MysticBackground } from '@/shared/ui/MysticBackground'

export default async function NotFound() {
  const t = await getTranslations('NotFound')
  return (
    <main className='relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center overflow-hidden'>
      <MysticBackground />

      <div className='z-10 max-w-lg space-y-8 animate-in fade-in zoom-in duration-1000'>
        <div className='relative'>
          <span className='absolute inset-0 blur-2xl bg-amber-900/10 rounded-full' />
          <h1 className='relative font-medieval text-7xl md:text-8xl text-amber-600/90'>{t('code')}</h1>
          <h2 className='font-medieval text-3xl md:text-4xl text-neutral-300 tracking-wide mt-2'>
            {t('title')}
          </h2>
        </div>

        <p className='text-sm uppercase tracking-[0.4em] font-medium text-neutral-500 leading-relaxed max-w-sm mx-auto'>
          {t('description')}
        </p>

        <div className='pt-8'>
          <Link
            href='/dashboard'
            className='inline-flex items-center px-8 py-3 bg-amber-700/10 border border-amber-900/40 rounded text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 hover:text-white hover:bg-amber-800/20 hover:border-amber-700/60 transition-all duration-500'
          >
            {t('backButton')}
          </Link>
        </div>
      </div>
    </main>
  )
}
