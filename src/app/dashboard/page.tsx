import { PortalCard } from '@/shared/ui/PortalCard'
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

      <div className='flex gap-6 flex-wrap'>
        <PortalCard
          href='/campaigns'
          image='/Campañas.webp'
          alt='Campañas'
          title='Salón de los Portales'
          description='Accede a tus campañas activas, entra en diferentes mundos y gestiona tus sesiones narrativas.'
          cta='Ver Campañas'
        />
      </div>
    </div>
  )
}
