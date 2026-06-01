import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

export default async function LandingPage() {
  const t = await getTranslations('Home')
  return (
    <div className='flex min-h-[calc(100vh-8rem)] flex-col text-foreground'>
      {/* Hero: imagen con título encima */}
      <div className='relative h-[55vh] min-h-64 w-full overflow-hidden'>
        <Image
          src='/D&D_equipo_taberna.png'
          alt={t('imageAlts.adventurers')}
          fill
          priority
          sizes='100vw'
          className='object-cover object-center'
        />
        <div className='absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-neutral-950' />
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <h1
            className='title-glass text-5xl tracking-[0.15em] md:text-8xl'
            style={{ fontFamily: 'var(--font-almendra)' }}
          >
            {t('heroTitle')}
          </h1>
        </div>
      </div>

      {/* Contenido bajo la imagen */}
      <div className='flex flex-1 flex-col items-center justify-center space-y-8 p-6 text-center bg-neutral-950'>
        <div className='max-w-2xl space-y-4'>
          <p className='text-lg leading-relaxed text-neutral-300 md:text-2xl'>
            {t('heroDescription')}
          </p>
          <p className='mx-auto max-w-xl text-neutral-500'>
            {t('bodyText')}
          </p>
        </div>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <Link
            href='/encyclopedia'
            className='group relative overflow-hidden rounded-xl border border-stone-600 w-52 h-32 flex items-end p-4 transition-all hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
          >
            <Image
              src='/Encyclopedia.webp'
              alt={t('imageAlts.encyclopedia')}
              fill
              sizes='208px'
              className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />
            <span className='relative z-10 text-base font-bold text-amber-500'>
              {t('exploreEncyclopedia')}
            </span>
          </Link>
          <Link
            href='/campaigns'
            className='group relative overflow-hidden rounded-xl border border-stone-600 w-52 h-32 flex items-end p-4 transition-all hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
          >
            <Image
              src='/Campañas.webp'
              alt={t('imageAlts.campaigns')}
              fill
              sizes='208px'
              className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />
            <span className='relative z-10 text-base font-bold text-amber-500'>{t('viewCampaigns')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
