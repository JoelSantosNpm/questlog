'use client'

import { useTranslations } from 'next-intl'
import { sileo } from 'sileo'

/** Toast recurrente para acciones que requieren sesión iniciada (crear, guardar, subir...). */
export function useNotifyAuthRequired() {
  const t = useTranslations('Common.auth')

  return () =>
    sileo.warning({
      title: t('requiredTitle'),
      description: t('requiredDescription'),
    })
}
