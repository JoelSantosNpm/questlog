import { getQueryClient } from '@/shared/api/query-client'
import { prefetchCampaignDetail } from '@/views/campaigns'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignPage({ params }: PageProps) {
  const { id } = await params
  const queryClient = getQueryClient()

  const campaign = await prefetchCampaignDetail(queryClient, id)

  if (!campaign) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='min-h-[calc(100vh-8rem)] p-6 text-foreground text-center md:text-left'>
        <div className='mx-auto max-w-5xl space-y-12'>
          <div className='flex flex-wrap items-center justify-between gap-6 border-b border-stone-800 pb-6'>
            <div>
              <h1 className='font-medieval text-4xl font-bold text-amber-500'>
                Campaña: {campaign.name}
              </h1>
              <p className='mt-2 text-neutral-400'>
                ID: <span className='font-mono text-sm text-neutral-500'>{id}</span>
              </p>
            </div>
            <Link
              href='/campaigns'
              className='rounded-md border border-stone-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-stone-800 hover:text-white'
            >
              &larr; Volver a Portales
            </Link>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-emerald-400/90'>Personajes</h3>
              <p className='mt-3 text-sm text-neutral-500'>
                Aquí podrás crear héroes, modificar atributos, gestionar su inventario y habilidades
                o eliminarlos de la campaña.
              </p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  disabled
                  className='rounded bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-500/50 cursor-not-allowed border border-emerald-900/40'
                >
                  + Crear
                </button>
              </div>
            </div>

            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-red-500/90'>Monstruos</h3>
              <p className='mt-3 text-sm text-neutral-500'>
                El rincón del bestiario. Genera nuevos enemigos, ajusta sus estadísticas vitales y
                borra a aquellos que han sido derrotados.
              </p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  disabled
                  className='rounded bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-500/50 cursor-not-allowed border border-red-900/40'
                >
                  + Crear
                </button>
              </div>
            </div>

            <div className='rounded-lg border border-stone-800 bg-stone-900/40 p-6 shadow-sm'>
              <h3 className='font-medieval text-xl text-blue-400/90'>Objetos e Inventario</h3>
              <p className='mt-3 text-sm text-neutral-500'>
                Crea reliquias legendarias, modifica la magia de ciertos items o destruye artefactos
                del lore de tu historia.
              </p>
              <div className='mt-6 border-t border-stone-800/60 pt-4 flex gap-2 justify-center md:justify-start'>
                <button
                  disabled
                  className='rounded bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-500/50 cursor-not-allowed border border-blue-900/40'
                >
                  + Crear
                </button>
              </div>
            </div>
          </div>

          <div className='mt-12 rounded bg-stone-900/30 p-8 border border-stone-800 border-dashed flex flex-col items-center justify-center space-y-4 text-stone-500'>
            <span className='text-4xl'>⚒️</span>
            <p className='text-lg'>
              La interfaz de administración principal se visualizará aquí en las próximas versiones.
            </p>
            <p className='text-sm text-stone-600'>
              Próximamente: Paneles interactivos, drag-and-drop y más herramientas para el Dungeon
              Master.
            </p>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  )
}
