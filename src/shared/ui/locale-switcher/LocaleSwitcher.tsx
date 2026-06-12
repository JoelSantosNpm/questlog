'use client'

import type { Locale } from '@/i18n/locales'
import { locales } from '@/i18n/locales'
import { cn } from '@/shared/utils/styles'
import { Check, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const setLocale = (locale: Locale) => {
    setOpen(false)
    if (locale === currentLocale) return
    setLocaleCookie(locale)
    startTransition(() => router.refresh())
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup='menu'
        aria-expanded={open}
        className='flex w-16 items-center justify-between gap-1 rounded-full border border-neutral-800 bg-transparent px-3 py-1 text-xs font-medium text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-300'
      >
        {currentLocale.toUpperCase()}
        <ChevronDown className={cn('size-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role='menu'
          className='absolute right-0 top-full z-10 mt-1 w-16 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 py-1 shadow-lg'
        >
          {locales.map((locale) => (
            <button
              key={locale}
              type='button'
              role='menuitemradio'
              aria-checked={currentLocale === locale}
              onClick={() => setLocale(locale)}
              className={cn(
                'flex w-full items-center justify-between gap-1 px-3 py-1.5 text-left text-xs font-medium transition-colors',
                currentLocale === locale
                  ? 'text-amber-400'
                  : 'text-neutral-500 hover:text-neutral-300'
              )}
            >
              {locale.toUpperCase()}
              {currentLocale === locale && <Check className='size-3' />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
