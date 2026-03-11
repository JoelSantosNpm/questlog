import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  await auth.protect()

  return (
    <div className='mx-auto max-w-4xl p-6 py-12 space-y-12 text-foreground'>
      <div className='space-y-4 border-b border-stone-800 pb-8'>
        <h1 className='font-medieval text-4xl text-amber-500'>Panel de Aventurero</h1>
        <p className='text-neutral-400 text-lg'>
          Bienvenido. Desde aquí puedes acceder a los diferentes salones de gestión de tus campañas
          y aventuras.
        </p>
      </div>

      <div className='grid gap-6 sm:grid-cols-2'>
        <Link
          href='/portals'
          className='group flex flex-col justify-between space-y-4 rounded-xl border border-stone-800 bg-stone-900/50 p-6 transition-colors hover:border-amber-900/50 hover:bg-stone-800/80'
        >
          <div className='space-y-2'>
            <h2 className='font-medieval text-2xl text-amber-500/90 group-hover:text-amber-400'>
              🔮 Salón de los Portales
            </h2>
            <p className='text-neutral-500'>
              Accede a tus campañas activas, entra en diferentes mundos y gestiona tus sesiones
              narrativas.
            </p>
          </div>
          <span className='self-start text-sm font-semibold tracking-wide text-amber-700 group-hover:text-amber-500'>
            Entrar al Salón &rarr;
          </span>
        </Link>

        <Link
          href='/colosseum'
          className='group flex flex-col justify-between space-y-4 rounded-xl border border-stone-800 bg-stone-900/50 p-6 transition-colors hover:border-amber-900/50 hover:bg-stone-800/80'
        >
          <div className='space-y-2'>
            <h2 className='font-medieval text-2xl text-amber-500/90 group-hover:text-amber-400'>
              ⚔️ El Coliseo
            </h2>
            <p className='text-neutral-500'>
              Enfrenta desafíos, participa en el bestiario y explora la arena de combate.
            </p>
          </div>
          <span className='self-start text-sm font-semibold tracking-wide text-amber-700 group-hover:text-amber-500'>
            Entrar a la Arena &rarr;
          </span>
        </Link>
      </div>
    </div>
  )
}
