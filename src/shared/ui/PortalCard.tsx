import Image from 'next/image'
import Link from 'next/link'

interface PortalCardProps {
  href: string
  image: string
  alt: string
  title: string
  description: string
  cta: string
  textColor?: string
}

export function PortalCard({
  href,
  image,
  alt,
  title,
  description,
  cta,
  textColor = 'text-neutral-200',
}: PortalCardProps) {
  return (
    <Link
      href={href}
      className='group relative overflow-hidden rounded-xl border border-stone-600 w-52 h-32 flex items-end p-4 transition-all hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes='208px'
        className='object-cover object-center transition-transform duration-500 group-hover:scale-105'
      />
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent' />
      <span className={`relative z-10 text-base font-bold ${textColor}`}>{cta}</span>
    </Link>
  )
}
