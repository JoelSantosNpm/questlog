import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { defaultLocale, locales, type Locale } from './locales'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value

  const locale: Locale =
    localeCookie && (locales as readonly string[]).includes(localeCookie)
      ? (localeCookie as Locale)
      : defaultLocale

  const messageLoaders: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
    es: () => import('../../messages/es.json'),
    en: () => import('../../messages/en.json'),
  }

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
  }
})
