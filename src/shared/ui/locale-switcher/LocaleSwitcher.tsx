'use client'

import type { Locale } from '@/i18n/locales'
import { locales } from '@/i18n/locales'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { ToggleButton } from '../ToggleButton'

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const setLocale = (locale: Locale) => {
    if (locale === currentLocale) return
    setLocaleCookie(locale)
    startTransition(() => router.refresh())
  }

  return (
    <div className='flex items-center gap-1'>
      {locales.map((locale) => (
        <ToggleButton
          key={locale}
          label={locale.toUpperCase()}
          isActive={currentLocale === locale}
          onToggle={() => setLocale(locale)}
        />
      ))}
    </div>
  )
}
