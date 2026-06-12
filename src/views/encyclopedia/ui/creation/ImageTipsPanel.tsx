'use client'

import { useTranslations } from 'next-intl'

export function ImageTipsPanel() {
  const t = useTranslations('Encyclopedia.imageTips')

  return (
    <div className='absolute inset-0 flex items-center justify-center p-4'>
      <div className='max-w-sm space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 text-xs text-neutral-400 backdrop-blur-sm'>
        <h4 className='text-sm font-bold text-amber-500/80'>{t('heading')}</h4>
        <p>{t('noBackground')}</p>
        <p>{t('proportions')}</p>
        <p>{t('positioning')}</p>
      </div>
    </div>
  )
}
