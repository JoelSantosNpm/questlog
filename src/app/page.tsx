import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className='flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-8 p-6 text-center text-foreground'>
      <div className='max-w-2xl space-y-6'>
        <h1 className='font-medieval text-5xl font-bold tracking-wider text-amber-500 md:text-7xl'>
          Questlog
        </h1>
        <p className='text-lg leading-relaxed text-neutral-400 md:text-2xl'>
          La plataforma definitiva para que los Dungeon Masters gestionen sus campañas de D&D con el
          poder de la piedra y el acero.
        </p>

        <p className='mx-auto max-w-xl text-neutral-500'>
          Crea tu mundo, maneja personajes, monstruos y objetos. Sumérgete en una experiencia oscura
          medieval única para organizar tus aventuras.
        </p>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row mt-8'>
        <Link
          href='/encyclopedia'
          className='rounded-md bg-stone-800 border border-stone-600 px-8 py-3 text-lg font-bold text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all hover:bg-stone-700 hover:text-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]'
        >
          Explorar Enciclopedia
        </Link>
        <Link
          href='/campaigns'
          className='rounded-md border border-stone-600 px-8 py-3 text-lg font-bold text-neutral-400 transition-all hover:bg-stone-800 hover:text-amber-400'
        >
          Ver Campañas
        </Link>
        <SignedOut>
          <SignInButton mode='modal'>
            <button className='rounded-md border border-amber-800/50 px-8 py-3 text-lg font-bold text-amber-700 transition-all hover:bg-stone-800 hover:text-amber-500 cursor-pointer'>
              Iniciar Sesión
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link
            href='/dashboard'
            className='rounded-md border border-stone-600 px-8 py-3 text-lg font-bold text-neutral-400 transition-all hover:bg-stone-800 hover:text-amber-400'
          >
            Mi Panel
          </Link>
        </SignedIn>
      </div>
    </div>
  )
}
