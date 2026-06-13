'use client'

import { useTranslations } from 'next-intl'

export function ImageTipsPanel() {
  const t = useTranslations('Encyclopedia.imageTips')

  return (
    // pt-12/pb-24 reservan espacio para la barra "Volver"/"Creando..." (top-4 z-10 en *CreationView)
    // y el botón de subir imagen (bottom de AvatarPanel), para que ninguno tape el panel
    <div className='absolute inset-0 flex items-center justify-center p-4 pt-12 pb-14'>
      <div className='max-h-full max-w-sm space-y-2 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 text-xs text-neutral-400 backdrop-blur-sm scrollbar-encyclopedia'>
        <h4 className='text-sm font-bold text-amber-500/80'>{t('heading')}</h4>
        <p>{t('noBackground')}</p>
        <p>{t('proportions')}</p>
        <p>{t('positioning')}</p>
      </div>
    </div>
  )
}
